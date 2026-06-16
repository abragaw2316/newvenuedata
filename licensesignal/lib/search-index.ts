export interface SearchEntry {
  title: string
  href: string
  section: string
  keywords: string[]
}

export const SEARCH_INDEX: SearchEntry[] = [
  // Core pages
  {
    title: 'Home',
    href: '/',
    section: 'Pages',
    keywords: ['home', 'overview', 'landing', 'florida', 'license', 'api', 'dbpr', 'liquor', 'food service'],
  },
  {
    title: 'Use Cases',
    href: '/use-cases',
    section: 'Pages',
    keywords: ['use cases', 'examples', 'sales', 'lead generation', 'prospecting', 'workflows', 'who uses'],
  },
  {
    title: 'Data Coverage',
    href: '/data-coverage',
    section: 'Pages',
    keywords: ['data coverage', 'datasets', 'fields', 'schema', 'sources', 'freshness', 'what data'],
  },
  {
    title: 'Pricing',
    href: '/pricing',
    section: 'Pages',
    keywords: ['pricing', 'plans', 'cost', 'price', 'starter', 'professional', 'enterprise', 'billing', 'subscription'],
  },
  {
    title: 'Integrations',
    href: '/integrations',
    section: 'Pages',
    keywords: ['integrations', 'connect', 'zapier', 'crm', 'salesforce', 'hubspot', 'tools', 'apps'],
  },
  {
    title: 'Security',
    href: '/security',
    section: 'Pages',
    keywords: ['security', 'compliance', 'soc 2', 'encryption', 'gdpr', 'data protection', 'privacy'],
  },
  {
    title: 'Changelog',
    href: '/changelog',
    section: 'Pages',
    keywords: ['changelog', 'release notes', 'updates', 'whats new', 'versions', 'history'],
  },
  {
    title: 'Glossary',
    href: '/glossary',
    section: 'Pages',
    keywords: ['glossary', 'terms', 'definitions', 'vocabulary', 'srx', 'cop', 'bev', 'dbpr', 'meaning'],
  },
  {
    title: 'Blog',
    href: '/blog',
    section: 'Pages',
    keywords: ['blog', 'articles', 'posts', 'news', 'insights', 'writing', 'guides'],
  },
  {
    title: 'Compare',
    href: '/compare',
    section: 'Pages',
    keywords: ['compare', 'comparison', 'alternatives', 'vs', 'competitors', 'versus'],
  },
  {
    title: 'Customers',
    href: '/customers',
    section: 'Pages',
    keywords: ['customers', 'case studies', 'testimonials', 'stories', 'who uses', 'logos'],
  },
  {
    title: 'Status',
    href: '/status',
    section: 'Pages',
    keywords: ['status', 'uptime', 'incidents', 'availability', 'health', 'monitoring', 'sla'],
  },
  {
    title: 'About',
    href: '/about',
    section: 'Pages',
    keywords: ['about', 'company', 'team', 'mission', 'who we are', 'story'],
  },
  {
    title: 'Contact',
    href: '/contact',
    section: 'Pages',
    keywords: ['contact', 'support', 'sales', 'get in touch', 'email', 'talk to us', 'api access'],
  },
  {
    title: 'Coverage',
    href: '/coverage',
    section: 'Pages',
    keywords: ['coverage', 'counties', 'florida', 'geography', 'map', 'regions', 'miami-dade', 'broward'],
  },
  {
    title: 'License Types',
    href: '/license-types',
    section: 'Pages',
    keywords: ['license types', 'srx', 'cop', 'bev', 'liquor', 'beer', 'wine', 'food service', 'categories'],
  },

  // Documentation
  {
    title: 'Docs',
    href: '/docs',
    section: 'Documentation',
    keywords: ['docs', 'documentation', 'api reference', 'developer', 'guides', 'reference'],
  },
  {
    title: 'Authentication',
    href: '/docs/authentication',
    section: 'Documentation',
    keywords: ['authentication', 'auth', 'api key', 'bearer token', 'authorization', 'secret', 'login'],
  },
  {
    title: 'Quick Start',
    href: '/docs/quick-start',
    section: 'Documentation',
    keywords: ['quick start', 'getting started', 'setup', 'first request', 'tutorial', 'begin'],
  },
  {
    title: 'List Licenses',
    href: '/docs/list-licenses',
    section: 'Documentation',
    keywords: ['list licenses', 'list endpoint', 'get licenses', 'records', 'query', 'fetch licenses'],
  },
  {
    title: 'Get License',
    href: '/docs/get-license',
    section: 'Documentation',
    keywords: ['get license', 'single license', 'retrieve', 'by id', 'lookup record'],
  },
  {
    title: 'Search',
    href: '/docs/search',
    section: 'Documentation',
    keywords: ['search', 'full text search', 'query', 'find business', 'lookup', 'dba'],
  },
  {
    title: 'Filtering',
    href: '/docs/filtering',
    section: 'Documentation',
    keywords: ['filtering', 'filters', 'county', 'license type', 'event type', 'status', 'date range', 'params'],
  },
  {
    title: 'Pagination',
    href: '/docs/pagination',
    section: 'Documentation',
    keywords: ['pagination', 'cursor', 'pages', 'limit', 'next page', 'has more'],
  },
  {
    title: 'Webhooks',
    href: '/docs/webhooks',
    section: 'Documentation',
    keywords: ['webhooks', 'events', 'notifications', 'callbacks', 'push', 'real time', 'signature'],
  },
  {
    title: 'Webhook Payload',
    href: '/docs/webhook-payload',
    section: 'Documentation',
    keywords: ['webhook payload', 'event payload', 'json', 'body', 'data shape', 'delivery'],
  },
  {
    title: 'Webhook Retries',
    href: '/docs/webhook-retries',
    section: 'Documentation',
    keywords: ['webhook retries', 'failures', 'backoff', 'retry schedule', 'timeout', 'delivery failures'],
  },
  {
    title: 'Rate Limits',
    href: '/docs/rate-limits',
    section: 'Documentation',
    keywords: ['rate limits', 'throttling', 'requests per minute', '429', 'quota', 'retry after'],
  },
  {
    title: 'Errors',
    href: '/docs/errors',
    section: 'Documentation',
    keywords: ['errors', 'error codes', 'status codes', '400', '401', '404', '429', '500', 'troubleshooting'],
  },
  {
    title: 'SDKs',
    href: '/docs/sdks',
    section: 'Documentation',
    keywords: ['sdks', 'libraries', 'node', 'javascript', 'client', 'wrapper', 'npm'],
  },
]

interface RankedEntry extends SearchEntry {
  score: number
}

/**
 * Case-insensitive substring search over each entry's title + keywords.
 * Returns matches ranked best-first. An empty query returns the full index
 * (in source order) so the palette can show all destinations by default.
 */
export function searchIndex(query: string): SearchEntry[] {
  const q = query.trim().toLowerCase()
  if (!q) return SEARCH_INDEX

  const ranked: RankedEntry[] = []

  for (const entry of SEARCH_INDEX) {
    const title = entry.title.toLowerCase()
    let score = 0

    if (title === q) {
      score = 100
    } else if (title.startsWith(q)) {
      score = 80
    } else if (title.includes(q)) {
      score = 60
    }

    if (score === 0) {
      for (const keyword of entry.keywords) {
        const kw = keyword.toLowerCase()
        if (kw === q) {
          score = Math.max(score, 50)
        } else if (kw.startsWith(q)) {
          score = Math.max(score, 35)
        } else if (kw.includes(q)) {
          score = Math.max(score, 20)
        }
      }
    }

    if (score > 0) {
      ranked.push({ ...entry, score })
    }
  }

  return ranked
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .map(({ score: _score, ...entry }) => entry)
}
