import type { DocsNavItem } from './types'

export const DOCS_NAV: DocsNavItem[] = [
  {
    title: 'Getting Started',
    children: [
      { title: 'Authentication', slug: 'authentication' },
      { title: 'Quick Start', slug: 'quick-start' },
    ],
  },
  {
    title: 'API Reference',
    children: [
      { title: 'List Licenses', slug: 'list-licenses' },
      { title: 'Get License', slug: 'get-license' },
      { title: 'Search', slug: 'search' },
    ],
  },
  {
    title: 'Filtering',
    slug: 'filtering',
  },
  {
    title: 'Pagination',
    slug: 'pagination',
  },
  {
    title: 'Webhooks (Planned)',
    children: [
      { title: 'Setup', slug: 'webhooks' },
      { title: 'Payload Schema', slug: 'webhook-payload' },
      { title: 'Retries & Failures', slug: 'webhook-retries' },
    ],
  },
  {
    title: 'Rate Limits',
    slug: 'rate-limits',
  },
  {
    title: 'Errors',
    slug: 'errors',
  },
  {
    title: 'SDKs (Planned)',
    slug: 'sdks',
  },
  {
    title: 'Changelog',
    slug: 'changelog',
  },
]
