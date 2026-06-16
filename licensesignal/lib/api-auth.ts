// API authentication + rate limiting for the route handlers.
//
// Behavior (matches the documented Bearer scheme in public/openapi.json):
//   • No Authorization header  → anonymous "demo" tier. Stays open so the
//     marketing site, docs playground, and search/signals UI keep working.
//   • Bearer <invalid key>     → 401.
//   • Bearer <valid key>       → that key's plan tier + per-minute rate limit.
//
// Rate limiting is best-effort, in-memory, and PER SERVER INSTANCE — Vercel runs
// many instances, each with its own counter, so this is burst protection, not a
// global quota. Production-grade limiting needs a shared store (e.g. Upstash
// Redis); swap the `buckets` map for that. Demo-tier requests are never hard-
// blocked (only metered) to protect the public site.
import { NextResponse } from 'next/server'
import { verifyApiKey, PLAN_RATE_LIMITS, type ApiKeyPlan } from './api-keys'

const DEMO_RATE_LIMIT_PER_MIN = PLAN_RATE_LIMITS.sandbox

export interface AuthResult {
  ok: boolean
  status?: number
  errorBody?: unknown
  tier: 'demo' | ApiKeyPlan
  keyId: string
  limitPerMin: number
}

export async function resolveAuth(request?: Request): Promise<AuthResult> {
  const header = request?.headers?.get('authorization')?.trim() ?? ''
  const match = /^Bearer\s+(.+)$/i.exec(header)

  if (!match) {
    return { ok: true, tier: 'demo', keyId: 'demo', limitPerMin: DEMO_RATE_LIMIT_PER_MIN }
  }

  const key = await verifyApiKey(match[1].trim())
  if (!key) {
    return {
      ok: false,
      status: 401,
      errorBody: {
        error: {
          type: 'unauthorized',
          message: 'Invalid or revoked API key. Pass a valid key as `Authorization: Bearer ls_live_...`.',
        },
      },
      tier: 'demo',
      keyId: 'invalid',
      limitPerMin: 0,
    }
  }

  return { ok: true, tier: key.plan, keyId: key.id, limitPerMin: key.rateLimitPerMin }
}

const WINDOW_MS = 60_000
const buckets = new Map<string, { count: number; resetAt: number }>()

function rateLimit(keyId: string, limitPerMin: number) {
  const now = Date.now()
  const b = buckets.get(keyId)
  if (!b || now >= b.resetAt) {
    const resetAt = now + WINDOW_MS
    buckets.set(keyId, { count: 1, resetAt })
    return { ok: true, remaining: Math.max(0, limitPerMin - 1), resetAt }
  }
  b.count += 1
  return { ok: b.count <= limitPerMin, remaining: Math.max(0, limitPerMin - b.count), resetAt: b.resetAt }
}

/**
 * Gate an API route: returns `{ error }` (a ready-to-return 401/429 Response) when
 * the request should be rejected, otherwise `{ error: null, headers }` with the
 * `X-RateLimit-*` headers to merge into the success response.
 */
export async function guardApi(
  request?: Request
): Promise<{ error: NextResponse | null; headers: Record<string, string> }> {
  const auth = await resolveAuth(request)
  if (!auth.ok) {
    return {
      error: NextResponse.json(auth.errorBody, {
        status: auth.status,
        headers: { 'WWW-Authenticate': 'Bearer' },
      }),
      headers: {},
    }
  }

  const rl = rateLimit(auth.keyId, auth.limitPerMin)
  const headers: Record<string, string> = {
    'X-RateLimit-Limit': String(auth.limitPerMin),
    'X-RateLimit-Remaining': String(rl.remaining),
    'X-RateLimit-Reset': String(Math.ceil(rl.resetAt / 1000)),
  }

  // Enforce only for keyed tiers; the anonymous demo tier is metered, not blocked.
  if (!rl.ok && auth.tier !== 'demo') {
    return {
      error: NextResponse.json(
        { error: { type: 'rate_limited', message: 'Rate limit exceeded for your plan. Retry in ~60s or upgrade.' } },
        { status: 429, headers: { ...headers, 'Retry-After': '60' } }
      ),
      headers,
    }
  }

  return { error: null, headers }
}
