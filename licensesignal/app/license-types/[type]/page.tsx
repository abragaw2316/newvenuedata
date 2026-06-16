import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Wine, UtensilsCrossed, Beer, Package, Truck, ArrowRight } from 'lucide-react'
import { TagBadge } from '@/components/shared/tag-badge'
import { CtaBanner } from '@/components/sections/cta-banner'
import {
  LICENSE_TYPES,
  getLicenseType,
  type LicenseCategory,
} from '@/lib/license-type-info'

interface PageProps {
  params: Promise<{ type: string }>
}

const CATEGORY_ICON: Record<LicenseCategory, typeof Wine> = {
  Liquor: Wine,
  'Beer & Wine': Beer,
  Package: Package,
  'Food Service': UtensilsCrossed,
  Mobile: Truck,
}

const CATEGORY_VARIANT: Record<LicenseCategory, 'live' | 'new' | 'beta' | 'pro' | 'default'> = {
  Liquor: 'pro',
  'Beer & Wine': 'live',
  Package: 'beta',
  'Food Service': 'new',
  Mobile: 'default',
}

export function generateStaticParams() {
  return LICENSE_TYPES.map((t) => ({ type: t.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { type } = await params
  const license = getLicenseType(type)
  if (!license) {
    return { title: 'License Type Not Found' }
  }
  return {
    title: `What is a Florida ${license.code} License? — ${license.name}`,
    description: license.summary.slice(0, 155),
    alternates: { canonical: `https://newvenuedata.com/license-types/${license.slug}` },
  }
}

export default async function LicenseTypePage({ params }: PageProps) {
  const { type } = await params
  const license = getLicenseType(type)

  if (!license) {
    notFound()
  }

  const Icon = CATEGORY_ICON[license.category]
  const related = license.relatedCodes
    .map((slug) => getLicenseType(slug))
    .filter((t): t is NonNullable<typeof t> => Boolean(t))

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://newvenuedata.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'License Types',
        item: 'https://newvenuedata.com/license-types',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: license.code,
        item: `https://newvenuedata.com/license-types/${license.slug}`,
      },
    ],
  }

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hero */}
      <section className="py-20 lg:py-28 gradient-hero">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 flex flex-col gap-6">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-[var(--ls-fg-3)]">
            <Link href="/" className="transition-colors hover:text-[var(--ls-fg-2)]">
              Home
            </Link>
            <span className="text-[var(--ls-fg-4)]">/</span>
            <Link href="/license-types" className="transition-colors hover:text-[var(--ls-fg-2)]">
              License Types
            </Link>
            <span className="text-[var(--ls-fg-4)]">/</span>
            <span className="font-mono text-indigo-400">{license.code}</span>
          </nav>

          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10">
              <Icon className="h-5 w-5 text-indigo-400" />
            </span>
            <TagBadge variant={CATEGORY_VARIANT[license.category]}>{license.category}</TagBadge>
          </div>

          <h1 className="text-display-lg text-[var(--ls-fg)]">
            <span className="font-mono text-indigo-400">{license.code}</span>
            <span className="text-[var(--ls-fg-4)]"> — </span>
            {license.name}
          </h1>
        </div>
      </section>

      {/* Body */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 flex flex-col gap-12">
          {/* Summary */}
          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-semibold text-[var(--ls-fg)]">Summary</h2>
            <p className="text-base leading-7 text-[var(--ls-fg-2)]">{license.summary}</p>
          </div>

          {/* Who files it */}
          <div className="flex flex-col gap-3 border-t border-[var(--ls-border)] pt-10">
            <h2 className="text-xl font-semibold text-[var(--ls-fg)]">Who files it</h2>
            <p className="text-base leading-7 text-[var(--ls-fg-2)]">{license.whoFilesIt}</p>
          </div>

          {/* What it signals */}
          <div className="flex flex-col gap-3 border-t border-[var(--ls-border)] pt-10">
            <h2 className="text-xl font-semibold text-[var(--ls-fg)]">What it signals</h2>
            <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/[0.04] p-6">
              <p className="text-base leading-7 text-[var(--ls-fg-2)]">{license.whatItSignals}</p>
            </div>
          </div>

          {/* Examples */}
          <div className="flex flex-col gap-4 border-t border-[var(--ls-border)] pt-10">
            <h2 className="text-xl font-semibold text-[var(--ls-fg)]">Examples</h2>
            <ul className="flex flex-col gap-3">
              {license.examples.map((ex) => (
                <li
                  key={ex}
                  className="flex items-start gap-3 rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-4"
                >
                  <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-400" />
                  <span className="text-sm leading-relaxed text-[var(--ls-fg-2)]">{ex}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Related license types */}
          {related.length > 0 && (
            <div className="flex flex-col gap-4 border-t border-[var(--ls-border)] pt-10">
              <h2 className="text-xl font-semibold text-[var(--ls-fg)]">Related license types</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {related.map((r) => {
                  const RelatedIcon = CATEGORY_ICON[r.category]
                  return (
                    <Link
                      key={r.slug}
                      href={`/license-types/${r.slug}`}
                      className="group flex items-center gap-3 rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-4 transition-colors hover:border-[var(--ls-border-2)] hover:bg-[var(--ls-hover)]"
                    >
                      <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-[var(--ls-border-2)] bg-[var(--ls-surface-2)]">
                        <RelatedIcon className="h-4 w-4 text-indigo-400" />
                      </span>
                      <span className="flex flex-col">
                        <span className="font-mono text-sm font-semibold text-indigo-400">{r.code}</span>
                        <span className="text-xs text-[var(--ls-fg-2)]">{r.name}</span>
                      </span>
                      <ArrowRight className="ml-auto h-4 w-4 text-[var(--ls-fg-4)] transition-colors group-hover:text-indigo-400" />
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          {/* Further reading */}
          <div className="flex flex-col gap-4 border-t border-[var(--ls-border)] pt-10">
            <h2 className="text-xl font-semibold text-[var(--ls-fg)]">Keep exploring</h2>
            <div className="flex flex-wrap gap-3">
              {[
                { href: '/glossary', label: 'Florida license glossary' },
                { href: '/data-coverage', label: 'Data coverage' },
                { href: '/docs', label: 'API docs' },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="inline-flex items-center gap-2 rounded-lg border border-[var(--ls-border-2)] bg-[var(--ls-surface)] px-4 py-2 text-sm text-[var(--ls-fg-2)] transition-colors hover:border-indigo-400/50 hover:text-[var(--ls-fg)]"
                >
                  {l.label}
                  <ArrowRight className="h-3.5 w-3.5 text-indigo-400" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CtaBanner />
    </div>
  )
}
