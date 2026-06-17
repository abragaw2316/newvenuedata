// API key store (server-only). Keys are issued as `ls_live_…` / `ls_test_…` and
// presented as `Authorization: Bearer <key>` (the scheme documented in
// public/openapi.json). We store only the SHA-256 **hash** of each key — the raw
// key is shown once at mint time and is not recoverable.
//
// Stopgap storage: a flat file at data/api-keys.json (mint with
// `npm run mint-key`), plus an always-present public **sandbox** key seeded in
// code so the docs "try it" path works without provisioning. The real home for
// key management is the database (see handoff.md TODO-A); this mirrors the
// flat-file pattern already used for the dataset.
import { readFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import path from 'node:path'
import { sql, ensureSchema, dbConfigured } from './db'

export type ApiKeyPlan = 'sandbox' | 'starter' | 'pro' | 'enterprise'

export interface ApiKeyRecord {
  id: string
  name: string
  plan: ApiKeyPlan
  hashedKey: string
  rateLimitPerMin: number
  active: boolean
  createdAt: string
}

/** Per-minute request rate by plan (burst protection — distinct from the monthly
 *  call quotas on the pricing page). */
export const PLAN_RATE_LIMITS: Record<ApiKeyPlan, number> = {
  sandbox: 60,
  starter: 120,
  pro: 600,
  enterprise: 3000,
}

export function hashKey(rawToken: string): string {
  return createHash('sha256').update(rawToken.trim()).digest('hex')
}

// A well-known, public, low-limit sandbox key for the docs/playground "Bearer"
// path. It only reaches the same public records as the anonymous demo tier.
export const SANDBOX_RAW_KEY = 'ls_test_sandbox'
const SEED: ApiKeyRecord[] = [
  {
    id: 'key_sandbox',
    name: 'Public sandbox key',
    plan: 'sandbox',
    hashedKey: hashKey(SANDBOX_RAW_KEY),
    rateLimitPerMin: PLAN_RATE_LIMITS.sandbox,
    active: true,
    createdAt: '2026-06-15',
  },
]

let keysPromise: Promise<ApiKeyRecord[]> | null = null
async function loadKeys(): Promise<ApiKeyRecord[]> {
  try {
    const raw = await readFile(path.join(process.cwd(), 'data', 'api-keys.json'), 'utf8')
    const parsed = JSON.parse(raw) as { keys?: ApiKeyRecord[] }
    const fileKeys = Array.isArray(parsed.keys) ? parsed.keys : []
    return [...SEED, ...fileKeys]
  } catch {
    return [...SEED]
  }
}
function allKeys(): Promise<ApiKeyRecord[]> {
  // Memoized per server instance — a freshly-minted key is picked up on the next
  // cold start (acceptable for the flat-file stopgap).
  if (!keysPromise) keysPromise = loadKeys()
  return keysPromise
}

// Map account plans (DB) onto the rate-limit tiers used by the API.
const ACCOUNT_PLAN_TIER: Record<string, ApiKeyPlan> = {
  trial: 'starter',
  county: 'starter',
  south_fl: 'pro',
  statewide: 'enterprise',
}

/** Return the active key record for a raw token, or null if invalid/revoked.
 *  Checks the seeded/file keys first, then real account keys in Postgres. */
export async function verifyApiKey(rawToken: string): Promise<ApiKeyRecord | null> {
  if (!rawToken) return null
  const h = hashKey(rawToken)

  const keys = await allKeys()
  const fileKey = keys.find((k) => k.active && k.hashedKey === h)
  if (fileKey) return fileKey

  // Real per-user account keys live in the database (issued at signup / rotation).
  if (dbConfigured()) {
    try {
      await ensureSchema()
      const { rows } = await sql`SELECT id, plan FROM api_keys WHERE key_hash = ${h} AND revoked = false LIMIT 1`
      const row = rows[0] as { id: string; plan: string } | undefined
      if (row) {
        const plan = ACCOUNT_PLAN_TIER[row.plan] ?? 'starter'
        // Best-effort last-used stamp; never block the request on it.
        sql`UPDATE api_keys SET last_used_at = now() WHERE id = ${row.id}`.catch(() => {})
        return {
          id: row.id, name: 'account key', plan, hashedKey: h,
          rateLimitPerMin: PLAN_RATE_LIMITS[plan], active: true, createdAt: '',
        }
      }
    } catch {
      /* DB unavailable → fall through to "not found" (401), demo tier still open */
    }
  }
  return null
}
