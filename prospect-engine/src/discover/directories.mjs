// Compliant import of directory lists you gather by hand (FAIA members, county
// chambers, association rosters). Drop any CSV into prospect-engine/data/imports/
// and it gets folded into the funnel. This avoids fragile per-site scraping and
// keeps you on the right side of each directory's ToS (export / manual collection).
//
// Recognized headers (case-insensitive, any subset): company|name, website|url,
// email, phone, city, county, area|location, segment, address.
import { readdirSync, readFileSync, existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { PATHS } from '../config.mjs'
import { getDb, upsertProspect } from '../db.mjs'
import { parseCsv, countyFromText } from '../util.mjs'

const IMPORTS_DIR = join(PATHS.dataDir, 'imports')

const pick = (row, keys) => {
  for (const k of Object.keys(row)) {
    if (keys.includes(k.toLowerCase().trim())) return row[k]
  }
  return ''
}

export function importDirectories(db = getDb()) {
  if (!existsSync(IMPORTS_DIR)) {
    mkdirSync(IMPORTS_DIR, { recursive: true })
    return { files: 0, inserted: 0, updated: 0 }
  }
  const files = readdirSync(IMPORTS_DIR).filter((f) => f.toLowerCase().endsWith('.csv'))
  let inserted = 0
  let updated = 0
  for (const file of files) {
    const rows = parseCsv(readFileSync(join(IMPORTS_DIR, file), 'utf8'))
    for (const r of rows) {
      const company = pick(r, ['company', 'name', 'agency', 'business'])
      if (!company) continue
      const area = pick(r, ['area', 'location']) || pick(r, ['city'])
      const res = upsertProspect(db, {
        company,
        website: pick(r, ['website', 'url', 'site']),
        email: pick(r, ['email']),
        phone: pick(r, ['phone', 'telephone']),
        address: pick(r, ['address']) || area,
        city: pick(r, ['city']),
        county: pick(r, ['county']) || countyFromText(area),
        segment: pick(r, ['segment']) || 'Agency',
        source: `directory:${file}`,
        status: 'discovered',
      })
      res.inserted ? inserted++ : updated++
    }
    console.log(`  ${file}: ${rows.length} rows → ${inserted} total new so far`)
  }
  return { files: files.length, inserted, updated }
}

if (process.argv[1]?.endsWith('directories.mjs')) {
  const r = importDirectories()
  console.log(`✓ directory import: ${r.files} file(s), ${r.inserted} inserted, ${r.updated} updated`)
}
