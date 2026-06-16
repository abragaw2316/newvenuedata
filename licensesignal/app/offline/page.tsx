import type { Metadata } from 'next'
import Link from 'next/link'
import { WifiOff, RotateCw } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Offline',
  robots: { index: false, follow: false },
}

export default function OfflinePage() {
  return (
    <section className="py-28 lg:py-36">
      <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--ls-hover)] border border-[var(--ls-border-2)]">
          <WifiOff className="h-7 w-7 text-[var(--ls-fg-3)]" />
        </div>
        <h1 className="mt-6 text-display-md text-[var(--ls-fg)]">You&apos;re offline</h1>
        <p className="mt-4 text-lg text-[var(--ls-fg-2)]">
          We couldn&apos;t reach the network. Check your connection and try again — your data is
          waiting.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center rounded-md bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium px-5 py-2.5 transition-colors"
        >
          <RotateCw className="mr-2 h-4 w-4" /> Retry
        </Link>
      </div>
    </section>
  )
}
