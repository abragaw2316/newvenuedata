import type { Metadata } from 'next'
import { PricingContent } from '@/components/pricing/pricing-content'

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Simple, transparent pricing for Florida license intelligence. Starter from $299/mo. No seat fees, no hidden limits.',
  alternates: { canonical: 'https://newvenuedata.com/pricing' },
  openGraph: {
    title: 'New Venue Data Pricing — Starter from $299/mo',
    description: 'Simple pricing for serious data teams. API + webhooks + CSV exports.',
    url: 'https://newvenuedata.com/pricing',
  },
}

export default function PricingPage() {
  return <PricingContent />
}
