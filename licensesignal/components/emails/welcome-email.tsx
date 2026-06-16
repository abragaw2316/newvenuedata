import { BRAND, EmailButton, EmailLayout, emailStyles } from './email-layout'

export interface WelcomeEmailProps {
  name: string
  apiKey?: string
}

const stepStyle = {
  margin: '0 0 14px',
  fontFamily: emailStyles.fontFamily,
  fontSize: 15,
  lineHeight: 1.6,
  color: BRAND.textSecondary,
}

export function WelcomeEmail({ name, apiKey = 'ls_live_3f9a…2b71' }: WelcomeEmailProps) {
  return (
    <EmailLayout preview="Your New Venue Data account is ready — make your first API request.">
      <h1 style={emailStyles.heading}>Welcome to New Venue Data, {name}.</h1>

      <p style={emailStyles.paragraph}>
        Your account is live. You now have access to real-time Florida business license
        data — every new filing, renewal, and status change across all 67 counties, the
        moment it hits the public record.
      </p>

      <p style={emailStyles.paragraph}>Here is your live API key to get started:</p>

      <div
        style={{
          margin: '0 0 24px',
          padding: '12px 16px',
          backgroundColor: BRAND.surfaceAlt,
          border: `1px solid ${BRAND.border}`,
          borderRadius: 8,
          fontFamily: "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace",
          fontSize: 14,
          color: BRAND.text,
          wordBreak: 'break-all',
        }}
      >
        {apiKey}
      </div>

      <p style={{ ...stepStyle, fontWeight: 600, color: BRAND.text }}>
        Three steps to your first result:
      </p>
      <p style={stepStyle}>1. Make a request to{' '}
        <span style={{ fontFamily: "Consolas, Menlo, monospace", color: BRAND.indigo }}>
          /api/licenses
        </span>{' '}
        to pull a page of records.
      </p>
      <p style={stepStyle}>2. Register a webhook to get every new event pushed in real time.</p>
      <p style={stepStyle}>3. Set county and license-type filters so you only see what matters.</p>

      <EmailButton href="https://newvenuedata.com/welcome">Open your dashboard</EmailButton>

      <p style={emailStyles.small}>
        Need a hand? Reply to this email or read the{' '}
        <a href="https://newvenuedata.com/docs" style={{ color: BRAND.indigo }}>
          quickstart docs
        </a>
        .
      </p>
    </EmailLayout>
  )
}
