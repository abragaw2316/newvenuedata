import { describe, it, expect } from 'vitest'
import { GET } from './route'
import { SANDBOX_RAW_KEY } from '@/lib/api-keys'

function call(headers?: Record<string, string>) {
  return GET(new Request('http://localhost/api/licenses?limit=2', { headers }))
}

describe('GET /api/licenses — API key auth', () => {
  it('allows anonymous requests on the open demo tier', async () => {
    const res = await call()
    expect(res.status).toBe(200)
    expect(Number(res.headers.get('X-RateLimit-Limit'))).toBeGreaterThan(0)
  })

  it('rejects an invalid Bearer key with 401', async () => {
    const res = await call({ Authorization: 'Bearer ls_live_not_a_real_key' })
    expect(res.status).toBe(401)
    const body = await res.json()
    expect(body.error.type).toBe('unauthorized')
    expect(res.headers.get('WWW-Authenticate')).toBe('Bearer')
  })

  it('accepts a valid key and reports that plan’s rate limit', async () => {
    const res = await call({ Authorization: `Bearer ${SANDBOX_RAW_KEY}` })
    expect(res.status).toBe(200)
    // sandbox plan = 60 req/min (PLAN_RATE_LIMITS.sandbox)
    expect(res.headers.get('X-RateLimit-Limit')).toBe('60')
    const body = await res.json()
    expect(Array.isArray(body.data)).toBe(true)
  })

  it('ignores a malformed Authorization header (treated as anonymous)', async () => {
    const res = await call({ Authorization: 'Token abc' })
    expect(res.status).toBe(200)
  })
})
