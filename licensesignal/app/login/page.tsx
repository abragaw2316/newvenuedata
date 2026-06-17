import type { Metadata } from 'next'
import { LoginForm } from '@/components/account/login-form'

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in to manage your New Venue Data API key and plan.',
  alternates: { canonical: 'https://newvenuedata.com/login' },
  robots: { index: false, follow: false },
}

export default function LoginPage() {
  return (
    <div className="min-h-[70vh] gradient-hero">
      <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-8">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
