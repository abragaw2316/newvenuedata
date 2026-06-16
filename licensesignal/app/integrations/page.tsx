import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Cloud,
  Database,
  HardDrive,
  Webhook,
  Workflow,
  Zap,
  MessageSquare,
  ArrowRight,
  Code2,
  Mail,
} from 'lucide-react'
import { SectionHeading } from '@/components/shared/section-heading'
import { GlowCard } from '@/components/shared/glow-card'
import { TagBadge } from '@/components/shared/tag-badge'
import { CtaBanner } from '@/components/sections/cta-banner'

export const metadata: Metadata = {
  title: 'Integrations',
  description:
    'Connect New Venue Data to your CRM, data warehouse, automation platform, and alerting tools. Push real-time Florida license filings into Salesforce, Snowflake, Zapier, Slack, and more — or build your own with the REST API and webhooks.',
  alternates: { canonical: 'https://newvenuedata.com/integrations' },
}

type Status = 'available' | 'soon'

interface Integration {
  name: string
  description: string
  status: Status
  icon?: typeof Cloud
  monogram?: string
}

interface IntegrationGroup {
  label: string
  heading: string
  subtext: string
  items: Integration[]
}

const GROUPS: IntegrationGroup[] = [
  {
    label: 'CRM',
    heading: 'Turn filings into pipeline',
    subtext:
      'Push every new Florida license filing straight into your CRM as a lead or account — enriched and routed to the right rep.',
    items: [
      {
        name: 'Salesforce',
        monogram: 'SF',
        description: 'Create Leads and Accounts from new filings, with custom field mapping.',
        status: 'available',
      },
      {
        name: 'HubSpot',
        monogram: 'HS',
        description: 'Sync filings as Contacts and Companies, ready for sequences and workflows.',
        status: 'available',
      },
      {
        name: 'Pipedrive',
        monogram: 'PD',
        description: 'Drop new filings into a pipeline stage and auto-assign deal owners.',
        status: 'soon',
      },
    ],
  },
  {
    label: 'Data Warehouse',
    heading: 'Land raw data where you model it',
    subtext:
      'Scheduled CSV and JSON exports delivered to your warehouse or bucket — so analysts can join filings against the rest of your data.',
    items: [
      {
        name: 'Snowflake',
        icon: Cloud,
        description: 'Scheduled CSV/JSON loads into a Snowflake stage on your cadence.',
        status: 'available',
      },
      {
        name: 'BigQuery',
        icon: Database,
        description: 'Daily exports streamed into a BigQuery dataset for SQL analysis.',
        status: 'soon',
      },
      {
        name: 'Amazon S3',
        icon: HardDrive,
        description: 'Drop partitioned CSV/JSON files into your S3 bucket automatically.',
        status: 'available',
      },
    ],
  },
  {
    label: 'Automation',
    heading: 'No-code workflows, zero glue',
    subtext:
      'Wire filings into thousands of apps without writing code. Trigger any downstream action the moment a filing lands.',
    items: [
      {
        name: 'Zapier',
        icon: Zap,
        description: 'Trigger Zaps on new filings and route them to 6,000+ connected apps.',
        status: 'available',
      },
      {
        name: 'n8n',
        icon: Workflow,
        description: 'Self-hosted, event-driven workflows powered by the filing webhook.',
        status: 'soon',
      },
      {
        name: 'Make',
        icon: Workflow,
        description: 'Build visual scenarios that branch and enrich on each new filing.',
        status: 'soon',
      },
    ],
  },
  {
    label: 'Alerting',
    heading: 'Real-time alerts where work happens',
    subtext:
      'Get a message the moment a matching filing appears — filtered by county, license type, or saved search.',
    items: [
      {
        name: 'Slack',
        icon: MessageSquare,
        description: 'Post real-time filing alerts to any channel, filtered to your criteria.',
        status: 'available',
      },
      {
        name: 'Microsoft Teams',
        icon: MessageSquare,
        description: 'Send filing notifications to Teams channels via incoming webhooks.',
        status: 'soon',
      },
    ],
  },
]

function StatusBadge({ status }: { status: Status }) {
  return status === 'available' ? (
    <TagBadge variant="new">Available</TagBadge>
  ) : (
    <TagBadge variant="beta">Coming soon</TagBadge>
  )
}

function LogoTile({ item }: { item: Integration }) {
  const Icon = item.icon
  return (
    <div className="h-11 w-11 rounded-lg bg-[var(--ls-hover)] border border-[var(--ls-border-2)] flex items-center justify-center shrink-0">
      {Icon ? (
        <Icon className="h-5 w-5 text-indigo-400" />
      ) : (
        <span className="text-[var(--ls-fg)] font-bold text-sm">{item.monogram}</span>
      )}
    </div>
  )
}

