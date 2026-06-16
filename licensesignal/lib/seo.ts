/**
 * SEO helpers shared across structured-data components, the RSS feed,
 * and any page that needs canonical absolute URLs.
 */

export const SITE_URL = 'https://newvenuedata.com'

export interface FaqItem {
  q: string
  a: string
}

/**
 * Resolve a site-relative path to a fully-qualified absolute URL under the
 * canonical origin. Handles leading slashes, empty paths, and values that are
 * already absolute (returned untouched).
 *
 * absoluteUrl('/blog')  -> 'https://newvenuedata.com/blog'
 * absoluteUrl('blog')   -> 'https://newvenuedata.com/blog'
 * absoluteUrl('/')      -> 'https://newvenuedata.com'
 * absoluteUrl('https://x') -> 'https://x'
 */
export function absoluteUrl(path = '/'): string {
  if (/^https?:\/\//i.test(path)) return path
  if (!path || path === '/') return SITE_URL
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${SITE_URL}${normalized}`
}

/**
 * Normalize a loose list of FAQ entries into a clean, deduplicated array of
 * `{ q, a }` pairs. Trims whitespace and drops any entry missing a question
 * or answer, so callers can pass data straight through to FaqSchema.
 */
export function buildFaq(items: FaqItem[]): FaqItem[] {
  const seen = new Set<string>()
  const out: FaqItem[] = []

  for (const item of items) {
    const q = item?.q?.trim()
    const a = item?.a?.trim()
    if (!q || !a) continue
    const key = q.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    out.push({ q, a })
  }

  return out
}
