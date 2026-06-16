import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight,
  MapPin,
  Building2,
  UtensilsCrossed,
  TrendingUp,
  Layers,
  FileText,
} from 'lucide-react'
import { SectionHeading } from '@/components/shared/section-heading'
import { TagBadge } from '@/components/shared/tag-badge'
import { CtaBanner } from '@/components/sections/cta-banner'
import { CountUp } from '@/components/shared/count-up'
import { MarketCharts } from '@/components/reports/market-charts'
import {
  DATA_AS_OF,
  TOTAL_LICENSEES,
  TOTAL_NEW_RESTAURANTS_FY,
} from '@/lib/real-data'

export const metadata: Metadata = {
  title: 'Florida Liquor & Restaurant License Report 2026',
  description:
    'A data-driven 2026 market report on Florida liquor and restaurant licenses — 52,061 active retail liquor licensees across all 67 counties, the COP/APS/BEV license-type mix, and 6,243 new food-service establishments this fiscal year. Built on live Florida DBPR public records.',
  alternates: { canonical: 'https://newvenuedata.com/reports/florida-2026' },
}

const STATS = [
  {
    icon: Building2,
    value: TOTAL_LICENSEES,
    label: 'Active retail liquor licensees',
    accent: 'text-indigo-400',
  },
  {
    icon: MapPin,
    value: 67,
    label: 'Florida counties covered',
    accent: 'text-violet-400',
  },
  {
    icon: UtensilsCrossed,
    value: TOTAL_NEW_RESTAURANTS_FY,
    label: 'New food-service establishments (FY)',
    accent: 'text-emerald-400',
  },
] as const

