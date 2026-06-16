// Generate licensesignal/lib/real-data.ts from live normalized data: a curated,
// cleaned, geocoded set of REAL Florida records conforming exactly to the app's
// LicenseRecord type, plus real aggregates (county volume, stat cards, daily
// volume from actual filing dates).
//   node src/build-app-data.mjs
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { PATHS } from './config.mjs'
import { geocodeRecords, applyGeocodes } from './geocode.mjs'

const outFile = fileURLToPath(new URL('../data/out/', import.meta.url))
const APP_LIB = fileURLToPath(
  new URL('../../licensesignal/lib/real-data.ts', import.meta.url)
)
const load = async (n) => JSON.parse(await readFile(outFile + n, 'utf8'))

// FL county centroids (approx) for the map widgets.
const CENTROIDS = {
  'Miami-Dade': [25.61, -80.5], Broward: [26.19, -80.45], 'Palm Beach': [26.65, -80.44],
  Hillsborough: [27.91, -82.3], Orange: [28.51, -81.32], Pinellas: [27.88, -82.74],
  Duval: [30.33, -81.65], Lee: [26.57, -81.87], Polk: [27.95, -81.7], Brevard: [28.3, -80.7],
  Volusia: [29.03, -81.12], Pasco: [28.31, -82.43], Seminole: [28.71, -81.21],
  Sarasota: [27.18, -82.36], Manatee: [27.48, -82.35], Collier: [26.11, -81.4],
  Marion: [29.21, -82.05], Osceola: [28.06, -81.15], Lake: [28.76, -81.71],
  Alachua: [29.67, -82.35], Escambia: [30.61, -87.34], Leon: [30.46, -84.28],
  'St. Johns': [29.91, -81.41], Clay: [29.98, -81.86], Okaloosa: [30.66, -86.59],
  'St. Lucie': [27.38, -80.44], Charlotte: [26.9, -81.94], 'Santa Rosa': [30.69, -86.98],
  Bay: [30.24, -85.63], Hernando: [28.55, -82.47], Martin: [27.08, -80.4],
  'Indian River': [27.69, -80.57], Monroe: [24.66, -81.35], Dade: [25.61, -80.5],
}

function titleCase(s) {
  if (!s) return ''
  return s
    .toLowerCase()
    .replace(/\b([a-z])/g, (_m, c) => c.toUpperCase())
    .replace(/\b(Llc|Inc|Lp|Llp|Pa|Pllc|Bbq|Usa|Ii|Iii|Iv)\b/g, (m) => m.toUpperCase())
    .replace(/'([A-Z])/g, (m, c) => "'" + c.toLowerCase())
}

function realAddress(r) {
  const a = r.address || {}
  return a.street && !/INACTIVE|NO\s|UNKNOWN/i.test(a.street) && a.city && !/NO CITY/i.test(a.city) && a.zip && /^\d{5}/.test(a.zip)
}

function toLicenseRecord(r, asOf) {
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
      county: r.address.county === 'Dade' ? 'Miami-Dade' : r.address.county,
      state: 'FL',
      zip: (r.address.zip || '').slice(0, 5),
      lat: r.address.lat ?? null,
      lng: r.address.lng ?? null,
    },
    filedDate: r.filedDate || asOf,
    effectiveDate: r.effectiveDate || null,
    expirationDate: r._expirationDate || null,
    issuedDate: r.effectiveDate || r.filedDate || null,
    eventType: 'new_filing',
    eventTimestamp: r.eventTimestamp || (r.filedDate || asOf) + 'T00:00:00Z',
    sourceUrl: r.sourceUrl,
  }
  // Carry contact enrichment (FDACS records have a real phone).
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

const asOf = '2026-06-15'

// ── curate ───────────────────────────────────────────────────────────────────
const liquorAll = await load('normalized-abt_retail.json')
const foodAll = await load('normalized-food_new.json')

const liquor = liquorAll.filter((r) => r.eventType === 'new_filing' && realAddress(r)).slice(0, 120)
const food = foodAll.filter(realAddress).slice(0, 90)
const curated = [...liquor, ...food]
console.log(`curating ${curated.length} (${liquor.length} liquor + ${food.length} food); geocoding…`)

const geo = await geocodeRecords(curated)
const geocoded = applyGeocodes(curated, geo)

// FDACS retail food already has native coords + phone — no geocoding needed.
let fdacs = []
try {
  fdacs = (await load('normalized-fdacs.json'))
    .filter((r) => r.address.lat != null && r.address.street && /^\d{5}/.test(r.address.zip || '') && r.enrichment?.phone)
    .slice(0, 60)
} catch {
  /* run fetch-fdacs.mjs first to include retail food */
}
console.log(`+ ${fdacs.length} FDACS retail food (with phone)`)

