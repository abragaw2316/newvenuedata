'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Search,
  X,
  Bookmark,
  BookmarkCheck,
  Clock,
  SlidersHorizontal,
  MapPin,
  AlertTriangle,
  Loader2,
  ArrowRight,
  Trash2,
} from 'lucide-react'
import type { LicenseRecord, LicenseType } from '@/lib/types'
import {
  getStatusBadgeColor,
  getLicenseTypeBadgeColor,
  getLicenseTypeLabel,
  formatDate,
} from '@/lib/utils'

// ---------------------------------------------------------------------------
// Facet definitions — derived from the live dataset's known dimensions so the
// chips match exactly what /api/licenses accepts as filter values.
// ---------------------------------------------------------------------------

const COUNTY_FACETS = [
  'Miami-Dade',
  'Broward',
  'Palm Beach',
  'Hillsborough',
  'Orange',
  'Pinellas',
  'Duval',
  'Collier',
  'Sarasota',
  'Alachua',
] as const

const TYPE_FACETS: readonly LicenseType[] = ['COP', 'BEV', 'APS', 'FOOD_SERVICE']

const STATUS_FACETS = ['approved', 'pending'] as const

const RECENT_KEY = 'ls.search.recent'
const SAVED_KEY = 'ls.search.saved'
const MAX_RECENT = 6
const DEBOUNCE_MS = 250

interface SavedSearch {
  id: string
  query: string
  counties: string[]
  types: string[]
  statuses: string[]
  createdAt: string
}

// ---------------------------------------------------------------------------
// localStorage helpers (guarded for SSR + private-mode failures)
// ---------------------------------------------------------------------------

function readList<T>(key: string): T[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as T[]) : []
  } catch {
    return []
  }
}

function writeList<T>(key: string, value: T[]): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* quota / private mode — silently ignore */
  }
}

// ---------------------------------------------------------------------------
// Highlight matched substring of a label, case-insensitively.
// ---------------------------------------------------------------------------

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function Highlight({ text, query }: { text: string; query: string }) {
  const trimmed = query.trim()
  if (!trimmed) return <>{text}</>
  // Splitting on a capturing group keeps the matched delimiters in the array;
  // case-insensitive comparison against the needle tells us which parts to mark
  // (no stateful regex .test which would be unreliable with the global flag).
  const needle = trimmed.toLowerCase()
  const parts = text.split(new RegExp(`(${escapeRegExp(trimmed)})`, 'ig'))
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === needle ? (
          <mark key={i} className="rounded-[3px] bg-indigo-500/25 px-0.5 text-[var(--ls-fg)]">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  )
}

interface ChipProps {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}

function FacetChip({ active, onClick, children }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={
        active
          ? 'inline-flex items-center gap-1.5 rounded-full border border-indigo-500/40 bg-indigo-500/15 px-3 py-1 text-xs font-medium text-indigo-400 transition-colors'
          : 'inline-flex items-center gap-1.5 rounded-full border border-[var(--ls-border-2)] bg-[var(--ls-surface-2)] px-3 py-1 text-xs font-medium text-[var(--ls-fg-3)] transition-colors hover:border-[var(--ls-fg-4)] hover:text-[var(--ls-fg-2)]'
      }
    >
      {active && <span className="inline-block h-1.5 w-1.5 rounded-full bg-indigo-400" />}
      {children}
    </button>
  )
}

// Build a query string from the current state for the live API.
function buildApiQuery({
  query,
  counties,
  types,
  statuses,
}: {
  query: string
  counties: string[]
  types: string[]
  statuses: string[]
}): string {
  const params = new URLSearchParams()
  if (query.trim()) params.set('q', query.trim())
  // The list API takes a single value per facet; when multiple are selected we
  // fetch the broadest set with q only and refine client-side below.
  if (counties.length === 1) params.set('county', counties[0])
  if (types.length === 1) params.set('license_type', types[0])
  if (statuses.length === 1) params.set('status', statuses[0])
  params.set('limit', '50')
  return params.toString()
}

