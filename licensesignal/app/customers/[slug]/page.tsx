import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Check, Quote, ChevronRight } from 'lucide-react'
import { CtaBanner } from '@/components/sections/cta-banner'
import { CASE_STUDIES, getCaseStudy } from '@/lib/case-studies'

interface PageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return CASE_STUDIES.map((cs) => ({ slug: cs.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const cs = getCaseStudy(slug)
  if (!cs) {
    return { title: 'Customer Story' }
  }
  return {
    title: `${cs.company} — Customer Story`,
    description: `${cs.industry}: ${cs.challenge.slice(0, 150)}`,
    alternates: { canonical: `https://newvenuedata.com/customers/${cs.slug}` },
    openGraph: {
      title: `${cs.company} — New Venue Data Customer Story`,
      description: cs.quote,
      url: `https://newvenuedata.com/customers/${cs.slug}`,
    },
  }
}

export default async function CustomerStoryPage({ params }: PageProps) {
  const { slug } = await params
  const cs = getCaseStudy(slug)

  if (!cs) {
    notFound()
  }

  return (
    <div>
      <section className="py-20 lg:py-28 gradient-hero">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs text-[var(--ls-fg-3)] mb-8"
          >
            <Link href="/" className="hover:text-[var(--ls-fg-2)] transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-[var(--ls-fg-4)]" />
            <Link href="/customers" className="hover:text-[var(--ls-fg-2)] transition-colors">
              Customers
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-[var(--ls-fg-4)]" />
            <span className="text-[var(--ls-fg-2)]">{cs.company}</span>
          </nav>

          <span className="inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium tracking-widest text-indigo-400 uppercase">
            {cs.industry}
          </span>
          <h1 className="text-display-lg text-[var(--ls-fg)] mt-4">{cs.company}</h1>
        </div>
      </section>

      {/* Body */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 flex flex-col gap-12">
          {/* Challenge */}
          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-semibold text-[var(--ls-fg)]">The Challenge</h2>
            <p className="text-sm text-[var(--ls-fg-2)] leading-7">{cs.challenge}</p>
          </div>

          {/* Solution */}
          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-semibold text-[var(--ls-fg)]">The Solution</h2>
            <p className="text-sm text-[var(--ls-fg-2)] leading-7">{cs.solution}</p>
          </div>

          {/* Results */}
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-[var(--ls-fg)]">The Results</h2>
            <ul className="grid sm:grid-cols-2 gap-3">
              {cs.results.map((result) => (
                <li
                  key={result}
                  className="flex items-start gap-2.5 rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-4"
                >
                  <Check className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-[var(--ls-fg-2)] leading-relaxed">{result}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pull quote */}
          <figure className="border-l-2 border-indigo-500 bg-[var(--ls-surface-2)] rounded-r-xl pl-6 pr-6 py-6">
            <Quote className="h-6 w-6 text-indigo-400/60 mb-3" />
            <blockquote className="text-xl italic text-[var(--ls-fg)] leading-relaxed">
              “{cs.quote}”
            </blockquote>
            <figcaption className="mt-4 text-sm text-[var(--ls-fg-3)]">
              — {cs.quoteAuthor}, {cs.company}
            </figcaption>
          </figure>
        </div>
      </section>

      <CtaBanner />
    </div>
  )
}
