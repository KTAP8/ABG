import { Router } from 'express'
import { db } from '../lib/db'
import { drops, products, product_variants, product_images } from '../lib/schema'
import { eq } from 'drizzle-orm'

const router = Router()

// GET /api/drops - list upcoming + active drops
router.get('/', async (_req, res, next) => {
  try {
    const result = await db
      .select()
      .from(drops)
      .where(eq(drops.is_active, true))
      .orderBy(drops.drop_at)

    res.json(result)
  } catch (error) {
    next(error)
  }
})

// GET /api/drops/:slug - drop detail + products + stock
router.get('/:slug', async (req, res, next) => {
  try {
    const drop = await db
      .select()
      .from(drops)
      .where(eq(drops.slug, req.params.slug))
      .limit(1)

    if (!drop.length) {
      return res.status(404).json({ error: 'Drop not found' })
    }

    const dropData = drop[0]

    const productsData = await db
      .select()
      .from(products)
      .where(eq(products.drop_id, dropData.id))

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

    res.json({
      ...dropData,
      products: productsWithDetails,
    })
  } catch (error) {
    next(error)
  }
})

export default router
