import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { SectionHeading } from '@/components/shared/section-heading'
import { AnimatedCounter } from '@/components/shared/animated-counter'
import { LiveDataBadge } from '@/components/shared/live-data-badge'
import { LicenseVolumeChart } from '@/components/charts/license-volume-chart'
import { CountyBarChart } from '@/components/charts/county-bar-chart'
import { CtaBanner } from '@/components/sections/cta-banner'
import { DatasetSchema } from '@/components/seo/dataset-schema'
import { TOTAL_LICENSEES, TOTAL_NEW_RESTAURANTS_FY } from '@/lib/real-data'

export const metadata: Metadata = {
  title: 'Data Coverage',
  description:
    'New Venue Data tracks Florida liquor and food-service licenses across all 67 counties, sourced from official FL DBPR public records and refreshed daily. See coverage stats and methodology.',
  alternates: { canonical: 'https://newvenuedata.com/data-coverage' },
}

const SOURCES = [
  {
    source: 'FL DBPR — Alcoholic Beverages & Tobacco',
    recordTypes: 'Liquor (COP, APS, BEV) — bd4006lic.csv',
    refresh: 'Daily',
    method: 'Entity normalization + Census geocoding',
  },
  {
    source: 'FL DBPR — Hotels & Restaurants',
    recordTypes: 'New food-service establishments — newfood.csv',
    refresh: 'Daily',
    method: 'DBA resolution + deduplication',
  },
  {
    source: 'FL Division of Corporations (Sunbiz)',
    recordTypes: 'Business-entity enrichment',
    refresh: 'Weekly',
    method: 'Legal-entity match + officer linkage',
  },
]

// Liquor license-type mix from the live DBPR AB&T extract. These four sum to the
// active retail-liquor total (TOTAL_LICENSEES); SRX is shown separately now that
// Special Restaurant / Special Food Service licenses are classified correctly.
const TYPE_MIX = [
  { code: 'APS', label: 'Package stores', count: 20863, accent: 'text-violet-400', bar: 'bg-violet-500/70' },
  { code: 'COP', label: 'Consumption on premises', count: 19049, accent: 'text-indigo-400', bar: 'bg-indigo-500/70' },
  { code: 'SRX', label: 'Special restaurant (full liquor)', count: 9546, accent: 'text-sky-400', bar: 'bg-sky-500/70' },
  { code: 'BEV', label: 'Beer & wine', count: 2609, accent: 'text-emerald-400', bar: 'bg-emerald-500/70' },
]

// Top counties by total licenses tracked (all record types). These match the
// per-county /coverage/[county] pages exactly — same dataset, same counts.
const COUNTY_LEADERBOARD = [
  { county: 'Miami-Dade', count: 8156 },
  { county: 'Broward', count: 5094 },
  { county: 'Orange', count: 4345 },
  { county: 'Palm Beach', count: 3885 },
  { county: 'Hillsborough', count: 3547 },
  { county: 'Pinellas', count: 3461 },
  { county: 'Duval', count: 2930 },
  { county: 'Lee', count: 2382 },
  { county: 'Brevard', count: 1813 },
  { county: 'Volusia', count: 1746 },
]

const TYPE_MIX_TOTAL = TYPE_MIX.reduce((sum, t) => sum + t.count, 0)

const NORMALIZATION_STEPS = [
  { title: 'Entity Resolution', desc: 'Match legal name, DBA name, and address to a single canonical entity record across filings.' },
  { title: 'Address Standardization', desc: 'Parse, standardize, and geocode every address to lat/lng using USPS and HERE geocoding.' },
  { title: 'Deduplication', desc: 'Detect and collapse duplicate filings from the same business across data refresh cycles.' },
  { title: 'Event Classification', desc: 'Classify each delta as new_filing, renewal, ownership_transfer, address_change, or cancellation.' },
]

