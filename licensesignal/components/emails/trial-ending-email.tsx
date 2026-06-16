import { BRAND, EmailButton, EmailLayout, emailStyles } from './email-layout'

export interface TrialEndingEmailProps {
  name: string
  daysLeft: number
  trialEndDate: string
  planName?: string
}

const featureStyle = {
  margin: '0 0 10px',
  fontFamily: emailStyles.fontFamily,
  fontSize: 15,
  lineHeight: 1.5,
  color: BRAND.textSecondary,
}

export function TrialEndingEmail({
  name,
  daysLeft,
  trialEndDate,
  planName = 'Growth',
}: TrialEndingEmailProps) {
  const dayLabel = daysLeft === 1 ? 'day' : 'days'

  return (
    <EmailLayout
      preview={`Your New Venue Data trial ends in ${daysLeft} ${dayLabel} — keep your feed running.`}
    >
      <div
        style={{
          display: 'inline-block',
          padding: '4px 12px',
          marginBottom: 16,
          backgroundColor: '#fffbeb',
          border: `1px solid #fde68a`,
          borderRadius: 999,
          fontFamily: emailStyles.fontFamily,
          fontSize: 12,
          fontWeight: 600,
          color: BRAND.amber,
        }}
      >
        {daysLeft} {dayLabel} left in your trial
      </div>

      <h1 style={emailStyles.heading}>
        {name}, your trial ends {trialEndDate}.
      </h1>

      <p style={emailStyles.paragraph}>
        You have been pulling live Florida license data on a free trial. To keep your
        feed, webhooks, and saved filters running without interruption, add a plan before
        your trial ends.
      </p>

      <p style={{ ...emailStyles.paragraph, fontWeight: 600, color: BRAND.text, marginBottom: 12 }}>
        Upgrading to {planName} keeps:
      </p>

      <p style={featureStyle}>• Real-time webhooks for every new filing and status change</p>
      <p style={featureStyle}>• Unlimited API requests across all 67 counties</p>
      <p style={featureStyle}>• Saved county and license-type filters</p>
      <p style={featureStyle}>• Full historical record access and CSV exports</p>

      <EmailButton href="https://newvenuedata.com/pricing">
        Choose your plan
      </EmailButton>

      <p style={emailStyles.small}>
        Questions about which plan fits?{' '}
        <a href="https://newvenuedata.com/contact" style={{ color: BRAND.indigo }}>
          Talk to our team
        </a>{' '}
        — we are happy to help.
      </p>
    </EmailLayout>
  )
}
