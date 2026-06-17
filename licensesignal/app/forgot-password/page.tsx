import type { Metadata } from 'next'
import { ForgotPasswordForm } from '@/components/account/forgot-password-form'

export const metadata: Metadata = {
  title: 'Reset your password',
  description: 'Request a link to reset your New Venue Data password.',
  alternates: { canonical: 'https://newvenuedata.com/forgot-password' },
  robots: { index: false, follow: false },
}

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-[70vh] gradient-hero">
      <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-8">
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  )
}
