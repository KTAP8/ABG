import { createMiddleware } from 'hono/factory'
import * as jose from 'jose'
import type { AuthUser, Env } from '../types'

const jwksCache = new Map<string, ReturnType<typeof jose.createRemoteJWKSet>>()

function getJwks(authUrl: string) {
  let jwks = jwksCache.get(authUrl)
  if (!jwks) {
    jwks = jose.createRemoteJWKSet(new URL(`${authUrl.replace(/\/$/, '')}/.well-known/jwks.json`))
    jwksCache.set(authUrl, jwks)
  }
  return jwks
}

/** Verifies JWT when present; never throws on missing/invalid token. */
export const optionalAuth = createMiddleware<Env>(async (c, next) => {
  const authHeader = c.req.header('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    await next()
    return
  }

  const token = authHeader.slice('Bearer '.length).trim()
  const authUrl = c.env.NEON_AUTH_URL
  if (!token || !authUrl) {
    await next()
    return
  }

  try {
    const { payload } = await jose.jwtVerify(token, getJwks(authUrl), {
      issuer: new URL(authUrl).origin,
    })

    if (payload.sub) {
      const user: AuthUser = {
        id: payload.sub,
        email: typeof payload.email === 'string' ? payload.email : undefined,
        name: typeof payload.name === 'string' ? payload.name : undefined,
      }
      c.set('user', user)
    }
  } catch (err) {
    console.error('optionalAuth JWT verification failed:', err)
  }

  await next()
})
