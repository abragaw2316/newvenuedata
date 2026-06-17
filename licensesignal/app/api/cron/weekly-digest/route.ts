// Weekly digest sender. Emails every paid account a summary of this week's new
// filings. BUILD-SAFE + SECRET-GATED: does nothing unless CRON_SECRET + a DB +
// RESEND_API_KEY are all set, and the caller presents the secret.
//
// To turn on (free): set CRON_SECRET in Vercel, then trigger every Monday via
// Vercel Cron (add to vercel.json) OR a free GitHub Action that curls:
//   curl -H "Authorization: Bearer $CRON_SECRET" https://newvenuedata.com/api/cron/weekly-digest
//
// Note: this is the email *digest* (counts + highlights). The detailed per-county
// .xlsx is still the concierge hand-send until per-user county prefs are stored.
import { sql, ensureSchema, dbConfigured } from '@/lib/db'
import { sendEmail, weeklyDigestEmail } from '@/lib/email'
import { getAllLicenses } from '@/lib/server-data'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function authorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  const auth = req.headers.get('authorization') || ''
  const key = new URL(req.url).searchParams.get('key') || ''
  return auth === `Bearer ${secret}` || key === secret
}

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } })

export async function GET(req: Request): Promise<Response> {
  if (!authorized(req)) return new Response('unauthorized', { status: 401 })
  if (!dbConfigured()) return json({ ok: false, reason: 'db-not-configured' })
  if (!process.env.RESEND_API_KEY) return json({ ok: false, reason: 'email-not-configured' })

  // This week's new filings (last 7 days), statewide summary for the digest.
  const licenses = await getAllLicenses()
  const cutoff = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10)
  const fresh = licenses.filter((l) => l.eventType === 'new_filing' && (l.filedDate || '') >= cutoff)
  const dates = fresh.map((l) => l.filedDate).filter(Boolean).sort()
  const filedRange = dates.length ? `${dates[0]} – ${dates[dates.length - 1]}` : 'this week'
  const highlights = fresh
    .slice(0, 5)
    .map((l) => [l.businessName || 'New venue', l.address?.city].filter(Boolean).join(' — '))

  await ensureSchema()
  const { rows } = await sql`SELECT email, name, plan FROM users WHERE plan <> 'trial'`
  const recipients = rows as { email: string; name: string | null; plan: string }[]

  let sent = 0
  for (const r of recipients) {
    const region = r.plan === 'south_fl' ? 'South Florida' : r.plan === 'statewide' ? 'Florida' : 'your county'
    const { subject, html } = weeklyDigestEmail({
      name: r.name || undefined,
      region,
      count: fresh.length,
      filedRange,
      highlights,
    })
    const res = await sendEmail({ to: r.email, subject, html })
    if (res.ok) sent++
  }

  return json({ ok: true, recipients: recipients.length, sent, newFilings: fresh.length })
}
