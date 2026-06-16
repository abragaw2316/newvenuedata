import { NextResponse } from 'next/server'
import { getAllLicenses, getTexasLicenses } from '@/lib/server-data'
import { guardApi } from '@/lib/api-auth'

// Reads the full dataset from disk at request time (Node runtime).
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * GET /api/licenses
 *
 * A live, runnable mirror of the documented `GET /v1/licenses` endpoint,
 * served from the FULL normalized Florida license universe (~59k records) via
 * the runtime flat-file loader. This lets the docs playground issue real
 * requests and render real responses.
 *
 * Supported query params:
 *   county        — case-insensitive match on address.county
 *   license_type  — exact match on licenseType (SRX, COP, BEV, APS, ...)
 *   event_type    — exact match on eventType (new_filing, renewal, ...)
 *   status        — exact match on status (pending, active, ...)
 *   q             — free-text search across businessName / city / county
 *   limit         — page size (1–50, default 10)
 *   cursor        — opaque pagination cursor returned by the previous page
 */

const MAX_LIMIT = 50
const DEFAULT_LIMIT = 10

function decodeCursor(cursor: string | null): number {
  if (!cursor) return 0
  try {
    const decoded = Buffer.from(cursor, 'base64').toString('utf-8')
    const parsed = JSON.parse(decoded)
    return typeof parsed.offset === 'number' && parsed.offset >= 0 ? parsed.offset : 0
  } catch {
    return 0
  }
}

function encodeCursor(offset: number): string {
  return Buffer.from(JSON.stringify({ offset })).toString('base64')
}

export async function GET(request: Request) {
  const { error, headers: rateHeaders } = await guardApi(request)
  if (error) return error

  const { searchParams } = new URL(request.url)

  const state = searchParams.get('state')?.toUpperCase()
  const county = searchParams.get('county')?.toLowerCase()
  const licenseType = searchParams.get('license_type')?.toUpperCase()
  const eventType = searchParams.get('event_type')?.toLowerCase()
  const status = searchParams.get('status')?.toLowerCase()
  const q = searchParams.get('q')?.toLowerCase()

  const rawLimit = Number(searchParams.get('limit') ?? DEFAULT_LIMIT)
  const limit = Number.isFinite(rawLimit)
    ? Math.min(Math.max(Math.trunc(rawLimit), 1), MAX_LIMIT)
    : DEFAULT_LIMIT

  // Default is Florida (the full universe). `?state=TX` serves the Texas TABC set
  // (a recent-active sample — see lib/server-data.ts).
  const licenses = state === 'TX' ? await getTexasLicenses() : await getAllLicenses()
  const results = licenses.filter((rec) => {
    if (county && rec.address.county.toLowerCase() !== county) return false
    if (licenseType && rec.licenseType.toUpperCase() !== licenseType) return false
    if (eventType && rec.eventType.toLowerCase() !== eventType) return false
    if (status && rec.status.toLowerCase() !== status) return false
    if (q) {
      const haystack = `${rec.businessName} ${rec.address.city} ${rec.address.county}`.toLowerCase()
      if (!haystack.includes(q)) return false
    }
    return true
  })

  const total = results.length
  const offset = decodeCursor(searchParams.get('cursor'))
  const page = results.slice(offset, offset + limit)
  const nextOffset = offset + limit
  const hasMore = nextOffset < total

  return NextResponse.json(
    {
      data: page,
      pagination: {
        cursor: hasMore ? encodeCursor(nextOffset) : null,
        hasMore,
        total,
        limit,
      },
    },
    {
      headers: {
        'Cache-Control': 'public, max-age=60',
        ...rateHeaders,
      },
    }
  )
}
