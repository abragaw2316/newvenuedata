import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight,
  ShieldCheck,
  MapPin,
  ListOrdered,
  UtensilsCrossed,
  Gauge,
  FileCode2,
  CalendarClock,
  Repeat,
  MessageSquare,
  BarChart3,
} from 'lucide-react'
import { SectionHeading } from '@/components/shared/section-heading'
import { TagBadge } from '@/components/shared/tag-badge'
import { CtaBanner } from '@/components/sections/cta-banner'

export const metadata: Metadata = {
  title: 'Changelog',
  description:
    "What's new at New Venue Data — new Florida county coverage, API and webhook improvements, performance gains, and product updates shipped to the real-time license data platform.",
  alternates: { canonical: 'https://newvenuedata.com/changelog' },
}

type Tag = { label: string; variant: 'new' | 'live' | 'beta' | 'pro' | 'default' }

type Entry = {
  date: string
  version: string
  title: string
  icon: typeof ShieldCheck
  tags: Tag[]
  description: string
  points?: string[]
}

const ENTRIES: Entry[] = [
  {
    date: 'June 3, 2026',
    version: 'v1.8',
    title: 'Webhook payloads are now HMAC-signed',
    icon: ShieldCheck,
    tags: [
      { label: 'New', variant: 'new' },
      { label: 'API', variant: 'live' },
    ],
    description:
      'Every webhook delivery now ships with an X-New Venue Data-Signature header so you can cryptographically verify that a payload originated from us and was not tampered with in transit. Signing secrets are managed per endpoint from the dashboard.',
    points: [
      'SHA-256 HMAC over the raw request body, with a timestamp to prevent replay attacks',
      'Rotate secrets with a 24-hour overlap window — no dropped events during a roll',
      'Copy-paste verification snippets for Node, Python, Go, and Ruby in the docs',
    ],
  },
  {
    date: 'April 22, 2026',
    version: 'v1.7',
    title: 'Collier and Sarasota county coverage is live',
    icon: MapPin,
    tags: [
      { label: 'New', variant: 'new' },
      { label: 'Data', variant: 'default' },
    ],
    description:
      'Southwest Florida just got a lot sharper. Daily DBPR ingestion now extends across Collier and Sarasota counties, bringing full liquor and food-service license events to the Naples, Marco Island, and Sarasota markets.',
    points: [
      'Backfilled 18 months of historical filings so trend analysis works from day one',
      'Brings the platform to 61 of 67 Florida counties under daily refresh SLAs',
    ],
  },
  {
    date: 'March 5, 2026',
    version: 'v1.6',
    title: 'Cursor pagination v2 for the list endpoints',
    icon: ListOrdered,
    tags: [
      { label: 'Improvement', variant: 'pro' },
      { label: 'API', variant: 'live' },
    ],
    description:
      'We replaced offset pagination with opaque, stable cursors across every collection endpoint. Cursors are immune to records shifting underneath you mid-scan, so large exports and incremental syncs stay consistent even as new filings land.',
    points: [
      'Deterministic ordering with a next_cursor token — no more skipped or duplicated rows',
      'Offset pagination remains supported through the end of 2026 for a smooth migration',
    ],
  },
  {
    date: 'January 28, 2026',
    version: 'v1.5',
    title: 'New FOOD_SERVICE event types',
    icon: UtensilsCrossed,
    tags: [{ label: 'New', variant: 'new' }],
    description:
      'Food-service licenses now resolve into a richer, more granular event taxonomy so you can route the right signal to the right team. Seating-capacity changes and category reclassifications are now first-class events.',
    points: [
      'seating_capacity_change, category_reclassification, and provisional_to_permanent',
      'Each event carries a typed diff payload showing the prior and current values',
    ],
  },
  {
    date: 'November 12, 2025',
    version: 'v1.4',
    title: 'Sub-200ms p95 across the read API',
    icon: Gauge,
    tags: [{ label: 'Improvement', variant: 'pro' }],
    description:
      'A rebuilt query layer and a warm regional cache cut tail latency dramatically. The read API now serves a p95 under 200ms and a p99 under 400ms for filtered license lookups, measured continuously from us-east.',
    points: [
      'New columnar indexes on county, license_type, and event_date',
      'Edge-cached responses for unauthenticated coverage and status checks',
    ],
  },
  {
    date: 'September 18, 2025',
    version: 'v1.3',
    title: 'OpenAPI 3.1 specification published',
    icon: FileCode2,
    tags: [
      { label: 'New', variant: 'new' },
      { label: 'API', variant: 'live' },
    ],
    description:
      'The complete New Venue Data API is now described by a machine-readable OpenAPI 3.1 document. Generate type-safe clients in your language of choice, import it into Postman or Insomnia, and stay in lock-step as the schema evolves.',
    points: [
      'Hosted at /openapi.json and versioned alongside every release',
      'Fully typed request and response schemas, including webhook event envelopes',
    ],
  },
  {
    date: 'July 9, 2025',
    version: 'v1.2',
    title: 'Scheduled CSV exports',
    icon: CalendarClock,
    tags: [{ label: 'New', variant: 'new' }],
    description:
      'Stop building cron jobs around our API just to feed a spreadsheet. You can now schedule recurring CSV exports — daily, weekly, or monthly — delivered to a signed download URL or pushed straight to your S3 bucket.',
    points: [
      'Filter exports by county, license type, and event class before they run',
      'Optional email notification with row counts when each export completes',
    ],
  },
  {
    date: 'April 3, 2025',
    version: 'v1.1',
    title: 'Ownership-transfer event classification',
    icon: Repeat,
    tags: [
      { label: 'New', variant: 'new' },
      { label: 'Fix', variant: 'beta' },
    ],
    description:
      'Our entity-resolution engine now detects when a license changes hands and links the outgoing and incoming owners across filings. Transfers that previously surfaced as a cancellation followed by a new filing are correctly classified as a single ownership_transfer event.',
    points: [
      'Resolves the prior_owner and new_owner entities on the same event record',
      'Eliminates the double-counting that inflated new-filing volumes in change-of-hands markets',
    ],
  },
  {
    date: 'January 15, 2025',
    version: 'v1.0',
    title: 'Slack integration enters beta',
    icon: MessageSquare,
    tags: [
      { label: 'New', variant: 'new' },
      { label: 'Beta', variant: 'beta' },
    ],
    description:
      'Connect a Slack workspace and pipe live license events into any channel without writing a line of code. Build a filter once and let new restaurant and bar filings land in front of your sales team the moment they hit the state record.',
    points: [
      'Per-channel filters by county, license type, and event class',
      'Rich message cards with the business name, address, and a deep link into the dashboard',
    ],
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
              Every county we add, every event type we classify, and every millisecond we shave off
              the API — shipped continuously and documented here. This is the product changelog;
              for breaking changes and endpoint-level release notes, see the{' '}
              <Link
                href="/docs/changelog"
                className="text-indigo-400 underline-offset-4 hover:text-indigo-300 hover:underline"
              >
                developer changelog
              </Link>
              .
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-medium text-white shadow-[0_0_20px_rgba(99,102,241,0.35)] transition-all hover:bg-indigo-600 hover:shadow-[0_0_30px_rgba(99,102,241,0.5)]"
              >
                Subscribe to updates <ArrowRight className="ml-2 h-4 w-4" />
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
            subtext="Newest first. Each release is dated, versioned, and tagged by the kind of change it brings."
            align="left"
          />

          <div className="flex flex-col">
            {ENTRIES.map((entry) => {
              const Icon = entry.icon
              return (
                <div
                  key={entry.version}
                  className="relative pl-8 pb-10 border-l border-[var(--ls-border)] last:border-l-transparent last:pb-0"
                >
                  <span className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full bg-indigo-500 ring-4 ring-[var(--ls-bg)]" />

                  <div className="flex flex-col gap-3">
                    {/* Meta row */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="text-xs text-[var(--ls-fg-3)]">{entry.date}</span>
                      <span className="h-1 w-1 rounded-full bg-[var(--ls-fg-4)]" />
                      <span className="inline-flex items-center rounded-md border border-[var(--ls-border-2)] bg-[var(--ls-surface)] px-1.5 py-0.5 font-mono text-xs text-[var(--ls-fg-2)]">
                        {entry.version}
                      </span>
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
                <p className="text-sm font-semibold text-[var(--ls-fg)]">Want the roadmap?</p>
                <p className="text-sm text-[var(--ls-fg-2)]">
                  Dashboard analytics, more counties, and a public API status page are next up.
                </p>
              </div>
            </div>
            <Link
              href="/contact?type=sales"
              className="inline-flex w-fit shrink-0 items-center text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300"
            >
              Talk to the team <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <CtaBanner />
    </div>
  )
}
