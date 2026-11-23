import { useEffect, useMemo, useState } from 'react'
import { getDrops, sortShopProducts, type CartItem, type Product } from './api'

let catalogPromise: Promise<Product[]> | null = null

/** Active shop products, fetched once per session. */
function loadCatalog(): Promise<Product[]> {
  if (!catalogPromise) {
    catalogPromise = getDrops()
      .then((drops) => {
        const seen = new Set<string>()
        const products: Product[] = []
        for (const drop of drops) {
          for (const product of drop.products ?? []) {
            if (!product.is_active || seen.has(product.id)) continue
            seen.add(product.id)
            products.push(product)
          }
        }
        return sortShopProducts(products)
      })
      .catch((err) => {
        catalogPromise = null
        throw err
      })
  }
  return catalogPromise
}

const inStock = (product: Product) => (product.variants ?? []).some((variant) => variant.stock > 0)

/**
 * Products to upsell next to the cart:
 * 1. Not already in the cart, and with stock.
 * 2. While below free shipping, the cheapest piece that clears the gap ranks first.
 * 3. Then same gender/category as what is in the cart, keeping shop order.
 */
export function rankRecommendations(
  catalog: Product[],
  items: CartItem[],
  remaining: number,
  limit = 6,
): Product[] {
  const inCart = new Set(items.map((item) => item.product_id))
  const cartProducts = catalog.filter((product) => inCart.has(product.id))
  const genders = new Set(cartProducts.map((product) => product.gender).filter(Boolean))
  const categories = new Set(cartProducts.map((product) => product.category).filter(Boolean))

  const affinity = (product: Product) =>
    (product.gender && genders.has(product.gender) ? 1 : 0) +
    (product.category && categories.has(product.category) ? 1 : 0)

  const candidates = catalog.filter((product) => !inCart.has(product.id) && inStock(product))
  const order = new Map(candidates.map((product, index) => [product.id, index]))

  return [...candidates]
    .sort((a, b) => {
      if (remaining > 0) {
        const aClears = a.price >= remaining
        const bClears = b.price >= remaining
        if (aClears !== bClears) return aClears ? -1 : 1
        if (aClears && bClears && a.price !== b.price) return a.price - b.price
      }
      const byAffinity = affinity(b) - affinity(a)
      if (byAffinity !== 0) return byAffinity
      return (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0)
    })
    .slice(0, limit)
}

export function useRecommendations(items: CartItem[], remaining: number, enabled: boolean) {
  const [catalog, setCatalog] = useState<Product[]>([])

  useEffect(() => {
    if (!enabled) return
    let cancelled = false
    loadCatalog()
      .then((products) => {
        if (!cancelled) setCatalog(products)
      })
      .catch((err) => console.error('Failed to load recommendations', err))
    return () => {
      cancelled = true
    }
  }, [enabled])

  return useMemo(() => rankRecommendations(catalog, items, remaining), [catalog, items, remaining])
}
