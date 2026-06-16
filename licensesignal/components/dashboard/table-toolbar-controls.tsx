'use client'

import { Rows3, Rows4, Star } from 'lucide-react'
import type { Density } from '@/components/dashboard/dashboard-types'

export function DensityToggle({
  density,
  onChange,
}: {
  density: Density
  onChange: (d: Density) => void
}) {
  const options: { value: Density; label: string; Icon: typeof Rows3 }[] = [
    { value: 'comfortable', label: 'Comfortable', Icon: Rows3 },
    { value: 'compact', label: 'Compact', Icon: Rows4 },
  ]
  return (
    <div
      role="group"
      aria-label="Row density"
      className="inline-flex items-center rounded-md border border-[var(--ls-border-2)] p-0.5"
    >
      {options.map(({ value, label, Icon }) => {
        const active = density === value
        return (
          <button
            key={value}
            type="button"
            aria-label={label}
            aria-pressed={active}
            title={label}
            onClick={() => onChange(value)}
            className={`flex h-7 w-7 items-center justify-center rounded transition-colors ${
              active
                ? 'bg-indigo-500/15 text-indigo-400'
                : 'text-[var(--ls-fg-3)] hover:bg-[var(--ls-hover)] hover:text-[var(--ls-fg-2)]'
            }`}
          >
            <Icon className="h-4 w-4" />
          </button>
        )
      })}
    </div>
  )
}

export function PinnedFilterToggle({
  active,
  count,
  onToggle,
}: {
  active: boolean
  count: number
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onToggle}
      className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
        active
          ? 'border-amber-500/40 bg-amber-500/10 text-amber-400'
          : 'border-[var(--ls-border-2)] text-[var(--ls-fg-2)] hover:border-amber-500/40 hover:text-[var(--ls-fg)]'
      }`}
    >
      <Star className={`h-3.5 w-3.5 ${active ? 'fill-amber-400' : ''}`} />
      Pinned
      {count > 0 && (
        <span
          className={`ml-0.5 rounded-full px-1.5 text-[10px] tabular-nums ${
            active ? 'bg-amber-500/20 text-amber-300' : 'bg-[var(--ls-surface-2)] text-[var(--ls-fg-3)]'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  )
}
