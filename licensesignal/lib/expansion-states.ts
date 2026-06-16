export interface ExpansionState {
  slug: string
  name: string
  /** Planned launch window, e.g. "Q3 2026". */
  status: string
  /** One- or two-sentence description used in the hero. */
  blurb: string
  /** Approximate number of counties in the state. */
  counties: number
  /** Short bullet points describing what the feed will include at launch. */
  highlights: string[]
}

export const EXPANSION_STATES: ExpansionState[] = [
  {
    slug: 'texas',
    name: 'Texas',
    status: 'Q3 2026',
    blurb:
      'Texas is next on the New Venue Data roadmap. The Texas Alcoholic Beverage Commission publishes its full license file as daily open data, so we can surface every new TABC permit the day it posts — paired with new state sales-tax permits as an early new-business signal — through the same API, webhooks, and exports you use for Florida.',
    counties: 254,
    highlights: [
      'Every new TABC license and permit statewide, from the daily Texas open-data feed',
      'New sales-tax permits (with NAICS codes) as an early new-business signal, via the Texas Comptroller',
      'Coverage across Houston, Dallas–Fort Worth, Austin, and San Antonio metros',
      'New filings, renewals, and ownership transfers',
      'Same API, webhooks, and CSV exports you already use for Florida',
    ],
  },
  {
    slug: 'georgia',
    name: 'Georgia',
    status: 'Q4 2026',
    blurb:
      'Georgia joins the New Venue Data coverage map in late 2026, built on the Georgia Department of Revenue’s statewide active alcohol-license records — from the Atlanta metro to the coast — delivered through the same API and webhooks you use today.',
    counties: 159,
    highlights: [
      'Statewide alcohol-license accounts from the Georgia Dept. of Revenue file',
      'Food-service and retail permit activity',
      'Full Atlanta metro plus Savannah, Augusta, and Columbus coverage',
      'New filings, renewals, and ownership transfers',
      'Drop-in addition to your existing New Venue Data integration',
    ],
  },
  {
    slug: 'north-carolina',
    name: 'North Carolina',
    status: 'Evaluating',
    blurb:
      'North Carolina is under evaluation as a future New Venue Data market. The NC Alcoholic Beverage Control Commission publishes permit data we are assessing for a statewide new-venue feed — join the waitlist to push it up the roadmap.',
    counties: 100,
    highlights: [
      'NC ABC retail alcohol permit activity statewide',
      'Charlotte, Raleigh–Durham, and Greensboro metro coverage',
      'New filings, renewals, and status changes',
      'Same API, webhooks, and CSV exports as Florida',
      'Waitlist open — launch priority set by demand',
    ],
  },
]

export function getExpansionState(slug: string): ExpansionState | undefined {
  return EXPANSION_STATES.find((state) => state.slug === slug)
}
