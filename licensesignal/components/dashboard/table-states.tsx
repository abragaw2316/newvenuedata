'use client'

import { Inbox, FilterX } from 'lucide-react'

/** Skeleton rows shown while the (simulated) initial query resolves. */
export function TableSkeleton({
  rows = 8,
  columns = 7,
  rowHeight = 'py-3.5',
}: {
  rows?: number
  columns?: number
  rowHeight?: string
}) {
  return (
    <tbody aria-hidden="true">
      {Array.from({ length: rows }).map((_, r) => (
        <tr key={r} className="border-b border-[var(--ls-border)] last:border-0">
          {Array.from({ length: columns }).map((_, c) => (
            <td key={c} className={`px-4 ${rowHeight}`}>
              <div
                className="h-3 animate-pulse rounded bg-[var(--ls-hover)]"
                style={{ width: `${[40, 80, 55, 60, 50, 70, 65][c % 7]}%` }}
              />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  )
}

/** Empty state: distinguishes "no data at all" from "filtered everything out". */
export function EmptyState({
  hasFilters,
  pinnedOnly,
  onReset,
  colSpan,
}: {
  hasFilters: boolean
  pinnedOnly: boolean
  onReset: () => void
  colSpan: number
}) {
  const Icon = hasFilters ? FilterX : Inbox
  const title = pinnedOnly
    ? 'No pinned records'
    : hasFilters
      ? 'No matching records'
      : 'No records yet'
  const message = pinnedOnly
    ? 'Star a record to pin it here for quick access.'
    : hasFilters
      ? 'Try widening or clearing your filters to see more results.'
      : 'License filings will appear here as they are ingested.'

  return (
    <tbody>
      <tr>
        <td colSpan={colSpan} className="px-4 py-16">
          <div className="flex flex-col items-center justify-center gap-3 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--ls-border)] bg-[var(--ls-surface-2)]">
              <Icon className="h-5 w-5 text-[var(--ls-fg-3)]" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-[var(--ls-fg)]">{title}</p>
              <p className="max-w-xs text-xs text-[var(--ls-fg-3)]">{message}</p>
            </div>
            {(hasFilters || pinnedOnly) && (
              <button
                type="button"
                onClick={onReset}
                className="mt-1 inline-flex items-center gap-1.5 rounded-md border border-[var(--ls-border-2)] px-3 py-1.5 text-xs font-medium text-[var(--ls-fg-2)] transition-colors hover:border-indigo-500/40 hover:text-[var(--ls-fg)]"
              >
                Clear filters
              </button>
            )}
          </div>
        </td>
      </tr>
    </tbody>
  )
}
