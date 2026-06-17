import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ShieldCheck,
  Lock,
  Server,
  KeyRound,
  Database,
  Activity,
  CheckCircle2,
  Clock,
  Mail,
  ArrowRight,
} from 'lucide-react'
import { SectionHeading } from '@/components/shared/section-heading'
import { GlowCard } from '@/components/shared/glow-card'
import { CtaBanner } from '@/components/sections/cta-banner'

export const metadata: Metadata = {
  title: 'Security',
  description:
    'How New Venue Data secures the Florida public-records pipeline and your account data — what is in place today, and what is planned for enterprise. Honest and specific.',
  alternates: { canonical: 'https://newvenuedata.com/security' },
}

// Truthful posture for an early-stage product that resells PUBLIC business records.
// "Planned" items are clearly labeled — we don't claim controls we haven't built.
const PILLARS = [
  {
    icon: Lock,
    title: 'Encrypted in transit',
    desc: 'Every request to the site and API is served over HTTPS/TLS. The data we serve is public business-entity records — no consumer PII, SSNs, or credit data — so the sensitivity of what we handle is inherently low.',
  },
  {
    icon: Server,
    title: 'Trusted infrastructure',
    desc: 'Hosted on Vercel, which maintains SOC 2 Type II compliance, with isolated production builds and no public access to internal data files. We are transparent that the platform is SOC 2 — New Venue Data is not yet independently audited.',
  },
  {
    icon: KeyRound,
    title: 'API key security',
    desc: 'API keys are stored as SHA-256 hashes only — we never store or can recover your raw key. Keys are scoped to a plan, revocable, and can be re-issued on request. Per-key rate limits are applied to each request.',
  },
  {
    icon: Database,
    title: 'Public-records data only',
    desc: 'We process Florida (and Texas) business-license public records — no consumer data. Sources refresh daily; we attribute each source and follow its terms. This keeps us outside FCRA and minimizes the data we hold.',
  },
  {
    icon: ShieldCheck,
    title: 'Account access',
    desc: 'Administrative access is limited to the founder and protected by strong authentication. SSO/SAML, scoped team roles, and tamper-evident audit logging are on the roadmap for enterprise customers.',
  },
  {
    icon: Activity,
    title: 'Reliability',
    desc: 'Served from Vercel\'s global edge; the dataset is version-controlled and regenerated daily from source. Formal uptime SLAs, point-in-time backups, and on-call monitoring are available for enterprise — talk to us about requirements.',
  },
]

const COMPLIANCE = [
  {
    name: 'FCRA-safe by design',
    detail: 'Business-entity public records only. We are not a consumer reporting agency under the FCRA.',
    status: 'By Design',
    tone: 'emerald' as const,
  },
  {
    name: 'Public records (Ch. 119)',
    detail: 'All data originates from official Florida/Texas public-records sources; not affiliated with or endorsed by any state agency.',
    status: 'By Design',
    tone: 'emerald' as const,
  },
  {
    name: 'SOC 2 (infrastructure)',
    detail: 'Hosted on Vercel, a SOC 2 Type II platform. New Venue Data itself is not yet independently SOC 2 audited.',
    status: 'Infrastructure',
    tone: 'amber' as const,
  },
  {
    name: 'GDPR / CCPA',
    detail: 'We sell business-entity data, not consumer data. We honor applicable data requests and can provide a DPA on request.',
    status: 'On request',
    tone: 'emerald' as const,
  },
]

const toneStyles = {
  amber: 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-300',
  emerald: 'border-emerald-600/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
}

