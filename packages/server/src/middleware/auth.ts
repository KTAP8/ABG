import { createMiddleware } from 'hono/factory'
import * as jose from 'jose'
import { AppError } from './errorHandler'
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

export const requireUser = createMiddleware<Env>(async (c, next) => {
  const authHeader = c.req.header('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    throw new AppError(401, 'Unauthorized')
  }

  const token = authHeader.slice('Bearer '.length).trim()
  if (!token) {
    throw new AppError(401, 'Unauthorized')
  }

  const authUrl = c.env.NEON_AUTH_URL
  if (!authUrl) {
    throw new AppError(500, 'NEON_AUTH_URL is not configured')
  }

  try {
    const { payload } = await jose.jwtVerify(token, getJwks(authUrl), {
      issuer: new URL(authUrl).origin,
    })

    if (!payload.sub) {
      throw new AppError(401, 'Invalid token')
    }

    const user: AuthUser = {
      id: payload.sub,
      email: typeof payload.email === 'string' ? payload.email : undefined,
      name: typeof payload.name === 'string' ? payload.name : undefined,
    }

    c.set('user', user)
    await next()
  } catch (err) {
    if (err instanceof AppError) throw err
    console.error('JWT verification failed:', err)
    throw new AppError(401, 'Invalid token')
  }
})

export const requireAdmin = createMiddleware<Env>(async (_c, _next) => {
  throw new AppError(401, 'Admin authentication not yet implemented')
})