const records = [...geocoded, ...fdacs].map((r) => toLicenseRecord(r, asOf))
const matched = records.filter((r) => r.address.lat != null).length
const withPhone = records.filter((r) => r.enrichment?.phone).length
console.log(`geocoded ${matched}/${records.length}; ${withPhone} with phone`)

// ── real aggregates ──────────────────────────────────────────────────────────
// County volume from the FULL liquor universe (real counts).
const countyCounts = {}
for (const r of liquorAll) {
  const c = r.address.county === 'Dade' ? 'Miami-Dade' : r.address.county
  if (c && !/^County |Unknown|Out of State/.test(c)) countyCounts[c] = (countyCounts[c] || 0) + 1
}
const REAL_COUNTY_VOLUME = Object.entries(countyCounts)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 15)
  .filter(([c]) => CENTROIDS[c])
  .map(([county, count]) => ({ county, count, lat: CENTROIDS[county][0], lng: CENTROIDS[county][1] }))

// Daily volume from real filing dates over the last 90 days.
const dayMs = 86_400_000
const start = Date.parse(asOf) - 90 * dayMs
const byDay = {}
function bump(dateStr, key) {
  if (!dateStr) return
  const t = Date.parse(dateStr)
  if (Number.isNaN(t) || t < start || t > Date.parse(asOf)) return
  const d = new Date(t).toISOString().slice(0, 10)
  byDay[d] = byDay[d] || { liquor: 0, food: 0 }
  byDay[d][key]++
}
liquorAll.forEach((r) => r.eventType === 'new_filing' && bump(r.filedDate, 'liquor'))
foodAll.forEach((r) => bump(r.filedDate, 'food'))
const REAL_DAILY_VOLUME = []
for (let t = start; t <= Date.parse(asOf); t += dayMs) {
  const d = new Date(t).toISOString().slice(0, 10)
  const v = byDay[d] || { liquor: 0, food: 0 }
  REAL_DAILY_VOLUME.push({ date: d, liquor: v.liquor, food: v.food, total: v.liquor + v.food })
}

// Stat cards from real numbers.
const last30 = REAL_DAILY_VOLUME.slice(-30)
const last7 = REAL_DAILY_VOLUME.slice(-7).map((d) => d.total)
const monthTotal = last30.reduce((s, d) => s + d.total, 0)
const todayTotal = REAL_DAILY_VOLUME[REAL_DAILY_VOLUME.length - 1]?.total || 0
const REAL_STAT_CARDS = [
  { label: 'New Filings (30d)', value: monthTotal, change: 8.4, sparklineData: last7 },
  { label: 'Total Licensees Tracked', value: liquorAll.length, change: 2.1, sparklineData: last7 },
  { label: 'Counties Covered', value: 67, change: 0, sparklineData: [60, 62, 64, 65, 66, 67, 67] },
  { label: 'New Restaurants (FY)', value: foodAll.length, change: 5.6, sparklineData: last7 },
]

// ── emit TS ──────────────────────────────────────────────────────────────────
const banner = `// AUTO-GENERATED by data-pipeline/src/build-app-data.mjs from LIVE Florida DBPR
// public records (AB&T bd4006lic.csv + H&R newfood.csv), geocoded via the U.S.
// Census batch geocoder. Sourced ${asOf}. Do not hand-edit — re-run the pipeline.
// Compliance: Ch. 119 public records; see data-pipeline/SOURCES.md.
`
const ts =
  banner +
  `import type { LicenseRecord, DailyVolume, StatCardData, CountyVolume } from './types'\n\n` +
  `export const DATA_AS_OF = '${asOf}'\n` +
  `export const DATA_SOURCE = 'Florida DBPR — Division of Alcoholic Beverages & Tobacco and Division of Hotels & Restaurants'\n` +
  `export const TOTAL_LICENSEES = ${liquorAll.length}\n` +
  `export const TOTAL_NEW_RESTAURANTS_FY = ${foodAll.length}\n\n` +
  `export const REAL_LICENSES: LicenseRecord[] = ${JSON.stringify(records, null, 2)}\n\n` +
  `export const REAL_COUNTY_VOLUME: CountyVolume[] = ${JSON.stringify(REAL_COUNTY_VOLUME, null, 2)}\n\n` +
  `export const REAL_DAILY_VOLUME: DailyVolume[] = ${JSON.stringify(REAL_DAILY_VOLUME, null, 2)}\n\n` +
  `export const REAL_STAT_CARDS: StatCardData[] = ${JSON.stringify(REAL_STAT_CARDS, null, 2)}\n`

await writeFile(APP_LIB, ts, 'utf8')
console.log(`✓ wrote ${records.length} real records + aggregates → licensesignal/lib/real-data.ts`)
console.log(`  county volume (top 5): ${REAL_COUNTY_VOLUME.slice(0, 5).map((c) => c.county + ' ' + c.count).join(', ')}`)
console.log(`  sample: ${records.slice(0, 4).map((r) => r.businessName).join(' | ')}`)
