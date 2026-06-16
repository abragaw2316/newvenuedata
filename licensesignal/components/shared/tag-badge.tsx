import { cn } from '@/lib/utils'

interface TagBadgeProps {
  variant?: 'new' | 'live' | 'beta' | 'pro' | 'default'
  children: React.ReactNode
  className?: string
}

const variants = {
  new: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  live: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/20',
  beta: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  pro: 'bg-violet-500/15 text-violet-400 border-violet-500/20',
  default: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/20',
}

export function TagBadge({ variant = 'default', children, className }: TagBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        variants[variant],
        variant === 'live' && 'animate-pulseGlow',
        className
      )}
    >
      {variant === 'live' && (
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-indigo-400" />
      )}
      {children}
    </span>
  )
}
