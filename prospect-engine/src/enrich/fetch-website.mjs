// Website enrichment: fetch each agency's own site (robots-aware, throttled, 1–2
// pages max) and extract a PUBLIC email, contact page, phone, a short description,
// and the liquor-liability / hospitality / specialization signals that drive fit.
// Only fetches the prospect's own public homepage — never behind logins. See COMPLIANCE.md.
import {
  REQUEST_DELAY_MS, LIQUOR_LIABILITY_SIGNALS, HOSPITALITY_SIGNALS,
  SPECIALIZATION_SIGNALS, CAPTIVE_BRANDS,
} from '../config.mjs'
import { getDb, setStatus } from '../db.mjs'
import { fetchText } from '../net.mjs'
import { sleep, nowIso, normalizeDomain, countSignals } from '../util.mjs'

const IMG_EXT = /\.(png|jpe?g|gif|svg|webp|css|js|ico|woff2?)$/i
const NOISE_DOMAINS = /(sentry|wixpress|example\.com|godaddy|squarespace|cloudflare|googleusercontent)/i

function htmlToText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function extractEmails(html, domain) {
  const found = new Set()
  const re = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
  for (const m of html.matchAll(re)) {
    const e = m[0].toLowerCase()
    if (IMG_EXT.test(e) || NOISE_DOMAINS.test(e)) continue
    found.add(e)
  }
  const list = [...found]
  // Prefer an address on the company's own domain.
  return list.find((e) => domain && e.endsWith('@' + domain)) || list[0] || ''
}

function extractPhone(text) {
  const m = text.match(/(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/)
  return m ? m[0].trim() : ''
}

function extractDescription(html, text) {
  const meta = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)
  if (meta) return meta[1].trim().slice(0, 300)
  const title = html.match(/<title[^>]*>([^<]+)<\/title>/i)
  return (title ? title[1].trim() : text.slice(0, 160)).slice(0, 300)
}

function findRelevantSubpage(html, domain) {
  // Pull a single internal link that likely lists the lines of business.
  const re = /<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi
  for (const m of html.matchAll(re)) {
    const href = m[1]
    const label = htmlToText(m[2]).toLowerCase()
    if (/liquor|restaurant|\bbar\b|hospitality|commercial|business|industries|tavern|nightclub/.test(label + ' ' + href)) {
      try {
        const url = new URL(href, `https://${domain}/`)
        if (normalizeDomain(url.href) === domain) return url.href
      } catch { /* skip bad href */ }
    }
  }
  return ''
}

