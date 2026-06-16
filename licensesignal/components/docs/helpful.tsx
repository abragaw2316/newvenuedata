'use client'

import { useState } from 'react'
import { ThumbsUp, ThumbsDown } from 'lucide-react'

export function Helpful() {
  const [submitted, setSubmitted] = useState(false)

  if (submitted) {
    return (
      <div className="mt-12 border-t border-[var(--ls-border)] pt-6">
        <p className="text-sm text-[var(--ls-fg-2)]">Thanks for your feedback!</p>
      </div>
    )
  }

  return (
    <div className="mt-12 flex flex-wrap items-center gap-3 border-t border-[var(--ls-border)] pt-6">
      <span className="text-sm text-[var(--ls-fg-2)]">Was this page helpful?</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setSubmitted(true)}
          className="inline-flex items-center gap-1.5 rounded-md border border-[var(--ls-border-2)] bg-[var(--ls-surface-2)] px-3 py-1.5 text-sm font-medium text-[var(--ls-fg-2)] transition-colors hover:bg-[var(--ls-hover)] hover:text-[var(--ls-fg)]"
        >
          <ThumbsUp className="h-3.5 w-3.5" />
          Yes
        </button>
        <button
          type="button"
          onClick={() => setSubmitted(true)}
          className="inline-flex items-center gap-1.5 rounded-md border border-[var(--ls-border-2)] bg-[var(--ls-surface-2)] px-3 py-1.5 text-sm font-medium text-[var(--ls-fg-2)] transition-colors hover:bg-[var(--ls-hover)] hover:text-[var(--ls-fg)]"
        >
          <ThumbsDown className="h-3.5 w-3.5" />
          No
        </button>
      </div>
    </div>
  )
}
