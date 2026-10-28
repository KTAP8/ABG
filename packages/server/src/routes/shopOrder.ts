import { Hono } from 'hono'
import { z } from 'zod'
import { sql } from 'drizzle-orm'
import { AppError } from '../middleware/errorHandler'
import type { Env } from '../types'

const LOCAL_WEB_URL = 'http://localhost:5173'

const bodySchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string().uuid(),
        featured: z.boolean(),
      }),
    )
    .min(1),
})

const router = new Hono<Env>()

router.put('/', async (c) => {
  if (c.env.WEB_URL !== LOCAL_WEB_URL) {
    throw new AppError(404, 'not_found')
  }

  const body = await c.req.json().catch(() => null)
  const parsed = bodySchema.safeParse(body)
  if (!parsed.success) throw new AppError(400, 'invalid_order')

  const items = parsed.data.items
  if (new Set(items.map((item) => item.id)).size !== items.length) {
    throw new AppError(400, 'invalid_order')
  }

  const values = sql.join(
    items.map(
      (item, index) => sql`(${item.id}::uuid, ${index}::integer, ${item.featured}::boolean)`,
    ),
    sql`, `,
  )

  await c.get('db').execute(sql`
    UPDATE products AS p
    SET shop_position = data.slot,
        shop_featured = data.featured
    FROM (VALUES ${values}) AS data(id, slot, featured)
    WHERE p.id = data.id
  `)

  return c.json({ ok: true })
})

export default router
