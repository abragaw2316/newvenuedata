'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { MapPin, X } from 'lucide-react'

const SESSION_KEY = 'ls_social_proof_dismissed'

/** Rotating list of plausible, low-key activity notices. */
const NOTICES: { message: string; location: string }[] = [
  { message: 'A distributor just requested API access', location: 'Tampa, FL' },
  { message: 'A sales team started tracking new filings', location: 'Miami, FL' },
  { message: 'A POS vendor exported a county dataset', location: 'Orlando, FL' },
  { message: 'A broker set up a webhook for renewals', location: 'Jacksonville, FL' },
  { message: 'A marketing agency pulled fresh leads', location: 'Fort Lauderdale, FL' },
  { message: 'A linen supplier subscribed to alerts', location: 'St. Petersburg, FL' },
  { message: 'A beverage rep requested a sample export', location: 'Sarasota, FL' },
  { message: 'A restaurant group joined the waitlist', location: 'West Palm Beach, FL' },
]

const FIRST_DELAY = 6000
const VISIBLE_MS = 6000
const INTERVAL_MS = 18000

/**
 * SocialProofToast
 *
 * Periodically surfaces a small, dismissible activity toast in the corner. The
 * cadence is gentle — each notice shows for a few seconds, then hides until the
 * next interval tick. Dismissing it (close button or Escape) silences the toast
 * for the rest of the session.
 */
export function SocialProofToast() {
  const [index, setIndex] = useState(0)
  const [shown, setShown] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const dismiss = useCallback(() => {
    setShown(false)
    setDismissed(true)
    try {
      window.sessionStorage.setItem(SESSION_KEY, '1')
    } catch {
      /* ignore */
    }
  }, [])

  // Respect a prior dismissal for this session.
  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(SESSION_KEY) === '1') {
        setDismissed(true)
      }
    } catch {
      /* ignore */
    }
  }, [])

  // Drive the show/hide cycle on a gentle interval.
  useEffect(() => {
    if (dismissed) return

    const reveal = () => {
      setShown(true)
      if (hideTimer.current) clearTimeout(hideTimer.current)
      hideTimer.current = setTimeout(() => {
        setShown(false)
        setIndex((prev) => (prev + 1) % NOTICES.length)
      }, VISIBLE_MS)
    }

    const firstTimer = setTimeout(reveal, FIRST_DELAY)
    const interval = setInterval(reveal, INTERVAL_MS)

    return () => {
      clearTimeout(firstTimer)
      clearInterval(interval)
      if (hideTimer.current) clearTimeout(hideTimer.current)
    }
  }, [dismissed])

  // Escape silences the toast.
  useEffect(() => {
    if (!shown) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [shown, dismiss])

  if (dismissed || !shown) return null

  const notice = NOTICES[index]

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-4 z-[80] w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-[var(--ls-border-2)] bg-[var(--ls-surface)] p-3.5 shadow-2xl shadow-black/40"
    >
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10">
          <MapPin className="h-4 w-4 text-indigo-400" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-[var(--ls-fg)]">{notice.message}</p>
          <p className="mt-0.5 text-xs text-[var(--ls-fg-3)]">
            {notice.location} · just now
          </p>
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss notification"
          className="flex-shrink-0 rounded-md p-1 text-[var(--ls-fg-3)] transition-colors hover:bg-[var(--ls-hover)] hover:text-[var(--ls-fg)] focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
