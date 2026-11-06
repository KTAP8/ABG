import { Hono } from 'hono'
import { and, asc, eq, inArray } from 'drizzle-orm'
import { drops, products, product_variants, product_images, product_size_chart } from '../lib/schema'
import type { Db } from '../lib/db'
import type { Env } from '../types'

const router = new Hono<Env>()

async function withProductDetails(db: Db, productsData: (typeof products.$inferSelect)[]) {
  if (productsData.length === 0) return []
  const ids = productsData.map((product) => product.id)

  const [variantRows, imageRows, chartRows] = await Promise.all([
    db.select().from(product_variants).where(inArray(product_variants.product_id, ids)),
    db
      .select()
      .from(product_images)
      .where(inArray(product_images.product_id, ids))
      .orderBy(asc(product_images.position)),
    db
      .select()
      .from(product_size_chart)
      .where(inArray(product_size_chart.product_id, ids))
      .orderBy(asc(product_size_chart.position)),
  ])

  const variantsByProduct = new Map<string, typeof variantRows>()
  for (const variant of variantRows) {
    if (!variant.product_id) continue
    const list = variantsByProduct.get(variant.product_id) ?? []
    list.push(variant)
    variantsByProduct.set(variant.product_id, list)
  }

  const imagesByProduct = new Map<string, typeof imageRows>()
  for (const image of imageRows) {
    if (!image.product_id) continue
    const list = imagesByProduct.get(image.product_id) ?? []
    list.push(image)
    imagesByProduct.set(image.product_id, list)
  }

  const chartByProduct = new Map<string, typeof chartRows>()
  for (const row of chartRows) {
    if (!row.product_id) continue
    const list = chartByProduct.get(row.product_id) ?? []
    list.push(row)
    chartByProduct.set(row.product_id, list)
  }

  return productsData.map((product) => ({
    ...product,
    variants: variantsByProduct.get(product.id) ?? [],
    images: imagesByProduct.get(product.id) ?? [],
    size_chart: chartByProduct.get(product.id) ?? [],
  }))
}

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

      return {
        ...drop,
        products: await withProductDetails(db, productsData),
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

  return c.json({
    ...dropData,
    products: await withProductDetails(db, productsData),
  })
})

export default router
