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
