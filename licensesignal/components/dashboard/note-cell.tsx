'use client'

import { useEffect, useRef, useState } from 'react'
import { StickyNote, NotebookPen } from 'lucide-react'

interface NoteCellProps {
  note: string
  businessName: string
  onChange: (note: string) => void
}

/**
 * Inline note editor for a table row. Renders a button summarizing the note;
 * clicking opens a small popover with a textarea. Clicks inside stop
 * propagation so the row's own click handler (open drawer) doesn't fire.
 */
export function NoteCell({ note, businessName, onChange }: NoteCellProps) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(note)
  const rootRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Keep the draft in sync if the underlying note changes while closed.
  useEffect(() => {
    if (!open) setDraft(note)
  }, [note, open])

  useEffect(() => {
    if (!open) return
    textareaRef.current?.focus()
    function onPointerDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        commit()
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setDraft(note)
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, note])

  function commit() {
    const trimmed = draft.trim()
    if (trimmed !== note) onChange(trimmed)
    setOpen(false)
  }

  const hasNote = note.trim() !== ''

  return (
    <div ref={rootRef} className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        aria-label={hasNote ? `Edit note for ${businessName}` : `Add note for ${businessName}`}
        onClick={() => setOpen((o) => !o)}
        title={hasNote ? note : 'Add note'}
        className={`inline-flex max-w-[160px] items-center gap-1.5 rounded-md border px-2 py-1 text-xs transition-colors ${
          hasNote
            ? 'border-amber-500/25 bg-amber-500/10 text-amber-400 hover:bg-amber-500/15'
            : 'border-dashed border-[var(--ls-border-2)] text-[var(--ls-fg-3)] hover:border-indigo-500/40 hover:text-[var(--ls-fg-2)]'
        }`}
      >
        {hasNote ? (
          <>
            <StickyNote className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{note}</span>
          </>
        ) : (
          <>
            <NotebookPen className="h-3 w-3 flex-shrink-0" />
            Add note
          </>
        )}
      </button>

      {open && (
        <div className="absolute left-0 top-full z-30 mt-1.5 w-64 rounded-lg border border-[var(--ls-border-2)] bg-[var(--ls-surface)] p-2 shadow-xl shadow-black/20">
          <textarea
            ref={textareaRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                commit()
              }
            }}
            rows={3}
            placeholder="Add a private note…"
            className="w-full resize-none rounded-md border border-[var(--ls-border-2)] bg-[var(--ls-surface-2)] px-2.5 py-2 text-sm text-[var(--ls-fg)] outline-none transition-colors placeholder:text-[var(--ls-fg-3)] focus:border-indigo-500/60"
          />
          <div className="mt-1.5 flex items-center justify-between">
            <span className="text-[10px] text-[var(--ls-fg-4)]">⌘↵ to save</span>
            <button
              type="button"
              onClick={commit}
              className="rounded-md bg-indigo-500 px-2.5 py-1 text-xs font-medium text-white transition-colors hover:bg-indigo-600"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
