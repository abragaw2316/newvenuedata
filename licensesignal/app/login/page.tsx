import type { Metadata } from 'next'
import { LoginContent } from '@/components/auth/login-content'

export const metadata: Metadata = {
  title: 'Sign In',
  description:
    'Sign in to your New Venue Data account to manage API keys, webhooks, and your Florida license feed.',
  alternates: { canonical: 'https://newvenuedata.com/login' },
  robots: { index: false, follow: false },
}

export default function LoginPage() {
  return <LoginContent />
}
