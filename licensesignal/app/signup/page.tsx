import type { Metadata } from 'next'
import { SignupForm } from '@/components/account/signup-form'

export const metadata: Metadata = {
  title: 'Sign up',
  description:
    'Create your New Venue Data account and get a live API key. 14-day free trial, no card required.',
  alternates: { canonical: 'https://newvenuedata.com/signup' },
  robots: { index: false, follow: false },
}

export default function SignupPage() {
  return (
    <div className="min-h-[70vh] gradient-hero">
      <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-8">
          <SignupForm />
        </div>
      </div>
    </div>
  )
}
