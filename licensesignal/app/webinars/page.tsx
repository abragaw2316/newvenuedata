import type { Metadata } from 'next'
import Link from 'next/link'
import { Video, Calendar, PlayCircle, ArrowRight } from 'lucide-react'
import { SectionHeading } from '@/components/shared/section-heading'
import { TagBadge } from '@/components/shared/tag-badge'
import { CtaBanner } from '@/components/sections/cta-banner'
import { WEBINARS } from '@/lib/learn-resources'

export const metadata: Metadata = {
  title: 'Webinars',
  description:
    'Live and on-demand webinars on Florida license intelligence — prospecting playbooks, webhook deep dives, and market reports.',
  alternates: { canonical: 'https://newvenuedata.com/webinars' },
}

export default function WebinarsPage() {
  const upcoming = WEBINARS.filter((w) => w.status === 'upcoming')
  const recorded = WEBINARS.filter((w) => w.status === 'recorded')

  return (
    <div>
      <section className="py-20 lg:py-28 gradient-hero">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Webinars"
            heading="Live and On-Demand Sessions"
            subtext="Join our team live or watch a recording — practical sessions for sales, data, and engineering teams."
          />
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 flex flex-col gap-12">
          {upcoming.length > 0 && (
            <div className="flex flex-col gap-5">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--ls-fg-3)]">Upcoming</h2>
              <div className="flex flex-col gap-4">
                {upcoming.map((w) => (
                  <div
                    key={w.title}
                    className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-xl border border-indigo-500/20 bg-[var(--ls-surface)] p-6"
                  >
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-500/15 border border-indigo-500/20">
                      <Video className="h-5 w-5 text-indigo-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <TagBadge variant="live">Upcoming</TagBadge>
                        <span className="flex items-center gap-1 text-xs text-[var(--ls-fg-3)]">
                          <Calendar className="h-3 w-3" /> {w.when}
                        </span>
                      </div>
                      <h3 className="text-base font-semibold text-[var(--ls-fg)]">{w.title}</h3>
                      <p className="text-sm text-[var(--ls-fg-2)] mt-1">{w.description}</p>
                    </div>
                    <Link
                      href="/contact"
                      className="inline-flex flex-shrink-0 items-center justify-center rounded-md bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium px-4 py-2 transition-colors"
                    >
                      Register <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {recorded.length > 0 && (
            <div className="flex flex-col gap-5">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--ls-fg-3)]">On Demand</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {recorded.map((w) => (
                  <div key={w.title} className="rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-6 flex flex-col gap-3">
                    <PlayCircle className="h-6 w-6 text-indigo-400" />
                    <h3 className="text-base font-semibold text-[var(--ls-fg)]">{w.title}</h3>
                    <p className="text-sm text-[var(--ls-fg-2)] flex-1">{w.description}</p>
                    <Link href="/contact" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1">
                      Watch recording <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <CtaBanner />
    </div>
  )
}
