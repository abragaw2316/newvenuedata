import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Check, MapPin, CalendarClock, ArrowRight } from 'lucide-react'
import { TagBadge } from '@/components/shared/tag-badge'
import { WaitlistForm } from '@/components/shared/waitlist-form'
import { CtaBanner } from '@/components/sections/cta-banner'
import { EXPANSION_STATES, getExpansionState } from '@/lib/expansion-states'
import {
  TX_TOTAL_LICENSES,
  TX_LICENSE_TYPE_COUNT,
  TX_TOP_COUNTIES,
  TX_DATA_AS_OF,
  TX_SOURCE,
} from '@/lib/texas-stats'
import {
  GA_TOTAL_LICENSES,
  GA_LICENSE_TYPE_COUNT,
  GA_RECENT_COMMENCEMENTS,
  GA_TOP_TYPES,
  GA_DATA_AS_OF,
  GA_SOURCE,
} from '@/lib/georgia-stats'

interface PageProps {
  params: Promise<{ state: string }>
}

export function generateStaticParams() {
  return EXPANSION_STATES.map((state) => ({ state: state.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { state: slug } = await params
  const state = getExpansionState(slug)

  if (!state) {
    return { title: 'State Not Found' }
  }

  return {
    title: `${state.name} License Data — Coming Soon`,
    description: `${state.name} liquor and food-service license intelligence is coming to New Venue Data in ${state.status}. Join the waitlist to get the ${state.name} feed the day it launches.`,
    alternates: { canonical: `https://newvenuedata.com/expansion/${state.slug}` },
  }
}

export default async function ExpansionStatePage({ params }: PageProps) {
  const { state: slug } = await params
  const state = getExpansionState(slug)

  if (!state) {
    notFound()
  }

  return (
    <div>
      {/* Hero */}
      <section className="py-20 lg:py-28 gradient-hero">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-6">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 text-xs text-[var(--ls-fg-3)]">
              <li>
                <Link href="/" className="transition-colors hover:text-[var(--ls-fg-2)]">
                  Home
                </Link>
              </li>
              <li className="text-[var(--ls-fg-4)]">/</li>
              <li>
                <Link
                  href="/data-coverage"
                  className="transition-colors hover:text-[var(--ls-fg-2)]"
                >
                  Coverage
                </Link>
              </li>
              <li className="text-[var(--ls-fg-4)]">/</li>
              <li className="text-[var(--ls-fg-2)]">{state.name}</li>
            </ol>
          </nav>

          <div className="flex flex-wrap items-center gap-3">
            <TagBadge variant="beta">Coming Soon</TagBadge>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--ls-fg-2)]">
              <CalendarClock className="h-3.5 w-3.5 text-amber-400" />
              Target launch: {state.status}
            </span>
          </div>

          <h1 className="text-display-lg text-[var(--ls-fg)]">
            {state.name} License Data
          </h1>

          <p className="max-w-2xl text-lg text-[var(--ls-fg-2)]">{state.blurb}</p>

          {/* Highlights */}
          <ul className="grid max-w-2xl gap-2.5 pt-2 sm:grid-cols-2">
            {state.highlights.map((highlight) => (
              <li
                key={highlight}
                className="flex items-start gap-2.5 text-sm text-[var(--ls-fg-2)]"
              >
                <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border border-indigo-500/20 bg-indigo-500/10">
                  <Check className="h-3 w-3 text-indigo-400" />
                </span>
                {highlight}
              </li>
            ))}
          </ul>

          {/* Real TABC data preview (Texas only) */}
          {slug === 'texas' && (
            <div className="mt-2 flex flex-col gap-5 rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-sm font-semibold text-[var(--ls-fg)]">
                  A preview from the live TABC file
                </h2>
                <span className="text-xs text-[var(--ls-fg-3)]">
                  Source: {TX_SOURCE} · as of {TX_DATA_AS_OF}
                </span>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex flex-col gap-1">
                  <p className="text-2xl font-bold tabular-nums text-[var(--ls-fg)]">
                    {TX_TOTAL_LICENSES.toLocaleString()}
                  </p>
                  <p className="text-xs text-[var(--ls-fg-3)]">TABC licenses statewide</p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-2xl font-bold tabular-nums text-[var(--ls-fg)]">
                    {TX_LICENSE_TYPE_COUNT}
                  </p>
                  <p className="text-xs text-[var(--ls-fg-3)]">License types</p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-2xl font-bold tabular-nums text-[var(--ls-fg)]">254</p>
                  <p className="text-xs text-[var(--ls-fg-3)]">Counties covered</p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-xs font-medium uppercase tracking-widest text-[var(--ls-fg-3)]">
                  Top counties by license volume
                </p>
                <div className="flex flex-wrap gap-2">
                  {TX_TOP_COUNTIES.slice(0, 8).map((c) => (
                    <span
                      key={c.county}
                      className="inline-flex items-center gap-2 rounded-full border border-[var(--ls-border-2)] bg-[var(--ls-surface-2)] px-3 py-1 text-xs text-[var(--ls-fg)]"
                    >
                      {c.county}
                      <span className="tabular-nums text-[var(--ls-fg-3)]">
                        {c.count.toLocaleString()}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-xs leading-6 text-[var(--ls-fg-3)]">
                These are real, current TABC license counts pulled from Texas&apos;s daily open-data
                file — the same source the Texas feed will run on at launch.
              </p>
              <Link
                href="/coverage/texas"
                className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300"
              >
                Explore Texas coverage by county <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}

          {/* Real GA DOR data preview (Georgia only) */}
          {slug === 'georgia' && (
            <div className="mt-2 flex flex-col gap-5 rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-sm font-semibold text-[var(--ls-fg)]">
                  A preview from the live Georgia DOR file
                </h2>
                <span className="text-xs text-[var(--ls-fg-3)]">
                  Source: {GA_SOURCE} · as of {GA_DATA_AS_OF}
                </span>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex flex-col gap-1">
                  <p className="text-2xl font-bold tabular-nums text-[var(--ls-fg)]">
                    {GA_TOTAL_LICENSES.toLocaleString()}
                  </p>
                  <p className="text-xs text-[var(--ls-fg-3)]">Active alcohol licenses statewide</p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-2xl font-bold tabular-nums text-[var(--ls-fg)]">
                    {GA_RECENT_COMMENCEMENTS.toLocaleString()}
                  </p>
                  <p className="text-xs text-[var(--ls-fg-3)]">Commenced in the last 12 months</p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-2xl font-bold tabular-nums text-[var(--ls-fg)]">
                    {GA_LICENSE_TYPE_COUNT}
                  </p>
                  <p className="text-xs text-[var(--ls-fg-3)]">License types</p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-xs font-medium uppercase tracking-widest text-[var(--ls-fg-3)]">
                  Top license types
                </p>
                <div className="flex flex-wrap gap-2">
                  {GA_TOP_TYPES.slice(0, 8).map((t) => (
                    <span
                      key={t.type}
                      className="inline-flex items-center gap-2 rounded-full border border-[var(--ls-border-2)] bg-[var(--ls-surface-2)] px-3 py-1 text-xs text-[var(--ls-fg)]"
                    >
                      {t.type}
                      <span className="tabular-nums text-[var(--ls-fg-3)]">
                        {t.count.toLocaleString()}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-xs leading-6 text-[var(--ls-fg-3)]">
                Real, current counts from Georgia&apos;s Department of Revenue alcohol-license file —
                the same source the Georgia feed will run on at launch. The{' '}
                {GA_RECENT_COMMENCEMENTS.toLocaleString()} licenses commenced in the last year are
                exactly the new-venue signal agents want.
              </p>
            </div>
          )}

          {/* Waitlist */}
          <div className="flex flex-col gap-3 pt-4">
            <p className="text-sm font-medium text-[var(--ls-fg)]">
              Be first to know when {state.name} goes live across all {state.counties} counties.
            </p>
            <WaitlistForm stateName={state.name} />
          </div>

          {/* Live-today note */}
          <div className="mt-2 flex w-fit items-center gap-2 rounded-lg border border-[var(--ls-border)] bg-[var(--ls-surface-2)] px-4 py-3 text-sm text-[var(--ls-fg-2)]">
            <MapPin className="h-4 w-4 flex-shrink-0 text-emerald-400" />
            <span>
              Florida is live today.{' '}
              <Link
                href="/data-coverage"
                className="inline-flex items-center gap-1 font-medium text-indigo-400 transition-colors hover:text-indigo-300"
              >
                See full data coverage
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </span>
          </div>
        </div>
      </section>

      <CtaBanner />
    </div>
  )
}
