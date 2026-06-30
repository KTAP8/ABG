import { Hono } from 'hono'
import { drops, products, product_variants, product_images } from '../lib/schema'
import { eq, and } from 'drizzle-orm'
import type { Env } from '../types'

const router = new Hono<Env>()

router.get('/', async (c) => {
  const db = c.get('db')
  const category = c.req.query('category')
  const gender = c.req.query('gender')

  const result = await db
    .select()
    .from(drops)
    .where(eq(drops.is_active, true))
    .orderBy(drops.drop_at)

  const dropsWithProducts = await Promise.all(
    result.map(async (drop) => {
      const conditions = [eq(products.drop_id, drop.id)]
      if (category) {
        conditions.push(eq(products.category, category))
      }
      if (gender) {
        conditions.push(eq(products.gender, gender))
      }

      const productsData = await db
        .select()
        .from(products)
        .where(and(...conditions))

      const productsWithDetails = await Promise.all(
        productsData.map(async (product) => {
          const variants = await db
            .select()
            .from(product_variants)
            .where(eq(product_variants.product_id, product.id))

          const images = await db
            .select()
            .from(product_images)
            .where(eq(product_images.product_id, product.id))
            .orderBy(product_images.position)

          return {
            ...product,
            variants,
            images,
          }
        }),
      )

      return {
        ...drop,
        products: productsWithDetails,
      }
    }),
  )

  return c.json(dropsWithProducts)
})

router.get('/:slug', async (c) => {
  const db = c.get('db')
  const category = c.req.query('category')
  const gender = c.req.query('gender')
  const slug = c.req.param('slug')

  const drop = await db
    .select()
    .from(drops)
    .where(eq(drops.slug, slug))
    .limit(1)

  if (!drop.length) {
    return c.json({ error: 'Drop not found' }, 404)
  }

  const dropData = drop[0]

  const conditions = [eq(products.drop_id, dropData.id)]
  if (category) {
    conditions.push(eq(products.category, category))
  }
  if (gender) {
    conditions.push(eq(products.gender, gender))
  }

  const productsData = await db
    .select()
    .from(products)
    .where(and(...conditions))

  const productsWithDetails = await Promise.all(
    productsData.map(async (product) => {
      const variants = await db
        .select()
        .from(product_variants)
        .where(eq(product_variants.product_id, product.id))

      const images = await db
        .select()
        .from(product_images)
        .where(eq(product_images.product_id, product.id))
        .orderBy(product_images.position)

      return {
        ...product,
        variants,
        images,
      }
    }),
  )

  return c.json({
    ...dropData,
    products: productsWithDetails,
  })
})

export default router
