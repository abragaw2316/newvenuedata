import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MapPin, TrendingUp, Building2, RefreshCw, ArrowRight, FileText } from 'lucide-react'
import { CtaBanner } from '@/components/sections/cta-banner'
import { getCounty } from '@/lib/fl-counties'
import { LICENSE_TYPES } from '@/lib/license-type-info'
import { getCityStat, COVERAGE_DATA_AS_OF } from '@/lib/county-stats'
import { coverageCityParams } from '@/lib/coverage'

interface PageProps {
  params: Promise<{ county: string; city: string }>
}

// One page per city with >= CITY_MIN real records (see lib/coverage.ts).
export const dynamicParams = false

export function generateStaticParams() {
  return coverageCityParams()
}

const TYPE_BY_CODE = new Map(LICENSE_TYPES.map((t) => [t.code, t]))

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { county: countySlug, city: citySlug } = await params
  const county = getCounty(countySlug)
  const city = getCityStat(countySlug, citySlug)
  if (!county || !city) return { title: 'Not Found' }

  return {
    title: `${city.city}, FL License Data — ${county.name} County Liquor & Food Service`,
    description: `${city.total.toLocaleString()} liquor and food-service licenses tracked in ${city.city}, ${county.name} County, Florida. New filings surfaced the day they hit the DBPR record — by API, webhook, or export.`,
    alternates: {
      canonical: `https://newvenuedata.com/coverage/${county.slug}/city/${city.citySlug}`,
    },
  }
}

