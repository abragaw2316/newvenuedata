// Discover insurance agencies in the beachhead counties via OpenStreetMap Overpass.
// FREE. Data is ODbL — must attribute "© OpenStreetMap contributors" and keep the
// OSM-sourced fields separable (we stamp source='osm:overpass'). See COMPLIANCE.md.
import { COUNTIES, REQUEST_DELAY_MS } from '../config.mjs'
import { getDb, upsertProspect } from '../db.mjs'
import { fetchText } from '../net.mjs'
import { sleep, normalizeDomain } from '../util.mjs'

const ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
]

function buildQuery([s, w, n, e]) {
  // office=insurance covers agencies/brokers; include the agent subtype too.
  return `[out:json][timeout:60];
(
  node["office"="insurance"](${s},${w},${n},${e});
  way["office"="insurance"](${s},${w},${n},${e});
  node["office"="insurance_agent"](${s},${w},${n},${e});
  way["office"="insurance_agent"](${s},${w},${n},${e});
);
out center tags;`
}

function tagsToProspect(tags, countyName) {
  const t = tags || {}
  const website = t.website || t['contact:website'] || ''
  const street = [t['addr:housenumber'], t['addr:street']].filter(Boolean).join(' ')
  return {
    company: t.name || t.operator || '',
    website,
    domain: normalizeDomain(website),
    email: t.email || t['contact:email'] || '',
    phone: t.phone || t['contact:phone'] || '',
    address: street || null,
    city: t['addr:city'] || '',
    county: countyName,
    state: 'FL',
    source: 'osm:overpass',
    source_url: website || 'https://www.openstreetmap.org',
    status: 'discovered',
  }
}

async function queryCounty(bbox) {
  const query = buildQuery(bbox)
  for (const url of ENDPOINTS) {
    const res = await fetchText(url, {
      method: 'POST',
      body: 'data=' + encodeURIComponent(query),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      timeoutMs: 90000,
    })
    if (res.ok && res.text) {
      try {
        return JSON.parse(res.text).elements || []
      } catch {
        /* fall through to next endpoint */
      }
    }
  }
  return null
}

export async function discoverOverpass(db = getDb()) {
  let inserted = 0
  let seen = 0
  let countiesOk = 0
  for (const county of COUNTIES) {
    const elements = await queryCounty(county.bbox)
    if (elements === null) {
      console.warn(`  ⚠ Overpass unavailable for ${county.name} (skipped — rerun later)`)
      await sleep(REQUEST_DELAY_MS)
      continue
    }
    countiesOk++
    let countyInserted = 0
    for (const el of elements) {
      const p = tagsToProspect(el.tags, county.name)
      if (!p.company) continue // need at least a name to be a prospect
      seen++
      const r = upsertProspect(db, p)
      if (r.inserted) { inserted++; countyInserted++ }
    }
    console.log(`  ${county.name}: ${elements.length} OSM elements → ${countyInserted} new`)
    await sleep(REQUEST_DELAY_MS)
  }
  return { inserted, seen, countiesOk, countiesTotal: COUNTIES.length }
}

if (process.argv[1]?.endsWith('overpass-insurance.mjs')) {
  const r = await discoverOverpass()
  console.log(`✓ Overpass discovery: ${r.inserted} new prospects (${r.countiesOk}/${r.countiesTotal} counties reachable)`)
}
