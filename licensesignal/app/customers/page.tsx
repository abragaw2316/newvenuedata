import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, TrendingUp } from 'lucide-react'
import { SectionHeading } from '@/components/shared/section-heading'
import { GlowCard } from '@/components/shared/glow-card'
import { TagBadge } from '@/components/shared/tag-badge'
import { CtaBanner } from '@/components/sections/cta-banner'
import { CASE_STUDIES } from '@/lib/case-studies'

export const metadata: Metadata = {
  title: 'Customers',
  description:
    'How beverage distributors, POS platforms, and payroll providers use New Venue Data to reach newly-licensed Florida businesses first. Real, quantified outcomes.',
  alternates: { canonical: 'https://newvenuedata.com/customers' },
  openGraph: {
    title: 'How teams move first with New Venue Data',
    description:
      'Anonymized case studies: faster lead times, higher win rates, and retired scrapers — powered by real-time Florida license data.',
    url: 'https://newvenuedata.com/customers',
  },
}

export default function CustomersPage() {
  return (
    <div>
      {/* Hero */}
      <section className="py-20 lg:py-28 gradient-hero">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Customers"
            heading="How teams move first with New Venue Data"
            subtext="Beverage distributors, POS platforms, and payroll providers use real-time Florida license data to reach new businesses before anyone else. Here is what that looks like in practice."
          />
        </div>
      </section>

      {/* Case study grid */}
      <section className="py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CASE_STUDIES.map((cs) => {
              const headlineResult = cs.results[0]
              return (
                <Link key={cs.slug} href={`/customers/${cs.slug}`} className="group">
                  <GlowCard className="flex flex-col gap-4 h-full">
                    <TagBadge variant="default">{cs.industry}</TagBadge>
                    <h3 className="text-lg font-semibold text-[var(--ls-fg)] group-hover:text-indigo-400 transition-colors">
                      {cs.company}
                    </h3>
                    <p className="text-sm text-[var(--ls-fg-2)] leading-relaxed flex-1 line-clamp-4">
                      {cs.challenge}
                    </p>
                    <div className="flex items-start gap-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10 p-3">
                      <TrendingUp className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-emerald-400">{headlineResult}</p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-400 border-t border-[var(--ls-border)] pt-4">
                      Read the story
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </GlowCard>
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
