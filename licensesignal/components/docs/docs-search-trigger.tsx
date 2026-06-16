'use client'

import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'

/**
 * A small "Search ⌘K" button for the docs sidebar. The CommandPalette listens
 * on the window for the Cmd/Ctrl+K shortcut, so this trigger simply dispatches
 * that same keydown event to open it.
 */
export function DocsSearchTrigger() {
  const [isMac, setIsMac] = useState(false)

  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad|iPod/i.test(navigator.platform || navigator.userAgent))
  }, [])

  const openPalette = () => {
    window.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'k', metaKey: true, ctrlKey: true, bubbles: true })
    )
  }

  return (
    <button
      type="button"
      onClick={openPalette}
      aria-label="Search docs"
      className="flex w-full items-center gap-2 rounded-md border border-[var(--ls-border)] bg-[var(--ls-surface-2)] px-2.5 py-2 text-sm text-[var(--ls-fg-3)] transition-colors hover:border-[var(--ls-border-2)] hover:bg-[var(--ls-hover)] hover:text-[var(--ls-fg-2)]"
    >
      <Search className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
      <span className="flex-1 text-left">Search</span>
      <kbd className="inline-flex h-5 items-center rounded border border-[var(--ls-border-2)] bg-[var(--ls-bg)] px-1.5 font-sans text-xs text-[var(--ls-fg-3)]">
        {isMac ? '⌘' : 'Ctrl'}K
      </kbd>
    </button>
  )
}
