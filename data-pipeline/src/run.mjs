// Orchestrator: fetch → parse → normalize → write. Run a small validation set by
// default (keeps it fast); pass --source=<key>, --all, or --fetch-only.
//
//   node src/run.mjs                      # default validation set
//   node src/run.mjs --source=abt_retail  # one source
//   node src/run.mjs --all                # every configured source (heavy)
//   node src/run.mjs --limit=500          # cap rows per source

import { mkdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { SOURCES, PATHS } from './config.mjs'
import { parseCsvObjects } from './csv.mjs'
import { normalizeAbtRow } from './normalize-abt.mjs'
import { normalizeFoodRow } from './normalize-food.mjs'
import { fetchToFile } from './fetch.mjs'
import { todayISO } from './lookups.mjs'

const args = process.argv.slice(2)
const flag = (name) => args.find((a) => a.startsWith(`--${name}`))
const fetchOnly = args.includes('--fetch-only')
const all = args.includes('--all')
const limit = Number((flag('limit') || '').split('=')[1]) || Infinity
const oneSource = (flag('source') || '').split('=')[1]

// Default validation set: the restaurant-opening signal + a small liquor file
// (the big retail file bd4006lic.csv is 10MB+ — opt in with --source=abt_retail).
const DEFAULT_KEYS = ['food_new', 'abt_temp_permits']

const selected = oneSource
  ? SOURCES.filter((s) => s.key === oneSource)
  : all
    ? SOURCES
    : SOURCES.filter((s) => DEFAULT_KEYS.includes(s.key))

function normalizeRows(kind, rows, source, asOf) {
  const out = []
  for (const row of rows) {
    if (out.length >= limit) break
    const rec =
      kind === 'abt'
        ? normalizeAbtRow(row, { asOf, sourceUrl: source.url })
        : normalizeFoodRow(row, { asOf, sourceUrl: source.url, isNew: kind === 'food_new' })
    if (rec.id) out.push(rec)
  }
  return out
}

async function main() {
  const asOf = todayISO()
  await mkdir(fileURLToPath(PATHS.out), { recursive: true })
  console.log(`\n🗂  New Venue Data data pipeline — asOf ${asOf}`)
  console.log(`   sources: ${selected.map((s) => s.key).join(', ') || '(none)'}\n`)

  const summary = []
  for (const source of selected) {
    const destName = source.url.split('/').pop()
    try {
      process.stdout.write(`→ ${source.key.padEnd(20)} fetching ${destName} … `)
      const { text, bytes } = await fetchToFile(source.url, destName)
      const { header, rows } = parseCsvObjects(text)
      console.log(`${(bytes / 1024).toFixed(0)} KB, ${rows.length.toLocaleString()} rows, ${header.length} cols`)

      if (fetchOnly) {
        summary.push({ key: source.key, rows: rows.length, cols: header.length })
        continue
      }

      const normalized = normalizeRows(source.kind, rows, source, asOf)
      const outPath = fileURLToPath(new URL(`normalized-${source.key}.json`, PATHS.out))
      await writeFile(outPath, JSON.stringify(normalized, null, 2), 'utf8')

      const newFilings = normalized.filter((r) => r.eventType === 'new_filing').length
      summary.push({ key: source.key, rows: rows.length, normalized: normalized.length, newFilings, header })

      // Show a couple of real records so it's obvious this is live data.
      console.log(`   ✓ normalized ${normalized.length.toLocaleString()} → ${outPath.split(/[\\/]/).pop()}  (${newFilings} new_filing)`)
      for (const sample of normalized.slice(0, 2)) {
        console.log(
          `     · ${sample.businessName || '(no name)'} — ${sample.licenseType}/${sample._series || sample._source} — ` +
            `${sample.address.city || '?'}, ${sample.address.county || '?'} — filed ${sample.filedDate || 'n/a'} — ${sample.status}`
        )
      }
    } catch (err) {
      console.log(`\n   ✗ ${source.key}: ${err.message}`)
      summary.push({ key: source.key, error: err.message })
    }
  }

  console.log('\n── summary ─────────────────────────────────')
  for (const s of summary) {
    if (s.error) console.log(`   ${s.key}: ERROR ${s.error}`)
    else if (fetchOnly) console.log(`   ${s.key}: ${s.rows} rows / ${s.cols} cols`)
    else console.log(`   ${s.key}: ${s.normalized}/${s.rows} normalized, ${s.newFilings} new filings`)
  }
  // Emit the live header(s) we observed so the parser can be pinned/audited.
  const firstHeader = summary.find((s) => s.header)?.header
  if (firstHeader) console.log(`\n   live header (${summary.find((s) => s.header).key}):\n   ${firstHeader.join(' | ')}`)
  console.log('')
}

main().catch((e) => {
  console.error('pipeline failed:', e)
  process.exit(1)
})