export default function DataCoveragePage() {
  return (
    <div>
      <DatasetSchema
        name="Florida Liquor & Food-Service License Filings"
        description="Liquor and food-service license records across all 67 Florida counties, sourced from official FL DBPR public records (Alcoholic Beverages & Tobacco and Hotels & Restaurants) and refreshed daily."
        url="/data-coverage"
        keywords={['Florida liquor licenses', 'food-service licenses', 'FL DBPR', 'new business openings', 'liquor liability leads']}
        spatialCoverage="Florida, United States"
        license="https://newvenuedata.com/data-policy"
      />
      {/* Hero */}
      <section className="py-20 lg:py-28 gradient-hero">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-12">
          <SectionHeading
            eyebrow="Data Coverage"
            heading="Complete Florida Coverage, Refreshed Daily"
            subtext="Every FL DBPR liquor and food-service license — all 67 counties, refreshed daily from source."
          />

          {/* Provenance */}
          <div className="flex flex-col items-center gap-3 -mt-4">
            <LiveDataBadge />
            <p className="max-w-2xl text-center text-sm text-[var(--ls-fg-3)]">
              Sourced from official Florida public records — the DBPR{' '}
              <span className="text-[var(--ls-fg-2)]">Division of Alcoholic Beverages &amp; Tobacco</span>{' '}
              and{' '}
              <span className="text-[var(--ls-fg-2)]">Division of Hotels &amp; Restaurants</span>,
              released under Florida Chapter 119 public-records law.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto w-full">
            {[
              { label: 'Active Liquor Licensees', target: TOTAL_LICENSEES },
              { label: 'Florida Counties', target: 67 },
              { label: 'New Restaurants (FY)', target: TOTAL_NEW_RESTAURANTS_FY },
              { label: 'Avg Refresh (hrs)', target: 24 },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-5 flex flex-col gap-1 items-center text-center">
                <p className="text-3xl font-bold text-[var(--ls-fg)] tabular-nums">
                  <AnimatedCounter target={s.target} />
                </p>
                <p className="text-xs text-[var(--ls-fg-3)]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Charts */}
      <section className="py-20 bg-[var(--ls-surface-2)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
          <SectionHeading
            eyebrow="Filing Volume"
            heading="90-Day Filing Trends"
            subtext="Liquor and food-service license filings across all Florida counties over the last 90 days."
          />
          <div className="rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-6">
            <LicenseVolumeChart days={90} />
          </div>
        </div>
      </section>

      {/* County chart */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
          <SectionHeading
            eyebrow="By County"
            heading="Top Counties by Licenses Tracked"
            subtext="Miami-Dade leads with 8,156 licenses tracked, followed by Broward and Orange — covering all 67 Florida counties."
          />
          <div className="rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-6">
            <CountyBarChart topN={10} horizontal={true} source={COUNTY_LEADERBOARD} />
          </div>

          {/* County leaderboard (real DBPR figures) */}
          <div className="rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--ls-border)]">
                  {['#', 'County', 'Licenses Tracked'].map((h) => (
                    <th key={h} scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-widest text-[var(--ls-fg-3)] last:text-right">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COUNTY_LEADERBOARD.map((c, i) => (
                  <tr key={c.county} className="border-b border-[var(--ls-border)] last:border-0">
                    <td className="px-4 py-3 text-xs text-[var(--ls-fg-3)] tabular-nums w-10">{i + 1}</td>
                    <td className="px-4 py-3 text-xs font-medium text-[var(--ls-fg)]">{c.county}</td>
                    <td className="px-4 py-3 text-xs text-[var(--ls-fg-2)] tabular-nums text-right">
                      {c.count.toLocaleString('en-US')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* License-type mix */}
      <section className="py-20 bg-[var(--ls-surface-2)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
          <SectionHeading
            eyebrow="License Mix"
            heading="Liquor Licenses by Type"
            subtext="The active retail liquor population breaks down across consumption-on-premises, package stores, and beer & wine permits."
          />
          <div className="grid gap-4 sm:grid-cols-3">
            {TYPE_MIX.map((t) => {
              const pct = Math.round((t.count / TYPE_MIX_TOTAL) * 100)
              return (
                <div key={t.code} className="rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-6 flex flex-col gap-3">
                  <div className="flex items-baseline justify-between">
                    <span className={`text-sm font-semibold ${t.accent}`}>{t.code}</span>
                    <span className="text-xs text-[var(--ls-fg-3)] tabular-nums">{pct}%</span>
                  </div>
                  <p className="text-3xl font-bold text-[var(--ls-fg)] tabular-nums">
                    <AnimatedCounter target={t.count} />
                  </p>
                  <p className="text-xs text-[var(--ls-fg-3)]">{t.label}</p>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[var(--ls-hover)]">
                    <div className={`h-full rounded-full ${t.bar}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Sources */}
      <section className="py-20 bg-[var(--ls-surface-2)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-10">
          <SectionHeading
            eyebrow="Data Sources"
            heading="Where the Data Comes From"
            subtext="We pull directly from Florida DBPR bulk extracts, geocode via the free U.S. Census batch geocoder, enrich entities from Sunbiz, and deliver via API."
          />
          <div className="rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--ls-border)]">
                  {['Source', 'Record Types', 'Refresh', 'Normalization'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-widest text-[var(--ls-fg-3)]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SOURCES.map((s) => (
                  <tr key={s.source} className="border-b border-[var(--ls-border)] last:border-0">
                    <td className="px-4 py-4 font-medium text-[var(--ls-fg)] text-xs">{s.source}</td>
                    <td className="px-4 py-4 text-[var(--ls-fg-2)] text-xs">{s.recordTypes}</td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-400">
                        {s.refresh}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-[var(--ls-fg-2)] text-xs">{s.method}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Normalization steps */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {NORMALIZATION_STEPS.map((step, i) => (
              <div key={step.title} className="rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-5 flex flex-col gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full border border-indigo-500/20 bg-indigo-500/10">
                  <span className="text-xs font-bold text-indigo-400">{i + 1}</span>
                </div>
                <h3 className="text-sm font-semibold text-[var(--ls-fg)]">{step.title}</h3>
                <p className="text-xs text-[var(--ls-fg-3)] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* Source & methodology */}
          <div className="flex flex-col items-center gap-3 text-center">
            <p className="text-sm text-[var(--ls-fg-3)]">
              Read the full pipeline, refresh cadence, and compliance notes in our{' '}
              <Link
                href="/methodology"
                className="inline-flex items-center gap-1 font-medium text-indigo-400 hover:text-indigo-300"
              >
                Source &amp; methodology
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </p>
            <p className="max-w-2xl text-xs text-[var(--ls-fg-4)] leading-relaxed">
              Business-entity data only (FCRA-safe — not a consumer report; not for credit, employment, tenant, or
              insurance screening of individuals). Not affiliated with or endorsed by DBPR or the State of Florida.
              Provided &ldquo;as is.&rdquo;
            </p>
          </div>
        </div>
      </section>

      <CtaBanner />
    </div>
  )
}
