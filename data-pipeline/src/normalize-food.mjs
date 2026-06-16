// Normalize a parsed H&R food-service CSV row (newfood.csv / chgownr_food.csv /
// hrfood[1-7].csv) → the app's LicenseRecord shape.
//
// Food extracts carry ~35 columns; exact header names vary slightly between the
// "new" files and the district files, so we pick each logical field from a list
// of candidate header names (first match wins). After a live run you can pin the
// exact names if desired.

import { foodStatus, countyName, toISODate, todayISO } from './lookups.mjs'

/** pick the first present, non-empty value among candidate header names */
function pick(row, candidates) {
  for (const k of candidates) {
    if (row[k] != null && String(row[k]).trim() !== '') return String(row[k]).trim()
  }
  // case-insensitive fallback
  const lowerWanted = candidates.map((c) => c.toLowerCase())
  for (const key of Object.keys(row)) {
    if (lowerWanted.includes(key.toLowerCase()) && String(row[key]).trim() !== '') {
      return String(row[key]).trim()
    }
  }
  return ''
}

function joinAddr(...parts) {
  return parts.map((p) => (p || '').trim()).filter(Boolean).join(', ')
}

function stableId(licenseNumber, fallback) {
  const clean = String(licenseNumber || fallback || '').replace(/[^A-Za-z0-9]/g, '').toUpperCase()
  return clean ? `lic_${clean}` : ''
}

function foodLicenseType(typeCodeRaw) {
  const t = String(typeCodeRaw || '').toUpperCase()
  if (t.includes('MFDV') || t.includes('MOBILE') || t.includes('CART') || t.includes('HOT DOG')) return 'MOBILE_FOOD'
  if (t.includes('SEAT')) return 'SEATING'
  return 'FOOD_SERVICE'
}

/**
 * @param {Record<string,string>} row
 * @param {{ asOf?: string, sourceUrl?: string, isNew?: boolean }} [opts]
 */
export function normalizeFoodRow(row, opts = {}) {
  const asOf = opts.asOf || todayISO()
  const licenseNumber = pick(row, ['License Number', 'LicenseNumber', 'License Num', 'LIC_NBR'])
  const appNumber = pick(row, ['Application Number', 'ApplicationNumber', 'App Number'])
  const licensee = pick(row, ['Licensee Name', 'LicenseeName', 'Owner Name', 'Mailing Name'])
  const bizName = pick(row, ['Business Name', 'Location Name', 'Business (Location) Name', 'DBA', 'Establishment Name'])
  const approval = pick(row, ['Application Approval Date', 'Approval Date', 'Issue Date', 'License Date'])
  const expiry = pick(row, ['License Expiry Date', 'Expiry Date', 'Expiration Date', 'Expire Date'])
  const primaryStatus = pick(row, ['Primary Status Code', 'Primary Status', 'Status', 'Status Code'])

  const filedDate = toISODate(approval)

  return {
    id: stableId(licenseNumber, appNumber),
    licenseNumber: licenseNumber || appNumber,
    licenseType: foodLicenseType(pick(row, ['Rank Code', 'License Type Code', 'License Type', 'Type'])),
    status: foodStatus(primaryStatus, expiry),
    businessName: bizName || licensee,
    legalName: licensee,
    dbaName: bizName,
    address: {
      street: joinAddr(
        pick(row, ['Location Street Address', 'Location Address 1', 'Location Street 1', 'Location Address']),
        pick(row, ['Location Address Line 2', 'Location Address 2', 'Location Street 2']),
        pick(row, ['Location Address Line 3', 'Location Address 3', 'Location Street 3'])
      ),
      city: pick(row, ['Location City', 'Business City', 'City']),
      county: countyName(pick(row, ['Location County', 'Location County Code', 'County Code', 'County'])),
      state: pick(row, ['Location State Code', 'Location State', 'State']) || 'FL',
      zip: pick(row, ['Location Zip Code', 'Location ZIP', 'Location Zip', 'Zip', 'ZIP']),
      lat: undefined,
      lng: undefined,
    },
    filedDate,
    effectiveDate: filedDate,
    eventType: opts.isNew ? 'new_filing' : 'status_change',
    eventTimestamp: (filedDate || asOf) + 'T00:00:00Z',
    sourceUrl: opts.sourceUrl || '',
    _source: 'DBPR-H&R',
    _seats: pick(row, ['Number of Seats', 'Seats', 'Seating']),
    _lastInspection: toISODate(pick(row, ['Last Inspection Date', 'Last Inspection'])),
    _district: pick(row, ['District']),
  }
}
