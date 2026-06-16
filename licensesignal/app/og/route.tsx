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
          background: '#09090b',
          padding: '64px 72px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Radial glow */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(99,102,241,0.25) 0%, transparent 70%)',
          }}
        />

        {/* Logo row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: 'rgba(99,102,241,0.2)',
              border: '1px solid rgba(99,102,241,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="#818cf8" />
            </svg>
          </div>
          <span style={{ fontSize: 22, fontWeight: 600, color: '#fafafa', letterSpacing: '-0.02em' }}>
            License<span style={{ color: '#818cf8' }}>Signal</span>
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: title.length > 60 ? 44 : 52,
            fontWeight: 700,
            color: '#fafafa',
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            maxWidth: 860,
            marginBottom: 24,
          }}
        >
          {title}
        </div>

        {/* Tagline */}
        <div style={{ fontSize: 20, color: '#71717a', letterSpacing: '-0.01em' }}>
          Real-Time Florida License Intelligence · newvenuedata.com
        </div>

        {/* Bottom border accent */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 3,
            background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
