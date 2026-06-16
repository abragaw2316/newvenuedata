'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Zap,
  Check,
  ArrowRight,
  ArrowLeft,
  Copy,
  CheckCircle2,
} from 'lucide-react'

const INPUT_CLASS =
  'w-full rounded-md border border-[var(--ls-border-2)] bg-[var(--ls-surface-2)] px-3 py-2 text-sm text-[var(--ls-fg)] placeholder:text-[var(--ls-fg-4)] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50'

const SELECT_CLASS =
  'w-full appearance-none rounded-md border border-[var(--ls-border-2)] bg-[var(--ls-surface-2)] px-3 py-2 text-sm text-[var(--ls-fg)] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50'

type Step = 1 | 2 | 3 | 4

type PlanId = 'starter' | 'pro' | 'enterprise'

type FormState = {
  name: string
  email: string
  company: string
  password: string
  role: string
  useCase: string
  plan: PlanId
}

type FieldErrors = Partial<Record<keyof FormState, string>>

const STEP_LABELS: { id: Step; label: string }[] = [
  { id: 1, label: 'Account' },
  { id: 2, label: 'Use case' },
  { id: 3, label: 'Plan' },
  { id: 4, label: 'API key' },
]

const ROLE_OPTIONS = [
  'Sales / Business Development',
  'Data / Analytics',
  'Engineering',
  'Operations',
  'Founder / Executive',
  'Other',
]

const USE_CASE_OPTIONS = [
  'Sales prospecting',
  'Market intelligence',
  'Distribution / territory planning',
  'Lead enrichment',
  'Risk & compliance monitoring',
  'Other',
]

const PLANS: { id: PlanId; name: string; price: string; cadence: string; blurb: string }[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: '$299',
    cadence: '/mo',
    blurb: 'For small teams testing the waters with a single county focus.',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$999',
    cadence: '/mo',
    blurb: 'Full statewide coverage, webhooks, and CSV exports for growing teams.',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    cadence: '',
    blurb: 'SLAs, dedicated support, and volume pricing for data platforms.',
  },
]

// Deterministically derive a fake "live" API key from the email so the same
// email always yields the same key. No Math.random — pure char-code mixing.
function generateApiKey(seed: string): string {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789'
  const normalized = (seed.trim().toLowerCase() || 'licensesignal') + '::ls'
  let acc = 0
  for (let i = 0; i < normalized.length; i++) {
    acc = (acc * 31 + normalized.charCodeAt(i)) % 2147483647
  }

  let out = ''
  for (let i = 0; i < 24; i++) {
    // Advance the accumulator with a position-dependent term each iteration.
    acc = (acc * 1103515245 + 12345 + normalized.charCodeAt(i % normalized.length) * (i + 1)) % 2147483647
    out += alphabet[acc % alphabet.length]
  }
  return `ls_live_${out}`
}

