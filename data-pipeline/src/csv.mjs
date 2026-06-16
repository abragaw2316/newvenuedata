// Dependency-free CSV parser (RFC-4180-ish): handles double-quoted fields,
// escaped quotes (""), embedded commas/newlines, and CRLF. The DBPR extracts
// are "ASCII text, quote/comma delimited" — every field wrapped in quotes.

/**
 * Parse a full CSV string into an array of string[] rows.
 * @param {string} text
 * @returns {string[][]}
 */
export function parseCsv(text) {
  const rows = []
  let row = []
  let field = ''
  let inQuotes = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        field += c
      }
    } else if (c === '"') {
      inQuotes = true
    } else if (c === ',') {
      row.push(field)
      field = ''
    } else if (c === '\n') {
      row.push(field)
      rows.push(row)
      row = []
      field = ''
    } else if (c === '\r') {
      // swallow; handled by the following \n
    } else {
      field += c
    }
  }
  // flush trailing field/row
  if (field.length > 0 || row.length > 0) {
    row.push(field)
    rows.push(row)
  }
  return rows
}

/**
 * Parse CSV where the first row is a header, returning array of objects keyed by
 * the header columns. Trims whitespace on keys.
 * @param {string} text
 * @returns {{ header: string[], rows: Record<string,string>[] }}
 */
export function parseCsvObjects(text) {
  const all = parseCsv(text)
  if (all.length === 0) return { header: [], rows: [] }
  const header = all[0].map((h) => h.trim())
  const rows = []
  for (let r = 1; r < all.length; r++) {
    const cells = all[r]
    if (cells.length === 1 && cells[0] === '') continue // skip blank lines
    const obj = {}
    for (let c = 0; c < header.length; c++) obj[header[c]] = (cells[c] ?? '').trim()
    rows.push(obj)
  }
  return { header, rows }
}
