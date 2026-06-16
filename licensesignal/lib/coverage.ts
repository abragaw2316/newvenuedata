// Single source of truth for which programmatic /coverage/[county]/[type] pages
// exist. A county×type page is generated only when the real dataset holds at least
// MIN_TYPE_RECORDS licenses of that type in that county — so every page carries
// genuine, differentiated data (no thin/empty pages). SRX and 4COP are sub-series
// folded into COP/APS in the source data and have no standalone per-county counts,
// so they naturally drop out of the matrix here.
import { FL_COUNTIES } from './fl-counties'
import { LICENSE_TYPES, type LicenseType } from './license-type-info'
import { COUNTY_STATS, CITY_STATS } from './county-stats'

export const MIN_TYPE_RECORDS = 3

/** License types with real data (>= MIN_TYPE_RECORDS) in a county. */
export function countyTypesWithData(countySlug: string): LicenseType[] {
  const stat = COUNTY_STATS[countySlug]
  if (!stat) return []
  return LICENSE_TYPES.filter((t) => (stat.byType[t.code] ?? 0) >= MIN_TYPE_RECORDS)
}

/** Every (county, type) slug pair that meets the data threshold. */
export function coverageTypeParams(): { county: string; type: string }[] {
  return FL_COUNTIES.flatMap((c) =>
    countyTypesWithData(c.slug).map((t) => ({ county: c.slug, type: t.slug }))
  )
}

/** Every (county, city) slug pair that has a city page (>= CITY_MIN records). */
export function coverageCityParams(): { county: string; city: string }[] {
  return Object.entries(CITY_STATS).flatMap(([county, cities]) =>
    cities.map((c) => ({ county, city: c.citySlug }))
  )
}
