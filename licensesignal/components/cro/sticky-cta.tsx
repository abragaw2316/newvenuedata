'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, X } from 'lucide-react'

const SESSION_KEY = 'ls_sticky_cta_dismissed'
const SCROLL_THRESHOLD = 600

interface StickyCtaProps {
  /** Where the sticky bar should dock. Defaults to the bottom of the viewport. */
  position?: 'top' | 'bottom'
  message?: string
  ctaLabel?: string
  href?: string
}

/**
 * StickyCta
 *
 * A slim sticky bar that slides in once the visitor scrolls past ~600px and
 * drives them to /signup. Dismissible — once closed it stays gone for the rest
 * of the session (sessionStorage). Respects the Escape key while visible.
 */
export function StickyCta({
  position = 'bottom',
  message = 'Start tracking new Florida filings in real time.',
  ctaLabel = 'Get API access',
  href = '/signup',
}: StickyCtaProps) {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  const dismiss = useCallback(() => {
    setVisible(false)
    setDismissed(true)
    try {
      window.sessionStorage.setItem(SESSION_KEY, '1')
    } catch {
      /* sessionStorage unavailable — ignore */
    }
  }, [])

  // Read the dismissed flag once on mount.
  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(SESSION_KEY) === '1') {
        setDismissed(true)
      }
    } catch {
      /* ignore */
    }
  }, [])

  // Toggle visibility on scroll once past the threshold.
  useEffect(() => {
    if (dismissed) return

    const onScroll = () => {
      setVisible(window.scrollY > SCROLL_THRESHOLD)
    }
    onScroll() // handle the case where the page loads already scrolled
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [dismissed])

  // Escape dismisses the bar while it's on screen.
  useEffect(() => {
    if (!visible) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [visible, dismiss])

  if (dismissed || !visible) return null

  const dockClasses =
    position === 'top'
      ? 'top-0 border-b'
      : 'bottom-0 border-t'

  return (
    <div
      role="region"
      aria-label="Call to action"
      className={`fixed inset-x-0 z-[90] ${dockClasses} border-[var(--ls-border-2)] bg-[color-mix(in_srgb,var(--ls-surface)_92%,transparent)] backdrop-blur-md`}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5 sm:px-6 lg:px-8">
        <span
          aria-hidden="true"
          className="hidden h-2 w-2 flex-shrink-0 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)] sm:block"
        />
        <p className="min-w-0 flex-1 truncate text-sm text-[var(--ls-fg-2)]">
          <span className="font-medium text-[var(--ls-fg)]">{message}</span>
        </p>
        <Link
          href={href}
          className="inline-flex flex-shrink-0 items-center justify-center gap-1.5 rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-600"
        >
          {ctaLabel}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          className="flex-shrink-0 rounded-md p-1.5 text-[var(--ls-fg-3)] transition-colors hover:bg-[var(--ls-hover)] hover:text-[var(--ls-fg)] focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
