import type {
  LicenseAddress,
  LicenseEnrichment,
  LicenseRecord,
  LicenseStatus,
  LicenseType,
  EventType,
} from '@/lib/types'

/**
 * Typed factory helpers for building fake {@link LicenseRecord} objects in tests.
 *
 * Every factory returns a fully-typed, valid object with sensible defaults, and
 * accepts a partial `overrides` object so a test can pin only the fields it
 * cares about. Defaults are deterministic by default (seeded off a counter) so
 * snapshots and assertions stay stable; pass explicit values when a test needs
 * specific data.
 *
 * Usage:
 *   const rec = buildLicenseRecord({ status: 'pending', licenseType: 'SRX' })
 *   const page = buildLicenseRecords(10, (i) => ({ businessName: `Biz ${i}` }))
 */

// A monotonically increasing counter so repeated calls produce distinct ids /
// license numbers without any randomness. Reset between suites if needed.
let seq = 0

/** Reset the internal sequence counter (useful in `beforeEach`). */
export function resetFactorySeq(): void {
  seq = 0
}

function nextSeq(): number {
  seq += 1
  return seq
}

/** Zero-pad a number to a fixed width for stable, readable ids. */
function pad(n: number, width = 7): string {
  return String(n).padStart(width, '0')
}

export function buildAddress(
  overrides: Partial<LicenseAddress> = {},
): LicenseAddress {
  return {
    street: '142 NW 2nd Ave',
    city: 'Miami',
    county: 'Miami-Dade',
    state: 'FL',
    zip: '33128',
    lat: 25.7743,
    lng: -80.1937,
    ...overrides,
  }
}

export function buildEnrichment(
  overrides: Partial<LicenseEnrichment> = {},
): LicenseEnrichment {
  return {
    phone: '(305) 555-0100',
    website: 'example.com',
    naicsCode: '722410',
    naicsDescription: 'Drinking Places',
    employeeCount: '5-9',
    yearsInBusiness: 0,
    ...overrides,
  }
}

export function buildLicenseRecord(
  overrides: Partial<LicenseRecord> = {},
): LicenseRecord {
  const n = nextSeq()
  const status: LicenseStatus = overrides.status ?? 'approved'
  const licenseType: LicenseType = overrides.licenseType ?? 'BEV'
  const eventType: EventType = overrides.eventType ?? 'new_filing'

  // Pull `address` / `enrichment` out so a partial override of those nested
  // objects merges onto the factory defaults instead of replacing them whole.
  const { address: addressOverride, enrichment: enrichmentOverride, ...rest } =
    overrides

  return {
    id: `lic_test_${pad(n)}`,
    licenseNumber: `${licenseType}-2024-${pad(n)}`,
    licenseType,
    status,
    businessName: `Test Business ${n}`,
    legalName: `Test Business ${n} LLC`,
    dbaName: null,
    address: buildAddress(addressOverride),
    filedDate: '2024-12-01',
    effectiveDate: status === 'approved' ? '2024-12-10' : null,
    expirationDate: status === 'approved' ? '2025-12-09' : null,
    issuedDate: status === 'approved' ? '2024-12-10' : null,
    eventType,
    eventTimestamp: '2024-12-01T09:00:00Z',
    sourceUrl: 'https://www.myfloridalicense.com/DBPR/licensing',
    enrichment: buildEnrichment(enrichmentOverride),
    ...rest,
  }
}

/**
 * Build an array of `count` records. An optional `each` callback receives the
 * zero-based index and returns per-record overrides, letting a test vary one
 * field (county, type, status) across the batch.
 */
export function buildLicenseRecords(
  count: number,
  each: (index: number) => Partial<LicenseRecord> = () => ({}),
): LicenseRecord[] {
  return Array.from({ length: count }, (_, i) => buildLicenseRecord(each(i)))
}

/** Convenience: a pending record (no effective/issued/expiration dates). */
export function buildPendingLicense(
  overrides: Partial<LicenseRecord> = {},
): LicenseRecord {
  return buildLicenseRecord({ status: 'pending', ...overrides })
}
