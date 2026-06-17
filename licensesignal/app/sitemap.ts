import type { MetadataRoute } from 'next'
import { DOCS_NAV } from '@/lib/docs-nav'
import { BLOG_POSTS } from '@/lib/blog-posts'
import { FL_COUNTIES } from '@/lib/fl-counties'
import { LICENSE_TYPES } from '@/lib/license-type-info'
import { EXPANSION_STATES } from '@/lib/expansion-states'
import { INDUSTRIES } from '@/lib/industries'
import { HELP_ARTICLES } from '@/lib/help-articles'
import { ALTERNATIVES } from '@/lib/alternatives'
import { coverageTypeParams, coverageCityParams } from '@/lib/coverage'
import { TX_COUNTY_DETAIL } from '@/lib/tx-county-stats'

const BASE_URL = 'https://newvenuedata.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date('2026-06-14')

  const staticRoutes: MetadataRoute.Sitemap = (
    [
      { url: `${BASE_URL}/`, priority: 1, changeFrequency: 'weekly' },
      { url: `${BASE_URL}/use-cases`, priority: 0.9, changeFrequency: 'monthly' },
      { url: `${BASE_URL}/data-coverage`, priority: 0.9, changeFrequency: 'weekly' },
      { url: `${BASE_URL}/pricing`, priority: 0.9, changeFrequency: 'monthly' },
      { url: `${BASE_URL}/docs`, priority: 0.8, changeFrequency: 'weekly' },
      { url: `${BASE_URL}/integrations`, priority: 0.7, changeFrequency: 'monthly' },
      { url: `${BASE_URL}/security`, priority: 0.6, changeFrequency: 'monthly' },
      { url: `${BASE_URL}/changelog`, priority: 0.6, changeFrequency: 'weekly' },
      { url: `${BASE_URL}/glossary`, priority: 0.6, changeFrequency: 'monthly' },
      { url: `${BASE_URL}/blog`, priority: 0.7, changeFrequency: 'weekly' },
      { url: `${BASE_URL}/coverage`, priority: 0.7, changeFrequency: 'monthly' },
      { url: `${BASE_URL}/license-types`, priority: 0.7, changeFrequency: 'monthly' },
      { url: `${BASE_URL}/compare`, priority: 0.6, changeFrequency: 'monthly' },
      { url: `${BASE_URL}/webhook-events`, priority: 0.6, changeFrequency: 'monthly' },
      { url: `${BASE_URL}/methodology`, priority: 0.7, changeFrequency: 'monthly' },
      { url: `${BASE_URL}/reports/florida-2026`, priority: 0.7, changeFrequency: 'monthly' },
      { url: `${BASE_URL}/sample`, priority: 0.7, changeFrequency: 'weekly' },
      { url: `${BASE_URL}/signals`, priority: 0.8, changeFrequency: 'daily' },
      { url: `${BASE_URL}/analytics`, priority: 0.6, changeFrequency: 'monthly' },
      { url: `${BASE_URL}/search`, priority: 0.6, changeFrequency: 'monthly' },
      { url: `${BASE_URL}/alerts`, priority: 0.5, changeFrequency: 'monthly' },
      { url: `${BASE_URL}/help`, priority: 0.6, changeFrequency: 'weekly' },
      { url: `${BASE_URL}/roadmap`, priority: 0.5, changeFrequency: 'weekly' },
      { url: `${BASE_URL}/alternatives`, priority: 0.6, changeFrequency: 'monthly' },
      { url: `${BASE_URL}/learn`, priority: 0.6, changeFrequency: 'weekly' },
      { url: `${BASE_URL}/webinars`, priority: 0.5, changeFrequency: 'monthly' },
      { url: `${BASE_URL}/podcast`, priority: 0.5, changeFrequency: 'monthly' },
      { url: `${BASE_URL}/status`, priority: 0.4, changeFrequency: 'daily' },
      { url: `${BASE_URL}/about`, priority: 0.5, changeFrequency: 'monthly' },
      { url: `${BASE_URL}/contact`, priority: 0.5, changeFrequency: 'monthly' },
      { url: `${BASE_URL}/privacy`, priority: 0.3, changeFrequency: 'yearly' },
      { url: `${BASE_URL}/terms`, priority: 0.3, changeFrequency: 'yearly' },
      { url: `${BASE_URL}/data-policy`, priority: 0.3, changeFrequency: 'yearly' },
      { url: `${BASE_URL}/accessibility`, priority: 0.3, changeFrequency: 'yearly' },
    ] satisfies MetadataRoute.Sitemap
  ).map((r) => ({ ...r, lastModified }))

  const dynamicRoutes: MetadataRoute.Sitemap = [
    ...BLOG_POSTS.map((p) => ({ url: `${BASE_URL}/blog/${p.slug}`, priority: 0.6, changeFrequency: 'monthly' as const })),
    ...FL_COUNTIES.map((c) => ({ url: `${BASE_URL}/coverage/${c.slug}`, priority: 0.5, changeFrequency: 'monthly' as const })),
    ...LICENSE_TYPES.map((t) => ({ url: `${BASE_URL}/license-types/${t.slug}`, priority: 0.5, changeFrequency: 'monthly' as const })),
    ...EXPANSION_STATES.map((s) => ({ url: `${BASE_URL}/expansion/${s.slug}`, priority: 0.4, changeFrequency: 'monthly' as const })),
    ...INDUSTRIES.map((i) => ({ url: `${BASE_URL}/for/${i.slug}`, priority: 0.6, changeFrequency: 'monthly' as const })),
    ...HELP_ARTICLES.map((a) => ({ url: `${BASE_URL}/help/${a.slug}`, priority: 0.5, changeFrequency: 'monthly' as const })),
    ...ALTERNATIVES.map((a) => ({ url: `${BASE_URL}/alternatives/${a.slug}`, priority: 0.5, changeFrequency: 'monthly' as const })),
    // County × license-type matrix — every combination with real data (lib/coverage.ts)
    ...coverageTypeParams().map(({ county, type }) => ({
      url: `${BASE_URL}/coverage/${county}/${type}`,
      priority: 0.4,
      changeFrequency: 'monthly' as const,
    })),
    // City pages — every city with real data (>= CITY_MIN records)
    ...coverageCityParams().map(({ county, city }) => ({
      url: `${BASE_URL}/coverage/${county}/city/${city}`,
      priority: 0.4,
      changeFrequency: 'monthly' as const,
    })),
    // Texas coverage (state #2) — hub + per-county pages from the real TABC data
    { url: `${BASE_URL}/coverage/texas`, priority: 0.6, changeFrequency: 'monthly' as const },
    ...Object.keys(TX_COUNTY_DETAIL).map((slug) => ({
      url: `${BASE_URL}/coverage/texas/${slug}`,
      priority: 0.4,
      changeFrequency: 'monthly' as const,
    })),
  ].map((r) => ({ ...r, lastModified }))

  // Flatten the docs nav tree into individual doc page URLs
  const docSlugs = new Set<string>()
  const walk = (items: typeof DOCS_NAV) => {
    for (const item of items) {
      if (item.slug) docSlugs.add(item.slug)
      if (item.children) walk(item.children)
    }
  }
  walk(DOCS_NAV)

  const docRoutes: MetadataRoute.Sitemap = Array.from(docSlugs).map((slug) => ({
    url: `${BASE_URL}/docs/${slug}`,
    lastModified,
    priority: 0.7,
    changeFrequency: 'monthly',
  }))

  return [...staticRoutes, ...docRoutes, ...dynamicRoutes]
}