export default function Florida2026ReportPage() {
  return (
    <div>
      {/* Hero */}
      <section className="py-20 lg:py-28 gradient-hero">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-3">
            <TagBadge variant="live">Live data</TagBadge>
            <span className="text-sm text-[var(--ls-fg-3)]">
              Data as of {DATA_AS_OF}
            </span>
          </div>
          <h1 className="text-display-lg text-[var(--ls-fg)] max-w-4xl">
            The Florida 2026 Market Report: Liquor &amp; Restaurant Licenses
          </h1>
          <p className="text-lg text-[var(--ls-fg-2)] max-w-3xl">
            Florida runs one of the largest regulated alcohol and food-service markets in the
            country. This report reads the state&apos;s own public records — every active retail
            liquor license and every new restaurant filing — to map where demand is concentrated,
            what the license mix says about who is buying, and where the next wave of openings is
            forming. The numbers below are live, sourced directly from the Florida DBPR.
          </p>
        </div>
      </section>

      {/* Executive-summary stat row */}
      <section className="py-16 border-y border-[var(--ls-border)] bg-[var(--ls-surface-2)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 sm:grid-cols-3">
            {STATS.map((s) => {
              const Icon = s.icon
              return (
                <div
                  key={s.label}
                  className="flex flex-col gap-3 rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-6"
                >
                  <Icon className={`h-5 w-5 ${s.accent}`} />
                  <span className="text-display-md text-[var(--ls-fg)] tabular-nums">
                    <CountUp to={s.value} />
                  </span>
                  <span className="text-sm text-[var(--ls-fg-2)]">{s.label}</span>
                </div>
              )
            })}
          </div>
          <p className="mt-6 max-w-3xl text-sm text-[var(--ls-fg-3)]">
            Every figure in this report is derived from Florida public records under Chapter 119 —
            no estimates, no panels, no surveys. It reflects the regulated universe of businesses,
            not a sample of it.
          </p>
        </div>
      </section>

      {/* Section 1 — Where the licenses are */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-10">
          <SectionHeading
            align="left"
            eyebrow="The map of demand"
            heading="Where the licenses actually are"
            subtext="Florida's alcohol market is not evenly spread. A handful of metros carry most of the activity, and that concentration shapes where a vendor, distributor, or service provider should spend their first dollar."
          />

          <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
            <div className="flex flex-col gap-5 text-[var(--ls-fg-2)]">
              <p>
                Across all {TOTAL_LICENSEES.toLocaleString('en-US')} active retail liquor
                licensees, the top three counties — Miami-Dade (6,565), Broward (4,337), and Orange
                (3,454) — together account for roughly 14,400 licensees, or about 28% of the entire
                state. Add Palm Beach (3,322) and the four largest counties alone control more than
                one in three liquor licenses in Florida.
              </p>
              <p>
                The pattern is the familiar Florida triangle: the Southeast gold coast
                (Miami-Dade, Broward, Palm Beach), the Orlando–I-4 corridor (Orange), and the Tampa
                Bay cluster (Hillsborough 2,901 and Pinellas 2,803). Jacksonville&apos;s Duval
                (2,421) anchors the Northeast, while Lee (1,960), Brevard (1,521), and Volusia
                (1,497) round out the top ten on the back of coastal tourism and fast-growing
                Gulf-coast retirement markets.
              </p>
              <p className="text-[var(--ls-fg)]">
                <span className="font-medium">The takeaway for go-to-market:</span> ten counties
                hold the majority of statewide licensed activity. A team that wants statewide
                coverage can reach most of the addressable market by prioritizing these metros first
                — and treat the remaining 57 counties as a long, defensible tail rather than the
                opening move.
              </p>
            </div>

            <div className="flex flex-col gap-4 rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-6 gradient-card">
              <h3 className="text-base font-semibold text-[var(--ls-fg)]">
                Concentration at a glance
              </h3>
              <ul className="flex flex-col gap-3 text-sm">
                <li className="flex items-center justify-between gap-3">
                  <span className="text-[var(--ls-fg-2)]">Top 3 counties</span>
                  <span className="font-medium text-[var(--ls-fg)]">~28% of all licensees</span>
                </li>
                <li className="flex items-center justify-between gap-3">
                  <span className="text-[var(--ls-fg-2)]">Largest single market (Miami-Dade)</span>
                  <span className="font-medium text-[var(--ls-fg)]">6,565 licensees</span>
                </li>
                <li className="flex items-center justify-between gap-3">
                  <span className="text-[var(--ls-fg-2)]">Top 10 counties combined</span>
                  <span className="font-medium text-[var(--ls-fg)]">~31,800 licensees</span>
                </li>
                <li className="flex items-center justify-between gap-3">
                  <span className="text-[var(--ls-fg-2)]">Counties tracked</span>
                  <span className="font-medium text-[var(--ls-fg)]">All 67</span>
                </li>
              </ul>
              <p className="text-xs text-[var(--ls-fg-3)]">
                The bar chart below ranks the full top ten. Coverage extends to every county in the
                state, including the rural Panhandle and Big Bend markets that rarely show up in
                commercial datasets.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 — License-type mix */}
      <section className="py-20 bg-[var(--ls-surface-2)] border-y border-[var(--ls-border)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-10">
          <SectionHeading
            align="left"
            eyebrow="Reading the mix"
            heading="What the license mix says about the market"
            subtext="The split between on-premises consumption, package stores, and beer-and-wine licenses is a structural fingerprint of demand. It tells you who is opening, what they sell, and which products and services they need."
          />

          <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
            <div className="flex flex-col gap-4 rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-6 gradient-card">
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-indigo-400" />
                <h3 className="text-base font-semibold text-[var(--ls-fg)]">
                  The three-way split
                </h3>
              </div>
              <ul className="flex flex-col gap-3 text-sm">
                <li className="flex items-center justify-between gap-3">
                  <span className="text-[var(--ls-fg-2)]">COP — consumption on premises</span>
                  <span className="font-medium text-[var(--ls-fg)]">28,592 · 55%</span>
                </li>
                <li className="flex items-center justify-between gap-3">
                  <span className="text-[var(--ls-fg-2)]">APS — package stores</span>
                  <span className="font-medium text-[var(--ls-fg)]">20,861 · 40%</span>
                </li>
                <li className="flex items-center justify-between gap-3">
                  <span className="text-[var(--ls-fg-2)]">BEV — beer &amp; wine</span>
                  <span className="font-medium text-[var(--ls-fg)]">2,608 · 5%</span>
                </li>
              </ul>
              <p className="text-xs text-[var(--ls-fg-3)]">
                Percentages of the ~52,000 active liquor licensees. See the donut for the live
                breakdown.
              </p>
            </div>

            <div className="flex flex-col gap-5 text-[var(--ls-fg-2)]">
              <p>
                Consumption-on-premises (COP) licenses dominate at roughly 55% of the market. That
                is the signature of a hospitality-led economy: bars, restaurants, hotels, clubs, and
                entertainment venues where alcohol is served and consumed on site. When more than
                half of a state&apos;s liquor licenses are tied to in-person service, demand is
                being driven by tourism, dining, and nightlife rather than off-premises retail.
              </p>
              <p>
                Package stores (APS) follow at about 40% — a large, durable base of retail liquor
                outlets, convenience-and-gas operators, supermarkets, and standalone bottle shops.
                The near-2,600 beer-and-wine (BEV) licenses are the smallest slice, typically the
                lighter-footprint cafes, delis, and specialty retailers that don&apos;t carry full
                spirits.
              </p>
              <p className="text-[var(--ls-fg)]">
                <span className="font-medium">Why it matters:</span> a COP-heavy market favors
                anyone selling into operating hospitality businesses — POS systems, payroll,
                insurance, food and beverage distribution, staffing, and compliance services. The
                large APS base, by contrast, is a steadier retail channel. Knowing the mix in a
                given county lets a sales team tailor the pitch before the first call.
              </p>
            </div>
          </div>

          {/* Charts */}
          <MarketCharts />
        </div>
      </section>

      {/* Section 3 — New-restaurant pipeline */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-10">
          <SectionHeading
            align="left"
            eyebrow="The buying signal"
            heading="The new-restaurant pipeline is the real lead list"
            subtext="A stock of existing licenses tells you where the market is today. The flow of new filings tells you where it's heading — and a brand-new establishment is the single strongest moment to win a vendor relationship."
          />

          <div className="grid gap-8 lg:grid-cols-3 lg:items-start">
            <div className="lg:col-span-2 flex flex-col gap-5 text-[var(--ls-fg-2)]">
              <p>
                This fiscal year, Florida&apos;s Division of Hotels &amp; Restaurants recorded{' '}
                <span className="font-medium text-[var(--ls-fg)]">
                  {TOTAL_NEW_RESTAURANTS_FY.toLocaleString('en-US')} new food-service
                  establishments
                </span>
                . Each one represents an owner who just signed a lease, is buying equipment, hiring
                staff, choosing a payment processor, lining up insurance, and shopping for
                suppliers — usually all within a few weeks of the license appearing in the public
                record.
              </p>
              <p>
                That timing is the entire point. A restaurant that has been open for three years has
                already chosen its vendors and is expensive to switch. A restaurant whose license
                was filed last week has chosen almost nothing. The new-filing feed converts a static
                directory into a continuously refreshing list of high-intent prospects at the exact
                moment their spending decisions are still open.
              </p>
              <p>
                Layered against the geographic concentration above, the pipeline gets sharper still:
                new filings cluster in the same high-density metros, so a team can monitor a single
                county — or a single ZIP radius around an existing book of business — and be alerted
                the day a new operator enters the market. That is the difference between buying a
                list and watching a market.
              </p>
            </div>

            <div className="flex flex-col gap-4 rounded-xl border border-indigo-500/40 bg-[var(--ls-surface)] p-6 shadow-[0_0_20px_rgba(99,102,241,0.15)] gradient-card">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
              <span className="text-display-md text-[var(--ls-fg)] tabular-nums">
                <CountUp to={TOTAL_NEW_RESTAURANTS_FY} />
              </span>
              <span className="text-sm text-[var(--ls-fg-2)]">
                new food-service establishments this fiscal year — each a fresh, time-sensitive
                buying signal.
              </span>
              <Link
                href="/alerts"
                className="group mt-2 inline-flex items-center gap-1 text-sm font-medium text-indigo-400 transition-colors hover:text-[#818cf8]"
              >
                Get alerted on new filings
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Methodology */}
      <section className="py-16 bg-[var(--ls-surface-2)] border-y border-[var(--ls-border)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <FileText className="mt-0.5 h-5 w-5 flex-shrink-0 text-[var(--ls-fg-3)]" />
              <div className="flex flex-col gap-1">
                <h3 className="text-base font-semibold text-[var(--ls-fg)]">
                  How these numbers were built
                </h3>
                <p className="max-w-2xl text-sm text-[var(--ls-fg-2)]">
                  Figures are drawn from Florida DBPR bulk extracts (Division of Alcoholic Beverages
                  &amp; Tobacco and Division of Hotels &amp; Restaurants), geocoded with the U.S.
                  Census Bureau batch geocoder and enriched with entity data from the Florida
                  Division of Corporations (Sunbiz). Data as of {DATA_AS_OF}, refreshed on a
                  daily/weekly cycle.
                </p>
              </div>
            </div>
            <Link
              href="/methodology"
              className="inline-flex flex-shrink-0 items-center gap-1 rounded-lg border border-[var(--ls-border-2)] bg-[var(--ls-surface)] px-4 py-2 text-sm font-medium text-[var(--ls-fg-2)] transition-colors hover:border-[#6366f1] hover:text-[var(--ls-fg)]"
            >
              Read the full methodology
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <p className="mt-4 max-w-3xl text-xs text-[var(--ls-fg-4)]">
            Released under Florida&apos;s Chapter 119 public-records law. This is business-entity
            data and is not a consumer report — it is not intended for, and must not be used for,
            credit, employment, tenant, or insurance screening of individuals (FCRA-safe).
            New Venue Data is not affiliated with or endorsed by the Florida DBPR or the State of
            Florida. Data provided &quot;as is.&quot;
          </p>
        </div>
      </section>

      <CtaBanner />
    </div>
  )
}
