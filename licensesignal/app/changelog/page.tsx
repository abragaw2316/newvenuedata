import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight,
  MapPin,
  UtensilsCrossed,
  Wine,
  Search,
  BarChart3,
} from 'lucide-react'
import { SectionHeading } from '@/components/shared/section-heading'
import { TagBadge } from '@/components/shared/tag-badge'
import { CtaBanner } from '@/components/sections/cta-banner'

export const metadata: Metadata = {
  title: 'Changelog',
  description:
    "What's new at New Venue Data — new Florida license categories, data coverage, and product updates. Real, shipped changes only.",
  alternates: { canonical: 'https://newvenuedata.com/changelog' },
}

type Tag = { label: string; variant: 'new' | 'live' | 'beta' | 'pro' | 'default' }

type Entry = {
  date: string
  title: string
  icon: typeof MapPin
  tags: Tag[]
  description: string
  points?: string[]
}

// Honest changelog: only changes that actually shipped. No invented version
// history, SLAs, or features that don't exist yet.
const ENTRIES: Entry[] = [
  {
    date: 'June 2026',
    title: 'New license categories: temporary permits, manufacturers, and bottle clubs',
    icon: Wine,
    tags: [
      { label: 'New', variant: 'new' },
      { label: 'Data', variant: 'default' },
    ],
    description:
      'The dataset now includes three additional Florida AB&T record types beyond standard retail liquor and food-service licenses — each a distinct buying or risk signal.',
    points: [
      'Temporary (1–3 day) event permits — high-liability, often-underinsured events',
      'Manufacturers & distributors — new breweries, wineries, and distilleries',
      'Bottle clubs — BYOB establishments with notable dram-shop exposure',
    ],
  },
  {
    date: 'June 2026',
    title: 'Special Restaurant / Special Food Service licenses now classified correctly',
    icon: UtensilsCrossed,
    tags: [{ label: 'Fix', variant: 'beta' }],
    description:
      'Florida renamed the Special Restaurant (SRX) license to Special Food Service (SFS) under SB 1262 in 2023, and DBPR stores that designation in a separate column. We now read it correctly, so full-liquor restaurant licenses surface properly in search and the feed.',
  },
  {
    date: '2026',
    title: 'Statewide Florida coverage, refreshed daily',
    icon: MapPin,
    tags: [
      { label: 'Live', variant: 'live' },
      { label: 'Data', variant: 'default' },
    ],
    description:
      'Liquor and food-service license records across all 67 Florida counties, sourced from official FL DBPR public records and refreshed daily.',
  },
  {
    date: '2026',
    title: 'Live search and CSV / Excel export',
    icon: Search,
    tags: [{ label: 'New', variant: 'new' }],
    description:
      'Search the feed by business name, owner, city, or license number, and filter by county, license type, and status — with a downloadable sample so you can see the exact data before you buy.',
  },
]

export default function ChangelogPage() {
  return (
    <div>
      {/* Hero */}
      <section className="py-20 lg:py-28 gradient-hero">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl flex flex-col gap-6">
            <span className="inline-flex w-fit items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium tracking-widest text-indigo-400 uppercase">
              Changelog
            </span>
            <h1 className="text-display-lg text-[var(--ls-fg)]">
              What&apos;s new at New Venue Data.
            </h1>
            <p className="text-lg text-[var(--ls-fg-2)] leading-relaxed">
              New license categories, expanded coverage, and product updates — the changes that
              actually shipped, newest first.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/sample"
                className="inline-flex items-center rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-indigo-600"
              >
                See the live sample <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/docs"
                className="inline-flex items-center rounded-lg border border-[var(--ls-border-2)] bg-transparent px-5 py-2.5 text-sm font-medium text-[var(--ls-fg-2)] transition-all hover:border-[#6366f1] hover:text-[var(--ls-fg)]"
              >
                Read the docs
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Changelog feed */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 flex flex-col gap-12">
          <SectionHeading
            eyebrow="Release Notes"
            heading="Shipped, in order"
            subtext="Newest first. Only changes that are actually live."
            align="left"
          />

          <div className="flex flex-col">
            {ENTRIES.map((entry) => {
              const Icon = entry.icon
              return (
                <div
                  key={entry.title}
                  className="relative pl-8 pb-10 border-l border-[var(--ls-border)] last:border-l-transparent last:pb-0"
                >
                  <span className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full bg-indigo-500 ring-4 ring-[var(--ls-bg)]" />

                  <div className="flex flex-col gap-3">
                    {/* Meta row */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="text-xs text-[var(--ls-fg-3)]">{entry.date}</span>
                    </div>

                    {/* Title + icon */}
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10">
                        <Icon className="h-4 w-4 text-indigo-400" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <h3 className="text-[var(--ls-fg)] font-semibold leading-snug">
                          {entry.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2">
                          {entry.tags.map((tag) => (
                            <TagBadge key={tag.label} variant={tag.variant}>
                              {tag.label}
                            </TagBadge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="flex flex-col gap-3 pl-11">
                      <p className="text-sm text-[var(--ls-fg-2)] leading-relaxed">
                        {entry.description}
                      </p>
                      {entry.points && (
                        <ul className="flex flex-col gap-1.5">
                          {entry.points.map((point) => (
                            <li
                              key={point}
                              className="flex gap-2 text-sm text-[var(--ls-fg-3)] leading-relaxed"
                            >
                              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--ls-fg-4)]" />
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Footnote */}
          <div className="rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface-2)] p-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10">
                <BarChart3 className="h-4 w-4 text-indigo-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--ls-fg)]">What&apos;s next</p>
                <p className="text-sm text-[var(--ls-fg-2)]">
                  More delivery options and out-of-state coverage are on the roadmap.
                </p>
              </div>
            </div>
            <Link
              href="/contact"
              className="inline-flex w-fit shrink-0 items-center text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300"
            >
              Tell us what you need <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <CtaBanner />
    </div>
  )
}
