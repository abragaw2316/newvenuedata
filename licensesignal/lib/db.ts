// Postgres access for real accounts (Vercel Postgres / Neon). Reads POSTGRES_URL
// from the environment (Vercel injects it when you create the store). Until that
// env var is set, dbConfigured() is false and the app cleanly falls back to its
// pre-auth behavior — nothing here runs at build time.
import { sql } from '@vercel/postgres'

export { sql }

export function dbConfigured(): boolean {
  return Boolean(process.env.POSTGRES_URL || process.env.DATABASE_URL)
}

// Idempotent schema creation, run once per server instance on first auth call.
let schemaReady: Promise<void> | null = null
export function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      await sql`CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name TEXT,
        company TEXT,
        plan TEXT NOT NULL DEFAULT 'trial',
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )`
      await sql`CREATE TABLE IF NOT EXISTS sessions (
        token TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        expires_at TIMESTAMPTZ NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )`
      await sql`CREATE TABLE IF NOT EXISTS api_keys (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        key_hash TEXT NOT NULL,
        key_prefix TEXT NOT NULL,
        plan TEXT NOT NULL DEFAULT 'trial',
        revoked BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        last_used_at TIMESTAMPTZ
      )`
      await sql`CREATE INDEX IF NOT EXISTS idx_api_keys_hash ON api_keys(key_hash)`
      await sql`CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id)`
    })().catch((e) => {
      schemaReady = null // allow retry on next request if it failed
      throw e
    })
  }
  return schemaReady
}
