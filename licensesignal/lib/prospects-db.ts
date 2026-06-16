// Read/write access to the prospect-engine SQLite DB for the INTERNAL /prospects
// dashboard. Gated: never enabled on the public production deploy (see isProspectsEnabled).
// Uses Node's built-in node:sqlite (Node >= 22.5) via lazy `any` import so it works
// regardless of @types/node version. Node runtime only.
import path from 'node:path'

/** The dashboard is an internal tool — keep it OFF on the public Vercel deploy. */
export function isProspectsEnabled(): boolean {
  return process.env.NODE_ENV !== 'production' || process.env.ENABLE_PROSPECTS === '1'
}

const DB_PATH =
  process.env.PROSPECTS_DB ||
  path.resolve(process.cwd(), '..', 'prospect-engine', 'data', 'prospects.db')

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _db: any = null

async function db() {
  if (_db) return _db
  // Silence the one experimental warning node:sqlite emits on import.
  const origEmit = process.emit
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(process as any).emit = function (name: string, warning: any, ...rest: any[]) {
    if (name === 'warning' && warning?.name === 'ExperimentalWarning' && /SQLite/i.test(String(warning?.message))) return false
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (origEmit as any).call(this, name, warning, ...rest)
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { DatabaseSync } = (await import('node:sqlite')) as any
  _db = new DatabaseSync(DB_PATH, { readOnly: false })
  return _db
}

const nowIso = () => new Date().toISOString()

export interface ProspectRow {
  id: number
  company: string
  county: string | null
  city: string | null
  website: string | null
  email: string | null
  phone: string | null
  segment: string | null
  status: string
  writes_liquor_liability: number
  fit_score: number | null
  confidence: number | null
}

export async function listProspects(opts: { q?: string; county?: string; status?: string; min?: number } = {}): Promise<ProspectRow[]> {
  const d = await db()
  const where: string[] = []
  const args: unknown[] = []
  if (opts.q) { where.push('(p.company LIKE ? OR p.email LIKE ? OR p.website LIKE ?)'); const v = `%${opts.q}%`; args.push(v, v, v) }
  if (opts.county) { where.push('p.county = ?'); args.push(opts.county) }
  if (opts.status) { where.push('p.status = ?'); args.push(opts.status) }
  if (opts.min != null) { where.push('COALESCE(s.fit_score,0) >= ?'); args.push(opts.min) }
  const sql = `
    SELECT p.id, p.company, p.county, p.city, p.website, p.email, p.phone, p.segment, p.status,
           p.writes_liquor_liability, s.fit_score, s.confidence
    FROM prospects p LEFT JOIN scores s ON s.prospect_id = p.id
    ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
    ORDER BY COALESCE(s.fit_score,-1) DESC, COALESCE(s.confidence,0) DESC, p.company ASC
  `
  return d.prepare(sql).all(...args) as ProspectRow[]
}

export async function getProspect(id: number) {
  const d = await db()
  const prospect = d.prepare('SELECT * FROM prospects WHERE id = ?').get(id)
  if (!prospect) return null
  const score = d.prepare('SELECT * FROM scores WHERE prospect_id = ?').get(id) || null
  const research = d.prepare('SELECT * FROM research WHERE prospect_id = ?').get(id) || null
  const drafts = d.prepare('SELECT * FROM drafts WHERE prospect_id = ? ORDER BY step ASC').all(id)
  const events = d.prepare('SELECT * FROM events WHERE prospect_id = ? ORDER BY at DESC').all(id)
  return { prospect, score, research, drafts, events }
}

export async function funnelCounts(): Promise<Record<string, number>> {
  const d = await db()
  const rows = d.prepare('SELECT status, COUNT(*) n FROM prospects GROUP BY status').all() as { status: string; n: number }[]
  const out: Record<string, number> = {}
  for (const r of rows) out[r.status] = r.n
  return out
}

export async function setProspectStatus(id: number, status: string) {
  const d = await db()
  d.prepare('UPDATE prospects SET status = ?, updated_at = ? WHERE id = ?').run(status, nowIso(), id)
}

export async function updateDraft(draftId: number, fields: { subject?: string; body?: string; status?: string }) {
  const d = await db()
  const draft = d.prepare('SELECT * FROM drafts WHERE id = ?').get(draftId)
  if (!draft) return null
  const subject = fields.subject ?? draft.subject
  const body = fields.body ?? draft.body
  const status = fields.status ?? draft.status
  const sentAt = status === 'sent' ? nowIso() : draft.sent_at
  d.prepare('UPDATE drafts SET subject = ?, body = ?, status = ?, sent_at = ? WHERE id = ?')
    .run(subject, body, status, sentAt, draftId)
  if (status === 'sent') {
    d.prepare('INSERT INTO events (prospect_id, type, detail, at) VALUES (?,?,?,?)')
      .run(draft.prospect_id, 'sent', `step ${draft.step}`, nowIso())
    d.prepare('UPDATE prospects SET status = ?, updated_at = ? WHERE id = ?').run('sent', nowIso(), draft.prospect_id)
  }
  return d.prepare('SELECT * FROM drafts WHERE id = ?').get(draftId)
}

const SUPPRESS_TYPES = new Set(['unsubscribed', 'bounced'])

export async function addEvent(prospectId: number, type: string, detail = '') {
  const d = await db()
  d.prepare('INSERT INTO events (prospect_id, type, detail, at) VALUES (?,?,?,?)').run(prospectId, type, detail, nowIso())
  // Outcome → advance prospect status so the funnel reflects reality.
  const statusByType: Record<string, string> = {
    reply: 'replied', positive_reply: 'replied', trial: 'trial', won: 'won',
    unsubscribed: 'suppressed', bounced: 'suppressed',
  }
  if (statusByType[type]) d.prepare('UPDATE prospects SET status = ?, updated_at = ? WHERE id = ?').run(statusByType[type], nowIso(), prospectId)
  if (SUPPRESS_TYPES.has(type)) {
    const p = d.prepare('SELECT email, domain FROM prospects WHERE id = ?').get(prospectId)
    const val = (p?.email || p?.domain || '').toLowerCase()
    if (val) {
      d.prepare('INSERT OR IGNORE INTO suppression (value, reason, at) VALUES (?,?,?)').run(val, type, nowIso())
    }
  }
}
