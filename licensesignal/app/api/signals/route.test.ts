import { describe, it, expect } from 'vitest'
import { GET } from './route'

function call(url: string) {
  return GET(new Request(url))
}

describe('GET /api/signals', () => {
  it('returns a page of unified signals with pagination + the signal universe', async () => {
    const res = await call('http://localhost/api/signals')
    expect(res.status).toBe(200)
    const body = await res.json()

    expect(Array.isArray(body.data)).toBe(true)
    expect(body.data.length).toBeGreaterThan(0)
    expect(body.pagination).toMatchObject({ limit: 20 })
    expect(typeof body.pagination.total).toBe('number')
    // Serves the full signal feed, not the small curated set bundled for the UI.
    expect(body.pagination.total).toBeGreaterThan(500)
    expect(body.universe).toMatchObject({ permitFeed: 'live' })
  })

  it('filters by source', async () => {
    const body = await (await call('http://localhost/api/signals?source=permit&limit=50')).json()
    expect(body.data.length).toBeGreaterThan(0)
    for (const sig of body.data) {
      expect(sig.signalType).toBe('permit')
    }
  })

  it('caps the limit at 50 and paginates without overlap', async () => {
    const capped = await (await call('http://localhost/api/signals?limit=999')).json()
    expect(capped.pagination.limit).toBe(50)

    const first = await (await call('http://localhost/api/signals?limit=5')).json()
    expect(first.pagination.hasMore).toBe(true)
    const second = await (
      await call(`http://localhost/api/signals?limit=5&cursor=${encodeURIComponent(first.pagination.cursor)}`)
    ).json()
    const firstIds = new Set(first.data.map((s: { id: string }) => s.id))
    for (const sig of second.data) {
      expect(firstIds.has(sig.id)).toBe(false)
    }
  })
})
