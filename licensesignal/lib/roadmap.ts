export type RoadmapStatus = 'planned' | 'in_progress' | 'shipped'

export interface RoadmapItem {
  id: string
  title: string
  description: string
  status: RoadmapStatus
  category: string
  /** Base vote count seeded server-side; a user's local upvote stacks on top. */
  votes: number
}

export const ROADMAP_CATEGORIES = [
  'Coverage',
  'API',
  'Webhooks',
  'Integrations',
  'Dashboard',
  'Data Quality',
] as const

export const ROADMAP_ITEMS: RoadmapItem[] = [
  // ---- Shipped ----
  {
    id: 'hmac-signed-webhooks',
    title: 'HMAC-signed webhook payloads',
    description:
      'Every webhook delivery ships with an X-New Venue Data-Signature header so you can cryptographically verify the payload originated from us and was untampered in transit.',
    status: 'shipped',
    category: 'Webhooks',
    votes: 214,
  },
  {
    id: 'cursor-pagination-v2',
    title: 'Stable cursor pagination v2',
    description:
      'Opaque, deterministic cursors across every list endpoint so large exports and incremental syncs stay consistent even as fresh filings land underneath you.',
    status: 'shipped',
    category: 'API',
    votes: 178,
  },
  {
    id: 'openapi-spec',
    title: 'OpenAPI 3.1 specification',
    description:
      'The full API described by a machine-readable spec at /openapi.json so you can generate type-safe clients and import into Postman or Insomnia.',
    status: 'shipped',
    category: 'API',
    votes: 156,
  },
  {
    id: 'scheduled-csv-exports',
    title: 'Scheduled CSV exports',
    description:
      'Recurring daily, weekly, or monthly CSV exports filtered by county, license type, and event class — delivered to a signed URL or pushed straight to your S3 bucket.',
    status: 'shipped',
    category: 'Data Quality',
    votes: 132,
  },

  // ---- In Progress ----
  {
    id: 'graphql-endpoint',
    title: 'GraphQL endpoint',
    description:
      'A typed GraphQL surface alongside REST so you can request exactly the license fields you need in a single round trip, with the same filters as the list API.',
    status: 'in_progress',
    category: 'API',
    votes: 241,
  },
  {
    id: 'remaining-fl-counties',
    title: 'Full coverage of all 67 Florida counties',
    description:
      'Daily DBPR ingestion for the final six rural counties, bringing every Florida market under the same refresh SLAs the rest of the state already enjoys.',
    status: 'in_progress',
    category: 'Coverage',
    votes: 327,
  },
  {
    id: 'dashboard-saved-views',
    title: 'Saved views & shareable filters',
    description:
      'Save a county and license-type filter combination as a named view, share it with your team by URL, and pin the ones you check every morning.',
    status: 'in_progress',
    category: 'Dashboard',
    votes: 119,
  },
  {
    id: 'webhook-retry-dashboard',
    title: 'Webhook delivery & retry dashboard',
    description:
      'Inspect every webhook attempt, view response codes and payloads, and manually replay failed deliveries from the dashboard without opening a support ticket.',
    status: 'in_progress',
    category: 'Webhooks',
    votes: 167,
  },

  // ---- Planned ----
  {
    id: 'georgia-expansion',
    title: 'Georgia license data',
    description:
      'Extend ingestion beyond Florida into Georgia, starting with liquor and food-service licenses in the Atlanta metro before rolling out statewide.',
    status: 'planned',
    category: 'Coverage',
    votes: 398,
  },
  {
    id: 'entity-resolution-api',
    title: 'Entity resolution API',
    description:
      'A dedicated endpoint that links a business across multiple licenses, DBAs, and ownership transfers so you can build a single canonical record per operator.',
    status: 'planned',
    category: 'Data Quality',
    votes: 203,
  },
  {
    id: 'salesforce-connector',
    title: 'Salesforce connector',
    description:
      'Push new license events straight into Salesforce as leads or custom objects, with field mapping and dedupe rules configured from the dashboard — no middleware required.',
    status: 'planned',
    category: 'Integrations',
    votes: 184,
  },
  {
    id: 'zapier-integration',
    title: 'Zapier & Make integration',
    description:
      'Trigger any of thousands of downstream apps the moment a filtered license event fires, without writing or hosting webhook-handling code yourself.',
    status: 'planned',
    category: 'Integrations',
    votes: 152,
  },
  {
    id: 'historical-bulk-backfill',
    title: 'Self-serve historical bulk backfill',
    description:
      'Request a one-click backfill of multiple years of historical filings for any county and license type, delivered as a compressed dataset for trend modeling.',
    status: 'planned',
    category: 'Data Quality',
    votes: 96,
  },
  {
    id: 'realtime-streaming-api',
    title: 'Real-time streaming API (SSE)',
    description:
      'Subscribe to a live server-sent-events stream of license events as they are ingested, for teams who want sub-minute latency without polling the list API.',
    status: 'planned',
    category: 'API',
    votes: 211,
  },
]
