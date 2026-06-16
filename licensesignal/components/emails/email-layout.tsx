import type { CSSProperties, ReactNode } from 'react'

/**
 * Email-safe, dependency-free layout wrapper for transactional emails.
 *
 * Email clients ignore <head> styles, classes, and Tailwind — every style here
 * is an inline style object. Layout is built on tables/divs with explicit widths
 * and the brand indigo (#6366f1). These are templates only; nothing is sent.
 */

export const BRAND = {
  indigo: '#6366f1',
  indigoDark: '#4f46e5',
  indigoLight: '#818cf8',
  bg: '#f4f4f7',
  surface: '#ffffff',
  surfaceAlt: '#f8f8fb',
  border: '#e6e6ee',
  text: '#1a1a23',
  textSecondary: '#52525b',
  textMuted: '#8a8a99',
  emerald: '#059669',
  amber: '#d97706',
  red: '#dc2626',
} as const

const fontFamily =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"

const outerStyle: CSSProperties = {
  margin: 0,
  padding: '24px 12px',
  backgroundColor: BRAND.bg,
  fontFamily,
  WebkitTextSizeAdjust: '100%',
}

const cardStyle: CSSProperties = {
  width: '100%',
  maxWidth: 600,
  margin: '0 auto',
  backgroundColor: BRAND.surface,
  borderRadius: 12,
  border: `1px solid ${BRAND.border}`,
  overflow: 'hidden',
}

const headerStyle: CSSProperties = {
  padding: '24px 32px',
  backgroundColor: BRAND.surface,
  borderBottom: `1px solid ${BRAND.border}`,
}

const wordmarkStyle: CSSProperties = {
  margin: 0,
  fontFamily,
  fontSize: 18,
  fontWeight: 700,
  letterSpacing: '-0.01em',
  color: BRAND.text,
}

const bodyStyle: CSSProperties = {
  padding: '32px',
}

const footerStyle: CSSProperties = {
  padding: '24px 32px',
  backgroundColor: BRAND.surfaceAlt,
  borderTop: `1px solid ${BRAND.border}`,
}

const footerTextStyle: CSSProperties = {
  margin: '0 0 8px',
  fontFamily,
  fontSize: 12,
  lineHeight: 1.6,
  color: BRAND.textMuted,
}

const footerLinkStyle: CSSProperties = {
  color: BRAND.textSecondary,
  textDecoration: 'underline',
}

export interface EmailLayoutProps {
  /** Hidden preview/preheader text shown in inbox list views. */
  preview?: string
  children: ReactNode
}

export function EmailLayout({ preview, children }: EmailLayoutProps) {
  return (
    <div style={outerStyle}>
      {preview ? (
        <div
          style={{
            display: 'none',
            overflow: 'hidden',
            lineHeight: '1px',
            maxHeight: 0,
            maxWidth: 0,
            opacity: 0,
            color: 'transparent',
          }}
        >
          {preview}
        </div>
      ) : null}

      <table
        role="presentation"
        cellPadding={0}
        cellSpacing={0}
        width="100%"
        style={{ borderCollapse: 'collapse' }}
      >
        <tbody>
          <tr>
            <td align="center" style={{ padding: 0 }}>
              <div style={cardStyle}>
                {/* Brand header */}
                <div style={headerStyle}>
                  <table role="presentation" cellPadding={0} cellSpacing={0}>
                    <tbody>
                      <tr>
                        <td style={{ verticalAlign: 'middle', paddingRight: 10 }}>
                          <div
                            style={{
                              width: 28,
                              height: 28,
                              borderRadius: 8,
                              backgroundColor: BRAND.indigo,
                              textAlign: 'center',
                              lineHeight: '28px',
                              color: '#ffffff',
                              fontSize: 16,
                              fontWeight: 700,
                              fontFamily,
                            }}
                          >
                            L
                          </div>
                        </td>
                        <td style={{ verticalAlign: 'middle' }}>
                          <p style={wordmarkStyle}>
                            New Venue <span style={{ color: BRAND.indigo }}>Data</span>
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Body */}
                <div style={bodyStyle}>{children}</div>

                {/* Footer */}
                <div style={footerStyle}>
                  <p style={footerTextStyle}>
                    New Venue Data — real-time Florida business license intelligence.
                  </p>
                  <p style={footerTextStyle}>
                    1200 Brickell Ave, Suite 1950, Miami, FL 33131
                  </p>
                  <p style={{ ...footerTextStyle, marginBottom: 0 }}>
                    You are receiving this email because you have a New Venue Data account.{' '}
                    <a href="https://newvenuedata.com/unsubscribe" style={footerLinkStyle}>
                      Unsubscribe
                    </a>{' '}
                    or{' '}
                    <a href="https://newvenuedata.com/dashboard" style={footerLinkStyle}>
                      manage preferences
                    </a>
                    .
                  </p>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

/* Shared inline-style helpers reused across templates. */

export const emailStyles = {
  fontFamily,
  heading: {
    margin: '0 0 16px',
    fontFamily,
    fontSize: 22,
    fontWeight: 700,
    lineHeight: 1.3,
    color: BRAND.text,
  } as CSSProperties,
  paragraph: {
    margin: '0 0 16px',
    fontFamily,
    fontSize: 15,
    lineHeight: 1.6,
    color: BRAND.textSecondary,
  } as CSSProperties,
  small: {
    margin: '0 0 12px',
    fontFamily,
    fontSize: 13,
    lineHeight: 1.6,
    color: BRAND.textMuted,
  } as CSSProperties,
}

export interface EmailButtonProps {
  href: string
  children: ReactNode
  color?: string
}

/** Email-safe CTA button rendered as a styled anchor. */
export function EmailButton({ href, children, color = BRAND.indigo }: EmailButtonProps) {
  return (
    <table role="presentation" cellPadding={0} cellSpacing={0} style={{ margin: '8px 0 24px' }}>
      <tbody>
        <tr>
          <td
            align="center"
            style={{ borderRadius: 8, backgroundColor: color }}
          >
            <a
              href={href}
              style={{
                display: 'inline-block',
                padding: '12px 24px',
                fontFamily,
                fontSize: 15,
                fontWeight: 600,
                color: '#ffffff',
                textDecoration: 'none',
                borderRadius: 8,
              }}
            >
              {children}
            </a>
          </td>
        </tr>
      </tbody>
    </table>
  )
}
