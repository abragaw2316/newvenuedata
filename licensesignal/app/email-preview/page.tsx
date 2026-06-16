import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { WelcomeEmail } from '@/components/emails/welcome-email'
import { WeeklyDigestEmail } from '@/components/emails/weekly-digest-email'
import { TrialEndingEmail } from '@/components/emails/trial-ending-email'
import { WebhookFailureEmail } from '@/components/emails/webhook-failure-email'
import { ReceiptEmail } from '@/components/emails/receipt-email'

export const metadata: Metadata = {
  title: 'Email Templates',
  description:
    'Internal preview of New Venue Data transactional email templates — welcome, weekly digest, trial ending, webhook failure, and receipt.',
  alternates: { canonical: 'https://newvenuedata.com/email-preview' },
  robots: { index: false, follow: false },
}

type PreviewItem = {
  id: string
  label: string
  description: string
  node: ReactNode
}

const TEMPLATES: PreviewItem[] = [
  {
    id: 'welcome',
    label: 'Welcome',
    description: 'Sent right after signup. WelcomeEmail({ name, apiKey })',
    node: <WelcomeEmail name="Jordan" />,
  },
  {
    id: 'weekly-digest',
    label: 'Weekly digest',
    description: 'Recurring summary of license activity. WeeklyDigestEmail({ name, weekRange, ... })',
    node: <WeeklyDigestEmail name="Jordan" weekRange="Jun 8 – Jun 14, 2026" />,
  },
  {
    id: 'trial-ending',
    label: 'Trial ending',
    description: 'Nudge before a free trial expires. TrialEndingEmail({ name, daysLeft, trialEndDate })',
    node: (
      <TrialEndingEmail name="Jordan" daysLeft={3} trialEndDate="June 18, 2026" planName="Growth" />
    ),
  },
  {
    id: 'webhook-failure',
    label: 'Webhook failure',
    description: 'Alert when a webhook endpoint keeps failing. WebhookFailureEmail({ ... })',
    node: (
      <WebhookFailureEmail
        name="Jordan"
        endpointUrl="https://api.acme.com/hooks/licensesignal"
        failureCount={8}
        statusCode={503}
        lastAttempt="June 14, 2026 at 4:12 PM ET"
      />
    ),
  },
  {
    id: 'receipt',
    label: 'Receipt',
    description: 'Payment confirmation. ReceiptEmail({ name, invoiceNumber, amount, ... })',
    node: (
      <ReceiptEmail
        name="Jordan"
        invoiceNumber="LS-2026-04821"
        paidDate="June 14, 2026"
        planName="Growth"
        amount="$149.00"
        periodEnd="July 14, 2026"
      />
    ),
  },
]

export default function EmailPreviewPage() {
  return (
    <div>
      {/* Hero */}
      <section className="py-20 lg:py-28 gradient-hero">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-6 text-center">
          <span className="inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium tracking-widest text-indigo-400 uppercase">
            Internal
          </span>
          <h1 className="text-display-lg text-[var(--ls-fg)] max-w-3xl">
            Transactional Email Templates
          </h1>
          <p className="max-w-2xl text-lg text-[var(--ls-fg-2)]">
            A live preview of every New Venue Data transactional email. Each template is a
            dependency-free, email-safe React component built on inline styles — rendered
            here once with sample props.
          </p>
        </div>
      </section>

      {/* Previews */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-12">
          {TEMPLATES.map((template) => (
            <div key={template.id} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-0.5 text-xs font-medium text-indigo-400">
                    {template.label}
                  </span>
                  <code className="font-mono text-xs text-[var(--ls-fg-3)]">
                    {template.description}
                  </code>
                </div>
              </div>

              <div className="overflow-hidden rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface-2)] p-4 sm:p-8">
                {template.node}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
