import { describe, it, expect } from 'vitest'
import { GET } from './route'

function call(url: string) {
  return GET(new Request(url))
}

describe('GET /api/licenses', () => {
  it('returns a default page of records with pagination metadata', async () => {
    const res = await call('http://localhost/api/licenses')
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(Array.isArray(body.data)).toBe(true)
    expect(body.data.length).toBeLessThanOrEqual(10)
    expect(body.pagination).toMatchObject({ limit: 10 })
    expect(typeof body.pagination.total).toBe('number')
  })

  it('respects the limit parameter and caps it at 50', async () => {
    const small = await (await call('http://localhost/api/licenses?limit=2')).json()
    expect(small.data.length).toBe(2)

    const capped = await (await call('http://localhost/api/licenses?limit=999')).json()
    expect(capped.pagination.limit).toBe(50)
  })

  it('filters by county case-insensitively', async () => {
    const res = await call('http://localhost/api/licenses?county=miami-dade&limit=50')
    const body = await res.json()
    expect(body.data.length).toBeGreaterThan(0)
    for (const rec of body.data) {
      expect(rec.address.county.toLowerCase()).toBe('miami-dade')
    }
  })

  it('filters by license_type', async () => {
    const body = await (await call('http://localhost/api/licenses?license_type=BEV&limit=50')).json()
    for (const rec of body.data) {
      expect(rec.licenseType).toBe('BEV')
    }
  })

  it('paginates with an opaque cursor without overlap', async () => {
    const first = await (await call('http://localhost/api/licenses?limit=3')).json()
    expect(first.pagination.hasMore).toBe(true)
    const second = await (await call(`http://localhost/api/licenses?limit=3&cursor=${encodeURIComponent(first.pagination.cursor)}`)).json()
    const firstIds = new Set(first.data.map((r: { id: string }) => r.id))
    for (const rec of second.data) {
      expect(firstIds.has(rec.id)).toBe(false)
    }
  })

  it('sets rate-limit headers (anonymous demo tier)', async () => {
    const res = await call('http://localhost/api/licenses')
    const limit = Number(res.headers.get('X-RateLimit-Limit'))
    const remaining = Number(res.headers.get('X-RateLimit-Remaining'))
    expect(Number.isInteger(limit)).toBe(true)
    expect(limit).toBeGreaterThan(0)
    expect(Number.isInteger(remaining)).toBe(true)
    expect(remaining).toBeLessThanOrEqual(limit)
  })
})
