import cors from 'cors'
import express from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import { config } from './config.js'
import { pool, closePool } from './db/pool.js'
import { errorHandler, notFoundHandler } from './lib/http.js'
import { bookingsRouter } from './routes/bookings.js'
import { catalogueRouter } from './routes/catalogue.js'
import { inquiriesRouter } from './routes/inquiries.js'

const app = express()
const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1_000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.' },
})

app.disable('x-powered-by')
app.use(helmet())
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || config.corsOrigins.includes(origin)) return callback(null, true)
      return callback(new Error('Origin is not allowed by CORS.'))
    },
  })
)
app.use(express.json({ limit: '32kb' }))

app.get('/health', async (_request, response) => {
  await pool.query('SELECT 1')
  response.json({ status: 'ok' })
})

app.use('/api', catalogueRouter)
app.use('/api', bookingsRouter)
app.use('/api', writeLimiter, inquiriesRouter)

app.use(notFoundHandler)
app.use(errorHandler)

const server = app.listen(config.port, () => {
  console.info(`Royal Palace API listening on port ${config.port}`)
})

async function shutdown(signal: string) {
  console.info(`Received ${signal}; shutting down.`)
  server.close(async () => {
    await closePool()
    process.exit(0)
  })
}

process.once('SIGINT', () => void shutdown('SIGINT'))
process.once('SIGTERM', () => void shutdown('SIGTERM'))
