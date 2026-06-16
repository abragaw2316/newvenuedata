import { absoluteUrl } from '@/lib/seo'

interface DatasetSchemaProps {
  /** Human-readable dataset name, e.g. "Miami-Dade County Liquor License Filings". */
  name: string
  /** One- or two-sentence description of what the dataset contains. */
  description: string
  /** Site-relative path or absolute URL of the page describing the dataset. */
  url: string
  /** Optional descriptive keywords / categories. */
  keywords?: string[]
  /** Optional spatial coverage label, e.g. "Florida, United States". */
  spatialCoverage?: string
  /** Optional ISO-8601 date the dataset was last updated. */
  dateModified?: string
  /** Optional license URL governing reuse of the dataset. */
  license?: string
}

/**
 * Emits a schema.org Dataset JSON-LD block for coverage pages. Helps the page
 * qualify for Google Dataset Search and gives AI answer engines a structured
 * description of the underlying public-records dataset. Server-component
 * friendly (no client hooks).
 */
export function DatasetSchema({
  name,
  description,
  url,
  keywords,
  spatialCoverage,
  dateModified,
  license,
}: DatasetSchemaProps) {
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name,
    description,
    url: absoluteUrl(url),
    isAccessibleForFree: true,
    creator: {
      '@type': 'Organization',
      name: 'New Venue Data',
      url: absoluteUrl('/'),
    },
  }

  if (keywords && keywords.length > 0) jsonLd.keywords = keywords
  if (spatialCoverage) {
    jsonLd.spatialCoverage = {
      '@type': 'Place',
      name: spatialCoverage,
    }
  }
  if (dateModified) jsonLd.dateModified = dateModified
  if (license) jsonLd.license = license

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
      }}
    />
  )
}
