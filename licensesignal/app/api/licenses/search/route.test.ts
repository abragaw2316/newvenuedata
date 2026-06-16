import { describe, it, expect } from 'vitest'
import { GET } from './route'

const QUERY = 'brickell'

function makeRequest(query: string): Request {
  return new Request(`https://example.com/api/licenses/search${query}`)
}

describe('GET /api/licenses/search', () => {
  it('returns 400 with error.type "invalid_request" when q is missing', async () => {
    const res = await GET(makeRequest(''))
    expect(res.status).toBe(400)

    const body = (await res.json()) as {
      error: { type: string; message: string }
    }
    expect(body.error).toBeTypeOf('object')
    expect(body.error.type).toBe('invalid_request')
    expect(typeof body.error.message).toBe('string')
  })

  it('treats a blank/whitespace q the same as missing', async () => {
    const res = await GET(makeRequest('?q=%20%20'))
    expect(res.status).toBe(400)
    const body = (await res.json()) as { error: { type: string } }
    expect(body.error.type).toBe('invalid_request')
  })

  it('returns 200 with a data array and a count matching data.length', async () => {
    const res = await GET(makeRequest(`?q=${QUERY}`))
    expect(res.status).toBe(200)

    const body = (await res.json()) as {
      data: Array<Record<string, unknown>>
      query: string
      count: number
    }

    expect(Array.isArray(body.data)).toBe(true)
    expect(body.data.length).toBeGreaterThan(0)
    expect(typeof body.count).toBe('number')
    expect(body.count).toBe(body.data.length)
    expect(body.query).toBe(QUERY)
  })

  it('every result actually contains the query term in name/city/county', async () => {
    const res = await GET(makeRequest(`?q=${QUERY}`))
    const body = (await res.json()) as {
      data: Array<{
        businessName: string
        legalName?: string | null
        dbaName?: string | null
        address: { city: string; county: string; street: string }
      }>
    }

    for (const rec of body.data) {
      const haystack = [
        rec.businessName,
        rec.legalName,
        rec.dbaName,
        rec.address.city,
        rec.address.county,
        rec.address.street,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      expect(haystack).toContain(QUERY)
    }
  })

  it('respects the limit parameter', async () => {
    const res = await GET(makeRequest(`?q=${QUERY}&limit=1`))
    const body = (await res.json()) as { data: unknown[]; count: number }
    expect(body.data.length).toBeLessThanOrEqual(1)
    expect(body.count).toBe(body.data.length)
  })
})
