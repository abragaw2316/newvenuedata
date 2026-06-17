import { cn } from '@/lib/utils'

interface GradientTextProps {
  children: React.ReactNode
  className?: string
}

// Accent emphasis for headlines. Styling lives in the `.gradient-text` utility
// (a solid ledger-green; was a purple gradient — the classic AI-slop tell).
export function GradientText({ children, className }: GradientTextProps) {
  return <span className={cn('gradient-text', className)}>{children}</span>
}
