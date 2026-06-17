import type { Metadata } from 'next'
import Link from 'next/link'
import { Check, Circle, ArrowRight, Mail } from 'lucide-react'
import { LogoMark } from '@/components/shared/logo-mark'

export const metadata: Metadata = {
  title: 'Welcome',
  description:
    'Welcome to New Venue Data — your weekly list of newly-licensed Florida venues that need liquor liability, delivered to your inbox.',
  alternates: { canonical: 'https://newvenuedata.com/welcome' },
  robots: { index: false, follow: false },
}

type Step = {
  title: string
  description: string
  done: boolean
}

// Concierge onboarding: the product is a weekly emailed lead list, not an app to
// configure. These are "what happens next" — not action items the customer must do.
const STEPS: Step[] = [
  {
    title: 'Your subscription is active',
    description:
      'Your 14-day free trial just started — no charge until it ends, and you can cancel anytime.',
    done: true,
  },
  {
    title: 'Your first list arrives within one business day',
    description:
      'We email you a fresh list of venues that just got licensed to serve alcohol in your county — then a new batch every Monday morning.',
    done: false,
  },
  {
    title: 'Tell us your county and preferences',
    description:
      'Just reply to that email to add counties, focus on bars vs. restaurants, or ask about phone-number enrichment. A real person reads every reply.',
    done: false,
  },
  {
    title: 'Cancel anytime',
    description:
      'Month-to-month, no contract. Manage or cancel your plan straight from your Stripe receipt.',
    done: false,
  },
]

export default function WelcomePage() {
  return (
    <section className="min-h-[80vh] py-16 px-4">
      <div className="mx-auto max-w-2xl">
        {/* Wordmark */}
        <div className="flex items-center gap-2 mb-8">
          <div className="flex h-7 w-7 items-center justify-center">
            <LogoMark className="h-[18px] w-[18px] text-[var(--ls-fg)]" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-[var(--ls-fg)]">
            New Venue <span className="text-indigo-400">Data</span>
          </span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-[var(--ls-fg)]">
          You&apos;re in — welcome to New Venue Data
        </h1>
        <p className="mt-3 text-sm text-[var(--ls-fg-2)] leading-relaxed">
          Thanks for subscribing. There&apos;s nothing to install and nothing to learn — your
          new-venue leads come straight to your inbox. Here&apos;s exactly what happens next.
        </p>

        {/* What happens next */}
        <ul className="mt-8 flex flex-col gap-3">
          {STEPS.map((step) => (
            <li
              key={step.title}
              className="flex items-start gap-4 rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-5"
            >
              <div className="mt-0.5 flex-shrink-0">
                {step.done ? (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/30">
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                  </span>
                ) : (
                  <Circle className="h-6 w-6 text-[var(--ls-fg-4)]" />
                )}
              </div>

              <div className="flex-1">
                <p className="text-sm font-medium text-[var(--ls-fg)]">{step.title}</p>
                <p className="mt-1 text-xs text-[var(--ls-fg-3)] leading-relaxed">{step.description}</p>
              </div>
            </li>
          ))}
        </ul>

        {/* Contact / help */}
        <div className="mt-8 flex items-start gap-3 rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface-2)] p-5">
          <Mail className="mt-0.5 h-5 w-5 flex-shrink-0 text-indigo-400" />
          <div>
            <p className="text-sm font-medium text-[var(--ls-fg)]">Questions? Just email us.</p>
            <p className="mt-1 text-xs text-[var(--ls-fg-3)] leading-relaxed">
              Reach Austin directly at{' '}
              <a href="mailto:austin@newvenuedata.com" className="text-indigo-400 hover:underline">
                austin@newvenuedata.com
              </a>{' '}
              — you&apos;ll get a real reply, usually the same day. A self-serve dashboard and API
              are on the way, and as an early customer your feedback decides what we build next.
            </p>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-10 flex items-center justify-between border-t border-[var(--ls-border)] pt-6">
          <p className="text-xs text-[var(--ls-fg-3)]">Watch your inbox — your first list is on its way.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-md bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium px-5 py-2.5 transition-colors"
          >
            Back to newvenuedata.com
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
