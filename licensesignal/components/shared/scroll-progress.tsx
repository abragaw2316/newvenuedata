'use client'

import { useEffect, useState } from 'react'

/**
 * A thin progress bar fixed to the top of the viewport that fills as the user
 * scrolls down the page. Respects prefers-reduced-motion by skipping the
 * smoothing transition.
 */
export function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY
      const height = document.documentElement.scrollHeight - window.innerHeight
      setProgress(height > 0 ? Math.min(scrollTop / height, 1) : 0)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <div className="fixed inset-x-0 top-0 z-[95] h-0.5 bg-transparent" aria-hidden="true">
      <div
        className="h-full origin-left bg-gradient-to-r from-indigo-500 to-violet-500"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  )
}
