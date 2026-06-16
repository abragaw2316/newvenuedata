import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, BookOpen, FileText, Activity, Database } from 'lucide-react'
import { SectionHeading } from '@/components/shared/section-heading'
import { CtaBanner } from '@/components/sections/cta-banner'

export const metadata: Metadata = {
  title: 'Glossary',
  description:
    'A plain-English glossary of Florida liquor and food-service license terminology — SRX, 4COP, COP, BEV, APS, DBPR license codes, statuses, and the data and API terms (webhooks, HMAC, cursor pagination) used by New Venue Data.',
  alternates: { canonical: 'https://newvenuedata.com/glossary' },
}

type Term = {
  term: string
  code?: string
  definition: string
  why?: string
  links?: { label: string; href: string }[]
}

const LICENSE_TYPES: Term[] = [
  {
    term: 'Special Restaurant License',
    code: '4COP-SRX',
    definition:
      'A Florida DBPR alcoholic-beverage license that lets a restaurant serve beer, wine, and full liquor for consumption on premises, conditioned on food sales. SRX holders must maintain a minimum seating capacity (typically 150 seats) and derive at least 51% of gross revenue from food and non-alcoholic items.',
    why: 'An SRX filing signals a full-service restaurant actively selecting beverage vendors, POS, and supply partners.',
  },
  {
    term: 'Consumption On Premises',
    code: 'COP',
    definition:
      'The class of Florida licenses that permit alcohol to be consumed where it is sold — bars, restaurants, taverns, and clubs. COP series codes (1COP, 2COP, 3COP, 4COP) escalate from beer only up to full liquor.',
    why: 'A new COP venue is an immediate prospect for beverage distributors, draft-line installers, and hospitality services.',
  },
  {
    term: 'Beverage License',
    code: 'BEV',
    definition:
      'The umbrella DBPR category for any license authorizing the sale of alcoholic beverages in Florida, spanning both on-premises (COP) and off-premises (APS / package store) permits issued by the Division of Alcoholic Beverages and Tobacco.',
    why: 'Tracking the full BEV category gives a complete view of every alcohol-selling business entering a market.',
  },
  {
    term: 'Alcoholic Beverage Package Store',
    code: 'APS',
    definition:
      'An off-premises license permitting the sale of sealed alcoholic beverages for consumption away from the location — liquor stores and package retailers. Alcohol may not be opened or consumed on site.',
    why: 'A new APS opening is a retail shelf-space and wholesale supply opportunity rather than a hospitality one.',
  },
  {
    term: 'Quota Liquor License',
    code: '4COP',
    definition:
      'A full-liquor consumption-on-premises license issued under Florida’s population-based quota system. Because the number per county is capped, 4COP quota licenses are scarce, transferable, and often sold on a secondary market for significant value.',
    why: 'A 4COP transfer or new issuance is a high-value signal — these businesses have made a major capital commitment to a location.',
  },
  {
    term: 'Package Store Tiers',
    code: '1APS / 2APS',
    definition:
      'Off-premises package-store sub-classes. 1APS authorizes beer only and 2APS authorizes beer and wine for off-premises sale; full-liquor package sales require a quota license (often a 3PS/4COP combination).',
    why: 'The APS tier tells a supplier exactly which product lines (beer, wine, or spirits) a new retailer can stock.',
  },
  {
    term: 'Food Service Establishment Permit',
    code: 'FOOD_SERVICE',
    definition:
      'A license from DBPR’s Division of Hotels and Restaurants required to operate a public food-service establishment in Florida — restaurants, caterers, and similar venues serving prepared food to the public.',
    why: 'A food-service permit filing marks a brand-new restaurant before it opens — the earliest window to reach a buyer.',
  },
  {
    term: 'Seating-Capacity License',
    code: 'SEATING',
    definition:
      'A license whose privileges are tied to a verified minimum number of seats — most commonly the SRX special restaurant license. Seat count is inspected and recorded by DBPR and determines eligibility for full-liquor service.',
    why: 'Seat count is a proxy for venue size, helping you prioritize larger, higher-revenue restaurant prospects.',
  },
  {
    term: 'Mobile Food Dispensing Vehicle',
    code: 'MOBILE_FOOD',
    definition:
      'A DBPR-licensed mobile food unit — food trucks, trailers, and carts — authorized to prepare and serve food from a non-fixed location, subject to commissary and inspection requirements.',
    why: 'Mobile food filings reveal fast-moving, lower-cost operators ideal for equipment, payments, and commissary services.',
  },
]

