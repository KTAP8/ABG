/**
 * One-off: generate 20× 10% off coupons (max 150 THB), insert into Neon, write CSV/TXT.
 * Usage: pnpm --filter server generate:coupons
 *
 * Safe: only INSERTs into `coupons`. Does not delete or truncate.
 */
import { config } from 'dotenv'
import path from 'path'
import { writeFileSync, mkdirSync } from 'fs'
import { createDb } from './lib/db'
import { createBulkPercentCoupons } from './lib/discountCode'

config({ path: path.resolve(process.cwd(), '../../.env') })

const COUNT = 20
const DISCOUNT_PERCENT = 10
const MAX_DISCOUNT_AMOUNT = 150
const NOTE = 'manual outreach 10% max 150 THB'

async function main() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set')
  }

  const db = createDb(connectionString)
  const rows = await createBulkPercentCoupons(db, {
    count: COUNT,
    discountPercent: DISCOUNT_PERCENT,
    maxDiscountAmount: MAX_DISCOUNT_AMOUNT,
    note: NOTE,
  })

  const outDir = path.resolve(process.cwd(), '../../exports')
  mkdirSync(outDir, { recursive: true })

  const stamp = new Date().toISOString().slice(0, 10)
  const csvPath = path.join(outDir, `coupons-10pct-max150-${stamp}.csv`)
  const txtPath = path.join(outDir, `coupons-10pct-max150-${stamp}.txt`)

  const csvHeader = 'code,discount_percent,max_discount_amount_thb,note\n'
  const csvBody = rows
    .map(
      (r) =>
        `${r.code},${r.discount_percent},${r.max_discount_amount},"${NOTE}"`
    )
    .join('\n')
  writeFileSync(csvPath, csvHeader + csvBody + '\n', 'utf8')

  const txt = [
    `ABG 10% off coupons (max ${MAX_DISCOUNT_AMOUNT} THB)`,
    `Generated: ${new Date().toISOString()}`,
    `Count: ${rows.length}`,
    `One-time use each (coupons.used_at)`,
    '',
    ...rows.map((r, i) => `${String(i + 1).padStart(2, '0')}. ${r.code}`),
    '',
  ].join('\n')
  writeFileSync(txtPath, txt, 'utf8')

  console.log(`Inserted ${rows.length} coupons into Neon`)
  console.log(`CSV: ${csvPath}`)
  console.log(`TXT: ${txtPath}`)
  console.log('')
  console.log(rows.map((r) => r.code).join('\n'))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
