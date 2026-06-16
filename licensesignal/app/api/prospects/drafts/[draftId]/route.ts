import { NextResponse } from 'next/server'
import { isProspectsEnabled, updateDraft } from '@/lib/prospects-db'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// PATCH: edit a draft's { subject, body } and/or set { status: 'approved' | 'sent' | 'skipped' }.
export async function PATCH(request: Request, { params }: { params: Promise<{ draftId: string }> }) {
  if (!isProspectsEnabled()) return NextResponse.json({ error: 'not found' }, { status: 404 })
  const { draftId } = await params
  const body = await request.json().catch(() => ({}))
  const updated = await updateDraft(Number(draftId), {
    subject: typeof body.subject === 'string' ? body.subject : undefined,
    body: typeof body.body === 'string' ? body.body : undefined,
    status: typeof body.status === 'string' ? body.status : undefined,
  })
  if (!updated) return NextResponse.json({ error: 'not found' }, { status: 404 })
  return NextResponse.json(updated)
}
