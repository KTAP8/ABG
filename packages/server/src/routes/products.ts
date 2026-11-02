import { Hono } from 'hono'
import {
  products,
  product_variants,
  product_images,
  product_categories,
  product_specs,
  product_size_chart,
} from '../lib/schema'
import { asc, eq } from 'drizzle-orm'
import type { Env } from '../types'

const router = new Hono<Env>()

router.get('/categories/list', async (c) => {
  const db = c.get('db')

  const categories = await db
    .select()
    .from(product_categories)
    .orderBy(product_categories.name)

  return c.json(categories)
})

router.get('/:slug', async (c) => {
  const db = c.get('db')
  const slug = c.req.param('slug')

  const product = await db
    .select()
    .from(products)
    .where(eq(products.slug, slug))
    .limit(1)

  if (!product.length) {
    return c.json({ error: 'Product not found' }, 404)
  }

  const productData = product[0]

  const variants = await db
    .select()
    .from(product_variants)
    .where(eq(product_variants.product_id, productData.id))

  const images = await db
    .select()
    .from(product_images)
    .where(eq(product_images.product_id, productData.id))
    .orderBy(product_images.position)

  const specs = await db
    .select()
    .from(product_specs)
    .where(eq(product_specs.product_id, productData.id))
    .orderBy(product_specs.position)

  const size_chart = await db
    .select()
    .from(product_size_chart)
    .where(eq(product_size_chart.product_id, productData.id))
    .orderBy(asc(product_size_chart.position))

  return c.json({
    ...productData,
    variants,
    images,
    specs,
    size_chart,
  })
})

export default router
