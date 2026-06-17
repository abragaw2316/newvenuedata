import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  MapPin,
  TrendingUp,
  Building2,
  RefreshCw,
  FileText,
  ArrowRight,
} from 'lucide-react'
import { CtaBanner } from '@/components/sections/cta-banner'
import { getCounty } from '@/lib/fl-counties'
import { getLicenseType } from '@/lib/license-type-info'
import { getCountyStat, COVERAGE_DATA_AS_OF } from '@/lib/county-stats'
import { coverageTypeParams, MIN_TYPE_RECORDS } from '@/lib/coverage'

interface PageProps {
  params: Promise<{ county: string; type: string }>
}

// One page per county × license-type combination that has real data
// (>= MIN_TYPE_RECORDS records) — see lib/coverage.ts. dynamicParams=false means a
// combination with no/thin data returns 404 instead of rendering an empty page.
export const dynamicParams = false

export function generateStaticParams() {
  return coverageTypeParams()
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { county: countySlug, type: typeSlug } = await params
  const county = getCounty(countySlug)
  const license = getLicenseType(typeSlug)

  if (!county || !license) {
    return { title: 'Not Found' }
  }

  return {
    title: `${county.name} County ${license.code} License Data — ${license.name}`,
    description: `Track new ${license.code} (${license.name}) filings in ${county.name} County, FL the day they hit the Florida DBPR record. Real-time license intelligence across ${county.topCities.slice(0, 3).join(', ')} and the ${county.seat} area.`,
    alternates: {
      canonical: `https://newvenuedata.com/coverage/${county.slug}/${license.slug}`,
    },
  }
}

export default async function CountyTypePage({ params }: PageProps) {
  const { county: countySlug, type: typeSlug } = await params
  const county = getCounty(countySlug)
  const license = getLicenseType(typeSlug)

  if (!county || !license) {
    notFound()
  }

  const stat = getCountyStat(county.slug)
  if (!stat) notFound()
  const typeCount = stat.byType[license.code] ?? 0
  if (typeCount < MIN_TYPE_RECORDS) notFound()

  // Real top cities for this county (by record count), with a hand-curated fallback.
  const realCities = stat.topCities.map((c) => c.city)
  const cities = realCities.length ? realCities : county.topCities
  const [primaryCity, ...otherCities] = cities
  const secondaryCities = otherCities.slice(0, 2).join(' and ')
  const cityList = cities.join(', ')
  const sharePct = stat.total > 0 ? Math.max(1, Math.round((typeCount / stat.total) * 100)) : 0

  const stats = [
    {
      icon: TrendingUp,
      label: `${license.code} licenses tracked`,
      value: typeCount.toLocaleString(),
      hint: `${sharePct}% of this county`,
    },
    {
      icon: Building2,
      label: 'County total',
      value: stat.total.toLocaleString(),
      hint: 'All license types',
    },
    {
      icon: MapPin,
      label: 'Region',
      value: county.region,
      hint: `Seat: ${county.seat}`,
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
      {
        '@type': 'ListItem',
        position: 4,
        name: license.code,
        item: `https://newvenuedata.com/coverage/${county.slug}/${license.slug}`,
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
                <Link
                  href="/coverage"
                  className="transition-colors hover:text-[var(--ls-fg-2)]"
                >
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
              <li className="font-mono text-indigo-400">{license.code}</li>
            </ol>
          </nav>

          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium uppercase tracking-widest text-indigo-400">
            <FileText className="h-3.5 w-3.5" />
            {county.region} Florida · {license.category}
          </span>

          <h1 className="text-display-lg text-[var(--ls-fg)]">
            {county.name} County{' '}
            <span className="font-mono text-indigo-400">{license.code}</span> Licenses
          </h1>

          <p className="max-w-2xl text-lg text-[var(--ls-fg-2)]">
            Every new {license.name} ({license.code}) filing in {county.name} County — from{' '}
            {primaryCity} to {secondaryCities || 'the surrounding cities'} — surfaced the day it
            hits the Florida DBPR record, via API, webhook, or export.
          </p>
        </div>
      </section>

      {/* Body */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-16">
          {/* Stat row */}
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
                  <p className="text-2xl font-bold tabular-nums text-[var(--ls-fg)]">
                    {stat.value}
                  </p>
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
                {license.code} activity in {county.name} County
              </h2>

              <p className="text-sm leading-7 text-[var(--ls-fg-2)]">
                New Venue Data currently tracks {typeCount.toLocaleString()} {license.code} (
                {license.name}) records in {county.name} County — about {sharePct}% of the{' '}
                {stat.total.toLocaleString()} liquor and food-service licenses we hold for the
                county — concentrated in {primaryCity}, the {county.seat} area, and{' '}
                {secondaryCities || 'its neighboring cities'}. Each one marks a {license.category}{' '}
                business taking a concrete, documented step toward opening.
              </p>

              <p className="text-sm leading-7 text-[var(--ls-fg-2)]">
                {license.whatItSignals}
              </p>

              <p className="text-sm leading-7 text-[var(--ls-fg-2)]">
                For sales teams working {county.name} County, the {license.code} feed is a
                precision filter: instead of every business in {cityList}, you see only the{' '}
                {license.category.toLowerCase()} prospects that fit your book. New Venue Data
                surfaces each {license.code} filing the day it lands at the Florida DBPR — weeks
                before a {primaryCity} operator appears on a review site or a competitor&apos;s
                list — so your reps can reach the owner while the buildout budget is still open.
              </p>

              <p className="text-sm leading-7 text-[var(--ls-fg-2)]">
                Filter the {county.name} {license.code} stream by city and event type — new
                filings, renewals, and ownership transfers — route {primaryCity} leads to one rep
                and the rest of the {county.region} territory to another, push everything into
                your CRM through the API, or get a daily digest of every fresh {license.code}{' '}
                across {cityList}.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href={`/coverage/${county.slug}`}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300"
                >
                  All {county.name} County coverage <ArrowRight className="h-4 w-4" />
                </Link>
                <span className="text-[var(--ls-fg-4)]">·</span>
                <Link
                  href={`/license-types/${license.slug}`}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300"
                >
                  What is a {license.code} license? <ArrowRight className="h-4 w-4" />
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

            {/* Sidebar */}
            <aside className="flex flex-col gap-4 rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface-2)] p-6 h-fit">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-indigo-400" />
                <h2 className="text-sm font-semibold text-[var(--ls-fg)]">
                  Where {license.code} filings cluster in {county.name}
                </h2>
              </div>
              <p className="text-xs leading-6 text-[var(--ls-fg-3)]">
                {license.code} activity across {county.name} County concentrates in these cities.
                Every one is fully covered in the {county.name} feed.
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
                Counts from the New Venue Data dataset as of {COVERAGE_DATA_AS_OF}; refreshed daily from Florida DBPR
              </div>
            </aside>
          </div>
        </div>
      </section>

      <CtaBanner />
    </div>
  )
}
