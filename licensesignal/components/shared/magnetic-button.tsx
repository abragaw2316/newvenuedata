'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { cn } from '@/lib/utils'

interface MagneticButtonProps {
  href: string
  children: React.ReactNode
  className?: string
}

// Max distance (px) the button drifts toward the cursor.
const MAX_TRANSLATE = 6

export function MagneticButton({ href, children, className }: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 300, damping: 20, mass: 0.5 })
  const springY = useSpring(y, { stiffness: 300, damping: 20, mass: 0.5 })

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    // Offset of cursor from the element center, normalized to [-1, 1].
    const relX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)
    const relY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)
    x.set(Math.max(-1, Math.min(1, relX)) * MAX_TRANSLATE)
    y.set(Math.max(-1, Math.min(1, relY)) * MAX_TRANSLATE)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div style={{ x: springX, y: springY, display: 'inline-flex' }}>
      <Link
        ref={ref}
        href={href}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={cn(
          'inline-flex items-center justify-center rounded-md bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium px-5 py-2.5 transition-colors',
          className
        )}
      >
        {children}
      </Link>
    </motion.div>
  )
}
