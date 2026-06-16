import type { Metadata } from 'next'
import Link from 'next/link'
import { BookOpen, PlayCircle, FileText, Clock, ArrowRight } from 'lucide-react'
import { SectionHeading } from '@/components/shared/section-heading'
import { TagBadge } from '@/components/shared/tag-badge'
import { CtaBanner } from '@/components/sections/cta-banner'
import { LEARN_RESOURCES, type ResourceType } from '@/lib/learn-resources'

export const metadata: Metadata = {
  title: 'Learning Center',
  description:
    'Guides, tutorials, and videos for getting the most out of New Venue Data — from your first API call to building a real-time prospecting pipeline.',
  alternates: { canonical: 'https://newvenuedata.com/learn' },
}

const TYPE_ICON: Record<ResourceType, typeof BookOpen> = {
  Guide: BookOpen,
  Tutorial: FileText,
  Video: PlayCircle,
}

const TYPE_VARIANT: Record<ResourceType, 'new' | 'live' | 'beta'> = {
  Guide: 'live',
  Tutorial: 'new',
  Video: 'beta',
}

export default function LearnPage() {
  const topics = Array.from(new Set(LEARN_RESOURCES.map((r) => r.topic)))

  return (
    <div>
      <section className="py-20 lg:py-28 gradient-hero">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Learning Center"
            heading="Learn New Venue Data"
            subtext="Guides, tutorials, and videos to take you from your first request to a production prospecting pipeline."
          />
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-12">
          {topics.map((topic) => (
            <div key={topic} className="flex flex-col gap-5">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--ls-fg-3)]">
                {topic}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {LEARN_RESOURCES.filter((r) => r.topic === topic).map((r) => {
                  const Icon = TYPE_ICON[r.type]
                  return (
                    <Link
                      key={r.slug}
                      href="/docs"
                      className="group flex flex-col gap-3 rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-5 transition-colors hover:border-indigo-500/40"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/15 border border-indigo-500/20">
                          <Icon className="h-4 w-4 text-indigo-400" />
                        </div>
                        <TagBadge variant={TYPE_VARIANT[r.type]}>{r.type}</TagBadge>
                      </div>
                      <h3 className="text-base font-semibold text-[var(--ls-fg)] group-hover:text-indigo-400 transition-colors">
                        {r.title}
                      </h3>
                      <p className="text-sm text-[var(--ls-fg-2)] leading-relaxed flex-1">{r.excerpt}</p>
                      <div className="flex items-center justify-between text-xs text-[var(--ls-fg-3)]">
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3 w-3" /> {r.minutes} min
                        </span>
                        <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <CtaBanner />
    </div>
  )
}
