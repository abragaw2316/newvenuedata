import type { Metadata } from 'next'
import { LegalPage, type LegalSection } from '@/components/legal/legal-page'

export const metadata: Metadata = {
  title: 'Data Policy',
  description:
    'How New Venue Data sources, normalizes, and responsibly distributes Florida public-records data.',
  alternates: { canonical: 'https://newvenuedata.com/data-policy' },
  robots: { index: true, follow: true },
}

const SECTIONS: LegalSection[] = [
  {
    heading: 'Our Data Principles',
    blocks: [
      {
        p: 'New Venue Data distributes data derived exclusively from government public records. This Data Policy explains where our data comes from, how we process it, and the boundaries we place on its use. It complements our Privacy Policy and Terms of Service.',
      },
    ],
  },
  {
    heading: 'Sources',
    blocks: [
      { p: 'Our data is sourced from official Florida government records, including:' },
      {
        list: [
          'Florida Department of Business and Professional Regulation (DBPR) — liquor, SRX, and food-service license filings.',
          'Florida DBPR Food Safety division — food-service establishment permits.',
          'Other publicly available state and county regulatory records as we expand coverage.',
        ],
      },
      {
        p: 'We do not purchase or incorporate data from consumer data brokers, and we do not collect data from private or non-public sources.',
      },
    ],
  },
  {
    heading: 'Business-Entity Data Only',
    blocks: [
      {
        p: 'Our records describe businesses — their license type, status, filing events, and registered locations. Where a public record includes an owner or officer name as part of a business filing, it is treated strictly as business-entity context, never as a consumer profile. We are not a consumer reporting agency, and the data may not be used for FCRA-governed purposes.',
      },
    ],
  },
  {
    heading: 'Normalization & Quality',
    blocks: [
      { p: 'Raw public records are inconsistent. Our pipeline applies:' },
      {
        list: [
          'Entity resolution — matching each filing to a canonical business entity across systems.',
          'Address standardization and geocoding — USPS-normalized addresses with lat/lng coordinates.',
          'DBA and legal-name resolution — linking trade names to their filing entity.',
          'Event classification — typing each change as new_filing, renewal, ownership_transfer, status_change, or cancellation.',
          'Deduplication — collapsing duplicate filings into a single authoritative record.',
        ],
      },
    ],
  },
  {
    heading: 'Refresh & Accuracy',
    blocks: [
      {
        p: 'We refresh our dataset from source on a daily cadence and compare against the latest snapshot to detect changes. Because we mirror public records, our data reflects what the source agency publishes — including any errors, omissions, or delays present at the source. We surface a sourceUrl on records where available so you can verify against the original.',
      },
    ],
  },
  {
    heading: 'Permitted Use',
    blocks: [
      { p: 'You may use New Venue Data data for legitimate business-to-business purposes, including:' },
      {
        list: [
          'Sales prospecting and territory planning.',
          'Market and competitive intelligence.',
          'Distribution, supply, and partnership targeting.',
          'Investment research and due diligence.',
        ],
      },
      {
        p: 'You may not use the data for individual consumer eligibility decisions, harassment, or any purpose that violates applicable law.',
      },
    ],
  },
  {
    heading: 'Corrections & Removal',
    blocks: [
      {
        p: 'Because our data originates from public records, the authoritative correction path is with the source agency. If you believe a record we distribute is inaccurate, contact austin@newvenuedata.com and we will investigate, annotate, or re-sync the record from source as appropriate.',
      },
    ],
  },
  {
    heading: 'Security',
    blocks: [
      {
        p: 'We protect our data infrastructure with encryption in transit and at rest, least-privilege access, scoped API keys, HMAC-signed webhooks, and audit logging. See our Security page for more detail.',
      },
    ],
  },
]

export default function DataPolicyPage() {
  return (
    <LegalPage
      title="Data Policy"
      lastUpdated="June 14, 2026"
      intro="Where our data comes from, how we make it useful, and how it may be used."
      sections={SECTIONS}
    />
  )
}
