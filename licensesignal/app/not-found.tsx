import type { Metadata } from 'next'
import Link from 'next/link'
import { Search, ArrowRight, FileQuestion } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Page Not Found',
  robots: { index: false, follow: false },
}

const SUGGESTED = [
  { href: '/docs', label: 'API Documentation' },
  { href: '/data-coverage', label: 'Data Coverage' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/use-cases', label: 'Use Cases' },
]

export default function NotFound() {
  return (
    <section className="relative overflow-hidden gradient-hero py-28 lg:py-36">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 50% 40% at 50% 0%, rgba(99,102,241,0.12) 0%, transparent 70%)',
        }}
      />
      <div className="relative mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/15 border border-indigo-500/20">
          <FileQuestion className="h-7 w-7 text-indigo-400" />
        </div>
        <p className="mt-6 text-sm font-medium tracking-widest text-indigo-400 uppercase">
          404 — Not Found
        </p>
        <h1 className="mt-3 text-display-md text-[var(--ls-fg)]">
          This page filed for a license we can&apos;t find.
        </h1>
        <p className="mt-4 text-lg text-[var(--ls-fg-2)]">
          The page you&apos;re looking for doesn&apos;t exist or may have moved. Let&apos;s get you
          back on track.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium px-5 py-2.5 shadow-[0_0_20px_rgba(99,102,241,0.35)] transition-colors"
          >
            Back to Home <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-md border border-[var(--ls-border-2)] bg-transparent text-[var(--ls-fg-2)] hover:text-[var(--ls-fg)] hover:border-indigo-500/40 text-sm font-medium px-5 py-2.5 transition-colors"
          >
            <Search className="mr-2 h-4 w-4" /> Contact Support
          </Link>
        </div>

        <div className="mt-12 w-full">
          <p className="text-xs font-medium uppercase tracking-widest text-[var(--ls-fg-3)] mb-4">
            Popular destinations
          </p>
          <div className="grid grid-cols-2 gap-2">
            {SUGGESTED.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between rounded-lg border border-[var(--ls-border)] bg-[var(--ls-surface)] px-4 py-3 text-sm text-[var(--ls-fg-2)] hover:text-[var(--ls-fg)] hover:border-indigo-500/30 transition-colors"
              >
                {item.label}
                <ArrowRight className="h-3.5 w-3.5 text-[var(--ls-fg-3)]" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
