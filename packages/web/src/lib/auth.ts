import { createAuthClient } from '@neondatabase/neon-js/auth'

const authUrl = import.meta.env.VITE_NEON_AUTH_URL as string | undefined

if (!authUrl && import.meta.env.DEV) {
  console.warn('VITE_NEON_AUTH_URL is not set')
}

export const authClient = createAuthClient(authUrl || '')

type AuthClientWithJwt = typeof authClient & {
  getJWTToken?: () => Promise<string | null | undefined>
}

export type AuthSessionUser = {
  id: string
  email?: string | null
  name?: string | null
  image?: string | null
}

export async function getAccessToken(): Promise<string | null> {
  const client = authClient as AuthClientWithJwt

  try {
    if (typeof client.getJWTToken === 'function') {
      const jwt = await client.getJWTToken()
      if (typeof jwt === 'string' && jwt) return jwt
    }
  } catch {
    // fall through to session token
  }

  const result = await authClient.getSession()
  const session = result.data?.session as
    | { token?: string; access_token?: string }
    | undefined
    | null

  return session?.access_token || session?.token || null
}

export const PENDING_AUTH_TOAST_KEY = 'abg_pending_auth_toast'

export async function signInWithGoogle(callbackURL = `${window.location.origin}/onboarding`) {
  sessionStorage.setItem(PENDING_AUTH_TOAST_KEY, '1')
  return authClient.signIn.social({
    provider: 'google',
    callbackURL,
    newUserCallbackURL: callbackURL,
  })
}

export async function signOut() {
  return authClient.signOut()
}
