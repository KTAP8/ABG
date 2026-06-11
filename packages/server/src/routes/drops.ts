import { Router, type Router as ExpressRouter } from 'express'
import { db } from '../lib/db'
import { drops, products, product_variants, product_images } from '../lib/schema'
import { eq, and } from 'drizzle-orm'

const router: ExpressRouter = Router()

// GET /api/drops - list upcoming + active drops with products
// Query params: ?category=tops&gender=women
router.get('/', async (req, res, next) => {
  try {
    const { category, gender } = req.query

    const result = await db
      .select()
      .from(drops)
      .where(eq(drops.is_active, true))
      .orderBy(drops.drop_at)

    const dropsWithProducts = await Promise.all(
      result.map(async (drop) => {
        let productsQuery = db
          .select()
          .from(products)
          .where(eq(products.drop_id, drop.id))

        // Apply filters if provided
        const conditions = [eq(products.drop_id, drop.id)]
        if (category) {
          conditions.push(eq(products.category, category as string))
        }
        if (gender) {
          conditions.push(eq(products.gender, gender as string))
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

    res.json(dropsWithProducts)
  } catch (error) {
    next(error)
  }
})

// GET /api/drops/:slug - drop detail + products + stock
// Query params: ?category=tops&gender=women
router.get('/:slug', async (req, res, next) => {
  try {
    const { category, gender } = req.query

    const drop = await db
      .select()
      .from(drops)
      .where(eq(drops.slug, req.params.slug))
      .limit(1)

    if (!drop.length) {
      return res.status(404).json({ error: 'Drop not found' })
    }

    const dropData = drop[0]

    const conditions = [eq(products.drop_id, dropData.id)]
    if (category) {
      conditions.push(eq(products.category, category as string))
    }
    if (gender) {
      conditions.push(eq(products.gender, gender as string))
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

    res.json({
      ...dropData,
      products: productsWithDetails,
    })
  } catch (error) {
    next(error)
  }
})

export default router
