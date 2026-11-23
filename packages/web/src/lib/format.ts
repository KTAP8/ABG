export function formatPrice(price: number) {
  return `฿${price.toLocaleString('en-US')}`
}

/** Client fallback only. The server quote's `freeShippingThreshold` is the source of truth. */
export const FREE_SHIPPING_FALLBACK = 1000
export const SHIPPING_FEE_FALLBACK = 50
