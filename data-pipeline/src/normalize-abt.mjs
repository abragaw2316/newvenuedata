// Normalize a parsed AB&T CSV row → the app's LicenseRecord shape (a superset;
// extra raw fields are kept for traceability and can be dropped at the API edge).
//
// The parser is pinned to the LIVE 29-column header (which differs from the
// published layout doc). We read by header NAME, so column drift is tolerated.

import {
  seriesToLicenseType,
  seriesLabel,
  abtStatus,
  countyName,
  toISODate,
  PROFESSION_CATEGORY,
  todayISO,
} from './lookups.mjs'

function joinAddr(...parts) {
  return parts.map((p) => (p || '').trim()).filter(Boolean).join(', ')
}

function stableId(licenseNumber) {
  const clean = String(licenseNumber || '').replace(/[^A-Za-z0-9]/g, '').toUpperCase()
  return clean ? `lic_${clean}` : ''
}

function daysBetween(isoA, isoB) {
  if (!isoA || !isoB) return Infinity
  const a = Date.parse(isoA + 'T00:00:00Z')
  const b = Date.parse(isoB + 'T00:00:00Z')
  if (Number.isNaN(a) || Number.isNaN(b)) return Infinity
  return Math.abs(b - a) / 86_400_000
}

/**
 * @param {Record<string,string>} row  parsed AB&T row keyed by header
 * @param {{ asOf?: string, sourceUrl?: string }} [opts]
 */
export function normalizeAbtRow(row, opts = {}) {
  const asOf = opts.asOf || todayISO()
  const licenseNumber = row['License Number'] || ''
  const series = row['Series'] || ''
  // DBPR stores the SFS/SRX modifier in a separate "Rank" column (also called
  // "Class Modifier" in the published layout). Try both known header names.
  const rank = row['Rank'] || row['Class Modifier'] || ''
  const profession = (row['Profession'] || '').trim()
  const dba = row['DBA'] || ''
  const owner = row['Owner Name'] || ''

  const filedDate = toISODate(row['Original Licensure Date'])
  const effectiveDate = toISODate(row['Effective Date'])
  const expiration = row['Expiration Date'] || ''
  const status = abtStatus(row['Primary Status'], expiration)

  // First-pass event classification from a single snapshot. The authoritative
  // new-filing signal comes from daily.csv / detect-new.mjs (snapshot diffing);
  // from a full snapshot we only flag genuinely RECENT records, leaving the rest
  // as '' (pre-existing) so we never over-report "new" filings.
  let eventType = ''
  if (status === 'cancelled') eventType = 'cancellation'
  else if (filedDate && daysBetween(filedDate, asOf) <= 60) eventType = 'new_filing'
  else if (effectiveDate && daysBetween(effectiveDate, asOf) <= 60) eventType = 'renewal'

  let licenseType = seriesToLicenseType(series, rank)
  // When Series-based detection falls through to 'BEV', check the Profession
  // code to correctly classify non-retail ABT file sources.
  if (licenseType === 'BEV') {
    if (profession === '4002') licenseType = 'TEMP_PERMIT'
    else if (profession === '4005') licenseType = 'MANUFACTURER'
    else if (profession === '4014') licenseType = 'BOTTLE_CLUB'
  }

  return {
    id: stableId(licenseNumber),
    licenseNumber,
    licenseType,
    status,
    businessName: dba || owner,
    legalName: owner,
    dbaName: dba,
    address: {
      street: joinAddr(row['Location Address 1'], row['Location Address 2'], row['Location Address 3']),
      city: (row['Location City'] || '').trim(),
      county: countyName(row['Location County']),
      state: (row['Location State'] || 'FL').trim(),
      zip: (row['Location ZIP'] || '').trim(),
      lat: undefined,
      lng: undefined,
    },
    filedDate,
    effectiveDate,
    eventType,
    eventTimestamp: (effectiveDate || filedDate || asOf) + 'T00:00:00Z',
    sourceUrl: opts.sourceUrl || '',
    // ── raw/traceability extras (superset of LicenseRecord) ──
    _source: 'DBPR-ABT',
    _series: series,
    _seriesLabel: seriesLabel(series),
    _category: PROFESSION_CATEGORY[(row['Profession'] || '').trim()] || 'Alcoholic Beverage',
    _expirationDate: toISODate(expiration),
    _primaryStatusCode: (row['Primary Status'] || '').trim(),
  }
}
