import type { NextFunction, Request, Response } from 'express'
import { ZodError, type ZodType } from 'zod'

export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly details?: unknown
  ) {
    super(message)
  }
}

export function parseInput<T>(schema: ZodType<T>, input: unknown): T {
  const result = schema.safeParse(input)
  if (!result.success) {
    throw new ApiError(
      400,
      'Validation failed.',
      result.error.issues.map(({ path, message }) => ({ field: path.join('.'), message }))
    )
  }
  return result.data
}

export function notFoundHandler(_request: Request, _response: Response, next: NextFunction) {
  next(new ApiError(404, 'Route not found.'))
}

export function errorHandler(error: unknown, _request: Request, response: Response, _next: NextFunction) {
  if (error instanceof ApiError) {
    return response.status(error.statusCode).json({ error: error.message, details: error.details })
  }

  if (error instanceof ZodError) {
    return response.status(400).json({ error: 'Validation failed.' })
  }

  if (error instanceof SyntaxError && 'body' in error) {
    return response.status(400).json({ error: 'Malformed JSON body.' })
  }

  console.error('Unhandled API error', error)
  return response.status(500).json({ error: 'An unexpected server error occurred.' })
}
