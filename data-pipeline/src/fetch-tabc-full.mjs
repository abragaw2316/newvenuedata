// Full per-record Texas TABC ingestion (state #2). Pulls every TABC license from
// data.texas.gov (Socrata 7hf9-qc9f) via curl, normalizes to the LicenseRecord
// shape (state 'TX'; native TABC license-type codes kept — they are jurisdiction-
// specific, like FL's), and emits:
//   • data/out/normalized-tabc.json        (raw normalized, traceability)
//   • licensesignal/data/licenses-tx.json   (compact — served by /api/licenses?state=TX)
//   • licensesignal/lib/tx-county-stats.ts  (real per-county aggregates for /coverage/texas)
//
//   node src/fetch-tabc-full.mjs
//
// Socrata sits behind Cloudflare (403s Node fetch) so we shell out to curl, and
// build the URL manually (URLSearchParams would break the leading `$`). No
// geocoding (coords null — consistent with the FL full set).
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { writeFile, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const exec = promisify(execFile)
const BASE = 'https://data.texas.gov/resource/7hf9-qc9f.json'
const OUT_DIR = fileURLToPath(new URL('../data/out/', import.meta.url))
const APP_DATA = fileURLToPath(new URL('../../licensesignal/data/licenses-tx.json', import.meta.url))
const TX_STATS = fileURLToPath(new URL('../../licensesignal/lib/tx-county-stats.ts', import.meta.url))
const asOf = '2026-06-15'
const PAGE = 50000
const CITY_MIN = 25
const COUNTY_MIN = 25

const titleCase = (s) =>
  String(s || '')
    .toLowerCase()
    .replace(/\b([a-z])/g, (_m, c) => c.toUpperCase())
const slugify = (s) =>
  String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const toISO = (s) => (s ? String(s).slice(0, 10) : '')

function mapStatus(raw) {
  const s = String(raw || '').toLowerCase()
  if (s.includes('active')) return 'active'
  if (s.includes('pending')) return 'pending'
  if (s.includes('expired')) return 'expired'
  if (s.includes('suspend')) return 'suspended'
  if (s.includes('cancel') || s.includes('inactive')) return 'cancelled'
  return 'active'
}

async function soda(query) {
  const { stdout } = await exec('curl', ['-s', '--max-time', '120', `${BASE}?${query}`], {
    maxBuffer: 512 * 1024 * 1024,
  })
  return JSON.parse(stdout)
}

console.log('Fetching full Texas TABC dataset (paginated)…')
const raw = []
for (let offset = 0; ; offset += PAGE) {
  const page = await soda(`$limit=${PAGE}&$offset=${offset}&$order=license_id`)
  raw.push(...page)
  console.log(`  fetched ${raw.length}…`)
  if (page.length < PAGE) break
}

const start = Date.parse(asOf) - 120 * 86_400_000
const records = raw.map((r) => {
  const issued = toISO(r.original_issue_date || r.current_issued_date)
  const t = Date.parse(issued)
  const isNew = !Number.isNaN(t) && t >= start && t <= Date.parse(asOf)
  return {
    id: `tx_${r.license_id || r.master_file_id}`,
    licenseNumber: String(r.license_id || r.master_file_id || ''),
    licenseType: String(r.license_type || '').trim() || 'NA', // native TABC code
    status: mapStatus(r.primary_status),
    businessName: titleCase(r.trade_name || r.owner),
    legalName: titleCase(r.owner || r.trade_name),
    dbaName: r.trade_name ? titleCase(r.trade_name) : null,
    address: {
      street: titleCase(r.address || ''),
      city: titleCase(r.city || ''),
      county: titleCase(r.county || ''),
      state: 'TX',
      zip: String(r.zip || '').slice(0, 5),
      lat: null,
      lng: null,
    },
    filedDate: issued || asOf,
    effectiveDate: issued || null,
    expirationDate: toISO(r.expiration_date) || null,
    issuedDate: issued || null,
    eventType: isNew ? 'new_filing' : 'renewal',
    eventTimestamp: (issued || asOf) + 'T00:00:00Z',
    sourceUrl: 'https://data.texas.gov/dataset/TABC-License-Information/7hf9-qc9f',
  }
})

// The full per-record set is ~72 MB — too large to commit + bundle into a
// serverless function in the flat-file stopgap. So the API (/api/licenses?state=TX)
// serves a RECENT-ACTIVE SAMPLE; the /coverage/texas aggregates below use the FULL
// set (real statewide counts). Full per-record TX in the API is the DB migration
// (handoff TODO-D) — a 124k-row second state is what finally outgrows flat files.
const API_SAMPLE_LIMIT = 15000
const apiSample = records
  .filter((r) => r.status === 'active')
  .sort((a, b) => (b.issuedDate || '').localeCompare(a.issuedDate || ''))
  .slice(0, API_SAMPLE_LIMIT)

await mkdir(OUT_DIR, { recursive: true })
await writeFile(OUT_DIR + 'normalized-tabc.json', JSON.stringify(records), 'utf8')
await writeFile(APP_DATA, JSON.stringify(apiSample), 'utf8')

// ── per-county aggregates for /coverage/texas ────────────────────────────────
const byCounty = new Map()
for (const r of records) {
  const slug = slugify(r.address.county)
  if (!slug) continue
  let c = byCounty.get(slug)
  if (!c) {
    c = { name: r.address.county, total: 0, newFilings: 0, byType: {}, cities: new Map() }
    byCounty.set(slug, c)
  }
  c.total++
  if (r.eventType === 'new_filing') c.newFilings++
  c.byType[r.licenseType] = (c.byType[r.licenseType] || 0) + 1
  if (r.address.city) c.cities.set(r.address.city, (c.cities.get(r.address.city) || 0) + 1)
}

const counties = {}
for (const [slug, c] of byCounty) {
  if (c.total < COUNTY_MIN) continue
  counties[slug] = {
    name: c.name,
    total: c.total,
    newFilings: c.newFilings,
    byType: c.byType,
    topCities: [...c.cities.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([city, count]) => ({ city, count })),
  }
}

const banner = `// AUTO-GENERATED by data-pipeline/src/fetch-tabc-full.mjs from the Texas TABC
// public license file (data.texas.gov Socrata 7hf9-qc9f). Real per-county
// aggregates for the /coverage/texas pages. Native TABC license-type codes.
// Sourced ${asOf}. Do not hand-edit — re-run the fetcher.
`
const ts =
  banner +
  `export interface TxCountyDetail {\n  name: string\n  total: number\n  newFilings: number\n  byType: Record<string, number>\n  topCities: { city: string; count: number }[]\n}\n\n` +
  `export const TX_COVERAGE_AS_OF = '${asOf}'\n` +
  `export const TX_TOTAL_RECORDS = ${records.length}\n` +
  `export const TX_COUNTY_DETAIL: Record<string, TxCountyDetail> = ${JSON.stringify(counties, null, 2)}\n\n` +
  `export function getTxCounty(slug: string): TxCountyDetail | undefined {\n  return TX_COUNTY_DETAIL[slug]\n}\n`

await writeFile(TX_STATS, ts, 'utf8')

console.log(`✓ ${records.length} TX records normalized → data/out/normalized-tabc.json (full)`)
console.log(`✓ ${apiSample.length} recent-active sample → data/licenses-tx.json (API ?state=TX)`)
console.log(`✓ ${Object.keys(counties).length} TX counties (>= ${COUNTY_MIN}) → lib/tx-county-stats.ts (full aggregates)`)
console.log(`  new_filing: ${records.filter((r) => r.eventType === 'new_filing').length}`)
