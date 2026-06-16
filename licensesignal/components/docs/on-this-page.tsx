'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface TocHeading {
  id: string
  text: string
  level: 2 | 3
}

/**
 * "On this page" right-rail TOC. Scans the rendered docs <article> for h2/h3
 * elements that carry an id, then highlights the section currently in view
 * using an IntersectionObserver (scroll-spy).
 */
export function OnThisPage() {
  const pathname = usePathname()
  const [headings, setHeadings] = useState<TocHeading[]>([])
  const [activeId, setActiveId] = useState<string>('')

  // Re-scan whenever the route (and therefore the rendered article) changes.
  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>('article h2[id], article h3[id]')
    )
    const found: TocHeading[] = nodes.map((node) => ({
      id: node.id,
      text: node.textContent?.trim() ?? '',
      level: node.tagName === 'H3' ? 3 : 2,
    }))
    setHeadings(found)
    setActiveId(found[0]?.id ?? '')
  }, [pathname])

  // Scroll-spy: track which heading is currently in view.
  useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: '0px 0px -70% 0px', threshold: 0 }
    )

    for (const heading of headings) {
      const el = document.getElementById(heading.id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  return (
    <nav aria-label="On this page" className="text-sm">
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--ls-fg-3)]">
        On this page
      </p>
      <ul className="flex flex-col gap-1 border-l border-[var(--ls-border)]">
        {headings.map((heading) => {
          const isActive = heading.id === activeId
          return (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                className={cn(
                  '-ml-px block border-l-2 py-1 leading-5 transition-colors',
                  heading.level === 3 ? 'pl-6' : 'pl-3',
                  isActive
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-[var(--ls-fg-3)] hover:text-[var(--ls-fg-2)]'
                )}
              >
                {heading.text}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
