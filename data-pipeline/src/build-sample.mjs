// Build a small, curated, geocoded sample of REAL recent Florida filings
// (liquor + food) — a drop-in artifact the website can use in place of mock data.
//   node src/build-sample.mjs
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { PATHS } from './config.mjs'
import { geocodeRecords, applyGeocodes } from './geocode.mjs'

const out = (name) => fileURLToPath(new URL(name, PATHS.out))
const load = async (name) => JSON.parse(await readFile(out(name), 'utf8'))

function realAddress(r) {
  const a = r.address || {}
  return (
    a.street &&
    !/INACTIVE|NO\s|UNKNOWN/i.test(a.street) &&
    a.city &&
    !/NO CITY/i.test(a.city) &&
    a.zip &&
    /^\d{5}/.test(a.zip)
  )
}

const liquor = (await load('normalized-abt_retail.json'))
  .filter((r) => r.eventType === 'new_filing' && realAddress(r))
  .slice(0, 18)
const food = (await load('normalized-food_new.json')).filter(realAddress).slice(0, 18)

const combined = [...liquor, ...food]
console.log(`curating ${combined.length} real records (${liquor.length} liquor + ${food.length} food) and geocoding…`)

const geo = await geocodeRecords(combined)
const enriched = applyGeocodes(combined, geo).filter((r) => r.address.lat != null)

await writeFile(out('website-sample.json'), JSON.stringify(enriched, null, 2))
console.log(`✓ wrote ${enriched.length} geocoded real records → data/out/website-sample.json`)
for (const r of enriched.slice(0, 8)) {
  console.log(
    `  · ${r.businessName} — ${r._source === 'DBPR-ABT' ? r._series : r.licenseType} — ${r.address.city}, ${r.address.county} — filed ${r.filedDate} — (${r.address.lat?.toFixed(4)}, ${r.address.lng?.toFixed(4)})`
  )
}
