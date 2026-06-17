import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const title = searchParams.get('title') ?? 'Know When Businesses Are Opening Before Everyone Else'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          background: '#faf8f3',
          padding: '64px 72px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Logo row — awning mark + wordmark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 36 }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <g fill="#1c1b17">
              <rect x="3.4" y="4.6" width="15.6" height="1.9" rx="0.5" />
              <path d="M4.2 6.5 L4.2 10.4 Q6.3 13.7 8.4 10.4 L8.4 6.5 Z" />
              <path d="M9 6.5 L9 10.4 Q11.1 13.7 13.2 10.4 L13.2 6.5 Z" />
              <path d="M13.8 6.5 L13.8 10.4 Q15.9 13.7 18 10.4 L18 6.5 Z" />
            </g>
            <circle cx="19.4" cy="4.2" r="1.7" fill="#1f6b4c" />
          </svg>
          <span style={{ fontSize: 24, fontWeight: 600, color: '#1c1b17', letterSpacing: '-0.02em' }}>
            New Venue <span style={{ color: '#1f6b4c' }}>Data</span>
          </span>
        </div>

        {/* Title — editorial serif */}
        <div
          style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: title.length > 60 ? 50 : 60,
            fontWeight: 600,
            color: '#1c1b17',
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            maxWidth: 940,
            marginBottom: 26,
          }}
        >
          {title}
        </div>

        {/* Tagline */}
        <div style={{ fontSize: 21, color: '#514e45', letterSpacing: '-0.01em' }}>
          Real-Time Florida License Intelligence ·{' '}
          <span style={{ color: '#1f6b4c' }}>newvenuedata.com</span>
        </div>

        {/* Bottom accent rule */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            background: '#1f6b4c',
          }}
        />
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
