// Full prospecting pipeline: discover → enrich → score → research+draft → export.
// All stages are idempotent and resumable (status-driven). Free sources + local AI
// (or template fallback). Output is DRAFTS for human review — nothing is sent.
//
//   npm run pipeline            # full run (top 50 drafted)
//   npm run pipeline -- 80      # draft top 80
import { getDb, counts } from './db.mjs'
import { runDiscovery } from './discover/run.mjs'
import { enrichAll } from './enrich/fetch-website.mjs'
import { scoreAll } from './score.mjs'
import { runAgents } from './agents/run.mjs'
import { exportJson } from './export-json.mjs'

const draftLimit = Number(process.argv[2]) || 50

const db = getDb()
console.log('━━ New Venue Data · prospecting pipeline ━━')

console.log('\n[1/5] discover')
await runDiscovery(db)

console.log('\n[2/5] enrich (robots-aware website fetch)')
const enr = await enrichAll(db)
console.log(`  fetched ${enr.ok}/${enr.processed} · ${enr.withEmail} email · ${enr.withLL} liquor-liability signal`)

console.log('\n[3/5] score (0–100 buyer fit)')
const sc = scoreAll(db)
console.log(`  scored ${sc.scored}`)

console.log(`\n[4/5] research + draft (top ${draftLimit})`)
const ag = await runAgents(db, { limit: draftLimit })
console.log(`  drafted ${ag.processed} · skipped(suppressed) ${ag.skipped} · mode ${ag.usingOllama ? 'Ollama' : 'template'}`)

console.log('\n[5/5] export snapshot')
const ex = exportJson(db)
console.log(`  wrote ${ex.file} (${ex.count} prospects)`)

const c = counts(db)
console.log(`\n✓ done. ${c.prospects} prospects · ${c.scored} scored · ${c.drafts} drafts · ${c.suppressed} suppressed`)
console.log('  Review + send: run the Next app and open /prospects (internal).')
