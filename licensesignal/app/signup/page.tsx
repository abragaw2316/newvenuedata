import type { Metadata } from 'next'
import { SignupContent } from '@/components/auth/signup-content'

export const metadata: Metadata = {
  title: 'Sign Up',
  description:
    'Create your New Venue Data account and get an API key for real-time Florida license intelligence in minutes.',
  alternates: { canonical: 'https://newvenuedata.com/signup' },
  robots: { index: false, follow: false },
}

export default function SignupPage() {
  return <SignupContent />
}
