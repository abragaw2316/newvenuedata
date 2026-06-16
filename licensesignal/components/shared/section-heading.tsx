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
        <span className="inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium tracking-widest text-indigo-400 uppercase">
          {eyebrow}
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
