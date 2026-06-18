// Generate the FULL-size API datasets the route handlers serve at runtime:
//   licensesignal/data/licenses.json   — every normalized LicenseRecord
//   licensesignal/data/signals.json    — every unified BusinessSignal
//
// This is the companion to build-app-data.mjs / build-signals.mjs, which emit the
// small *curated* sets bundled into lib/real-data.ts + lib/signals.ts and consumed
// by the UI pages. The flat files written here are read by the API routes via
// lib/server-data.ts (fs at runtime, memoized) and shipped with the serverless
// functions through next.config.ts `outputFileTracingIncludes`. They are too big
// (~37 MB liquor) to bundle into a JS module, but fine to read from disk.
//
//   node src/build-full-data.mjs
//
// The honest long-term home for this volume is a database; the flat file is the
// documented stopgap (see handoff.md TODO-A).
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { PATHS } from './config.mjs'

const out = (n) => fileURLToPath(new URL(n, PATHS.out))
const load = async (n) => {
  try {
    return JSON.parse(await readFile(out(n), 'utf8'))
  } catch {
    return []
  }
}

const APP_DATA_DIR = fileURLToPath(new URL('../../licensesignal/data/', import.meta.url))
const asOf = '2026-06-15'

// ── shared field cleaners (kept consistent with build-app-data.mjs) ───────────
function titleCase(s) {
  if (!s) return ''
  return String(s)
    .toLowerCase()
    .replace(/\b([a-z])/g, (_m, c) => c.toUpperCase())
    .replace(/\b(Llc|Inc|Lp|Llp|Pa|Pllc|Bbq|Usa|Ii|Iii|Iv)\b/g, (m) => m.toUpperCase())
    .replace(/'([A-Z])/g, (m, c) => "'" + c.toLowerCase())
}

// Canonicalize Florida county names so the distinct set is exactly the 67 real
// counties: collapse the Dade→Miami-Dade and Desoto→DeSoto casing duplicates and
// drop unknown / out-of-state / placeholder buckets to '' (never fabricate one).
function canonCounty(raw) {
  const c = (raw || '').trim()
  if (!c) return ''
  if (c === 'Dade' || /^miami-?dade$/i.test(c)) return 'Miami-Dade'
  if (/^desoto$/i.test(c)) return 'DeSoto'
  if (/^(unknown|out of state)/i.test(c) || /^county /i.test(c)) return ''
  return c
}

const money = (n) => (n ? `$${Number(n).toLocaleString()}` : '')

// A normalized record's eventType may be '' for a pre-existing snapshot row. The
// OpenAPI eventType enum has no "snapshot"/"existing" value, so map '' → 'renewal':
// a Florida liquor / food-service license is annual, so a record that is present
// and active in the current extract is, by definition, currently renewed. Records
// that are genuinely new keep 'new_filing', keeping /api/stats newFilings honest.
function eventTypeOf(r) {
  return r.eventType && r.eventType.length ? r.eventType : 'renewal'
}

function toLicenseRecord(r) {
  const rec = {
    id: r.id,
    licenseNumber: r.licenseNumber,
    licenseType: r.licenseType,
    status: r.status,
    businessName: titleCase(r.businessName || r.legalName),
    legalName: titleCase(r.legalName || r.businessName),
    dbaName: r.dbaName ? titleCase(r.dbaName) : null,
    address: {
      street: r.address.street,
      city: titleCase(r.address.city),
      county: canonCounty(r.address.county),
      state: 'FL',
      zip: (r.address.zip || '').slice(0, 5),
      lat: r.address.lat ?? null,
      lng: r.address.lng ?? null,
    },
    filedDate: r.filedDate || asOf,
    effectiveDate: r.effectiveDate || null,
    expirationDate: r._expirationDate || null,
    issuedDate: r.effectiveDate || r.filedDate || null,
    eventType: eventTypeOf(r),
    eventTimestamp: r.eventTimestamp || (r.filedDate || asOf) + 'T00:00:00Z',
    sourceUrl: r.sourceUrl,
  }
  if (r.enrichment && r.enrichment.phone) {
    rec.enrichment = {
      phone: r.enrichment.phone,
      website: r.enrichment.website ?? null,
      naicsCode: null,
      naicsDescription: r._category || null,
      employeeCount: null,
      yearsInBusiness: null,
    }
  }
  return rec
}

// ── full LicenseRecord universe → data/licenses.json ──────────────────────────
const liquor = await load('normalized-abt_retail.json')
const food = await load('normalized-food_new.json')
const fdacs = await load('normalized-fdacs.json')
// Supplemental ABT sources — loaded gracefully; run after pipeline fixes SRX/SFS.
const tempPermits = await load('normalized-abt_temp_permits.json')
const manufacturers = await load('normalized-abt_distributors.json')
const bottleClubs = await load('normalized-abt_bottle_clubs.json')

const records = [...liquor, ...food, ...fdacs, ...tempPermits, ...manufacturers, ...bottleClubs].map(toLicenseRecord)

// Lead the default listing with the valuable trigger data (new filings), newest
// first; then the standing/renewal universe, newest first.
records.sort((a, b) => {
  const an = a.eventType === 'new_filing' ? 0 : 1
  const bn = b.eventType === 'new_filing' ? 0 : 1
  if (an !== bn) return an - bn
  return (b.filedDate || '').localeCompare(a.filedDate || '')
})

// ── full unified signal feed → data/signals.json ──────────────────────────────
function realAddr(r) {
  const a = r.address || {}
  return a.city && a.street && !/INACTIVE|NO /i.test(a.street)
}

const licenseSignals = liquor
  .filter((r) => r.eventType === 'new_filing' && realAddr(r))
  .map((r) => ({
    id: r.id,
    signalType: 'license',
    businessName: titleCase(r.businessName),
    category: r._seriesLabel || 'Liquor license',
    detail: `New ${r._series || ''} liquor license filed`.replace('  ', ' '),
    city: titleCase(r.address.city),
    county: canonCounty(r.address.county),
    date: r.filedDate || asOf,
    value: null,
    phone: null,
    sourceLabel: 'DBPR Alcoholic Beverages & Tobacco',
    lat: r.address.lat ?? null,
    lng: r.address.lng ?? null,
  }))

const registrationSignals = (await load('sunbiz-new.json')).map((r) => ({
  id: r.id,
  signalType: 'registration',
  businessName: titleCase(r.businessName),
  category: `${r.entityType || 'New entity'}`,
  detail: 'New Florida business registered with the state',
  city: '',
  county: '',
  date: r.formedDate || asOf,
  value: null,
  phone: null,
  sourceLabel: 'FL Division of Corporations (Sunbiz)',
  lat: null,
  lng: null,
}))

const permitSignals = (await load('normalized-permits-orlando.json')).map((r) => ({
  id: r.id,
  signalType: 'permit',
  businessName: titleCase(r.businessName),
  category: 'Commercial buildout',
  detail:
    [money(r.estimatedCost), r.permitCategory].filter(Boolean).join(' · ') ||
    'New commercial construction permit',
  city: titleCase(r.address.city),
  county: canonCounty(r.address.county),
  date: r.appliedDate || r.issuedDate || asOf,
  value: r.estimatedCost ?? null,
  phone: r.contractorPhone || null,
  sourceLabel: 'City of Orlando (building permits)',
  lat: null,
  lng: null,
}))

const retailSignals = fdacs
  .filter((r) => r.enrichment?.phone && realAddr(r))
  .map((r) => ({
    id: r.id,
    signalType: 'retail_food',
    businessName: titleCase(r.businessName),
    category: r._category || 'Retail food',
    detail: `${r._category || 'Retail food'} establishment${r.enrichment.phone ? ' · ' + r.enrichment.phone : ''}`,
    city: titleCase(r.address.city),
    county: canonCounty(r.address.county),
    date: asOf,
    value: null,
    phone: r.enrichment.phone,
    sourceLabel: 'FDACS Division of Food Safety',
    lat: r.address.lat ?? null,
    lng: r.address.lng ?? null,
  }))

const signals = [...licenseSignals, ...registrationSignals, ...permitSignals, ...retailSignals].sort(
  (a, b) => (b.date || '').localeCompare(a.date || '')
)

// ── emit (compact — these are data files, not source) ─────────────────────────
await mkdir(APP_DATA_DIR, { recursive: true })
await writeFile(APP_DATA_DIR + 'licenses.json', JSON.stringify(records), 'utf8')
await writeFile(APP_DATA_DIR + 'signals.json', JSON.stringify(signals), 'utf8')

const byType = records.reduce((m, r) => ((m[r.eventType] = (m[r.eventType] || 0) + 1), m), {})
const counties = new Set(records.map((r) => r.address.county).filter(Boolean))
const sigByType = signals.reduce((m, s) => ((m[s.signalType] = (m[s.signalType] || 0) + 1), m), {})

console.log(`✓ wrote ${records.length} LicenseRecords → licensesignal/data/licenses.json`)
console.log(`  eventType: ${Object.entries(byType).map(([k, v]) => `${k} ${v}`).join(', ')}`)
console.log(`  distinct counties: ${counties.size}`)
console.log(`✓ wrote ${signals.length} BusinessSignals → licensesignal/data/signals.json`)
console.log(`  by source: ${Object.entries(sigByType).map(([k, v]) => `${k} ${v}`).join(', ')}`)
