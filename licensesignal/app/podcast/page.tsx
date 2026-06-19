import type { Metadata } from 'next'
import Link from 'next/link'
import { Mic, ArrowRight } from 'lucide-react'
import { SectionHeading } from '@/components/shared/section-heading'
import { CtaBanner } from '@/components/sections/cta-banner'

export const metadata: Metadata = {
  title: 'Podcast',
  description:
    'The New Venue Data podcast — conversations on B2B timing, public-records data, and the business of being first in the door. Coming soon.',
  alternates: { canonical: 'https://newvenuedata.com/podcast' },
}

export default function PodcastPage() {
  return (
    <div>
      <section className="py-20 lg:py-28 gradient-hero">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Podcast"
            heading="The Signal"
            subtext="Short conversations on timing, data, and how the best teams reach new businesses first."
          />
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-5 rounded-2xl border border-[var(--ls-border)] bg-[var(--ls-surface)] px-6 py-14 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/15 border border-indigo-500/20">
              <Mic className="h-5 w-5 text-indigo-400" />
            </div>
            <h2 className="text-display-sm text-[var(--ls-fg)]">Episodes are on the way</h2>
            <p className="max-w-md text-sm text-[var(--ls-fg-2)] leading-relaxed">
              The podcast isn&apos;t live yet — we&apos;d rather launch it for real than fill this
              page with placeholders. Want to know when the first episode drops?
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-md bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium px-5 py-2.5 transition-colors"
            >
              Get notified <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <CtaBanner />
    </div>
  )
}
