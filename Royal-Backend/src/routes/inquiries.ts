import { randomUUID } from 'node:crypto'
import { Router } from 'express'
import { pool } from '../db/pool.js'
import { parseInput } from '../lib/http.js'
import { contactSchema, eventInquirySchema } from '../lib/schemas.js'

export const inquiriesRouter = Router()

inquiriesRouter.post('/contact', async (request, response) => {
  const contact = parseInput(contactSchema, request.body)
  const id = randomUUID()

  await pool.query(
    `
      INSERT INTO contact_messages (id, name, email, phone, subject, message)
      VALUES ($1, $2, $3, $4, $5, $6)
    `,
    [id, contact.name, contact.email, contact.phone ?? null, contact.subject ?? null, contact.message]
  )

  response.status(201).json({ inquiry: { id, status: 'new' } })
})

inquiriesRouter.post('/event-inquiries', async (request, response) => {
  const inquiry = parseInput(eventInquirySchema, request.body)
  const id = randomUUID()

  await pool.query(
    `
      INSERT INTO event_inquiries (id, name, email, phone, event_date, guest_count, message)
      VALUES ($1, $2, $3, $4, $5::date, $6, $7)
    `,
    [
      id,
      inquiry.name,
      inquiry.email,
      inquiry.phone ?? null,
      inquiry.eventDate ?? null,
      inquiry.guestCount ?? null,
      inquiry.message,
    ]
  )

  response.status(201).json({ inquiry: { id, status: 'new' } })
})
