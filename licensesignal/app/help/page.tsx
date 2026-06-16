import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Rocket,
  KeyRound,
  Webhook,
  CreditCard,
  Database,
  UserCog,
  ArrowRight,
  Search,
  type LucideIcon,
} from 'lucide-react'
import { CtaBanner } from '@/components/sections/cta-banner'
import {
  HELP_CATEGORIES,
  HELP_ARTICLES,
  type HelpCategorySlug,
} from '@/lib/help-articles'

export const metadata: Metadata = {
  title: 'Help Center',
  description:
    'Guides, references, and answers for using New Venue Data — from your first API query to webhooks, billing, data coverage, and account security.',
  alternates: { canonical: 'https://newvenuedata.com/help' },
}

const CATEGORY_ICONS: Record<HelpCategorySlug, LucideIcon> = {
  'getting-started': Rocket,
  'api-keys': KeyRound,
  webhooks: Webhook,
  billing: CreditCard,
  'data-coverage': Database,
  account: UserCog,
}

export default function HelpCenterPage() {
  return (
    <div>
      {/* Hero */}
      <section className="py-20 lg:py-28 gradient-hero">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-5 text-center">
            <span className="inline-flex w-fit items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium tracking-widest text-indigo-400 uppercase">
              Help Center
            </span>
            <h1 className="text-display-lg text-[var(--ls-fg)] max-w-3xl">
              How can we help you?
            </h1>
            <p className="text-lg text-[var(--ls-fg-2)] max-w-2xl">
              Step-by-step guides and reference docs for getting the most out of
              New Venue Data — whether you are wiring up your first API call or
              tuning webhooks in production.
            </p>

            {/* Search-style heading */}
            <Link
              href="/docs"
              className="group mt-2 flex w-full max-w-xl items-center gap-3 rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] px-5 py-4 text-left transition-colors hover:border-[var(--ls-border-2)] hover:bg-[var(--ls-hover)]"
            >
              <Search className="h-5 w-5 flex-shrink-0 text-[var(--ls-fg-3)] transition-colors group-hover:text-indigo-400" />
              <span className="flex-1 text-[var(--ls-fg-3)]">
                Search articles, guides, and API references…
              </span>
              <span className="hidden rounded-md border border-[var(--ls-border)] bg-[var(--ls-surface-2)] px-2 py-0.5 text-xs text-[var(--ls-fg-3)] sm:inline">
                Browse docs
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Category sections */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-16">
          {HELP_CATEGORIES.map((category) => {
            const articles = HELP_ARTICLES.filter(
              (article) => article.category === category.slug
            )
            if (articles.length === 0) return null

            const Icon = CATEGORY_ICONS[category.slug]

            return (
              <div key={category.slug}>
                <div className="flex items-start gap-4">
                  <span className="inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10 text-indigo-400">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-semibold text-[var(--ls-fg)]">
                      {category.name}
                    </h2>
                    <p className="text-[var(--ls-fg-2)] max-w-2xl">
                      {category.description}
                    </p>
                  </div>
                </div>

                <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {articles.map((article) => (
                    <Link
                      key={article.slug}
                      href={`/help/${article.slug}`}
                      className="group flex flex-col gap-3 rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-6 transition-colors hover:border-[var(--ls-border-2)] hover:bg-[var(--ls-hover)]"
                    >
                      <h3 className="text-base font-semibold text-[var(--ls-fg)] transition-colors group-hover:text-[#818cf8]">
                        {article.title}
                      </h3>
                      <p className="flex-1 text-sm leading-relaxed text-[var(--ls-fg-2)]">
                        {article.excerpt}
                      </p>
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-indigo-400 transition-transform group-hover:translate-x-0.5">
                        Read article
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <CtaBanner />
    </div>
  )
}
