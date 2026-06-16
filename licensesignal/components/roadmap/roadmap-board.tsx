'use client'

import { useEffect, useMemo, useState } from 'react'
import { ChevronUp, Lightbulb, Hammer, CheckCircle2 } from 'lucide-react'
import { TagBadge } from '@/components/shared/tag-badge'
import { cn } from '@/lib/utils'
import {
  ROADMAP_ITEMS,
  ROADMAP_CATEGORIES,
  type RoadmapItem,
  type RoadmapStatus,
} from '@/lib/roadmap'

const STORAGE_KEY = 'ls-roadmap-votes'

const COLUMNS: {
  status: RoadmapStatus
  label: string
  badge: 'beta' | 'live' | 'new'
  icon: typeof Lightbulb
}[] = [
  { status: 'planned', label: 'Planned', badge: 'beta', icon: Lightbulb },
  { status: 'in_progress', label: 'In Progress', badge: 'live', icon: Hammer },
  { status: 'shipped', label: 'Shipped', badge: 'new', icon: CheckCircle2 },
]

const STATUS_BADGE_LABEL: Record<RoadmapStatus, string> = {
  planned: 'Planned',
  in_progress: 'In Progress',
  shipped: 'Shipped',
}

function readVotes(): Record<string, boolean> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as unknown
    if (parsed && typeof parsed === 'object') {
      return parsed as Record<string, boolean>
    }
  } catch {
    // ignore malformed storage
  }
  return {}
}

export function RoadmapBoard() {
  const [voted, setVoted] = useState<Record<string, boolean>>({})
  const [hydrated, setHydrated] = useState(false)
  const [category, setCategory] = useState<string>('all')

  // Hydrate persisted votes once on mount.
  useEffect(() => {
    setVoted(readVotes())
    setHydrated(true)
  }, [])

  // Persist whenever votes change (after hydration so we never clobber storage).
  useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(voted))
    } catch {
      // storage may be unavailable (private mode) — fail silently
    }
  }, [voted, hydrated])

  function toggleVote(id: string) {
    setVoted((prev) => {
      const next = { ...prev }
      if (next[id]) {
        delete next[id]
      } else {
        next[id] = true
      }
      return next
    })
  }

  const filtered = useMemo<RoadmapItem[]>(() => {
    if (category === 'all') return ROADMAP_ITEMS
    return ROADMAP_ITEMS.filter((item) => item.category === category)
  }, [category])

  const byStatus = useMemo(() => {
    const map: Record<RoadmapStatus, RoadmapItem[]> = {
      planned: [],
      in_progress: [],
      shipped: [],
    }
    for (const item of filtered) map[item.status].push(item)
    // Sort each column by effective vote count, descending.
    for (const key of Object.keys(map) as RoadmapStatus[]) {
      map[key].sort(
        (a, b) =>
          b.votes + (voted[b.id] ? 1 : 0) - (a.votes + (voted[a.id] ? 1 : 0))
      )
    }
    return map
  }, [filtered, voted])

  const filters = ['all', ...ROADMAP_CATEGORIES]

  return (
    <div className="flex flex-col gap-8">
      {/* Category filter */}
      <div className="flex flex-wrap items-center gap-2">
        {filters.map((cat) => {
          const active = category === cat
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              aria-pressed={active}
              className={cn(
                'rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors',
                active
                  ? 'border-indigo-500/40 bg-indigo-500/15 text-indigo-400'
                  : 'border-[var(--ls-border)] bg-[var(--ls-surface)] text-[var(--ls-fg-3)] hover:border-[var(--ls-border-2)] hover:text-[var(--ls-fg-2)]'
              )}
            >
              {cat === 'all' ? 'All' : cat}
            </button>
          )
        })}
      </div>

      {/* Columns */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {COLUMNS.map((col) => {
          const items = byStatus[col.status]
          const Icon = col.icon
          return (
            <div key={col.status} className="flex flex-col gap-4">
              {/* Column header */}
              <div className="flex items-center justify-between rounded-lg border border-[var(--ls-border)] bg-[var(--ls-surface-2)] px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-indigo-500/20 bg-indigo-500/10">
                    <Icon className="h-3.5 w-3.5 text-indigo-400" />
                  </div>
                  <span className="text-sm font-semibold text-[var(--ls-fg)]">
                    {col.label}
                  </span>
                </div>
                <span className="rounded-full bg-[var(--ls-hover)] px-2 py-0.5 text-xs font-medium text-[var(--ls-fg-3)]">
                  {items.length}
                </span>
              </div>

              {/* Cards */}
              <div className="flex flex-col gap-4">
                {items.length === 0 && (
                  <div className="rounded-xl border border-dashed border-[var(--ls-border)] bg-[var(--ls-surface)] px-4 py-8 text-center text-sm text-[var(--ls-fg-4)]">
                    Nothing here for this category.
                  </div>
                )}

                {items.map((item) => {
                  const hasVoted = !!voted[item.id]
                  const count = item.votes + (hasVoted ? 1 : 0)
                  return (
                    <div
                      key={item.id}
                      className="flex gap-3 rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-4 transition-colors hover:border-[var(--ls-border-2)]"
                    >
                      {/* Upvote button */}
                      <button
                        type="button"
                        onClick={() => toggleVote(item.id)}
                        aria-pressed={hasVoted}
                        aria-label={
                          hasVoted
                            ? `Remove your vote for ${item.title}`
                            : `Upvote ${item.title}`
                        }
                        className={cn(
                          'flex h-14 w-12 shrink-0 flex-col items-center justify-center rounded-lg border text-xs font-semibold transition-all',
                          hasVoted
                            ? 'border-indigo-500/40 bg-indigo-500/15 text-indigo-400'
                            : 'border-[var(--ls-border)] bg-[var(--ls-surface-2)] text-[var(--ls-fg-3)] hover:border-indigo-500/40 hover:text-indigo-400'
                        )}
                      >
                        <ChevronUp
                          className={cn(
                            'h-4 w-4 transition-transform',
                            hasVoted && '-translate-y-px'
                          )}
                        />
                        <span className="tabular-nums" suppressHydrationWarning>
                          {count}
                        </span>
                      </button>

                      {/* Body */}
                      <div className="flex min-w-0 flex-col gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <TagBadge variant={col.badge}>
                            {STATUS_BADGE_LABEL[item.status]}
                          </TagBadge>
                          <span className="text-xs text-[var(--ls-fg-4)]">
                            {item.category}
                          </span>
                        </div>
                        <h3 className="text-sm font-semibold leading-snug text-[var(--ls-fg)]">
                          {item.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-[var(--ls-fg-3)]">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      <p className="text-xs text-[var(--ls-fg-4)]">
        Votes are stored privately in your browser to keep your picks between
        visits — no account needed.
      </p>
    </div>
  )
}
