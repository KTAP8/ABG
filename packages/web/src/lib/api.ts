import { getAccessToken } from './auth'

function getApiUrl(): string {
  const envUrl = import.meta.env.VITE_API_URL as string | undefined
  if (!envUrl) return '/api'
  const trimmed = envUrl.replace(/\/$/, '')
  if (trimmed.endsWith('/api')) return trimmed
  return `${trimmed}/api`
}

const API_URL = getApiUrl()

async function authHeaders(): Promise<HeadersInit> {
  const token = await getAccessToken()
  if (!token) throw new Error('Not authenticated')
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

export interface Drop {
  id: string
  slug: string
  name: string
  name_th?: string
  description?: string
  description_th?: string
  drop_at: string
  is_active: boolean
  google_form_url?: string
  created_at: string
  products?: Product[]
}

export interface ProductSpec {
  id: string
  product_id: string
  label: string
  value: string
  position: number
}

export interface Product {
  id: string
  slug: string
  name: string
  name_th?: string
  description?: string
  description_th?: string
  size_guide?: string | null
  care?: string | null
  price: number
  drop_id?: string
  category?: string
  gender?: string
  is_active: boolean
  google_form_url?: string
  created_at: string
  variants?: ProductVariant[]
  images?: ProductImage[]
  specs?: ProductSpec[]
}

export interface ProductVariant {
  id: string
  product_id: string
  size: string
  color?: string
  sku?: string
  stock: number
  created_at: string
}

export interface ProductImage {
  id: string
  product_id: string
  url: string
  position: number
  alt_text?: string
  color?: string
}

export interface UserProfile {
  user_id: string
  email: string
  display_name: string | null
  heard_from: string | null
  shop_for: string | null
  notify_channel: string | null
  line_id: string | null
  onboarding_completed_at: string | null
  created_at: string | null
  updated_at: string | null
}

export interface MeResponse {
  user: {
    id: string
    email: string | null
    name: string | null
  }
  profile: UserProfile | null
  needs_onboarding: boolean
}

export async function getDrops(params?: { category?: string; gender?: string }): Promise<Drop[]> {
  const searchParams = new URLSearchParams()
  if (params?.category) searchParams.append('category', params.category)
  if (params?.gender) searchParams.append('gender', params.gender)

  const url = `${API_URL}/drops${searchParams.toString() ? '?' + searchParams.toString() : ''}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch drops')
  return res.json()
}

export async function getDrop(slug: string): Promise<Drop> {
  const res = await fetch(`${API_URL}/drops/${slug}`)
  if (!res.ok) throw new Error('Failed to fetch drop')
  return res.json()
}

export async function getProduct(slug: string): Promise<Product> {
  const res = await fetch(`${API_URL}/products/${slug}`)
  if (!res.ok) throw new Error('Failed to fetch product')
  return res.json()
}

export async function joinWaitlist(data: {
  email: string
  drop_id?: string
  phone?: string
  campus?: string
}): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_URL}/waitlist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to join waitlist')
  return res.json()
}

export async function submitIykyk(data: {
  name: string
  email: string
  ig_handle?: string
}): Promise<{ success: boolean; discount_code: string; discount_percent: number }> {
  const res = await fetch(`${API_URL}/iykyk`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to submit')
  return res.json()
}

export async function getMe(): Promise<MeResponse> {
  const headers = await authHeaders()
  const res = await fetch(`${API_URL}/me`, { headers })
  if (!res.ok) throw new Error('Failed to fetch profile')
  return res.json()
}

export async function submitOnboarding(data: {
  heard_from: string
  shop_for: string
  notify_channel: string
  email?: string
  display_name?: string
  line_id?: string
}): Promise<{ profile: UserProfile; needs_onboarding: boolean }> {
  const headers = await authHeaders()
  const res = await fetch(`${API_URL}/me/onboarding`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to save onboarding')
  return res.json()
}

export async function updateProfile(data: {
  heard_from?: string
  shop_for?: string
  notify_channel?: string
  display_name?: string | null
  line_id?: string | null
}): Promise<{ profile: UserProfile }> {
  const headers = await authHeaders()
  const res = await fetch(`${API_URL}/me`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to update profile')
  return res.json()
}

export interface CartItem {
  id: string
  cart_id: string
  variant_id: string
  quantity: number
  available_stock: number
  size: string
  color: string | null
  sku: string | null
  product_id: string
  product_slug: string
  product_name: string
  product_name_th: string | null
  price: number
  image_url: string | null
  sold_out: boolean
}

export interface CartResponse {
  id: string | null
  items: CartItem[]
  item_count: number
  subtotal: number
}

type CartHeaderOptions = {
  /** When signed in, send Bearer only (no guest header). */
  signedIn: boolean
  /** Guest UUID — only sent when not signed in. */
  guestId: string | null
  /** Require auth token (merge). */
  requireAuth?: boolean
}

async function cartHeaders(opts: CartHeaderOptions): Promise<HeadersInit> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (opts.signedIn || opts.requireAuth) {
    const token = await getAccessToken()
    if (!token) {
      if (opts.requireAuth) throw new Error('Not authenticated')
    } else {
      headers.Authorization = `Bearer ${token}`
    }
  }

  // Guest header only for guest CRUD — never alongside signed-in normal requests
  if (!opts.signedIn && opts.guestId) {
    headers['X-Guest-Cart-Id'] = opts.guestId
  }

  return headers
}

export async function getCart(opts: CartHeaderOptions): Promise<CartResponse> {
  const headers = await cartHeaders(opts)
  const res = await fetch(`${API_URL}/cart`, { headers })
  if (!res.ok) throw new Error('Failed to fetch cart')
  return res.json()
}

export async function addCartItem(
  variantId: string,
  quantity: number,
  opts: CartHeaderOptions,
): Promise<CartResponse> {
  const headers = await cartHeaders(opts)
  const res = await fetch(`${API_URL}/cart/items`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ variant_id: variantId, quantity }),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error((body as { error?: string }).error || 'Failed to add to cart')
  }
  return res.json()
}

export async function updateCartItem(
  itemId: string,
  quantity: number,
  opts: CartHeaderOptions,
): Promise<CartResponse> {
  const headers = await cartHeaders(opts)
  const res = await fetch(`${API_URL}/cart/items/${itemId}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ quantity }),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error((body as { error?: string }).error || 'Failed to update cart')
  }
  return res.json()
}

export async function removeCartItem(itemId: string, opts: CartHeaderOptions): Promise<CartResponse> {
  const headers = await cartHeaders(opts)
  const res = await fetch(`${API_URL}/cart/items/${itemId}`, {
    method: 'DELETE',
    headers,
  })
  if (!res.ok) throw new Error('Failed to remove cart item')
  return res.json()
}

export async function clearCart(opts: CartHeaderOptions): Promise<CartResponse> {
  const headers = await cartHeaders(opts)
  const res = await fetch(`${API_URL}/cart`, {
    method: 'DELETE',
    headers,
  })
  if (!res.ok) throw new Error('Failed to clear cart')
  return res.json()
}

/** Merge guest cart into user cart. Auth required. Guest id in body only. */
export async function mergeCart(guestId: string): Promise<CartResponse> {
  const headers = await cartHeaders({ signedIn: true, guestId: null, requireAuth: true })
  const res = await fetch(`${API_URL}/cart/merge`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ guest_id: guestId }),
  })
  if (!res.ok) throw new Error('Failed to merge cart')
  return res.json()
}