export function SignupContent() {
  const [step, setStep] = useState<Step>(1)
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    company: '',
    password: '',
    role: '',
    useCase: '',
    plan: 'pro',
  })
  const [errors, setErrors] = useState<FieldErrors>({})
  const [copied, setCopied] = useState(false)

  const apiKey = generateApiKey(form.email)

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  function validateStep(current: Step): FieldErrors {
    const next: FieldErrors = {}
    if (current === 1) {
      if (!form.name.trim()) next.name = 'Enter your name.'
      if (!form.email.trim()) {
        next.email = 'Enter your work email.'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
        next.email = 'Enter a valid email address.'
      }
      if (!form.company.trim()) next.company = 'Enter your company.'
      if (!form.password) {
        next.password = 'Choose a password.'
      } else if (form.password.length < 8) {
        next.password = 'Use at least 8 characters.'
      }
    }
    if (current === 2) {
      if (!form.role) next.role = 'Select your role.'
      if (!form.useCase) next.useCase = 'Select a primary use case.'
    }
    // Step 3 always has a valid preselected plan; no validation needed.
    return next
  }

  function goNext() {
    const found = validateStep(step)
    if (Object.keys(found).length > 0) {
      setErrors(found)
      return
    }
    setErrors({})
    setStep((s) => Math.min(4, s + 1) as Step)
  }

  function goBack() {
    setErrors({})
    setStep((s) => Math.max(1, s - 1) as Step)
  }

  async function copyKey() {
    try {
      await navigator.clipboard.writeText(apiKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <section className="min-h-[80vh] flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-8">
        {/* Wordmark */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/20 border border-indigo-500/30">
            <Zap className="h-4 w-4 text-indigo-400" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-[var(--ls-fg)]">
            New Venue <span className="text-indigo-400">Data</span>
          </span>
        </Link>

        {/* Step indicator */}
        <div className="mt-8 flex items-center">
          {STEP_LABELS.map((s, i) => {
            const isDone = step > s.id
            const isCurrent = step === s.id
            return (
              <div key={s.id} className="flex flex-1 items-center last:flex-none">
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs font-medium transition-colors ${
                      isDone
                        ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-400'
                        : isCurrent
                          ? 'border-indigo-500/50 bg-indigo-500/15 text-indigo-400'
                          : 'border-[var(--ls-border-2)] bg-[var(--ls-surface-2)] text-[var(--ls-fg-3)]'
                    }`}
                  >
                    {isDone ? <Check className="h-3.5 w-3.5" /> : s.id}
                  </div>
                  <span
                    className={`text-[10px] font-medium ${
                      isCurrent ? 'text-[var(--ls-fg)]' : 'text-[var(--ls-fg-3)]'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {i < STEP_LABELS.length - 1 && (
                  <div
                    className={`mx-1 h-px flex-1 ${
                      step > s.id ? 'bg-emerald-500/40' : 'bg-[var(--ls-border)]'
                    }`}
                  />
                )}
              </div>
            )
          })}
        </div>

        <div className="mt-8">
          {/* STEP 1 — Account */}
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <div>
                <h1 className="text-lg font-semibold text-[var(--ls-fg)]">Create your account</h1>
                <p className="mt-1 text-sm text-[var(--ls-fg-3)]">
                  Start your 7-day trial. No credit card required.
                </p>
              </div>

              <Field label="Full name" error={errors.name} htmlFor="su-name">
                <input
                  id="su-name"
                  type="text"
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  placeholder="Jordan Rivera"
                  className={INPUT_CLASS}
                />
              </Field>

              <Field label="Work email" error={errors.email} htmlFor="su-email">
                <input
                  id="su-email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  placeholder="you@company.com"
                  className={INPUT_CLASS}
                />
              </Field>

              <Field label="Company" error={errors.company} htmlFor="su-company">
                <input
                  id="su-company"
                  type="text"
                  autoComplete="organization"
                  value={form.company}
                  onChange={(e) => update('company', e.target.value)}
                  placeholder="Acme Distribution"
                  className={INPUT_CLASS}
                />
              </Field>

              <Field label="Password" error={errors.password} htmlFor="su-password">
                <input
                  id="su-password"
                  type="password"
                  autoComplete="new-password"
                  value={form.password}
                  onChange={(e) => update('password', e.target.value)}
                  placeholder="At least 8 characters"
                  className={INPUT_CLASS}
                />
              </Field>
            </div>
          )}

          {/* STEP 2 — Use case */}
          {step === 2 && (
            <div className="flex flex-col gap-4">
              <div>
                <h1 className="text-lg font-semibold text-[var(--ls-fg)]">Tell us about your team</h1>
                <p className="mt-1 text-sm text-[var(--ls-fg-3)]">
                  We&apos;ll tailor your onboarding to how you plan to use the data.
                </p>
              </div>

              <Field label="Your role" error={errors.role} htmlFor="su-role">
                <div className="relative">
                  <select
                    id="su-role"
                    value={form.role}
                    onChange={(e) => update('role', e.target.value)}
                    className={SELECT_CLASS}
                  >
                    <option value="" disabled>
                      Select your role…
                    </option>
                    {ROLE_OPTIONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                  <SelectChevron />
                </div>
              </Field>

              <Field label="Primary use case" error={errors.useCase} htmlFor="su-usecase">
                <div className="relative">
                  <select
                    id="su-usecase"
                    value={form.useCase}
                    onChange={(e) => update('useCase', e.target.value)}
                    className={SELECT_CLASS}
                  >
                    <option value="" disabled>
                      Select a use case…
                    </option>
                    {USE_CASE_OPTIONS.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                  <SelectChevron />
                </div>
              </Field>
            </div>
          )}

          {/* STEP 3 — Plan */}
          {step === 3 && (
            <div className="flex flex-col gap-4">
              <div>
                <h1 className="text-lg font-semibold text-[var(--ls-fg)]">Choose a plan</h1>
                <p className="mt-1 text-sm text-[var(--ls-fg-3)]">
                  Switch or cancel anytime during your trial.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {PLANS.map((plan) => {
                  const selected = form.plan === plan.id
                  return (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => update('plan', plan.id)}
                      aria-pressed={selected}
                      className={`flex items-start gap-3 rounded-lg border p-4 text-left transition-colors ${
                        selected
                          ? 'border-indigo-500/50 bg-indigo-500/5'
                          : 'border-[var(--ls-border-2)] bg-[var(--ls-surface-2)] hover:border-[var(--ls-fg-4)]'
                      }`}
                    >
                      <span
                        className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border ${
                          selected ? 'border-indigo-500 bg-indigo-500' : 'border-[var(--ls-fg-4)]'
                        }`}
                      >
                        {selected && <Check className="h-3 w-3 text-white" />}
                      </span>
                      <span className="flex-1">
                        <span className="flex items-baseline justify-between gap-2">
                          <span className="text-sm font-semibold text-[var(--ls-fg)]">{plan.name}</span>
                          <span className="text-sm font-semibold text-[var(--ls-fg)]">
                            {plan.price}
                            <span className="text-xs font-normal text-[var(--ls-fg-3)]">{plan.cadence}</span>
                          </span>
                        </span>
                        <span className="mt-1 block text-xs text-[var(--ls-fg-3)] leading-relaxed">
                          {plan.blurb}
                        </span>
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* STEP 4 — API key (success) */}
          {step === 4 && (
            <div className="flex flex-col gap-4 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/30">
                <CheckCircle2 className="h-6 w-6 text-emerald-400" />
              </div>

              <div>
                <h1 className="text-lg font-semibold text-[var(--ls-fg)]">You&apos;re all set</h1>
                <p className="mt-1 text-sm text-[var(--ls-fg-3)]">
                  Your account is ready. Here&apos;s your live API key — keep it secret.
                </p>
              </div>

              {/* API key field */}
              <div className="text-left">
                <span className="text-xs font-medium text-[var(--ls-fg-2)]">Live API key</span>
                <div className="mt-1.5 flex items-stretch gap-2">
                  <code className="flex-1 truncate rounded-md border border-[var(--ls-border-2)] bg-[var(--ls-surface-2)] px-3 py-2 font-mono text-xs text-[var(--ls-fg)]">
                    {apiKey}
                  </code>
                  <button
                    type="button"
                    onClick={copyKey}
                    aria-label="Copy API key"
                    className={`inline-flex flex-shrink-0 items-center gap-1.5 rounded-md border px-3 py-2 text-xs font-medium transition-colors ${
                      copied
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                        : 'border-[var(--ls-border-2)] bg-[var(--ls-surface-2)] text-[var(--ls-fg-2)] hover:border-indigo-500/40 hover:text-[var(--ls-fg)]'
                    }`}
                  >
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <p className="mt-2 text-[11px] text-[var(--ls-fg-3)]">
                  This is a demo key for the {PLANS.find((p) => p.id === form.plan)?.name} plan. You
                  can rotate it anytime from your dashboard.
                </p>
              </div>

              <div className="mt-2 flex flex-col gap-2">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-1.5 rounded-md bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium px-5 py-2.5 transition-colors"
                >
                  Go to dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/docs"
                  className="inline-flex items-center justify-center gap-1.5 rounded-md border border-[var(--ls-border-2)] bg-[var(--ls-surface-2)] px-5 py-2.5 text-sm font-medium text-[var(--ls-fg-2)] transition-colors hover:border-indigo-500/40 hover:text-[var(--ls-fg)]"
                >
                  Read the docs
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Navigation (hidden on the success step) */}
        {step !== 4 && (
          <div className="mt-8 flex items-center justify-between gap-3">
            {step > 1 ? (
              <button
                type="button"
                onClick={goBack}
                className="inline-flex items-center gap-1.5 rounded-md border border-[var(--ls-border-2)] bg-[var(--ls-surface-2)] px-4 py-2.5 text-sm font-medium text-[var(--ls-fg-2)] transition-colors hover:border-indigo-500/40 hover:text-[var(--ls-fg)]"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
            ) : (
              <Link
                href="/login"
                className="text-sm text-[var(--ls-fg-3)] hover:text-[var(--ls-fg)] transition-colors"
              >
                Sign in instead
              </Link>
            )}

            <button
              type="button"
              onClick={goNext}
              className="inline-flex items-center gap-1.5 rounded-md bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium px-5 py-2.5 transition-colors"
            >
              {step === 3 ? 'Create account' : 'Continue'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

function Field({
  label,
  error,
  htmlFor,
  children,
}: {
  label: string
  error?: string
  htmlFor: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-xs font-medium text-[var(--ls-fg-2)]">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}

function SelectChevron() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ls-fg-3)]"
    >
      <path
        d="M6 8l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
