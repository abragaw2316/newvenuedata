import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Mail } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sign in',
  description:
    'Manage your New Venue Data subscription, API key, or feed. Onboarding and support are handled directly by the founder today.',
  alternates: { canonical: 'https://newvenuedata.com/login' },
  robots: { index: false, follow: false },
}

export default function LoginPage() {
  return (
    <div className="min-h-[70vh] gradient-hero">
      <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28 flex flex-col gap-6">
        <span className="inline-flex items-center text-[11px] font-semibold tracking-[0.2em] text-indigo-700 uppercase">
          Account
        </span>
        <h1 className="text-display-md text-[var(--ls-fg)]">Sign in</h1>
        <p className="text-lg text-[var(--ls-fg-2)] leading-relaxed">
          We don&apos;t have a self-serve login yet — onboarding and support are handled directly. To manage
          your subscription, rotate or recover your API key, or change your feed, email me and I&apos;ll take
          care of it the same day.
        </p>
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <a
            href="mailto:austin@newvenuedata.com?subject=New%20Venue%20Data%20account"
            className="inline-flex items-center justify-center rounded-md bg-[var(--ls-fg)] text-[var(--ls-bg)] hover:opacity-90 text-sm font-medium px-6 py-2.5 transition-opacity"
          >
            <Mail className="mr-2 h-4 w-4" /> Email austin@newvenuedata.com
          </a>
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center rounded-md border border-[var(--ls-border-2)] bg-transparent text-[var(--ls-fg-2)] hover:border-[var(--ls-fg-3)] hover:text-[var(--ls-fg)] text-sm font-medium px-6 py-2.5 transition-colors"
          >
            View plans <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
