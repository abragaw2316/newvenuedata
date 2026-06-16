'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FL_COUNTY_GEO } from '@/lib/fl-county-geo'

// Density color ramp: low filings -> dark border-tone, high -> indigo glow.
const LOW_COLOR = { r: 0x1f, g: 0x1f, b: 0x23 } // #1f1f23
const HIGH_COLOR = { r: 0x63, g: 0x66, b: 0xf1 } // #6366f1

const FILINGS = FL_COUNTY_GEO.map((c) => c.filings)
const MIN_FILINGS = Math.min(...FILINGS)
const MAX_FILINGS = Math.max(...FILINGS)

function lerp(a: number, b: number, t: number) {
  return Math.round(a + (b - a) * t)
}

function densityColor(filings: number) {
  const span = MAX_FILINGS - MIN_FILINGS || 1
  // Slight gamma so mid-range counties stay readable, not all muddy.
  const t = Math.pow((filings - MIN_FILINGS) / span, 0.75)
  const r = lerp(LOW_COLOR.r, HIGH_COLOR.r, t)
  const g = lerp(LOW_COLOR.g, HIGH_COLOR.g, t)
  const b = lerp(LOW_COLOR.b, HIGH_COLOR.b, t)
  return `rgb(${r}, ${g}, ${b})`
}

interface HoverState {
  slug: string
  name: string
  filings: number
  x: number
  y: number
}

export function FloridaMap() {
  const [hover, setHover] = useState<HoverState | null>(null)

  return (
    <div className="relative w-full">
      <svg
        viewBox="0 0 600 520"
        className="h-auto w-full"
        role="img"
        aria-label="Florida county license-filing density map"
      >
        <defs>
          <filter id="fl-county-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {FL_COUNTY_GEO.map((county) => {
          const isHovered = hover?.slug === county.slug
          return (
            <Link key={county.slug} href={`/coverage/${county.slug}`}>
              <path
                d={county.path}
                fill={densityColor(county.filings)}
                stroke={isHovered ? '#818cf8' : '#09090b'}
                strokeWidth={isHovered ? 2 : 1}
                strokeLinejoin="round"
                filter={isHovered ? 'url(#fl-county-glow)' : undefined}
                className="cursor-pointer transition-all duration-150"
                style={{
                  opacity: hover && !isHovered ? 0.78 : 1,
                  transformOrigin: 'center',
                  transform: isHovered ? 'translateY(-2px)' : undefined,
                }}
                onMouseEnter={(e) => {
                  const rect = (
                    e.currentTarget.ownerSVGElement as SVGSVGElement
                  ).getBoundingClientRect()
                  const bbox = e.currentTarget.getBBox()
                  const scale = rect.width / 600
                  setHover({
                    slug: county.slug,
                    name: county.name,
                    filings: county.filings,
                    x: (bbox.x + bbox.width / 2) * scale,
                    y: bbox.y * scale,
                  })
                }}
                onMouseLeave={() => setHover(null)}
                aria-label={`${county.name}: ${county.filings} filings per month`}
              />
            </Link>
          )
        })}
      </svg>

      {/* Tooltip */}
      {hover && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-lg border border-[var(--ls-border-2)] bg-[var(--ls-surface)] px-3 py-2 shadow-xl"
          style={{ left: hover.x, top: hover.y - 8 }}
        >
          <p className="whitespace-nowrap text-xs font-semibold text-[var(--ls-fg)]">
            {hover.name}
          </p>
          <p className="whitespace-nowrap text-[11px] text-indigo-400">
            {hover.filings} filings/mo
          </p>
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 flex items-center gap-3 px-1">
        <span className="text-[11px] font-medium text-[var(--ls-fg-3)]">Low</span>
        <div
          className="h-2 flex-1 rounded-full"
          style={{
            background: `linear-gradient(to right, rgb(${LOW_COLOR.r}, ${LOW_COLOR.g}, ${LOW_COLOR.b}), #6366f1)`,
          }}
        />
        <span className="text-[11px] font-medium text-[var(--ls-fg-2)]">High</span>
        <span className="ml-1 text-[11px] text-[var(--ls-fg-3)]">filing density / mo</span>
      </div>
    </div>
  )
}
