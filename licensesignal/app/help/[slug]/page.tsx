import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, ArrowLeft, ThumbsUp, ThumbsDown } from 'lucide-react'
import { CtaBanner } from '@/components/sections/cta-banner'
import {
  HELP_ARTICLES,
  HELP_CATEGORIES,
  getArticle,
  type HelpArticle,
} from '@/lib/help-articles'

interface PageProps {
  params: Promise<{ slug: string }>
}

function categoryName(slug: HelpArticle['category']): string {
  return HELP_CATEGORIES.find((c) => c.slug === slug)?.name ?? 'Help'
}

export function generateStaticParams() {
  return HELP_ARTICLES.map((article) => ({ slug: article.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const article = getArticle(slug)

  if (!article) {
    return { title: 'Article Not Found' }
  }

  const url = `https://newvenuedata.com/help/${article.slug}`

  return {
    title: `${article.title} — Help Center`,
    description: article.excerpt,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: article.title,
      description: article.excerpt,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
    },
  }
}

export default async function HelpArticlePage({ params }: PageProps) {
  const { slug } = await params
  const article = getArticle(slug)

  if (!article) {
    notFound()
  }

  const related: HelpArticle[] = HELP_ARTICLES.filter(
    (a) => a.category === article.category && a.slug !== article.slug
  ).slice(0, 3)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: article.title,
    description: article.excerpt,
    articleSection: categoryName(article.category),
    publisher: {
      '@type': 'Organization',
      name: 'New Venue Data',
      url: 'https://newvenuedata.com',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://newvenuedata.com/help/${article.slug}`,
    },
  }

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <section className="py-20 lg:py-28 gradient-hero">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="mb-8 flex flex-wrap items-center gap-2 text-sm text-[var(--ls-fg-3)]"
          >
            <Link href="/" className="transition-colors hover:text-[var(--ls-fg-2)]">
              Home
            </Link>
            <span className="text-[var(--ls-fg-4)]">/</span>
            <Link href="/help" className="transition-colors hover:text-[var(--ls-fg-2)]">
              Help Center
            </Link>
            <span className="text-[var(--ls-fg-4)]">/</span>
            <span className="text-[var(--ls-fg-2)]">{categoryName(article.category)}</span>
          </nav>

          <div className="flex flex-col gap-5">
            <span className="inline-flex w-fit items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium tracking-widest text-indigo-400 uppercase">
              {categoryName(article.category)}
            </span>

            <h1 className="text-display-lg text-[var(--ls-fg)]">{article.title}</h1>

            <p className="text-lg leading-relaxed text-[var(--ls-fg-2)]">
              {article.excerpt}
            </p>
          </div>
        </div>
      </section>

      {/* Body */}
      <article className="py-16">
        <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
          {article.body.map((block, i) => {
            switch (block.type) {
              case 'h2':
                return (
                  <h2
                    key={i}
                    className="mt-6 text-2xl font-semibold text-[var(--ls-fg)] first:mt-0"
                  >
                    {block.text}
                  </h2>
                )
              case 'p':
                return (
                  <p key={i} className="leading-relaxed text-[var(--ls-fg-2)]">
                    {block.text}
                  </p>
                )
              case 'list':
                return (
                  <ul key={i} className="flex flex-col gap-3">
                    {block.items.map((item, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-3 leading-relaxed text-[var(--ls-fg-2)]"
                      >
                        <span className="mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-400" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )
              case 'code':
                return (
                  <pre
                    key={i}
                    className="overflow-x-auto rounded-lg border border-[var(--ls-border)] bg-[var(--ls-surface-2)] p-4 text-sm leading-relaxed text-[var(--ls-fg)]"
                  >
                    <code>{block.text}</code>
                  </pre>
                )
              default:
                return null
            }
          })}

          {/* Was this helpful? */}
          <div className="mt-8 rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-base font-semibold text-[var(--ls-fg)]">
                  Was this article helpful?
                </p>
                <p className="mt-1 text-sm text-[var(--ls-fg-3)]">
                  Still stuck? Our team is happy to help.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-md border border-[var(--ls-border)] bg-[var(--ls-surface-2)] px-4 py-2 text-sm font-medium text-[var(--ls-fg-2)]">
                  <ThumbsUp className="h-4 w-4 text-emerald-400" />
                  Yes
                </span>
                <span className="inline-flex items-center gap-2 rounded-md border border-[var(--ls-border)] bg-[var(--ls-surface-2)] px-4 py-2 text-sm font-medium text-[var(--ls-fg-2)]">
                  <ThumbsDown className="h-4 w-4 text-[var(--ls-fg-3)]" />
                  No
                </span>
              </div>
            </div>
            <div className="mt-4 border-t border-[var(--ls-border)] pt-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-1 text-sm font-medium text-indigo-400 transition-colors hover:text-[#818cf8]"
              >
                Contact support
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          <div className="mt-2 border-t border-[var(--ls-border)] pt-8">
            <Link
              href="/help"
              className="inline-flex items-center gap-2 text-sm font-medium text-indigo-400 transition-colors hover:text-[#818cf8]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Help Center
            </Link>
          </div>
        </div>
      </article>

      {/* Related articles */}
      {related.length > 0 && (
        <section className="border-t border-[var(--ls-border)] py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-semibold text-[var(--ls-fg)]">
              Related articles
            </h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {related.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/help/${rel.slug}`}
                  className="group flex flex-col gap-4 rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-6 transition-colors hover:border-[var(--ls-border-2)] hover:bg-[var(--ls-hover)]"
                >
                  <span className="inline-flex w-fit items-center rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-0.5 text-xs font-medium text-indigo-400">
                    {categoryName(rel.category)}
                  </span>
                  <h3 className="text-base font-semibold text-[var(--ls-fg)] transition-colors group-hover:text-[#818cf8]">
                    {rel.title}
                  </h3>
                  <p className="flex-1 text-sm leading-relaxed text-[var(--ls-fg-2)]">
                    {rel.excerpt}
                  </p>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-indigo-400 transition-transform group-hover:translate-x-0.5">
                    Read article
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBanner />
    </div>
  )
}
