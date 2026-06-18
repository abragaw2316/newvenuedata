'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { AlertCircle, CheckCircle2, Download, X } from 'lucide-react'

const SESSION_KEY = 'ls_exit_intent_shown'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * ExitIntentModal
 *
 * Fires once per browser session when the cursor leaves the viewport toward the
 * top (classic exit-intent). Offers the sample dataset in exchange for an email.
 * Dismissible via the close button, the backdrop, or the Escape key. The
 * "shown" flag is stored in sessionStorage so it never re-triggers in the same
 * tab session.
 */
export function ExitIntentModal() {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [pending, setPending] = useState(false)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const markShown = useCallback(() => {
    try {
      window.sessionStorage.setItem(SESSION_KEY, '1')
    } catch {
      /* sessionStorage unavailable — ignore */
    }
  }, [])

  const close = useCallback(() => {
    setOpen(false)
  }, [])

  // Arm the exit-intent listener — but only if we haven't already shown it.
  useEffect(() => {
    let alreadyShown = false
    try {
      alreadyShown = window.sessionStorage.getItem(SESSION_KEY) === '1'
    } catch {
      alreadyShown = false
    }
    if (alreadyShown) return

    const handleMouseOut = (e: MouseEvent) => {
      // Only the genuine "left toward the top" gesture should trigger.
      // relatedTarget is null when the pointer leaves the document.
      if (e.relatedTarget) return
      if (e.clientY > 0) return
      setOpen(true)
      markShown()
      document.removeEventListener('mouseout', handleMouseOut)
    }

    document.addEventListener('mouseout', handleMouseOut)
    return () => document.removeEventListener('mouseout', handleMouseOut)
  }, [markShown])

  // While open: lock scroll, focus the close control, and wire Escape.
  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        close()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    const raf = window.requestAnimationFrame(() => closeButtonRef.current?.focus())

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
      window.cancelAnimationFrame(raf)
    }
  }, [open, close])

  const handleSubmit = async (e: React.FormEvent) => {
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
    setPending(true)
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: value, source: 'exit-intent-sample' }),
      })
      if (!res.ok) throw new Error('request-failed')
      setSubmitted(true)
    } catch {
      setError('Something went wrong — please email austin@newvenuedata.com for the sample.')
    } finally {
      setPending(false)
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-intent-title"
    >
      <button
        type="button"
        aria-label="Close dialog"
        onClick={close}
        className="absolute inset-0 cursor-default bg-[color-mix(in_srgb,var(--ls-bg)_80%,transparent)] backdrop-blur-sm"
      />

      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-[var(--ls-border-2)] bg-[var(--ls-surface)] shadow-2xl shadow-black/50">
        <button
          ref={closeButtonRef}
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute right-3 top-3 rounded-md p-1.5 text-[var(--ls-fg-3)] transition-colors hover:bg-[var(--ls-hover)] hover:text-[var(--ls-fg)] focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>

        {submitted ? (
          <div className="flex flex-col items-center gap-3 p-8 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10">
              <CheckCircle2 className="h-6 w-6 text-emerald-400" aria-hidden="true" />
            </span>
            <h2 id="exit-intent-title" className="text-lg font-semibold text-[var(--ls-fg)]">
              Got it — sample on the way
            </h2>
            <p className="text-sm text-[var(--ls-fg-2)]">
              We&apos;ll email a real sample export to{' '}
              <span className="font-medium text-[var(--ls-fg)]">{email.trim()}</span> shortly. Reply
              with the counties you care about and we&apos;ll tailor it.
            </p>
            <button
              type="button"
              onClick={close}
              className="mt-2 inline-flex items-center justify-center rounded-md bg-indigo-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-600"
            >
              Back to browsing
            </button>
          </div>
        ) : (
          <div className="p-8">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-1 text-xs font-medium text-indigo-400">
              <Download className="h-3 w-3" aria-hidden="true" />
              Free sample dataset
            </span>
            <h2
              id="exit-intent-title"
              className="mt-4 text-xl font-semibold text-[var(--ls-fg)]"
            >
              Before you go — grab the data
            </h2>
            <p className="mt-2 text-sm text-[var(--ls-fg-2)]">
              See exactly what every Florida liquor &amp; food-service filing looks like. We&apos;ll
              email you a real sample export — no credit card, no sales call.
            </p>

            <form onSubmit={handleSubmit} noValidate className="mt-5 flex flex-col gap-2">
              <label htmlFor="exit-intent-email" className="sr-only">
                Email address
              </label>
              <input
                id="exit-intent-email"
                type="email"
                placeholder="you@company.com"
                value={email}
                aria-invalid={!!error}
                aria-describedby={error ? 'exit-intent-email-error' : undefined}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (error) setError(null)
                }}
                className={`h-11 w-full rounded-md border bg-[var(--ls-surface-2)] px-3.5 text-sm text-[var(--ls-fg)] placeholder:text-[var(--ls-fg-4)] transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                  error
                    ? 'border-red-500/50'
                    : 'border-[var(--ls-border-2)] focus:border-indigo-500/50'
                }`}
              />
              {error && (
                <span
                  id="exit-intent-email-error"
                  className="flex items-center gap-1 text-xs text-red-400"
                >
                  <AlertCircle className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
                  {error}
                </span>
              )}
              <button
                type="submit"
                disabled={pending}
                className="mt-1 inline-flex h-11 items-center justify-center gap-1.5 rounded-md bg-indigo-500 px-5 text-sm font-medium text-white transition-colors hover:bg-indigo-600 disabled:opacity-60"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                {pending ? 'Sending…' : 'Send me the sample'}
              </button>
            </form>
            <p className="mt-3 text-xs text-[var(--ls-fg-3)]">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
