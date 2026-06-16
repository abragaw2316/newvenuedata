// Code → human-readable lookups for the DBPR AB&T and H&R extracts.
// Sources: the AB&T "Public Records Layout Information" and "Understanding DBPR
// Codes" pages, plus license_types.pdf. Some tables (county, full series list)
// are partial here and flagged TODO — complete them by parsing the codes pages
// during a build hardening pass.

// ── DBPR numeric county codes ────────────────────────────────────────────────
// Reverse-engineered from the live data: DBPR's county code = (alphabetical rank
// of the county, with Miami-Dade filed under historical "Dade") + 10. Verified
// against real records: Alachua=11, Dade=23, Escambia=27, Hillsborough=39,
// Leon=47, Orange=58, Palm Beach=60. The St.Johns/St.Lucie/Santa Rosa/Sarasota
// tail ordering (codes ~65–68) should be spot-checked against the DBPR codes page.
const FL_COUNTIES_BY_RANK = [
  'Alachua', 'Baker', 'Bay', 'Bradford', 'Brevard', 'Broward', 'Calhoun', 'Charlotte', 'Citrus', 'Clay',
  'Collier', 'Columbia', 'Miami-Dade', 'DeSoto', 'Dixie', 'Duval', 'Escambia', 'Flagler', 'Franklin', 'Gadsden',
  'Gilchrist', 'Glades', 'Gulf', 'Hamilton', 'Hardee', 'Hendry', 'Hernando', 'Highlands', 'Hillsborough', 'Holmes',
  'Indian River', 'Jackson', 'Jefferson', 'Lafayette', 'Lake', 'Lee', 'Leon', 'Levy', 'Liberty', 'Madison',
  'Manatee', 'Marion', 'Martin', 'Monroe', 'Nassau', 'Okaloosa', 'Okeechobee', 'Orange', 'Osceola', 'Palm Beach',
  'Pasco', 'Pinellas', 'Polk', 'Putnam', 'St. Johns', 'St. Lucie', 'Santa Rosa', 'Sarasota', 'Seminole', 'Sumter',
  'Suwannee', 'Taylor', 'Union', 'Volusia', 'Wakulla', 'Walton', 'Washington',
]

export const COUNTY_CODES = Object.fromEntries(
  FL_COUNTIES_BY_RANK.map((name, i) => [String(i + 11), name])
)
// Sentinel codes observed in the data for non-county locations:
Object.assign(COUNTY_CODES, { '78': 'Unknown', '99': 'Unknown', '79': 'Out of State' })

export function countyName(code) {
  if (!code) return ''
  const c = String(code).trim()
  // Food (H&R) extracts already give a county NAME; AB&T gives a numeric code.
  if (!/^\d+$/.test(c)) return titleCase(c) // already a name (e.g. "BROWARD")
  return COUNTY_CODES[c] || `County ${c}`
}

function titleCase(s) {
  return s
    .toLowerCase()
    .replace(/\b\w/g, (m) => m.toUpperCase())
    .replace(/\bDe\b/g, 'De')
}

// ── AB&T license SERIES (col "Series") → app LicenseType union ────────────────
// app LicenseType: 'SRX'|'COP'|'BEV'|'APS'|'FOOD_SERVICE'|'SEATING'|'MOBILE_FOOD'
export function seriesToLicenseType(seriesRaw) {
  const s = String(seriesRaw || '').toUpperCase().trim()
  if (!s) return 'BEV'
  if (s.includes('SRX') || s.includes('SFS') || s === '4COP-SRX') return 'SRX'
  if (s.includes('COP')) return 'COP' // 1COP/2COP/4COP/6COP and SRX handled above
  if (s.includes('APS') || /^\d?P?S$/.test(s) || s.startsWith('3P')) return 'APS' // package stores
  return 'BEV'
}

// Friendly label for a raw series code (partial; extend from license_types.pdf).
export const SERIES_LABELS = {
  '1APS': 'Package beer (off-premises)',
  '2APS': 'Package beer & wine (off-premises)',
  '3PS': 'Quota package liquor store',
  '1COP': 'Beer, on/off premises',
  '2COP': 'Beer & wine, on premises',
  '4COP': 'Full liquor (quota), on/off premises',
  '6COP': 'Full liquor, consumption on premises',
  SRX: 'Special Restaurant (full liquor, ≥51% food)',
  '4COP-SRX': 'Special Restaurant (full liquor, ≥51% food)',
  '4COP-SFS': 'Special Food Service (full liquor)',
  SFS: 'Special Food Service',
  SBX: 'Special Bowling (12+ lanes)',
  ODP: 'One/three-day temporary permit',
  '13CT': 'Catering',
}

export function seriesLabel(seriesRaw) {
  const s = String(seriesRaw || '').toUpperCase().trim()
  return SERIES_LABELS[s] || s || 'Beverage license'
}

// ── AB&T numeric status codes (Primary Status) → app LicenseStatus ───────────
// app LicenseStatus: 'approved'|'pending'|'active'|'expired'|'suspended'|'cancelled'
export const PRIMARY_STATUS = {
  '20': 'active', // Current
  '42': 'suspended',
  '61': 'cancelled', // Revoked
  '99': 'cancelled', // Deleted
}

export function abtStatus(primaryCode, expirationDate) {
  const mapped = PRIMARY_STATUS[String(primaryCode || '').trim()]
  if (mapped) {
    // Past expiration overrides "active" → expired
    if (mapped === 'active' && expirationDate && isPast(expirationDate)) return 'expired'
    return mapped
  }
  return 'active'
}

// ── H&R (food service) status — letter scheme C/Current, etc. ────────────────
export function foodStatus(codeRaw, expirationDate) {
  const c = String(codeRaw || '').toUpperCase().trim()
  if (c.startsWith('C') || c === '20' || c === 'A') {
    return expirationDate && isPast(expirationDate) ? 'expired' : 'active'
  }
  if (c.startsWith('I') || c === 'INACTIVE') return 'cancelled'
  return 'active'
}

// ── AB&T profession (col "Profession") → category ────────────────────────────
export const PROFESSION_CATEGORY = {
  '4001': 'Tobacco Distributor',
  '4002': 'Temporary Permit',
  '4005': 'Distributor/Manufacturer',
  '4006': 'Retail Alcoholic Beverage',
  '4012': 'Retail Tobacco',
  '4013': 'Wine/Spirit Salesperson',
  '4014': 'Bottle Club',
}

// ── date helpers (DBPR dates are MM/DD/YYYY) ─────────────────────────────────
export function toISODate(mdy) {
  const s = String(mdy || '').trim()
  const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (!m) return ''
  const [, mm, dd, yyyy] = m
  return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`
}

export function isPast(mdy) {
  const iso = toISODate(mdy)
  if (!iso) return false
  return iso < todayISO()
}

// Pure, deterministic "today" from the host clock — pipeline scripts may run on a
// schedule; callers can also pass an explicit asOf date to normalizers.
export function todayISO() {
  const d = new Date()
  return d.toISOString().slice(0, 10)
}
