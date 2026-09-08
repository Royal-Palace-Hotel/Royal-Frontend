import { randomUUID } from 'node:crypto'
import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { pool } from '../db/pool.js'
import { ApiError, parseInput } from '../lib/http.js'
import { availabilitySchema, bookingSchema } from '../lib/schemas.js'

export const bookingsRouter = Router()
const bookingLimiter = rateLimit({
  windowMs: 15 * 60 * 1_000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many booking requests. Please try again later.' },
})

bookingsRouter.get('/availability', async (request, response) => {
  const search = parseInput(availabilitySchema, request.query)
  const requiredGuestsPerRoom = Math.ceil((search.adults + (search.children ?? 0)) / search.rooms)

  const { rows } = await pool.query(
    `
      SELECT
        room.id,
        room.slug,
        room.translation_key AS "translationKey",
        room.base_price::float8 AS "nightlyRate",
        room.currency,
        room.max_guests AS "maxGuests",
        room.images,
        room.total_inventory - COALESCE(occupied.quantity, 0) AS "availableQuantity"
      FROM room_types AS room
      LEFT JOIN (
        SELECT booking_room.room_type_id, SUM(booking_room.quantity)::int AS quantity
        FROM booking_rooms AS booking_room
        JOIN bookings AS booking ON booking.id = booking_room.booking_id
        WHERE booking.status IN ('pending', 'confirmed')
          AND booking.check_in < $2::date
          AND booking.check_out > $1::date
        GROUP BY booking_room.room_type_id
      ) AS occupied ON occupied.room_type_id = room.id
      WHERE room.active = TRUE
        AND room.max_guests >= $3
        AND room.total_inventory > COALESCE(occupied.quantity, 0)
      ORDER BY room.base_price ASC
    `,
    [search.checkIn, search.checkOut, requiredGuestsPerRoom]
  )

  const totalAvailableRooms = rows.reduce((total, room) => total + room.availableQuantity, 0)
  response.json({
    search,
    available: totalAvailableRooms >= search.rooms,
    rooms: rows,
  })
})

bookingsRouter.post('/', bookingLimiter, async (request, response) => {
  const booking = parseInput(bookingSchema, request.body)
  const client = await pool.connect()
  const bookingId = randomUUID()
  const reference = `RP-${randomUUID().replaceAll('-', '').toUpperCase()}`
  const totalRooms = booking.rooms.reduce((total, room) => total + room.quantity, 0)
  const nights = Math.round(
    (Date.parse(`${booking.checkOut}T00:00:00Z`) - Date.parse(`${booking.checkIn}T00:00:00Z`)) / 86_400_000
  )

  try {
    await client.query('BEGIN')

    const roomTypeIds = booking.rooms.map((room) => room.roomTypeId)
    const { rows: roomTypes } = await client.query<{
      id: string
      basePrice: number
      currency: string
      maxGuests: number
      totalInventory: number
    }>(
      `
        SELECT
          id,
          base_price::float8 AS "basePrice",
          currency,
          max_guests AS "maxGuests",
          total_inventory AS "totalInventory"
        FROM room_types
        WHERE id = ANY($1::text[]) AND active = TRUE
        FOR UPDATE
      `,
      [roomTypeIds]
    )

    if (roomTypes.length !== roomTypeIds.length) {
      throw new ApiError(400, 'One or more selected room types are unavailable.')
    }

    const capacity = roomTypes.reduce((total, roomType) => {
      const selected = booking.rooms.find((room) => room.roomTypeId === roomType.id)
      return total + roomType.maxGuests * (selected?.quantity ?? 0)
    }, 0)
    if (capacity < booking.adults + (booking.children ?? 0)) {
      throw new ApiError(400, 'The selected rooms cannot accommodate all guests.')
    }

    const { rows: occupiedRooms } = await client.query<{ roomTypeId: string; quantity: number }>(
      `
        SELECT booking_room.room_type_id AS "roomTypeId", SUM(booking_room.quantity)::int AS quantity
        FROM booking_rooms AS booking_room
        JOIN bookings AS existing_booking ON existing_booking.id = booking_room.booking_id
        WHERE booking_room.room_type_id = ANY($1::text[])
          AND existing_booking.status IN ('pending', 'confirmed')
          AND existing_booking.check_in < $3::date
          AND existing_booking.check_out > $2::date
        GROUP BY booking_room.room_type_id
      `,
      [roomTypeIds, booking.checkIn, booking.checkOut]
    )
    const occupiedByRoomType = new Map(occupiedRooms.map((room) => [room.roomTypeId, room.quantity]))

    for (const selectedRoom of booking.rooms) {
      const roomType = roomTypes.find((room) => room.id === selectedRoom.roomTypeId)
      if (!roomType || selectedRoom.quantity + (occupiedByRoomType.get(roomType.id) ?? 0) > roomType.totalInventory) {
        throw new ApiError(409, 'The selected room is no longer available for these dates.')
      }
    }

    await client.query(
      `
        INSERT INTO bookings (
          id, reference, check_in, check_out, adults, children, guest_name, guest_email, guest_phone, special_requests
        )
        VALUES ($1, $2, $3::date, $4::date, $5, $6, $7, $8, $9, $10)
      `,
      [
        bookingId,
        reference,
        booking.checkIn,
        booking.checkOut,
        booking.adults,
        booking.children ?? 0,
        booking.guestName,
        booking.guestEmail,
        booking.guestPhone ?? null,
        booking.specialRequests ?? null,
      ]
    )

    let totalPrice = 0
    for (const selectedRoom of booking.rooms) {
      const roomType = roomTypes.find((room) => room.id === selectedRoom.roomTypeId)
      if (!roomType) throw new ApiError(400, 'Selected room type was not found.')

      totalPrice += roomType.basePrice * selectedRoom.quantity * nights
      await client.query(
        `
          INSERT INTO booking_rooms (booking_id, room_type_id, quantity, nightly_rate, currency)
          VALUES ($1, $2, $3, $4, $5)
        `,
        [bookingId, roomType.id, selectedRoom.quantity, roomType.basePrice, roomType.currency]
      )
    }

    await client.query('COMMIT')
    response.status(201).json({
      booking: {
        reference,
        status: 'pending',
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        nights,
        roomCount: totalRooms,
        totalPrice,
        currency: roomTypes[0].currency,
      },
    })
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
})
