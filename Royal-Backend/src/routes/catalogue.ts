import { Router } from 'express'
import { pool } from '../db/pool.js'

export const catalogueRouter = Router()

catalogueRouter.get('/room-types', async (_request, response) => {
  const { rows } = await pool.query(`
    SELECT
      id,
      slug,
      translation_key AS "translationKey",
      base_price::float8 AS price,
      currency,
      images,
      size_sqm AS "sizeSqm",
      max_guests AS "maxGuests",
      amenities,
      total_inventory AS "totalInventory"
    FROM room_types
    WHERE active = TRUE
    ORDER BY base_price ASC
  `)
  response.json({ rooms: rows })
})

catalogueRouter.get('/menu', async (_request, response) => {
  const { rows } = await pool.query(`
    SELECT
      section.id AS "sectionId",
      section.title_fr AS "titleFr",
      section.title_en AS "titleEn",
      item.id,
      item.name_fr AS "nameFr",
      item.name_en AS "nameEn",
      item.description_fr AS "descriptionFr",
      item.description_en AS "descriptionEn",
      item.price::float8 AS price,
      item.currency
    FROM menu_sections AS section
    JOIN menu_items AS item ON item.section_id = section.id
    WHERE item.active = TRUE
    ORDER BY section.sort_order, item.sort_order
  `)

  const sections = rows.reduce<Array<{ id: string; titleFr: string; titleEn: string; items: unknown[] }>>((result, row) => {
    let section = result.at(-1)
    if (!section || section.id !== row.sectionId) {
      section = { id: row.sectionId, titleFr: row.titleFr, titleEn: row.titleEn, items: [] }
      result.push(section)
    }
    section.items.push({
      id: row.id,
      nameFr: row.nameFr,
      nameEn: row.nameEn,
      descriptionFr: row.descriptionFr,
      descriptionEn: row.descriptionEn,
      price: row.price,
      currency: row.currency,
    })
    return result
  }, [])

  response.json({ sections })
})

catalogueRouter.get('/spa-treatments', async (_request, response) => {
  const { rows } = await pool.query(`
    SELECT
      id,
      translation_key AS "translationKey",
      duration_key AS "durationKey",
      duration_minutes AS "durationMinutes",
      price::float8 AS price,
      currency
    FROM spa_treatments
    WHERE active = TRUE
    ORDER BY id
  `)
  response.json({ treatments: rows })
})

catalogueRouter.get('/event-venues', async (_request, response) => {
  const { rows } = await pool.query(`
    SELECT
      id,
      translation_key AS "translationKey",
      image_path AS "imagePath",
      capacity
    FROM event_venues
    WHERE active = TRUE
    ORDER BY capacity DESC
  `)
  response.json({ venues: rows })
})
