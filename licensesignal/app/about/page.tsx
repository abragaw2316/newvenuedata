import type { Metadata } from 'next'
import { SectionHeading } from '@/components/shared/section-heading'
import { CtaBanner } from '@/components/sections/cta-banner'

export const metadata: Metadata = {
  title: 'About',
  description:
    'New Venue Data assembles Florida DBPR public records into structured trigger feeds for the teams that need to move first.',
  alternates: { canonical: 'https://newvenuedata.com/about' },
}

const TEAM = [
  {
    name: 'Austin Bragaw',
    title: 'Founder',
    bio: 'Solo founder. I build the pipeline that turns Florida\'s public license records into a clean daily feed, and I work directly with every early customer. Reach me at austin@newvenuedata.com.',
    initials: 'AB',
  },
]

const DATA_QUALITY = [
  {
    title: 'Entity Resolution',
    desc: 'Every record is matched to a canonical business entity across all FL DBPR filing systems — eliminating duplicates and tracking ownership changes over time.',
  },
  {
    title: 'Address Geocoding',
    desc: 'All addresses are standardized to USPS format and geocoded to lat/lng for geographic analysis, mapping, and territory-level filtering.',
  },
  {
    title: 'DBA Normalization',
    desc: 'Legal names and DBA names are resolved to a single record. When a transfer occurs, we link the old and new owners across filings.',
  },
  {
    title: 'Daily Source Refresh',
    desc: 'Every license record is compared against the latest DBPR snapshot daily. Renewals, cancellations, and status changes are detected and classified.',
  },
]

export default function AboutPage() {
  return (
    <div>
      {/* Mission */}
      <section className="py-20 lg:py-28 gradient-hero">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium tracking-widest text-indigo-400 uppercase mb-6">
              About
            </span>
            <h1 className="text-display-lg text-[var(--ls-fg)] mb-6">
              We believe the best time to reach a new business is before they've made their first vendor decision.
            </h1>
            <p className="text-lg text-[var(--ls-fg-2)] leading-relaxed">
              When a restaurant or bar files their liquor or food-service license with the state, they're
              announcing to anyone paying attention: we're opening soon, and we need vendors. That window —
              the weeks between filing and first pour — is when every vendor relationship gets decided.
            </p>
            <p className="text-lg text-[var(--ls-fg-2)] leading-relaxed mt-4">
              New Venue Data was built to deliver that signal to the teams that need it. We pull Florida DBPR
              public records daily, normalize them into structured events, and make them available as a weekly
              lead list and a REST API — built for distributors, suppliers, POS companies, payroll providers,
              and investors.
            </p>
          </div>
        </div>
      </section>

      {/* What we do */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <SectionHeading
              eyebrow="What We Do"
              heading="Public Records, Made Useful"
              align="left"
            />
            <div className="mt-6 flex flex-col gap-4 text-sm text-[var(--ls-fg-2)] leading-7">
              <p>
                Florida's Department of Business and Professional Regulation (DBPR) publishes all liquor
                and food-service license applications as public records. The data is technically available
                to anyone — but it's buried in an antiquated portal, inconsistently structured, and updated
                on an unpredictable cadence.
              </p>
              <p>
                We solve that. Our pipeline scrapes DBPR daily, runs the raw data through entity resolution,
                address normalization, and deduplication, then classifies every change as a typed event:
                new_filing, renewal, ownership_transfer, status_change, or cancellation.
              </p>
              <p>
                The output is a clean, normalized, consistently-structured feed that your team can consume
                via REST API, webhook push, or CSV export — without any of the data wrangling.
              </p>
            </div>
          </div>

          {/* Compliance */}
          <div className="rounded-xl border border-amber-500/15 bg-amber-500/5 p-6">
            <h3 className="text-sm font-semibold text-amber-400 mb-3">FCRA Compliance Notice</h3>
            <p className="text-sm text-[var(--ls-fg-2)] leading-relaxed">
              New Venue Data sells data about <strong className="text-[var(--ls-fg)]">business entities only</strong> —
              not individual consumers. We are not a consumer reporting agency (CRA) under the Fair Credit
              Reporting Act (FCRA), and our data may not be used for FCRA-governed purposes including:
              employment screening, tenant screening, or credit decisions affecting individual consumers.
            </p>
            <p className="text-sm text-[var(--ls-fg-2)] leading-relaxed mt-3">
              New Venue Data is built for B2B teams using business-entity data for sales prospecting, market
              intelligence, and distribution intelligence — all legitimate FCRA-safe use cases.
            </p>
          </div>
        </div>
      </section>

      {/* Data quality */}
      <section className="py-20 bg-[var(--ls-surface-2)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-10">
          <SectionHeading
            eyebrow="Data Quality"
            heading="Built for Reliability"
            subtext="Raw public records are messy. Our normalization pipeline turns them into structured, trustworthy data."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {DATA_QUALITY.map((item, i) => (
              <div key={item.title} className="rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-5 flex flex-col gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full border border-indigo-500/20 bg-indigo-500/10">
                  <span className="text-xs font-bold text-indigo-400">{i + 1}</span>
                </div>
                <h3 className="text-sm font-semibold text-[var(--ls-fg)]">{item.title}</h3>
                <p className="text-xs text-[var(--ls-fg-3)] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-10">
          <SectionHeading eyebrow="Team" heading="Who We Are" />
          <div className="flex justify-center w-full">
            {TEAM.map((member) => (
              <div key={member.name} className="rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-6 flex flex-col gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/15 border border-indigo-500/20">
                  <span className="text-sm font-bold text-indigo-400">{member.initials}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--ls-fg)]">{member.name}</p>
                  <p className="text-xs text-indigo-400">{member.title}</p>
                </div>
                <p className="text-xs text-[var(--ls-fg-3)] leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />
    </div>
  )
}
