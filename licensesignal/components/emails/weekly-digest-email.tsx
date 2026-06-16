import { BRAND, EmailButton, EmailLayout, emailStyles } from './email-layout'

export interface DigestStat {
  label: string
  value: string
}

export interface DigestHighlight {
  businessName: string
  detail: string
  county: string
}

export interface WeeklyDigestEmailProps {
  name: string
  weekRange: string
  stats?: DigestStat[]
  highlights?: DigestHighlight[]
}

const DEFAULT_STATS: DigestStat[] = [
  { label: 'New filings', value: '1,284' },
  { label: 'Renewals', value: '3,902' },
  { label: 'Status changes', value: '741' },
]

const DEFAULT_HIGHLIGHTS: DigestHighlight[] = [
  {
    businessName: 'The Copper Still Bar & Kitchen',
    detail: 'New beverage (BEV) license filed',
    county: 'Miami-Dade',
  },
  {
    businessName: 'Casa Verde Kitchen',
    detail: 'Food service license approved',
    county: 'Broward',
  },
  {
    businessName: 'Wynwood Tap House',
    detail: 'Consumption-on-premises license issued',
    county: 'Miami-Dade',
  },
]

export function WeeklyDigestEmail({
  name,
  weekRange,
  stats = DEFAULT_STATS,
  highlights = DEFAULT_HIGHLIGHTS,
}: WeeklyDigestEmailProps) {
  return (
    <EmailLayout preview={`Your New Venue Data week in review — ${weekRange}.`}>
      <p style={{ ...emailStyles.small, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
        Weekly digest · {weekRange}
      </p>
      <h1 style={emailStyles.heading}>Here is your week, {name}.</h1>

      <p style={emailStyles.paragraph}>
        A summary of license activity across the Florida counties and license types you
        follow over the past seven days.
      </p>

      {/* Stat row */}
      <table
        role="presentation"
        cellPadding={0}
        cellSpacing={0}
        width="100%"
        style={{ borderCollapse: 'collapse', margin: '0 0 24px' }}
      >
        <tbody>
          <tr>
            {stats.map((stat) => (
              <td
                key={stat.label}
                align="center"
                style={{
                  padding: '16px 8px',
                  backgroundColor: BRAND.surfaceAlt,
                  border: `1px solid ${BRAND.border}`,
                  borderRadius: 8,
                  width: '33%',
                }}
              >
                <div
                  style={{
                    fontFamily: emailStyles.fontFamily,
                    fontSize: 24,
                    fontWeight: 700,
                    color: BRAND.indigo,
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontFamily: emailStyles.fontFamily,
                    fontSize: 12,
                    color: BRAND.textMuted,
                    marginTop: 4,
                  }}
                >
                  {stat.label}
                </div>
              </td>
            ))}
          </tr>
        </tbody>
      </table>

      <p style={{ ...emailStyles.paragraph, fontWeight: 600, color: BRAND.text, marginBottom: 12 }}>
        Notable new businesses
      </p>

      <table
        role="presentation"
        cellPadding={0}
        cellSpacing={0}
        width="100%"
        style={{ borderCollapse: 'collapse', margin: '0 0 8px' }}
      >
        <tbody>
          {highlights.map((item) => (
            <tr key={item.businessName}>
              <td
                style={{
                  padding: '14px 0',
                  borderBottom: `1px solid ${BRAND.border}`,
                }}
              >
                <div
                  style={{
                    fontFamily: emailStyles.fontFamily,
                    fontSize: 15,
                    fontWeight: 600,
                    color: BRAND.text,
                  }}
                >
                  {item.businessName}
                </div>
                <div
                  style={{
                    fontFamily: emailStyles.fontFamily,
                    fontSize: 13,
                    color: BRAND.textSecondary,
                    marginTop: 2,
                  }}
                >
                  {item.detail} · {item.county} County
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: 24 }}>
        <EmailButton href="https://newvenuedata.com/dashboard">
          View the full feed
        </EmailButton>
      </div>

      <p style={emailStyles.small}>
        Want a different cadence?{' '}
        <a href="https://newvenuedata.com/dashboard" style={{ color: BRAND.indigo }}>
          Adjust your digest settings
        </a>
        .
      </p>
    </EmailLayout>
  )
}
