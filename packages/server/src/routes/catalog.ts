import { Hono } from 'hono'
import { z } from 'zod'
import { asc, eq, sql } from 'drizzle-orm'
import { AppError } from '../middleware/errorHandler'
import {
  drops,
  product_images,
  product_specs,
  product_variants,
  products,
} from '../lib/schema'
import type { Db } from '../lib/db'
import type { Env } from '../types'

const LOCAL_WEB_URL = 'http://localhost:5173'

const optionalText = z.string().trim().max(8000).nullable()

const dropSchema = z.object({
  kind: z.literal('drop'),
  id: z.string().uuid(),
  name: z.string().trim().min(1).max(200),
  name_th: optionalText,
  description: optionalText,
  description_th: optionalText,
  drop_at: z.string().refine((value) => !Number.isNaN(Date.parse(value)), 'invalid_date'),
  is_active: z.boolean(),
})

const imageSchema = z.object({
  id: z.string().uuid().optional(),
  url: z.string().trim().url().max(2000),
  alt_text: z.string().trim().max(300).nullable().optional(),
})

const productSchema = z.object({
  kind: z.literal('product'),
  id: z.string().uuid(),
  name: z.string().trim().min(1).max(200),
  name_th: optionalText,
  description: optionalText,
  description_th: optionalText,
  price: z.number().int().min(0).max(1_000_000),
  category: z.string().trim().min(1).max(40),
  gender: z.enum(['men', 'women', 'unisex']),
  is_active: z.boolean(),
  drop_id: z.string().uuid().nullable(),
  variants: z.array(z.object({ id: z.string().uuid(), stock: z.number().int().min(0).max(100_000) })),
  images: z.array(imageSchema),
})

const bodySchema = z.discriminatedUnion('kind', [dropSchema, productSchema])

function blankToNull(value: string | null | undefined) {
  const trimmed = value?.trim() ?? ''
  return trimmed ? trimmed : null
}

function requireLocal(webUrl: string) {
  if (webUrl !== LOCAL_WEB_URL) throw new AppError(404, 'not_found')
}

function uniqueIds(ids: string[]) {
  return new Set(ids).size === ids.length
}

async function loadCatalog(db: Db) {
  const dropRows = await db.select().from(drops).orderBy(asc(drops.drop_at))
  const productRows = await db.select().from(products).orderBy(asc(products.name))
  const variantRows = await db.select().from(product_variants)
  const imageRows = await db
    .select()
    .from(product_images)
    .orderBy(asc(product_images.position))
  const specRows = await db.select().from(product_specs).orderBy(asc(product_specs.position))

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
  const specsByProduct = new Map<string, typeof specRows>()
  for (const spec of specRows) {
    if (!spec.product_id) continue
    const list = specsByProduct.get(spec.product_id) ?? []
    list.push(spec)
    specsByProduct.set(spec.product_id, list)
  }

  const withDetails = productRows.map((product) => ({
    ...product,
    variants: variantsByProduct.get(product.id) ?? [],
    images: imagesByProduct.get(product.id) ?? [],
    specs: specsByProduct.get(product.id) ?? [],
  }))

  const dropIds = new Set(dropRows.map((drop) => drop.id))
  const byDrop = new Map<string, typeof withDetails>()
  const loose = []
  for (const product of withDetails) {
    if (product.drop_id && dropIds.has(product.drop_id)) {
      const list = byDrop.get(product.drop_id) ?? []
      list.push(product)
      byDrop.set(product.drop_id, list)
    } else {
      loose.push(product)
    }
  }

  return {
    drops: dropRows.map((drop) => ({
      ...drop,
      products: byDrop.get(drop.id) ?? [],
    })),
    loose,
  }
}

async function loadProduct(db: Db, productId: string) {
  const catalog = await loadCatalog(db)
  for (const drop of catalog.drops) {
    const product = drop.products.find((item) => item.id === productId)
    if (product) return product
  }
  return catalog.loose.find((item) => item.id === productId) ?? null
}

const router = new Hono<Env>()

router.get('/', async (c) => {
  requireLocal(c.env.WEB_URL)
  return c.json(await loadCatalog(c.get('db')))
})

