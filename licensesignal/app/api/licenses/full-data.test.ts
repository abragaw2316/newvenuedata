import { describe, it, expect } from 'vitest'
import { GET as listLicenses } from './route'
import { GET as getStats } from '../stats/route'

// TODO-A regression guard: the license API must serve the FULL normalized
// universe (tens of thousands of records), not the small curated marketing
// sample. These thresholds are deliberately well below the real counts (~59k
// licenses) but well above the curated sample (~270) so they stay green across
// data refreshes while still catching a regression to the bundled sample.
const FULL_DATASET_FLOOR = 5_000

describe('full-dataset wiring (TODO-A)', () => {
  it('GET /api/licenses reports a full-universe total', async () => {
    const res = await listLicenses(new Request('https://example.com/api/licenses'))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.pagination.total).toBeGreaterThan(FULL_DATASET_FLOOR)
  })

  it('GET /api/stats aggregates the full universe and stays within 67 counties', async () => {
    const res = await getStats()
    expect(res.status).toBe(200)
    const { data } = await res.json()

    expect(data.totalRecords).toBeGreaterThan(FULL_DATASET_FLOOR)
    // newFilings is the honest count of genuinely-new records — a strict subset.
    expect(data.newFilings).toBeGreaterThan(0)
    expect(data.newFilings).toBeLessThan(data.totalRecords)
    // Per-type counts still sum to the full total.
    const sum = Object.values(data.byType as Record<string, number>).reduce((a, n) => a + n, 0)
    expect(sum).toBe(data.totalRecords)
    // The sampled-county count never exceeds the 67 Florida counties.
    expect(data.countiesInSample).toBeGreaterThan(0)
    expect(data.countiesInSample).toBeLessThanOrEqual(67)
  })
})
