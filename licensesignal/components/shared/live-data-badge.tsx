'use client'

import { DATA_AS_OF } from '@/lib/real-data'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface LiveDataBadgeProps {
  className?: string
}

/**
 * Compact "live data" pill with a pulsing emerald dot, showing the date the
 * underlying Florida DBPR public-records extract was last refreshed.
 */
export function LiveDataBadge({ className }: LiveDataBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400',
        className
      )}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
      </span>
      <span>
        Live from FL DBPR{' '}
        <span className="text-emerald-400/60">·</span>{' '}
        <span className="text-[var(--ls-fg-3)]">updated {formatDate(DATA_AS_OF)}</span>
      </span>
    </span>
  )
}
