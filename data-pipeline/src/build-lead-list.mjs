// Build the buyer-validation SAMPLE LEAD LIST: recent South-Florida NEW liquor
// license filings — the exact artifact to put in front of liquor-liability
// insurance agents (TODO-C). These are brand-new venues that just got licensed
// to serve alcohol and therefore need dram-shop / liquor-liability coverage NOW.
//
//   node src/build-lead-list.mjs            # default: 25 on-premises South-FL leads
//   node src/build-lead-list.mjs 40         # custom count
//   node src/build-lead-list.mjs 25 "Palm Beach"   # ONE county (a single-county subscriber)
//
// Output → validation/south-fl-new-liquor-leads.{csv,json}
// Compliance: Florida Ch. 119 PUBLIC records, B2B business-entity data, FCRA-safe
// (about venues, not consumer eligibility). Used here for prospecting/marketing,
// not an eligibility decision. See data-pipeline/SOURCES.md.
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { PATHS } from './config.mjs'

const out = (n) => fileURLToPath(new URL(n, PATHS.out))
const VALIDATION_DIR = fileURLToPath(new URL('../../validation/', import.meta.url))
const LIMIT = Number(process.argv[2]) || 25
// Optional 3rd arg: restrict to ONE county (for a single-county subscriber).
// e.g. `node src/build-lead-list.mjs 25 "Palm Beach"`. Default = all of South FL.
const wantCounty = (process.argv[3] || '').trim().toLowerCase().replace(/^dade$/, 'miami-dade')
const SOUTH_FL = new Set(['Broward', 'Miami-Dade', 'Palm Beach', 'Dade'])
const asOf = '2026-06-15'

function titleCase(s) {
  if (!s) return ''
  return String(s)
    .toLowerCase()
    .replace(/\b([a-z])/g, (_m, c) => c.toUpperCase())
    .replace(/\b(Llc|Inc|Lp|Llp|Pa|Pllc|Bbq|Usa|Ii|Iii|Iv|Ne|Nw|Se|Sw|N|S|E|W)\b/g, (m) => m.toUpperCase())
    .replace(/'([A-Z])/g, (m, c) => "'" + c.toLowerCase())
}

function realAddr(r) {
  const a = r.address || {}
  return a.street && !/INACTIVE|NO\s|UNKNOWN/i.test(a.street) && a.city && a.zip && /^\d{5}/.test(a.zip)
}

// On-premises service = the dram-shop exposure that drives liquor-liability demand.
const isOnPremises = (label) => /on premises|on\/off premises|catering|full liquor/i.test(label || '')

const abt = JSON.parse(await readFile(out('normalized-abt_retail.json'), 'utf8'))

const pool = abt
  .filter((r) => r.eventType === 'new_filing' && realAddr(r))
  .filter((r) => SOUTH_FL.has(r.address.county))
  .map((r) => {
    const label = r._seriesLabel || r._series || ''
    return {
      businessName: titleCase(r.dbaName || r.businessName || r.legalName),
      licenseType: label,
      onPremises: isOnPremises(label) ? 'Yes' : 'No',
      licenseNumber: r.licenseNumber,
      street: titleCase(r.address.street),
      city: titleCase(r.address.city),
      county: r.address.county === 'Dade' ? 'Miami-Dade' : r.address.county,
      zip: (r.address.zip || '').slice(0, 5),
      filedDate: r.filedDate || '',
      licenseExpires: r._expirationDate || '',
      licensee: titleCase(r.legalName || r.businessName),
      source: 'FL DBPR — Alcoholic Beverages & Tobacco',
    }
  })

// Optionally narrow to a single county (for a one-county subscriber's weekly list).
const scoped = wantCounty ? pool.filter((r) => r.county.toLowerCase() === wantCounty) : pool

// Prioritize on-premises venues (the agent's real targets), freshest filings first.
const onPrem = scoped.filter((r) => r.onPremises === 'Yes').sort((a, b) => b.filedDate.localeCompare(a.filedDate))
const offPrem = scoped.filter((r) => r.onPremises === 'No').sort((a, b) => b.filedDate.localeCompare(a.filedDate))
const leads = [...onPrem, ...offPrem].slice(0, LIMIT)

// ── emit ──────────────────────────────────────────────────────────────────────
const COLUMNS = [
  ['businessName', 'Business Name'],
  ['licenseType', 'License Type'],
  ['onPremises', 'Serves On-Premises'],
  ['licenseNumber', 'License #'],
  ['street', 'Street'],
  ['city', 'City'],
  ['county', 'County'],
  ['zip', 'ZIP'],
  ['filedDate', 'Filed Date'],
  ['licenseExpires', 'License Expires'],
  ['licensee', 'Licensee (Legal Name)'],
  ['source', 'Source'],
]
const csvCell = (v) => {
  const s = String(v ?? '')
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}
const csv = [
  COLUMNS.map(([, h]) => csvCell(h)).join(','),
  ...leads.map((r) => COLUMNS.map(([k]) => csvCell(r[k])).join(',')),
].join('\r\n')

await mkdir(VALIDATION_DIR, { recursive: true })
await writeFile(VALIDATION_DIR + 'south-fl-new-liquor-leads.csv', csv + '\r\n', 'utf8')
await writeFile(VALIDATION_DIR + 'south-fl-new-liquor-leads.json', JSON.stringify(leads, null, 2), 'utf8')

const byCounty = leads.reduce((m, r) => ((m[r.county] = (m[r.county] || 0) + 1), m), {})
const dates = leads.map((r) => r.filedDate).filter(Boolean).sort()
console.log(`✓ wrote ${leads.length} leads → validation/south-fl-new-liquor-leads.csv (+ .json)`)
console.log(`  counties: ${Object.entries(byCounty).map(([k, v]) => `${k} ${v}`).join(', ')}`)
console.log(`  on-premises: ${leads.filter((r) => r.onPremises === 'Yes').length}/${leads.length}`)
console.log(`  filed-date range: ${dates[0]} … ${dates[dates.length - 1]}`)
console.log(`  scope: ${wantCounty ? process.argv[3] : 'all South FL'} — pool available (new filings, real addr): ${scoped.length}`)
