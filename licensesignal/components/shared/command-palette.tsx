'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, CornerDownLeft, ArrowUp, ArrowDown, X } from 'lucide-react'
import { searchIndex, type SearchEntry } from '@/lib/search-index'

interface GroupedResults {
  section: string
  items: { entry: SearchEntry; index: number }[]
}

export function CommandPalette() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const results = useMemo(() => searchIndex(query), [query])

  // Group results by section while preserving a single flat index used for
  // keyboard selection across groups.
  const groups = useMemo<GroupedResults[]>(() => {
    const map = new Map<string, GroupedResults>()
    results.forEach((entry, index) => {
      let group = map.get(entry.section)
      if (!group) {
        group = { section: entry.section, items: [] }
        map.set(entry.section, group)
      }
      group.items.push({ entry, index })
    })
    return Array.from(map.values())
  }, [results])

  const close = useCallback(() => {
    setOpen(false)
    setQuery('')
    setActive(0)
  }, [])

  const navigate = useCallback(
    (entry: SearchEntry | undefined) => {
      if (!entry) return
      close()
      router.push(entry.href)
    },
    [close, router]
  )

  // Global shortcut: Cmd+K / Ctrl+K toggles the palette open.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  // Lock body scroll and focus the input while open.
  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const id = window.requestAnimationFrame(() => inputRef.current?.focus())
    return () => {
      document.body.style.overflow = previousOverflow
      window.cancelAnimationFrame(id)
    }
  }, [open])

  // Keep the active selection in range when results change.
  useEffect(() => {
    setActive((prev) => {
      if (results.length === 0) return 0
      return Math.min(prev, results.length - 1)
    })
  }, [results.length])

  // Scroll the active row into view as the selection moves.
  useEffect(() => {
    if (!open) return
    const node = listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)
    node?.scrollIntoView({ block: 'nearest' })
  }, [active, open])

  function onInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (results.length === 0) return
      setActive((prev) => (prev + 1) % results.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (results.length === 0) return
      setActive((prev) => (prev - 1 + results.length) % results.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      navigate(results[active])
    } else if (e.key === 'Escape') {
      e.preventDefault()
      close()
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[12vh] sm:pt-[18vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Search the site"
    >
      <button
        type="button"
        aria-label="Close search"
        onClick={close}
        className="absolute inset-0 cursor-default bg-[color-mix(in_srgb,var(--ls-bg)_80%,transparent)] backdrop-blur-sm"
      />

      <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-xl border border-[var(--ls-border-2)] bg-[var(--ls-surface)] shadow-2xl shadow-black/60">
        <div className="flex items-center gap-3 border-b border-[var(--ls-border)] px-4">
          <Search className="h-4 w-4 flex-shrink-0 text-[var(--ls-fg-3)]" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setActive(0)
            }}
            onKeyDown={onInputKeyDown}
            placeholder="Search pages, docs, and guides…"
            aria-label="Search"
            aria-controls="command-palette-results"
            aria-activedescendant={results.length ? `command-option-${active}` : undefined}
            autoComplete="off"
            spellCheck={false}
            className="w-full bg-transparent py-4 text-sm text-[var(--ls-fg)] placeholder:text-[var(--ls-fg-3)] focus:outline-none"
          />
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="flex-shrink-0 rounded-md p-1 text-[var(--ls-fg-3)] transition-colors hover:bg-[var(--ls-hover)] hover:text-[var(--ls-fg)]"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div
          ref={listRef}
          id="command-palette-results"
          role="listbox"
          aria-label="Search results"
          className="max-h-[min(60vh,420px)] overflow-y-auto p-2"
        >
          {results.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-[var(--ls-fg-3)]">
              No results for &ldquo;<span className="text-[var(--ls-fg-2)]">{query}</span>&rdquo;
            </p>
          ) : (
            groups.map((group) => (
              <div key={group.section} className="mb-2 last:mb-0">
                <div className="px-3 py-1.5 text-xs font-medium uppercase tracking-widest text-[var(--ls-fg-3)]">
                  {group.section}
                </div>
                {group.items.map(({ entry, index }) => {
                  const isActive = index === active
                  return (
                    <button
                      key={entry.href}
                      type="button"
                      id={`command-option-${index}`}
                      data-index={index}
                      role="option"
                      aria-selected={isActive}
                      onClick={() => navigate(entry)}
                      onMouseMove={() => setActive(index)}
                      className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                        isActive ? 'bg-[var(--ls-hover)]' : 'hover:bg-[color-mix(in_srgb,var(--ls-hover)_60%,transparent)]'
                      }`}
                    >
                      <span className="flex min-w-0 flex-col">
                        <span
                          className={`truncate text-sm font-medium ${
                            isActive ? 'text-[var(--ls-fg)]' : 'text-[var(--ls-fg-2)]'
                          }`}
                        >
                          {entry.title}
                        </span>
                        <span className="truncate text-xs text-[var(--ls-fg-3)]">{entry.href}</span>
                      </span>
                      {isActive && (
                        <CornerDownLeft
                          className="h-3.5 w-3.5 flex-shrink-0 text-indigo-400"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  )
                })}
              </div>
            ))
          )}
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-[var(--ls-border)] px-4 py-2.5 text-xs text-[var(--ls-fg-3)]">
          <span className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="inline-flex h-5 items-center rounded border border-[var(--ls-border-2)] bg-[var(--ls-surface-2)] px-1.5 font-sans">
                <ArrowUp className="h-3 w-3" aria-hidden="true" />
              </kbd>
              <kbd className="inline-flex h-5 items-center rounded border border-[var(--ls-border-2)] bg-[var(--ls-surface-2)] px-1.5 font-sans">
                <ArrowDown className="h-3 w-3" aria-hidden="true" />
              </kbd>
              to navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="inline-flex h-5 items-center rounded border border-[var(--ls-border-2)] bg-[var(--ls-surface-2)] px-1.5 font-sans">
                <CornerDownLeft className="h-3 w-3" aria-hidden="true" />
              </kbd>
              to open
            </span>
          </span>
          <span className="flex items-center gap-1">
            <kbd className="inline-flex h-5 items-center rounded border border-[var(--ls-border-2)] bg-[var(--ls-surface-2)] px-1.5 font-sans">
              Esc
            </kbd>
            to close
          </span>
        </div>
      </div>
    </div>
  )
}
