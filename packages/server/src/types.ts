import type { Db } from './lib/db'

export type Env = {
  Bindings: {
    DATABASE_URL: string
    WEB_URL: string
    RESEND_API_KEY?: string
    RESEND_FROM_EMAIL?: string
    BETTER_AUTH_SECRET?: string
    BETTER_AUTH_URL?: string
  }
  Variables: {
    db: Db
  }
}
