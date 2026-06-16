// Copywriter agent: drafts a 3-step outreach sequence (intro + 2 follow-ups) per
// prospect, grounded in the research brief. Uses local Ollama if available, else a
// deterministic template built from validation/outreach-sequence.md.
//
// HARD RULES (enforced in code, not left to the model):
//  - The CAN-SPAM footer (sender identity, postal address, opt-out) is ALWAYS
//    appended by us — never trusted to the LLM.
//  - Everything is a DRAFT for human review + manual send. No auto-send.
import { COMPANY } from '../config.mjs'
import { getDb, setStatus } from '../db.mjs'
import { nowIso } from '../util.mjs'
import { buildFacts } from './research-agent.mjs'
import { ollamaAvailable, ollamaJson } from './ollama.mjs'

const countyLabel = (f) => (f.county && f.county !== 'unknown' ? `${f.county} County` : 'your area')
const specialtyOf = (f) => /\(([^)]+)\)/.exec(f.description || '')?.[1] || ''

function footer() {
  return [
    '',
    `— ${COMPANY.fromName}`,
    `${COMPANY.name} · ${COMPANY.fromEmail} · newvenuedata.com`,
    COMPANY.postalAddress,
    `Not a fit? Reply "no thanks" and I won't follow up.`,
  ].join('\n')
}
const signature = () => `\n— ${COMPANY.fromName}, ${COMPANY.name} · ${COMPANY.fromEmail}`

function templateSteps(f, research) {
  const county = countyLabel(f)
  const specialty = specialtyOf(f)
  const personalLine = specialty
    ? `Since you write ${specialty}, these are exactly your accounts.`
    : f.writesLiquorLiability
      ? 'Since you write bar/restaurant liquor liability, these are exactly your accounts.'
      : ''

  const intro =
`Hi there,

I track Florida's public liquor-license filings and turn them into a weekly list of the bars and restaurants that just got licensed to serve alcohol in ${county} — the venues that need liquor-liability coverage right now, before another agent reaches them.
${personalLine ? '\n' + personalLine + '\n' : ''}
I put together a free 25-venue South-Florida sample (filed in the last two weeks, with address and license type). Worth a quick look?

If it's useful, I send a fresh batch every Monday — $149/mo for your county, about what a single commercial lead costs. I'm also locking in my first 10 Florida agents at a founding rate ($99/mo for life).

Could I grab 15 minutes this week to show you how it works?`

  const followup1 =
`Hi there — circling back on the new-venue list for ${county}. Every week more bars and restaurants get their liquor license and start shopping for coverage; this just puts them in front of you first.

Happy to send this week's ${county} filings so you can see the format — want me to?`

  const followup2 =
`Last note — I'll leave you be. If reaching brand-new ${county} venues before they're insured is ever useful, just reply "leads" and I'll send the current week's filings. Thanks for the time.`

  return [
    { step: 0, subject: `${f.county && f.county !== 'unknown' ? f.county : 'South Florida'} venues that just got licensed — before they're insured`, body: intro, cta: '15-minute call this week' },
    { step: 1, subject: `re: new ${county} venues`, body: followup1, cta: 'Send this week’s list' },
    { step: 2, subject: `should I close this out?`, body: followup2, cta: 'Reply “leads”' },
  ]
}

function llmPrompt(f, research) {
  return `You are an expert B2B cold-email copywriter for "${COMPANY.name}". Product: ${COMPANY.oneLiner}
Pricing to mention: ${COMPANY.pricing.county}; founding offer ${COMPANY.pricing.founding}.

Write a 3-step outreach sequence to this insurance prospect, grounded ONLY in the research below. Do not invent facts, names, numbers, or personalization. No spammy language, no ALL CAPS, at most one link, plain text.

RESEARCH:
- Summary: ${research.summary}
- Why fit: ${research.why_fit}
- Personalization: ${(research.personalization || []).join(' | ')}
- Angle: ${research.angle}
- County: ${f.county}

Return STRICT JSON: {"steps":[{"step":0,"subject":string,"body":string,"cta":string},{"step":1,...},{"step":2,...}]}
- step 0 = intro (offer the free 25-venue sample + a 15-min call), step 1 = day-3 nudge, step 2 = day-7 break-up.
- Do NOT include a signature, address, or unsubscribe line — those are added separately.
- Each body under 130 words.`
}

export async function draftOne(db, p) {
  const f = buildFacts(p)
  const research = db.prepare('SELECT * FROM research WHERE prospect_id = ?').get(p.id)
  const brief = research
    ? { summary: research.summary, why_fit: research.why_fit, personalization: JSON.parse(research.personalization || '[]'), angle: research.angle }
    : { summary: '', why_fit: '', personalization: [], angle: '' }

  let steps = null
  let model = 'template'
  if (await ollamaAvailable()) {
    const out = await ollamaJson(llmPrompt(f, brief))
    if (out && Array.isArray(out.steps) && out.steps.length >= 1 && out.steps[0].body) {
      steps = out.steps
      model = process.env.OLLAMA_MODEL || 'ollama'
    }
  }
  if (!steps) steps = templateSteps(f, brief)

  // Always append our compliant footer/signature — never trust the model for this.
  for (const s of steps) {
    s.body = (s.body || '').trim() + (s.step === 0 ? '\n' + footer() : signature())
  }

  // Replace existing unsent drafts for this prospect, keep approved/sent history.
  db.prepare(`DELETE FROM drafts WHERE prospect_id = ? AND status = 'draft'`).run(p.id)
  const ins = db.prepare(`
    INSERT INTO drafts (prospect_id, step, subject, body, cta, status, model, created_at)
    VALUES (?,?,?,?,?, 'draft', ?, ?)
  `)
  for (const s of steps) ins.run(p.id, s.step, s.subject || '', s.body, s.cta || '', model, nowIso())
  setStatus(db, p.id, 'drafted')
  return { steps: steps.length, model }
}
