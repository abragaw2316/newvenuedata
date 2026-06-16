import { describe, it, expect } from 'vitest'
import { GET } from './route'

describe('GET /api/stats', () => {
  it('responds 200 with the documented aggregate shape', async () => {
    const res = await GET()
    expect(res.status).toBe(200)

    const body = (await res.json()) as {
      data: {
        totalRecords: number
        countiesCovered: number
        byType: Record<string, number>
        licenseTypes: number
      }
    }

    expect(body.data).toBeTypeOf('object')
    expect(body.data).not.toBeNull()

    const { totalRecords, countiesCovered, byType, licenseTypes } = body.data

    expect(typeof totalRecords).toBe('number')
    expect(totalRecords).toBeGreaterThan(0)

    // All 67 Florida counties are reported as covered.
    expect(countiesCovered).toBe(67)

    expect(byType).toBeTypeOf('object')
    expect(byType).not.toBeNull()
    expect(Array.isArray(byType)).toBe(false)

    expect(typeof licenseTypes).toBe('number')

    // licenseTypes is the number of distinct keys in byType.
    expect(licenseTypes).toBe(Object.keys(byType).length)

    // Every per-type bucket is a positive count, and they sum to totalRecords.
    const counts = Object.values(byType)
    for (const count of counts) {
      expect(typeof count).toBe('number')
      expect(count).toBeGreaterThan(0)
    }
    const sum = counts.reduce((acc, n) => acc + n, 0)
    expect(sum).toBe(totalRecords)
  })
})
