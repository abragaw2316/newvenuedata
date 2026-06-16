// Seed the prospect DB from the hand-curated validation/prospect-list.csv (26 agencies).
// These are the warmest, already-vetted buyers — they start the funnel.
import { readFileSync } from 'node:fs'
import { PATHS } from '../config.mjs'
import { getDb, upsertProspect } from '../db.mjs'
import { parseCsv, countyFromText } from '../util.mjs'

export function seedImport(db = getDb()) {
  const text = readFileSync(PATHS.seedCsv, 'utf8')
  const rows = parseCsv(text)
  let inserted = 0
  let updated = 0

  for (const r of rows) {
    const company = r['Company']
    if (!company) continue
    const area = r['Area'] || ''
    const llRaw = (r['Writes Bar/Restaurant Liquor Liability'] || '').toLowerCase()
    const writesLL = llRaw.startsWith('yes')

    const res = upsertProspect(db, {
      company,
      website: r['Website'] || '',
      email: r['Email'] || '',
      phone: r['Phone'] || '',
      city: '',
      county: countyFromText(area),
      address: area, // freeform area string; refined later by enrichment
      writes_liquor_liability: writesLL,
      ll_confidence: writesLL ? 0.9 : 0, // human-verified in the curated list
      // surface the parenthetical specialty note (e.g. "Yes (nightclubs/bars)") as description
      description: r['Writes Bar/Restaurant Liquor Liability'] || null,
      segment: r['Segment'] || null,
      source: 'seed:prospect-list.csv',
      source_url: r['Website'] || null,
      status: 'discovered',
    })
    res.inserted ? inserted++ : updated++
  }
  return { inserted, updated, total: rows.length }
}

// Run directly: `npm run seed`
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('seed-import.mjs')) {
  const db = getDb()
  const { inserted, updated, total } = seedImport(db)
  console.log(`✓ seed import: ${inserted} inserted, ${updated} updated (from ${total} CSV rows)`)
  const sample = db.prepare('SELECT id, company, county, writes_liquor_liability FROM prospects ORDER BY id LIMIT 5').all()
  console.log('  first rows:', sample.map((s) => `${s.id}:${s.company} [${s.county || '—'}]`).join(' | '))
}