const STATUS_EVENTS: Term[] = [
  {
    term: 'New Filing',
    definition:
      'The first time an application for a license appears in the DBPR record — the business has applied but is not yet approved. The earliest detectable signal that a new venue is forming.',
  },
  {
    term: 'Pending',
    definition:
      'An application that has been submitted and is under DBPR review, inspection, or awaiting documentation. Not yet authorized to operate under the license.',
  },
  {
    term: 'Active / Issued',
    definition:
      'A license that DBPR has approved and is currently valid. The business is legally authorized to operate within the scope of the license code.',
  },
  {
    term: 'Renewal',
    definition:
      'The periodic re-authorization of an existing license. Florida beverage licenses typically renew annually; a renewal event confirms the business is still operating.',
  },
  {
    term: 'Ownership Transfer',
    definition:
      'A change in the licensee — the license (especially a scarce quota 4COP) moves to a new owner or entity. Often accompanies a sale of the business or its assets.',
  },
  {
    term: 'Status Change',
    definition:
      'Any recorded transition in a license’s state — for example pending to active, active to delinquent, or active to inactive — captured as a discrete event in the record.',
  },
  {
    term: 'Cancellation / Inactive',
    definition:
      'A license that has been surrendered, revoked, expired, or otherwise made inactive. Signals a business closing, relocating, or exiting a license class.',
  },
  {
    term: 'Provisional',
    definition:
      'A temporary or conditional authorization that allows limited operation while a full license or inspection is finalized. Often time-boxed and subject to conditions.',
  },
]

const DATA_TERMS: Term[] = [
  {
    term: 'DBPR',
    definition:
      'The Florida Department of Business and Professional Regulation — the state agency that licenses and regulates beverage and food-service establishments through its Division of Alcoholic Beverages and Tobacco and Division of Hotels and Restaurants. DBPR is New Venue Data’s primary source of record.',
  },
  {
    term: 'Trigger Event',
    definition:
      'A normalized, classified change in a license record — such as new_filing, renewal, ownership_transfer, or cancellation — that New Venue Data detects on each refresh and can deliver to your systems in real time.',
  },
  {
    term: 'Webhook',
    definition:
      'An outbound HTTP callback New Venue Data sends to your endpoint the moment a trigger event is detected, so you receive license changes as a push instead of polling for them.',
    links: [{ label: 'Webhook docs', href: '/docs/webhooks' }],
  },
  {
    term: 'HMAC Signature',
    definition:
      'A keyed hash (HMAC-SHA256) included in every webhook request header. By recomputing it with your shared secret you can verify the payload genuinely came from New Venue Data and was not tampered with in transit.',
    links: [{ label: 'Webhook docs', href: '/docs/webhooks' }],
  },
  {
    term: 'Cursor Pagination',
    definition:
      'A stable way to page through large result sets using an opaque cursor token instead of page numbers, so newly inserted records never cause skipped or duplicated rows while you iterate.',
    links: [{ label: 'Pagination docs', href: '/docs/pagination' }],
  },
  {
    term: 'Entity Resolution',
    definition:
      'The process of matching a legal name, DBA name, and address across many filings to a single canonical business record — so one restaurant is not counted as several different licensees.',
  },
  {
    term: 'Geocoding',
    definition:
      'Converting a license’s street address into precise latitude/longitude coordinates, enabling radius search, territory mapping, and county-level filtering of license data.',
  },
  {
    term: 'Daily Refresh',
    definition:
      'New Venue Data re-ingests Florida DBPR records every day, diffs them against the prior snapshot, and emits the resulting trigger events — keeping your view of the market at most 24 hours behind source.',
  },
]

