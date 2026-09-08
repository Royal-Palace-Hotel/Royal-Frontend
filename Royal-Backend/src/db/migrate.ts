import { readdir, readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { pool, closePool } from './pool.js'

const migrationsDirectory = fileURLToPath(new URL('../../migrations/', import.meta.url))

async function runMigrations() {
  const client = await pool.connect()

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        name TEXT PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `)

    const migrationFiles = (await readdir(migrationsDirectory))
      .filter((file) => /^\d+_.+\.sql$/.test(file))
      .sort((a, b) => a.localeCompare(b))

    for (const name of migrationFiles) {
      const applied = await client.query('SELECT 1 FROM schema_migrations WHERE name = $1', [name])
      if (applied.rowCount) continue

      const sql = await readFile(`${migrationsDirectory}/${name}`, 'utf8')
      await client.query('BEGIN')
      try {
        await client.query(sql)
        await client.query('INSERT INTO schema_migrations (name) VALUES ($1)', [name])
        await client.query('COMMIT')
        console.info(`Applied migration ${name}`)
      } catch (error) {
        await client.query('ROLLBACK')
        throw error
      }
    }
  } finally {
    client.release()
  }
}

runMigrations()
  .then(() => console.info('Database migrations are up to date.'))
  .catch((error) => {
    console.error('Migration failed', error)
    process.exitCode = 1
  })
  .finally(closePool)
