'use client'

import { useState } from 'react'
import { Bookmark, Plus, Trash2, Check } from 'lucide-react'
import { DropdownMenu } from '@/components/dashboard/dropdown-menu'
import type { FilterState, SavedView } from '@/components/dashboard/dashboard-types'

interface SavedViewsProps {
  views: SavedView[]
  current: FilterState
  /** Whether the current filter set matches a non-default selection. */
  hasFilters: boolean
  onSave: (name: string) => void
  onApply: (view: SavedView) => void
  onDelete: (id: string) => void
}

const TRIGGER_CLASS =
  'inline-flex items-center gap-1.5 rounded-md border border-[var(--ls-border-2)] px-3 py-2 text-sm font-medium text-[var(--ls-fg-2)] transition-colors hover:border-indigo-500/40 hover:text-[var(--ls-fg)]'

function sameFilters(a: FilterState, b: FilterState): boolean {
  return (
    a.county === b.county &&
    a.licenseType === b.licenseType &&
    a.status === b.status &&
    a.query.trim() === b.query.trim() &&
    a.pinnedOnly === b.pinnedOnly
  )
}

export function SavedViews({
  views,
  current,
  hasFilters,
  onSave,
  onApply,
  onDelete,
}: SavedViewsProps) {
  const [name, setName] = useState('')

  const activeView = views.find((v) => sameFilters(v, current)) ?? null

  return (
    <DropdownMenu
      ariaLabel="Saved views"
      align="left"
      panelClassName="w-72"
      triggerClassName={TRIGGER_CLASS}
      label={
        <>
          <Bookmark className="h-3.5 w-3.5" />
          {activeView ? activeView.name : 'Saved views'}
          {views.length > 0 && (
            <span className="ml-0.5 rounded-full bg-[var(--ls-surface-2)] px-1.5 text-[10px] tabular-nums text-[var(--ls-fg-3)]">
              {views.length}
            </span>
          )}
        </>
      }
    >
      {(close) => (
        <div className="flex flex-col">
          {/* Save current */}
          <div className="px-1.5 pb-2 pt-1">
            <p className="mb-1.5 px-0.5 text-[11px] font-medium uppercase tracking-widest text-[var(--ls-fg-3)]">
              Save current filters
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const trimmed = name.trim()
                if (!trimmed || !hasFilters) return
                onSave(trimmed)
                setName('')
              }}
              className="flex items-center gap-1.5"
            >
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={hasFilters ? 'View name…' : 'Apply a filter first'}
                disabled={!hasFilters}
                className="min-w-0 flex-1 rounded-md border border-[var(--ls-border-2)] bg-[var(--ls-surface-2)] px-2.5 py-1.5 text-sm text-[var(--ls-fg)] outline-none transition-colors placeholder:text-[var(--ls-fg-3)] focus:border-indigo-500/60 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <button
                type="submit"
                aria-label="Save view"
                disabled={!hasFilters || name.trim() === ''}
                className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-indigo-500 text-white transition-colors hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Plus className="h-4 w-4" />
              </button>
            </form>
          </div>

          {views.length > 0 && (
            <div className="border-t border-[var(--ls-border)] pt-1.5">
              <p className="mb-1 px-2 text-[11px] font-medium uppercase tracking-widest text-[var(--ls-fg-3)]">
                Your views
              </p>
              <ul className="max-h-56 overflow-y-auto">
                {views.map((view) => {
                  const isActive = activeView?.id === view.id
                  return (
                    <li key={view.id} className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          onApply(view)
                          close()
                        }}
                        className={`flex min-w-0 flex-1 items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-[var(--ls-hover)] ${
                          isActive ? 'text-[var(--ls-fg)]' : 'text-[var(--ls-fg-2)]'
                        }`}
                      >
                        <Check
                          className={`h-3.5 w-3.5 flex-shrink-0 ${
                            isActive ? 'text-indigo-400' : 'text-transparent'
                          }`}
                        />
                        <span className="truncate">{view.name}</span>
                      </button>
                      <button
                        type="button"
                        aria-label={`Delete view ${view.name}`}
                        onClick={() => onDelete(view.id)}
                        className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md text-[var(--ls-fg-3)] transition-colors hover:bg-red-500/10 hover:text-red-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}

          {views.length === 0 && (
            <p className="border-t border-[var(--ls-border)] px-2 py-3 text-center text-xs text-[var(--ls-fg-3)]">
              No saved views yet.
            </p>
          )}
        </div>
      )}
    </DropdownMenu>
  )
}
