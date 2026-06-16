import { BLOG_POSTS } from '@/lib/blog-posts'
import { absoluteUrl } from '@/lib/seo'

/**
 * GET /feed.xml
 *
 * An RSS 2.0 feed combining the New Venue Data blog with a short stream of
 * changelog-style product entries. Served with an `application/xml`
 * content-type so feed readers and search engines pick it up correctly.
 */

interface FeedItem {
  title: string
  description: string
  link: string
  guid: string
  date: string
  category: string
}

// Lightweight changelog entries surfaced alongside the blog in the feed.
const CHANGELOG_ENTRIES: FeedItem[] = [
  {
    title: 'New: ownership-transfer webhook events',
    description:
      'Subscribe to ownership_transfer alongside new_filing to catch businesses changing hands the moment the public record updates.',
    link: absoluteUrl('/changelog'),
    guid: absoluteUrl('/changelog#ownership-transfer-events'),
    date: 'June 10, 2026',
    category: 'Changelog',
  },
  {
    title: 'Expanded county coverage across the I-4 corridor',
    description:
      'Coverage now spans the fastest-growing inland markets between Tampa and Orlando, with same-day filing ingestion.',
    link: absoluteUrl('/changelog'),
    guid: absoluteUrl('/changelog#i4-corridor-coverage'),
    date: 'June 2, 2026',
    category: 'Changelog',
  },
  {
    title: 'Cursor-based pagination on the licenses API',
    description:
      'The /v1/licenses endpoint now returns opaque cursors for stable, gap-free pagination across large result sets.',
    link: absoluteUrl('/changelog'),
    guid: absoluteUrl('/changelog#cursor-pagination'),
    date: 'May 22, 2026',
    category: 'Changelog',
  },
]

/** Escape the five XML-significant characters for safe inclusion in text nodes. */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/** Convert a human-readable date string to RFC-822 for RSS pubDate. */
function toRfc822(dateStr: string): string {
  const d = new Date(dateStr)
  return Number.isNaN(d.getTime()) ? new Date().toUTCString() : d.toUTCString()
}

function renderItem(item: FeedItem): string {
  return `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.link)}</link>
      <guid isPermaLink="false">${escapeXml(item.guid)}</guid>
      <category>${escapeXml(item.category)}</category>
      <description>${escapeXml(item.description)}</description>
      <pubDate>${toRfc822(item.date)}</pubDate>
    </item>`
}

export async function GET() {
  const blogItems: FeedItem[] = BLOG_POSTS.map((post) => ({
    title: post.title,
    description: post.excerpt,
    link: absoluteUrl(`/blog/${post.slug}`),
    guid: absoluteUrl(`/blog/${post.slug}`),
    date: post.date,
    category: post.category,
  }))

  const items = [...blogItems, ...CHANGELOG_ENTRIES].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const lastBuildDate = items.length ? toRfc822(items[0].date) : new Date().toUTCString()

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>New Venue Data Blog &amp; Changelog</title>
    <link>${absoluteUrl('/blog')}</link>
    <atom:link href="${absoluteUrl('/feed.xml')}" rel="self" type="application/rss+xml" />
    <description>Real-time Florida license intelligence — playbooks, data studies, and product updates from New Venue Data.</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
${items.map(renderItem).join('\n')}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
