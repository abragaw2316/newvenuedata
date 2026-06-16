// Enrichment stage runner.
import { getDb } from '../db.mjs'
import { enrichAll } from './fetch-website.mjs'

if (process.argv[1]?.endsWith('run.mjs')) {
  const r = await enrichAll(getDb(), { limit: Number(process.argv[2]) || 500 })
  console.log(`✓ enrichment: ${r.ok}/${r.processed} fetched, ${r.withEmail} email, ${r.withLL} liquor-liability signal`)
}
export { enrichAll }
