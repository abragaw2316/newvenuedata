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
    'How New Venue Data protects customer data and the Florida public-records pipeline — encryption, infrastructure, access controls, API security, and compliance.',
  alternates: { canonical: 'https://newvenuedata.com/security' },
}

const PILLARS = [
  {
    icon: Lock,
    title: 'Encryption everywhere',
    desc: 'All traffic to our API and dashboard is encrypted in transit with TLS 1.3 (HSTS enforced, modern ciphers only). Data at rest is encrypted with AES-256, including primary stores, backups, and exports.',
  },
  {
    icon: Server,
    title: 'Hardened infrastructure',
    desc: 'New Venue Data runs on a SOC 2-compliant cloud provider with isolated production environments, private networking, and no direct public access to data stores. Production is fully separated from staging and development.',
  },
  {
    icon: KeyRound,
    title: 'Access controls',
    desc: 'Internal access follows least-privilege and is gated behind SSO with mandatory MFA. Enterprise customers get SSO/SAML, scoped roles, and tamper-evident audit logging across every action in their workspace.',
  },
  {
    icon: ShieldCheck,
    title: 'API security',
    desc: 'Authenticate with scoped, revocable API keys and rotate them with zero downtime. Webhooks are HMAC-signed so you can verify every payload, and per-key rate limiting protects against abuse and runaway integrations.',
  },
  {
    icon: Database,
    title: 'Responsible data handling',
    desc: 'We process business-entity public records only — no consumer PII, no SSNs, no credit data. Florida DBPR sources are refreshed daily and retained only as long as needed to power your feeds and historical lookups.',
  },
  {
    icon: Activity,
    title: 'Reliability built in',
    desc: 'Pro and Enterprise plans carry a 99.9% uptime SLA backed by health checks, automated daily backups with point-in-time recovery, and continuous monitoring with on-call alerting.',
  },
]

const COMPLIANCE = [
  {
    name: 'SOC 2 Type II',
    detail: 'Controls audit covering security, availability, and confidentiality.',
    status: 'In Progress',
    tone: 'amber' as const,
  },
  {
    name: 'GDPR-aware practices',
    detail: 'Data-minimization, processing records, and DPA available for EU-facing customers.',
    status: 'Supported',
    tone: 'emerald' as const,
  },
  {
    name: 'CCPA',
    detail: 'Aligned with California privacy requirements for business contacts and data subject requests.',
    status: 'Supported',
    tone: 'emerald' as const,
  },
  {
    name: 'FCRA-safe by design',
    detail: 'Business-entity public records only. We are not a consumer reporting agency under the FCRA.',
    status: 'By Design',
    tone: 'emerald' as const,
  },
]

const toneStyles = {
  amber: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
  emerald: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
}

export default function SecurityPage() {
  return (
    <div>
      {/* Hero */}
      <section className="py-20 lg:py-28 gradient-hero">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium tracking-widest text-indigo-400 uppercase mb-6">
              Security
            </span>
            <h1 className="text-display-lg text-[var(--ls-fg)] mb-6">
              Security and compliance, built in.
            </h1>
            <p className="text-lg text-[var(--ls-fg-2)] leading-relaxed">
              New Venue Data sits between Florida&apos;s public-records systems and the teams that build
              on them. We treat both your account data and the entire ingestion pipeline with bank-grade
              rigor — encrypted end to end, least-privilege by default, and continuously monitored.
            </p>
            <p className="text-lg text-[var(--ls-fg-2)] leading-relaxed mt-4">
              Below is exactly how we protect your data, secure the API, and approach the regulatory
              frameworks our customers care about.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/contact?type=security"
                className="inline-flex items-center justify-center rounded-md bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium px-5 py-2.5 transition-colors"
              >
                Talk to Security <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <a
                href="mailto:austin@newvenuedata.com"
                className="inline-flex items-center justify-center rounded-md border border-[var(--ls-border-2)] bg-transparent text-[var(--ls-fg-2)] hover:border-[#6366f1] hover:text-[var(--ls-fg)] text-sm font-medium px-5 py-2.5 transition-colors"
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
            eyebrow="How We Protect Your Data"
            heading="Defense in depth, end to end"
            subtext="Every layer — from the network edge to the database to your API keys — is designed to fail safe."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PILLARS.map((pillar) => {
              const Icon = pillar.icon
              return (
                <GlowCard key={pillar.title}>
                  <div className="flex flex-col gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/15 border border-indigo-500/20">
                      <Icon className="h-5 w-5 text-indigo-400" />
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
            heading="Frameworks we align to"
            subtext="We hold ourselves to the standards our customers are audited against — and we're transparent about where each one stands."
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
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-indigo-400" />
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
            Need our SOC 2 report-in-progress, penetration test summary, or a signed DPA? Enterprise
            customers can request our full security package under NDA from their account team.
          </p>
        </div>
      </section>

      {/* Responsible disclosure */}
      <section className="py-20 bg-[var(--ls-surface-2)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-8 sm:p-10 max-w-4xl mx-auto flex flex-col gap-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/15 border border-indigo-500/20">
              <Mail className="h-5 w-5 text-indigo-400" />
            </div>
            <h2 className="text-2xl font-semibold text-[var(--ls-fg)]">Responsible disclosure</h2>
            <p className="text-sm text-[var(--ls-fg-2)] leading-relaxed max-w-2xl">
              Security is a shared effort. If you believe you&apos;ve found a vulnerability in our API,
              dashboard, or infrastructure, we want to hear from you. Email us a detailed report and we&apos;ll
              acknowledge it within one business day, keep you updated as we investigate, and credit
              researchers who follow good-faith disclosure.
            </p>
            <a
              href="mailto:austin@newvenuedata.com"
              className="text-sm font-medium text-indigo-400 hover:text-[#818cf8] transition-colors"
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
