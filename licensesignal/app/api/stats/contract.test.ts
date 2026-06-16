import { describe, it, expect } from 'vitest'
import { GET } from './route'

/**
 * Contract test for GET /api/stats.
 *
 * This asserts the *shape* and the internal *relationships* of the stats
 * payload — not brittle absolute counts that churn every time the sample
 * dataset is edited. A consumer relying on this endpoint should be able to
 * trust these invariants:
 *
 *   - `totalRecords` is a positive number.
 *   - `countiesCovered` is the full Florida county set (67).
 *   - `byType` is a plain object whose values are positive per-type counts.
 *   - `licenseTypes` equals the number of distinct keys in `byType`.
 *   - the per-type counts sum back to `totalRecords`.
 */

interface StatsShape {
  totalRecords: number
  newFilings: number
  countiesCovered: number
  countiesInSample: number
  licenseTypes: number
  byType: Record<string, number>
  refreshedAt: string
}

async function fetchStats(): Promise<{ status: number; data: StatsShape }> {
  const res = await GET()
  const body = (await res.json()) as { data: StatsShape }
  return { status: res.status, data: body.data }
}

describe('contract: GET /api/stats', () => {
  it('responds 200 with a non-null data object', async () => {
    const { status, data } = await fetchStats()
    expect(status).toBe(200)
    expect(data).toBeTypeOf('object')
    expect(data).not.toBeNull()
  })

  it('reports a positive integer totalRecords', async () => {
    const { data } = await fetchStats()
    expect(typeof data.totalRecords).toBe('number')
    expect(Number.isInteger(data.totalRecords)).toBe(true)
    expect(data.totalRecords).toBeGreaterThan(0)
  })

  it('covers all 67 Florida counties', async () => {
    const { data } = await fetchStats()
    expect(data.countiesCovered).toBe(67)
  })

  it('exposes byType as a plain object (not an array) of positive counts', async () => {
    const { data } = await fetchStats()

    expect(data.byType).toBeTypeOf('object')
    expect(data.byType).not.toBeNull()
    expect(Array.isArray(data.byType)).toBe(false)

    const counts = Object.values(data.byType)
    expect(counts.length).toBeGreaterThan(0)
    for (const count of counts) {
      expect(typeof count).toBe('number')
      expect(Number.isInteger(count)).toBe(true)
      expect(count).toBeGreaterThan(0)
    }
  })

  it('reports licenseTypes as the count of distinct byType keys', async () => {
    const { data } = await fetchStats()
    expect(typeof data.licenseTypes).toBe('number')
    expect(data.licenseTypes).toBe(Object.keys(data.byType).length)
  })

  it('has per-type counts that sum to totalRecords', async () => {
    const { data } = await fetchStats()
    const sum = Object.values(data.byType).reduce((acc, n) => acc + n, 0)
    expect(sum).toBe(data.totalRecords)
  })

  it('keeps the sampled-county count within the covered-county count', async () => {
    const { data } = await fetchStats()
    // The sample necessarily can't span more counties than exist statewide.
    expect(data.countiesInSample).toBeGreaterThan(0)
    expect(data.countiesInSample).toBeLessThanOrEqual(data.countiesCovered)
  })

  it('reports newFilings as a non-negative subset of totalRecords', async () => {
    const { data } = await fetchStats()
    expect(typeof data.newFilings).toBe('number')
    expect(data.newFilings).toBeGreaterThanOrEqual(0)
    expect(data.newFilings).toBeLessThanOrEqual(data.totalRecords)
  })
})
