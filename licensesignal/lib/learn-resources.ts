export type ResourceType = 'Guide' | 'Tutorial' | 'Video'

export interface LearnResource {
  slug: string
  title: string
  type: ResourceType
  topic: string
  excerpt: string
  minutes: number
}

export interface Webinar {
  title: string
  when: string
  description: string
  status: 'upcoming' | 'recorded'
}

export interface PodcastEpisode {
  number: number
  title: string
  description: string
  duration: string
}

export const LEARN_RESOURCES: LearnResource[] = [
  {
    slug: 'first-api-call',
    title: 'Make your first New Venue Data API call',
    type: 'Tutorial',
    topic: 'Getting Started',
    excerpt: 'Authenticate, hit the licenses endpoint, and parse your first batch of Florida filings in under five minutes.',
    minutes: 5,
  },
  {
    slug: 'building-a-prospecting-pipeline',
    title: 'Build a real-time prospecting pipeline',
    type: 'Guide',
    topic: 'Use Cases',
    excerpt: 'Wire new-filing webhooks into your CRM so reps are notified the day a license is filed.',
    minutes: 12,
  },
  {
    slug: 'webhook-signatures',
    title: 'Verify webhook signatures correctly',
    type: 'Tutorial',
    topic: 'Webhooks',
    excerpt: 'Validate the HMAC-SHA256 signature on every delivery in Node and Python so you never trust a forged payload.',
    minutes: 8,
  },
  {
    slug: 'filtering-by-territory',
    title: 'Filter filings down to a sales territory',
    type: 'Guide',
    topic: 'Data',
    excerpt: 'Combine county, city, and license-type filters to deliver each rep exactly the accounts they own.',
    minutes: 7,
  },
  {
    slug: 'understanding-license-types',
    title: 'Understanding Florida license types',
    type: 'Video',
    topic: 'Data',
    excerpt: 'A quick tour of SRX, COP, BEV, and food-service permits — and what each one signals about a new business.',
    minutes: 9,
  },
  {
    slug: 'cursor-pagination',
    title: 'Paginate large pulls with cursors',
    type: 'Tutorial',
    topic: 'API',
    excerpt: 'Reliably page through tens of thousands of records without dropping or duplicating rows.',
    minutes: 6,
  },
  {
    slug: 'scoring-leads',
    title: 'Score new filings by buying intent',
    type: 'Guide',
    topic: 'Use Cases',
    excerpt: 'A practical heuristic for ranking which new restaurants and bars to call first.',
    minutes: 11,
  },
  {
    slug: 'exports-to-warehouse',
    title: 'Stream exports into your data warehouse',
    type: 'Guide',
    topic: 'Integrations',
    excerpt: 'Schedule daily CSV/JSON drops to S3 and load them into Snowflake or BigQuery.',
    minutes: 10,
  },
]

export const WEBINARS: Webinar[] = [
  {
    title: 'From filing to first call: building a Florida prospecting engine',
    when: 'July 23, 2026 · 1:00 PM ET',
    description: 'A live walkthrough of turning license filings into booked meetings, with a Q&A for sales and ops teams.',
    status: 'upcoming',
  },
  {
    title: 'Webhooks deep dive: real-time license events',
    when: 'August 14, 2026 · 2:00 PM ET',
    description: 'Our engineering team covers signing, retries, and idempotent delivery patterns.',
    status: 'upcoming',
  },
  {
    title: 'The 2026 Florida hospitality opening report',
    when: 'Recorded June 2026',
    description: 'A data-driven look at where new restaurants and bars are opening across the state.',
    status: 'recorded',
  },
  {
    title: 'FCRA-safe B2B data: what business-entity data means',
    when: 'Recorded May 2026',
    description: 'How to use public-records business data compliantly for sales and intelligence.',
    status: 'recorded',
  },
]

export const PODCAST_EPISODES: PodcastEpisode[] = [
  {
    number: 6,
    title: 'Why timing beats targeting in B2B sales',
    description: 'How being first in the door changes win rates for distributors and suppliers.',
    duration: '34 min',
  },
  {
    number: 5,
    title: 'Inside the Florida DBPR data pipeline',
    description: 'The unglamorous work of normalizing messy public records into clean events.',
    duration: '41 min',
  },
  {
    number: 4,
    title: 'Building a data company on public records',
    description: 'Lessons from turning open government data into a real-time product.',
    duration: '38 min',
  },
  {
    number: 3,
    title: 'What a liquor license actually tells you',
    description: 'Reading the signals in a new filing — concept, size, and timeline.',
    duration: '29 min',
  },
]
