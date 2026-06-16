export interface Alternative {
  /** URL slug under /alternatives/[slug] */
  slug: string
  /** Generic name of the alternative approach — never a real company */
  name: string
  /** One-line plain-English description shown in the index and hero */
  summary: string
  /** Why this approach falls short (the "their limitations" column) */
  theirLimitations: string[]
  /** Why New Venue Data does it better (the "our advantages" column) */
  ourAdvantages: string[]
  /** The bottom-line takeaway shown in the verdict callout */
  verdict: string
}

export const ALTERNATIVES: Alternative[] = [
  {
    slug: 'manual-scraping',
    name: 'Scraping DBPR yourself',
    summary:
      'Standing up your own scraper against the state license portal — writing the crawler, parsing the pages, and babysitting it forever so the data keeps flowing.',
    theirLimitations: [
      'You own a brittle crawler that breaks every time the source site changes its markup, pagination, or rate limits.',
      'Raw scraped rows arrive unnormalized — inconsistent casing, abbreviations, and duplicate entities you have to reconcile by hand.',
      'No geocoding, no entity resolution, and no event detection: you only get whatever the page happens to show on the day you scraped it.',
      'Catching the moment a license is filed means re-crawling constantly, which gets you throttled, blocked, or stuck on stale snapshots.',
      'Engineering time you spend maintaining the pipeline is time not spent on your actual product, and the cost never goes away.',
      'No audit trail, no SLA, and no one to call when the data silently stops updating before a big campaign.',
    ],
    ourAdvantages: [
      'We run and monitor the ingestion pipeline for you, so a source-site change is our problem to fix, not yours.',
      'Every record is cleaned, deduplicated, and resolved to a single canonical business and legal entity before you ever see it.',
      'Addresses are geocoded to latitude and longitude, ready to drop onto a map or filter by radius.',
      'New filings surface as structured events within hours, pushed to you by webhook — no polling, no re-crawling.',
      'A documented REST API with cursors, filters, and a search endpoint replaces the parsing code you would otherwise own.',
      'You get a status page, change logs, and a real support channel instead of a cron job and a prayer.',
    ],
    verdict:
      'Scraping it yourself looks free until you add up the engineering hours, the broken builds, and the campaigns that ran on stale data. New Venue Data turns a fragile side project into a single API call with someone on the hook to keep it running.',
  },
  {
    slug: 'data-brokers',
    name: 'Generic data brokers',
    summary:
      'Buying a broad firmographic feed from a general-purpose data broker and hoping the Florida license signal you actually need is buried somewhere inside it.',
    theirLimitations: [
      'Generic firmographic feeds are built for everyone, so the license-level detail you care about is shallow, delayed, or missing entirely.',
      'Coverage is national and thin rather than deep on Florida, so niche license types and county nuance get flattened away.',
      'Records are refreshed on a slow batch cycle, so a "new" business may have opened months before it shows up.',
      'You typically buy the whole panel and pay for a haystack of companies that will never be relevant to your motion.',
      'There is rarely an event signal — you get a static profile, not a "this license was just filed" trigger.',
      'Provenance is opaque: you cannot trace a row back to the underlying public filing to verify or enrich it.',
    ],
    ourAdvantages: [
      'We are specialized on Florida DBPR licenses, so the field that matters most to you is the core of the product, not a footnote.',
      'Deep, county-level coverage with the actual license codes, statuses, and filing dates intact.',
      'Fresh data: new filings are detected and delivered as events, not folded into a quarterly refresh.',
      'You query exactly the license types, counties, and event types you want and pay for signal, not bulk.',
      'Every record links back to its source filing, so you can verify provenance and enrich downstream with confidence.',
      'Event-driven webhooks mean you act on a brand-new business the week it appears, while it is still picking vendors.',
    ],
    verdict:
      'A general data broker gives you a little bit about everyone. New Venue Data gives you everything about the Florida licenses you actually sell against — fresher, deeper, and tied to the exact moment a new business appears.',
  },
  {
    slug: 'dbpr-portal',
    name: 'The DBPR portal',
    summary:
      'Using the state license lookup site directly — searching record by record in a browser whenever you need to check or find a business.',
    theirLimitations: [
      'The portal is built for one-off human lookups, not for pulling or monitoring data at any kind of scale.',
      'There is no API, so the only way to get data out is to read it on screen or copy it by hand.',
      'You cannot subscribe to "tell me when something new is filed" — you have to remember to go look, over and over.',
      'Results are not geocoded, deduplicated, or normalized, so comparing or mapping records is manual work.',
      'Bulk discovery is impractical: there is no clean way to ask for every license of a given type filed this week across a county.',
      'Nothing integrates with your CRM, your spreadsheet, or your outreach tooling without a person in the loop.',
    ],
    ourAdvantages: [
      'The same public records, delivered programmatically through a documented API your systems can call directly.',
      'Filter and paginate across the whole dataset by county, license type, event type, status, and free-text search.',
      'Subscribe to new filings with webhooks so the data comes to you the moment it appears — no manual checking.',
      'Records arrive normalized, deduplicated, and geocoded, ready for mapping, scoring, and routing.',
      'Pull every matching license in one query instead of clicking through result pages one at a time.',
      'Drop the feed straight into your CRM or pipeline so new businesses become leads automatically.',
    ],
    verdict:
      'The portal is perfect for checking a single license once. The moment you need to monitor a market, enrich a list, or feed a sales motion, you need an API — and that is exactly what New Venue Data puts on top of the same public data.',
  },
  {
    slug: 'buying-lists',
    name: 'Buying static lists',
    summary:
      'Paying for a one-time export of Florida businesses — a spreadsheet that is accurate the day it ships and decaying every day after.',
    theirLimitations: [
      'A purchased list is a snapshot: it is already going stale by the time it lands in your inbox.',
      'It captures who existed on export day and misses every business that files a license the week after.',
      'You re-buy the whole list to refresh it, paying again for the rows you already had.',
      'Lists are usually flat and unstructured — limited fields, no event history, no link back to the filing.',
      'Addresses are rarely geocoded or standardized, so territory and radius work is a manual cleanup project.',
      'There is no trigger for net-new activity, so you are always reaching out late, after competitors who watch the feed.',
    ],
    ourAdvantages: [
      'A live feed instead of a snapshot — the dataset stays current because we keep ingesting filings continuously.',
      'New businesses surface as they file, so you catch them in the buildout window rather than months later.',
      'No re-buying: you query the current state any time and only get fresh, deduplicated records.',
      'Structured records with license codes, statuses, dates, and source links — not a flat, lossy spreadsheet.',
      'Geocoded, normalized addresses ready for mapping and territory assignment out of the box.',
      'Event webhooks turn "a new license was just filed" into a real-time trigger for your outreach.',
    ],
    verdict:
      'A static list is worth the most on the day you buy it and a little less every day after. New Venue Data replaces the buy-and-decay cycle with a live feed that is always current and alerts you the instant a new business appears.',
  },
  {
    slug: 'national-license-feeds',
    name: 'A national license-data feed',
    summary:
      'Subscribing to a broad, multi-state license or "business trigger" feed and hoping its Florida coverage is deep and fast enough to act on.',
    theirLimitations: [
      'National feeds spread thin across every state, so Florida’s license codes, county nuance, and series detail get flattened into generic fields.',
      'Most refresh on a weekly or biweekly cycle — by the time a "new" venue surfaces, the buildout decisions (and the first insurance call) may already be made.',
      'They typically ship the full active-license universe, not a clean "filed this week" delta, so you build and maintain the new-versus-existing diff yourself.',
      'Coverage and freshness vary by state, with no guarantee Florida is treated as a first-class, day-of source.',
      'Pricing is built for national enterprise buyers, so you pay for fifty states of data to use one.',
      'There is rarely an insurance-specific framing — no on-premises versus off-premises split, no new-venue trigger tuned to a coverage window.',
    ],
    ourAdvantages: [
      'Florida is the whole product, not one-fiftieth of it — full DBPR depth with license codes, series, statuses, counties, and filing dates intact.',
      'New filings surface within hours of hitting the public record and arrive as discrete events, not folded into a weekly batch.',
      'You receive the "new this week" delta already computed — no diffing the full universe yourself.',
      'On-premises venues — the dram-shop and liquor-liability targets — are classified and filterable out of the box.',
      'Priced for a Florida-focused agent or distributor, so you pay for the signal you actually sell against.',
      'Every record links back to its source filing, so provenance is verifiable and enrichment is straightforward.',
    ],
    verdict:
      'A national feed is wide but shallow and slow. To win brand-new Florida venues before competitors, depth on one state plus day-of freshness beats fifty states refreshed every couple of weeks — exactly the tradeoff New Venue Data is built around.',
  },
]

export function getAlternative(slug: string): Alternative | undefined {
  return ALTERNATIVES.find((a) => a.slug === slug)
}
