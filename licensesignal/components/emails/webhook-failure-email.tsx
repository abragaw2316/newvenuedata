import { BRAND, EmailButton, EmailLayout, emailStyles } from './email-layout'

export interface WebhookFailureEmailProps {
  name: string
  endpointUrl: string
  failureCount: number
  statusCode: number
  lastAttempt: string
  willDisableAt?: string
}

const metaRowStyle = {
  padding: '10px 0',
  borderBottom: `1px solid ${BRAND.border}`,
}

const metaLabelStyle = {
  fontFamily: emailStyles.fontFamily,
  fontSize: 13,
  color: BRAND.textMuted,
}

const metaValueStyle = {
  fontFamily: "'SFMono-Regular', Consolas, Menlo, monospace",
  fontSize: 13,
  color: BRAND.text,
  textAlign: 'right' as const,
  wordBreak: 'break-all' as const,
}

export function WebhookFailureEmail({
  name,
  endpointUrl,
  failureCount,
  statusCode,
  lastAttempt,
  willDisableAt = 'in 24 hours',
}: WebhookFailureEmailProps) {
  return (
    <EmailLayout
      preview={`Your webhook endpoint has failed ${failureCount} times — action needed.`}
    >
      <div
        style={{
          display: 'inline-block',
          padding: '4px 12px',
          marginBottom: 16,
          backgroundColor: '#fef2f2',
          border: `1px solid #fecaca`,
          borderRadius: 999,
          fontFamily: emailStyles.fontFamily,
          fontSize: 12,
          fontWeight: 600,
          color: BRAND.red,
        }}
      >
        Webhook delivery failing
      </div>

      <h1 style={emailStyles.heading}>{name}, we can&apos;t reach your webhook.</h1>

      <p style={emailStyles.paragraph}>
        New Venue Data has tried to deliver events to your endpoint{' '}
        <strong>{failureCount} times</strong> in a row and each attempt has failed. New
        events are being queued, but if delivery keeps failing we will pause this endpoint{' '}
        <strong>{willDisableAt}</strong>.
      </p>

      <table
        role="presentation"
        cellPadding={0}
        cellSpacing={0}
        width="100%"
        style={{ borderCollapse: 'collapse', margin: '0 0 24px' }}
      >
        <tbody>
          <tr style={metaRowStyle}>
            <td style={{ ...metaRowStyle, ...metaLabelStyle }}>Endpoint</td>
            <td style={{ ...metaRowStyle, ...metaValueStyle }}>{endpointUrl}</td>
          </tr>
          <tr>
            <td style={{ ...metaRowStyle, ...metaLabelStyle }}>Last response</td>
            <td style={{ ...metaRowStyle, ...metaValueStyle, color: BRAND.red }}>
              HTTP {statusCode}
            </td>
          </tr>
          <tr>
            <td style={{ ...metaRowStyle, ...metaLabelStyle }}>Consecutive failures</td>
            <td style={{ ...metaRowStyle, ...metaValueStyle }}>{failureCount}</td>
          </tr>
          <tr>
            <td style={{ paddingTop: 10, ...metaLabelStyle }}>Last attempt</td>
            <td style={{ paddingTop: 10, ...metaValueStyle }}>{lastAttempt}</td>
          </tr>
        </tbody>
      </table>

      <p style={{ ...emailStyles.paragraph, fontWeight: 600, color: BRAND.text, marginBottom: 12 }}>
        Common fixes:
      </p>
      <p style={emailStyles.small}>• Confirm the endpoint returns a 2xx status within 10 seconds.</p>
      <p style={emailStyles.small}>• Check that your server is not blocking our IP range.</p>
      <p style={emailStyles.small}>• Verify the signing secret if you reject unsigned requests.</p>

      <div style={{ marginTop: 16 }}>
        <EmailButton href="https://newvenuedata.com/dashboard" color={BRAND.red}>
          Review webhook logs
        </EmailButton>
      </div>

      <p style={emailStyles.small}>
        Once your endpoint responds successfully, queued events will be redelivered
        automatically. See the{' '}
        <a href="https://newvenuedata.com/docs/webhooks" style={{ color: BRAND.indigo }}>
          webhook troubleshooting guide
        </a>
        .
      </p>
    </EmailLayout>
  )
}
