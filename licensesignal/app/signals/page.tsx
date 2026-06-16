import type { Metadata } from 'next'
import { SignalsContent } from '@/components/signals/signals-content'

export const metadata: Metadata = {
  title: 'Business Signals',
  description:
    'Every Florida business-opening signal in one feed — new-business registrations, commercial building permits, liquor licenses, and retail-food establishments, from live public records.',
  alternates: { canonical: 'https://newvenuedata.com/signals' },
  openGraph: {
    title: 'Florida Business Signals — New Venue Data',
    description: 'Registrations → permits → licenses → openings. The full funnel, from four live public-records sources.',
    url: 'https://newvenuedata.com/signals',
  },
}

export default function SignalsPage() {
  return <SignalsContent />
}
