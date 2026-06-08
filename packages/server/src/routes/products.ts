import { Router, type Router as ExpressRouter } from 'express'
import { db } from '../lib/db'
import { products, product_variants, product_images } from '../lib/schema'
import { eq } from 'drizzle-orm'

const router: ExpressRouter = Router()

// GET /api/products/:slug - product detail + variants + images
router.get('/:slug', async (req, res, next) => {
  try {
    const product = await db
      .select()
      .from(products)
      .where(eq(products.slug, req.params.slug))
      .limit(1)

    if (!product.length) {
      return res.status(404).json({ error: 'Product not found' })
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

    res.json({
      ...productData,
      variants,
      images,
    })
  } catch (error) {
    next(error)
  }
})

export default router
