import { NextResponse } from 'next/server'
import { getAllLicenses } from '@/lib/server-data'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * GET /api/stats
 *
 * Lightweight aggregate stats over the full license universe, used to power
 * live counters on the marketing site. Mirrors what a `/v1/stats` summary
 * endpoint returns.
 */
export async function GET() {
  const licenses = await getAllLicenses()

  const byType: Record<string, number> = {}
  const counties = new Set<string>()

  for (const rec of licenses) {
    byType[rec.licenseType] = (byType[rec.licenseType] ?? 0) + 1
    // Only count real (non-empty) county names — a handful of records carry an
    // out-of-state / unknown county that the pipeline canonicalizes to ''.
    if (rec.address.county) counties.add(rec.address.county)
  }

  const newFilings = licenses.filter((r) => r.eventType === 'new_filing').length

  return NextResponse.json(
    {
      data: {
        totalRecords: licenses.length,
        newFilings,
        countiesCovered: 67,
        countiesInSample: counties.size,
        licenseTypes: Object.keys(byType).length,
        byType,
        refreshedAt: '2026-06-15T09:00:00Z',
      },
    },
    { headers: { 'Cache-Control': 'public, max-age=300' } }
  )
}
