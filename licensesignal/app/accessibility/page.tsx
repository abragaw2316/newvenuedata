import type { Metadata } from 'next'
import { LegalPage, type LegalSection } from '@/components/legal/legal-page'

export const metadata: Metadata = {
  title: 'Accessibility',
  description: 'New Venue Data is committed to making its website and product accessible to everyone.',
  alternates: { canonical: 'https://newvenuedata.com/accessibility' },
}

const SECTIONS: LegalSection[] = [
  {
    heading: 'Our Commitment',
    blocks: [
      {
        p: 'New Venue Data is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.',
      },
    ],
  },
  {
    heading: 'Conformance Status',
    blocks: [
      {
        p: 'We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA. These guidelines explain how to make web content more accessible to people with a wide range of disabilities. Our site is built with semantic HTML, keyboard-navigable controls, a skip-to-content link, visible focus states, and support for reduced-motion preferences.',
      },
    ],
  },
  {
    heading: 'Measures We Take',
    blocks: [
      { p: 'To support accessibility, we:' },
      {
        list: [
          'Use semantic landmarks (header, nav, main, footer) and a documented heading hierarchy.',
          'Provide a "Skip to content" link and ensure all interactive elements are keyboard-operable.',
          'Maintain sufficient color contrast for text against our dark interface.',
          'Respect the prefers-reduced-motion setting to limit non-essential animation.',
          'Label form fields and surface inline, programmatically associated error messages.',
        ],
      },
    ],
  },
  {
    heading: 'Known Limitations',
    blocks: [
      {
        p: 'Despite our efforts, some content may not yet be fully accessible. Interactive data visualizations and the dashboard preview are areas we are actively improving. We welcome reports of any barriers you encounter.',
      },
    ],
  },
  {
    heading: 'Feedback',
    blocks: [
      {
        p: 'We welcome your feedback on the accessibility of New Venue Data. If you encounter accessibility barriers, please email accessibility@newvenuedata.com with the page URL and a description of the issue. We aim to respond within 3 business days.',
      },
    ],
  },
]

export default function AccessibilityPage() {
  return (
    <LegalPage
      title="Accessibility Statement"
      lastUpdated="June 14, 2026"
      intro="Everyone should be able to use New Venue Data. Here is how we work toward that, and how to tell us when we fall short."
      sections={SECTIONS}
    />
  )
}