export function SearchContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // --- initial state hydrated from the URL -------------------------------
  const [query, setQuery] = useState(() => searchParams.get('q') ?? '')
  const [counties, setCounties] = useState<string[]>(() =>
    (searchParams.get('county') ?? '').split(',').filter(Boolean)
  )
  const [types, setTypes] = useState<string[]>(() =>
    (searchParams.get('type') ?? '').split(',').filter(Boolean)
  )
  const [statuses, setStatuses] = useState<string[]>(() =>
    (searchParams.get('status') ?? '').split(',').filter(Boolean)
  )

  const [results, setResults] = useState<LicenseRecord[]>([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  const [recent, setRecent] = useState<string[]>([])
  const [saved, setSaved] = useState<SavedSearch[]>([])
  const [showRecent, setShowRecent] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const comboRef = useRef<HTMLDivElement>(null)

  // load persisted lists once on mount
  useEffect(() => {
    setRecent(readList<string>(RECENT_KEY))
    setSaved(readList<SavedSearch>(SAVED_KEY))
  }, [])

  // close the recent dropdown on outside click
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (comboRef.current && !comboRef.current.contains(e.target as Node)) {
        setShowRecent(false)
      }
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  // --- sync state -> URL (shallow, no scroll/history spam) ---------------
  useEffect(() => {
    const params = new URLSearchParams()
    if (query.trim()) params.set('q', query.trim())
    if (counties.length) params.set('county', counties.join(','))
    if (types.length) params.set('type', types.join(','))
    if (statuses.length) params.set('status', statuses.join(','))
    const qs = params.toString()
    router.replace(qs ? `/search?${qs}` : '/search', { scroll: false })
  }, [query, counties, types, statuses, router])

  // --- debounced fetch against the live API ------------------------------
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const runSearch = useCallback(
    async (signal: AbortSignal) => {
      const hasCriteria =
        query.trim() !== '' ||
        counties.length > 0 ||
        types.length > 0 ||
        statuses.length > 0

      if (!hasCriteria) {
        setResults([])
        setCount(0)
        setHasSearched(false)
        setError(null)
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)
      setHasSearched(true)

      try {
        // Use the dedicated search endpoint when a query is present (richer
        // full-text match); otherwise use the faceted list endpoint.
        const endpoint = query.trim()
          ? `/api/licenses/search?${buildApiQuery({ query, counties, types, statuses })}`
          : `/api/licenses?${buildApiQuery({ query, counties, types, statuses })}`

        const res = await fetch(endpoint, { signal })
        if (!res.ok) {
          throw new Error(`Request failed (${res.status})`)
        }
        const json = await res.json()
        const data: LicenseRecord[] = Array.isArray(json.data) ? json.data : []

        // Refine client-side for any multi-select facets the single-value API
        // could not narrow on its own.
        const refined = data.filter((rec) => {
          if (counties.length && !counties.includes(rec.address.county)) return false
          if (types.length && !types.includes(rec.licenseType)) return false
          if (statuses.length && !statuses.includes(rec.status)) return false
          return true
        })

        setResults(refined)
        setCount(refined.length)
      } catch (err) {
        if ((err as Error).name === 'AbortError') return
        setError('Something went wrong fetching results. Please try again.')
        setResults([])
        setCount(0)
      } finally {
        setLoading(false)
      }
    },
    [query, counties, types, statuses]
  )

  useEffect(() => {
    const controller = new AbortController()
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      runSearch(controller.signal)
    }, DEBOUNCE_MS)

    return () => {
      controller.abort()
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [runSearch])

  // --- recent searches persistence ---------------------------------------
  const commitRecent = useCallback((value: string) => {
    const term = value.trim()
    if (!term) return
    setRecent((prev) => {
      const next = [term, ...prev.filter((r) => r.toLowerCase() !== term.toLowerCase())].slice(
        0,
        MAX_RECENT
      )
      writeList(RECENT_KEY, next)
      return next
    })
  }, [])

  const clearRecent = useCallback(() => {
    setRecent([])
    writeList(RECENT_KEY, [])
  }, [])

  // --- facet toggles -----------------------------------------------------
  function toggle(list: string[], value: string, setter: (v: string[]) => void) {
    setter(list.includes(value) ? list.filter((v) => v !== value) : [...list, value])
  }

  const activeFacetCount = counties.length + types.length + statuses.length
  const hasAnyCriteria = query.trim() !== '' || activeFacetCount > 0

  function clearAll() {
    setQuery('')
    setCounties([])
    setTypes([])
    setStatuses([])
    inputRef.current?.focus()
  }

  // --- saved searches ----------------------------------------------------
  const currentSignature = useMemo(
    () =>
      JSON.stringify({
        q: query.trim().toLowerCase(),
        c: [...counties].sort(),
        t: [...types].sort(),
        s: [...statuses].sort(),
      }),
    [query, counties, types, statuses]
  )

  const isCurrentSaved = useMemo(
    () =>
      saved.some(
        (sv) =>
          JSON.stringify({
            q: sv.query.trim().toLowerCase(),
            c: [...sv.counties].sort(),
            t: [...sv.types].sort(),
            s: [...sv.statuses].sort(),
          }) === currentSignature
      ),
    [saved, currentSignature]
  )

  function saveCurrentSearch() {
    if (!hasAnyCriteria || isCurrentSaved) return
    const entry: SavedSearch = {
      id: `sv_${Date.now().toString(36)}`,
      query: query.trim(),
      counties: [...counties],
      types: [...types],
      statuses: [...statuses],
      createdAt: new Date().toISOString(),
    }
    setSaved((prev) => {
      const next = [entry, ...prev].slice(0, 12)
      writeList(SAVED_KEY, next)
      return next
    })
    commitRecent(query)
  }

  function applySaved(sv: SavedSearch) {
    setQuery(sv.query)
    setCounties(sv.counties)
    setTypes(sv.types)
    setStatuses(sv.statuses)
    setShowRecent(false)
  }

  function removeSaved(id: string) {
    setSaved((prev) => {
      const next = prev.filter((s) => s.id !== id)
      writeList(SAVED_KEY, next)
      return next
    })
  }

  function describeSaved(sv: SavedSearch): string {
    const bits: string[] = []
    if (sv.query) bits.push(`“${sv.query}”`)
    if (sv.counties.length) bits.push(sv.counties.join(', '))
    if (sv.types.length)
      bits.push(sv.types.map((t) => getLicenseTypeLabel(t as LicenseType)).join(', '))
    if (sv.statuses.length) bits.push(sv.statuses.join(', '))
    return bits.join(' · ') || 'All records'
  }

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
          {/* ------------------------------------------------ Facet rail */}
          <aside className="flex flex-col gap-6">
            <div className="rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--ls-fg)]">
                  <SlidersHorizontal className="h-4 w-4 text-indigo-400" />
                  Filters
                </span>
                {activeFacetCount > 0 && (
                  <span className="rounded-full bg-indigo-500/15 px-2 py-0.5 text-[11px] font-medium tabular-nums text-indigo-400">
                    {activeFacetCount}
                  </span>
                )}
              </div>

              <FacetGroup label="County">
                {COUNTY_FACETS.map((c) => (
                  <FacetChip
                    key={c}
                    active={counties.includes(c)}
                    onClick={() => toggle(counties, c, setCounties)}
                  >
                    {c}
                  </FacetChip>
                ))}
              </FacetGroup>

              <FacetGroup label="License type">
                {TYPE_FACETS.map((t) => (
                  <FacetChip
                    key={t}
                    active={types.includes(t)}
                    onClick={() => toggle(types, t, setTypes)}
                  >
                    {getLicenseTypeLabel(t)}
                  </FacetChip>
                ))}
              </FacetGroup>

              <FacetGroup label="Status">
                {STATUS_FACETS.map((s) => (
                  <FacetChip
                    key={s}
                    active={statuses.includes(s)}
                    onClick={() => toggle(statuses, s, setStatuses)}
                  >
                    <span className="capitalize">{s}</span>
                  </FacetChip>
                ))}
              </FacetGroup>

              {hasAnyCriteria && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-[var(--ls-fg-3)] transition-colors hover:text-[var(--ls-fg)]"
                >
                  <X className="h-3.5 w-3.5" />
                  Clear all
                </button>
              )}
            </div>

            {/* Saved searches */}
            {saved.length > 0 && (
              <div className="rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-5">
                <span className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--ls-fg)]">
                  <Bookmark className="h-4 w-4 text-indigo-400" />
                  Saved searches
                </span>
                <ul className="flex flex-col gap-2">
                  {saved.map((sv) => (
                    <li key={sv.id} className="group flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => applySaved(sv)}
                        className="flex-1 truncate rounded-md border border-[var(--ls-border)] bg-[var(--ls-surface-2)] px-3 py-2 text-left text-xs text-[var(--ls-fg-2)] transition-colors hover:border-indigo-500/40 hover:text-[var(--ls-fg)]"
                        title={describeSaved(sv)}
                      >
                        {describeSaved(sv)}
                      </button>
                      <button
                        type="button"
                        onClick={() => removeSaved(sv.id)}
                        aria-label="Remove saved search"
                        className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md text-[var(--ls-fg-4)] transition-colors hover:bg-[var(--ls-hover)] hover:text-red-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>

          {/* ------------------------------------------------ Results column */}
          <div className="flex flex-col gap-6">
            {/* Search bar + autocomplete */}
            <div ref={comboRef} className="relative">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ls-fg-3)]" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    role="combobox"
                    aria-expanded={showRecent && recent.length > 0}
                    aria-autocomplete="list"
                    aria-controls="recent-search-list"
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setShowRecent(true)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        commitRecent(query)
                        setShowRecent(false)
                      } else if (e.key === 'Escape') {
                        setShowRecent(false)
                      }
                    }}
                    placeholder="Search businesses, owners, cities, license numbers…"
                    className="w-full rounded-lg border border-[var(--ls-border-2)] bg-[var(--ls-surface)] py-3 pl-10 pr-10 text-sm text-[var(--ls-fg)] outline-none transition-colors placeholder:text-[var(--ls-fg-3)] hover:border-[var(--ls-fg-4)] focus:border-indigo-500/60"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => {
                        setQuery('')
                        inputRef.current?.focus()
                      }}
                      aria-label="Clear search"
                      className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-[var(--ls-fg-3)] transition-colors hover:bg-[var(--ls-hover)] hover:text-[var(--ls-fg)]"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={saveCurrentSearch}
                  disabled={!hasAnyCriteria || isCurrentSaved}
                  className={
                    isCurrentSaved
                      ? 'inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-400 transition-colors'
                      : 'inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--ls-border-2)] bg-[var(--ls-surface)] px-4 py-3 text-sm font-medium text-[var(--ls-fg-2)] transition-colors hover:border-indigo-500/40 hover:text-[var(--ls-fg)] disabled:cursor-not-allowed disabled:opacity-40'
                  }
                >
                  {isCurrentSaved ? (
                    <>
                      <BookmarkCheck className="h-4 w-4" />
                      Saved
                    </>
                  ) : (
                    <>
                      <Bookmark className="h-4 w-4" />
                      Save this search
                    </>
                  )}
                </button>
              </div>

              {/* Recent-searches dropdown */}
              {showRecent && recent.length > 0 && (
                <div
                  id="recent-search-list"
                  role="listbox"
                  className="absolute z-20 mt-2 w-full overflow-hidden rounded-lg border border-[var(--ls-border-2)] bg-[var(--ls-surface)] shadow-xl shadow-black/20 sm:w-[calc(100%-9rem)]"
                >
                  <div className="flex items-center justify-between border-b border-[var(--ls-border)] px-3 py-2">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-widest text-[var(--ls-fg-3)]">
                      <Clock className="h-3 w-3" />
                      Recent
                    </span>
                    <button
                      type="button"
                      onClick={clearRecent}
                      className="text-[11px] font-medium text-[var(--ls-fg-3)] transition-colors hover:text-[var(--ls-fg)]"
                    >
                      Clear
                    </button>
                  </div>
                  <ul>
                    {recent.map((term) => (
                      <li key={term}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={false}
                          onClick={() => {
                            setQuery(term)
                            commitRecent(term)
                            setShowRecent(false)
                            inputRef.current?.focus()
                          }}
                          className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm text-[var(--ls-fg-2)] transition-colors hover:bg-[var(--ls-hover)] hover:text-[var(--ls-fg)]"
                        >
                          <Clock className="h-3.5 w-3.5 flex-shrink-0 text-[var(--ls-fg-4)]" />
                          <span className="truncate">{term}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Result count / status line */}
            <div className="flex min-h-[20px] items-center gap-2 text-sm text-[var(--ls-fg-3)]">
              {loading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-400" />
                  Searching…
                </>
              ) : error ? null : hasSearched ? (
                <span className="tabular-nums">
                  <span className="font-medium text-[var(--ls-fg)]">{count}</span>{' '}
                  {count === 1 ? 'result' : 'results'}
                  {query.trim() && (
                    <>
                      {' '}
                      for <span className="text-[var(--ls-fg-2)]">“{query.trim()}”</span>
                    </>
                  )}
                </span>
              ) : (
                <span>Type a query or pick filters to search the live feed.</span>
              )}
            </div>

            {/* Results / states */}
            {error ? (
              <div className="flex flex-col items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 px-6 py-16 text-center">
                <AlertTriangle className="h-8 w-8 text-red-400" />
                <p className="text-sm font-medium text-[var(--ls-fg)]">{error}</p>
                <button
                  type="button"
                  onClick={() => {
                    const controller = new AbortController()
                    runSearch(controller.signal)
                  }}
                  className="inline-flex items-center justify-center rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-600"
                >
                  Retry
                </button>
              </div>
            ) : loading ? (
              <ul className="flex flex-col gap-3" aria-hidden="true">
                {Array.from({ length: 4 }).map((_, i) => (
                  <li
                    key={i}
                    className="h-[92px] animate-pulse rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)]"
                  />
                ))}
              </ul>
            ) : !hasSearched ? (
              <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-[var(--ls-border-2)] bg-[var(--ls-surface)] px-6 py-16 text-center">
                <Search className="h-8 w-8 text-[var(--ls-fg-4)]" />
                <p className="max-w-sm text-sm text-[var(--ls-fg-3)]">
                  Search across every business name, owner, city, and license number in the live
                  Florida feed. Start typing above, or narrow down with the filters.
                </p>
              </div>
            ) : count === 0 ? (
              <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-[var(--ls-border-2)] bg-[var(--ls-surface)] px-6 py-16 text-center">
                <Search className="h-8 w-8 text-[var(--ls-fg-4)]" />
                <p className="text-sm font-medium text-[var(--ls-fg)]">No matching records</p>
                <p className="max-w-sm text-sm text-[var(--ls-fg-3)]">
                  Nothing matched your search and filters. Try broadening your query or clearing a
                  facet.
                </p>
                {hasAnyCriteria && (
                  <button
                    type="button"
                    onClick={clearAll}
                    className="mt-1 inline-flex items-center gap-1.5 text-xs font-medium text-indigo-400 transition-colors hover:text-indigo-300"
                  >
                    <X className="h-3.5 w-3.5" />
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              <ul className="flex flex-col gap-3">
                {results.map((rec) => (
                  <li key={rec.id}>
                    <div className="group flex flex-col gap-3 rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-5 transition-colors hover:border-[var(--ls-border-2)] hover:bg-[var(--ls-hover)] sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex min-w-0 flex-col gap-1.5">
                        <h3 className="truncate text-sm font-semibold text-[var(--ls-fg)]">
                          <Highlight text={rec.businessName} query={query} />
                        </h3>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--ls-fg-3)]">
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-[var(--ls-fg-4)]" />
                            <Highlight
                              text={`${rec.address.city}, ${rec.address.county}`}
                              query={query}
                            />
                          </span>
                          <span className="font-mono text-[var(--ls-fg-4)]">
                            <Highlight text={rec.licenseNumber} query={query} />
                          </span>
                        </div>
                        {rec.dbaName && (
                          <span className="text-xs text-[var(--ls-fg-4)]">
                            DBA <Highlight text={rec.dbaName} query={query} />
                          </span>
                        )}
                      </div>

                      <div className="flex flex-shrink-0 flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${getLicenseTypeBadgeColor(
                            rec.licenseType
                          )}`}
                        >
                          {rec.licenseType}
                        </span>
                        <span
                          className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${getStatusBadgeColor(
                            rec.status
                          )}`}
                        >
                          {rec.status}
                        </span>
                        <span className="hidden whitespace-nowrap text-xs text-[var(--ls-fg-4)] sm:inline">
                          {formatDate(rec.filedDate, { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {/* Upsell footnote */}
            {hasSearched && count > 0 && !loading && !error && (
              <p className="text-center text-xs text-[var(--ls-fg-4)]">
                Showing the live preview dataset.{' '}
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1 font-medium text-indigo-400 transition-colors hover:text-indigo-300"
                >
                  Get API access
                  <ArrowRight className="h-3 w-3" />
                </Link>{' '}
                to query all 67 counties.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function FacetGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-5 last:mb-0">
      <span className="mb-2.5 block text-[11px] font-medium uppercase tracking-widest text-[var(--ls-fg-3)]">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
}
