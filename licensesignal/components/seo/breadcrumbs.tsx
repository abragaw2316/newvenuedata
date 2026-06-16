import Link from 'next/link'
import { absoluteUrl } from '@/lib/seo'

export interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbsProps {
  /** Ordered trail from the site root to the current page. */
  items: BreadcrumbItem[]
  className?: string
}

/**
 * Token-colored visual breadcrumb trail that also emits a schema.org
 * BreadcrumbList JSON-LD block. The final item is rendered as plain
 * (non-link) current-page text. Server-component friendly (no client hooks).
 */
export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  if (items.length === 0) return null

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: absoluteUrl(item.href),
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <nav aria-label="Breadcrumb" className={className}>
        <ol className="flex flex-wrap items-center gap-2 text-xs text-[var(--ls-fg-3)]">
          {items.map((item, index) => {
            const isLast = index === items.length - 1
            return (
              <li key={item.href} className="flex items-center gap-2">
                {isLast ? (
                  <span className="text-[var(--ls-fg-2)]" aria-current="page">
                    {item.label}
                  </span>
                ) : (
                  <>
                    <Link
                      href={item.href}
                      className="transition-colors hover:text-[var(--ls-fg-2)]"
                    >
                      {item.label}
                    </Link>
                    <span className="text-[var(--ls-fg-4)]" aria-hidden="true">
                      /
                    </span>
                  </>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}
