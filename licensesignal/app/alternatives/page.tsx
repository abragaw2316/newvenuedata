import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Code2, Database, Search, ListChecks } from 'lucide-react'
import { SectionHeading } from '@/components/shared/section-heading'
import { CtaBanner } from '@/components/sections/cta-banner'
import { ALTERNATIVES } from '@/lib/alternatives'

export const metadata: Metadata = {
  title: 'Alternatives — Why New Venue Data',
  description:
    'How New Venue Data compares to scraping DBPR yourself, generic data brokers, the state license portal, and buying static lists. The trade-offs of every approach to Florida license data, side by side.',
  alternates: { canonical: 'https://newvenuedata.com/alternatives' },
}

const ICONS = [Code2, Database, Search, ListChecks] as const

export default function AlternativesPage() {
  return (
    <div>
      {/* Hero */}
      <section className="py-20 lg:py-28 gradient-hero">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-6">
          <SectionHeading
            align="left"
            eyebrow="Alternatives"
            heading="Why teams choose New Venue Data"
            subtext="There is more than one way to get Florida license data. Here is an honest look at each alternative — what it costs you in time, freshness, and engineering — and where a purpose-built API wins."
          />
        </div>
      </section>

      {/* Grid */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 sm:grid-cols-2">
            {ALTERNATIVES.map((alt, i) => {
              const Icon = ICONS[i % ICONS.length]
              return (
                <Link
                  key={alt.slug}
                  href={`/alternatives/${alt.slug}`}
                  className="group flex flex-col gap-4 rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-6 transition-colors hover:border-[var(--ls-border-2)] hover:bg-[var(--ls-hover)]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10">
                      <Icon className="h-5 w-5 text-indigo-400" />
                    </span>
                    <span className="text-xs font-medium tracking-widest text-[var(--ls-fg-4)] uppercase">
                      vs
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <h2 className="text-lg font-semibold text-[var(--ls-fg)]">
                      New Venue Data <span className="text-[var(--ls-fg-4)]">vs</span> {alt.name}
                    </h2>
                    <p className="text-sm leading-relaxed text-[var(--ls-fg-2)] line-clamp-3">
                      {alt.summary}
                    </p>
                  </div>

                  <span className="mt-auto inline-flex items-center gap-1 pt-2 text-xs font-medium text-indigo-400 transition-colors group-hover:text-[#818cf8]">
                    See the comparison
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <CtaBanner />
    </div>
  )
}
