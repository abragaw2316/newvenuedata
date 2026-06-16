'use client'

import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

/**
 * Toggles between the dark (default) and light themes by adding/removing the
 * `light` class on <html>. The no-flash script in the root layout sets the
 * initial class before paint; this component only mirrors and updates it.
 */
export function ThemeToggle({ className = '' }: { className?: string }) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setTheme(document.documentElement.classList.contains('light') ? 'light' : 'dark')
  }, [])

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    const root = document.documentElement
    if (next === 'light') root.classList.add('light')
    else root.classList.remove('light')
    try {
      localStorage.setItem('ls-theme', next)
    } catch {
      /* ignore */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-md text-[var(--ls-fg-2)] transition-colors hover:bg-[var(--ls-hover)] hover:text-[var(--ls-fg)] ${className}`}
    >
      {/* Render a stable icon until mounted to avoid hydration mismatch */}
      {!mounted ? (
        <Moon className="h-4 w-4" />
      ) : theme === 'dark' ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </button>
  )
}
