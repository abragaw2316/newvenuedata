'use client'

import { useEffect, useRef, useState } from 'react'

interface DropdownMenuProps {
  /** The trigger button content. */
  label: React.ReactNode
  /** Accessible label for the trigger. */
  ariaLabel?: string
  /** Render-prop for the panel; receives a `close` callback. */
  children: (close: () => void) => React.ReactNode
  /** Extra classes for the trigger button. */
  triggerClassName?: string
  /** Panel alignment relative to the trigger. */
  align?: 'left' | 'right'
  /** Panel width (Tailwind class). */
  panelClassName?: string
}

/**
 * Lightweight headless dropdown: handles outside-click + Escape close and
 * focus return. Token-styled by the caller. Used for saved views, column
 * controls, and tag menus on the dashboard.
 */
export function DropdownMenu({
  label,
  ariaLabel,
  children,
  triggerClassName,
  align = 'left',
  panelClassName,
}: DropdownMenuProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onPointerDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
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

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={triggerClassName}
      >
        {label}
      </button>
      {open && (
        <div
          role="menu"
          className={`absolute z-30 mt-2 rounded-lg border border-[var(--ls-border-2)] bg-[var(--ls-surface)] p-1.5 shadow-xl shadow-black/20 ${
            align === 'right' ? 'right-0' : 'left-0'
          } ${panelClassName ?? 'w-64'}`}
        >
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  )
}
