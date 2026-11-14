/**
 * Daily packing digest for Telegram.
 *
 * Bot setup (once):
 * 1. Telegram → @BotFather → /newbot (name e.g. ABG packing, username must end in bot).
 * 2. Copy the bot token. Treat it as a password.
 * 3. Open a chat with the bot and tap Start (or add it to a group and send a message).
 * 4. Open https://api.telegram.org/bot<TOKEN>/getUpdates and copy chat.id
 *    (personal chats are positive; groups are negative).
 * 5. pnpm --filter server exec wrangler secret put TELEGRAM_BOT_TOKEN
 *    pnpm --filter server exec wrangler secret put TELEGRAM_CHAT_ID
 * 6. Deploy the API so the 12:00 ICT cron is live. Cron does not run until deploy.
 *
 * Manual send: POST /api/internal/pack-digest
 * Authorization: Bearer <TELEGRAM_BOT_TOKEN>
 */
import { and, asc, eq, gte, inArray, lt } from 'drizzle-orm'
import { createDb, type Db } from './db'
import { order_items, orders } from './schema'

const WINDOW_MS = 24 * 60 * 60 * 1000
const TELEGRAM_MAX = 4000
const BANGKOK = 'Asia/Bangkok'

export type PackDigestBindings = {
  DATABASE_URL: string
  TELEGRAM_BOT_TOKEN?: string
  TELEGRAM_CHAT_ID?: string
}

export type PackDigestResult = {
  ok: true
  skipped?: 'not_configured'
  orders: number
  pieces: number
  messages: number
}

type PaidOrder = typeof orders.$inferSelect

type OrderItem = {
  order_id: string
  quantity: number
  product_name: string
  size: string
  color: string | null
}

export async function sendDailyPackDigest(env: PackDigestBindings): Promise<PackDigestResult> {
  const token = env.TELEGRAM_BOT_TOKEN?.trim()
  const chatId = env.TELEGRAM_CHAT_ID?.trim()
  if (!token || !chatId) {
    console.log('pack digest skipped: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not set')
    return { ok: true, skipped: 'not_configured', orders: 0, pieces: 0, messages: 0 }
  }

  const to = new Date()
  const from = new Date(to.getTime() - WINDOW_MS)
  const db = createDb(env.DATABASE_URL)
  const messages = await buildPackMessages(db, from, to)

  for (const text of messages) {
    await sendTelegramMessage(token, chatId, text)
  }

  const counts = parseCounts(messages)
  return { ok: true, ...counts, messages: messages.length }
}

export async function buildPackMessages(db: Db, from: Date, to: Date): Promise<string[]> {
  const paid = await db
    .select()
    .from(orders)
    .where(and(eq(orders.status, 'paid'), gte(orders.updated_at, from), lt(orders.updated_at, to)))
    .orderBy(asc(orders.updated_at))

  const dateLabel = formatBangkokDate(to)
  if (paid.length === 0) {
    return [`ABG packing — ${dateLabel}\nno paid orders in the last 24 hours`]
  }

  const items = await db
    .select({
      order_id: order_items.order_id,
      quantity: order_items.quantity,
      product_name: order_items.product_name,
      size: order_items.size,
      color: order_items.color,
    })
    .from(order_items)
    .where(
      inArray(
        order_items.order_id,
        paid.map((order) => order.id),
      ),
    )
    .orderBy(asc(order_items.created_at))

  const itemsByOrder = groupItems(items)
  const pieces = items.reduce((sum, item) => sum + item.quantity, 0)
  const header = `ABG packing — ${dateLabel}\n${paid.length} order${paid.length === 1 ? '' : 's'} · ${pieces} piece${pieces === 1 ? '' : 's'}`
  const pick = formatPickList(items)
  const orderBlocks = paid.map((order, index) => formatOrder(order, itemsByOrder.get(order.id) ?? [], index + 1, paid.length))

  return splitMessages(header, pick, orderBlocks)
}

