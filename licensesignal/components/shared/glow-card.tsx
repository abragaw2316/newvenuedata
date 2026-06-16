'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface GlowCardProps {
  children: React.ReactNode
  className?: string
  highlighted?: boolean
}

export function GlowCard({ children, className, highlighted = false }: GlowCardProps) {
  return (
    <motion.div
      whileHover={{ boxShadow: '0 0 40px rgba(99,102,241,0.25)' }}
      transition={{ duration: 0.2 }}
      className={cn(
        'relative rounded-xl border bg-[var(--ls-surface)] p-6 gradient-card',
        highlighted
          ? 'border-indigo-500/40 shadow-[0_0_20px_rgba(99,102,241,0.15)]'
          : 'border-[var(--ls-border)]',
        className
      )}
    >
      {children}
    </motion.div>
  )
}
