// Fetch FDACS retail/manufacturing food entities from the live ArcGIS REST
// service (paginated, 2000/page), normalize, and write normalized-fdacs.json.
//   node src/fetch-fdacs.mjs [maxPerLayer]   (default 500/layer for a sample)
import { mkdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { PATHS, USER_AGENT } from './config.mjs'
import { normalizeFdacsFeature } from './normalize-fdacs.mjs'
import { todayISO } from './lookups.mjs'

const SERVICE = 'https://gis.fdacs.gov/mapping/rest/services/DFS/DFS_FOOD_SAFETY_FACILITIES_PUBLIC_VIEW/MapServer'
const PAGE = 2000
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function arcgis(path) {
  const res = await fetch(`${SERVICE}${path}`, { headers: { 'User-Agent': USER_AGENT } })
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${path}`)
  return res.json()
}

async function count(layer) {
  const j = await arcgis(`/${layer}/query?where=1%3D1&returnCountOnly=true&f=json`)
  return j.count
}

async function fetchLayer(layer, max, asOf) {
  const out = []
  for (let offset = 0; out.length < max; offset += PAGE) {
    const j = await arcgis(
      `/${layer}/query?where=1%3D1&outFields=*&orderByFields=OBJECTID&resultOffset=${offset}&resultRecordCount=${Math.min(PAGE, max - out.length)}&f=json`
    )
    const feats = j.features || []
    if (feats.length === 0) break
    for (const f of feats) {
      const rec = normalizeFdacsFeature(f, { layer, asOf, sourceUrl: `${SERVICE}/${layer}` })
      if (rec.id) out.push(rec)
    }
    await sleep(800) // be gentle on the live state GIS server
    if (feats.length < PAGE) break
  }
  return out
}

async function main() {
  const asOf = todayISO()
  const max = Number(process.argv[2]) || 500
  await mkdir(fileURLToPath(PATHS.out), { recursive: true })

  const [retailTotal, mfgTotal] = await Promise.all([count(0), count(1)])
  console.log(`FDACS totals — retail: ${retailTotal.toLocaleString()}, manufacturing: ${mfgTotal.toLocaleString()}`)

  const retail = await fetchLayer(0, max, asOf)
  const mfg = await fetchLayer(1, Math.min(max, 100), asOf)
  const all = [...retail, ...mfg]

  const dest = fileURLToPath(new URL('normalized-fdacs.json', PATHS.out))
  await writeFile(dest, JSON.stringify(all, null, 2))
  const withPhone = all.filter((r) => r.enrichment.phone).length
  console.log(`✓ normalized ${all.length} FDACS records (${retail.length} retail + ${mfg.length} mfg) → normalized-fdacs.json`)
  console.log(`  ${withPhone} have a phone (${Math.round((withPhone / all.length) * 100)}%)`)
  for (const r of all.slice(0, 4)) {
    console.log(`  · ${r.businessName} — ${r._category} — ${r.address.city}, ${r.address.county} — (${r.address.lat?.toFixed(4)}, ${r.address.lng?.toFixed(4)})${r.enrichment.phone ? ' — ' + r.enrichment.phone : ''}`)
  }
}

main().catch((e) => {
  console.error('FDACS fetch failed:', e.message)
  process.exit(1)
})
