import { buildFaq, type FaqItem } from '@/lib/seo'

interface FaqSchemaProps {
  /** FAQ entries as { q, a } pairs. Empty/duplicate entries are dropped. */
  items: FaqItem[]
}

/**
 * Emits a schema.org FAQPage JSON-LD block. Render this once per page that
 * has a visible FAQ section so search engines and AI answer engines can
 * surface the questions as rich results. Renders nothing if there are no
 * valid entries. Server-component friendly (no client hooks).
 */
export function FaqSchema({ items }: FaqSchemaProps) {
  const faqs = buildFaq(items)
  if (faqs.length === 0) return null

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
      }}
    />
  )
}
