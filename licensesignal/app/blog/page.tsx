import type { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import { TagBadge } from '@/components/shared/tag-badge'
import { CtaBanner } from '@/components/sections/cta-banner'
import { BLOG_POSTS } from '@/lib/blog-posts'

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Data, playbooks, and market intelligence on Florida hospitality license filings — from the team building real-time license data infrastructure at New Venue Data.',
  alternates: { canonical: 'https://newvenuedata.com/blog' },
}

type BadgeVariant = 'new' | 'live' | 'beta' | 'pro' | 'default'

function categoryVariant(category: string): BadgeVariant {
  switch (category) {
    case 'Data':
      return 'live'
    case 'Engineering':
      return 'beta'
    case 'Compliance':
      return 'pro'
    case 'Market Intel':
      return 'new'
    default:
      return 'default'
  }
}

export default function BlogPage() {
  return (
    <div>
      {/* Hero */}
      <section className="py-20 lg:py-28 gradient-hero">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4">
            <span className="inline-flex w-fit items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium tracking-widest text-indigo-400 uppercase">
              Blog
            </span>
            <h1 className="text-display-lg text-[var(--ls-fg)] max-w-3xl">
              Notes from the license data layer
            </h1>
            <p className="text-lg text-[var(--ls-fg-2)] max-w-2xl">
              Data, playbooks, and market intelligence on Florida hospitality — written by
              the team building real-time license intelligence at New Venue Data.
            </p>
          </div>
        </div>
      </section>

      {/* Post grid */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {BLOG_POSTS.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col gap-4 rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-6 transition-colors hover:border-[var(--ls-border-2)] hover:bg-[var(--ls-hover)]"
              >
                <TagBadge variant={categoryVariant(post.category)} className="w-fit">
                  {post.category}
                </TagBadge>

                <h2 className="text-lg font-semibold text-[var(--ls-fg)] transition-colors group-hover:text-[#818cf8]">
                  {post.title}
                </h2>

                <p className="flex-1 text-sm leading-relaxed text-[var(--ls-fg-2)]">
                  {post.excerpt}
                </p>

                <div className="flex flex-col gap-3 border-t border-[var(--ls-border)] pt-4">
                  <div className="flex items-center justify-between text-xs text-[var(--ls-fg-3)]">
                    <span className="font-medium text-[var(--ls-fg-2)]">{post.author}</span>
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {post.date}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[var(--ls-fg-3)]">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {post.readingMinutes} min read
                    </span>
                    <span className="inline-flex items-center gap-1 font-medium text-indigo-400 transition-transform group-hover:translate-x-0.5">
                      Read
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />
    </div>
  )
}
