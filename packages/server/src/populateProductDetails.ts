/**
 * One-off: fill products.size_guide, products.care, and product_specs from name heuristics
 * using the #SamyanABG size chart.
 *
 * Usage: pnpm --filter server populate:product-details
 *
 * Safe: UPDATEs size_guide/care; INSERTs specs only when a product has none.
 * Does not delete or truncate.
 */
import { config } from 'dotenv'
import path from 'path'
import { eq, sql } from 'drizzle-orm'
import { createDb } from './lib/db'
import { products, product_specs } from './lib/schema'

config({ path: path.resolve(process.cwd(), '../../.env') })

type StyleKind = 'baby_tee' | 'oversized' | null

type SpecRow = { label: string; value: string; position: number }

type StyleProfile = {
  sizeGuide: string
  care: string
  specs: SpecRow[]
}

const CARE = 'Cotton 100%. Wash cold, hang dry.'

const PROFILES: Record<Exclude<StyleKind, null>, StyleProfile> = {
  baby_tee: {
    sizeGuide: [
      'ABG Size Chart — Baby Tee',
      '',
      'Size: Free Size',
      'Chest: 28–34 inches',
      'Length: 22 inches',
      'Material: Cotton 100%',
      'Notes: Highly stretchable',
    ].join('\n'),
    care: CARE,
    specs: [
      { label: 'fit', value: 'baby tee / stretchable', position: 0 },
      { label: 'composition', value: '100% cotton', position: 1 },
      { label: 'size', value: 'freesize', position: 2 },
      { label: 'chest', value: '28–34 inches', position: 3 },
      { label: 'length', value: '22 inches', position: 4 },
    ],
  },
  oversized: {
    sizeGuide: [
      'ABG Size Chart — Oversized Tee',
      '',
      'Size: Free Size',
      'Chest: 44 inches',
      'Length: 27 inches',
      'Material: Cotton 100%',
      'Notes: Relaxed, oversized',
    ].join('\n'),
    care: CARE,
    specs: [
      { label: 'fit', value: 'boxy / oversized', position: 0 },
      { label: 'composition', value: '100% cotton', position: 1 },
      { label: 'size', value: 'freesize', position: 2 },
      { label: 'chest', value: '44 inches', position: 3 },
      { label: 'length', value: '27 inches', position: 4 },
    ],
  },
}

function inferStyle(name: string, slug: string): StyleKind {
  const hay = `${name} ${slug}`.toLowerCase()
  if (
    hay.includes('baby tee') ||
    hay.includes('babytee') ||
    hay.includes('baby-tee') ||
    hay.includes('chamchuri')
  ) {
    return 'baby_tee'
  }
  if (hay.includes('oversized') || hay.includes('oversize')) {
    return 'oversized'
  }
  return null
}

async function main() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set')
  }

  const db = createDb(connectionString)
  const allProducts = await db.select().from(products)

  let updated = 0
  let specsInserted = 0
  let skipped = 0

  for (const product of allProducts) {
    const kind = inferStyle(product.name, product.slug)
    if (!kind) {
      console.log(`skip  ${product.slug}  (${product.name}) — no baby tee / oversized match`)
      skipped++
      continue
    }

    const profile = PROFILES[kind]

    await db
      .update(products)
      .set({
        size_guide: profile.sizeGuide,
        care: profile.care,
      })
      .where(eq(products.id, product.id))

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(product_specs)
      .where(eq(product_specs.product_id, product.id))

    if (count === 0) {
      await db.insert(product_specs).values(
        profile.specs.map((spec) => ({
          product_id: product.id,
          label: spec.label,
          value: spec.value,
          position: spec.position,
        })),
      )
      specsInserted += profile.specs.length
      console.log(`ok    ${product.slug}  → ${kind}  (size_guide/care + ${profile.specs.length} specs)`)
    } else {
      console.log(
        `ok    ${product.slug}  → ${kind}  (size_guide/care updated; specs already exist, skipped insert)`,
      )
    }

    updated++
  }

  console.log(
    `\nDone. products updated: ${updated}, specs inserted: ${specsInserted}, skipped: ${skipped}`,
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
