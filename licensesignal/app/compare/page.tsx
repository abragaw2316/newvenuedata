import type { Metadata } from 'next'
import { Check, Minus, X, Zap, ShieldCheck, Clock } from 'lucide-react'
import { SectionHeading } from '@/components/shared/section-heading'
import { GlowCard } from '@/components/shared/glow-card'
import { CtaBanner } from '@/components/sections/cta-banner'

export const metadata: Metadata = {
  title: 'Compare',
  description:
    'New Venue Data vs. scraping it yourself vs. generic data brokers. See how real-time Florida license alerts, entity resolution, geocoding, and webhooks stack up against the alternatives.',
  alternates: { canonical: 'https://newvenuedata.com/compare' },
  openGraph: {
    title: 'New Venue Data vs. the alternatives',
    description:
      'Real-time Florida license data, fully normalized and delivered by API and webhooks — compared to DIY scraping and generic data brokers.',
    url: 'https://newvenuedata.com/compare',
  },
}

type Mark = 'yes' | 'partial' | 'no'

interface Row {
  capability: string
  licensesignal: { mark: Mark; note: string }
  scraping: { mark: Mark; note: string }
  broker: { mark: Mark; note: string }
}

const ROWS: Row[] = [
  {
    capability: 'Real-time filing alerts',
    licensesignal: { mark: 'yes', note: 'Day-of-filing events' },
    scraping: { mark: 'no', note: 'Only as fast as you re-crawl' },
    broker: { mark: 'no', note: 'Monthly or quarterly lists' },
  },
  {
    capability: 'Daily data refresh',
    licensesignal: { mark: 'yes', note: 'Every business day' },
    scraping: { mark: 'partial', note: 'If your crawler keeps up' },
    broker: { mark: 'no', note: 'Stale on arrival' },
  },
  {
    capability: 'Entity resolution',
    licensesignal: { mark: 'yes', note: 'DBA + owner matched' },
    scraping: { mark: 'no', note: 'Raw, unmatched rows' },
    broker: { mark: 'partial', note: 'Inconsistent matching' },
  },
  {
    capability: 'Address geocoding',
    licensesignal: { mark: 'yes', note: 'Lat/lng on every record' },
    scraping: { mark: 'no', note: 'Build it yourself' },
    broker: { mark: 'partial', note: 'Often missing or paid add-on' },
  },
  {
    capability: 'Webhooks',
    licensesignal: { mark: 'yes', note: 'HMAC-signed push' },
    scraping: { mark: 'no', note: 'No push, you poll' },
    broker: { mark: 'no', note: 'CSV downloads only' },
  },
  {
    capability: 'Normalized events',
    licensesignal: { mark: 'yes', note: 'Typed event stream' },
    scraping: { mark: 'no', note: 'Diff snapshots manually' },
    broker: { mark: 'no', note: 'Flat record dumps' },
  },
  {
    capability: 'FCRA-safe business-entity data',
    licensesignal: { mark: 'yes', note: 'Entities only, never consumers' },
    scraping: { mark: 'partial', note: 'Compliance is on you' },
    broker: { mark: 'partial', note: 'Mixed consumer data risk' },
  },
  {
    capability: 'Florida coverage',
    licensesignal: { mark: 'yes', note: 'All 67 counties' },
    scraping: { mark: 'partial', note: 'Per-source portals to stitch' },
    broker: { mark: 'partial', note: 'Patchy, not FL-focused' },
  },
  {
    capability: 'Developer API',
    licensesignal: { mark: 'yes', note: 'REST + cursor pagination' },
    scraping: { mark: 'no', note: 'No API, just HTML' },
    broker: { mark: 'partial', note: 'Limited or enterprise-gated' },
  },
  {
    capability: 'Maintenance burden',
    licensesignal: { mark: 'yes', note: 'Zero — we run it' },
    scraping: { mark: 'no', note: 'Breaks on every site change' },
    broker: { mark: 'partial', note: 'Vendor wrangling + cleanup' },
  },
  {
    capability: 'Time-to-value',
    licensesignal: { mark: 'yes', note: 'Live in an afternoon' },
    scraping: { mark: 'no', note: 'Weeks to build, never done' },
    broker: { mark: 'partial', note: 'Procurement + onboarding cycle' },
  },
  {
    capability: 'Cost predictability',
    licensesignal: { mark: 'yes', note: 'Flat monthly, no seat fees' },
    scraping: { mark: 'no', note: 'Hidden engineering cost' },
    broker: { mark: 'partial', note: 'Per-record + overage fees' },
  },
]

