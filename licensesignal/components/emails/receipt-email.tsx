import { BRAND, EmailButton, EmailLayout, emailStyles } from './email-layout'

export interface ReceiptLineItem {
  description: string
  amount: string
}

export interface ReceiptEmailProps {
  name: string
  invoiceNumber: string
  paidDate: string
  planName: string
  amount: string
  cardBrand?: string
  cardLast4?: string
  lineItems?: ReceiptLineItem[]
  periodEnd?: string
}

const rowLabelStyle = {
  fontFamily: emailStyles.fontFamily,
  fontSize: 14,
  color: BRAND.textSecondary,
  padding: '10px 0',
}

const rowValueStyle = {
  fontFamily: emailStyles.fontFamily,
  fontSize: 14,
  color: BRAND.text,
  textAlign: 'right' as const,
  padding: '10px 0',
}

export function ReceiptEmail({
  name,
  invoiceNumber,
  paidDate,
  planName,
  amount,
  cardBrand = 'Visa',
  cardLast4 = '4242',
  lineItems,
  periodEnd = 'next month',
}: ReceiptEmailProps) {
  const items: ReceiptLineItem[] = lineItems ?? [
    { description: `${planName} plan — monthly`, amount },
  ]

  return (
    <EmailLayout preview={`Your New Venue Data receipt — ${amount} paid.`}>
      <div
        style={{
          display: 'inline-block',
          padding: '4px 12px',
          marginBottom: 16,
          backgroundColor: '#ecfdf5',
          border: `1px solid #a7f3d0`,
          borderRadius: 999,
          fontFamily: emailStyles.fontFamily,
          fontSize: 12,
          fontWeight: 600,
          color: BRAND.emerald,
        }}
      >
        Payment received
      </div>

      <h1 style={emailStyles.heading}>Thanks, {name}. You&apos;re all set.</h1>

      <p style={emailStyles.paragraph}>
        We have received your payment of <strong>{amount}</strong>. Your {planName} plan is
        active and your Florida license feed will continue uninterrupted through{' '}
        {periodEnd}.
      </p>

      {/* Receipt meta */}
      <table
        role="presentation"
        cellPadding={0}
        cellSpacing={0}
        width="100%"
        style={{
          borderCollapse: 'separate',
          margin: '0 0 8px',
          backgroundColor: BRAND.surfaceAlt,
          border: `1px solid ${BRAND.border}`,
          borderRadius: 8,
        }}
      >
        <tbody>
          <tr>
            <td style={{ padding: '12px 16px' }}>
              <table role="presentation" cellPadding={0} cellSpacing={0} width="100%">
                <tbody>
                  <tr>
                    <td style={{ ...rowLabelStyle, padding: '4px 0' }}>Invoice</td>
                    <td style={{ ...rowValueStyle, padding: '4px 0' }}>{invoiceNumber}</td>
                  </tr>
                  <tr>
                    <td style={{ ...rowLabelStyle, padding: '4px 0' }}>Date paid</td>
                    <td style={{ ...rowValueStyle, padding: '4px 0' }}>{paidDate}</td>
                  </tr>
                  <tr>
                    <td style={{ ...rowLabelStyle, padding: '4px 0' }}>Payment method</td>
                    <td style={{ ...rowValueStyle, padding: '4px 0' }}>
                      {cardBrand} •••• {cardLast4}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Line items */}
      <table
        role="presentation"
        cellPadding={0}
        cellSpacing={0}
        width="100%"
        style={{ borderCollapse: 'collapse', margin: '16px 0 0' }}
      >
        <tbody>
          {items.map((item) => (
            <tr key={item.description}>
              <td style={{ ...rowLabelStyle, borderBottom: `1px solid ${BRAND.border}` }}>
                {item.description}
              </td>
              <td style={{ ...rowValueStyle, borderBottom: `1px solid ${BRAND.border}` }}>
                {item.amount}
              </td>
            </tr>
          ))}
          <tr>
            <td
              style={{
                fontFamily: emailStyles.fontFamily,
                fontSize: 16,
                fontWeight: 700,
                color: BRAND.text,
                padding: '14px 0',
              }}
            >
              Total paid
            </td>
            <td
              style={{
                fontFamily: emailStyles.fontFamily,
                fontSize: 16,
                fontWeight: 700,
                color: BRAND.text,
                textAlign: 'right',
                padding: '14px 0',
              }}
            >
              {amount}
            </td>
          </tr>
        </tbody>
      </table>

      <EmailButton href="https://newvenuedata.com/dashboard">
        View billing history
      </EmailButton>

      <p style={emailStyles.small}>
        This receipt is for your records. Need an itemized invoice or have a billing
        question?{' '}
        <a href="https://newvenuedata.com/contact" style={{ color: BRAND.indigo }}>
          Contact billing
        </a>
        .
      </p>
    </EmailLayout>
  )
}
