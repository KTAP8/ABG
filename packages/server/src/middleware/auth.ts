import { createMiddleware } from 'hono/factory'
import { AppError } from './errorHandler'
import type { Env } from '../types'

export const requireAdmin = createMiddleware<Env>(async (_c, _next) => {
  throw new AppError(401, 'Admin authentication not yet implemented')
})
