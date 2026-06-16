import type { Metadata } from 'next'
import Link from 'next/link'
import { Wine, UtensilsCrossed, Beer, Package, Truck, ArrowRight } from 'lucide-react'
import { SectionHeading } from '@/components/shared/section-heading'
import { TagBadge } from '@/components/shared/tag-badge'
import { CtaBanner } from '@/components/sections/cta-banner'
import { LICENSE_TYPES, type LicenseCategory } from '@/lib/license-type-info'

export const metadata: Metadata = {
  title: 'License Types',
  description:
    'Florida DBPR license types explained — SRX, COP, BEV, APS, 4COP, food service, seating, and mobile food. What each code means, who files it, and what it signals about a new business.',
  alternates: { canonical: 'https://newvenuedata.com/license-types' },
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

export default function LicenseTypesPage() {
  return (
    <div>
      {/* Hero */}
      <section className="py-20 lg:py-28 gradient-hero">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-6">
          <SectionHeading
            align="left"
            eyebrow="License Types"
            heading="Florida License Types, Explained"
            subtext="Florida DBPR classifies every alcohol and food-service business with a license code. This guide decodes each one — what it authorizes, who files it, and what it tells you about a prospect entering the market."
          />
        </div>
      </section>

      {/* Grid */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {LICENSE_TYPES.map((t) => {
              const Icon = CATEGORY_ICON[t.category]
              return (
                <Link
                  key={t.slug}
                  href={`/license-types/${t.slug}`}
                  className="group flex flex-col gap-4 rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-6 transition-colors hover:border-[var(--ls-border-2)] hover:bg-[var(--ls-hover)]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-lg font-semibold text-indigo-400">{t.code}</span>
                    <Icon className="h-5 w-5 text-[var(--ls-fg-3)] transition-colors group-hover:text-indigo-400" />
                  </div>

                  <div className="flex flex-col gap-2">
                    <h2 className="text-base font-semibold text-[var(--ls-fg)]">{t.name}</h2>
                    <TagBadge variant={CATEGORY_VARIANT[t.category]}>{t.category}</TagBadge>
                  </div>

                  <p className="text-sm leading-relaxed text-[var(--ls-fg-2)] line-clamp-4">{t.summary}</p>

                  <span className="mt-auto inline-flex items-center gap-1 pt-2 text-xs font-medium text-indigo-400 transition-colors group-hover:text-[#818cf8]">
                    Read more
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <CtaBanner />
    </div>
  )
}
