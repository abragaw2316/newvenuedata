// Agent stage: research + draft the top-scored prospects (status='scored').
// Skips anyone on the suppression list (opt-outs / bounces) — never draft to them.
import { getDb, isSuppressed, setStatus } from '../db.mjs'
import { normalizeDomain } from '../util.mjs'
import { researchOne } from './research-agent.mjs'
import { draftOne } from './copywriter-agent.mjs'
import { ollamaAvailable } from './ollama.mjs'

export async function runAgents(db = getDb(), { limit = 50, minScore = 0 } = {}) {
  const usingOllama = await ollamaAvailable()
  const rows = db.prepare(`
    SELECT p.* FROM prospects p JOIN scores s ON s.prospect_id = p.id
    WHERE p.status = 'scored' AND s.fit_score >= ?
    ORDER BY s.fit_score DESC, s.confidence DESC
    LIMIT ?
  `).all(minScore, limit)
  let processed = 0
  let skipped = 0
  for (const p of rows) {
    const domain = p.domain && !p.domain.startsWith('name:') ? p.domain : normalizeDomain(p.website || '')
    if (isSuppressed(db, p.email, domain)) {
      setStatus(db, p.id, 'suppressed')
      skipped++
      continue
    }
    await researchOne(db, p)
    await draftOne(db, p)
    processed++
  }
  return { processed, skipped, usingOllama }
}

if (process.argv[1]?.endsWith('run.mjs')) {
  const db = getDb()
  const r = await runAgents(db, { limit: Number(process.argv[2]) || 50 })
  console.log(`✓ agents: researched + drafted ${r.processed} prospects (mode: ${r.usingOllama ? 'Ollama' : 'template fallback'})`)
  const top = db.prepare(`
    SELECT p.company, p.county, d.subject, d.body FROM drafts d
    JOIN prospects p ON p.id = d.prospect_id
    JOIN scores s ON s.prospect_id = p.id
    WHERE d.step = 0 ORDER BY s.fit_score DESC LIMIT 1
  `).get()
  if (top) {
    console.log(`\n── sample draft → ${top.company} [${top.county}] ──`)
    console.log(`Subject: ${top.subject}\n`)
    console.log(top.body)
  }
}
