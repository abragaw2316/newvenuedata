// Research agent: turns the FACTS we collected about a prospect into a short,
// grounded brief (summary, challenges, opportunities, why-fit, personalization,
// angle). Uses local Ollama if available; otherwise a deterministic template that
// only restates real facts. Either way: NO invented details.
import { COMPANY } from '../config.mjs'
import { getDb } from '../db.mjs'
import { nowIso } from '../util.mjs'
import { ollamaAvailable, ollamaJson } from './ollama.mjs'

export function buildFacts(p) {
  const signals = p.tech_signals ? JSON.parse(p.tech_signals) : []
  return {
    company: p.company,
    county: p.county || 'unknown',
    website: p.website || 'unknown',
    description: p.description || '',
    writesLiquorLiability: !!p.writes_liquor_liability,
    signals,
    hasEmail: !!p.email,
    hasPhone: !!p.phone,
    segment: p.segment || 'insurance agency',
  }
}

function factsBlock(f) {
  return [
    `Company: ${f.company}`,
    `County (FL): ${f.county}`,
    `Website: ${f.website}`,
    `Site description: ${f.description || '(none captured)'}`,
    `Writes liquor-liability/hospitality insurance: ${f.writesLiquorLiability ? 'yes (confirmed)' : 'unconfirmed'}`,
    `Detected signals: ${f.signals.join(', ') || 'none'}`,
    `Segment: ${f.segment}`,
  ].join('\n')
}

function templateResearch(f) {
  const specialty = /\(([^)]+)\)/.exec(f.description || '')?.[1] // e.g. "Yes (nightclubs/bars)" -> "nightclubs/bars"
  const personalization = []
  if (f.county && f.county !== 'unknown') personalization.push(`Operates in ${f.county} County — our beachhead market for new-venue filings.`)
  if (specialty) personalization.push(`Their site indicates they cover ${specialty}.`)
  else if (f.signals.includes('liquor_liability')) personalization.push('Their site references liquor-liability / hospitality coverage.')
  if (f.signals.includes('commercial_specialty')) personalization.push('They write commercial / E&S lines, where new-venue leads convert.')
  if (!personalization.length) personalization.push('Independent Florida insurance agency — likely writes commercial accounts.')

  return {
    summary: `${f.company} is an insurance ${f.segment.toLowerCase().includes('whole') ? 'wholesaler/MGA' : 'agency'}${f.county !== 'unknown' ? ` serving ${f.county} County, FL` : ' in Florida'}.${f.description ? ` ${f.description}` : ''}`.trim(),
    challenges: 'New bars and restaurants must carry liquor-liability coverage the moment they open, but agents find them late — manual DBPR license searches are slow and competitors reach owners first.',
    opportunities: `Reach newly liquor-licensed ${f.county !== 'unknown' ? f.county + ' County' : 'Florida'} venues in the same week they need coverage, before another agent does.`,
    why_fit: f.writesLiquorLiability
      ? `${f.company} already writes the exact line (${specialty || 'bar/restaurant liquor liability'}) these new venues need — ${COMPANY.name} hands them a weekly, pre-filtered prospect list.`
      : `If ${f.company} writes any commercial/hospitality lines, ${COMPANY.name}'s weekly new-venue list is a ready prospecting feed.`,
    personalization,
    angle: f.segment.toLowerCase().includes('whole')
      ? 'Wholesale/MGA: position as upstream new-risk signal + a prospecting edge for their downstream agents (feed/API).'
      : 'Independent agent: position as a weekly lead list of brand-new dram-shop prospects, priced like a single commercial lead.',
    confidence: f.writesLiquorLiability ? 0.8 : 0.55,
    model: 'template',
  }
}

function llmPrompt(f) {
  return `You are a B2B sales researcher for "${COMPANY.name}". ${COMPANY.name} sells: ${COMPANY.oneLiner}

Using ONLY the facts below, write a short prospecting brief about why this insurance prospect might buy. Do NOT invent names, numbers, claims, or details that are not in the facts. If something is unknown, say so or omit it.

FACTS:
${factsBlock(f)}

Return STRICT JSON with keys:
{"summary": string, "challenges": string, "opportunities": string, "why_fit": string, "personalization": string[], "angle": string, "confidence": number}
- "personalization": 1-3 bullet strings, each grounded in a specific fact above (no fabrication).
- "confidence": 0..1 reflecting how strong the fit evidence is.
Keep each field under 60 words.`
}

export async function researchOne(db, p) {
  const f = buildFacts(p)
  let r = null
  if (await ollamaAvailable()) {
    const out = await ollamaJson(llmPrompt(f))
    if (out && out.summary && Array.isArray(out.personalization)) {
      r = { ...out, model: process.env.OLLAMA_MODEL || 'ollama' }
    }
  }
  if (!r) r = templateResearch(f) // graceful fallback

  db.prepare(`
    INSERT INTO research (prospect_id, summary, challenges, opportunities, why_fit, personalization, angle, model, confidence, created_at)
    VALUES (?,?,?,?,?,?,?,?,?,?)
    ON CONFLICT(prospect_id) DO UPDATE SET
      summary=excluded.summary, challenges=excluded.challenges, opportunities=excluded.opportunities,
      why_fit=excluded.why_fit, personalization=excluded.personalization, angle=excluded.angle,
      model=excluded.model, confidence=excluded.confidence, created_at=excluded.created_at
  `).run(
    p.id, r.summary, r.challenges, r.opportunities, r.why_fit,
    JSON.stringify(r.personalization || []), r.angle, r.model, Number(r.confidence) || 0.5, nowIso(),
  )
  return r
}
