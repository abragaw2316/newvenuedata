'use client'

import { motion } from 'framer-motion'

/**
 * Wraps each route's content and fades it in on navigation. Deliberately
 * opacity-only: a transform would establish a containing block and break
 * position: fixed descendants (e.g. the dashboard detail drawer). The global
 * CSS reduced-motion rule neutralizes this for users who prefer no motion.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
