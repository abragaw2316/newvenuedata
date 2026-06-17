import type { Metadata } from 'next'
import { Hero } from '@/components/sections/hero'
import { TrustBar } from '@/components/sections/trust-bar'
import { ProblemStatement } from '@/components/sections/problem-statement'
import { ProductOverview } from '@/components/sections/product-overview'
import { FeatureGrid } from '@/components/sections/feature-grid'
import { DataPreview } from '@/components/sections/data-preview'
import { ApiSection } from '@/components/sections/api-section'
import { CtaBanner } from '@/components/sections/cta-banner'

export const metadata: Metadata = {
  title: { absolute: 'New Florida Liquor & Food License Leads | New Venue Data' },
  description:
    'See which bars & restaurants just got licensed to serve alcohol in Florida — a weekly feed of new-venue leads for liquor-liability insurance agents.',
  alternates: { canonical: 'https://newvenuedata.com' },
}

const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'New Venue Data',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description:
    'A weekly feed of newly-licensed Florida bars and restaurants — new-venue leads for liquor-liability insurance agents.',
  url: 'https://newvenuedata.com',
  offers: [
    { '@type': 'Offer', price: '149', priceCurrency: 'USD', name: 'County' },
    { '@type': 'Offer', price: '299', priceCurrency: 'USD', name: 'South Florida' },
  ],
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <Hero />
      <TrustBar />
      <ProblemStatement />
      <ProductOverview />
      <FeatureGrid />
      <DataPreview />
      <ApiSection />
      <CtaBanner />
    </>
  )
}
