import type { Metadata } from 'next'
import { Wine, UtensilsCrossed, MonitorSmartphone, Users, Building2, TrendingUp } from 'lucide-react'
import { SectionHeading } from '@/components/shared/section-heading'
import { GlowCard } from '@/components/shared/glow-card'
import { CtaBanner } from '@/components/sections/cta-banner'

export const metadata: Metadata = {
  title: 'Use Cases',
  description:
    'How beverage distributors, restaurant suppliers, POS companies, payroll providers, and PE firms use New Venue Data to find new business before the competition.',
  alternates: { canonical: 'https://newvenuedata.com/use-cases' },
}

const USE_CASES = [
  {
    icon: Wine,
    title: 'Beverage Distributors',
    tagline: 'Every new liquor license is a net-new account.',
    description:
      'Trigger outreach the day they file — before they\'ve called another distributor. New SRX and COP licenses signal a buyer actively selecting spirits, wine, and beer vendors in their first 30 days.',
    roi: 'Distributors on New Venue Data capture 2–4 new accounts per month per territory rep.',
    metrics: ['Day-of-filing alerts', 'SRX + COP + BEV events', 'County-level filtering'],
  },
  {
    icon: UtensilsCrossed,
    title: 'Restaurant Suppliers',
    tagline: 'The first 60 days decide every vendor relationship.',
    description:
      'New licenses signal FF&E, smallwares, linen, and food contracts — all vendor decisions made during buildout. New Venue Data puts your reps in the room when the checkbook is open.',
    roi: 'Suppliers reach new restaurant owners 6–12 weeks before the average cold call.',
    metrics: ['FOOD_SERVICE event feed', 'Address + city targeting', 'Ownership transfer alerts'],
  },
  {
    icon: MonitorSmartphone,
    title: 'POS Companies',
    tagline: 'New hospitality openings need a POS system.',
    description:
      'Be in their inbox before your competitors call. Restaurants file their license months before opening — giving you a long runway to nurture, demo, and close before grand opening day.',
    roi: '70%+ of POS decisions are made before a restaurant opens its doors.',
    metrics: ['New filing events', 'Webhook push delivery', 'CRM integration via API'],
  },
  {
    icon: Users,
    title: 'Payroll Providers',
    tagline: 'A new restaurant is a new payroll account.',
    description:
      'Most payroll providers find out 3–6 months after a restaurant opens — when someone finally calls HR. New Venue Data delivers the signal at the license filing, not the first paycheck.',
    roi: 'The payroll window closes fast. First contact wins 3x more often than second.',
    metrics: ['All FL license types', 'Daily batch delivery', 'Full historical archive'],
  },
  {
    icon: Building2,
    title: 'Commercial Real Estate',
    tagline: 'Track which businesses are entering your market.',
    description:
      'License filings reveal expansion patterns months before a lease is announced. Track hospitality operators moving into your submarkets and know who\'s growing before they call a broker.',
    roi: 'CRE teams use filing data to identify tenant prospects before they list their requirements.',
    metrics: ['Geographic clustering', 'County + city filtering', 'Bulk CSV delivery'],
  },
  {
    icon: TrendingUp,
    title: 'Private Equity & Market Intel',
    tagline: 'Monitor Florida\'s hospitality market in real time.',
    description:
      'Identify emerging clusters, track competitor rollouts, benchmark market velocity, and surface acquisition targets. New Venue Data is the primary data source for FL hospitality PE due diligence.',
    roi: 'PE firms use filing velocity as a leading indicator for hospitality market saturation.',
    metrics: ['Full 2-year archive', 'Raw data delivery', 'Custom data contracts'],
  },
]

export default function UseCasesPage() {
  return (
    <div>
      {/* Hero */}
      <section className="py-20 lg:py-28 gradient-hero">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Use Cases"
            heading="Built for the Teams That Move First"
            subtext="New Venue Data powers the intelligence workflow for every vertical that sells to Florida's hospitality industry."
          />
        </div>
      </section>

      {/* Cards */}
      <section className="py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {USE_CASES.map((uc, i) => {
              const Icon = uc.icon
              return (
                <GlowCard key={uc.title} className="flex flex-col gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/15 border border-indigo-500/20">
                    <Icon className="h-5 w-5 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--ls-fg)]">{uc.title}</h3>
                    <p className="text-sm text-indigo-400 mt-0.5 font-medium">{uc.tagline}</p>
                  </div>
                  <p className="text-sm text-[var(--ls-fg-2)] leading-relaxed flex-1">{uc.description}</p>
                  <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/10 p-3">
                    <p className="text-xs text-emerald-400">{uc.roi}</p>
                  </div>
                  <ul className="flex flex-col gap-1.5 border-t border-[var(--ls-border)] pt-4">
                    {uc.metrics.map((m) => (
                      <li key={m} className="flex items-center gap-2 text-xs text-[var(--ls-fg-3)]">
                        <span className="h-1 w-1 rounded-full bg-indigo-400" />
                        {m}
                      </li>
                    ))}
                  </ul>
                </GlowCard>
              )
            })}
          </div>
        </div>
      </section>

      <CtaBanner />
    </div>
  )
}