function MarkCell({ mark, note }: { mark: Mark; note: string }) {
  const icon =
    mark === 'yes' ? (
      <Check className="h-4 w-4 text-emerald-400 flex-shrink-0" />
    ) : mark === 'partial' ? (
      <Minus className="h-4 w-4 text-amber-400 flex-shrink-0" />
    ) : (
      <X className="h-4 w-4 text-[var(--ls-fg-4)] flex-shrink-0" />
    )
  return (
    <div className="flex items-start gap-2">
      {icon}
      <span className={`text-xs ${mark === 'no' ? 'text-[var(--ls-fg-3)]' : 'text-[var(--ls-fg-2)]'}`}>
        {note}
      </span>
    </div>
  )
}

const WHY_SWITCH = [
  {
    icon: Zap,
    title: 'Speed beats everything',
    description:
      'A scraper or a quarterly broker list tells you about an opening after the first vendor has already won the account. New Venue Data fires the moment a license is filed, so your team is first in the door.',
  },
  {
    icon: ShieldCheck,
    title: 'Clean data, not raw rows',
    description:
      'Entity resolution, DBA matching, geocoding, and typed events are done before the data reaches you. Teams stop building and maintaining a data pipeline and start working live leads.',
  },
  {
    icon: Clock,
    title: 'Zero maintenance forever',
    description:
      'State portals change, scrapers break, and broker contracts churn. We absorb all of it. You get a stable API and webhook contract that just keeps delivering Florida license events.',
  },
]

export default function ComparePage() {
  return (
    <div>
      {/* Hero */}
      <section className="py-20 lg:py-28 gradient-hero">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Compare"
            heading="New Venue Data vs. the alternatives"
            subtext="Three ways to get Florida license data: build a scraper, buy a generic broker list, or use New Venue Data. Here is how they actually compare on the things that decide deals."
          />
        </div>
      </section>

      {/* Comparison table */}
      <section className="py-20 bg-[var(--ls-surface-2)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
          <SectionHeading
            eyebrow="Side by Side"
            heading="Capability by capability"
          />
          <div className="rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] overflow-hidden overflow-x-auto">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="border-b border-[var(--ls-border)]">
                  <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-widest text-[var(--ls-fg-3)]">
                    Capability
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-medium text-[var(--ls-fg)]">
                    <span className="text-indigo-400">New Venue Data</span>
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-medium text-[var(--ls-fg-2)]">
                    Scraping it yourself
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-medium text-[var(--ls-fg-2)]">
                    Generic data brokers
                  </th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row, i) => (
                  <tr
                    key={row.capability}
                    className={`border-b border-[var(--ls-border)] last:border-0 ${
                      i % 2 === 1 ? 'bg-[var(--ls-surface-2)]' : ''
                    }`}
                  >
                    <td className="px-5 py-4 text-xs font-medium text-[var(--ls-fg)] align-top">
                      {row.capability}
                    </td>
                    <td className="px-5 py-4 align-top">
                      <MarkCell {...row.licensesignal} />
                    </td>
                    <td className="px-5 py-4 align-top">
                      <MarkCell {...row.scraping} />
                    </td>
                    <td className="px-5 py-4 align-top">
                      <MarkCell {...row.broker} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-6 text-xs text-[var(--ls-fg-3)]">
            <span className="flex items-center gap-2">
              <Check className="h-3.5 w-3.5 text-emerald-400" /> Fully supported
            </span>
            <span className="flex items-center gap-2">
              <Minus className="h-3.5 w-3.5 text-amber-400" /> Partial / with caveats
            </span>
            <span className="flex items-center gap-2">
              <X className="h-3.5 w-3.5 text-[var(--ls-fg-4)]" /> Not supported
            </span>
          </div>
        </div>
      </section>

      {/* Why teams switch */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
          <SectionHeading
            eyebrow="Why Teams Switch"
            heading="What changes when you stop fighting your data source"
          />
          <div className="grid md:grid-cols-3 gap-6">
            {WHY_SWITCH.map((item) => {
              const Icon = item.icon
              return (
                <GlowCard key={item.title} className="flex flex-col gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/15 border border-indigo-500/20">
                    <Icon className="h-5 w-5 text-indigo-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--ls-fg)]">{item.title}</h3>
                  <p className="text-sm text-[var(--ls-fg-2)] leading-relaxed">{item.description}</p>
                </GlowCard>
              )
            })}
          </div>
        </div>
      </section>

      <CtaBanner />
    </div>
  )
}
