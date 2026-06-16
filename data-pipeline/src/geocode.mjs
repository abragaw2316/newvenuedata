// Geocode normalized records via the U.S. Census Bureau BATCH geocoder.
// Free, no API key, public-domain output (resellable), up to 10k addresses/batch.
// Input is a headerless CSV: id, street, city, state, zip.
//
//   node src/geocode.mjs <normalized.json> [limit]
// or import { geocodeRecords } and call it from the pipeline.

import { readFile, writeFile } from 'node:fs/promises'
import { CENSUS_GEOCODER } from './config.mjs'
import { parseCsv } from './csv.mjs'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

function toBatchCsv(records) {
  // Census wants: Unique ID, Street, City, State, ZIP — no header, no punctuation.
  return records
    .map((r) => {
      const a = r.address || {}
      const street = (a.street || '').replace(/[",]/g, ' ').trim()
      const cells = [r.id, street, a.city || '', a.state || 'FL', a.zip || '']
      return cells.map((c) => `"${String(c).replace(/"/g, '')}"`).join(',')
    })
    .join('\n')
}

/**
 * Geocode up to `maxBatch` records. Returns a Map id → {lat,lng,matched,matchedAddress}.
 * @param {Array<{id:string,address:object}>} records
 */
export async function geocodeRecords(records) {
  const batch = records.slice(0, CENSUS_GEOCODER.maxBatch)
  const csv = toBatchCsv(batch)

  const form = new FormData()
  form.append('addressFile', new Blob([csv], { type: 'text/csv' }), 'addresses.csv')
  form.append('benchmark', CENSUS_GEOCODER.benchmark)

  let res
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      res = await fetch(CENSUS_GEOCODER.batchUrl, { method: 'POST', body: form })
      if (res.ok) break
      throw new Error(`HTTP ${res.status}`)
    } catch (err) {
      if (attempt === 3) throw err
      await sleep(2000 * attempt)
    }
  }

  const text = await res.text()
  // Output columns: ID, input addr, match status, match type, matched addr, lon,lat, ...
  const rows = parseCsv(text)
  const out = new Map()
  for (const row of rows) {
    const [id, , status, , matchedAddr, lonlat] = row
    if (status === 'Match' && lonlat && lonlat.includes(',')) {
      const [lon, lat] = lonlat.split(',').map(Number)
      out.set(id, { lat, lng: lon, matched: true, matchedAddress: matchedAddr })
    } else {
      out.set(id, { matched: false })
    }
  }
  return out
}

/** Merge geocodes into records (mutates a copy), returning the enriched array. */
export function applyGeocodes(records, geo) {
  return records.map((r) => {
    const g = geo.get(r.id)
    if (g && g.matched) {
      return { ...r, address: { ...r.address, lat: g.lat, lng: g.lng } }
    }
    return r
  })
}

// CLI entry
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('geocode.mjs')) {
  const file = process.argv[2]
  const limit = Number(process.argv[3]) || 20
  if (!file) {
    console.log('usage: node src/geocode.mjs <normalized.json> [limit]')
    process.exit(0)
  }
  const records = JSON.parse(await readFile(file, 'utf8')).slice(0, limit)
  console.log(`geocoding ${records.length} records via US Census batch…`)
  const geo = await geocodeRecords(records)
  const enriched = applyGeocodes(records, geo)
  const matched = enriched.filter((r) => r.address.lat != null)
  console.log(`matched ${matched.length}/${records.length}`)
  for (const r of matched.slice(0, 5)) {
    console.log(`  · ${r.businessName} — ${r.address.city} → ${r.address.lat}, ${r.address.lng}`)
  }
  await writeFile(file.replace('.json', '.geocoded.json'), JSON.stringify(enriched, null, 2))
}
