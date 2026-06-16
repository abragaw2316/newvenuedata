export interface CaseStudy {
  slug: string
  company: string
  industry: string
  challenge: string
  solution: string
  results: string[]
  quote: string
  quoteAuthor: string
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: 'regional-beverage-distributor',
    company: 'A regional beverage distributor',
    industry: 'Beverage Distribution',
    challenge:
      'Territory reps were finding out about new bars and restaurants weeks after they opened — usually when a competing distributor had already placed the first order. Their lead list came from a quarterly third-party scrape that was stale on arrival, full of duplicates, and missing the exact license type that signaled buying intent. Reps wasted hours every week qualifying dead addresses instead of working live accounts.',
    solution:
      'They wired New Venue Data webhooks into their CRM, filtering for new SRX, COP, and BEV filings across their five-county territory. Every day-of-filing event now creates a pre-qualified lead routed to the right rep by county, with normalized business name, mapped address, and license type already attached. No more manual scrubbing — the signal arrives the morning a license is filed.',
    results: [
      '3.2x more net-new accounts opened per rep per quarter',
      'First-contact-to-competitor lead time cut from ~21 days to under 48 hours',
      '~9 hours/week of manual list cleanup eliminated per rep',
      'Won 41% of newly-licensed venues in territory, up from an estimated 12%',
    ],
    quote:
      'We used to chase openings. Now the openings show up in our CRM before anyone else even knows the place exists. The first call wins, and we are almost always the first call.',
    quoteAuthor: 'Director of Sales',
  },
  {
    slug: 'hospitality-pos-platform',
    company: 'A hospitality POS platform',
    industry: 'Point-of-Sale Software',
    challenge:
      'The growth team knew that restaurants choose their POS system months before opening, but they had no reliable way to find venues during that buildout window. Outbound was a guessing game built on news mentions and commercial real estate rumors. By the time a venue appeared in a paid business-data feed, it had already signed with a competitor, and the team was burning ad spend retargeting accounts that were no longer in market.',
    solution:
      'New Venue Data new_filing events now feed a pre-opening pipeline. The moment a food-service or liquor license is filed, the venue enters a nurture sequence timed to the typical 90-to-120-day buildout. Sales engages with demos while the operator is still selecting vendors, and the API enrichment fields let them prioritize multi-location operators automatically.',
    results: [
      '52% increase in qualified demos booked from outbound',
      'Average sales cycle shortened by 5 weeks by engaging pre-opening',
      'CAC on outbound-sourced deals down 34%',
      'Built a 1,800-venue pre-opening pipeline within the first 90 days',
    ],
    quote:
      'The buildout window is everything in our business. New Venue Data is the only source that puts us in front of an operator while the checkbook is still open instead of after they have already signed.',
    quoteAuthor: 'VP of Growth',
  },
  {
    slug: 'commercial-payroll-provider',
    company: 'A commercial payroll provider',
    industry: 'Payroll & HR Services',
    challenge:
      'New restaurants and bars are ideal payroll accounts, but the team typically learned about them three to six months after opening — long after a competitor had onboarded the staff. Their internal data engineers had built a brittle scraper against the state license portal, but it broke every time the site changed, produced unresolved duplicate entities, and consumed roughly a full engineer-week each month just to keep limping along.',
    solution:
      'They retired the in-house scraper and switched to New Venue Data exports plus a daily webhook feed. Normalized, deduplicated, geocoded license events now land directly in their data warehouse with FCRA-safe business-entity data only. The freed-up engineering time went back to product, and the sales team finally works fresh, accurate leads at the moment of filing.',
    results: [
      'Retired a fragile internal scraper, reclaiming ~1 engineer-week/month',
      '28% lift in new-business win rate by reaching operators first',
      'Lead-to-close time improved by 6 weeks on average',
      'Duplicate and dead-record rate dropped from ~30% to under 2%',
    ],
    quote:
      'We were spending real engineering payroll to maintain a scraper that still gave us dirty data. Switching to New Venue Data was cheaper than one engineer and the data is dramatically cleaner.',
    quoteAuthor: 'Head of Revenue Operations',
  },
]

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((c) => c.slug === slug)
}
