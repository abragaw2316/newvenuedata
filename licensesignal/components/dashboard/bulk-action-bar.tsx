'use client'

import { useState } from 'react'
import { Download, Tag, Star, X, Plus } from 'lucide-react'
import { DropdownMenu } from '@/components/dashboard/dropdown-menu'
import { tagColor } from '@/components/dashboard/dashboard-types'

interface BulkActionBarProps {
  count: number
  /** Tags already used elsewhere, offered as quick-apply suggestions. */
  knownTags: string[]
  onExport: () => void
  onTag: (tag: string) => void
  onPin: () => void
  onClear: () => void
}

export function BulkActionBar({
  count,
  knownTags,
  onExport,
  onTag,
  onPin,
  onClear,
}: BulkActionBarProps) {
  const [newTag, setNewTag] = useState('')

  if (count === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-[var(--ls-border)] bg-indigo-500/[0.07] px-4 py-2.5">
      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--ls-fg)]">
        <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-500 px-1.5 text-xs font-semibold text-white tabular-nums">
          {count}
        </span>
        selected
      </span>

      <div className="mx-1 h-4 w-px bg-[var(--ls-border-2)]" />

      <button
        type="button"
        onClick={onExport}
        className="inline-flex items-center gap-1.5 rounded-md border border-[var(--ls-border-2)] bg-[var(--ls-surface)] px-2.5 py-1.5 text-xs font-medium text-[var(--ls-fg-2)] transition-colors hover:border-indigo-500/40 hover:text-[var(--ls-fg)]"
      >
        <Download className="h-3.5 w-3.5" />
        Export CSV
      </button>

      <button
        type="button"
        onClick={onPin}
        className="inline-flex items-center gap-1.5 rounded-md border border-[var(--ls-border-2)] bg-[var(--ls-surface)] px-2.5 py-1.5 text-xs font-medium text-[var(--ls-fg-2)] transition-colors hover:border-amber-500/40 hover:text-[var(--ls-fg)]"
      >
        <Star className="h-3.5 w-3.5" />
        Pin
      </button>

      <DropdownMenu
        ariaLabel="Tag selected records"
        align="left"
        panelClassName="w-64"
        triggerClassName="inline-flex items-center gap-1.5 rounded-md border border-[var(--ls-border-2)] bg-[var(--ls-surface)] px-2.5 py-1.5 text-xs font-medium text-[var(--ls-fg-2)] transition-colors hover:border-indigo-500/40 hover:text-[var(--ls-fg)]"
        label={
          <>
            <Tag className="h-3.5 w-3.5" />
            Tag
          </>
        }
      >
        {(close) => (
          <div className="flex flex-col">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const trimmed = newTag.trim()
                if (!trimmed) return
                onTag(trimmed)
                setNewTag('')
                close()
              }}
              className="flex items-center gap-1.5 px-1.5 py-1"
            >
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="New tag…"
                className="min-w-0 flex-1 rounded-md border border-[var(--ls-border-2)] bg-[var(--ls-surface-2)] px-2.5 py-1.5 text-sm text-[var(--ls-fg)] outline-none transition-colors placeholder:text-[var(--ls-fg-3)] focus:border-indigo-500/60"
              />
              <button
                type="submit"
                aria-label="Apply new tag"
                disabled={newTag.trim() === ''}
                className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-indigo-500 text-white transition-colors hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Plus className="h-4 w-4" />
              </button>
            </form>

            {knownTags.length > 0 && (
              <div className="border-t border-[var(--ls-border)] px-1.5 pb-1 pt-2">
                <p className="mb-1.5 px-0.5 text-[11px] font-medium uppercase tracking-widest text-[var(--ls-fg-3)]">
                  Apply existing
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {knownTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        onTag(tag)
                        close()
                      }}
                      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium transition-opacity hover:opacity-80 ${tagColor(
                        tag
                      )}`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </DropdownMenu>

      <button
        type="button"
        onClick={onClear}
        className="ml-auto inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium text-[var(--ls-fg-3)] transition-colors hover:text-[var(--ls-fg)]"
      >
        <X className="h-3.5 w-3.5" />
        Clear
      </button>
    </div>
  )
}
