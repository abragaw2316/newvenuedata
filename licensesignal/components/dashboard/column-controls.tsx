'use client'

import { Columns3, ChevronUp, ChevronDown, Eye, EyeOff, RotateCcw } from 'lucide-react'
import { DropdownMenu } from '@/components/dashboard/dropdown-menu'
import {
  COLUMN_MAP,
  type ColumnId,
} from '@/components/dashboard/dashboard-types'

interface ColumnControlsProps {
  /** Ordered list of all column ids. */
  order: ColumnId[]
  /** Set of hidden column ids. */
  hidden: ColumnId[]
  onToggle: (id: ColumnId) => void
  onMove: (id: ColumnId, dir: -1 | 1) => void
  onReset: () => void
}

const TRIGGER_CLASS =
  'inline-flex items-center gap-1.5 rounded-md border border-[var(--ls-border-2)] px-3 py-2 text-sm font-medium text-[var(--ls-fg-2)] transition-colors hover:border-indigo-500/40 hover:text-[var(--ls-fg)]'

export function ColumnControls({
  order,
  hidden,
  onToggle,
  onMove,
  onReset,
}: ColumnControlsProps) {
  const hiddenSet = new Set(hidden)
  const visibleCount = order.filter((id) => !hiddenSet.has(id)).length

  return (
    <DropdownMenu
      ariaLabel="Column settings"
      align="right"
      panelClassName="w-72"
      triggerClassName={TRIGGER_CLASS}
      label={
        <>
          <Columns3 className="h-3.5 w-3.5" />
          Columns
          <span className="ml-0.5 rounded-full bg-[var(--ls-surface-2)] px-1.5 text-[10px] tabular-nums text-[var(--ls-fg-3)]">
            {visibleCount}
          </span>
        </>
      }
    >
      {() => (
        <div className="flex flex-col">
          <div className="flex items-center justify-between px-2 pb-1.5 pt-1">
            <p className="text-[11px] font-medium uppercase tracking-widest text-[var(--ls-fg-3)]">
              Show &amp; order columns
            </p>
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--ls-fg-3)] transition-colors hover:text-[var(--ls-fg)]"
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </button>
          </div>
          <ul className="max-h-72 overflow-y-auto">
            {order.map((id, idx) => {
              const col = COLUMN_MAP[id]
              const isHidden = hiddenSet.has(id)
              const isFirst = idx === 0
              const isLast = idx === order.length - 1
              return (
                <li
                  key={id}
                  className="flex items-center gap-1 rounded-md px-1 py-0.5 transition-colors hover:bg-[var(--ls-hover)]"
                >
                  <button
                    type="button"
                    onClick={() => !col.locked && onToggle(id)}
                    disabled={col.locked}
                    aria-label={`${isHidden ? 'Show' : 'Hide'} ${col.label} column`}
                    className={`flex min-w-0 flex-1 items-center gap-2 rounded-md px-1.5 py-1.5 text-left text-sm transition-colors ${
                      col.locked
                        ? 'cursor-default'
                        : 'cursor-pointer'
                    } ${
                      isHidden ? 'text-[var(--ls-fg-3)]' : 'text-[var(--ls-fg-2)]'
                    }`}
                  >
                    {isHidden ? (
                      <EyeOff className="h-3.5 w-3.5 flex-shrink-0 text-[var(--ls-fg-4)]" />
                    ) : (
                      <Eye className="h-3.5 w-3.5 flex-shrink-0 text-indigo-400" />
                    )}
                    <span className="truncate">
                      {col.label === '#' ? 'Row number' : col.label}
                    </span>
                    {col.locked && (
                      <span className="ml-auto text-[10px] text-[var(--ls-fg-4)]">
                        locked
                      </span>
                    )}
                  </button>
                  <div className="flex flex-shrink-0 items-center">
                    <button
                      type="button"
                      aria-label={`Move ${col.label} up`}
                      disabled={isFirst}
                      onClick={() => onMove(id, -1)}
                      className="flex h-6 w-6 items-center justify-center rounded text-[var(--ls-fg-3)] transition-colors hover:bg-[var(--ls-surface-2)] hover:text-[var(--ls-fg)] disabled:cursor-not-allowed disabled:opacity-25"
                    >
                      <ChevronUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      aria-label={`Move ${col.label} down`}
                      disabled={isLast}
                      onClick={() => onMove(id, 1)}
                      className="flex h-6 w-6 items-center justify-center rounded text-[var(--ls-fg-3)] transition-colors hover:bg-[var(--ls-surface-2)] hover:text-[var(--ls-fg)] disabled:cursor-not-allowed disabled:opacity-25"
                    >
                      <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </DropdownMenu>
  )
}
