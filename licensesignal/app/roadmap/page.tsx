import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, History } from 'lucide-react'
import { SectionHeading } from '@/components/shared/section-heading'
import { CtaBanner } from '@/components/sections/cta-banner'
import { RoadmapBoard } from '@/components/roadmap/roadmap-board'

export const metadata: Metadata = {
  title: 'Roadmap',
  description:
    'See what the New Venue Data team is building next — new Florida and out-of-state coverage, API and webhook improvements, integrations, and dashboard features. Vote on the work that matters most to you.',
  alternates: { canonical: 'https://newvenuedata.com/roadmap' },
}

export default function RoadmapPage() {
  return (
    <div>
      {/* Hero */}
      <section className="py-20 lg:py-28 gradient-hero">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex max-w-3xl flex-col gap-6">
            <span className="inline-flex w-fit items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium tracking-widest text-indigo-400 uppercase">
              Roadmap
            </span>
            <h1 className="text-display-lg text-[var(--ls-fg)]">
              You help decide what we build next.
            </h1>
            <p className="text-lg leading-relaxed text-[var(--ls-fg-2)]">
              This is where the New Venue Data roadmap lives in the open — every
              county, endpoint, and integration we have planned, in progress, or
              already shipped. Upvote the features you want most and we&apos;ll
              feel the pull. Your votes are saved right in your browser.
            </p>
          </div>
        </div>
      </section>

      {/* Board */}
      <section className="py-20">
        <div className="mx-auto flex max-w-7xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Vote on the Future"
            heading="The board"
            subtext="Three lanes, ordered by votes. Filter by the part of the platform you care about, then upvote the work you want sooner."
            align="left"
          />

          <RoadmapBoard />

          {/* Changelog note */}
          <div className="flex flex-col gap-3 rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface-2)] p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10">
                <History className="h-4 w-4 text-indigo-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--ls-fg)]">
                  Looking for what already shipped?
                </p>
                <p className="text-sm text-[var(--ls-fg-2)]">
                  The changelog has the dated, versioned history of every release
                  that has landed in production.
                </p>
              </div>
            </div>
            <Link
              href="/changelog"
              className="inline-flex w-fit shrink-0 items-center text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300"
            >
              View the changelog <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <CtaBanner />
    </div>
  )
}
