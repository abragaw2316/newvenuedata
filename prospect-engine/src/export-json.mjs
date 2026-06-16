// Export a ranked snapshot of prospects (+ score + top draft subject) to JSON.
// A portable backup / handoff artifact. The dashboard reads SQLite directly; this
// is for sharing, diffing, or feeding other tools. Excludes suppressed contacts.
import { writeFileSync } from 'node:fs'
import { PATHS } from './config.mjs'
import { getDb } from './db.mjs'

export function exportJson(db = getDb()) {
  const rows = db.prepare(`
    SELECT p.id, p.company, p.county, p.city, p.website, p.email, p.phone, p.segment,
           p.writes_liquor_liability, p.status, s.fit_score, s.confidence
    FROM prospects p LEFT JOIN scores s ON s.prospect_id = p.id
    WHERE p.status != 'suppressed'
    ORDER BY COALESCE(s.fit_score,-1) DESC, COALESCE(s.confidence,0) DESC
  `).all()
  const payload = {
    generatedFields: 'company, county, score, contact, status (DRAFTS reviewed in the /prospects dashboard)',
    attribution: 'Some records discovered via OpenStreetMap (© OpenStreetMap contributors, ODbL).',
    count: rows.length,
    prospects: rows,
  }
  writeFileSync(PATHS.exportJson, JSON.stringify(payload, null, 2))
  return { file: 'data/prospects.json', count: rows.length }
}

if (process.argv[1]?.endsWith('export-json.mjs')) {
  const r = exportJson()
  console.log(`✓ exported ${r.count} prospects → ${r.file}`)
}
