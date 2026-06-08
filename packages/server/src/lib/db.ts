import { config } from 'dotenv'
import path from 'path'
import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'

config({ path: path.resolve(process.cwd(), '../../.env') })

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set')
}

const client = neon(connectionString)
export const db = drizzle(client)
