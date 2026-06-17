import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { CodeBlock } from '@/components/docs/code-block'
import { CodeTabs } from '@/components/docs/code-tabs'
import { EndpointCard } from '@/components/docs/endpoint-card'
import { ParamTable } from '@/components/docs/param-table'
import { ApiPlayground } from '@/components/docs/api-playground'
import { Helpful } from '@/components/docs/helpful'
import { DOCS_NAV } from '@/lib/docs-nav'
import { SDK_SNIPPETS } from '@/lib/sdk-snippets'
import type { ApiEndpoint, ApiParam, DocsNavItem } from '@/lib/types'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const titles: Record<string, string> = {
    authentication: 'Authentication',
    'quick-start': 'Quick Start',
    'list-licenses': 'List Licenses',
    'get-license': 'Get License',
    search: 'Search',
    filtering: 'Filtering',
    pagination: 'Pagination',
    webhooks: 'Webhooks',
    'webhook-payload': 'Webhook Payload',
    'webhook-retries': 'Webhook Retries',
    'rate-limits': 'Rate Limits',
    errors: 'Errors',
    sdks: 'SDKs',
    changelog: 'Changelog',
  }
  return { title: titles[slug] ?? 'Docs' }
}

export function generateStaticParams() {
  return [
    { slug: 'authentication' },
    { slug: 'quick-start' },
    { slug: 'list-licenses' },
    { slug: 'get-license' },
    { slug: 'search' },
    { slug: 'filtering' },
    { slug: 'pagination' },
    { slug: 'webhooks' },
    { slug: 'webhook-payload' },
    { slug: 'webhook-retries' },
    { slug: 'rate-limits' },
    { slug: 'errors' },
    { slug: 'sdks' },
    { slug: 'changelog' },
  ]
}

const LIST_PARAMS: ApiParam[] = [
  { name: 'county', type: 'string', required: false, description: 'Filter by county slug (e.g. miami-dade)', example: 'miami-dade' },
  { name: 'license_type', type: 'string', required: false, description: 'SRX, COP, BEV, FOOD_SERVICE, etc.', example: 'SRX' },
  { name: 'status', type: 'string', required: false, description: 'approved, pending, active, expired', example: 'approved' },
  { name: 'event_type', type: 'string', required: false, description: 'new_filing, renewal, ownership_transfer', example: 'new_filing' },
  { name: 'filed_after', type: 'string (ISO 8601)', required: false, description: 'Return records filed on or after this date', example: '2024-12-01' },
  { name: 'filed_before', type: 'string (ISO 8601)', required: false, description: 'Return records filed on or before this date', example: '2024-12-31' },
  { name: 'city', type: 'string', required: false, description: 'Filter by city name', example: 'Miami' },
  { name: 'limit', type: 'integer', required: false, description: 'Records per page. Default 25, max 100.', example: '25' },
  { name: 'cursor', type: 'string', required: false, description: 'Pagination cursor from previous response', example: 'cur_eyJpZCI6Im...' },
]

const LIST_ENDPOINT: ApiEndpoint = {
  method: 'GET',
  path: '/v1/licenses',
  description: 'Returns a paginated list of Florida license records matching the provided filters.',
  params: LIST_PARAMS,
}

const GET_ENDPOINT: ApiEndpoint = {
  method: 'GET',
  path: '/v1/licenses/:id',
  description: 'Returns a single license record by its unique ID.',
  params: [
    { name: 'id', type: 'string', required: true, description: 'The license record ID', example: 'lic_01HZ8XQ9P2WKRN4M5YJVD3B' },
  ],
}

const SEARCH_ENDPOINT: ApiEndpoint = {
  method: 'GET',
  path: '/v1/licenses/search',
  description: 'Full-text search across business name, DBA name, and address fields.',
  params: [
    { name: 'q', type: 'string', required: true, description: 'Search query (business name, DBA, or address)', example: 'Brickell' },
    { name: 'county', type: 'string', required: false, description: 'Limit search to a specific county', example: 'miami-dade' },
    { name: 'limit', type: 'integer', required: false, description: 'Records per page', example: '25' },
  ],
}

