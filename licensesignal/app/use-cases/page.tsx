import type { Metadata } from 'next'
import { ShieldCheck, Wine, UtensilsCrossed, MonitorSmartphone, Users, Building2 } from 'lucide-react'
import { SectionHeading } from '@/components/shared/section-heading'
import { GlowCard } from '@/components/shared/glow-card'
import { CtaBanner } from '@/components/sections/cta-banner'

export const metadata: Metadata = {
  title: 'Use Cases',
  description:
    'How liquor-liability insurance agents, beverage distributors, restaurant suppliers, POS companies, and payroll providers use New Venue Data to reach new Florida venues first.',
  alternates: { canonical: 'https://newvenuedata.com/use-cases' },
}

// "whyItMatters" replaces the old fabricated ROI stats. With no customer base
// yet, we make no invented performance claims — only true statements about the
// signal itself.
const USE_CASES = [
  {
    icon: ShieldCheck,
    title: 'Liquor-Liability Insurance Agents',
    tagline: 'Florida is a dram-shop state — every new venue needs coverage.',
    description:
      'A new on-premises liquor license means a business that is legally exposed and shopping for liquor-liability coverage right now. Reach them in the buildout window, before another agent does.',
    whyItMatters: 'One policy you write off a single week\'s list can pay for the subscription for a year.',
    metrics: ['New on-premises filings', 'County-level filtering', 'Name, address, license type'],
  },
  {
    icon: Wine,
    title: 'Beverage Distributors',
    tagline: 'Every new on-premises license is a net-new account.',
    description:
      'New SRX and COP licenses signal a venue that is about to choose its spirits, wine, and beer vendors. Reach out during the weeks the decisions are actually made.',
    whyItMatters: 'A venue actively selecting vendors is a warmer prospect than any cold list.',
    metrics: ['SRX + COP + BEV filings', 'County-level filtering', 'Weekly new-license list'],
  },
  {
    icon: UtensilsCrossed,
    title: 'Restaurant Suppliers',
    tagline: 'The first weeks of buildout decide every vendor relationship.',
    description:
      'New food-service licenses precede FF&E, smallwares, linen, and food contracts — vendor decisions made before a restaurant opens. Get in front of owners while those slots are open.',
    whyItMatters: 'License filing is one of the earliest public signals that a new restaurant is coming.',
    metrics: ['Food-service filings', 'Address + city targeting', 'CSV + Excel delivery'],
  },
  {
    icon: MonitorSmartphone,
    title: 'POS Companies',
    tagline: 'New hospitality openings need a POS system.',
    description:
      'Restaurants file their license well before opening, giving you a runway to nurture, demo, and close ahead of grand opening — and ahead of the competition.',
    whyItMatters: 'Reaching an operator before they\'ve picked a system beats switching them later.',
    metrics: ['New filing list', 'County + city filtering', 'API access on South Florida+'],
  },
  {
    icon: Users,
    title: 'Payroll Providers',
    tagline: 'A new restaurant is a new payroll account.',
    description:
      'Most payroll providers hear about a restaurant months after it opens. New Venue Data delivers the signal at license filing — not the first paycheck.',
    whyItMatters: 'Earlier contact means you\'re the incumbent option, not the switch.',
    metrics: ['All FL license types', 'Weekly delivery', 'Filing history on paid plans'],
  },
  {
    icon: Building2,
    title: 'Commercial Real Estate & Market Intel',
    tagline: 'Track which businesses are entering your market.',
    description:
      'License filings reveal where hospitality operators are moving before a lease is announced — useful for tenant prospecting and for reading market velocity by county.',
    whyItMatters: 'Filing volume by county is a simple, public leading indicator of market activity.',
    metrics: ['Geographic filtering', 'County + city breakdowns', 'Bulk CSV delivery'],
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
            heading="Built for the Teams That Reach New Venues First"
            subtext="From liquor-liability agents to distributors and suppliers — anyone who sells to Florida's new bars and restaurants can move sooner with the same weekly signal."
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
                    <p className="text-xs text-emerald-400">{uc.whyItMatters}</p>
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
