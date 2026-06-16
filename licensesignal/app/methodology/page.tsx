import type { Metadata } from 'next'
import {
  Building2,
  MapPin,
  Landmark,
  Download,
  FileText,
  Layers,
  Bell,
  Navigation,
  Network,
} from 'lucide-react'
import { SectionHeading } from '@/components/shared/section-heading'
import { CountUp } from '@/components/shared/count-up'
import { LiveDataBadge } from '@/components/shared/live-data-badge'
import { DataDisclaimer } from '@/components/shared/data-disclaimer'
import { CtaBanner } from '@/components/sections/cta-banner'
import {
  DATA_AS_OF,
  TOTAL_LICENSEES,
  TOTAL_NEW_RESTAURANTS_FY,
} from '@/lib/real-data'
import { formatDate } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Methodology',
  description:
    'How New Venue Data sources its data: live Florida DBPR public records (Alcoholic Beverages & Tobacco and Hotels & Restaurants), the U.S. Census geocoder, and Sunbiz entity enrichment — across all 67 counties.',
  alternates: { canonical: 'https://newvenuedata.com/methodology' },
}

const SOURCES = [
  {
    icon: Building2,
    name: 'FL DBPR — Alcoholic Beverages & Tobacco',
    file: 'bd4006lic.csv',
    provides:
      'Active retail liquor licenses statewide — consumption-on-premises (COP), package stores (APS), and beer & wine (BEV) — with license number, type, status, business name, and address.',
  },
  {
    icon: Building2,
    name: 'FL DBPR — Hotels & Restaurants',
    file: 'newfood.csv',
    provides:
      'Newly licensed food-service establishments, used to detect restaurants and bars opening across the state this fiscal year.',
  },
  {
    icon: MapPin,
    name: 'U.S. Census Bureau Geocoder',
    file: 'free batch geocoder',
    provides:
      'Latitude/longitude coordinates for every address, enabling map placement, county assignment, and radius search — at no licensing cost.',
  },
  {
    icon: Landmark,
    name: 'FL Division of Corporations (Sunbiz)',
    file: 'business-entity registry',
    provides:
      'Legal entity name, registered officers, and corporate status to enrich each licensee with its underlying business entity.',
  },
]

const PIPELINE = [
  {
    icon: Download,
    title: 'Fetch official bulk extracts',
    desc: 'We pull the DBPR AB&T and H&R public-record CSV extracts directly from the state, daily — no scraping of intermediaries.',
  },
  {
    icon: FileText,
    title: 'Parse',
    desc: 'Each extract is parsed field-by-field into structured records with typed license numbers, statuses, and addresses.',
  },
  {
    icon: Layers,
    title: 'Normalize & dedupe',
    desc: 'Names and addresses are standardized, and duplicate filings for the same business are collapsed into a single canonical record.',
  },
  {
    icon: Bell,
    title: 'Detect new filings',
    desc: 'We diff each refresh against the prior snapshot to surface genuinely new licenses and status changes — not stale rows.',
  },
  {
    icon: Navigation,
    title: 'Geocode',
    desc: 'Every address is run through the free U.S. Census batch geocoder to assign coordinates and confirm its county.',
  },
  {
    icon: Network,
    title: 'Enrich with business entity',
    desc: 'Records are matched to FL Division of Corporations (Sunbiz) data to attach the legal entity behind each license.',
  },
]

const STATS = [
  { label: 'Active liquor licensees', target: TOTAL_LICENSEES },
  { label: 'Florida counties covered', target: 67 },
  { label: 'New restaurants this FY', target: TOTAL_NEW_RESTAURANTS_FY },
]

export default function MethodologyPage() {
  return (
    <div>
      {/* Hero */}
      <section className="py-20 lg:py-28 gradient-hero">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-6 text-center">
          <LiveDataBadge />
          <h1 className="text-display-lg text-[var(--ls-fg)] max-w-3xl">
            How we source the data
          </h1>
          <p className="text-lg text-[var(--ls-fg-2)] max-w-2xl">
            New Venue Data runs on real Florida public records — fetched from the
            source, normalized, geocoded, and enriched. Here is exactly where it
            comes from and how it is built, refreshed as of{' '}
            {formatDate(DATA_AS_OF)}.
          </p>
        </div>
      </section>

      {/* Where it comes from */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-10">
          <SectionHeading
            eyebrow="Sources"
            heading="Where it comes from"
            subtext="Four authoritative, public sources — each contributing a distinct layer of the record."
          />
          <div className="grid gap-4 md:grid-cols-2">
            {SOURCES.map((s) => {
              const Icon = s.icon
              return (
                <div
                  key={s.name}
                  className="rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-6 flex flex-col gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10">
                      <Icon className="h-4 w-4 text-indigo-400" aria-hidden="true" />
                    </div>
                    <div className="flex flex-col">
                      <h3 className="text-sm font-semibold text-[var(--ls-fg)]">
                        {s.name}
                      </h3>
                      <code className="text-xs text-[var(--ls-fg-3)]">{s.file}</code>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-[var(--ls-fg-2)]">
                    {s.provides}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Our pipeline */}
      <section className="py-20 bg-[var(--ls-surface-2)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-10">
          <SectionHeading
            eyebrow="Pipeline"
            heading="Our pipeline"
            subtext="A repeatable flow runs on every refresh — from raw state extract to an enriched, map-ready record."
          />
          <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {PIPELINE.map((step, i) => {
              const Icon = step.icon
              return (
                <li
                  key={step.title}
                  className="relative rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-6 flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10">
                      <Icon className="h-4 w-4 text-indigo-400" aria-hidden="true" />
                    </div>
                    <span className="text-xs font-bold tabular-nums text-[var(--ls-fg-4)]">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-[var(--ls-fg)]">
                    {step.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-[var(--ls-fg-3)]">
                    {step.desc}
                  </p>
                </li>
              )
            })}
          </ol>
        </div>
      </section>

      {/* Coverage & freshness */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-10">
          <SectionHeading
            eyebrow="Coverage & freshness"
            heading="Every county, refreshed from source"
            subtext="We track all 67 Florida counties from DBPR bulk extracts, refreshed daily to weekly, with the latest snapshot dated below."
          />

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-6 flex flex-col gap-2">
              <h3 className="text-sm font-semibold text-[var(--ls-fg)]">
                Statewide coverage
              </h3>
              <p className="text-sm leading-relaxed text-[var(--ls-fg-2)]">
                All 67 Florida counties are covered. Miami-Dade (6,565), Broward
                (4,337), and Orange (3,454) lead by active liquor licensees,
                followed by Palm Beach, Hillsborough, Pinellas, Duval, Lee,
                Brevard, and Volusia.
              </p>
            </div>
            <div className="rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-6 flex flex-col gap-3">
              <h3 className="text-sm font-semibold text-[var(--ls-fg)]">
                Freshness
              </h3>
              <p className="text-sm leading-relaxed text-[var(--ls-fg-2)]">
                Data is refreshed daily to weekly from DBPR bulk extracts. The
                current snapshot is dated {formatDate(DATA_AS_OF)}.
              </p>
              <LiveDataBadge />
            </div>
          </div>

          {/* Stat row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-6 flex flex-col gap-1 items-center text-center"
              >
                <p className="text-display-md text-[var(--ls-fg)] tabular-nums">
                  <CountUp to={s.target} />
                </p>
                <p className="text-xs text-[var(--ls-fg-3)]">{s.label}</p>
              </div>
            ))}
          </div>

          <DataDisclaimer />
        </div>
      </section>

      <CtaBanner />
    </div>
  )
}
