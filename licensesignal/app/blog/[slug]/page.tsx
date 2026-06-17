import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Calendar, Clock, User, ArrowRight, ArrowLeft } from 'lucide-react'
import { TagBadge } from '@/components/shared/tag-badge'
import { CtaBanner } from '@/components/sections/cta-banner'
import { BLOG_POSTS, type BlogPost } from '@/lib/blog-posts'

interface PageProps {
  params: Promise<{ slug: string }>
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

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = BLOG_POSTS.find((p) => p.slug === slug)

  if (!post) {
    return { title: 'Post Not Found' }
  }

  const url = `https://newvenuedata.com/blog/${post.slug}`
  // Keep the meta description under ~160 chars so Google doesn't truncate it
  // mid-sentence. The full excerpt still renders on the page itself.
  const description =
    post.excerpt.length > 157
      ? post.excerpt.slice(0, 157).replace(/\s+\S*$/, '') + '…'
      : post.excerpt

  return {
    title: post.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: post.title,
      description,
      publishedTime: post.date,
      authors: [post.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
    },
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = BLOG_POSTS.find((p) => p.slug === slug)

  if (!post) {
    notFound()
  }

  const related: BlogPost[] = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: {
      '@type': 'Person',
      name: post.author,
      jobTitle: post.authorRole,
    },
    publisher: {
      '@type': 'Organization',
      name: 'New Venue Data',
      url: 'https://newvenuedata.com',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://newvenuedata.com/blog/${post.slug}`,
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
          <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-2 text-sm text-[var(--ls-fg-3)]">
            <Link href="/" className="transition-colors hover:text-[var(--ls-fg-2)]">
              Home
            </Link>
            <span className="text-[var(--ls-fg-4)]">/</span>
            <Link href="/blog" className="transition-colors hover:text-[var(--ls-fg-2)]">
              Blog
            </Link>
            <span className="text-[var(--ls-fg-4)]">/</span>
            <span className="text-[var(--ls-fg-2)]">{post.title}</span>
          </nav>

          <div className="flex flex-col gap-5">
            <TagBadge variant={categoryVariant(post.category)} className="w-fit">
              {post.category}
            </TagBadge>

            <h1 className="text-display-lg text-[var(--ls-fg)]">{post.title}</h1>

            <p className="text-lg leading-relaxed text-[var(--ls-fg-2)]">{post.excerpt}</p>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[var(--ls-border)] pt-5 text-sm text-[var(--ls-fg-3)]">
              <span className="inline-flex items-center gap-2">
                <User className="h-4 w-4 text-indigo-400" />
                <span className="font-medium text-[var(--ls-fg)]">{post.author}</span>
                <span className="text-[var(--ls-fg-3)]">· {post.authorRole}</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {post.date}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {post.readingMinutes} min read
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <article className="py-16">
        <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
          {post.content.map((block, i) => {
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
                      <li key={j} className="flex items-start gap-3 text-[var(--ls-fg-2)] leading-relaxed">
                        <span className="mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-400" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )
              case 'quote':
                return (
                  <blockquote
                    key={i}
                    className="border-l-2 border-indigo-500 bg-[var(--ls-surface-2)] py-3 pl-5 pr-4 text-lg font-medium leading-relaxed text-[var(--ls-fg)]"
                  >
                    {block.text}
                  </blockquote>
                )
              default:
                return null
            }
          })}

          <div className="mt-8 border-t border-[var(--ls-border)] pt-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-medium text-indigo-400 transition-colors hover:text-[#818cf8]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to all posts
            </Link>
          </div>
        </div>
      </article>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="border-t border-[var(--ls-border)] py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-semibold text-[var(--ls-fg)]">Related posts</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {related.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/blog/${rel.slug}`}
                  className="group flex flex-col gap-4 rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-6 transition-colors hover:border-[var(--ls-border-2)] hover:bg-[var(--ls-hover)]"
                >
                  <TagBadge variant={categoryVariant(rel.category)} className="w-fit">
                    {rel.category}
                  </TagBadge>
                  <h3 className="text-base font-semibold text-[var(--ls-fg)] transition-colors group-hover:text-[#818cf8]">
                    {rel.title}
                  </h3>
                  <p className="flex-1 text-sm leading-relaxed text-[var(--ls-fg-2)]">{rel.excerpt}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-indigo-400 transition-transform group-hover:translate-x-0.5">
                    Read post
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
