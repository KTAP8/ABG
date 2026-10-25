import Stripe from 'stripe'

export function createStripe(secretKey: string) {
  return new Stripe(secretKey, {
    apiVersion: '2026-07-29.dahlia',
    httpClient: Stripe.createFetchHttpClient(),
  })
}

export function integrationIdentifier() {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz'
  const bytes = new Uint8Array(8)
  crypto.getRandomValues(bytes)
  let suffix = ''
  for (const byte of bytes) suffix += alphabet[byte % alphabet.length]
  return `abgcheckout${suffix}`
}