export default function IntegrationsPage() {
  return (
    <div>
      {/* Hero */}
      <section className="py-20 lg:py-28 gradient-hero">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Integrations"
            heading="Plug New Venue Data into your stack."
            subtext="Deliver new-business signals wherever your team already works — CRM, data warehouse, automation, and alerting. Real-time Florida license filings, no rip-and-replace required."
          />
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-md bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium px-5 py-2.5 transition-colors"
            >
              Request an integration
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center justify-center rounded-md border border-[var(--ls-border-2)] bg-transparent text-[var(--ls-fg-2)] hover:border-[#6366f1] hover:text-[var(--ls-fg)] text-sm font-medium px-5 py-2.5 transition-colors"
            >
              Read the API docs
            </Link>
          </div>
        </div>
      </section>

      {/* Integration groups */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-16">
          {GROUPS.map((group) => (
            <div key={group.label} className="flex flex-col gap-8">
              <div className="flex flex-col gap-3">
                <span className="text-xs font-semibold uppercase tracking-widest text-[var(--ls-fg-3)]">
                  {group.label}
                </span>
                <SectionHeading
                  align="left"
                  heading={group.heading}
                  subtext={group.subtext}
                />
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((item) => (
                  <GlowCard key={item.name} className="flex flex-col gap-4">
                    <div className="flex items-start justify-between gap-3">
                      <LogoTile item={item} />
                      <StatusBadge status={item.status} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3 className="text-[var(--ls-fg)] font-semibold">{item.name}</h3>
                      <p className="text-sm text-[var(--ls-fg-2)] leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </GlowCard>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Build your own */}
      <section className="py-20 bg-[var(--ls-surface-2)] border-y border-[var(--ls-border)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className="flex flex-col gap-6">
              <span className="text-xs font-semibold uppercase tracking-widest text-[var(--ls-fg-3)]">
                Build your own
              </span>
              <SectionHeading
                align="left"
                heading="Everything is an API call away."
                subtext="Every integration above is built on the same public surface you have access to: a clean REST API for queries and exports, plus signed webhooks that push each new filing to your endpoint in real time."
              />
              <ul className="flex flex-col gap-3">
                <li className="flex items-start gap-3 text-sm text-[var(--ls-fg-2)]">
                  <Code2 className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400" />
                  REST endpoints for filings, searches, and bulk exports.
                </li>
                <li className="flex items-start gap-3 text-sm text-[var(--ls-fg-2)]">
                  <Webhook className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400" />
                  Signed webhooks with retries and at-least-once delivery.
                </li>
                <li className="flex items-start gap-3 text-sm text-[var(--ls-fg-2)]">
                  <Cloud className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400" />
                  Scheduled CSV/JSON exports to your warehouse or bucket.
                </li>
              </ul>
              <div>
                <Link
                  href="/docs"
                  className="inline-flex items-center justify-center rounded-md bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium px-5 py-2.5 transition-colors"
                >
                  Explore the docs <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--ls-fg-3)]">
                  Query the API
                </p>
                <pre className="rounded-lg border border-[var(--ls-border)] bg-[var(--ls-surface-2)] p-4 font-mono text-xs text-[var(--ls-fg-2)] overflow-x-auto">
                  {`curl https://api.newvenuedata.com/v1/filings \\
  -H "Authorization: Bearer $LS_API_KEY" \\
  -G -d "county=Miami-Dade" \\
  -d "type=SRX" -d "since=2026-06-01"`}
                </pre>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--ls-fg-3)]">
                  Receive a webhook
                </p>
                <pre className="rounded-lg border border-[var(--ls-border)] bg-[var(--ls-surface-2)] p-4 font-mono text-xs text-[var(--ls-fg-2)] overflow-x-auto">
                  {`{
  "event": "filing.created",
  "license_type": "SRX",
  "county": "Orange",
  "filed_at": "2026-06-14T13:02:00Z"
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Don't see your tool */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <GlowCard className="flex flex-col items-center gap-6 px-6 py-12 text-center sm:px-12">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-500/15 border border-indigo-500/20">
              <Mail className="h-6 w-6 text-indigo-400" />
            </div>
            <div className="flex flex-col gap-3">
              <h2 className="text-display-md text-[var(--ls-fg)]">Don&apos;t see your tool?</h2>
              <p className="mx-auto max-w-2xl text-lg text-[var(--ls-fg-2)]">
                We ship new connectors based on what customers ask for. Tell us what you run, and
                we&apos;ll wire New Venue Data into it — or help you build it on the API in an
                afternoon.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-md bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium px-5 py-2.5 transition-colors"
              >
                Request an integration
              </Link>
              <a
                href="mailto:integrations@newvenuedata.com"
                className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                integrations@newvenuedata.com
              </a>
            </div>
          </GlowCard>
        </div>
      </section>

      <CtaBanner />
    </div>
  )
}
