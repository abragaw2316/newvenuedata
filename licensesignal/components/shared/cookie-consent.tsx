'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Cookie, X } from 'lucide-react'

const STORAGE_KEY = 'ls-cookie-consent'

export function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true)
    } catch {
      // localStorage unavailable (e.g. privacy mode) — don't block the page.
    }
  }, [])

  const decide = (choice: 'accepted' | 'rejected') => {
    try {
      localStorage.setItem(STORAGE_KEY, choice)
    } catch {
      /* ignore */
    }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-[90] p-3 sm:p-4">
      <div className="mx-auto flex max-w-3xl flex-col gap-3 rounded-xl border border-[var(--ls-border-2)] bg-[color-mix(in_srgb,var(--ls-surface)_95%,transparent)] p-4 shadow-[0_8px_40px_rgba(0,0,0,0.5)] backdrop-blur sm:flex-row sm:items-center sm:gap-4">
        <div className="flex items-start gap-3">
          <Cookie className="mt-0.5 h-5 w-5 flex-shrink-0 text-indigo-400" />
          <p className="text-xs leading-relaxed text-[var(--ls-fg-2)]">
            We use essential cookies to run the site and optional analytics to improve it. See our{' '}
            <Link href="/privacy" className="text-indigo-400 hover:text-indigo-300 transition-colors">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
        <div className="flex flex-shrink-0 items-center gap-2 sm:ml-auto">
          <button
            onClick={() => decide('rejected')}
            className="rounded-md border border-[var(--ls-border-2)] px-3 py-1.5 text-xs font-medium text-[var(--ls-fg-2)] transition-colors hover:text-[var(--ls-fg)]"
          >
            Reject non-essential
          </button>
          <button
            onClick={() => decide('accepted')}
            className="rounded-md bg-indigo-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-indigo-600"
          >
            Accept all
          </button>
          <button
            onClick={() => decide('rejected')}
            aria-label="Dismiss"
            className="rounded-md p-1 text-[var(--ls-fg-3)] transition-colors hover:text-[var(--ls-fg)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
