export interface Industry {
  slug: string
  name: string
  /** Short label used in eyebrows and breadcrumbs, e.g. "Beverage Distributors". */
  headline: string
  /** The buyer's pain — what they struggle with today. Used as hero subtext. */
  pain: string
  /** How New Venue Data solves it — the "how it works for you" narrative. */
  solution: string
  /** Concrete, measurable outcomes. Rendered as a grid of cards. */
  outcomes: { stat: string; label: string; detail: string }[]
  /** Which license events matter most to this buyer, with why-it-matters copy. */
  relevantEvents: { event: string; why: string }[]
  /** One-line summary of the buying signal, used in metadata descriptions. */
  signal: string
}

export const INDUSTRIES: Industry[] = [
  {
    slug: 'distributors',
    name: 'Beverage Distributors',
    headline: 'Beverage Distributors',
    pain: 'Every new bar, restaurant, and taproom in Florida picks its beer, wine, and spirits suppliers in the weeks before opening — and you usually hear about it after a competitor already loaded the cooler. By the time a venue shows up on a delivery route or a review site, the distribution contract is signed.',
    solution:
      'New Venue Data turns the Florida DBPR license record into a real-time prospecting feed. The moment a 4COP, COP, or SRX license is filed, you get the business name, address, and license tier — months before the doors open. Filter the feed to the exact privilege you sell (1COP for beer-only accounts, 4COP/SRX for full-bar programs), route each lead to the rep who owns that territory, and push it straight into your CRM through the API. Your team calls the owner while the buildout budget is open and no supplier has been chosen.',
    outcomes: [
      {
        stat: '6–12 wks',
        label: 'Earlier than your competitors',
        detail: 'Reach owners during buildout, before the first delivery is scheduled.',
      },
      {
        stat: 'COP tier',
        label: 'Pre-qualified by privilege',
        detail: 'The license code tells you if the account pours beer, wine, or full spirits.',
      },
      {
        stat: '100%',
        label: 'Of new on-premise accounts',
        detail: 'Every consumption-on-premises filing in your county, the day it lands.',
      },
      {
        stat: '0',
        label: 'Manual record-pulling',
        detail: 'No scraping DBPR PDFs — leads arrive via API, webhook, or daily digest.',
      },
    ],
    relevantEvents: [
      {
        event: 'new_filing',
        why: 'A brand-new bar or restaurant is choosing its beverage suppliers right now.',
      },
      {
        event: 'ownership_transfer',
        why: 'A change of ownership re-opens the supplier decision at an existing account.',
      },
      {
        event: 'renewal',
        why: 'Confirms an active, paying venue worth a route-density or upsell conversation.',
      },
      {
        event: 'status_change',
        why: 'A license going active means the venue is cleared to start stocking inventory.',
      },
    ],
    signal:
      'Every new COP, 4COP, and SRX license filing is a venue choosing its beverage suppliers — caught the day it hits the DBPR record.',
  },
  {
    slug: 'pos',
    name: 'POS & Restaurant Tech',
    headline: 'POS & Restaurant Tech',
    pain: "A restaurant chooses its point-of-sale system once, early, and rarely switches. If you're not in the conversation during the buildout, you've lost the account for years. But new restaurants don't announce themselves until they're already live on a competitor's terminal — by which point ripping out hardware is a hard sell.",
    solution:
      'New Venue Data flags every food-service and special-restaurant (SRX) license the moment it is filed with the Florida DBPR — the earliest reliable public signal that a new venue is being built. SRX filings in particular mean a 150-seat-plus, full-bar restaurant with real ticket volume and a complex floor plan: exactly the operations that need modern POS, KDS, and payments. Pipe each filing into your sales tooling with the business name, address, and license type, score it by venue size, and hand your AEs a list of pre-opening restaurants before any incumbent vendor has demoed.',
    outcomes: [
      {
        stat: 'SRX',
        label: 'High-ticket venues, flagged',
        detail: 'Special-restaurant licenses mean 150+ seats and full-bar complexity.',
      },
      {
        stat: 'Pre-open',
        label: 'In before the incumbent',
        detail: 'Win the POS decision during buildout, not after a rip-and-replace.',
      },
      {
        stat: 'Daily',
        label: 'Fresh pipeline, automatically',
        detail: 'New food-service filings delivered to your CRM every business day.',
      },
      {
        stat: '1 system',
        label: 'Decided once, kept for years',
        detail: 'Be the first POS demo and lock in a multi-year platform account.',
      },
    ],
    relevantEvents: [
      {
        event: 'new_filing',
        why: 'A new restaurant is being built and has not chosen a POS or payments stack yet.',
      },
      {
        event: 'ownership_transfer',
        why: 'A new operator at an existing location often re-platforms its front of house.',
      },
      {
        event: 'address_change',
        why: 'A relocation or second location signals expansion — and a fresh hardware order.',
      },
      {
        event: 'status_change',
        why: 'A license activating means the venue is days from needing terminals on the floor.',
      },
    ],
    signal:
      'Every new food-service and SRX license filing is a restaurant about to choose its POS — surfaced before any competitor demos.',
  },
  {
    slug: 'payroll',
    name: 'Payroll & HR Providers',
    headline: 'Payroll & HR Providers',
    pain: 'A new restaurant or bar will hire 15 to 40 people before it serves a single guest — and it picks a payroll and HR provider in that same scramble. Generic small-business lead lists reach these owners weeks late, after they have already signed up with whoever their accountant or POS vendor recommended.',
    solution:
      'A liquor or food-service license filing is the cleanest early signal that a hospitality business is about to staff up. New Venue Data delivers each new Florida filing — business name, legal entity, address, and license type — the day it is recorded, so your reps reach the owner during the pre-opening hiring window. Filter to the high-headcount license types (SRX and full-service food licenses signal larger teams), enrich your CRM automatically through the API, and position payroll, onboarding, and compliance before the first W-4 is filled out.',
    outcomes: [
      {
        stat: '15–40',
        label: 'New hires per opening',
        detail: 'Each new food-service venue staffs a full front and back of house.',
      },
      {
        stat: 'Legal entity',
        label: 'On every record',
        detail: 'Business name, legal name, and DBA — clean data to seed your CRM.',
      },
      {
        stat: 'Week 1',
        label: 'In before payroll setup',
        detail: 'Reach the owner during hiring, not after they pick a competitor.',
      },
      {
        stat: 'Recurring',
        label: 'High-retention accounts',
        detail: 'Hospitality payroll is sticky, monthly revenue once you win the seat.',
      },
    ],
    relevantEvents: [
      {
        event: 'new_filing',
        why: 'A new venue is about to hire staff and needs payroll, onboarding, and tax setup.',
      },
      {
        event: 'ownership_transfer',
        why: 'New ownership usually re-evaluates payroll and HR vendors for the location.',
      },
      {
        event: 'renewal',
        why: 'An active, growing business is a candidate for HR, benefits, and time-tracking upsell.',
      },
      {
        event: 'status_change',
        why: 'A license going active confirms the venue is staffing up and running payroll now.',
      },
    ],
    signal:
      'Every new liquor and food-service license filing is a hospitality business about to hire and run its first payroll.',
  },
  {
    slug: 'suppliers',
    name: 'Restaurant Suppliers',
    headline: 'Restaurant Suppliers',
    pain: 'Whether you sell commercial kitchen equipment, FF&E, smallwares, uniforms, or food service, a new restaurant spends most of its opening budget in the eight weeks before launch — and it spends it once. If your catalog reaches the owner after the kitchen is built and the vendors are chosen, you are bidding on the refresh, not the buildout.',
    solution:
      'New Venue Data watches the Florida DBPR record and flags every new food-service and special-restaurant license as it is filed — the public starting gun for a buildout. You get the business name, address, and license type the day it lands, so your team reaches the owner while the equipment list, the supplier shortlist, and the opening budget are all still open. Filter by county to match your delivery footprint, route leads by venue size, and feed your CRM through the API so reps work fresh buildouts instead of cold-calling restaurants that opened last year.',
    outcomes: [
      {
        stat: '8 wks',
        label: 'Of open buildout budget',
        detail: 'Reach owners while equipment and supply decisions are still being made.',
      },
      {
        stat: 'By county',
        label: 'Matched to your routes',
        detail: 'Filter the feed to the counties your trucks already deliver to.',
      },
      {
        stat: 'New filings',
        label: 'Not stale directories',
        detail: 'Every lead is a venue being built now — not a year-old listing.',
      },
      {
        stat: 'API',
        label: 'Straight into your pipeline',
        detail: 'Webhook each filing to your CRM or pull a daily territory export.',
      },
    ],
    relevantEvents: [
      {
        event: 'new_filing',
        why: 'A new restaurant is in buildout and ordering equipment, smallwares, and supplies.',
      },
      {
        event: 'ownership_transfer',
        why: 'A new owner often refits the kitchen and re-bids its supply contracts.',
      },
      {
        event: 'address_change',
        why: 'A relocation or expansion means a second kitchen to outfit from scratch.',
      },
      {
        event: 'renewal',
        why: 'An established venue is a recurring account for consumables and replacements.',
      },
    ],
    signal:
      'Every new food-service and SRX license filing is a restaurant buildout — equipment, FF&E, and supply decisions still open.',
  },
]

export function getIndustry(slug: string): Industry | undefined {
  return INDUSTRIES.find((industry) => industry.slug === slug)
}
