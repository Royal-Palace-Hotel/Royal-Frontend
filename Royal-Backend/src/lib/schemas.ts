import { z } from 'zod'

const datePattern = /^\d{4}-\d{2}-\d{2}$/

export const dateSchema = z.string().regex(datePattern, 'Use YYYY-MM-DD.').refine((value) => {
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
}, 'Use a valid calendar date.')

export const availabilitySchema = z
  .object({
    checkIn: dateSchema,
    checkOut: dateSchema,
    rooms: z.coerce.number().int().min(1).max(10),
    adults: z.coerce.number().int().min(1).max(20),
    children: z.coerce.number().int().min(0).max(20).default(0),
  })
  .refine(({ checkIn, checkOut }) => checkOut > checkIn, {
    message: 'Check-out must be after check-in.',
    path: ['checkOut'],
  })

const optionalText = (maximum: number) =>
  z.string().trim().max(maximum).optional().transform((value) => value || undefined)

export const bookingSchema = z
  .object({
    checkIn: dateSchema,
    checkOut: dateSchema,
    adults: z.number().int().min(1).max(20),
    children: z.number().int().min(0).max(20).default(0),
    guestName: z.string().trim().min(2).max(160),
    guestEmail: z.string().trim().email().max(254),
    guestPhone: optionalText(50),
    specialRequests: optionalText(2_000),
    rooms: z
      .array(
        z.object({
          roomTypeId: z.string().regex(/^[a-z0-9-]+$/).max(60),
          quantity: z.number().int().min(1).max(10),
        })
      )
      .min(1)
      .max(4),
  })
  .refine(({ checkIn, checkOut }) => checkOut > checkIn, {
    message: 'Check-out must be after check-in.',
    path: ['checkOut'],
  })
  .refine(({ rooms }) => new Set(rooms.map((room) => room.roomTypeId)).size === rooms.length, {
    message: 'Each room type can only be selected once.',
    path: ['rooms'],
  })
  .refine(({ rooms }) => rooms.reduce((total, room) => total + room.quantity, 0) <= 10, {
    message: 'A maximum of 10 rooms may be requested.',
    path: ['rooms'],
  })

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(160),
  email: z.string().trim().email().max(254),
  phone: optionalText(50),
  subject: optionalText(200),
  message: z.string().trim().min(1).max(5_000),
})

export const eventInquirySchema = z.object({
  name: z.string().trim().min(2).max(160),
  email: z.string().trim().email().max(254),
  phone: optionalText(50),
  eventDate: dateSchema.optional(),
  guestCount: z.number().int().min(1).max(1_000).optional(),
  message: z.string().trim().min(1).max(5_000),
})
