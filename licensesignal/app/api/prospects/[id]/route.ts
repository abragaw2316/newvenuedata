import { NextResponse } from 'next/server'
import { isProspectsEnabled, getProspect, setProspectStatus, addEvent } from '@/lib/prospects-db'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isProspectsEnabled()) return NextResponse.json({ error: 'not found' }, { status: 404 })
  const { id } = await params
  const data = await getProspect(Number(id))
  if (!data) return NextResponse.json({ error: 'not found' }, { status: 404 })
  return NextResponse.json(data)
}

// PATCH: { status } to set prospect status, OR { event: { type, detail } } to log an outcome.
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isProspectsEnabled()) return NextResponse.json({ error: 'not found' }, { status: 404 })
  const { id } = await params
  const body = await request.json().catch(() => ({}))
  if (body.event?.type) {
    await addEvent(Number(id), String(body.event.type), String(body.event.detail || ''))
  } else if (body.status) {
    await setProspectStatus(Number(id), String(body.status))
  } else {
    return NextResponse.json({ error: 'nothing to update' }, { status: 400 })
  }
  return NextResponse.json(await getProspect(Number(id)))
}
