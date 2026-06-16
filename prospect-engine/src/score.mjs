// 0–100 buyer-fit scoring, adapted from research/phase-5-scoring.md.
// Transparent rules engine — every prospect's points are explainable + stored.
import { SCORE_WEIGHTS, COUNTIES } from './config.mjs'
import { getDb, setStatus } from './db.mjs'
import { nowIso } from './util.mjs'

const BEACHHEAD = new Set(COUNTIES.map((c) => c.name))

export function scoreProspect(p) {
  const signals = p.tech_signals ? JSON.parse(p.tech_signals) : []
  const w = SCORE_WEIGHTS
  const dims = {}

  // 1. Writes liquor-liability / hospitality (strongest fit signal)
  dims.writesLiquorLiability = p.writes_liquor_liability
    ? w.writesLiquorLiability
    : signals.includes('hospitality') ? Math.round(w.writesLiquorLiability * 0.4) : 0

  // 2. Beachhead geography
  dims.beachheadGeography = BEACHHEAD.has(p.county) ? w.beachheadGeography : 0

  // 3. Independent agency (penalize national captives)
  dims.independentAgency = signals.includes('captive_brand') ? 0 : w.independentAgency

  // 4. Reachable (public email or contact form + phone)
  const reach = (p.email ? 0.6 : 0) + (p.phone ? 0.25 : 0) + (p.contact_page ? 0.15 : 0)
  dims.reachable = Math.round(w.reachable * Math.min(reach, 1))

  // 5. Live, credible web presence
  dims.webPresence = (p.website && p.description) ? w.webPresence
    : p.website ? Math.round(w.webPresence * 0.5) : 0

  // 6. Specialization (commercial / E&S / nightlife)
  dims.specialization = signals.includes('commercial_specialty') ? w.specialization
    : signals.includes('liquor_liability') ? Math.round(w.specialization * 0.6) : 0

  const fit = Math.min(100, Object.values(dims).reduce((a, b) => a + b, 0))

  // Confidence = how complete the data behind the score is.
  const completeness = [p.website, p.email || p.phone, p.county, p.description, p.tech_signals]
    .filter(Boolean).length / 5
  const confidence = Math.round(completeness * 100) / 100

  return { fit, confidence, dims }
}

export function scoreAll(db = getDb()) {
  // Score everything that's been enriched (or seed rows that skipped enrichment).
  const rows = db.prepare(`
    SELECT * FROM prospects WHERE status IN ('enriched','discovered')
  `).all()
  const upsert = db.prepare(`
    INSERT INTO scores (prospect_id, fit_score, confidence, dimensions, scored_at)
    VALUES (?,?,?,?,?)
    ON CONFLICT(prospect_id) DO UPDATE SET
      fit_score=excluded.fit_score, confidence=excluded.confidence,
      dimensions=excluded.dimensions, scored_at=excluded.scored_at
  `)
  for (const p of rows) {
    const s = scoreProspect(p)
    upsert.run(p.id, s.fit, s.confidence, JSON.stringify(s.dims), nowIso())
    setStatus(db, p.id, 'scored')
  }
  return { scored: rows.length }
}

if (process.argv[1]?.endsWith('score.mjs')) {
  const db = getDb()
  const r = scoreAll(db)
  const top = db.prepare(`
    SELECT p.company, p.county, s.fit_score, s.confidence
    FROM scores s JOIN prospects p ON p.id = s.prospect_id
    ORDER BY s.fit_score DESC, s.confidence DESC LIMIT 12
  `).all()
  console.log(`✓ scored ${r.scored} prospects. Top 12:`)
  for (const t of top) console.log(`  ${String(t.fit_score).padStart(3)}  (${t.confidence})  ${t.company} [${t.county || '—'}]`)
}
