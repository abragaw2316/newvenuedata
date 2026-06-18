import { NextResponse } from 'next/server'
import { getAllLicenses } from '@/lib/server-data'
import { guardApi } from '@/lib/api-auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * GET /api/licenses/search?q=...
 *
 * Full-text search across business name, DBA/legal name, city, and county over
 * the full license universe. Mirrors the documented `GET /v1/licenses/search`
 * endpoint.
 */
export async function GET(request: Request) {
  const { error, headers: rateHeaders } = await guardApi(request)
  if (error) return error

  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.trim().toLowerCase()
  const county = searchParams.get('county')?.toLowerCase()
  const licenseType = searchParams.get('license_type')?.toUpperCase()
  const status = searchParams.get('status')?.toLowerCase()
  const rawLimit = Number(searchParams.get('limit') ?? 25)
  const limit = Number.isFinite(rawLimit) ? Math.min(Math.max(Math.trunc(rawLimit), 1), 100) : 25

  if (!q) {
    return NextResponse.json(
      {
        error: {
          type: 'invalid_request',
          message: "The 'q' query parameter is required.",
        },
      },
      { status: 400 }
    )
  }

  const licenses = await getAllLicenses()
  const matches = licenses.filter((rec) => {
    if (county && rec.address.county.toLowerCase() !== county) return false
    if (licenseType && rec.licenseType.toUpperCase() !== licenseType) return false
    if (status && rec.status.toLowerCase() !== status) return false
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
    return haystack.includes(q)
  }).slice(0, limit)

  return NextResponse.json(
    {
      data: matches,
      query: q,
      count: matches.length,
    },
    { headers: { 'Cache-Control': 'public, max-age=60', ...rateHeaders } }
  )
}
