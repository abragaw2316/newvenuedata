'use client'

import { useState } from 'react'
import { AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react'

interface WaitlistFormProps {
  stateName: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function WaitlistForm({ stateName }: WaitlistFormProps) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const value = email.trim()
    if (!value) {
      setError('Please enter your email address.')
      return
    }
    if (!EMAIL_RE.test(value)) {
      setError('Please enter a valid email address.')
      return
    }
    setError(null)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="flex w-full max-w-md items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
        <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-400" />
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-[var(--ls-fg)]">
            You&apos;re on the list for {stateName}.
          </p>
          <p className="text-sm text-[var(--ls-fg-2)]">
            We&apos;ll email you the moment the {stateName} feed goes live.
          </p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex w-full max-w-md flex-col gap-2">
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor="waitlist-email" className="sr-only">
          Email address
        </label>
        <input
          id="waitlist-email"
          type="email"
          placeholder="you@company.com"
          value={email}
          aria-invalid={!!error}
          aria-describedby={error ? 'waitlist-email-error' : undefined}
          onChange={(e) => {
            setEmail(e.target.value)
            if (error) setError(null)
          }}
          className={`h-11 w-full flex-1 rounded-md border bg-[var(--ls-surface)] px-3.5 text-sm text-[var(--ls-fg)] placeholder:text-[var(--ls-fg-4)] transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
            error ? 'border-red-500/50' : 'border-[var(--ls-border-2)] focus:border-indigo-500/50'
          }`}
        />
        <button
          type="submit"
          className="inline-flex h-11 items-center justify-center gap-1.5 rounded-md bg-indigo-500 px-5 text-sm font-medium text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-colors hover:bg-indigo-600"
        >
          Join the waitlist
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
      {error && (
        <span
          id="waitlist-email-error"
          className="flex items-center gap-1 text-xs text-red-400"
        >
          <AlertCircle className="h-3 w-3 flex-shrink-0" />
          {error}
        </span>
      )}
      <p className="text-xs text-[var(--ls-fg-3)]">
        No spam — we&apos;ll only email you when {stateName} launches.
      </p>
    </form>
  )
}