function snippetById(id: string) {
  return SDK_SNIPPETS.find((s) => s.id === id)
}

function slugify(children: React.ReactNode): string {
  const text = typeof children === 'string' ? children : String(children ?? '')
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function Heading({ level, children }: { level: 1 | 2 | 3; children: React.ReactNode }) {
  const cls = {
    1: 'text-display-sm text-[var(--ls-fg)] mb-4',
    2: 'text-xl font-semibold text-[var(--ls-fg)] mt-10 mb-4 pt-8 border-t border-[var(--ls-border)] first:border-0 first:pt-0 first:mt-0 scroll-mt-24',
    3: 'text-base font-semibold text-[var(--ls-fg)] mt-6 mb-2 scroll-mt-24',
  }[level]

  if (level === 1) {
    return <h1 className={cls}>{children}</h1>
  }
  if (level === 2) {
    return (
      <h2 id={slugify(children)} className={cls}>
        {children}
      </h2>
    )
  }
  return (
    <h3 id={slugify(children)} className={cls}>
      {children}
    </h3>
  )
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-[var(--ls-fg-2)] leading-7 mb-4">{children}</p>
}

function DocContent({ slug }: { slug: string }) {
  switch (slug) {
    case 'authentication':
      return (
        <div>
          <Heading level={1}>Authentication</Heading>
          <P>
            All requests to the New Venue Data API must be authenticated with an API key. Include
            your key in the <code className="text-xs font-mono text-indigo-400">Authorization</code> header
            as a Bearer token.
          </P>
          <Heading level={2}>API Keys</Heading>
          <P>
            You receive two keys when you create an account: a <strong className="text-[var(--ls-fg)]">test key</strong> (prefixed{' '}
            <code className="text-xs font-mono text-indigo-400">ls_test_</code>) and a{' '}
            <strong className="text-[var(--ls-fg)]">live key</strong> (prefixed{' '}
            <code className="text-xs font-mono text-indigo-400">ls_live_</code>). Test keys return the
            same mock dataset on every call. Live keys return real DBPR data.
          </P>
          <CodeBlock
            language="bash"
            code={`# Test key (same response every time)
curl -X GET "https://api.newvenuedata.com/v1/licenses" \\
  -H "Authorization: Bearer ls_test_your_key_here"

# Live key (real DBPR data)
curl -X GET "https://api.newvenuedata.com/v1/licenses" \\
  -H "Authorization: Bearer ls_live_your_key_here"`}
          />
          <Heading level={2}>Key Security</Heading>
          <P>
            Never expose your live API key in client-side code, public repositories, or logs. Store
            it as an environment variable and load it at runtime. If a key is compromised, rotate it
            immediately from the dashboard.
          </P>
          <CodeBlock
            language="bash"
            code={`# Store in your environment
export LICENSESIGNAL_API_KEY="ls_live_your_key_here"

# Load in Node.js
const key = process.env.LICENSESIGNAL_API_KEY`}
          />
        </div>
      )

    case 'quick-start':
      return (
        <div>
          <Heading level={1}>Quick Start</Heading>
          <P>
            Get your first license records in under 5 minutes. You'll need an API key — grab one
            from the dashboard.
          </P>
          <Heading level={2}>1. Make your first request</Heading>
          <P>Pick your language — every example hits the same endpoint.</P>
          {(() => {
            const snippet = snippetById('list-licenses')
            return snippet ? <CodeTabs tabs={snippet.tabs} /> : null
          })()}
          <Heading level={2}>2. Parse the response</Heading>
          <CodeBlock
            language="json"
            code={`{
  "data": [
    {
      "id": "lic_01HZ8XQ9P2WKRN4M5YJVD3B",
      "licenseNumber": "BEV-2024-0045821",
      "licenseType": "BEV",
      "status": "approved",
      "businessName": "The Copper Still Bar & Kitchen",
      "address": { "street": "142 NW 2nd Ave", "city": "Miami", "county": "Miami-Dade", "state": "FL", "zip": "33128" },
      "filedDate": "2024-12-03",
      "eventType": "new_filing",
      "eventTimestamp": "2024-12-03T09:14:22Z"
    }
  ],
  "pagination": { "cursor": "cur_eyJpZCI6Im...", "hasMore": true, "total": 412, "limit": 5 }
}`}
          />
          <Heading level={2}>3. Set up a webhook (planned)</Heading>
          <P>
            Webhook delivery is on the roadmap and not yet available. For now, poll the API on a
            schedule, or use the weekly lead list / CSV export. We&apos;ll announce webhooks in the
            changelog when they ship.
          </P>
        </div>
      )

    case 'list-licenses':
      return (
        <div>
          <Heading level={1}>List Licenses</Heading>
          <P>
            Fetch a paginated list of Florida license records. Filter by county, type, status, event
            type, date range, and more.
          </P>
          <EndpointCard endpoint={LIST_ENDPOINT} />
          <Heading level={2}>Try It Live</Heading>
          <P>
            Adjust the filters below and send a real request against a sandbox of the dataset. No API
            key required in the sandbox.
          </P>
          <ApiPlayground />
          <Heading level={2}>Example Request</Heading>
          <CodeBlock
            language="bash"
            code={`curl -X GET "https://api.newvenuedata.com/v1/licenses" \\
  -H "Authorization: Bearer ls_live_xxxxx" \\
  -G -d "county=broward" \\
  -d "event_type=new_filing" \\
  -d "license_type=SRX" \\
  -d "filed_after=2024-12-01" \\
  -d "limit=25"`}
          />
        </div>
      )

    case 'get-license':
      return (
        <div>
          <Heading level={1}>Get License</Heading>
          <P>Retrieve a single license record by its unique ID.</P>
          <EndpointCard endpoint={GET_ENDPOINT} />
          <Heading level={2}>Example Request</Heading>
          <CodeBlock
            language="bash"
            code={`curl -X GET "https://api.newvenuedata.com/v1/licenses/lic_01HZ8XQ9P2WKRN4M5YJVD3B" \\
  -H "Authorization: Bearer ls_live_xxxxx"`}
          />
        </div>
      )

    case 'search':
      return (
        <div>
          <Heading level={1}>Search</Heading>
          <P>Full-text search across business name, DBA name, and address fields.</P>
          <EndpointCard endpoint={SEARCH_ENDPOINT} />
          <Heading level={2}>Example Request</Heading>
          <CodeBlock
            language="bash"
            code={`curl -X GET "https://api.newvenuedata.com/v1/licenses/search" \\
  -H "Authorization: Bearer ls_live_xxxxx" \\
  -G -d "q=Brickell" -d "county=miami-dade"`}
          />
        </div>
      )

    case 'filtering':
      return (
        <div>
          <Heading level={1}>Filtering</Heading>
          <P>
            The <code className="text-xs font-mono text-indigo-400">GET /v1/licenses</code> endpoint
            supports a rich set of filters. Combine multiple filters in a single request — they are
            AND-ed together.
          </P>
          <ParamTable params={LIST_PARAMS} />
          <Heading level={2}>License Type Values</Heading>
          <P>Valid values for the <code className="text-xs font-mono text-indigo-400">license_type</code> parameter:</P>
          <CodeBlock
            language="text"
            code={`SRX           — Spirituous liquor (full bar)
COP           — Consumption on premises
BEV           — Beer & wine
APS           — Adult entertainment venue
FOOD_SERVICE  — Food service establishment
SEATING       — Seating license
MOBILE_FOOD   — Mobile food dispensing vehicle`}
          />
          <Heading level={2}>Event Type Values</Heading>
          <CodeBlock
            language="text"
            code={`new_filing         — Brand new license application
renewal            — Annual license renewal
ownership_transfer — Business ownership changed
status_change      — Status updated (e.g. approved, suspended)
address_change     — Business address updated
cancellation       — License cancelled`}
          />
        </div>
      )

    case 'pagination':
      return (
        <div>
          <Heading level={1}>Pagination</Heading>
          <P>
            New Venue Data uses cursor-based pagination. Every list response includes a{' '}
            <code className="text-xs font-mono text-indigo-400">pagination</code> object with a{' '}
            <code className="text-xs font-mono text-indigo-400">cursor</code> field. Pass this cursor
            in your next request to get the following page.
          </P>
          <Heading level={2}>Pagination Object</Heading>
          <CodeBlock
            language="json"
            code={`"pagination": {
  "cursor": "cur_eyJpZCI6Im...",  // pass this as ?cursor= in next request
  "hasMore": true,                 // false on the last page
  "total": 412,                    // total matching records
  "limit": 25                      // records returned this page
}`}
          />
          <Heading level={2}>Iterating Through Pages</Heading>
          <CodeBlock
            language="javascript"
            code={`let cursor = null
let allRecords = []

do {
  const url = new URL('https://api.newvenuedata.com/v1/licenses')
  url.searchParams.set('county', 'miami-dade')
  url.searchParams.set('limit', '100')
  if (cursor) url.searchParams.set('cursor', cursor)

  const res = await fetch(url, {
    headers: { Authorization: \`Bearer \${process.env.LICENSESIGNAL_API_KEY}\` }
  })
  const json = await res.json()

  allRecords = allRecords.concat(json.data)
  cursor = json.pagination.cursor
} while (cursor && json.pagination.hasMore)`}
          />
        </div>
      )

    case 'webhooks':
      return (
        <div>
          <Heading level={1}>Webhooks</Heading>
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-300 mb-4">
            <strong>Planned — not yet available.</strong> Webhook delivery is on the roadmap. The
            endpoints and payloads below describe the planned design; today, poll the API or use the
            weekly list / CSV export. We&apos;ll announce it in the changelog when it ships.
          </div>
          <P>
            Once available, you&apos;ll register a webhook to receive HTTP POST notifications the moment a
            new license record appears or an existing record is updated — no polling required.
          </P>
          <Heading level={2}>Register an Endpoint</Heading>
          <CodeBlock
            language="bash"
            code={`curl -X POST "https://api.newvenuedata.com/v1/webhooks" \\
  -H "Authorization: Bearer ls_live_xxxxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://yourapp.com/webhooks/license",
    "events": ["new_filing", "ownership_transfer"],
    "counties": ["miami-dade", "broward"],
    "license_types": ["SRX", "COP", "BEV"]
  }'`}
          />
          <Heading level={2}>Verify Signatures</Heading>
          <P>
            Every webhook delivery includes an{' '}
            <code className="text-xs font-mono text-indigo-400">X-New Venue Data-Signature</code> header.
            Verify it using your webhook secret to ensure the payload wasn't tampered with.
          </P>
          <CodeBlock
            language="javascript"
            code={`import crypto from 'crypto'

export async function POST(req) {
  const body = await req.text()
  const signature = req.headers.get('X-New Venue Data-Signature')
  const secret = process.env.LICENSESIGNAL_WEBHOOK_SECRET

  const expected = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex')

  if (signature !== \`sha256=\${expected}\`) {
    return new Response('Unauthorized', { status: 401 })
  }

  const payload = JSON.parse(body)
  // process payload.data (a LicenseRecord)
  return new Response('OK', { status: 200 })
}`}
          />
          <P>
            <Link
              href="/webhook-events"
              className="inline-flex items-center gap-1 text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300"
            >
              See the full webhook event catalog
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </P>
        </div>
      )

    case 'webhook-payload':
      return (
        <div>
          <Heading level={1}>Webhook Payload</Heading>
          <P>Each webhook delivery sends a JSON payload with the following structure.</P>
          <CodeBlock
            language="json"
            code={`{
  "id": "evt_01HZ9Q2P3WKRN4M5YJVD3B",
  "event": "new_filing",
  "timestamp": "2024-12-05T14:33:08Z",
  "webhookId": "wh_01HZ8XQ9P2",
  "attempt": 1,
  "signature": "sha256=abc123...",
  "data": {
    "id": "lic_02HZ9YR0Q3XLSM5N6ZKWE4C",
    "licenseNumber": "SRX-2024-0091443",
    "licenseType": "SRX",
    "status": "pending",
    "businessName": "Brickell Social Club",
    "address": {
      "street": "801 Brickell Bay Dr",
      "city": "Miami",
      "county": "Miami-Dade",
      "state": "FL",
      "zip": "33131"
    },
    "filedDate": "2024-12-05",
    "eventType": "new_filing",
    "eventTimestamp": "2024-12-05T14:33:08Z"
  }
}`}
          />
        </div>
      )

    case 'webhook-retries':
      return (
        <div>
          <Heading level={1}>Webhook Retries & Failures</Heading>
          <P>
            If your endpoint returns a non-2xx status code or times out (10s limit),
            New Venue Data retries with exponential backoff.
          </P>
          <Heading level={2}>Retry Schedule</Heading>
          <CodeBlock
            language="text"
            code={`Attempt 1: Immediately
Attempt 2: 5 minutes later
Attempt 3: 30 minutes later
Attempt 4: 2 hours later
Attempt 5: 8 hours later
After 5 failures: webhook marked inactive`}
          />
          <Heading level={2}>Best Practices</Heading>
          <P>
            Return a 200 OK immediately and process the payload asynchronously. This prevents timeouts
            if your processing takes longer than 10 seconds. Use a queue (SQS, BullMQ, etc.) to
            handle retries on your side as well.
          </P>
        </div>
      )

    case 'rate-limits':
      return (
        <div>
          <Heading level={1}>Rate Limits</Heading>
          <P>Rate limits are applied per API key on a rolling 60-second window.</P>
          <div className="rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] overflow-hidden my-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--ls-border)]">
                  {['Plan', 'Requests / min', 'Monthly Cap', 'Burst'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-widest text-[var(--ls-fg-3)]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['Starter', '20 req/min', '5,000/mo', 'None'],
                  ['Professional', '100 req/min', '50,000/mo', '200 req/min (60s)'],
                  ['Enterprise', 'Unlimited', 'Unlimited', 'Unlimited'],
                ].map(([plan, rpm, monthly, burst]) => (
                  <tr key={plan} className="border-b border-[var(--ls-border)] last:border-0 hover:bg-[var(--ls-hover)]">
                    <td className="px-4 py-3 font-medium text-[var(--ls-fg)]">{plan}</td>
                    <td className="px-4 py-3 text-[var(--ls-fg-2)] font-mono text-xs">{rpm}</td>
                    <td className="px-4 py-3 text-[var(--ls-fg-2)]">{monthly}</td>
                    <td className="px-4 py-3 text-[var(--ls-fg-2)]">{burst}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <P>
            When you hit a rate limit, the API returns{' '}
            <code className="text-xs font-mono text-amber-400">429 Too Many Requests</code> with a{' '}
            <code className="text-xs font-mono text-indigo-400">Retry-After</code> header indicating
            when to retry.
          </P>
        </div>
      )

    case 'errors':
      return (
        <div>
          <Heading level={1}>Errors</Heading>
          <P>
            New Venue Data uses conventional HTTP status codes to indicate the success or failure of
            a request. Every error response includes a machine-readable{' '}
            <code className="text-xs font-mono text-indigo-400">code</code>, a human-readable{' '}
            <code className="text-xs font-mono text-indigo-400">message</code>, and the{' '}
            <code className="text-xs font-mono text-indigo-400">X-Request-ID</code> header so you can
            reference the request when contacting support.
          </P>
          <CodeBlock
            language="json"
            code={`{
  "error": {
    "code": "validation_error",
    "message": "filed_after must be an ISO 8601 date",
    "param": "filed_after"
  },
  "requestId": "req_01HZ8XQ9P2WKRN4M5YJVD3B"
}`}
          />
          <Heading level={2}>Error Codes</Heading>
          <div className="rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] overflow-hidden my-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--ls-border)]">
                  {['Status', 'Code', 'When it happens', 'How to fix'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-widest text-[var(--ls-fg-3)]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    status: '400',
                    code: 'invalid_request',
                    when: 'The request was malformed — unparseable JSON body, an unknown query parameter, or a wrong data type.',
                    fix: 'Check the request shape against the endpoint reference and resend.',
                  },
                  {
                    status: '401',
                    code: 'unauthorized',
                    when: 'The API key is missing, malformed, or no longer valid.',
                    fix: 'Send a valid key in the Authorization: Bearer header. Rotate a revoked key from the dashboard.',
                  },
                  {
                    status: '403',
                    code: 'forbidden',
                    when: 'The key is valid but your plan does not include the requested resource or field (e.g. enrichment fields on Starter).',
                    fix: 'Upgrade your plan or remove the out-of-scope parameter from the request.',
                  },
                  {
                    status: '404',
                    code: 'not_found',
                    when: 'The requested record or route does not exist — e.g. an unknown license ID or a stale pagination cursor.',
                    fix: 'Verify the ID or path. Re-fetch a fresh cursor if the old one has expired.',
                  },
                  {
                    status: '422',
                    code: 'validation_error',
                    when: 'The request is well-formed but a parameter value failed validation, such as a bad date or an out-of-range limit.',
                    fix: 'Inspect the param field in the response and correct the offending value.',
                  },
                  {
                    status: '429',
                    code: 'rate_limited',
                    when: 'You exceeded the rate limit for your plan within the rolling 60-second window.',
                    fix: 'Back off and retry after the number of seconds in the Retry-After header.',
                  },
                  {
                    status: '500',
                    code: 'internal_error',
                    when: 'An unexpected error occurred on our side while processing the request.',
                    fix: 'Retry with backoff. If it persists, contact support with the X-Request-ID.',
                  },
                  {
                    status: '503',
                    code: 'service_unavailable',
                    when: 'The API is temporarily down for maintenance or overloaded.',
                    fix: 'Retry after a short delay using exponential backoff. Check the status page for incidents.',
                  },
                ].map((row) => (
                  <tr key={row.status} className="border-b border-[var(--ls-border)] last:border-0 hover:bg-[var(--ls-hover)] align-top">
                    <td className="px-4 py-3 font-mono text-xs font-medium text-amber-400">{row.status}</td>
                    <td className="px-4 py-3 font-mono text-xs text-indigo-400">{row.code}</td>
                    <td className="px-4 py-3 text-[var(--ls-fg-2)] leading-6">{row.when}</td>
                    <td className="px-4 py-3 text-[var(--ls-fg-2)] leading-6">{row.fix}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )

    case 'sdks': {
      const listSnippet = snippetById('list-licenses')
      const getSnippet = snippetById('get-license')
      const searchSnippet = snippetById('search-licenses')
      const webhookSnippet = snippetById('verify-webhook')
      return (
        <div>
          <Heading level={1}>SDKs</Heading>
          <P>
            Official SDKs are in development. In the meantime, the REST API is straightforward to call
            directly from any language. Switch between cURL, Node.js, Python, Go, and PHP below.
          </P>
          <Heading level={2}>List Licenses</Heading>
          {listSnippet && <CodeTabs tabs={listSnippet.tabs} />}
          <Heading level={2}>Get a License</Heading>
          {getSnippet && <CodeTabs tabs={getSnippet.tabs} />}
          <Heading level={2}>Search Licenses</Heading>
          {searchSnippet && <CodeTabs tabs={searchSnippet.tabs} />}
          <Heading level={2}>Verify a Webhook Signature</Heading>
          <P>Validate the HMAC-SHA256 signature on every webhook delivery before trusting the payload.</P>
          {webhookSnippet && <CodeTabs tabs={webhookSnippet.tabs} />}
        </div>
      )
    }

    case 'changelog':
      return (
        <div>
          <Heading level={1}>Changelog</Heading>
          <div className="flex flex-col gap-8">
            {[
              {
                date: 'December 2024',
                version: 'v1.2.0',
                changes: [
                  'Added contact enrichment fields (phone, website, NAICS code) on Pro+ plans',
                  'New event type: ownership_transfer — triggers when a license is transferred to a new owner',
                  'Search endpoint is now in GA (was beta)',
                  'Cursor pagination is now stable — cursor format changed, old cursors will 404',
                ],
              },
              {
                date: 'November 2024',
                version: 'v1.1.0',
                changes: [
                  'Added city and ZIP code filtering to list endpoint',
                  'Webhook retry schedule extended from 3 to 5 attempts',
                  'Added X-Request-ID header to all API responses for debugging',
                ],
              },
              {
                date: 'October 2024',
                version: 'v1.0.0',
                changes: [
                  'Initial GA release',
                  'REST API: list, get, search endpoints',
                  'Webhook delivery with HMAC signing',
                  'All 67 Florida counties covered',
                ],
              },
            ].map((release) => (
              <div key={release.version} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="h-2 w-2 rounded-full bg-indigo-500 mt-1.5" />
                  <div className="w-px flex-1 bg-[var(--ls-border)] mt-2" />
                </div>
                <div className="flex flex-col gap-2 pb-8">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-semibold text-indigo-400">
                      {release.version}
                    </span>
                    <span className="text-xs text-[var(--ls-fg-3)]">{release.date}</span>
                  </div>
                  <ul className="flex flex-col gap-1.5">
                    {release.changes.map((c) => (
                      <li key={c} className="flex items-start gap-2 text-sm text-[var(--ls-fg-2)]">
                        <span className="mt-2 h-1 w-1 rounded-full bg-[var(--ls-fg-3)] flex-shrink-0" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )

    default:
      notFound()
  }
}

interface FlatDoc {
  slug: string
  title: string
}

function flattenNav(items: DocsNavItem[]): FlatDoc[] {
  const flat: FlatDoc[] = []
  for (const item of items) {
    if (item.slug) flat.push({ slug: item.slug, title: item.title })
    if (item.children) flat.push(...flattenNav(item.children))
  }
  return flat
}

const FLAT_DOCS = flattenNav(DOCS_NAV)

function Pager({ slug }: { slug: string }) {
  const index = FLAT_DOCS.findIndex((doc) => doc.slug === slug)
  if (index === -1) return null

  const prev = index > 0 ? FLAT_DOCS[index - 1] : null
  const next = index < FLAT_DOCS.length - 1 ? FLAT_DOCS[index + 1] : null
  if (!prev && !next) return null

  return (
    <nav className="mt-10 flex flex-col gap-4 sm:flex-row">
      {prev ? (
        <Link
          href={`/docs/${prev.slug}`}
          className="group flex flex-1 flex-col gap-1 rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] px-4 py-3 transition-colors hover:border-[var(--ls-border-2)] hover:bg-[var(--ls-hover)]"
        >
          <span className="flex items-center gap-1.5 text-xs text-[var(--ls-fg-3)]">
            <ArrowLeft className="h-3.5 w-3.5" />
            Previous
          </span>
          <span className="text-sm font-medium text-[var(--ls-fg)] group-hover:text-indigo-400">
            {prev.title}
          </span>
        </Link>
      ) : (
        <div className="hidden flex-1 sm:block" aria-hidden="true" />
      )}
      {next ? (
        <Link
          href={`/docs/${next.slug}`}
          className="group flex flex-1 flex-col items-end gap-1 rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] px-4 py-3 text-right transition-colors hover:border-[var(--ls-border-2)] hover:bg-[var(--ls-hover)]"
        >
          <span className="flex items-center gap-1.5 text-xs text-[var(--ls-fg-3)]">
            Next
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
          <span className="text-sm font-medium text-[var(--ls-fg)] group-hover:text-indigo-400">
            {next.title}
          </span>
        </Link>
      ) : (
        <div className="hidden flex-1 sm:block" aria-hidden="true" />
      )}
    </nav>
  )
}

export default async function DocsPage({ params }: PageProps) {
  const { slug } = await params
  return (
    <div>
      <DocContent slug={slug} />
      <Helpful />
      <Pager slug={slug} />
    </div>
  )
}
