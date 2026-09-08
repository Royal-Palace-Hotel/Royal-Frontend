function getRequiredEnvironmentVariable(name: string): string {
  const value = process.env[name]?.trim()
  if (!value) throw new Error(`${name} must be set before starting the API.`)
  return value
}

function getPort(): number {
  const parsed = Number.parseInt(process.env.PORT ?? '3001', 10)
  return Number.isInteger(parsed) && parsed > 0 && parsed <= 65535 ? parsed : 3001
}

export const config = {
  get databaseUrl() {
    return getRequiredEnvironmentVariable('DATABASE_URL')
  },
  port: getPort(),
  corsOrigins: (process.env.CORS_ORIGIN ?? 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
}
