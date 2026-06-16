import type { Metadata } from 'next'
import Link from 'next/link'
import { Mic, Play, ArrowRight } from 'lucide-react'
import { SectionHeading } from '@/components/shared/section-heading'
import { CtaBanner } from '@/components/sections/cta-banner'
import { PODCAST_EPISODES } from '@/lib/learn-resources'

export const metadata: Metadata = {
  title: 'Podcast',
  description:
    'The New Venue Data podcast — conversations on B2B timing, public-records data, and the business of being first in the door.',
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
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 flex flex-col gap-4">
          {PODCAST_EPISODES.map((ep) => (
            <div
              key={ep.number}
              className="flex items-center gap-4 rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-5 transition-colors hover:border-indigo-500/40"
            >
              <button
                type="button"
                aria-label={`Play episode ${ep.number}`}
                className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500/15 border border-indigo-500/20 text-indigo-400 transition-colors hover:bg-indigo-500/25"
              >
                <Play className="h-4 w-4" />
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-xs text-[var(--ls-fg-3)]">
                  <Mic className="h-3 w-3" /> Episode {ep.number} · {ep.duration}
                </div>
                <h3 className="text-base font-semibold text-[var(--ls-fg)] mt-0.5">{ep.title}</h3>
                <p className="text-sm text-[var(--ls-fg-2)] mt-1">{ep.description}</p>
              </div>
            </div>
          ))}

          <div className="mt-4 rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface-2)] p-6 text-center">
            <p className="text-sm text-[var(--ls-fg-2)]">
              Subscribe wherever you listen, or{' '}
              <Link href="/contact" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                get notified of new episodes
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      <CtaBanner />
    </div>
  )
}
