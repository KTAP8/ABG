import { createMiddleware } from 'hono/factory'
import { createDb } from '../lib/db'
import type { Env } from '../types'

export const dbMiddleware = createMiddleware<Env>(async (c, next) => {
  c.set('db', createDb(c.env.DATABASE_URL))
  await next()
})
