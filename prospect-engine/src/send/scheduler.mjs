// Auto-send scheduler. Sends APPROVED step-0 drafts and auto-sends follow-ups when
// no reply has been logged — respecting warm-up, daily cap, ET business hours,
// suppression, and per-send email verification. Defaults to DRY-RUN (logs what it
// WOULD send) unless RESEND_API_KEY + SEND_LIVE=1 are both set.
//
//   npm run send            # dry-run by default (safe)
//   RESEND_API_KEY=... SEND_LIVE=1 npm run send   # actually sends
import { SEND } from '../config.mjs'
import { getDb, isSuppressed, addSuppression, setStatus, logEvent } from '../db.mjs'
import { sleep, nowIso, normalizeDomain } from '../util.mjs'
import { sendViaResend, getResendStatus } from './resend.mjs'
import { isSendable } from './verify-email.mjs'

const DAY_MS = 86400000
const STOP_EVENTS = ['reply', 'positive_reply', 'unsubscribed', 'bounced', 'won', 'trial']

function etParts(d = new Date()) {
  const wd = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', weekday: 'long' }).format(d)
  const hour = Number(new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', hour: 'numeric', hour12: false }).format(d))
  const map = { Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6 }
  return { day: map[wd], hour: hour % 24 }
}
function inWindow() {
  if (process.env.SEND_IGNORE_WINDOW === '1') return true
  const { day, hour } = etParts()
  const w = SEND.sendWindowET
  return w.days.includes(day) && hour >= w.startHour && hour < w.endHour
}
function realSendsToday(db) {
  return db.prepare(`SELECT COUNT(*) n FROM sends WHERE status NOT IN ('dry-run','failed') AND date(sent_at) = date('now')`).get().n
}
function daysSinceFirstSend(db) {
  const row = db.prepare(`SELECT MIN(sent_at) a FROM sends WHERE status NOT IN ('dry-run','failed')`).get()
  if (!row?.a) return 0
  return Math.floor((Date.now() - new Date(row.a).getTime()) / DAY_MS)
}
function dailyCap(db) {
  return Math.min(SEND.warmup.base + SEND.warmup.step * daysSinceFirstSend(db), SEND.warmup.maxDaily)
}

async function pollStatuses(db) {
  const pending = db.prepare(`SELECT * FROM sends WHERE provider_msg_id IS NOT NULL AND status = 'sent'`).all()
  for (const s of pending) {
    const ev = await getResendStatus(s.provider_msg_id)
    if (!ev) continue
    db.prepare('UPDATE sends SET status = ?, last_checked = ? WHERE id = ?').run(ev, nowIso(), s.id)
    if (ev === 'bounced' || ev === 'complained') {
      logEvent(db, s.prospect_id, ev === 'bounced' ? 'bounced' : 'unsubscribed', 'via Resend')
      if (s.to_email) addSuppression(db, s.to_email, ev)
      setStatus(db, s.prospect_id, 'suppressed')
    }
  }
}

function stoppedSet(db) {
  return new Set(
    db.prepare(`SELECT DISTINCT prospect_id FROM events WHERE type IN (${STOP_EVENTS.map(() => '?').join(',')})`)
      .all(...STOP_EVENTS).map((r) => r.prospect_id),
  )
}

function buildQueue(db, stopped) {
  const queue = []

  // 1) Follow-ups for threads already started (no reply, delay elapsed).
  const step0s = db.prepare(`SELECT prospect_id, MIN(sent_at) at FROM sends WHERE step = 0 AND status NOT IN ('dry-run','failed') GROUP BY prospect_id`).all()
  for (const s of step0s) {
    if (stopped.has(s.prospect_id)) continue
    const maxStep = db.prepare(`SELECT MAX(step) m FROM sends WHERE prospect_id = ? AND status NOT IN ('dry-run','failed')`).get(s.prospect_id).m
    const next = (maxStep ?? 0) + 1
    if (next > SEND.sequenceDelaysDays.length - 1) continue
    const elapsed = (Date.now() - new Date(s.at).getTime()) / DAY_MS
    if (elapsed < SEND.sequenceDelaysDays[next]) continue
    const draft = db.prepare(`SELECT * FROM drafts WHERE prospect_id = ? AND step = ? AND status IN ('draft','approved') ORDER BY id DESC LIMIT 1`).get(s.prospect_id, next)
    if (!draft) continue
    const p = db.prepare('SELECT * FROM prospects WHERE id = ?').get(s.prospect_id)
    queue.push({ kind: 'followup', prospect: p, draft, step: next })
  }

  // 2) New intros: approved step-0 drafts not yet really sent.
  const news = db.prepare(`
    SELECT d.* FROM drafts d
    WHERE d.step = 0 AND d.status = 'approved'
      AND NOT EXISTS (SELECT 1 FROM sends s WHERE s.prospect_id = d.prospect_id AND s.step = 0 AND s.status NOT IN ('dry-run','failed'))
  `).all()
  for (const draft of news) {
    if (stopped.has(draft.prospect_id)) continue
    const p = db.prepare('SELECT * FROM prospects WHERE id = ?').get(draft.prospect_id)
    queue.push({ kind: 'new', prospect: p, draft, step: 0 })
  }

  return queue // follow-ups first (continue live threads), then new intros
}

export async function runSend(db = getDb()) {
  const dryRun = !(SEND.apiKey && SEND.live)
  if (!dryRun) await pollStatuses(db)

  if (!inWindow()) {
    const { day, hour } = etParts()
    return { dryRun, skipped: `outside send window (ET day=${day} hour=${hour})`, sent: 0 }
  }

  const cap = dailyCap(db)
  let budget = Math.max(0, cap - realSendsToday(db))
  const stopped = stoppedSet(db)
  const queue = buildQueue(db, stopped)

  const result = { dryRun, cap, budgetStart: budget, attempted: 0, sent: 0, skipped: [], queueSize: queue.length }

  for (const item of queue) {
    if (!dryRun && budget <= 0) { result.skipped.push('daily cap reached'); break }
    const p = item.prospect
    const email = p.email
    const domain = p.domain && !p.domain.startsWith('name:') ? p.domain : normalizeDomain(p.website || '')

    if (!email) { result.skipped.push(`${p.company}: no email`); continue }
    if (isSuppressed(db, email, domain)) { setStatus(db, p.id, 'suppressed'); result.skipped.push(`${p.company}: suppressed`); continue }

    const v = await isSendable(email)
    if (!v.ok) {
      if (v.verdict === 'invalid') {
        addSuppression(db, email, `invalid:${v.reason}`) // truly bad address → don't try again
        result.skipped.push(`${p.company}: ${v.reason} (suppressed)`)
      } else {
        result.skipped.push(`${p.company}: ${v.reason} (skipped, will retry)`) // transient DNS → no suppress
      }
      continue
    }

    result.attempted++
    if (dryRun) {
      db.prepare('INSERT INTO sends (prospect_id, draft_id, step, to_email, provider, status, sent_at) VALUES (?,?,?,?,?,?,?)')
        .run(p.id, item.draft.id, item.step, email, SEND.provider, 'dry-run', nowIso())
      result.sent++
      continue
    }

    const res = await sendViaResend({ to: email, subject: item.draft.subject, text: item.draft.body })
    if (res.ok) {
      db.prepare('INSERT INTO sends (prospect_id, draft_id, step, to_email, provider, provider_msg_id, status, sent_at) VALUES (?,?,?,?,?,?,?,?)')
        .run(p.id, item.draft.id, item.step, email, SEND.provider, res.id, 'sent', nowIso())
      db.prepare('UPDATE drafts SET status = ?, sent_at = ? WHERE id = ?').run('sent', nowIso(), item.draft.id)
      logEvent(db, p.id, 'sent', `step ${item.step}`)
      setStatus(db, p.id, 'sent')
      result.sent++
      budget--
      await sleep(SEND.throttleMs)
    } else {
      db.prepare('INSERT INTO sends (prospect_id, draft_id, step, to_email, provider, status, sent_at) VALUES (?,?,?,?,?,?,?)')
        .run(p.id, item.draft.id, item.step, email, SEND.provider, 'failed', nowIso())
      result.skipped.push(`${p.company}: send failed (${res.error})`)
    }
  }
  return result
}

if (process.argv[1]?.endsWith('scheduler.mjs')) {
  const r = await runSend()
  console.log('━━ auto-send run ━━')
  console.log(`mode: ${r.dryRun ? 'DRY-RUN (nothing sent)' : 'LIVE'}`)
  if (typeof r.skipped === 'string') {
    console.log(r.skipped) // e.g. outside send window
  } else {
    console.log(`daily cap: ${r.cap} · queue: ${r.queueSize} · ${r.dryRun ? 'would send' : 'sent'}: ${r.sent}`)
    if (r.skipped.length) {
      console.log(`skipped (${r.skipped.length}):`)
      for (const s of r.skipped.slice(0, 15)) console.log(`  - ${s}`)
    }
  }
  if (r.dryRun) console.log('\nTo go live: verify a sending subdomain in Resend, set RESEND_API_KEY + SEND_LIVE=1, then Approve step-0 drafts in /prospects. See DELIVERABILITY.md.')
}
