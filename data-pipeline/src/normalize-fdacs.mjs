// Normalize an FDACS ArcGIS feature (attributes + geometry) → LicenseRecord shape.
// FDACS Food Safety covers RETAIL food (grocery, convenience, markets, bakeries)
// and food MANUFACTURING — the half DBPR (restaurants) doesn't. Coordinates are
// native WGS84 (no geocoding needed), and records carry phone/email/hours that
// the DBPR feeds lack. New-establishment detection = snapshot diff on
// FOOD_ENTITY_NUM (there is no date field). Source is Ch. 119 public record.

function titleCase(s) {
  if (!s) return ''
  return String(s)
    .toLowerCase()
    .replace(/\b([a-z])/g, (_m, c) => c.toUpperCase())
    .replace(/\b(Llc|Inc|Lp|Llp|Pa|Bp|Ii|Iii|Iv)\b/g, (m) => m.toUpperCase())
}

/**
 * @param {{attributes:Record<string,any>, geometry?:{x:number,y:number}}} feature
 * @param {{ layer?:0|1, asOf?:string, sourceUrl?:string }} [opts]
 */
export function normalizeFdacsFeature(feature, opts = {}) {
  const a = feature.attributes || {}
  const g = feature.geometry || {}
  const num = String(a.FOOD_ENTITY_NUM ?? a.OBJECTID ?? '')
  const layerName = opts.layer === 1 ? 'Food Manufacturing' : 'Retail Food'

  return {
    id: num ? `lic_FDACS${num}` : '',
    licenseNumber: num,
    licenseType: 'FOOD_SERVICE',
    status: 'active', // service publishes active establishments only
    businessName: titleCase(a.FOOD_ENTITY_NAME),
    legalName: titleCase(a.OWNER_CONTACT_NAME || a.FOOD_ENTITY_NAME),
    dbaName: titleCase(a.FOOD_ENTITY_NAME),
    address: {
      street: titleCase(a.ADDRESS_LINE_1),
      city: titleCase(a.CITY),
      county: titleCase(a.COUNTY || ''),
      state: 'FL',
      zip: String(a.ZIP ?? '').slice(0, 5),
      lat: typeof g.y === 'number' ? g.y : null,
      lng: typeof g.x === 'number' ? g.x : null,
    },
    filedDate: opts.asOf || '',
    effectiveDate: null,
    eventType: 'new_filing', // set by snapshot diff in production
    eventTimestamp: (opts.asOf || '') + 'T00:00:00Z',
    sourceUrl: opts.sourceUrl || '',
    _source: 'FDACS-FoodSafety',
    _category: layerName,
    _risk: a.FE_DESCRIPTION || '',
    _hours: a.OPERATING_HOURS || '',
    _email: a.FE_CONTACT_EMAILL || a.OWNER_CONTACT_EMAIL || '',
    enrichment: {
      phone: a.FE_CONTACT_PHONE || a.OWNER_CONTACT_PHONE || null,
      website: null,
      naicsCode: null,
      naicsDescription: null,
      employeeCount: null,
      yearsInBusiness: null,
    },
  }
}
