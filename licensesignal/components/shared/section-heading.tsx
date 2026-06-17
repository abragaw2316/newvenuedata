'use client'

import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  eyebrow?: string
  heading: string
  subtext?: string
  align?: 'left' | 'center'
  className?: string
}

export function SectionHeading({
  eyebrow,
  heading,
  subtext,
  align = 'center',
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn('flex flex-col gap-4', align === 'center' && 'items-center text-center', className)}>
      {eyebrow && (
        <span className="inline-flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-indigo-700">
          {align === 'center' && <span className="h-px w-6 bg-[var(--ls-border-2)]" />}
          {eyebrow}
          {align === 'center' && <span className="h-px w-6 bg-[var(--ls-border-2)]" />}
        </span>
      )}
      <h2 className="text-display-md text-[var(--ls-fg)] max-w-3xl">{heading}</h2>
      {subtext && (
        <p className={cn('text-lg text-[var(--ls-fg-2)] max-w-2xl', align === 'left' && 'max-w-xl')}>
          {subtext}
        </p>
      )}
    </div>
  )
}