export default function SecurityPage() {
  return (
    <div>
      {/* Hero */}
      <section className="py-20 lg:py-28 gradient-hero">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center text-[11px] font-semibold tracking-[0.2em] text-indigo-700 uppercase mb-6">
              Security
            </span>
            <h1 className="text-display-lg text-[var(--ls-fg)] mb-6">
              Security, stated honestly.
            </h1>
            <p className="text-lg text-[var(--ls-fg-2)] leading-relaxed">
              New Venue Data resells <strong className="text-[var(--ls-fg)]">public business-records data</strong> and
              holds a small amount of account data. Below is exactly how we secure it today — and, just as
              importantly, what is still planned for enterprise. We don&apos;t claim certifications or controls
              we haven&apos;t earned.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/contact?type=security"
                className="inline-flex items-center justify-center rounded-md bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium px-5 py-2.5 transition-colors"
              >
                Ask about security <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <a
                href="mailto:austin@newvenuedata.com"
                className="inline-flex items-center justify-center rounded-md border border-[var(--ls-border-2)] bg-transparent text-[var(--ls-fg-2)] hover:border-[var(--ls-fg-3)] hover:text-[var(--ls-fg)] text-sm font-medium px-5 py-2.5 transition-colors"
              >
                Report a vulnerability
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="py-20 bg-[var(--ls-surface-2)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-12">
          <SectionHeading
            eyebrow="What's in place today"
            heading="How we handle data + access"
            subtext="A small, focused surface: public-records data, a REST API with hashed keys, and a single administrator."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PILLARS.map((pillar) => {
              const Icon = pillar.icon
              return (
                <GlowCard key={pillar.title}>
                  <div className="flex flex-col gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/15 border border-indigo-500/20">
                      <Icon className="h-5 w-5 text-indigo-700" />
                    </div>
                    <h3 className="text-base font-semibold text-[var(--ls-fg)]">{pillar.title}</h3>
                    <p className="text-sm text-[var(--ls-fg-2)] leading-relaxed">{pillar.desc}</p>
                  </div>
                </GlowCard>
              )
            })}
          </div>
        </div>
      </section>

      {/* Compliance */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-10">
          <SectionHeading
            eyebrow="Compliance"
            heading="Where each framework actually stands"
            subtext="Stated plainly — what is true by design, what comes from our infrastructure, and what is available on request."
          />
          <div className="rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] overflow-hidden max-w-4xl mx-auto w-full">
            {COMPLIANCE.map((item, i) => (
              <div
                key={item.name}
                className={`flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6 ${
                  i !== 0 ? 'border-t border-[var(--ls-border)]' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-indigo-700" />
                  <div>
                    <p className="text-sm font-semibold text-[var(--ls-fg)]">{item.name}</p>
                    <p className="text-sm text-[var(--ls-fg-3)] leading-relaxed mt-1">{item.detail}</p>
                  </div>
                </div>
                <span
                  className={`inline-flex shrink-0 items-center self-start rounded-full border px-3 py-1 text-xs font-medium ${toneStyles[item.tone]}`}
                >
                  {item.tone === 'amber' && <Clock className="mr-1.5 h-3 w-3" />}
                  {item.status}
                </span>
              </div>
            ))}
          </div>
          <p className="text-sm text-[var(--ls-fg-3)] text-center max-w-2xl mx-auto leading-relaxed">
            Need security documentation for a procurement review? Email{' '}
            <a href="mailto:austin@newvenuedata.com" className="text-indigo-700 hover:opacity-80">austin@newvenuedata.com</a>{' '}
            and I&apos;ll share exactly what we have — no overstatement.
          </p>
        </div>
      </section>

      {/* Responsible disclosure */}
      <section className="py-20 bg-[var(--ls-surface-2)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-8 sm:p-10 max-w-4xl mx-auto flex flex-col gap-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/15 border border-indigo-500/20">
              <Mail className="h-5 w-5 text-indigo-700" />
            </div>
            <h2 className="text-2xl font-semibold text-[var(--ls-fg)]">Responsible disclosure</h2>
            <p className="text-sm text-[var(--ls-fg-2)] leading-relaxed max-w-2xl">
              If you believe you&apos;ve found a vulnerability in our site or API, please email a detailed
              report. I&apos;ll acknowledge it within one business day, keep you updated as I investigate, and
              credit researchers who follow good-faith disclosure.
            </p>
            <a
              href="mailto:austin@newvenuedata.com"
              className="text-sm font-medium text-indigo-700 hover:opacity-80 transition-opacity"
            >
              austin@newvenuedata.com
            </a>
          </div>
        </div>
      </section>

      <CtaBanner />
    </div>
  )
}
