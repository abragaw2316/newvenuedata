import type { Metadata } from 'next'
import Link from 'next/link'
import { MapPin, Building2, ArrowRight } from 'lucide-react'
import { SectionHeading } from '@/components/shared/section-heading'
import { CtaBanner } from '@/components/sections/cta-banner'
import { FL_COUNTIES, type FlRegion } from '@/lib/fl-counties'

export const metadata: Metadata = {
  title: 'Florida License Data Coverage by County',
  description:
    'Browse New Venue Data coverage for Florida’s busiest counties — Miami-Dade, Broward, Hillsborough, Orange and more. Real-time liquor and food-service license data, county by county.',
  alternates: { canonical: 'https://newvenuedata.com/coverage' },
}

const REGION_ORDER: FlRegion[] = [
  'South',
  'Tampa Bay',
  'Central',
  'Southwest',
  'North',
  'Panhandle',
]

const REGION_BLURB: Record<FlRegion, string> = {
  South: 'Florida’s densest hospitality market — from Miami nightlife to the Treasure Coast.',
  'Tampa Bay': 'High-velocity openings across the Gulf-side metro and its fast-growing suburbs.',
  Central: 'Orlando, the I-4 corridor, and the tourism economy that never stops opening.',
  Southwest: 'Coastal demand from Naples to Sarasota, with steady seasonal license activity.',
  North: 'Jacksonville, Gainesville, and the northeast — a deep, under-targeted market.',
  Panhandle: 'Beach-town and capital-city filings from Pensacola to Tallahassee.',
}

export default function CoverageIndexPage() {
  const byRegion = REGION_ORDER.map((region) => ({
    region,
    counties: FL_COUNTIES.filter((c) => c.region === region).sort(
      (a, b) => b.monthlyFilings - a.monthlyFilings
    ),
  })).filter((group) => group.counties.length > 0)

  return (
    <div>
      {/* Hero */}
      <section className="py-20 lg:py-28 gradient-hero">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Coverage"
            heading="Florida License Data, County by County"
            subtext="New Venue Data tracks new liquor and food-service license filings across all 67 Florida counties. Drill into any county below to see filing volume, the cities we cover, and how sales teams use the feed."
          />
        </div>
      </section>

      {/* Regions */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-16">
          {byRegion.map((group) => (
            <div key={group.region} className="flex flex-col gap-8">
              <SectionHeading
                align="left"
                eyebrow={`${group.region} Florida`}
                heading={`${group.region} Region`}
                subtext={REGION_BLURB[group.region]}
              />

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.counties.map((county) => (
                  <Link
                    key={county.slug}
                    href={`/coverage/${county.slug}`}
                    className="group flex flex-col gap-4 rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-5 transition-colors hover:border-[var(--ls-border-2)] hover:bg-[var(--ls-hover)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex flex-col gap-1">
                        <h3 className="text-base font-semibold text-[var(--ls-fg)]">
                          {county.name} County
                        </h3>
                        <span className="flex items-center gap-1.5 text-xs text-[var(--ls-fg-3)]">
                          <Building2 className="h-3.5 w-3.5 text-[var(--ls-fg-4)]" />
                          Seat: {county.seat}
                        </span>
                      </div>
                      <ArrowRight className="h-4 w-4 flex-shrink-0 text-[var(--ls-fg-4)] transition-colors group-hover:text-indigo-400" />
                    </div>

                    <div className="flex items-center justify-between border-t border-[var(--ls-border)] pt-4">
                      <span className="flex items-center gap-1.5 text-xs text-[var(--ls-fg-3)]">
                        <MapPin className="h-3.5 w-3.5 text-[var(--ls-fg-4)]" />
                        {county.topCities.length} cities covered
                      </span>
                      <span className="font-mono text-xs font-medium tabular-nums text-indigo-400">
                        ~{county.monthlyFilings} filings/mo
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <CtaBanner />
    </div>
  )
}
