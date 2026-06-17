// Hand-built auth (no third-party auth service). Passwords are scrypt-hashed with a
// per-user salt; sessions are random tokens stored in Postgres and carried in an
// httpOnly cookie. API keys are stored as SHA-256 hashes (raw key shown once).
import { scrypt, randomBytes, timingSafeEqual, createHash } from 'node:crypto'
import { promisify } from 'node:util'
import { cookies } from 'next/headers'
import { sql, ensureSchema, dbConfigured } from './db'

const scryptAsync = promisify(scrypt)
const SESSION_COOKIE = 'nvd_session'
const SESSION_DAYS = 30

// ── Passwords ─────────────────────────────────────────────────────────────────
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex')
  const derived = (await scryptAsync(password, salt, 64)) as Buffer
  return `${salt}:${derived.toString('hex')}`
}
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [salt, hash] = (stored || '').split(':')
  if (!salt || !hash) return false
  const derived = (await scryptAsync(password, salt, 64)) as Buffer
  const hashBuf = Buffer.from(hash, 'hex')
  return hashBuf.length === derived.length && timingSafeEqual(hashBuf, derived)
}

export const newId = (prefix = 'usr_') => prefix + randomBytes(12).toString('hex')

// ── API keys ──────────────────────────────────────────────────────────────────
export function generateApiKey(): { raw: string; hash: string; prefix: string } {
  const raw = 'ls_live_' + randomBytes(20).toString('hex')
  return { raw, hash: hashApiKey(raw), prefix: raw.slice(0, 16) }
}
export const hashApiKey = (raw: string) => createHash('sha256').update(raw).digest('hex')

// ── Sessions ──────────────────────────────────────────────────────────────────
export async function createSession(userId: string): Promise<void> {
  const token = randomBytes(32).toString('hex')
  const expires = new Date(Date.now() + SESSION_DAYS * 86400000)
  await sql`INSERT INTO sessions (token, user_id, expires_at) VALUES (${token}, ${userId}, ${expires.toISOString()})`
  const c = await cookies()
  c.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_DAYS * 86400,
  })
}

export async function destroySession(): Promise<void> {
  const c = await cookies()
  const token = c.get(SESSION_COOKIE)?.value
  if (token) {
    try { await sql`DELETE FROM sessions WHERE token = ${token}` } catch { /* ignore */ }
  }
  c.delete(SESSION_COOKIE)
}

/** Result shape returned by the auth server actions (used by the client forms). */
export interface AuthResult {
  error?: string
  apiKey?: string
  sent?: boolean
  message?: string
}

/** Canonical site origin for links in emails (override via env if needed). */
export const siteUrl = (): string =>
  process.env.NEXT_PUBLIC_SITE_URL || 'https://newvenuedata.com'

// ── One-time tokens (email verification + password reset) ───────────────────────
export type AuthTokenKind = 'verify' | 'reset'

export async function createAuthToken(userId: string, kind: AuthTokenKind, ttlMs: number): Promise<string> {
  const token = randomBytes(32).toString('hex')
  const expires = new Date(Date.now() + ttlMs)
  await sql`INSERT INTO auth_tokens (token, user_id, kind, expires_at)
            VALUES (${token}, ${userId}, ${kind}, ${expires.toISOString()})`
  return token
}

/** Validate + single-use consume a token; returns the user id or null. */
export async function consumeAuthToken(token: string, kind: AuthTokenKind): Promise<string | null> {
  if (!token) return null
  const { rows } = await sql`
    SELECT user_id FROM auth_tokens
    WHERE token = ${token} AND kind = ${kind} AND expires_at > now() LIMIT 1`
  const r = rows[0] as { user_id: string } | undefined
  if (!r) return null
  await sql`DELETE FROM auth_tokens WHERE token = ${token}`
  return r.user_id
}

export interface SessionUser {
  id: string
  email: string
  name: string | null
  company: string | null
  plan: string
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  if (!dbConfigured()) return null
  const c = await cookies()
  const token = c.get(SESSION_COOKIE)?.value
  if (!token) return null
  try {
    await ensureSchema()
    const { rows } = await sql`
      SELECT u.id, u.email, u.name, u.company, u.plan
      FROM sessions s JOIN users u ON u.id = s.user_id
      WHERE s.token = ${token} AND s.expires_at > now()
      LIMIT 1`
    return (rows[0] as SessionUser) ?? null
  } catch {
    return null
  }
}
