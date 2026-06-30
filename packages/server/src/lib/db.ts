import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'

export function createDb(connectionString: string) {
  const client = neon(connectionString)
  return drizzle(client)
}

export type Db = ReturnType<typeof createDb>