function rootBlocked(robotsText, ua = '*') {
  if (!robotsText) return false
  const lines = robotsText.split(/\r?\n/).map((l) => l.replace(/#.*/, '').trim()).filter(Boolean)
  const groups = []
  let cur = null
  for (const line of lines) {
    const idx = line.indexOf(':')
    if (idx < 0) continue
    const k = line.slice(0, idx).toLowerCase().trim()
    const v = line.slice(idx + 1).trim()
    if (k === 'user-agent') {
      if (!cur || cur.hasRules) { cur = { uas: [], disallows: [] }; groups.push(cur) }
      cur.uas.push(v.toLowerCase())
    } else if (cur && (k === 'disallow' || k === 'allow')) {
      cur.hasRules = true
      if (k === 'disallow') cur.disallows.push(v)
    }
  }
  const group = groups.find((g) => g.uas.some((u) => u !== '*' && ua.toLowerCase().includes(u))) ||
    groups.find((g) => g.uas.includes('*'))
  return group ? group.disallows.includes('/') : false
}

export async function enrichOne(db, prospect) {
  const domain = prospect.domain && !prospect.domain.startsWith('name:') ? prospect.domain : normalizeDomain(prospect.website || '')
  if (!domain) {
    setStatus(db, prospect.id, 'enriched') // nothing to fetch; move on
    return { id: prospect.id, ok: false, reason: 'no-domain' }
  }
  const base = `https://${domain}/`

  // robots-aware
  const robots = await fetchText(base + 'robots.txt', { retries: 1, timeoutMs: 8000 })
  if (robots.ok && rootBlocked(robots.text)) {
    setStatus(db, prospect.id, 'enriched')
    return { id: prospect.id, ok: false, reason: 'robots-disallow' }
  }

  const home = await fetchText(base, { retries: 1 })
  if (!home.ok || !home.text) {
    setStatus(db, prospect.id, 'enriched')
    return { id: prospect.id, ok: false, reason: home.error || 'fetch-failed' }
  }

  let html = home.text
  let text = htmlToText(html)

  // Follow one relevant subpage for stronger line-of-business signal.
  const sub = findRelevantSubpage(html, domain)
  if (sub) {
    await sleep(REQUEST_DELAY_MS)
    const subRes = await fetchText(sub, { retries: 1 })
    if (subRes.ok && subRes.text) { html += '\n' + subRes.text; text += ' ' + htmlToText(subRes.text) }
  }

  const llCount = countSignals(text, LIQUOR_LIABILITY_SIGNALS)
  const hospCount = countSignals(text, HOSPITALITY_SIGNALS)
  const specCount = countSignals(text, SPECIALIZATION_SIGNALS)
  const isCaptive = CAPTIVE_BRANDS.some((b) => (prospect.company || '').toLowerCase().includes(b)) ||
    countSignals(text, CAPTIVE_BRANDS) >= 2

  const signals = []
  if (llCount > 0) signals.push('liquor_liability')
  if (hospCount > 0) signals.push('hospitality')
  if (specCount > 0) signals.push('commercial_specialty')
  if (isCaptive) signals.push('captive_brand')

  const email = extractEmails(html, domain)
  const phone = prospect.phone || extractPhone(text)
  const contactMatch = html.match(/href=["']([^"']*contact[^"']*)["']/i)
  let contactPage = ''
  if (contactMatch) { try { contactPage = new URL(contactMatch[1], base).href } catch { /* ignore */ } }
  const description = extractDescription(html, text)

  const writesLL = prospect.writes_liquor_liability ? 1 : (llCount > 0 ? 1 : 0)
  const llConfidence = Math.max(
    prospect.ll_confidence || 0,
    llCount > 0 ? Math.min(0.4 + 0.15 * llCount, 0.95) : 0,
  )

  db.prepare(`
    UPDATE prospects SET email = COALESCE(NULLIF(?,''), email),
      phone = COALESCE(NULLIF(?,''), phone),
      contact_page = COALESCE(NULLIF(?,''), contact_page),
      description = COALESCE(NULLIF(?,''), description),
      tech_signals = ?, writes_liquor_liability = ?, ll_confidence = ?,
      status = 'enriched', updated_at = ?
    WHERE id = ?
  `).run(email, phone, contactPage, description, JSON.stringify(signals), writesLL, llConfidence, nowIso(), prospect.id)

  return { id: prospect.id, ok: true, signals, hasEmail: !!email, llCount }
}

export async function enrichAll(db = getDb(), { limit = 500 } = {}) {
  const rows = db.prepare(`
    SELECT * FROM prospects WHERE status = 'discovered' ORDER BY id LIMIT ?
  `).all(limit)
  let ok = 0, withEmail = 0, withLL = 0
  for (const p of rows) {
    const r = await enrichOne(db, p)
    if (r.ok) { ok++; if (r.hasEmail) withEmail++; if (r.llCount > 0) withLL++ }
    await sleep(REQUEST_DELAY_MS)
  }
  return { processed: rows.length, ok, withEmail, withLL }
}

if (process.argv[1]?.endsWith('fetch-website.mjs')) {
  const r = await enrichAll(getDb(), { limit: Number(process.argv[2]) || 500 })
  console.log(`✓ enrichment: ${r.ok}/${r.processed} fetched, ${r.withEmail} got email, ${r.withLL} show liquor-liability signal`)
}