function groupItems(items: OrderItem[]) {
  const map = new Map<string, OrderItem[]>()
  for (const item of items) {
    const list = map.get(item.order_id)
    if (list) list.push(item)
    else map.set(item.order_id, [item])
  }
  return map
}

function variantLabel(item: { product_name: string; size: string; color: string | null }) {
  const variant = [item.color, item.size].filter(Boolean).join(' / ')
  return variant ? `${item.product_name} · ${variant}` : item.product_name
}

function formatPickList(items: OrderItem[]) {
  const counts = new Map<string, number>()
  for (const item of items) {
    const key = variantLabel(item)
    counts.set(key, (counts.get(key) ?? 0) + item.quantity)
  }
  const lines = [...counts.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([label, qty]) => `${label} × ${qty}`)
  if (lines.length === 0) return null
  return `PICK\n${lines.join('\n')}`
}

function formatOrder(order: PaidOrder, items: OrderItem[], index: number, total: number) {
  const itemLines =
    items.length > 0
      ? items.map((item) => `${item.quantity}× ${variantLabel(item)}`).join('\n')
      : '(no items)'
  const ship = shipToLines(order)
  const totalLine = formatBaht(order.total)
  return [
    `#${index}/${total}  ${order.id.slice(0, 8)}  ${totalLine}`,
    itemLines,
    '',
    'ship to',
    ...ship,
  ].join('\n')
}

function shipToLines(order: PaidOrder) {
  const cityLine = [order.shipping_city, order.shipping_state, order.shipping_postal_code]
    .filter((part) => part && part.trim())
    .join(' ')
  return [
    order.shipping_name,
    order.shipping_line1,
    order.shipping_line2,
    cityLine || null,
    order.shipping_country,
    order.shipping_phone,
    order.email,
  ]
    .map((line) => line?.trim() || '')
    .filter(Boolean)
}

function formatBaht(amount: number) {
  return `฿${amount.toLocaleString('en-US')}`
}

function formatBangkokDate(date: Date) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: BANGKOK,
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

function splitMessages(header: string, pick: string | null, orderBlocks: string[]) {
  const parts = [header, pick, ...orderBlocks].filter((part): part is string => Boolean(part))
  const messages: string[] = []
  let current = ''

  for (const part of parts) {
    if (part.length > TELEGRAM_MAX) {
      if (current) {
        messages.push(current)
        current = ''
      }
      for (const chunk of hardSplit(part, TELEGRAM_MAX)) messages.push(chunk)
      continue
    }
    const next = current ? `${current}\n\n${part}` : part
    if (next.length <= TELEGRAM_MAX) {
      current = next
      continue
    }
    if (current) messages.push(current)
    current = part
  }

  if (current) messages.push(current)
  return messages
}

function hardSplit(text: string, max: number) {
  const chunks: string[] = []
  for (let i = 0; i < text.length; i += max) chunks.push(text.slice(i, i + max))
  return chunks
}

function parseCounts(messages: string[]) {
  const header = messages[0] ?? ''
  const match = header.match(/(\d+) orders? · (\d+) pieces?/)
  if (!match) return { orders: 0, pieces: 0 }
  return { orders: Number(match[1]), pieces: Number(match[2]) }
}

async function sendTelegramMessage(token: string, chatId: string, text: string) {
  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      disable_web_page_preview: true,
    }),
  })
  const body = (await response.json()) as { ok?: boolean; description?: string }
  if (!response.ok || !body.ok) {
    throw new Error(`telegram sendMessage failed: ${body.description || response.status}`)
  }
}

export async function telegramBearerMatches(
  authorization: string | undefined,
  token: string,
): Promise<boolean> {
  if (!authorization?.startsWith('Bearer ')) return false
  const given = authorization.slice('Bearer '.length).trim()
  const encoder = new TextEncoder()
  const a = encoder.encode(given)
  const b = encoder.encode(token)
  if (a.byteLength !== b.byteLength) return false
  return crypto.subtle.timingSafeEqual(a, b)
}
