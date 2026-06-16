import type { Metadata } from 'next'
import Link from 'next/link'
import { Bell, Cable, ArrowRight, Zap } from 'lucide-react'
import { SectionHeading } from '@/components/shared/section-heading'
import { CtaBanner } from '@/components/sections/cta-banner'
import { AlertRuleBuilder } from '@/components/notifications/alert-rule-builder'
import { NotificationCenter } from '@/components/notifications/notification-center'

export const metadata: Metadata = {
  title: 'Alerts & Notifications',
  description:
    'Build alert rules that notify you the moment a Florida license matching your criteria is filed — by license type and county, delivered to email, Slack, or SMS at the cadence you choose. Preview your live notification feed.',
  alternates: { canonical: 'https://newvenuedata.com/alerts' },
}

export default function AlertsPage() {
  return (
    <div>
      {/* Hero */}
      <section className="py-20 lg:py-28 gradient-hero">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex max-w-3xl flex-col gap-6">
            <span className="inline-flex w-fit items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium tracking-widest text-indigo-400 uppercase">
              Alerts
            </span>
            <h1 className="text-display-lg text-[var(--ls-fg)]">
              Never miss a filing that matters.
            </h1>
            <p className="text-lg leading-relaxed text-[var(--ls-fg-2)]">
              Tell New Venue Data exactly which Florida licenses you care about —
              by type and county — and we&apos;ll alert you the moment a match is
              filed. Route every signal to email, Slack, or SMS at the cadence
              your team actually works in. Build a rule below and preview the
              notification feed it will fill.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-md bg-indigo-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-600"
              >
                Get API Access <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/webhook-events"
                className="inline-flex items-center justify-center rounded-md border border-[var(--ls-border-2)] bg-transparent px-5 py-2.5 text-sm font-medium text-[var(--ls-fg-2)] transition-colors hover:border-[#6366f1] hover:text-[var(--ls-fg)]"
              >
                See event types
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Builder + notification preview */}
      <section className="py-20">
        <div className="mx-auto flex max-w-7xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Alert Rules"
            heading="Design the alert, then watch it fire"
            subtext="Rules and read-state are saved right in your browser, so this page is fully interactive — no account required to try it out."
            align="left"
          />

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-start">
            {/* Rule builder */}
            <div className="min-w-0">
              <AlertRuleBuilder />
            </div>

            {/* Notification center panel */}
            <div className="flex flex-col gap-4 lg:sticky lg:top-24">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/15">
                  <Bell className="h-4 w-4 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-[var(--ls-fg)]">
                    Notification center
                  </h3>
                  <p className="text-xs text-[var(--ls-fg-3)]">
                    A preview of the in-app feed your rules populate.
                  </p>
                </div>
              </div>
              <NotificationCenter inline />
            </div>
          </div>

          {/* Delivery note */}
          <div className="flex flex-col gap-4 rounded-xl border border-amber-500/20 bg-[color-mix(in_srgb,var(--ls-surface-2)_80%,transparent)] p-6 sm:flex-row sm:items-start sm:gap-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/10">
              <Cable className="h-5 w-5 text-amber-400" />
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="text-base font-semibold text-[var(--ls-fg)]">
                Delivery requires connecting a channel
              </h4>
              <p className="text-sm leading-relaxed text-[var(--ls-fg-2)]">
                The rules and notifications on this page are a local preview saved
                in your browser. To actually receive alerts by email, Slack, or
                SMS, you&apos;ll connect a delivery channel and an API key inside
                your New Venue Data workspace. Until a channel is connected, rules
                stay in preview mode and nothing is sent.
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-4">
                <Link
                  href="/integrations"
                  className="inline-flex items-center text-sm font-medium text-indigo-400 transition-colors hover:text-[#818cf8]"
                >
                  <Zap className="mr-1.5 h-4 w-4" />
                  Connect a channel
                </Link>
                <Link
                  href="/docs"
                  className="inline-flex items-center text-sm font-medium text-[var(--ls-fg-2)] transition-colors hover:text-[var(--ls-fg)]"
                >
                  Read the delivery docs
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaBanner />
    </div>
  )
}
