export type HelpBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'code'; text: string }

export type HelpCategorySlug =
  | 'getting-started'
  | 'api-keys'
  | 'webhooks'
  | 'billing'
  | 'data-coverage'
  | 'account'

export interface HelpCategory {
  slug: HelpCategorySlug
  name: string
  description: string
}

export interface HelpArticle {
  slug: string
  title: string
  category: HelpCategorySlug
  excerpt: string
  body: HelpBlock[]
}

export const HELP_CATEGORIES: HelpCategory[] = [
  {
    slug: 'getting-started',
    name: 'Getting Started',
    description:
      'Set up your workspace, run your first query, and understand how New Venue Data data is structured.',
  },
  {
    slug: 'api-keys',
    name: 'API & Keys',
    description:
      'Authenticate requests, manage keys, paginate, filter, and stay inside your rate limits.',
  },
  {
    slug: 'webhooks',
    name: 'Webhooks',
    description:
      'Receive new license filings in real time, verify signatures, and recover from failures.',
  },
  {
    slug: 'billing',
    name: 'Billing',
    description:
      'Plans, invoices, usage metering, upgrades, and how trials convert to paid accounts.',
  },
  {
    slug: 'data-coverage',
    name: 'Data & Coverage',
    description:
      'Which counties and license types we track, how fresh the data is, and how records are matched.',
  },
  {
    slug: 'account',
    name: 'Account',
    description:
      'Team members, roles, single sign-on, security settings, and closing your account.',
  },
]

