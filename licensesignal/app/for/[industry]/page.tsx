import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowRight,
  Target,
  Zap,
  Webhook,
  FilePlus2,
  RefreshCw,
  Repeat,
  MapPin,
  Activity,
  TrendingUp,
} from 'lucide-react'
import { SectionHeading } from '@/components/shared/section-heading'
import { GlowCard } from '@/components/shared/glow-card'
import { CtaBanner } from '@/components/sections/cta-banner'
import { INDUSTRIES, getIndustry } from '@/lib/industries'

interface PageProps {
  params: Promise<{ industry: string }>
}

const EVENT_META: Record<string, { label: string; icon: typeof FilePlus2 }> = {
  new_filing: { label: 'New filing', icon: FilePlus2 },
  status_change: { label: 'Status change', icon: Activity },
  ownership_transfer: { label: 'Ownership transfer', icon: Repeat },
  address_change: { label: 'Address change', icon: MapPin },
  renewal: { label: 'Renewal', icon: RefreshCw },
  cancellation: { label: 'Cancellation', icon: RefreshCw },
}

const STEP_ICONS = [Target, Zap, Webhook] as const

export function generateStaticParams() {
  return INDUSTRIES.map((industry) => ({ industry: industry.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { industry: slug } = await params
  const industry = getIndustry(slug)

  if (!industry) {
    return { title: 'Industry Not Found' }
  }

  return {
    title: `Florida License Data for ${industry.name} — Buying-Signal Leads`,
    description: industry.signal,
    alternates: { canonical: `https://newvenuedata.com/for/${industry.slug}` },
    openGraph: {
      title: `New Venue Data for ${industry.name}`,
      description: industry.signal,
      url: `https://newvenuedata.com/for/${industry.slug}`,
    },
  }
}

export default async function IndustryPage({ params }: PageProps) {
  const { industry: slug } = await params
  const industry = getIndustry(slug)

  if (!industry) {
    notFound()
  }

  const otherIndustries = INDUSTRIES.filter((i) => i.slug !== industry.slug)

  // Three-step "how it works" narrative, seeded from the industry solution copy.
  const steps = [
    {
      title: 'Catch the filing',
      body: `The day a relevant license hits the Florida DBPR record, ${industry.name.toLowerCase()} get the business name, address, and license type — long before the venue is public.`,
    },
    {
      title: 'Filter to your fit',
      body: 'Narrow the feed by county, license type, and event so every lead matches your territory and the exact accounts your team sells to.',
    },
    {
      title: 'Route it to a rep',
      body: 'Push each lead into your CRM through the API or a webhook, or pull a daily digest — no scraping, no stale directories.',
    },
  ]

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://newvenuedata.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Use Cases',
        item: 'https://newvenuedata.com/use-cases',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: industry.name,
        item: `https://newvenuedata.com/for/${industry.slug}`,
      },
    ],
  }

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hero */}
      <section className="py-20 lg:py-28 gradient-hero">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-6">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-xs text-[var(--ls-fg-3)]"
          >
            <Link href="/" className="transition-colors hover:text-[var(--ls-fg-2)]">
              Home
            </Link>
            <span className="text-[var(--ls-fg-4)]">/</span>
            <Link href="/use-cases" className="transition-colors hover:text-[var(--ls-fg-2)]">
              Use Cases
            </Link>
            <span className="text-[var(--ls-fg-4)]">/</span>
            <span className="text-[var(--ls-fg-2)]">{industry.name}</span>
          </nav>

          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium uppercase tracking-widest text-indigo-400">
            <Target className="h-3.5 w-3.5" />
            For {industry.name}
          </span>

          <h1 className="text-display-lg text-[var(--ls-fg)] max-w-4xl">{industry.headline}</h1>

          <p className="max-w-2xl text-lg text-[var(--ls-fg-2)] leading-relaxed">{industry.pain}</p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-md bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium px-5 py-2.5 shadow-[0_0_20px_rgba(99,102,241,0.35)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all"
            >
              Get API Access <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/contact?type=sales"
              className="inline-flex items-center justify-center rounded-md border border-[var(--ls-border-2)] bg-transparent text-[var(--ls-fg-2)] hover:border-indigo-500/40 hover:text-[var(--ls-fg)] text-sm font-medium px-5 py-2.5 transition-colors"
            >
              Talk to Sales
            </Link>
          </div>
        </div>
      </section>

      {/* How it works for you */}
      <section className="py-20 bg-[var(--ls-surface-2)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-12">
          <SectionHeading
            eyebrow="How it works for you"
            heading={`From license filing to a call your ${industry.name.toLowerCase()} can win`}
            subtext={industry.solution}
          />

          <div className="grid gap-5 md:grid-cols-3">
            {steps.map((step, i) => {
              const Icon = STEP_ICONS[i]
              return (
                <div
                  key={step.title}
                  className="relative flex flex-col gap-4 rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10">
                      <Icon className="h-5 w-5 text-indigo-400" />
                    </div>
                    <span className="font-mono text-sm text-[var(--ls-fg-4)]">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-[var(--ls-fg)]">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-[var(--ls-fg-2)]">{step.body}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Outcomes */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-12">
          <SectionHeading
            eyebrow="What you get"
            heading="Outcomes that move the number"
            subtext={`Why ${industry.name.toLowerCase()} put license filings at the top of their funnel.`}
          />

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {industry.outcomes.map((outcome) => (
              <GlowCard key={outcome.label} className="flex flex-col gap-3">
                <p className="text-3xl font-bold tabular-nums text-[var(--ls-fg)]">{outcome.stat}</p>
                <p className="text-sm font-semibold text-indigo-400">{outcome.label}</p>
                <p className="text-sm leading-relaxed text-[var(--ls-fg-2)]">{outcome.detail}</p>
              </GlowCard>
            ))}
          </div>
        </div>
      </section>

      {/* Relevant events */}
      <section className="py-20 bg-[var(--ls-surface-2)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-12">
          <SectionHeading
            eyebrow="The signals that matter"
            heading="Events worth a call"
            subtext={`Subscribe to the license events that map to a buying decision for ${industry.name.toLowerCase()} — and skip the noise.`}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            {industry.relevantEvents.map(({ event, why }) => {
              const meta = EVENT_META[event] ?? { label: event, icon: Activity }
              const Icon = meta.icon
              return (
                <div
                  key={event}
                  className="flex items-start gap-4 rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-5 transition-colors hover:border-[var(--ls-border-2)]"
                >
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10">
                    <Icon className="h-4 w-4 text-indigo-400" />
                  </span>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[var(--ls-fg)]">{meta.label}</span>
                      <code className="rounded bg-[var(--ls-hover)] px-1.5 py-0.5 font-mono text-[11px] text-[var(--ls-fg-3)]">
                        {event}
                      </code>
                    </div>
                    <p className="text-sm leading-relaxed text-[var(--ls-fg-2)]">{why}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA + cross-links */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-12">
          <div className="relative overflow-hidden rounded-2xl border border-indigo-500/30 bg-[var(--ls-surface)] p-8 lg:p-12">
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(ellipse 50% 80% at 80% 0%, rgba(99,102,241,0.12) 0%, transparent 70%)',
              }}
            />
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col gap-3 max-w-xl">
                <div className="flex items-center gap-2 text-indigo-400">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-widest">
                    Built for {industry.name}
                  </span>
                </div>
                <h2 className="text-display-sm text-[var(--ls-fg)]">
                  Put new Florida filings at the top of your pipeline.
                </h2>
                <p className="text-base text-[var(--ls-fg-2)] leading-relaxed">{industry.signal}</p>
              </div>
              <div className="flex flex-shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-md bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium px-5 py-2.5 transition-colors"
                >
                  Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  href="/contact?type=sales"
                  className="inline-flex items-center justify-center rounded-md border border-[var(--ls-border-2)] bg-transparent text-[var(--ls-fg-2)] hover:border-indigo-500/40 hover:text-[var(--ls-fg)] text-sm font-medium px-5 py-2.5 transition-colors"
                >
                  Talk to Sales
                </Link>
              </div>
            </div>
          </div>

          {/* Other industries */}
          <div className="flex flex-col gap-4">
            <h2 className="text-sm font-semibold text-[var(--ls-fg-3)] uppercase tracking-widest">
              Built for other teams too
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {otherIndustries.map((other) => (
                <Link
                  key={other.slug}
                  href={`/for/${other.slug}`}
                  className="group flex items-center justify-between gap-3 rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-4 transition-colors hover:border-indigo-400/50 hover:bg-[var(--ls-hover)]"
                >
                  <span className="flex flex-col">
                    <span className="text-sm font-semibold text-[var(--ls-fg)]">{other.name}</span>
                    <span className="text-xs text-[var(--ls-fg-3)]">License filings as a buying signal</span>
                  </span>
                  <ArrowRight className="h-4 w-4 flex-shrink-0 text-[var(--ls-fg-4)] transition-colors group-hover:text-indigo-400" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CtaBanner />
    </div>
  )
}
