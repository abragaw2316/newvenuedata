import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Start your free trial',
  description:
    'Start a 14-day free trial of New Venue Data. Onboarding is concierge today — pick a plan and we set up your weekly feed and API key personally.',
  alternates: { canonical: 'https://newvenuedata.com/signup' },
  robots: { index: false, follow: false },
}

const STEPS = [
  'Pick a plan and start your 14-day free trial (no charge for two weeks).',
  'We set up your weekly new-venue feed for your counties — within one business day.',
  'Need the API? We issue your key and send the docs. Cancel anytime, month-to-month.',
]

export default function SignupPage() {
  return (
    <div className="min-h-[70vh] gradient-hero">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28 flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <span className="inline-flex items-center text-[11px] font-semibold tracking-[0.2em] text-indigo-700 uppercase">
            Get started
          </span>
          <h1 className="text-display-md text-[var(--ls-fg)]">Start your free trial</h1>
          <p className="text-lg text-[var(--ls-fg-2)] leading-relaxed">
            New Venue Data is onboarded concierge-style right now — no self-serve dashboard yet, just real
            Florida data and a real person setting it up for you. Here&apos;s how it works:
          </p>
        </div>

        <ul className="flex flex-col gap-3">
          {STEPS.map((s) => (
            <li key={s} className="flex items-start gap-3 text-sm text-[var(--ls-fg-2)]">
              <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-indigo-700" />
              {s}
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center rounded-md bg-[var(--ls-fg)] text-[var(--ls-bg)] hover:opacity-90 text-sm font-medium px-6 py-2.5 transition-opacity"
          >
            See plans &amp; start <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <a
            href="mailto:austin@newvenuedata.com?subject=New%20Venue%20Data%20trial"
            className="inline-flex items-center justify-center rounded-md border border-[var(--ls-border-2)] bg-transparent text-[var(--ls-fg-2)] hover:border-[var(--ls-fg-3)] hover:text-[var(--ls-fg)] text-sm font-medium px-6 py-2.5 transition-colors"
          >
            Talk to the founder
          </a>
        </div>

        <p className="text-xs text-[var(--ls-fg-3)]">
          Already a customer? Email{' '}
          <a href="mailto:austin@newvenuedata.com" className="text-indigo-700 hover:opacity-80">austin@newvenuedata.com</a>{' '}
          to manage your subscription or get a new API key.
        </p>
      </div>
    </div>
  )
}
