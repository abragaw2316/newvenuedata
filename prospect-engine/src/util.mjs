// Small shared helpers (zero-dependency).
import { COUNTIES } from './config.mjs'

export const nowIso = () => new Date().toISOString()
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

/** Normalize a website/URL to a bare lowercase domain ("https://www.Foo.com/x" -> "foo.com"). */
export function normalizeDomain(input) {
  if (!input) return ''
  let s = String(input).trim().toLowerCase()
  s = s.replace(/^https?:\/\//, '').replace(/^www\./, '')
  s = s.split(/[/?#]/)[0]
  return s.replace(/\.$/, '')
}

/** Minimal RFC-4180 CSV parser -> array of row objects keyed by header. Handles quotes + CRLF. */
export function parseCsv(text) {
  const rows = []
  let field = ''
  let row = []
  let inQuotes = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++ } else inQuotes = false
      } else field += c
    } else if (c === '"') inQuotes = true
    else if (c === ',') { row.push(field); field = '' }
    else if (c === '\n') { row.push(field); rows.push(row); field = ''; row = [] }
    else if (c === '\r') { /* ignore, handled by \n */ }
    else field += c
  }
  if (field.length || row.length) { row.push(field); rows.push(row) }
  if (!rows.length) return []
  const header = rows[0].map((h) => h.trim())
  return rows.slice(1)
    .filter((r) => r.some((c) => c.trim() !== ''))
    .map((r) => Object.fromEntries(header.map((h, i) => [h, (r[i] ?? '').trim()])))
}

/** Best-effort county match from a freeform location string. Returns canonical name or ''. */
export function countyFromText(text) {
  if (!text) return ''
  const t = String(text).toLowerCase()
  for (const c of COUNTIES) {
    if (c.aliases.some((a) => t.includes(a)) || c.cities.some((city) => t.includes(city))) {
      return c.name
    }
  }
  return ''
}

/** Count distinct signal phrases present in a blob of text (case-insensitive). */
export function countSignals(text, signals) {
  if (!text) return 0
  const t = text.toLowerCase()
  let n = 0
  for (const s of signals) if (t.includes(s.toLowerCase())) n++
  return n
}
