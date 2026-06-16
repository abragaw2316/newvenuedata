import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, BookOpen, FileText } from 'lucide-react'
import { SectionHeading } from '@/components/shared/section-heading'
import { CtaBanner } from '@/components/sections/cta-banner'
import { SampleContent } from '@/components/sample/sample-content'

export const metadata: Metadata = {
  title: 'Live Sample — Real Florida License Data',
  description:
    'See real Florida DBPR license records before you buy. A live sample of the exact data New Venue Data delivers via API and exports — business name, type, city, county, filed date, and status.',
  alternates: { canonical: 'https://newvenuedata.com/sample' },
  openGraph: {
    title: 'See Real Florida License Data — New Venue Data',
    description:
      'A live sample of real FL DBPR license records, downloadable as CSV. The same data delivered via our API and exports.',
    url: 'https://newvenuedata.com/sample',
  },
}

export default function SamplePage() {
  return (
    <div>
      {/* Hero */}
      <section className="py-20 lg:py-28 gradient-hero">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
          <span className="inline-flex w-fit items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium uppercase tracking-widest text-indigo-400">
            Live Sample
          </span>
          <h1 className="text-display-lg max-w-3xl text-[var(--ls-fg)]">
            See real Florida license data
          </h1>
          <p className="max-w-2xl text-lg text-[var(--ls-fg-2)]">
            This is a live sample of the same real FL DBPR records delivered
            through the New Venue Data API and scheduled exports — not mock data.
            Browse the table, download it as CSV, and see exactly what you get
            before you buy.
          </p>
        </div>
      </section>

      {/* Sample table */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SampleContent />
        </div>
      </section>

      {/* Note + links */}
      <section className="border-t border-[var(--ls-border)] bg-[var(--ls-surface-2)] py-20">
        <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
          <SectionHeading
            align="left"
            eyebrow="What you're looking at"
            heading="A real slice of the full dataset"
            subtext="Every field above comes straight from Florida DBPR public records, geocoded and normalized by our pipeline. The full feed covers all 67 counties and is delivered via API, webhooks, and exports."
          />

          <div className="grid gap-4 sm:grid-cols-3">
            <Link
              href="/methodology"
              className="group flex flex-col gap-3 rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-6 transition-colors hover:border-indigo-500/40"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10">
                <BookOpen className="h-4 w-4 text-indigo-400" />
              </span>
              <span className="font-semibold text-[var(--ls-fg)]">Methodology</span>
              <span className="text-sm text-[var(--ls-fg-3)]">
                How we source, geocode, and normalize Florida public records.
              </span>
              <span className="mt-auto inline-flex items-center gap-1 text-sm text-indigo-400">
                Read methodology
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>

            <Link
              href="/docs"
              className="group flex flex-col gap-3 rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-6 transition-colors hover:border-indigo-500/40"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10">
                <FileText className="h-4 w-4 text-indigo-400" />
              </span>
              <span className="font-semibold text-[var(--ls-fg)]">API docs</span>
              <span className="text-sm text-[var(--ls-fg-3)]">
                Endpoints, fields, and filters for pulling this data live.
              </span>
              <span className="mt-auto inline-flex items-center gap-1 text-sm text-indigo-400">
                View the docs
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>

            <Link
              href="/contact"
              className="group flex flex-col gap-3 rounded-xl border border-indigo-500/30 bg-indigo-500/[0.06] p-6 transition-colors hover:border-indigo-500/50"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10">
                <ArrowRight className="h-4 w-4 text-indigo-400" />
              </span>
              <span className="font-semibold text-[var(--ls-fg)]">
                Get full access
              </span>
              <span className="text-sm text-[var(--ls-fg-3)]">
                Want the whole dataset? Tell us your use case and we'll set you up.
              </span>
              <span className="mt-auto inline-flex items-center gap-1 text-sm text-indigo-400">
                Talk to us
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          </div>

          <p className="max-w-3xl text-xs leading-relaxed text-[var(--ls-fg-4)]">
            Released under Florida Chapter 119 public-records law. This is
            business-entity data — not a consumer report, and not for credit,
            employment, tenant, or insurance screening of individuals.
            New Venue Data is not affiliated with or endorsed by DBPR or the State
            of Florida. Data provided &ldquo;as is.&rdquo;
          </p>
        </div>
      </section>

      <CtaBanner />
    </div>
  )
}
