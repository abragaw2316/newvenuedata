import type { Metadata } from 'next'
import Link from 'next/link'
import { Zap, Check, Circle, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Welcome',
  description:
    'Get started with New Venue Data — create your API key, make your first request, and wire up real-time Florida license alerts.',
  alternates: { canonical: 'https://newvenuedata.com/welcome' },
  robots: { index: false, follow: false },
}

type OnboardingStep = {
  title: string
  description: string
  ctaLabel: string
  href: string
  done: boolean
}

const STEPS: OnboardingStep[] = [
  {
    title: 'Create your API key',
    description: 'Generate a live key so you can authenticate requests against the API.',
    ctaLabel: 'View key',
    href: '/dashboard',
    done: true,
  },
  {
    title: 'Make your first request',
    description: 'Pull a page of Florida license records and confirm your integration works end to end.',
    ctaLabel: 'List licenses',
    href: '/docs/list-licenses',
    done: false,
  },
  {
    title: 'Register a webhook',
    description: 'Get pushed every new filing, renewal, and status change in real time.',
    ctaLabel: 'Set up webhooks',
    href: '/docs/webhooks',
    done: false,
  },
  {
    title: 'Set your county filters',
    description: 'Narrow your feed to the Florida counties and license types your team cares about.',
    ctaLabel: 'Configure filters',
    href: '/dashboard',
    done: false,
  },
  {
    title: 'Invite your team',
    description: 'Add teammates so sales, ops, and engineering all work from the same feed.',
    ctaLabel: 'Invite teammates',
    href: '/dashboard',
    done: false,
  },
]

export default function WelcomePage() {
  const completed = STEPS.filter((s) => s.done).length

  return (
    <section className="min-h-[80vh] py-16 px-4">
      <div className="mx-auto max-w-2xl">
        {/* Wordmark */}
        <div className="flex items-center gap-2 mb-8">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/20 border border-indigo-500/30">
            <Zap className="h-4 w-4 text-indigo-400" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-[var(--ls-fg)]">
            License<span className="text-indigo-400">Signal</span>
          </span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-[var(--ls-fg)]">
          Welcome to New Venue Data
        </h1>
        <p className="mt-3 text-sm text-[var(--ls-fg-2)] leading-relaxed">
          You&apos;re a few steps away from a live feed of Florida license events. Work through the
          checklist below — most teams are sending their first request within an hour.
        </p>

        {/* Progress */}
        <div className="mt-6 flex items-center gap-3">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--ls-hover)]">
            <div
              className="h-full rounded-full bg-indigo-500 transition-all"
              style={{ width: `${(completed / STEPS.length) * 100}%` }}
            />
          </div>
          <span className="text-xs font-medium tabular-nums text-[var(--ls-fg-3)]">
            {completed} of {STEPS.length} done
          </span>
        </div>

        {/* Checklist */}
        <ul className="mt-8 flex flex-col gap-3">
          {STEPS.map((step) => (
            <li
              key={step.title}
              className="flex items-start gap-4 rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-5 transition-colors hover:border-[var(--ls-border-2)]"
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
                <p
                  className={`text-sm font-medium ${
                    step.done ? 'text-[var(--ls-fg-3)] line-through' : 'text-[var(--ls-fg)]'
                  }`}
                >
                  {step.title}
                </p>
                <p className="mt-1 text-xs text-[var(--ls-fg-3)] leading-relaxed">{step.description}</p>
              </div>

              <Link
                href={step.href}
                className="mt-0.5 inline-flex flex-shrink-0 items-center gap-1 rounded-md border border-[var(--ls-border-2)] bg-[var(--ls-surface-2)] px-3 py-1.5 text-xs font-medium text-[var(--ls-fg-2)] transition-colors hover:border-indigo-500/40 hover:text-[var(--ls-fg)]"
              >
                {step.ctaLabel}
                <ArrowRight className="h-3 w-3" />
              </Link>
            </li>
          ))}
        </ul>

        {/* Footer CTA */}
        <div className="mt-10 flex items-center justify-between border-t border-[var(--ls-border)] pt-6">
          <p className="text-xs text-[var(--ls-fg-3)]">You can finish these steps anytime from your dashboard.</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 rounded-md bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium px-5 py-2.5 transition-colors"
          >
            Go to dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