export const HELP_ARTICLES: HelpArticle[] = [
  // ---------------------------------------------------------------- Getting Started
  {
    slug: 'quickstart-first-query',
    title: 'Quickstart: run your first license query',
    category: 'getting-started',
    excerpt:
      'Go from a fresh account to your first batch of Florida license records in under five minutes.',
    body: [
      {
        type: 'p',
        text: 'New Venue Data turns public Florida business-license filings into a clean, queryable feed. This quickstart walks you from signup to your first set of records so you can see the shape of the data before you write a line of integration code.',
      },
      { type: 'h2', text: 'Step 1 — Create a workspace' },
      {
        type: 'p',
        text: 'After you confirm your email, you land in a workspace. A workspace is the container for your API keys, team members, webhooks, and billing. Most companies use one workspace per product or per environment (for example, a separate sandbox workspace for staging).',
      },
      { type: 'h2', text: 'Step 2 — Grab a key' },
      {
        type: 'p',
        text: 'Open Settings → API Keys and create a key. Copy the secret immediately — we only show it once. Keep it server-side; never ship it in a browser bundle or mobile app.',
      },
      { type: 'h2', text: 'Step 3 — Make a request' },
      {
        type: 'p',
        text: 'The /licenses endpoint returns the most recent filings, newest first. Pass your key as a bearer token:',
      },
      {
        type: 'code',
        text: 'curl https://api.newvenuedata.com/v1/licenses?limit=5 \\\n  -H "Authorization: Bearer ls_live_your_key_here"',
      },
      {
        type: 'p',
        text: 'You will get back a page of license records — each one a business that just filed, with its name, address, license type, status, and the event that triggered the record.',
      },
      { type: 'h2', text: 'What to do next' },
      {
        type: 'list',
        items: [
          'Narrow the feed with filters like county, license_type, and event_type.',
          'Set up a webhook so new filings are pushed to you instead of polled.',
          'Read "Understanding a license record" to learn what every field means.',
        ],
      },
    ],
  },
  {
    slug: 'understanding-a-license-record',
    title: 'Understanding a license record',
    category: 'getting-started',
    excerpt:
      'A field-by-field tour of the license object so you know exactly what each value represents.',
    body: [
      {
        type: 'p',
        text: 'Every record we return describes one license event for one business. Knowing what each field means saves you from guessing later, so here is the whole object.',
      },
      { type: 'h2', text: 'Identity fields' },
      {
        type: 'list',
        items: [
          'id — our stable, unique identifier for the record. Use this as your foreign key.',
          'licenseNumber — the number assigned by the issuing authority.',
          'businessName — the public-facing name the business operates under.',
          'legalName — the registered legal entity name, which often differs from the business name.',
          'dbaName — the "doing business as" name when one is filed.',
        ],
      },
      { type: 'h2', text: 'Classification fields' },
      {
        type: 'list',
        items: [
          'licenseType — the category of license, such as food service or beverage.',
          'status — the current state of the license (for example active, pending, or expired).',
          'eventType — what happened: a new filing, a renewal, a status change, and so on.',
        ],
      },
      { type: 'h2', text: 'Location and timing' },
      {
        type: 'list',
        items: [
          'address — a nested object with street, city, county, state, zip, lat, and lng.',
          'filedDate — when the filing was submitted to the authority.',
          'effectiveDate — when the license takes effect.',
          'eventTimestamp — when the event we are reporting occurred, in UTC.',
          'sourceUrl — a link back to the underlying public record.',
        ],
      },
      {
        type: 'p',
        text: 'Treat id as the source of truth for deduplication. The same physical business can appear in multiple records over time as it renews or changes status, and each of those is a distinct event with its own id.',
      },
    ],
  },
  {
    slug: 'core-concepts-glossary',
    title: 'Core concepts: events, records, and feeds',
    category: 'getting-started',
    excerpt:
      'The three ideas that everything in New Venue Data is built on, explained without jargon.',
    body: [
      {
        type: 'p',
        text: 'Almost every question we get traces back to one of three concepts. Understanding them up front makes the rest of the product feel obvious.',
      },
      { type: 'h2', text: 'An event is something that happened' },
      {
        type: 'p',
        text: 'When a business files for a new license, renews one, or changes status, that is an event. Events are immutable — once we observe one, it never changes. New information about the same business arrives as a new event, not an edit to an old one.',
      },
      { type: 'h2', text: 'A record captures an event' },
      {
        type: 'p',
        text: 'Each record is the structured, deduplicated version of a single event. It carries the business details plus the event metadata. Because events are immutable, records are too — which makes them safe to cache.',
      },
      { type: 'h2', text: 'A feed is a filtered stream of records' },
      {
        type: 'p',
        text: 'A feed is just records that match a set of filters, ordered newest first. You can consume a feed by polling the API or by subscribing to a webhook. The same filters work in both places, so you can prototype with polling and switch to webhooks without changing your logic.',
      },
      {
        type: 'list',
        items: [
          'Events are immutable facts about a business.',
          'Records are the structured form of those events.',
          'Feeds are filtered, ordered streams of records you can poll or subscribe to.',
        ],
      },
    ],
  },
  // ---------------------------------------------------------------- API & Keys
  {
    slug: 'authentication-and-api-keys',
    title: 'Authenticating requests with API keys',
    category: 'api-keys',
    excerpt:
      'How bearer tokens work, where to store them, and how to rotate a key without downtime.',
    body: [
      {
        type: 'p',
        text: 'Every request to the API is authenticated with a secret key sent as a bearer token in the Authorization header. There are no sessions or cookies — each request stands alone.',
      },
      { type: 'h2', text: 'Sending the key' },
      {
        type: 'code',
        text: 'Authorization: Bearer ls_live_your_key_here',
      },
      {
        type: 'p',
        text: 'Live keys are prefixed with ls_live_ and sandbox keys with ls_test_. Sandbox keys hit the same endpoints but return synthetic data and never bill against your plan.',
      },
      { type: 'h2', text: 'Storing keys safely' },
      {
        type: 'list',
        items: [
          'Keep secrets in environment variables or a secrets manager, never in source control.',
          'Use server-side code only — a key in front-end JavaScript is a public key.',
          'Scope keys per environment so a leaked staging key cannot touch production data.',
        ],
      },
      { type: 'h2', text: 'Rotating without downtime' },
      {
        type: 'p',
        text: 'Create the new key first, deploy it to your services, confirm traffic is flowing on the new key, then revoke the old one. Because keys are independent, both work simultaneously during the overlap, so there is no window where requests fail.',
      },
    ],
  },
  {
    slug: 'pagination-with-cursors',
    title: 'Paginating results with cursors',
    category: 'api-keys',
    excerpt:
      'Use the cursor parameter to walk through large result sets reliably, even as new records arrive.',
    body: [
      {
        type: 'p',
        text: 'List endpoints return at most a page of records at a time. To get the next page, you follow a cursor rather than incrementing an offset. Cursor pagination is stable: new filings arriving mid-walk will not shift or duplicate rows you already fetched.',
      },
      { type: 'h2', text: 'How it works' },
      {
        type: 'p',
        text: 'Each response includes a next_cursor when more results exist. Pass it back as the cursor query parameter to fetch the following page. When next_cursor is null, you have reached the end.',
      },
      {
        type: 'code',
        text: 'GET /v1/licenses?county=Miami-Dade&limit=100\n# response: { "data": [...], "next_cursor": "c_8f21a" }\n\nGET /v1/licenses?county=Miami-Dade&limit=100&cursor=c_8f21a',
      },
      { type: 'h2', text: 'Best practices' },
      {
        type: 'list',
        items: [
          'Keep your filters identical across every page of the same walk — changing them invalidates the cursor.',
          'Store the last cursor you successfully processed so you can resume after a crash.',
          'Do not try to construct cursors yourself; treat them as opaque strings.',
        ],
      },
    ],
  },
  {
    slug: 'filtering-the-license-feed',
    title: 'Filtering the license feed',
    category: 'api-keys',
    excerpt:
      'Combine county, license type, status, event type, and search filters to get exactly the records you want.',
    body: [
      {
        type: 'p',
        text: 'The list endpoint accepts several filters that you can mix and match. Every filter narrows the feed; combining them is an AND, so more filters means fewer, more targeted records.',
      },
      { type: 'h2', text: 'Available filters' },
      {
        type: 'list',
        items: [
          'county — restrict to one Florida county, e.g. county=Orange.',
          'license_type — restrict to a single license category.',
          'event_type — only new filings, renewals, or status changes.',
          'status — active, pending, expired, and so on.',
          'q — full-text search across business and legal names.',
        ],
      },
      { type: 'h2', text: 'Example: new restaurant filings in one county' },
      {
        type: 'code',
        text: 'GET /v1/licenses?county=Hillsborough\n  &license_type=food-service\n  &event_type=new\n  &status=active\n  &limit=50',
      },
      {
        type: 'p',
        text: 'A useful pattern is to save the filter set that defines your ideal customer, then reuse the exact same query both for backfilling history and for your webhook subscription. That guarantees your live alerts match the universe you analyzed.',
      },
    ],
  },
  {
    slug: 'rate-limits-and-quotas',
    title: 'Rate limits and quotas',
    category: 'api-keys',
    excerpt:
      'Understand request limits, read the rate-limit headers, and back off gracefully when throttled.',
    body: [
      {
        type: 'p',
        text: 'To keep the API fast for everyone, requests are rate limited per key. Your plan sets the ceiling, and every response tells you where you stand.',
      },
      { type: 'h2', text: 'Reading the headers' },
      {
        type: 'list',
        items: [
          'X-RateLimit-Limit — the maximum requests allowed in the current window.',
          'X-RateLimit-Remaining — how many you have left.',
          'X-RateLimit-Reset — a UTC timestamp for when the window resets.',
        ],
      },
      { type: 'h2', text: 'Handling a 429' },
      {
        type: 'p',
        text: 'If you exceed the limit you receive a 429 Too Many Requests response with a Retry-After header. Respect it. The cleanest approach is exponential backoff with jitter so retries do not all fire at once.',
      },
      {
        type: 'code',
        text: 'if (res.status === 429) {\n  const wait = Number(res.headers.get("Retry-After")) || 1\n  await sleep((wait + Math.random()) * 1000)\n  // retry the request\n}',
      },
      {
        type: 'p',
        text: 'If you consistently bump against the limit, prefer webhooks over tight polling, or talk to us about a higher quota on your plan.',
      },
    ],
  },
  // ---------------------------------------------------------------- Webhooks
  {
    slug: 'setting-up-webhooks',
    title: 'Setting up your first webhook',
    category: 'webhooks',
    excerpt:
      'Register an endpoint, choose your filters, and start receiving new license filings in real time.',
    body: [
      {
        type: 'p',
        text: 'Webhooks push new records to your server the moment we observe them, so you do not have to poll. This is the recommended way to react to filings quickly.',
      },
      { type: 'h2', text: 'Step 1 — Build an endpoint' },
      {
        type: 'p',
        text: 'Create a publicly reachable HTTPS URL that accepts POST requests and returns a 2xx status quickly. Do the heavy work asynchronously — acknowledge first, process after.',
      },
      { type: 'h2', text: 'Step 2 — Register it' },
      {
        type: 'p',
        text: 'In Settings → Webhooks, add the URL and choose the same filters you would use on the list endpoint. You will only receive records that match, which keeps noise out of your pipeline.',
      },
      { type: 'h2', text: 'Step 3 — Handle the payload' },
      {
        type: 'p',
        text: 'Each delivery contains an event wrapper and the license record. Always verify the signature before trusting the contents (see "Verifying webhook signatures").',
      },
      {
        type: 'code',
        text: '{\n  "id": "evt_19a2",\n  "type": "license.created",\n  "created": "2026-06-14T15:04:00Z",\n  "data": { "id": "lic_77c1", "businessName": "..." }\n}',
      },
      {
        type: 'list',
        items: [
          'Return a 2xx within a few seconds to mark the delivery successful.',
          'Deduplicate on the event id — deliveries can arrive more than once.',
          'Move slow work to a background queue so you never time out.',
        ],
      },
    ],
  },
  {
    slug: 'verifying-webhook-signatures',
    title: 'Verifying webhook signatures',
    category: 'webhooks',
    excerpt:
      'Confirm that a webhook really came from us using the signing secret and an HMAC check.',
    body: [
      {
        type: 'p',
        text: 'Because your webhook URL is reachable by anyone, you must verify that each request is genuinely from New Venue Data before acting on it. We sign every delivery with a secret that only you and we know.',
      },
      { type: 'h2', text: 'The signature header' },
      {
        type: 'p',
        text: 'Every delivery includes an X-LS-Signature header. It is an HMAC-SHA256 of the raw request body, keyed with your endpoint signing secret (found next to the webhook in Settings).',
      },
      { type: 'h2', text: 'Verifying it' },
      {
        type: 'code',
        text: 'import crypto from "crypto"\n\nfunction verify(rawBody, header, secret) {\n  const expected = crypto\n    .createHmac("sha256", secret)\n    .update(rawBody)\n    .digest("hex")\n  return crypto.timingSafeEqual(\n    Buffer.from(header),\n    Buffer.from(expected)\n  )\n}',
      },
      { type: 'h2', text: 'Critical details' },
      {
        type: 'list',
        items: [
          'Compute the HMAC over the raw, unparsed body — JSON re-serialization changes bytes and breaks the check.',
          'Use a constant-time comparison to avoid timing attacks.',
          'Reject the request if verification fails, and never log the signing secret.',
        ],
      },
    ],
  },
  {
    slug: 'webhook-retries-and-failures',
    title: 'Webhook retries and handling failures',
    category: 'webhooks',
    excerpt:
      'What happens when your endpoint is down, how retries are scheduled, and how to replay missed events.',
    body: [
      {
        type: 'p',
        text: 'Endpoints go down. We expect that and retry failed deliveries automatically, but designing your handler with retries in mind keeps your data complete.',
      },
      { type: 'h2', text: 'When a delivery is considered failed' },
      {
        type: 'p',
        text: 'Any response that is not a 2xx, or that does not arrive within the timeout, counts as a failure and triggers a retry.',
      },
      { type: 'h2', text: 'The retry schedule' },
      {
        type: 'p',
        text: 'We retry with exponential backoff over roughly a day — quick attempts at first, then progressively longer gaps. After the final attempt the delivery is marked failed and surfaced in the dashboard.',
      },
      { type: 'h2', text: 'Designing for retries' },
      {
        type: 'list',
        items: [
          'Make your handler idempotent by deduplicating on the event id.',
          'Acknowledge fast, then process asynchronously, so a slow downstream system does not cause retries.',
          'Use the Replay button in the dashboard to re-send events you missed during an outage.',
        ],
      },
      {
        type: 'p',
        text: 'If a whole endpoint is failing repeatedly, we may pause it and email you. Fix the endpoint, then replay the backlog from the dashboard.',
      },
    ],
  },
  // ---------------------------------------------------------------- Billing
  {
    slug: 'plans-and-pricing',
    title: 'Plans and what each one includes',
    category: 'billing',
    excerpt:
      'A plain-language comparison of Starter, Growth, and Scale so you can pick the right tier.',
    body: [
      {
        type: 'p',
        text: 'All plans share the same data and the same API — the difference is volume, freshness guarantees, and support. Here is how to think about which one fits.',
      },
      { type: 'h2', text: 'The tiers' },
      {
        type: 'list',
        items: [
          'Starter — for one product or a single county focus, with standard rate limits and email support.',
          'Growth — higher quotas, multiple webhooks, and faster data delivery for teams running active outbound.',
          'Scale — statewide volume, priority support, custom limits, and a dedicated contact.',
        ],
      },
      { type: 'h2', text: 'How to choose' },
      {
        type: 'p',
        text: 'Pick based on the volume of records you expect to ingest each month and how quickly you need new filings. If you are unsure, start on the lowest plan that covers your geography — upgrades are instant and prorated.',
      },
      {
        type: 'p',
        text: 'Annual billing is available on every tier at a discount. If you need invoicing, purchase orders, or a custom contract, contact sales.',
      },
    ],
  },
  {
    slug: 'how-usage-is-metered',
    title: 'How usage is metered and billed',
    category: 'billing',
    excerpt:
      'Understand what counts toward your plan, how overages work, and where to watch your usage.',
    body: [
      {
        type: 'p',
        text: 'Billing is simple and predictable. Knowing exactly what is metered helps you avoid surprises at the end of the month.',
      },
      { type: 'h2', text: 'What counts' },
      {
        type: 'list',
        items: [
          'Records delivered — each unique record you receive via the API or a webhook.',
          'Webhook deliveries are metered once per successful event, not per retry.',
          'Sandbox traffic on ls_test_ keys is always free and never metered.',
        ],
      },
      { type: 'h2', text: 'Overages' },
      {
        type: 'p',
        text: 'If you exceed your plan allowance, additional records are billed at your plan overage rate rather than cutting off your access. You will see a banner in the dashboard well before you reach the limit.',
      },
      { type: 'h2', text: 'Watching usage' },
      {
        type: 'p',
        text: 'The Usage page shows current-period consumption against your allowance, updated continuously. You can also set an email alert at a threshold you choose, for example 80 percent of your monthly allowance.',
      },
    ],
  },
  {
    slug: 'invoices-and-payment-methods',
    title: 'Invoices, receipts, and payment methods',
    category: 'billing',
    excerpt:
      'Find your invoices, update a card, and add billing contacts or a tax ID for your finance team.',
    body: [
      {
        type: 'p',
        text: 'Everything billing-related lives under Settings → Billing. Your finance team can be given access without touching the rest of the product.',
      },
      { type: 'h2', text: 'Invoices and receipts' },
      {
        type: 'p',
        text: 'Every charge generates a PDF invoice you can download from the Billing page. Paid invoices double as receipts. We also email a copy to your billing contacts when a charge succeeds.',
      },
      { type: 'h2', text: 'Updating payment details' },
      {
        type: 'list',
        items: [
          'Add or replace a card under Settings → Billing → Payment method.',
          'Add a billing email so receipts also reach your finance inbox.',
          'Enter a VAT or tax ID and a billing address to have them appear on every invoice.',
        ],
      },
      {
        type: 'p',
        text: 'If a payment fails, we retry the card a few times over the following days and email you. Update the card to clear the dunning state and avoid any interruption in service.',
      },
    ],
  },
  // ---------------------------------------------------------------- Data & Coverage
  {
    slug: 'counties-and-license-types-covered',
    title: 'Which counties and license types we cover',
    category: 'data-coverage',
    excerpt:
      'A clear picture of our Florida coverage today and how to check whether a county is live.',
    body: [
      {
        type: 'p',
        text: 'New Venue Data is focused on Florida, with deep coverage of the license categories that matter most to vendors selling into new businesses.',
      },
      { type: 'h2', text: 'Geographic coverage' },
      {
        type: 'p',
        text: 'We track filings across Florida counties, with the highest-volume metros fully live. The Coverage page lists every county and its current status, and you can filter the live API by any covered county.',
      },
      { type: 'h2', text: 'License types' },
      {
        type: 'list',
        items: [
          'Food service and restaurants',
          'Beverage and alcohol licenses',
          'Lodging and hospitality',
          'General business and professional licenses',
        ],
      },
      {
        type: 'p',
        text: 'If a county or license type you need is not yet live, tell us. We prioritize expansion based on customer demand, and we can often give you a timeline for a specific area.',
      },
    ],
  },
  {
    slug: 'data-freshness-and-update-frequency',
    title: 'How fresh is the data?',
    category: 'data-coverage',
    excerpt:
      'How often we pull from source systems, the typical lag, and what affects timing.',
    body: [
      {
        type: 'p',
        text: 'For most use cases, the value of license data is in reaching a new business before your competitors do — so freshness matters. Here is what to expect.',
      },
      { type: 'h2', text: 'Our cadence' },
      {
        type: 'p',
        text: 'We pull from county and state sources on a recurring schedule throughout each business day. Most new filings appear in your feed the same day they become public.',
      },
      { type: 'h2', text: 'What affects the lag' },
      {
        type: 'list',
        items: [
          'Source publishing cadence — some authorities post updates in nightly batches rather than continuously.',
          'Holidays and weekends, when many source systems do not update.',
          'Occasional source outages, which we detect and backfill once the source recovers.',
        ],
      },
      {
        type: 'p',
        text: 'The eventTimestamp field tells you when we observed the event, so you can always measure end-to-end latency yourself and build SLAs around it.',
      },
    ],
  },
  {
    slug: 'how-records-are-matched-and-deduplicated',
    title: 'How records are matched and deduplicated',
    category: 'data-coverage',
    excerpt:
      'The logic behind turning messy public filings into one clean record per event.',
    body: [
      {
        type: 'p',
        text: 'Public records are inconsistent: names are spelled differently, addresses are formatted a dozen ways, and the same business can appear under several entities. Our job is to clean that up so you do not have to.',
      },
      { type: 'h2', text: 'Normalization' },
      {
        type: 'p',
        text: 'Before matching, we standardize names and addresses — casing, punctuation, suffixes like LLC and Inc, and address components — so that comparisons are apples to apples.',
      },
      { type: 'h2', text: 'Matching' },
      {
        type: 'p',
        text: 'We then link records that describe the same business using a combination of license number, normalized name, and geocoded address. The result is one stable id that follows a business across renewals and status changes.',
      },
      { type: 'h2', text: 'Deduplication' },
      {
        type: 'list',
        items: [
          'Exact duplicate filings collapse into a single record.',
          'Repeat events on the same business become distinct, ordered events under one identity.',
          'When a source corrects a filing, we update the record and keep the original sourceUrl for auditing.',
        ],
      },
    ],
  },
  // ---------------------------------------------------------------- Account
  {
    slug: 'inviting-team-members-and-roles',
    title: 'Inviting team members and assigning roles',
    category: 'account',
    excerpt:
      'Add teammates, understand what each role can do, and keep sensitive settings locked down.',
    body: [
      {
        type: 'p',
        text: 'You can invite your whole team into a workspace and control what each person can see and change with roles.',
      },
      { type: 'h2', text: 'Inviting people' },
      {
        type: 'p',
        text: 'Go to Settings → Team and send an invite by email. The invitee creates their own login and joins your workspace — they never see your password or keys.',
      },
      { type: 'h2', text: 'The roles' },
      {
        type: 'list',
        items: [
          'Owner — full control, including billing and deleting the workspace. There is always at least one owner.',
          'Admin — manage keys, webhooks, and team, but not billing or workspace deletion.',
          'Developer — create and read keys and webhooks for day-to-day integration work.',
          'Viewer — read-only access to the dashboard and usage, with no ability to change settings.',
        ],
      },
      {
        type: 'p',
        text: 'Grant the least privilege that lets someone do their job. Most engineers only need Developer; finance staff usually only need Viewer plus billing access.',
      },
    ],
  },
  {
    slug: 'security-sso-and-two-factor',
    title: 'Securing your account with 2FA and SSO',
    category: 'account',
    excerpt:
      'Turn on two-factor authentication, enforce it for your team, and set up single sign-on.',
    body: [
      {
        type: 'p',
        text: 'Your account controls access to data about real businesses, so we give you several layers of protection. Turn them on early.',
      },
      { type: 'h2', text: 'Two-factor authentication' },
      {
        type: 'p',
        text: 'Enable 2FA under Settings → Security using any authenticator app. Owners and admins can require 2FA for every member of the workspace, which we strongly recommend.',
      },
      { type: 'h2', text: 'Single sign-on' },
      {
        type: 'p',
        text: 'On eligible plans you can connect your identity provider over SAML so your team signs in with your existing corporate credentials. SSO lets you centralize access control and offboard people instantly.',
      },
      { type: 'h2', text: 'Good hygiene' },
      {
        type: 'list',
        items: [
          'Require 2FA or SSO for the whole workspace, not just owners.',
          'Remove members the moment they leave, or rely on SSO deprovisioning to do it for you.',
          'Rotate API keys periodically and immediately after any suspected exposure.',
        ],
      },
    ],
  },
  {
    slug: 'closing-or-pausing-your-account',
    title: 'Closing or pausing your account',
    category: 'account',
    excerpt:
      'How to downgrade, pause, or fully close a workspace, and what happens to your data afterward.',
    body: [
      {
        type: 'p',
        text: 'Whether you are wrapping up a project or just trimming costs between busy seasons, you have a few options short of leaving entirely.',
      },
      { type: 'h2', text: 'Downgrade or pause' },
      {
        type: 'p',
        text: 'If you only need to cut spend, downgrade to a lower plan from Settings → Billing — your keys and webhooks keep working at the new limits. Some plans also support pausing, which stops billing while preserving your configuration.',
      },
      { type: 'h2', text: 'Closing a workspace' },
      {
        type: 'p',
        text: 'An owner can close a workspace from Settings → Billing → Close workspace. We bill any outstanding usage, disable all keys, and stop every webhook.',
      },
      { type: 'h2', text: 'What happens to your data' },
      {
        type: 'list',
        items: [
          'Export anything you need first — closing revokes API access immediately.',
          'We retain account records as required for legal and tax purposes, then delete the rest on our standard schedule.',
          'You can reopen by contacting support before the retention window ends.',
        ],
      },
    ],
  },
]

export function getArticle(slug: string): HelpArticle | undefined {
  return HELP_ARTICLES.find((article) => article.slug === slug)
}
