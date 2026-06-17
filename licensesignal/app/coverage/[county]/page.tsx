import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MapPin, Building2, TrendingUp, RefreshCw, ArrowRight } from 'lucide-react'
import { CtaBanner } from '@/components/sections/cta-banner'
import { FL_COUNTIES, getCounty } from '@/lib/fl-counties'
import { getCountyStat, COVERAGE_DATA_AS_OF, CITY_STATS } from '@/lib/county-stats'
import { countyTypesWithData } from '@/lib/coverage'

interface PageProps {
  params: Promise<{ county: string }>
}

export function generateStaticParams() {
  return FL_COUNTIES.map((county) => ({ county: county.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { county: slug } = await params
  const county = getCounty(slug)

  if (!county) {
    return { title: 'County Not Found' }
  }

  const stat = getCountyStat(slug)
  return {
    title: `${county.name} County Florida License Data & Monitoring`,
    description: `Real-time ${county.name} County, FL liquor and food-service license intelligence — ${stat ? `${stat.total.toLocaleString()} licenses tracked` : 'live coverage'} across ${county.topCities.slice(0, 3).join(', ')} and the ${county.seat} area, refreshed daily from the Florida DBPR record.`,
    alternates: { canonical: `https://newvenuedata.com/coverage/${county.slug}` },
  }
}

const STAT_ICONS = { TrendingUp, MapPin, Building2, RefreshCw }

export default async function CountyPage({ params }: PageProps) {
  const { county: slug } = await params
  const county = getCounty(slug)

  if (!county) {
    notFound()
  }

  const stat = getCountyStat(slug)
  const typesWithData = countyTypesWithData(slug)
  const cityPages = CITY_STATS[slug] ?? []
  const realCities = stat?.topCities.map((c) => c.city) ?? []
  const cities = realCities.length ? realCities : county.topCities
  const [primaryCity, ...otherCities] = cities
  const cityList = cities.join(', ')
  const secondaryCities = otherCities.slice(0, 2).join(' and ')

  const stats = [
    {
      icon: 'TrendingUp' as const,
      label: 'Licenses tracked',
      value: stat ? stat.total.toLocaleString() : '—',
      hint: 'Liquor + food-service',
    },
    {
      icon: 'MapPin' as const,
      label: 'Cities covered',
      value: String(cities.length),
      hint: `Including ${primaryCity}`,
    },
    {
      icon: 'Building2' as const,
      label: 'Region',
      value: county.region,
      hint: `Seat: ${county.seat}`,
    },
    {
      icon: 'RefreshCw' as const,
      label: 'Data refresh',
      value: 'Daily',
      hint: 'Direct from FL DBPR',
    },
  ]

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://newvenuedata.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Coverage',
        item: 'https://newvenuedata.com/coverage',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: `${county.name} County`,
        item: `https://newvenuedata.com/coverage/${county.slug}`,
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
                <Link href="/coverage" className="transition-colors hover:text-[var(--ls-fg-2)]">
                  Coverage
                </Link>
              </li>
              <li className="text-[var(--ls-fg-4)]">/</li>
              <li className="text-[var(--ls-fg-2)]">{county.name}</li>
            </ol>
          </nav>

          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium uppercase tracking-widest text-indigo-400">
            <MapPin className="h-3.5 w-3.5" />
            {county.region} Florida
          </span>

          <h1 className="text-display-lg text-[var(--ls-fg)]">
            {county.name} County License Intelligence
          </h1>

          <p className="max-w-2xl text-lg text-[var(--ls-fg-2)]">
            Every new liquor and food-service license filed in {county.name} County — from{' '}
            {primaryCity} to {secondaryCities || 'the surrounding cities'} — delivered the day it
            hits the Florida DBPR record, via API, webhook, or export.
          </p>
        </div>
      </section>

      {/* Stat row */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-16">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
              const Icon = STAT_ICONS[stat.icon]
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

          {/* Prose */}
          <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr]">
            <div className="flex flex-col gap-6">
              <h2 className="text-display-sm text-[var(--ls-fg)]">
                Why sales teams monitor {county.name} County
              </h2>

              <p className="text-sm leading-7 text-[var(--ls-fg-2)]">
                New Venue Data tracks {stat ? stat.total.toLocaleString() : 'every'} liquor and
                food-service licenses in {county.name} County, concentrated in and around{' '}
                {primaryCity}, the {county.seat} area, and growth pockets like{' '}
                {secondaryCities || 'its neighboring cities'}. For beverage distributors, restaurant
                suppliers, POS vendors, and payroll providers, each new filing is a business that is
                about to open its doors and start choosing the vendors it will use for years.
              </p>

              <p className="text-sm leading-7 text-[var(--ls-fg-2)]">
                The window is short. A {primaryCity} restaurant typically files for its
                food-service and liquor licenses weeks before opening — long before it appears on a
                review site or a competitor&apos;s prospect list. New Venue Data surfaces that filing
                the day it lands at the Florida DBPR, so your reps in {county.name} County can reach
                the owner while the buildout budget is still open and no contracts have been signed.
              </p>

              <p className="text-sm leading-7 text-[var(--ls-fg-2)]">
                Filter the {county.name} feed by city, license type (SRX, COP, BEV, FOOD_SERVICE),
                and event type — new filings, renewals, and ownership transfers. Route {primaryCity}
                {' '}leads to one rep and the rest of the {county.region} territory to another, push
                everything into your CRM through the API, or get a daily digest of every fresh
                {' '}license across {cityList}.
              </p>

              {typesWithData.length > 0 && (
                <div className="flex flex-col gap-2 pt-2">
                  <p className="text-xs font-medium uppercase tracking-widest text-[var(--ls-fg-3)]">
                    {county.name} coverage by license type
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {typesWithData.map((t) => (
                      <Link
                        key={t.slug}
                        href={`/coverage/${county.slug}/${t.slug}`}
                        className="inline-flex items-center gap-2 rounded-full border border-[var(--ls-border-2)] bg-[var(--ls-surface)] px-3 py-1 text-xs text-[var(--ls-fg)] transition-colors hover:border-indigo-500/40"
                      >
                        <span className="font-mono text-indigo-400">{t.code}</span>
                        <span className="tabular-nums text-[var(--ls-fg-3)]">
                          {(stat?.byType[t.code] ?? 0).toLocaleString()}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {cityPages.length > 0 && (
                <div className="flex flex-col gap-2 pt-2">
                  <p className="text-xs font-medium uppercase tracking-widest text-[var(--ls-fg-3)]">
                    {county.name} cities we cover
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {cityPages.slice(0, 14).map((c) => (
                      <Link
                        key={c.citySlug}
                        href={`/coverage/${county.slug}/city/${c.citySlug}`}
                        className="inline-flex items-center gap-2 rounded-full border border-[var(--ls-border-2)] bg-[var(--ls-surface)] px-3 py-1 text-xs text-[var(--ls-fg)] transition-colors hover:border-indigo-500/40"
                      >
                        {c.city}
                        <span className="tabular-nums text-[var(--ls-fg-3)]">
                          {c.total.toLocaleString()}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href="/data-coverage"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300"
                >
                  See full data coverage <ArrowRight className="h-4 w-4" />
                </Link>
                <span className="text-[var(--ls-fg-4)]">·</span>
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300"
                >
                  View pricing <ArrowRight className="h-4 w-4" />
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

            {/* Top cities */}
            <aside className="flex flex-col gap-4 rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface-2)] p-6 h-fit">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-indigo-400" />
                <h2 className="text-sm font-semibold text-[var(--ls-fg)]">
                  Top cities we cover in {county.name}
                </h2>
              </div>
              <p className="text-xs leading-6 text-[var(--ls-fg-3)]">
                License activity across {county.name} County clusters in these cities. Every one is
                fully covered in the {county.name} feed.
              </p>
              <div className="flex flex-wrap gap-2">
                {cities.map((city) => (
                  <span
                    key={city}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[var(--ls-border-2)] bg-[var(--ls-surface)] px-3 py-1 text-xs text-[var(--ls-fg)]"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                    {city}
                  </span>
                ))}
              </div>
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