export default async function CityPage({ params }: PageProps) {
  const { county: countySlug, city: citySlug } = await params
  const county = getCounty(countySlug)
  const city = getCityStat(countySlug, citySlug)
  if (!county || !city) notFound()

  const typeBreakdown = Object.entries(city.byType)
    .map(([code, count]) => ({ type: TYPE_BY_CODE.get(code), code, count }))
    .filter((t) => t.type)
    .sort((a, b) => b.count - a.count)

  const topType = typeBreakdown[0]

  const stats = [
    {
      icon: TrendingUp,
      label: 'Licenses tracked',
      value: city.total.toLocaleString(),
      hint: `In ${city.city}`,
    },
    {
      icon: FileText,
      label: 'Most common type',
      value: topType ? topType.code : '—',
      hint: topType ? topType.type!.name : 'Liquor + food service',
    },
    {
      icon: Building2,
      label: 'County',
      value: county.name,
      hint: `${county.region} Florida`,
    },
    {
      icon: RefreshCw,
      label: 'Data refresh',
      value: 'Daily',
      hint: 'Direct from FL DBPR',
    },
  ]

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://newvenuedata.com' },
      { '@type': 'ListItem', position: 2, name: 'Coverage', item: 'https://newvenuedata.com/coverage' },
      {
        '@type': 'ListItem',
        position: 3,
        name: `${county.name} County`,
        item: `https://newvenuedata.com/coverage/${county.slug}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: city.city,
        item: `https://newvenuedata.com/coverage/${county.slug}/city/${city.citySlug}`,
      },
    ],
  }

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hero */}
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
              <li>
                <Link
                  href={`/coverage/${county.slug}`}
                  className="transition-colors hover:text-[var(--ls-fg-2)]"
                >
                  {county.name}
                </Link>
              </li>
              <li className="text-[var(--ls-fg-4)]">/</li>
              <li className="text-[var(--ls-fg-2)]">{city.city}</li>
            </ol>
          </nav>

          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium uppercase tracking-widest text-indigo-400">
            <MapPin className="h-3.5 w-3.5" />
            {county.name} County · {county.region} Florida
          </span>

          <h1 className="text-display-lg text-[var(--ls-fg)]">{city.city} License Intelligence</h1>

          <p className="max-w-2xl text-lg text-[var(--ls-fg-2)]">
            Every new liquor and food-service license filed in {city.city}, Florida — surfaced the
            day it hits the Florida DBPR record, via API, webhook, or export.
          </p>
        </div>
      </section>

      {/* Body */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-16">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <div
                  key={stat.label}
                  className="flex flex-col gap-3 rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-5"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10">
                    <Icon className="h-4 w-4 text-indigo-400" />
                  </div>
                  <p className="text-2xl font-bold tabular-nums text-[var(--ls-fg)]">{stat.value}</p>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-xs font-medium text-[var(--ls-fg-2)]">{stat.label}</p>
                    <p className="text-xs text-[var(--ls-fg-3)]">{stat.hint}</p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr]">
            <div className="flex flex-col gap-6">
              <h2 className="text-display-sm text-[var(--ls-fg)]">
                License activity in {city.city}
              </h2>

              <p className="text-sm leading-7 text-[var(--ls-fg-2)]">
                New Venue Data tracks {city.total.toLocaleString()} liquor and food-service licenses
                in {city.city}, part of {county.name} County in {county.region} Florida.
                {topType
                  ? ` The most common type here is ${topType.code} (${topType.type!.name}), with ${topType.count.toLocaleString()} records.`
                  : ''}{' '}
                Each new filing marks a business taking a concrete, documented step toward opening —
                weeks before it appears on a review site or a competitor&apos;s list.
              </p>

              <p className="text-sm leading-7 text-[var(--ls-fg-2)]">
                For sales teams working {city.city}, New Venue Data surfaces each filing the day it
                lands at the Florida DBPR, so your reps reach the owner while the buildout budget is
                still open. Filter by license type and event type — new filings, renewals, and
                ownership transfers — and push everything into your CRM through the API.
              </p>

              {typeBreakdown.length > 0 && (
                <div className="flex flex-col gap-2 pt-2">
                  <p className="text-xs font-medium uppercase tracking-widest text-[var(--ls-fg-3)]">
                    {city.city} by license type
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {typeBreakdown.map((t) => (
                      <Link
                        key={t.code}
                        href={`/coverage/${county.slug}/${t.type!.slug}`}
                        className="inline-flex items-center gap-2 rounded-full border border-[var(--ls-border-2)] bg-[var(--ls-surface)] px-3 py-1 text-xs text-[var(--ls-fg)] transition-colors hover:border-indigo-500/40"
                      >
                        <span className="font-mono text-indigo-400">{t.code}</span>
                        <span className="tabular-nums text-[var(--ls-fg-3)]">
                          {t.count.toLocaleString()}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href={`/coverage/${county.slug}`}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300"
                >
                  All {county.name} County coverage <ArrowRight className="h-4 w-4" />
                </Link>
                <span className="text-[var(--ls-fg-4)]">·</span>
                <Link
                  href="/docs"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300"
                >
                  Read the API docs <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <aside className="flex flex-col gap-4 rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface-2)] p-6 h-fit">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-indigo-400" />
                <h2 className="text-sm font-semibold text-[var(--ls-fg)]">
                  {city.city} at a glance
                </h2>
              </div>
              <dl className="flex flex-col gap-3 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-[var(--ls-fg-3)]">Licenses tracked</dt>
                  <dd className="font-semibold tabular-nums text-[var(--ls-fg)]">
                    {city.total.toLocaleString()}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-[var(--ls-fg-3)]">County</dt>
                  <dd className="font-medium text-[var(--ls-fg)]">{county.name}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-[var(--ls-fg-3)]">License types</dt>
                  <dd className="font-medium text-[var(--ls-fg)]">{typeBreakdown.length}</dd>
                </div>
              </dl>
              <div className="mt-2 flex items-center gap-2 border-t border-[var(--ls-border)] pt-4 text-xs text-[var(--ls-fg-3)]">
                <RefreshCw className="h-3.5 w-3.5 text-[var(--ls-fg-4)]" />
                Counts as of {COVERAGE_DATA_AS_OF}; refreshed daily from Florida DBPR
              </div>
            </aside>
          </div>
        </div>
      </section>

      <CtaBanner />
    </div>
  )
}
