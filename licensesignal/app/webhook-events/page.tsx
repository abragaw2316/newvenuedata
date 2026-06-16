import type { Metadata } from 'next'
import Link from 'next/link'
import { Webhook, ShieldCheck, ArrowRight } from 'lucide-react'
import { GlowCard } from '@/components/shared/glow-card'
import { TagBadge } from '@/components/shared/tag-badge'
import { CtaBanner } from '@/components/sections/cta-banner'
import { WEBHOOK_EVENTS } from '@/lib/webhook-events'

export const metadata: Metadata = {
  title: 'Webhook Events',
  description:
    'The complete catalog of New Venue Data webhook events — new filings, status changes, ownership transfers, renewals, cancellations, and address changes — each with a real signed payload.',
  alternates: { canonical: 'https://newvenuedata.com/webhook-events' },
}

const BADGE_VARIANTS: Record<
  string,
  'new' | 'live' | 'beta' | 'pro' | 'default'
> = {
  'license.new_filing': 'new',
  'license.status_change': 'live',
  'license.ownership_transfer': 'pro',
  'license.renewal': 'default',
  'license.cancellation': 'beta',
  'license.address_change': 'default',
}

export default function WebhookEventsPage() {
  return (
    <div>
      {/* Hero */}
      <section className="py-20 lg:py-28 gradient-hero">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium tracking-widest text-indigo-400 uppercase mb-6">
              Webhooks
            </span>
            <h1 className="text-display-lg text-[var(--ls-fg)] mb-6">
              Webhook Event Catalog
            </h1>
            <p className="text-lg text-[var(--ls-fg-2)] leading-relaxed">
              New Venue Data pushes every Florida license event to your endpoint in
              real time — so you never have to poll the API. This is the complete
              catalog of event types we deliver, each with a realistic example
              payload you can build against today.
            </p>
          </div>
        </div>
      </section>

      {/* Catalog */}
      <section className="py-20 bg-[var(--ls-surface-2)]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 flex flex-col gap-10">
          {/* Signed delivery intro */}
          <div className="rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-6 sm:p-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-500/15 border border-indigo-500/20">
              <ShieldCheck className="h-5 w-5 text-indigo-400" />
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-base font-semibold text-[var(--ls-fg)]">
                Every delivery is HMAC-signed
              </h2>
              <p className="text-sm text-[var(--ls-fg-2)] leading-relaxed">
                Each request includes an{' '}
                <code className="rounded bg-[var(--ls-hover)] border border-[var(--ls-border)] px-1.5 py-0.5 font-mono text-xs text-[var(--ls-fg)]">
                  X-New Venue Data-Signature
                </code>{' '}
                header so you can verify the payload came from us and was not
                tampered with in transit. Compute the HMAC-SHA256 of the raw
                request body using your signing secret and compare it against the
                header before trusting an event.
              </p>
              <Link
                href="/docs/webhooks"
                className="inline-flex items-center text-sm font-medium text-indigo-400 hover:text-[#818cf8] transition-colors"
              >
                Read the webhooks guide
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Events */}
          <div className="flex flex-col gap-6">
            {WEBHOOK_EVENTS.map((event) => (
              <GlowCard key={event.type}>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <Webhook className="h-4 w-4 shrink-0 text-indigo-400" />
                    <code className="font-mono text-sm font-semibold text-indigo-400">
                      {event.type}
                    </code>
                    <TagBadge variant={BADGE_VARIANTS[event.type]}>
                      {event.title}
                    </TagBadge>
                  </div>
                  <p className="text-sm text-[var(--ls-fg-2)] leading-relaxed">
                    {event.description}
                  </p>
                  <div className="overflow-hidden rounded-lg border border-[var(--ls-border)] bg-[var(--ls-bg)]">
                    <div className="flex items-center justify-between border-b border-[var(--ls-border)] px-4 py-2">
                      <span className="font-mono text-xs text-[var(--ls-fg-3)]">
                        Example payload
                      </span>
                      <span className="font-mono text-xs text-[var(--ls-fg-4)]">
                        application/json
                      </span>
                    </div>
                    <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[var(--ls-fg-2)]">
                      {JSON.stringify(event.examplePayload, null, 2)}
                    </pre>
                  </div>
                </div>
              </GlowCard>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />
    </div>
  )
}