const LIQUOR_LIABILITY: Term[] = [
  {
    term: 'Dram Shop Liability',
    definition:
      'The legal theory that a business serving alcohol can be held liable for injury or damage a patron later causes. This exposure is the reason venues that serve alcohol carry liquor-liability coverage.',
    why: 'Every newly licensed on-premises venue inherits this exposure — making a new liquor-license filing an insurance buying signal.',
  },
  {
    term: 'Florida Dram Shop Act',
    code: 'Fla. Stat. 768.125',
    definition:
      'Florida is a limited dram-shop state. Under §768.125, a vendor that serves a person of lawful drinking age is generally not liable for that person’s later intoxication — liability attaches only in two narrow cases: willfully serving someone under 21, or knowingly serving a person “habitually addicted” to alcohol.',
    why: 'Narrow liability is not low risk: Florida venues still face seven-figure suits (a Tallahassee bar drew a $28.6M jury verdict in the Faircloth case before it was reversed on appeal), and defending a single claim can cost tens of thousands of dollars.',
    links: [{ label: 'Fla. Stat. §768.125 (Florida Senate)', href: 'https://www.flsenate.gov/Laws/Statutes/2023/768.125' }],
  },
  {
    term: 'Liquor Liability Insurance',
    definition:
      'A separate policy covering bodily injury and property damage arising from a business’s sale or service of alcohol. Standard general-liability policies exclude alcohol-related claims, so any venue that serves alcohol needs this as a distinct coverage.',
    why: 'No Florida statute mandates it, but local licensing authorities, commercial landlords, and lenders typically require proof of coverage before a venue can open — the same moment a new license filing becomes public.',
  },
  {
    term: 'Surplus Lines (E&S)',
    definition:
      'The excess-and-surplus (non-admitted) insurance market, where risks that standard “admitted” carriers decline are placed — often through specialty wholesale brokers. Bars, nightclubs, and late-night venues concentrate here.',
    why: 'New high-alcohol venues frequently land in the E&S market, so the agents and wholesalers who work it are natural buyers of a new-venue lead feed.',
  },
  {
    term: 'Comparative Fault (Dram Shop)',
    definition:
      'In March 2024 the Florida Supreme Court held that a §768.125 dram-shop claim is a negligence action, allowing a defendant venue to raise comparative-fault defenses — apportioning responsibility to the intoxicated patron and to other vendors.',
    why: 'It shapes how Florida liquor-liability claims are litigated and reserved, and confirms venues remain exposed even under the state’s limited statute.',
    links: [{ label: 'Fla. Supreme Court No. SC2022-0910', href: 'https://law.justia.com/cases/florida/supreme-court/2024/sc2022-0910.html' }],
  },
]

const SECTIONS: { id: string; eyebrow: string; heading: string; subtext: string; icon: typeof FileText; terms: Term[] }[] = [
  {
    id: 'license-types',
    eyebrow: 'License Types',
    heading: 'Florida License Types & Codes',
    subtext:
      'The DBPR license codes that classify every alcohol and food-service business in Florida — and what each one tells you about a prospect.',
    icon: FileText,
    terms: LICENSE_TYPES,
  },
  {
    id: 'status-events',
    eyebrow: 'License Status & Events',
    heading: 'License Status & Lifecycle Events',
    subtext:
      'The states a license moves through, from first filing to cancellation — each one a distinct, trackable signal.',
    icon: Activity,
    terms: STATUS_EVENTS,
  },
  {
    id: 'data-api',
    eyebrow: 'Data & API Terms',
    heading: 'Data & API Terminology',
    subtext:
      'How New Venue Data sources, normalizes, and delivers Florida license data through its API and webhooks.',
    icon: Database,
    terms: DATA_TERMS,
  },
  {
    id: 'liquor-liability',
    eyebrow: 'Liquor Liability & Dram-Shop Law',
    heading: 'Liquor Liability & Florida Dram-Shop Law',
    subtext:
      'Why a new alcohol license is an insurance event — the Florida dram-shop rules and coverage terms behind every new-venue lead.',
    icon: BookOpen,
    terms: LIQUOR_LIABILITY,
  },
]

const ALL_TERMS = [...LICENSE_TYPES, ...STATUS_EVENTS, ...DATA_TERMS, ...LIQUOR_LIABILITY]

