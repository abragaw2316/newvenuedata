'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Download } from 'lucide-react'
import { DOCS_NAV } from '@/lib/docs-nav'
import { cn } from '@/lib/utils'
import type { DocsNavItem } from '@/lib/types'

function NavItem({ item, depth = 0 }: { item: DocsNavItem; depth?: number }) {
  const pathname = usePathname()
  const href = item.slug ? `/docs/${item.slug}` : undefined
  const isActive = href ? pathname === href : false

  if (item.children) {
    return (
      <div className={cn('flex flex-col gap-0.5', depth > 0 && 'ml-3 border-l border-[var(--ls-border)] pl-3')}>
        <p className="mb-1 mt-3 text-[10px] font-semibold uppercase tracking-widest text-[var(--ls-fg-3)] first:mt-0">
          {item.title}
        </p>
        {item.children.map((child) => (
          <NavItem key={child.title} item={child} depth={depth + 1} />
        ))}
      </div>
    )
  }

  if (!href) return null

  return (
    <Link
      href={href}
      className={cn(
        'block rounded-md px-2.5 py-1.5 text-sm transition-colors',
        isActive
          ? 'border-l-2 border-indigo-500 bg-indigo-500/10 text-indigo-400 pl-[10px]'
          : 'text-[var(--ls-fg-2)] hover:text-[var(--ls-fg)] hover:bg-[var(--ls-hover)]'
      )}
    >
      {item.title}
    </Link>
  )
}

export function DocsSidebar() {
  return (
    <nav className="flex flex-col gap-0.5 py-4 px-3">
      {DOCS_NAV.map((item) => (
        <NavItem key={item.title} item={item} />
      ))}

      <div className="mt-4 border-t border-[var(--ls-border)] pt-4">
        <a
          href="/openapi.json"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm text-[var(--ls-fg-2)] transition-colors hover:bg-[var(--ls-hover)] hover:text-[var(--ls-fg)]"
        >
          <Download className="h-3.5 w-3.5 text-[var(--ls-fg-3)]" />
          OpenAPI Spec
        </a>
      </div>
    </nav>
  )
}