router.patch('/', async (c) => {
  requireLocal(c.env.WEB_URL)
  const body = await c.req.json().catch(() => null)
  const parsed = bodySchema.safeParse(body)
  if (!parsed.success) throw new AppError(400, 'invalid_catalog')

  const db = c.get('db')
  const data = parsed.data

  if (data.kind === 'drop') {
    const existing = await db.select({ id: drops.id }).from(drops).where(eq(drops.id, data.id)).limit(1)
    if (!existing.length) throw new AppError(400, 'invalid_catalog')

    await db
      .update(drops)
      .set({
        name: data.name,
        name_th: blankToNull(data.name_th),
        description: blankToNull(data.description),
        description_th: blankToNull(data.description_th),
        drop_at: new Date(data.drop_at),
        is_active: data.is_active,
      })
      .where(eq(drops.id, data.id))

    const [updated] = await db.select().from(drops).where(eq(drops.id, data.id)).limit(1)
    return c.json({ ok: true, drop: updated })
  }

  const existing = await db
    .select({ id: products.id })
    .from(products)
    .where(eq(products.id, data.id))
    .limit(1)
  if (!existing.length) throw new AppError(400, 'invalid_catalog')

  if (data.drop_id) {
    const drop = await db.select({ id: drops.id }).from(drops).where(eq(drops.id, data.drop_id)).limit(1)
    if (!drop.length) throw new AppError(400, 'invalid_catalog')
  }

  if (!uniqueIds(data.variants.map((variant) => variant.id))) {
    throw new AppError(400, 'invalid_catalog')
  }
  const imageIds = data.images.flatMap((image) => (image.id ? [image.id] : []))
  if (!uniqueIds(imageIds)) throw new AppError(400, 'invalid_catalog')

  const ownedVariants = await db
    .select({ id: product_variants.id })
    .from(product_variants)
    .where(eq(product_variants.product_id, data.id))
  const variantIds = new Set(ownedVariants.map((variant) => variant.id))
  if (data.variants.some((variant) => !variantIds.has(variant.id))) {
    throw new AppError(400, 'invalid_catalog')
  }

  const ownedImages = await db
    .select({ id: product_images.id })
    .from(product_images)
    .where(eq(product_images.product_id, data.id))
  const knownImageIds = new Set(ownedImages.map((image) => image.id))
  if (imageIds.some((id) => !knownImageIds.has(id))) {
    throw new AppError(400, 'invalid_catalog')
  }

  await db
    .update(products)
    .set({
      name: data.name,
      name_th: blankToNull(data.name_th),
      description: blankToNull(data.description),
      description_th: blankToNull(data.description_th),
      price: data.price,
      category: data.category,
      gender: data.gender,
      is_active: data.is_active,
      drop_id: data.drop_id,
    })
    .where(eq(products.id, data.id))

  if (data.variants.length) {
    const values = sql.join(
      data.variants.map((variant) => sql`(${variant.id}::uuid, ${variant.stock}::integer)`),
      sql`, `,
    )
    await db.execute(sql`
      UPDATE product_variants AS v
      SET stock = data.stock
      FROM (VALUES ${values}) AS data(id, stock)
      WHERE v.id = data.id
        AND v.product_id = ${data.id}::uuid
    `)
  }

  const existingImages = data.images.flatMap((image, index) =>
    image.id ? [{ id: image.id, slot: index, alt: blankToNull(image.alt_text) }] : [],
  )
  if (existingImages.length) {
    const values = sql.join(
      existingImages.map((image) => sql`(${image.id}::uuid, ${image.slot}::integer, ${image.alt}::text)`),
      sql`, `,
    )
    await db.execute(sql`
      UPDATE product_images AS i
      SET position = data.slot,
          alt_text = data.alt
      FROM (VALUES ${values}) AS data(id, slot, alt)
      WHERE i.id = data.id
        AND i.product_id = ${data.id}::uuid
    `)
  }

  const freshImages = data.images.flatMap((image, index) =>
    image.id
      ? []
      : [{ url: image.url, alt_text: blankToNull(image.alt_text), position: index }],
  )
  if (freshImages.length) {
    await db.insert(product_images).values(
      freshImages.map((image) => ({
        product_id: data.id,
        url: image.url,
        alt_text: image.alt_text,
        position: image.position,
      })),
    )
  }

  const product = await loadProduct(db, data.id)
  return c.json({ ok: true, product })
})

export default router
