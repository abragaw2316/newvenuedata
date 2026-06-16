'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Bell,
  BellRing,
  Check,
  CheckCheck,
  FileText,
  KeyRound,
  AlertTriangle,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const STORAGE_KEY = 'ls-notifications-read'

type NotificationKind = 'filing' | 'webhook' | 'key'

interface NotificationItem {
  id: string
  kind: NotificationKind
  title: string
  body: string
  /** Relative time label, e.g. "2m ago" — mock data, no live clock. */
  time: string
}

/** Mock notification feed. Newest first. */
const NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n-1',
    kind: 'filing',
    title: 'New filing matched your rule',
    body: 'A new COP filing in Miami-Dade matched "Full-bar restaurants — South FL". Brickell Social House LLC.',
    time: '2m ago',
  },
  {
    id: 'n-2',
    kind: 'filing',
    title: 'New filing matched your rule',
    body: 'An SRX special restaurant license was filed in Orange County by Lakeside Hospitality Group.',
    time: '18m ago',
  },
  {
    id: 'n-3',
    kind: 'webhook',
    title: 'Webhook delivery failed',
    body: 'Your endpoint https://api.acme.co/hooks returned 503 on 3 retries. Deliveries are paused until it recovers.',
    time: '1h ago',
  },
  {
    id: 'n-4',
    kind: 'key',
    title: 'API key expiring soon',
    body: 'Key "prod-ingest-2025" expires in 6 days. Rotate it from Settings → API Keys to avoid an outage.',
    time: '5h ago',
  },
  {
    id: 'n-5',
    kind: 'filing',
    title: 'New filing matched your rule',
    body: 'A BEV beer & wine license was filed in Hillsborough by Tampa Heights Provisions.',
    time: 'Yesterday',
  },
  {
    id: 'n-6',
    kind: 'webhook',
    title: 'Webhook recovered',
    body: 'Your endpoint https://hooks.zapier.com/… is delivering again. 4 queued events were flushed.',
    time: 'Yesterday',
  },
]

type FilterKey = 'all' | 'unread' | NotificationKind

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'unread', label: 'Unread' },
  { key: 'filing', label: 'Filings' },
  { key: 'webhook', label: 'Webhooks' },
  { key: 'key', label: 'Keys' },
]

const KIND_META: Record<
  NotificationKind,
  { icon: typeof FileText; tint: string; ring: string }
> = {
  filing: {
    icon: FileText,
    tint: 'text-indigo-400',
    ring: 'bg-indigo-500/15 border-indigo-500/20',
  },
  webhook: {
    icon: AlertTriangle,
    tint: 'text-amber-400',
    ring: 'bg-amber-500/15 border-amber-500/20',
  },
  key: {
    icon: KeyRound,
    tint: 'text-violet-400',
    ring: 'bg-violet-500/15 border-violet-500/20',
  },
}

function readReadSet(): Record<string, true> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as unknown
    if (parsed && typeof parsed === 'object') {
      return parsed as Record<string, true>
    }
  } catch {
    // ignore malformed storage
  }
  return {}
}

interface NotificationCenterProps {
  /** Render the bell inline (in a panel) rather than as a floating button. */
  inline?: boolean
  className?: string
}

