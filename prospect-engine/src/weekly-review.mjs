// Feedback loop: weekly review of outreach outcomes. Surfaces what's converting so
// you can tune the score weights (config.mjs SCORE_WEIGHTS) and the copy templates.
// Measures the REAL signals — replies, positive replies, trials, wins — not opens
// (we deliberately don't use tracking pixels; see DELIVERABILITY.md).
import { getDb } from './db.mjs'

const db = getDb()

const ev = (t) => db.prepare('SELECT COUNT(*) n FROM events WHERE type = ?').get(t).n
const sent = ev('sent')
const replies = ev('reply') + ev('positive_reply')
const positive = ev('positive_reply')
const trials = ev('trial')
const wins = ev('won')
const unsub = ev('unsubscribed')
const bounced = ev('bounced')

const pct = (a, b) => (b ? ((a / b) * 100).toFixed(1) + '%' : '—')

console.log('━━ weekly outreach review ━━')
console.log(`sent           ${sent}`)
console.log(`replies        ${replies}  (${pct(replies, sent)} of sent)`)
console.log(`positive       ${positive}  (${pct(positive, sent)} of sent)`)
console.log(`trials         ${trials}  (${pct(trials, sent)} of sent)`)
console.log(`wins           ${wins}`)
console.log(`unsubscribed   ${unsub}`)
console.log(`bounced        ${bounced}  (${pct(bounced, sent)} of sent)  ← keep low to protect domain`)

// Which segments / counties convert? (positive replies + trials + wins by county)
const byCounty = db.prepare(`
  SELECT p.county, COUNT(*) n FROM events e JOIN prospects p ON p.id = e.prospect_id
  WHERE e.type IN ('positive_reply','trial','won')
  GROUP BY p.county ORDER BY n DESC
`).all()
if (byCounty.length) {
  console.log('\npositive signal by county:')
  for (const r of byCounty) console.log(`  ${r.county || '—'}: ${r.n}`)
}

// Score band of the prospects that responded positively → is the model predictive?
const bands = db.prepare(`
  SELECT CASE WHEN s.fit_score >= 85 THEN '85-100' WHEN s.fit_score >= 60 THEN '60-84' ELSE '<60' END band,
         COUNT(*) n
  FROM events e JOIN prospects p ON p.id = e.prospect_id JOIN scores s ON s.prospect_id = p.id
  WHERE e.type IN ('positive_reply','trial','won')
  GROUP BY band ORDER BY band DESC
`).all()
if (bands.length) {
  console.log('\npositive signal by score band (is the score predictive?):')
  for (const b of bands) console.log(`  ${b.band}: ${b.n}`)
}

console.log('\nTune next: if high scores convert → push the top band harder; if low scores convert too,')
console.log('revisit SCORE_WEIGHTS in src/config.mjs. If a template angle wins, make it the default in copywriter-agent.mjs.')
