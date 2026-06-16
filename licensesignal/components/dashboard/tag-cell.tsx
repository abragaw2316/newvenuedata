'use client'

import { X } from 'lucide-react'
import { tagColor } from '@/components/dashboard/dashboard-types'

interface TagCellProps {
  tags: string[]
  onRemove: (tag: string) => void
}

export function TagCell({ tags, onRemove }: TagCellProps) {
  if (tags.length === 0) {
    return <span className="text-xs text-[var(--ls-fg-4)]">—</span>
  }

  return (
    <div
      className="flex max-w-[200px] flex-wrap gap-1"
      onClick={(e) => e.stopPropagation()}
    >
      {tags.map((tag) => (
        <span
          key={tag}
          className={`group inline-flex items-center gap-0.5 rounded-full border py-0.5 pl-2 pr-1 text-xs font-medium ${tagColor(
            tag
          )}`}
        >
          <span className="truncate">{tag}</span>
          <button
            type="button"
            aria-label={`Remove tag ${tag}`}
            onClick={() => onRemove(tag)}
            className="flex h-3.5 w-3.5 items-center justify-center rounded-full opacity-60 transition-opacity hover:opacity-100"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
    </div>
  )
}
