import { Hono } from 'hono'
import type { ContentfulStatusCode } from 'hono/utils/http-status'
import { cors } from 'hono/cors'
import { dbMiddleware } from './middleware/db'
import { AppError } from './middleware/errorHandler'
import dropsRouter from './routes/drops'
import productsRouter from './routes/products'
import waitlistRouter from './routes/waitlist'
import adminRouter from './routes/admin/index'
import type { Env } from './types'

const app = new Hono<Env>()

app.use('*', async (c, next) => {
  const corsMiddleware = cors({
    origin: (origin) => {
      if (!origin) return c.env.WEB_URL
      if (origin === c.env.WEB_URL) return origin
      // Allow Cloudflare Pages preview deployments (e.g. d8c1d4ed.abg-web.pages.dev)
      if (origin.endsWith('.abg-web.pages.dev')) return origin
      return c.env.WEB_URL
    },
    credentials: true,
  })
  return corsMiddleware(c, next)
})

app.use('*', dbMiddleware)

app.route('/api/drops', dropsRouter)
app.route('/api/products', productsRouter)
app.route('/api/waitlist', waitlistRouter)
app.route('/api/admin', adminRouter)

app.onError((err, c) => {
  console.error('Error:', err)

  if (err instanceof AppError) {
    return c.json({ error: err.message }, err.statusCode as ContentfulStatusCode)
  }

  return c.json({ error: 'Internal server error' }, 500)
})

export default app
