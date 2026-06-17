import type { Metadata } from 'next'
import { PricingContent } from '@/components/pricing/pricing-content'

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Simple, transparent pricing for Florida license intelligence. County from $149/mo, South Florida $299/mo. Month-to-month, cancel anytime.',
  alternates: { canonical: 'https://newvenuedata.com/pricing' },
  openGraph: {
    title: 'New Venue Data Pricing — County from $149/mo',
    description: 'Weekly new-venue lead lists + REST API. Month-to-month, cancel anytime.',
    url: 'https://newvenuedata.com/pricing',
  },
}

export default function PricingPage() {
  return <PricingContent />
}
