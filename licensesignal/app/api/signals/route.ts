import { NextResponse } from 'next/server'
import { SIGNAL_UNIVERSE } from '@/lib/signals'
import { getAllSignals } from '@/lib/server-data'
import { guardApi } from '@/lib/api-auth'
import type { SignalSource } from '@/lib/types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * GET /api/signals
 *
 * The unified Florida business-opening feed across every acquired source:
 * licenses, new-business registrations, commercial building permits, and
 * retail-food establishments. Serves the full signal universe via the runtime
 * flat-file loader.
 *
 * Query params: source (license|registration|permit|retail_food), q, limit, cursor
 */
const VALID: SignalSource[] = ['license', 'registration', 'permit', 'retail_food']
const MAX = 50

function decode(c: string | null): number {
  if (!c) return 0
  const n = Number(Buffer.from(c, 'base64').toString('utf-8'))
  return Number.isFinite(n) && n >= 0 ? n : 0
}
const encode = (n: number) => Buffer.from(String(n)).toString('base64')

export async function GET(request: Request) {
  const { error, headers: rateHeaders } = await guardApi(request)
  if (error) return error

  const { searchParams } = new URL(request.url)
  const source = searchParams.get('source') as SignalSource | null
  const q = searchParams.get('q')?.toLowerCase()
  const limit = Math.min(Math.max(Number(searchParams.get('limit') ?? 20) || 20, 1), MAX)

  let results = await getAllSignals()
  if (source && VALID.includes(source)) results = results.filter((s) => s.signalType === source)
  if (q) {
    results = results.filter((s) =>
      `${s.businessName} ${s.city} ${s.county} ${s.category}`.toLowerCase().includes(q)
    )
  }

  const total = results.length
  const offset = decode(searchParams.get('cursor'))
  const page = results.slice(offset, offset + limit)
  const hasMore = offset + limit < total

  return NextResponse.json(
    {
      data: page,
      pagination: { cursor: hasMore ? encode(offset + limit) : null, hasMore, total, limit },
      universe: SIGNAL_UNIVERSE,
    },
    { headers: { 'Cache-Control': 'public, max-age=300', ...rateHeaders } }
  )
}
