/**
 * api-versioning.ts — New Venue Data public API version policy (dependency-free).
 *
 * Documents the supported API versions, the current default, and any deprecated
 * versions with their announced sunset dates. The deprecationHeaders() helper
 * produces the RFC-compliant response headers a route handler should attach when
 * serving a deprecated version, so the contract lives in one place.
 *
 * Versioning model:
 *   - Versions are date-stamped strings, e.g. "2026-01-15".
 *   - Clients select a version via the `New Venue Data-Version` request header
 *     (falling back to CURRENT_VERSION when absent).
 *   - Deprecated versions still work until their sunset date, after which the
 *     API responds 410 Gone and clients must upgrade.
 */

/** The version served when a client does not pin one. */
export const CURRENT_VERSION = '2026-01-15' as const

/** Header clients send to pin a specific API version. */
export const VERSION_HEADER = 'New Venue Data-Version' as const

/** Every version the API has shipped, newest last. */
export const SUPPORTED_VERSIONS = ['2025-06-01', '2025-10-01', '2026-01-15'] as const

export type ApiVersion = (typeof SUPPORTED_VERSIONS)[number]

export interface DeprecationInfo {
  /** When the version was marked deprecated (ISO date). */
  deprecatedOn: string
  /** When the version stops working entirely (ISO date). */
  sunsetOn: string
  /** Version clients should migrate to. */
  replacedBy: ApiVersion
  /** Link to migration notes for this transition. */
  migrationGuide: string
  /** Short human summary of what changed. */
  summary: string
}

/**
 * Map of deprecated version -> deprecation metadata. Versions absent from this
 * map are considered fully supported. CURRENT_VERSION must never appear here.
 */
export const DEPRECATIONS: Partial<Record<ApiVersion, DeprecationInfo>> = {
  '2025-06-01': {
    deprecatedOn: '2025-10-01',
    sunsetOn: '2026-10-01',
    replacedBy: '2026-01-15',
    migrationGuide: 'https://newvenuedata.com/docs/api/migrations/2025-06-01',
    summary:
      'Offset pagination replaced by cursor pagination; `event` field renamed to `eventType`.',
  },
  '2025-10-01': {
    deprecatedOn: '2026-01-15',
    sunsetOn: '2027-01-15',
    replacedBy: '2026-01-15',
    migrationGuide: 'https://newvenuedata.com/docs/api/migrations/2025-10-01',
    summary: 'Enrichment fields moved under a nested `enrichment` object.',
  },
}

/** True when the given version is known and not yet deprecated. */
export function isSupported(version: string): version is ApiVersion {
  return (SUPPORTED_VERSIONS as readonly string[]).includes(version)
}

/** True when the given version is deprecated (still works until sunset). */
export function isDeprecated(version: string): boolean {
  return Boolean(DEPRECATIONS[version as ApiVersion])
}

/**
 * True when a deprecated version's sunset date has passed relative to `now`.
 * Requests for a sunset version should be answered with 410 Gone.
 */
export function isSunset(version: string, now: Date = new Date()): boolean {
  const info = DEPRECATIONS[version as ApiVersion]
  if (!info) return false
  return now.getTime() >= new Date(info.sunsetOn).getTime()
}

/**
 * Resolve a client-supplied version header into an effective version. Returns
 * CURRENT_VERSION when the header is missing or unrecognized.
 */
export function resolveVersion(requested: string | null | undefined): ApiVersion {
  if (requested && isSupported(requested)) return requested
  return CURRENT_VERSION
}

/**
 * Standard deprecation headers for a response served on `version`. Returns an
 * empty object for non-deprecated versions so the result can always be spread
 * into a Headers init.
 *
 * Emits the IETF `Deprecation` and `Sunset` headers plus a `Link` to the
 * migration guide and a `New Venue Data-Version` echo.
 */
export function deprecationHeaders(version: string): Record<string, string> {
  const headers: Record<string, string> = {
    [VERSION_HEADER]: isSupported(version) ? version : CURRENT_VERSION,
  }

  const info = DEPRECATIONS[version as ApiVersion]
  if (!info) return headers

  headers['Deprecation'] = info.deprecatedOn
  headers['Sunset'] = new Date(info.sunsetOn).toUTCString()
  headers['Link'] = `<${info.migrationGuide}>; rel="deprecation"; type="text/html"`
  headers['New Venue Data-Deprecation-Info'] = info.summary

  return headers
}
