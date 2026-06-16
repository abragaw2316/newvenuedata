import type { Metadata } from 'next'
import { ContactContent } from '@/components/contact/contact-content'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get API access to real-time Florida license intelligence. Talk to our team about your use case.',
  alternates: { canonical: 'https://newvenuedata.com/contact' },
  openGraph: {
    title: 'Get API Access — New Venue Data',
    description: "Tell us about your use case and we'll set you up with the right plan.",
    url: 'https://newvenuedata.com/contact',
  },
}

export default function ContactPage() {
  return <ContactContent />
}
