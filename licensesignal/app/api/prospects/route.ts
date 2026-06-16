import { NextResponse } from 'next/server'
import { isProspectsEnabled, listProspects } from '@/lib/prospects-db'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  if (!isProspectsEnabled()) return NextResponse.json({ error: 'not found' }, { status: 404 })
  const { searchParams } = new URL(request.url)
  const rows = await listProspects({
    q: searchParams.get('q') || undefined,
    county: searchParams.get('county') || undefined,
    status: searchParams.get('status') || undefined,
    min: searchParams.get('min') ? Number(searchParams.get('min')) : undefined,
  })
  return NextResponse.json({ count: rows.length, prospects: rows })
}
