import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MapPin, TrendingUp, Building2, RefreshCw, ArrowRight, FileText } from 'lucide-react'
import { CtaBanner } from '@/components/sections/cta-banner'
import { TX_COUNTY_DETAIL, getTxCounty, TX_COVERAGE_AS_OF } from '@/lib/tx-county-stats'

interface PageProps {
  params: Promise<{ county: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return Object.keys(TX_COUNTY_DETAIL).map((county) => ({ county }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { county: slug } = await params
  const c = getTxCounty(slug)
  if (!c) return { title: 'County Not Found' }
  return {
    title: `${c.name} County, TX License Data — TABC Coverage`,
    description: `${c.total.toLocaleString()} TABC alcoholic-beverage licenses tracked in ${c.name} County, Texas. New filings, renewals, and license types from the Texas open-data record.`,
    alternates: { canonical: `https://newvenuedata.com/coverage/texas/${slug}` },
  }
}

export default async function TexasCountyPage({ params }: PageProps) {
  const { county: slug } = await params
  const c = getTxCounty(slug)
  if (!c) notFound()

  const types = Object.entries(c.byType)
    .map(([code, count]) => ({ code, count }))
    .sort((a, b) => b.count - a.count)

  const stats = [
    { icon: TrendingUp, label: 'Licenses tracked', value: c.total.toLocaleString(), hint: `${c.name} County, TX` },
    { icon: FileText, label: 'License types', value: String(types.length), hint: 'TABC codes' },
    { icon: Building2, label: 'New filings', value: c.newFilings.toLocaleString(), hint: 'Recently issued' },
    { icon: RefreshCw, label: 'Source', value: 'TABC', hint: 'Texas open data' },
  ]

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://newvenuedata.com' },
      { '@type': 'ListItem', position: 2, name: 'Coverage', item: 'https://newvenuedata.com/coverage' },
      { '@type': 'ListItem', position: 3, name: 'Texas', item: 'https://newvenuedata.com/coverage/texas' },
      {
        '@type': 'ListItem',
        position: 4,
        name: `${c.name} County`,
        item: `https://newvenuedata.com/coverage/texas/${slug}`,
      },
    ],
  }

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

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
                <Link href="/coverage/texas" className="transition-colors hover:text-[var(--ls-fg-2)]">
                  Texas
                </Link>
              </li>
              <li className="text-[var(--ls-fg-4)]">/</li>
              <li className="text-[var(--ls-fg-2)]">{c.name}</li>
            </ol>
          </nav>

          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium uppercase tracking-widest text-indigo-400">
            <MapPin className="h-3.5 w-3.5" />
            Texas · TABC
          </span>

          <h1 className="text-display-lg text-[var(--ls-fg)]">{c.name} County License Intelligence</h1>

          <p className="max-w-2xl text-lg text-[var(--ls-fg-2)]">
            New Venue Data tracks {c.total.toLocaleString()} TABC alcoholic-beverage licenses in{' '}
            {c.name} County, Texas — sourced from the state&apos;s daily open-data record.
          </p>
        </div>
      </section>

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

          <div className="flex flex-col gap-6">
            <h2 className="text-display-sm text-[var(--ls-fg)]">
              License activity in {c.name} County
            </h2>
            <p className="max-w-3xl text-sm leading-7 text-[var(--ls-fg-2)]">
              {c.name} County holds {c.total.toLocaleString()} TABC licenses in the current dataset,
              {c.topCities.length
                ? ` concentrated in ${c.topCities.slice(0, 3).map((x) => x.city).join(', ')},`
                : ''}{' '}
              across {types.length} license types. Texas uses TABC&apos;s own license-type codes
              (for example MB for mixed beverage and BG/BQ for wine and beer), which New Venue Data
              preserves rather than flattening into another state&apos;s scheme.
            </p>

            {types.length > 0 && (
              <div className="flex flex-col gap-2">
                <p className="text-xs font-medium uppercase tracking-widest text-[var(--ls-fg-3)]">
                  {c.name} County by TABC license type
                </p>
                <div className="flex flex-wrap gap-2">
                  {types.slice(0, 16).map((t) => (
                    <span
                      key={t.code}
                      className="inline-flex items-center gap-2 rounded-full border border-[var(--ls-border-2)] bg-[var(--ls-surface)] px-3 py-1 text-xs text-[var(--ls-fg)]"
                    >
                      <span className="font-mono text-indigo-400">{t.code}</span>
                      <span className="tabular-nums text-[var(--ls-fg-3)]">
                        {t.count.toLocaleString()}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {c.topCities.length > 0 && (
              <div className="flex flex-col gap-2">
                <p className="text-xs font-medium uppercase tracking-widest text-[var(--ls-fg-3)]">
                  Top cities
                </p>
                <div className="flex flex-wrap gap-2">
                  {c.topCities.map((x) => (
                    <span
                      key={x.city}
                      className="inline-flex items-center gap-2 rounded-full border border-[var(--ls-border-2)] bg-[var(--ls-surface)] px-3 py-1 text-xs text-[var(--ls-fg)]"
                    >
                      {x.city}
                      <span className="tabular-nums text-[var(--ls-fg-3)]">
                        {x.count.toLocaleString()}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/coverage/texas"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300"
              >
                All Texas coverage <ArrowRight className="h-4 w-4" />
              </Link>
              <span className="text-[var(--ls-fg-4)]">·</span>
              <Link
                href="/expansion/texas"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300"
              >
                Join the Texas waitlist <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="flex items-center gap-2 text-xs text-[var(--ls-fg-3)]">
              <RefreshCw className="h-3.5 w-3.5 text-[var(--ls-fg-4)]" />
              Counts from the Texas TABC open-data file as of {TX_COVERAGE_AS_OF}.
            </div>
          </div>
        </div>
      </section>

      <CtaBanner />
    </div>
  )
}
