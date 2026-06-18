// Real lead capture for the marketing forms (waitlist / free-sample / contact).
// Stores the lead in Postgres (works now — the DB is connected) and notifies the
// founder by email (build-safe: the email is a no-op until Resend is configured).
import { sql, ensureSchema, dbConfigured } from '@/lib/db'
import { sendEmail } from '@/lib/email'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const NOTIFY = process.env.LEAD_NOTIFY_EMAIL || 'austin@newvenuedata.com'

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } })

const escapeHtml = (s: string) =>
  s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c] ?? c)

export async function POST(req: Request): Promise<Response> {
  let body: { email?: string; source?: string; note?: string }
  try {
    body = (await req.json()) as typeof body
  } catch {
    return json({ ok: false, error: 'bad-request' }, 400)
  }

  const email = String(body.email || '').trim().toLowerCase()
  const source = String(body.source || 'site').slice(0, 80)
  const note = body.note ? String(body.note).slice(0, 2000) : null
  if (!EMAIL_RE.test(email)) return json({ ok: false, error: 'invalid-email' }, 400)

  let stored = false
  let dbError: string | null = null
  const configured = dbConfigured()
  if (configured) {
    try {
      await ensureSchema()
      await sql`INSERT INTO leads (email, source, note) VALUES (${email}, ${source}, ${note})`
      stored = true
    } catch (e) {
      dbError = e instanceof Error ? e.message.slice(0, 140) : 'insert-failed'
    }
  }

  // Notify the founder so leads get a same-day human follow-up.
  try {
    await sendEmail({
      to: NOTIFY,
      replyTo: email,
      subject: `New lead: ${email} · ${source}`,
      html: `<p>New lead captured on newvenuedata.com.</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}<br/>
        <strong>Source:</strong> ${escapeHtml(source)}${note ? `<br/><strong>Note:</strong> ${escapeHtml(note)}` : ''}</p>`,
    })
  } catch {
    /* email is non-critical — the lead is already stored */
  }

  return json({ ok: true, stored, configured, dbError })
}
