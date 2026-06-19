import type { Metadata } from 'next'
import Link from 'next/link'
import { Video, ArrowRight } from 'lucide-react'
import { SectionHeading } from '@/components/shared/section-heading'
import { CtaBanner } from '@/components/sections/cta-banner'

export const metadata: Metadata = {
  title: 'Webinars',
  description:
    'Live and on-demand sessions on Florida license intelligence and prospecting playbooks. Coming soon.',
  alternates: { canonical: 'https://newvenuedata.com/webinars' },
}

export default function WebinarsPage() {
  return (
    <div>
      <section className="py-20 lg:py-28 gradient-hero">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Webinars"
            heading="Live and On-Demand Sessions"
            subtext="Practical sessions on prospecting Florida's newest bars and restaurants."
          />
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-5 rounded-2xl border border-[var(--ls-border)] bg-[var(--ls-surface)] px-6 py-14 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/15 border border-indigo-500/20">
              <Video className="h-5 w-5 text-indigo-400" />
            </div>
            <h2 className="text-display-sm text-[var(--ls-fg)]">Nothing scheduled yet</h2>
            <p className="max-w-md text-sm text-[var(--ls-fg-2)] leading-relaxed">
              We haven&apos;t scheduled our first session — and we won&apos;t list one until we
              have. If a live walkthrough of the data would be useful, tell us and we&apos;ll set
              one up.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-md bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium px-5 py-2.5 transition-colors"
            >
              Request a session <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <CtaBanner />
    </div>
  )
}
