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
  title: 'New Venue Data — Know When Businesses Are Opening Before Everyone Else',
  description:
    'Real-time Florida liquor and food-service license intelligence via API, webhooks, and data exports. Built for distribution, supply, and intelligence teams.',
  alternates: { canonical: 'https://newvenuedata.com' },
}

const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'New Venue Data',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description:
    'Real-time Florida liquor and food-service license intelligence via API, webhooks, and data exports.',
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
