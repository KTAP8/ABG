import type { Db } from './lib/db'

export type AuthUser = {
  id: string
  email?: string
  name?: string
}

export type Env = {
  Bindings: {
    DATABASE_URL: string
    WEB_URL: string
    NEON_AUTH_URL: string
    RESEND_API_KEY?: string
    RESEND_FROM_EMAIL?: string
  }
  Variables: {
    db: Db
    user: AuthUser
  }
}
