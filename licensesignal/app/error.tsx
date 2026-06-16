'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RotateCw, ArrowRight } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // In production this would report to an error-tracking service.
    console.error(error)
  }, [error])

  return (
    <section className="relative overflow-hidden gradient-hero py-28 lg:py-36">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 50% 40% at 50% 0%, rgba(244,63,94,0.08) 0%, transparent 70%)',
        }}
      />
      <div className="relative mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/15 border border-red-500/20">
          <AlertTriangle className="h-7 w-7 text-red-400" />
        </div>
        <p className="mt-6 text-sm font-medium tracking-widest text-red-400 uppercase">
          Something went wrong
        </p>
        <h1 className="mt-3 text-display-md text-[var(--ls-fg)]">An unexpected error occurred.</h1>
        <p className="mt-4 text-lg text-[var(--ls-fg-2)]">
          Our team has been notified. You can try again, or head back to safety.
        </p>
        {error.digest && (
          <p className="mt-3 font-mono text-xs text-[var(--ls-fg-3)]">Reference: {error.digest}</p>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center rounded-md bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium px-5 py-2.5 shadow-[0_0_20px_rgba(99,102,241,0.35)] transition-colors"
          >
            <RotateCw className="mr-2 h-4 w-4" /> Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-[var(--ls-border-2)] bg-transparent text-[var(--ls-fg-2)] hover:text-[var(--ls-fg)] hover:border-indigo-500/40 text-sm font-medium px-5 py-2.5 transition-colors"
          >
            Back to Home <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
