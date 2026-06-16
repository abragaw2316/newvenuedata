import { NextResponse } from 'next/server'
import { getAllLicenses } from '@/lib/server-data'
import { guardApi } from '@/lib/api-auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * GET /api/licenses/:id
 *
 * Live mirror of the documented `GET /v1/licenses/:id` endpoint. Looks the
 * record up by `id` or by `licenseNumber` across the full license universe.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, headers: rateHeaders } = await guardApi(request)
  if (error) return error

  const { id } = await params

  const licenses = await getAllLicenses()
  const record = licenses.find(
    (rec) => rec.id === id || rec.licenseNumber === id
  )

  if (!record) {
    return NextResponse.json(
      {
        error: {
          type: 'not_found',
          message: `No license found with id or license number '${id}'.`,
        },
      },
      { status: 404 }
    )
  }

  return NextResponse.json(
    { data: record },
    {
      headers: {
        'Cache-Control': 'public, max-age=60',
        ...rateHeaders,
      },
    }
  )
}
