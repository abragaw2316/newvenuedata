'use client'

import { useEffect, useState } from 'react'
import { Activity } from 'lucide-react'
import { CountUp } from '@/components/shared/count-up'

interface StatsResponse {
  data?: {
    totalRecords?: number
    newFilings?: number
    countiesCovered?: number
  }
}

interface LiveFilingsCounterProps {
  /** Optional label rendered after the number. */
  label?: string
  /** Fallback shown before the fetch resolves (and if it fails). */
  fallback?: number
  className?: string
}

/**
 * LiveFilingsCounter
 *
 * Fetches /api/stats and renders an animated "X filings tracked" count via the
 * shared CountUp component. Falls back to a sensible default if the request
 * fails so the UI never shows an empty/zero state to the visitor.
 */
export function LiveFilingsCounter({
  label = 'filings tracked',
  fallback = 0,
  className,
}: LiveFilingsCounterProps) {
  const [total, setTotal] = useState<number | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    async function load() {
      try {
        const res = await fetch('/api/stats', { signal: controller.signal })
        if (!res.ok) throw new Error(`stats request failed: ${res.status}`)
        const json: StatsResponse = await res.json()
        const value = json?.data?.totalRecords
        setTotal(typeof value === 'number' ? value : fallback)
      } catch (err) {
        if ((err as Error)?.name === 'AbortError') return
        setTotal(fallback)
      }
    }

    load()
    return () => controller.abort()
  }, [fallback])

  // Hold render until we have a resolved number so CountUp animates from 0 → n
  // exactly once with the real target.
  if (total === null) {
    return (
      <span
        className={className}
        aria-hidden="true"
        // Reserve space and avoid layout shift while loading.
      >
        <span className="inline-flex items-center gap-2">
          <Activity className="h-4 w-4 text-indigo-400" aria-hidden="true" />
          <span className="tabular-nums text-[var(--ls-fg-3)]">—</span>
        </span>
      </span>
    )
  }

  return (
    <span
      className={className ?? 'inline-flex items-center gap-2 text-[var(--ls-fg)]'}
      role="status"
      aria-live="polite"
    >
      <Activity className="h-4 w-4 flex-shrink-0 text-indigo-400" aria-hidden="true" />
      <span>
        <CountUp to={total} className="font-semibold tabular-nums text-[var(--ls-fg)]" />{' '}
        <span className="text-[var(--ls-fg-2)]">{label}</span>
      </span>
    </span>
  )
}
