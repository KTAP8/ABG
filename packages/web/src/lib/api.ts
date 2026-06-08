const API_URL = (import.meta.env.VITE_API_URL as string | undefined) || '/api'

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

export interface Product {
  id: string
  slug: string
  name: string
  name_th?: string
  description?: string
  description_th?: string
  price: number
  drop_id?: string
  is_active: boolean
  google_form_url?: string
  created_at: string
  variants?: ProductVariant[]
  images?: ProductImage[]
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
}

export async function getDrops(): Promise<Drop[]> {
  const res = await fetch(`${API_URL}/drops`)
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
