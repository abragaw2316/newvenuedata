import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Check, X, ArrowRight, Sparkles } from 'lucide-react'
import { CtaBanner } from '@/components/sections/cta-banner'
import { ALTERNATIVES, getAlternative } from '@/lib/alternatives'

interface PageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return ALTERNATIVES.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const alt = getAlternative(slug)
  if (!alt) {
    return { title: 'Alternative Not Found' }
  }
  return {
    title: `New Venue Data vs ${alt.name}`,
    description: alt.summary.slice(0, 155),
    alternates: { canonical: `https://newvenuedata.com/alternatives/${alt.slug}` },
  }
}

export default async function AlternativePage({ params }: PageProps) {
  const { slug } = await params
  const alt = getAlternative(slug)

  if (!alt) {
    notFound()
  }

  const others = ALTERNATIVES.filter((a) => a.slug !== alt.slug)

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
        name: 'Alternatives',
        item: 'https://newvenuedata.com/alternatives',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: alt.name,
        item: `https://newvenuedata.com/alternatives/${alt.slug}`,
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
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-xs text-[var(--ls-fg-3)]"
          >
            <Link href="/" className="transition-colors hover:text-[var(--ls-fg-2)]">
              Home
            </Link>
            <span className="text-[var(--ls-fg-4)]">/</span>
            <Link
              href="/alternatives"
              className="transition-colors hover:text-[var(--ls-fg-2)]"
            >
              Alternatives
            </Link>
            <span className="text-[var(--ls-fg-4)]">/</span>
            <span className="text-indigo-400">{alt.name}</span>
          </nav>

          <h1 className="text-display-lg text-[var(--ls-fg)]">
            New Venue Data <span className="text-[var(--ls-fg-4)]">vs</span> {alt.name}
          </h1>
          <p className="text-lg leading-8 text-[var(--ls-fg-2)] max-w-2xl">{alt.summary}</p>
        </div>
      </section>

      {/* Two-column comparison */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Their limitations */}
            <div className="flex flex-col gap-5 rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-6">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium tracking-widest text-[var(--ls-fg-4)] uppercase">
                  {alt.name}
                </span>
                <h2 className="text-xl font-semibold text-[var(--ls-fg)]">Where it falls short</h2>
              </div>
              <ul className="flex flex-col gap-3">
                {alt.theirLimitations.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border border-red-400/30 bg-red-400/10">
                      <X className="h-3 w-3 text-red-400" />
                    </span>
                    <span className="text-sm leading-relaxed text-[var(--ls-fg-2)]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Our advantages */}
            <div className="flex flex-col gap-5 rounded-xl border border-indigo-500/30 bg-indigo-500/[0.04] p-6 shadow-[0_0_20px_rgba(99,102,241,0.1)]">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium tracking-widest text-indigo-400 uppercase">
                  New Venue Data
                </span>
                <h2 className="text-xl font-semibold text-[var(--ls-fg)]">Where we win</h2>
              </div>
              <ul className="flex flex-col gap-3">
                {alt.ourAdvantages.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/10">
                      <Check className="h-3 w-3 text-emerald-400" />
                    </span>
                    <span className="text-sm leading-relaxed text-[var(--ls-fg-2)]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Verdict */}
          <div className="mt-10 flex flex-col gap-3 rounded-xl border border-indigo-500/20 bg-[var(--ls-surface-2)] p-6 sm:p-8">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              <span className="text-xs font-medium tracking-widest text-indigo-400 uppercase">
                The verdict
              </span>
            </div>
            <p className="text-base leading-7 text-[var(--ls-fg)]">{alt.verdict}</p>
            <div className="pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-md bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium px-5 py-2.5 transition-colors"
              >
                Get API Access
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Other comparisons */}
          {others.length > 0 && (
            <div className="mt-16 flex flex-col gap-4 border-t border-[var(--ls-border)] pt-10">
              <h2 className="text-xl font-semibold text-[var(--ls-fg)]">Compare other approaches</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {others.map((o) => (
                  <Link
                    key={o.slug}
                    href={`/alternatives/${o.slug}`}
                    className="group flex items-center gap-3 rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-4 transition-colors hover:border-[var(--ls-border-2)] hover:bg-[var(--ls-hover)]"
                  >
                    <span className="flex flex-col">
                      <span className="text-sm font-semibold text-[var(--ls-fg)]">
                        vs {o.name}
                      </span>
                      <span className="text-xs text-[var(--ls-fg-3)] line-clamp-1">{o.summary}</span>
                    </span>
                    <ArrowRight className="ml-auto h-4 w-4 flex-shrink-0 text-[var(--ls-fg-4)] transition-colors group-hover:text-indigo-400" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <CtaBanner />
    </div>
  )
}