const definedTermSetSchema = {
  '@context': 'https://schema.org',
  '@type': 'DefinedTermSet',
  name: 'New Venue Data Florida License Glossary',
  description:
    'Definitions of Florida liquor and food-service license types, statuses, and data/API terms used by New Venue Data.',
  url: 'https://newvenuedata.com/glossary',
  hasDefinedTerm: ALL_TERMS.map((t) => ({
    '@type': 'DefinedTerm',
    name: t.code ? `${t.term} (${t.code})` : t.term,
    description: t.definition,
    inDefinedTermSet: 'https://newvenuedata.com/glossary',
  })),
}

export default function GlossaryPage() {
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermSetSchema) }}
      />

      {/* Hero */}
      <section className="py-20 lg:py-28 gradient-hero">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-6">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium tracking-widest text-indigo-400 uppercase">
            <BookOpen className="h-3.5 w-3.5" />
            Glossary
          </span>
          <h1 className="text-display-lg text-[var(--ls-fg)]">
            Florida License Terminology, Explained
          </h1>
          <p className="text-lg text-[var(--ls-fg-2)] max-w-2xl">
            Florida DBPR license codes can be cryptic. This glossary decodes the liquor and
            food-service license types, statuses, and the data and API terms behind
            New Venue Data — so every SRX, 4COP, and trigger event is plain English.
          </p>

          {/* Jump nav */}
          <nav className="flex flex-wrap gap-3 pt-2">
            {SECTIONS.map((s) => (
              <Link
                key={s.id}
                href={`#${s.id}`}
                className="inline-flex items-center gap-2 rounded-lg border border-[var(--ls-border-2)] bg-[var(--ls-surface)] px-4 py-2 text-sm text-[var(--ls-fg-2)] transition-colors hover:border-indigo-400/50 hover:text-[var(--ls-fg)]"
              >
                <s.icon className="h-4 w-4 text-indigo-400" />
                {s.eyebrow}
              </Link>
            ))}
          </nav>
        </div>
      </section>

      {/* Glossary body */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 flex flex-col gap-20">
          {SECTIONS.map((section) => (
            <div key={section.id} id={section.id} className="flex flex-col gap-8 scroll-mt-24">
              <SectionHeading
                align="left"
                eyebrow={section.eyebrow}
                heading={section.heading}
                subtext={section.subtext}
              />

              <dl className="flex flex-col gap-4">
                {section.terms.map((t) => (
                  <div
                    key={t.term}
                    className="rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-6 transition-colors hover:border-[var(--ls-border-2)]"
                  >
                    <dt className="flex flex-wrap items-center gap-3">
                      <span className="text-[var(--ls-fg)] font-semibold">{t.term}</span>
                      {t.code && (
                        <span className="rounded-md border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 font-mono text-xs text-indigo-400">
                          {t.code}
                        </span>
                      )}
                    </dt>
                    <dd className="mt-2 text-sm text-[var(--ls-fg-2)] leading-relaxed">
                      {t.definition}
                      {t.links && (
                        <span className="mt-2 flex flex-wrap gap-4">
                          {t.links.map((l) => (
                            <Link
                              key={l.href}
                              href={l.href}
                              className="inline-flex items-center gap-1 text-xs font-medium text-indigo-400 transition-colors hover:text-[#818cf8]"
                            >
                              {l.label}
                              <ArrowRight className="h-3 w-3" />
                            </Link>
                          ))}
                        </span>
                      )}
                    </dd>
                    {t.why && (
                      <p className="mt-3 text-xs text-[var(--ls-fg-3)]">
                        <span className="text-[var(--ls-fg-4)]">Why it matters — </span>
                        {t.why}
                      </p>
                    )}
                  </div>
                ))}
              </dl>
            </div>
          ))}

          {/* Closing line */}
          <div className="rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface-2)] p-6 text-center">
            <p className="text-sm text-[var(--ls-fg-2)] leading-relaxed">
              Want to see exactly which of these license types and events we track across all 67
              counties?{' '}
              <Link
                href="/data-coverage"
                className="font-medium text-indigo-400 transition-colors hover:text-[#818cf8]"
              >
                Explore our Florida data coverage
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      <CtaBanner />
    </div>
  )
}
