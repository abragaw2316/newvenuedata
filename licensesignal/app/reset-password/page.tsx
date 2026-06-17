import type { Metadata } from 'next'
import { ResetPasswordForm } from '@/components/account/reset-password-form'

export const metadata: Metadata = {
  title: 'Choose a new password',
  description: 'Set a new password for your New Venue Data account.',
  alternates: { canonical: 'https://newvenuedata.com/reset-password' },
  robots: { index: false, follow: false },
}

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams
  return (
    <div className="min-h-[70vh] gradient-hero">
      <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-8">
          <ResetPasswordForm token={token ?? ''} />
        </div>
      </div>
    </div>
  )
}