export function NotificationCenter({ inline = false, className }: NotificationCenterProps) {
  const [read, setRead] = useState<Record<string, true>>({})
  const [hydrated, setHydrated] = useState(false)
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState<FilterKey>('all')
  const containerRef = useRef<HTMLDivElement>(null)

  // Hydrate persisted read-state once on mount.
  useEffect(() => {
    setRead(readReadSet())
    setHydrated(true)
  }, [])

  // Persist whenever read-state changes (after hydration so we never clobber storage).
  useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(read))
    } catch {
      // storage may be unavailable (private mode) — fail silently
    }
  }, [read, hydrated])

  // Close on outside click and on Escape.
  useEffect(() => {
    if (!open) return
    function onPointerDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const unreadCount = useMemo(
    () => (hydrated ? NOTIFICATIONS.filter((n) => !read[n.id]).length : 0),
    [read, hydrated]
  )

  const visible = useMemo(() => {
    return NOTIFICATIONS.filter((n) => {
      if (filter === 'all') return true
      if (filter === 'unread') return !read[n.id]
      return n.kind === filter
    })
  }, [filter, read])

  function markRead(id: string) {
    setRead((prev) => (prev[id] ? prev : { ...prev, [id]: true }))
  }

  function markAllRead() {
    setRead(() => {
      const next: Record<string, true> = {}
      for (const n of NOTIFICATIONS) next[n.id] = true
      return next
    })
  }

  function markAllUnread() {
    setRead({})
  }

  const panel = (
    <div
      className={cn(
        'flex w-full flex-col overflow-hidden rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] shadow-2xl shadow-black/20',
        !inline &&
          'absolute right-0 top-full z-50 mt-2 w-[22rem] max-w-[calc(100vw-2rem)] sm:w-96'
      )}
      role="dialog"
      aria-label="Notifications"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-[var(--ls-border)] px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-[var(--ls-fg)]">Notifications</span>
          {unreadCount > 0 && (
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-500/15 px-1.5 text-xs font-medium text-indigo-400">
              {unreadCount} new
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={unreadCount > 0 ? markAllRead : markAllUnread}
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-[var(--ls-fg-2)] transition-colors hover:bg-[var(--ls-hover)] hover:text-[var(--ls-fg)]"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            {unreadCount > 0 ? 'Mark all read' : 'Mark all unread'}
          </button>
          {!inline && (
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close notifications"
              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[var(--ls-fg-3)] transition-colors hover:bg-[var(--ls-hover)] hover:text-[var(--ls-fg)]"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-1.5 border-b border-[var(--ls-border)] px-3 py-2.5">
        {FILTERS.map((f) => {
          const active = filter === f.key
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={cn(
                'rounded-full border px-2.5 py-1 text-xs font-medium transition-colors',
                active
                  ? 'border-indigo-500/30 bg-indigo-500/15 text-indigo-400'
                  : 'border-[var(--ls-border)] text-[var(--ls-fg-3)] hover:bg-[var(--ls-hover)] hover:text-[var(--ls-fg-2)]'
              )}
            >
              {f.label}
            </button>
          )
        })}
      </div>

      {/* List */}
      <div className="max-h-[26rem] divide-y divide-[var(--ls-border)] overflow-y-auto">
        {visible.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-4 py-12 text-center">
            <Bell className="h-6 w-6 text-[var(--ls-fg-4)]" />
            <p className="text-sm text-[var(--ls-fg-3)]">
              {filter === 'unread' ? "You're all caught up." : 'Nothing here yet.'}
            </p>
          </div>
        ) : (
          visible.map((n) => {
            const meta = KIND_META[n.kind]
            const Icon = meta.icon
            const isRead = hydrated && read[n.id]
            return (
              <div
                key={n.id}
                className={cn(
                  'group relative flex gap-3 px-4 py-3 transition-colors hover:bg-[var(--ls-hover)]',
                  !isRead && 'bg-[color-mix(in_srgb,var(--ls-surface-2)_60%,transparent)]'
                )}
              >
                <div
                  className={cn(
                    'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border',
                    meta.ring
                  )}
                >
                  <Icon className={cn('h-4 w-4', meta.tint)} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-[var(--ls-fg)]">{n.title}</p>
                    <span className="shrink-0 text-xs text-[var(--ls-fg-4)]">{n.time}</span>
                  </div>
                  <p className="mt-0.5 text-xs leading-relaxed text-[var(--ls-fg-2)]">{n.body}</p>
                </div>
                {!isRead ? (
                  <button
                    type="button"
                    onClick={() => markRead(n.id)}
                    aria-label="Mark as read"
                    title="Mark as read"
                    className="absolute right-3 top-3 inline-flex h-6 w-6 items-center justify-center rounded-md text-[var(--ls-fg-4)] opacity-0 transition-all hover:bg-[var(--ls-surface)] hover:text-indigo-400 group-hover:opacity-100"
                  >
                    <Check className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <span
                    aria-hidden
                    className="absolute right-4 top-4 h-1.5 w-1.5 rounded-full bg-transparent"
                  />
                )}
                {!isRead && (
                  <span
                    aria-hidden
                    className="absolute left-1.5 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-indigo-400"
                  />
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )

  // Inline mode: render the panel directly (used inside the alerts page panel).
  if (inline) {
    return <div className={cn('w-full', className)}>{panel}</div>
  }

  // Floating mode: bell button toggles the dropdown.
  return (
    <div ref={containerRef} className={cn('relative inline-block', className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={
          unreadCount > 0 ? `Notifications, ${unreadCount} unread` : 'Notifications'
        }
        aria-expanded={open}
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--ls-border)] bg-[var(--ls-surface)] text-[var(--ls-fg-2)] transition-colors hover:border-[var(--ls-border-2)] hover:text-[var(--ls-fg)]"
      >
        {unreadCount > 0 ? (
          <BellRing className="h-5 w-5" />
        ) : (
          <Bell className="h-5 w-5" />
        )}
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-[var(--ls-bg)] bg-indigo-500 px-1 text-[10px] font-semibold leading-none text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      {open && panel}
    </div>
  )
}
