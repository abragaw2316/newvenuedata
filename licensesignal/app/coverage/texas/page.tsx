import type { Metadata } from 'next'
import Link from 'next/link'
import { MapPin, ArrowRight, Database, RefreshCw } from 'lucide-react'
import { CtaBanner } from '@/components/sections/cta-banner'
import { TX_COUNTY_DETAIL, TX_TOTAL_RECORDS, TX_COVERAGE_AS_OF } from '@/lib/tx-county-stats'

export const metadata: Metadata = {
  title: 'Texas TABC License Data Coverage by County',
  description: `Texas alcoholic-beverage license intelligence from the TABC public record — ${TX_TOTAL_RECORDS.toLocaleString()} licenses across ${Object.keys(TX_COUNTY_DETAIL).length} counties, from Harris and Dallas to the Gulf Coast.`,
  alternates: { canonical: 'https://newvenuedata.com/coverage/texas' },
}

const COUNTIES = Object.entries(TX_COUNTY_DETAIL)
  .map(([slug, d]) => ({ slug, ...d }))
  .sort((a, b) => b.total - a.total)

export default function TexasCoveragePage() {
  return (
    <div>
      <section className="py-20 lg:py-28 gradient-hero">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-6">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 text-xs text-[var(--ls-fg-3)]">
              <li>
                <Link href="/" className="transition-colors hover:text-[var(--ls-fg-2)]">
                  Home
                </Link>
              </li>
              <li className="text-[var(--ls-fg-4)]">/</li>
              <li>
                <Link href="/coverage" className="transition-colors hover:text-[var(--ls-fg-2)]">
                  Coverage
                </Link>
              </li>
              <li className="text-[var(--ls-fg-4)]">/</li>
              <li className="text-[var(--ls-fg-2)]">Texas</li>
            </ol>
          </nav>

          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium uppercase tracking-widest text-indigo-400">
            <Database className="h-3.5 w-3.5" />
            Texas · TABC
          </span>

          <h1 className="text-display-lg text-[var(--ls-fg)]">Texas License Data Coverage</h1>

          <p className="max-w-2xl text-lg text-[var(--ls-fg-2)]">
            New Venue Data tracks {TX_TOTAL_RECORDS.toLocaleString()} Texas alcoholic-beverage
            licenses from the TABC public record, across {COUNTIES.length} counties — from the
            Houston and Dallas–Fort Worth metros to the Gulf Coast. Explore coverage by county
            below; the full Texas trigger feed is rolling out next.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/expansion/texas"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300"
            >
              Join the Texas waitlist <ArrowRight className="h-4 w-4" />
            </Link>
            <span className="text-[var(--ls-fg-4)]">·</span>
            <Link
              href="/coverage"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300"
            >
              Florida coverage (live today) <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
          <h2 className="text-display-sm text-[var(--ls-fg)]">Texas counties we cover</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {COUNTIES.map((c) => (
              <Link
                key={c.slug}
                href={`/coverage/texas/${c.slug}`}
                className="flex items-center justify-between rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] px-4 py-3 transition-colors hover:border-indigo-500/40"
              >
                <span className="flex items-center gap-2 text-sm font-medium text-[var(--ls-fg)]">
                  <MapPin className="h-3.5 w-3.5 text-indigo-400" />
                  {c.name} County
                </span>
                <span className="text-xs tabular-nums text-[var(--ls-fg-3)]">
                  {c.total.toLocaleString()}
                </span>
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs text-[var(--ls-fg-3)]">
            <RefreshCw className="h-3.5 w-3.5 text-[var(--ls-fg-4)]" />
            Counts from the Texas TABC open-data file as of {TX_COVERAGE_AS_OF}.
          </div>
        </div>
      </section>

      <CtaBanner />
    </div>
  )
}
