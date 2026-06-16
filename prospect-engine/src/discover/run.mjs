// Discovery stage: seed (curated list) + Overpass (OSM agencies) + directory imports.
// All sources are free + public. Dedup is handled by upsertProspect (keyed on domain).
import { getDb, counts } from '../db.mjs'
import { seedImport } from './seed-import.mjs'
import { discoverOverpass } from './overpass-insurance.mjs'
import { importDirectories } from './directories.mjs'

export async function runDiscovery(db = getDb()) {
  console.log('▸ seed (validation/prospect-list.csv)')
  const seed = seedImport(db)
  console.log(`  ${seed.inserted} inserted, ${seed.updated} updated`)

  console.log('▸ OpenStreetMap Overpass (office=insurance, South FL)')
  const osm = await discoverOverpass(db)
  console.log(`  ${osm.inserted} new (${osm.countiesOk}/${osm.countiesTotal} counties reachable)`)

  console.log('▸ directory imports (data/imports/*.csv)')
  const dir = importDirectories(db)
  console.log(`  ${dir.files} file(s), ${dir.inserted} inserted`)

  return { seed, osm, dir, totals: counts(db) }
}

if (process.argv[1]?.endsWith('run.mjs')) {
  const r = await runDiscovery()
  console.log('✓ discovery complete. DB now holds', r.totals.prospects, 'prospects.')
}
