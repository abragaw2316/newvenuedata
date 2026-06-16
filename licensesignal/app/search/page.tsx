import type { Metadata } from 'next'
import { Suspense } from 'react'
import Link from 'next/link'
import { MapPin, FileText, ArrowRight, Loader2 } from 'lucide-react'
import { SectionHeading } from '@/components/shared/section-heading'
import { CtaBanner } from '@/components/sections/cta-banner'
import { SearchContent } from '@/components/search/search-content'

export const metadata: Metadata = {
  title: 'Search Florida License Filings',
  description:
    'Search the live New Venue Data feed of Florida liquor and food-service license filings by business name, owner, city, or license number — and filter by county, license type, and status.',
  alternates: { canonical: 'https://newvenuedata.com/search' },
}

const BROWSE_BY = [
  {
    href: '/coverage',
    icon: MapPin,
    title: 'Browse by county',
    description:
      'Explore filing volume and coverage across all 67 Florida counties, from Miami-Dade to the Panhandle.',
    cta: 'View coverage',
  },
  {
    href: '/license-types',
    icon: FileText,
    title: 'Browse by license type',
    description:
      'Understand every DBPR code — SRX, COP, BEV, APS, 4COP, food service and more — and what each filing signals.',
    cta: 'View license types',
  },
]

function SearchFallback() {
  return (
    <section className="py-20">
      <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-24 sm:px-6 lg:px-8">
        <span className="inline-flex items-center gap-2 text-sm text-[var(--ls-fg-3)]">
          <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />
          Loading search…
        </span>
      </div>
    </section>
  )
}

export default function SearchPage() {
  return (
    <div>
      {/* Hero */}
      <section className="py-20 lg:py-28 gradient-hero">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-4 text-center">
          <span className="inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium tracking-widest text-indigo-400 uppercase">
            Search
          </span>
          <h1 className="text-display-lg text-[var(--ls-fg)] max-w-3xl">
            Search the live Florida license feed
          </h1>
          <p className="max-w-2xl text-lg text-[var(--ls-fg-2)]">
            Find any business, owner, city, or license number across Florida’s liquor and
            food-service filings — then narrow by county, license type, and status. Save the
            searches you run most.
          </p>
        </div>
      </section>

      {/* Faceted search */}
      <Suspense fallback={<SearchFallback />}>
        <SearchContent />
      </Suspense>

      {/* Browse by hubs */}
      <section className="py-20 bg-[var(--ls-surface-2)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-10">
          <SectionHeading
            eyebrow="Browse by"
            heading="Not sure where to start?"
            subtext="Explore the data by geography or by license type to see what the feed covers before you search."
          />

          <div className="grid gap-4 sm:grid-cols-2">
            {BROWSE_BY.map(({ href, icon: Icon, title, description, cta }) => (
              <Link
                key={href}
                href={href}
                className="group flex flex-col gap-4 rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-6 transition-colors hover:border-[var(--ls-border-2)] hover:bg-[var(--ls-hover)]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-indigo-500/30 bg-indigo-500/10">
                  <Icon className="h-5 w-5 text-indigo-400" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-base font-semibold text-[var(--ls-fg)]">{title}</h3>
                  <p className="text-sm text-[var(--ls-fg-3)]">{description}</p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-400">
                  {cta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />
    </div>
  )
}
