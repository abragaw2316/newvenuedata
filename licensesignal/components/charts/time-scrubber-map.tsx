'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Play, Pause, RotateCcw } from 'lucide-react'
import { FL_COUNTY_GEO } from '@/lib/fl-county-geo'

// Density color ramp: low filings -> dark surface tone, high -> indigo glow.
const LOW_COLOR = { r: 0x1f, g: 0x1f, b: 0x23 } // #1f1f23
const HIGH_COLOR = { r: 0x63, g: 0x66, b: 0xf1 } // #6366f1

// Twelve months of synthetic monthly multipliers per county. Each county gets a
// deterministic seasonal curve so scrubbing the slider visibly re-colors the map.
const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

// Deterministic pseudo-random in [0,1) from an integer seed.
function seeded(n: number) {
  const x = Math.sin(n * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

interface CountyMonthly {
  name: string
  slug: string
  path: string
  /** filings for each of the 12 months */
  byMonth: number[]
}

// Build a per-county, per-month filing series anchored on the baseline `filings`
// value, with a county-specific seasonal swing and a touch of noise.
const COUNTY_SERIES: CountyMonthly[] = FL_COUNTY_GEO.map((c, ci) => {
  const phase = seeded(ci + 1) * Math.PI * 2
  const amplitude = 0.28 + seeded(ci + 7) * 0.22 // 0.28 - 0.50 seasonal swing
  const byMonth = MONTHS.map((_, mi) => {
    const seasonal = 1 + amplitude * Math.sin((mi / 12) * Math.PI * 2 + phase)
    const noise = 0.92 + seeded(ci * 31 + mi * 7) * 0.16
    return Math.max(1, Math.round(c.filings * seasonal * noise))
  })
  return { name: c.name, slug: c.slug, path: c.path, byMonth }
})

// Global min/max across every county and month so the color scale is stable
// while scrubbing (a county's color is comparable across months).
const ALL_VALUES = COUNTY_SERIES.flatMap((c) => c.byMonth)
const MIN_FILINGS = Math.min(...ALL_VALUES)
const MAX_FILINGS = Math.max(...ALL_VALUES)

function lerp(a: number, b: number, t: number) {
  return Math.round(a + (b - a) * t)
}

function densityColor(filings: number) {
  const span = MAX_FILINGS - MIN_FILINGS || 1
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

export function TimeScrubberMap() {
  const [monthIndex, setMonthIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [hover, setHover] = useState<HoverState | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!playing) return
    timerRef.current = setInterval(() => {
      setMonthIndex((m) => (m + 1) % MONTHS.length)
    }, 900)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [playing])

  const monthTotal = useMemo(
    () => COUNTY_SERIES.reduce((sum, c) => sum + c.byMonth[monthIndex], 0),
    [monthIndex]
  )

  return (
    <div className="flex flex-col gap-5">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          className="inline-flex items-center gap-2 rounded-md bg-indigo-500 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-600"
          aria-label={playing ? 'Pause animation' : 'Play animation'}
        >
          {playing ? (
            <>
              <Pause className="h-4 w-4" /> Pause
            </>
          ) : (
            <>
              <Play className="h-4 w-4" /> Play
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => {
            setPlaying(false)
            setMonthIndex(0)
          }}
          className="inline-flex items-center gap-2 rounded-md border border-[var(--ls-border-2)] bg-transparent px-3 py-2 text-sm font-medium text-[var(--ls-fg-2)] transition-colors hover:border-indigo-500/50 hover:text-[var(--ls-fg)]"
          aria-label="Reset to January"
        >
          <RotateCcw className="h-4 w-4" /> Reset
        </button>

        <div className="ml-auto flex items-baseline gap-2">
          <span className="font-mono text-2xl font-semibold tabular-nums text-[var(--ls-fg)]">
            {MONTHS[monthIndex]}
          </span>
          <span className="text-xs text-[var(--ls-fg-3)]">
            {monthTotal.toLocaleString()} filings
          </span>
        </div>
      </div>

      {/* Slider */}
      <div className="flex flex-col gap-2">
        <input
          type="range"
          min={0}
          max={MONTHS.length - 1}
          step={1}
          value={monthIndex}
          onChange={(e) => {
            setPlaying(false)
            setMonthIndex(Number(e.target.value))
          }}
          className="ls-scrubber w-full"
          aria-label="Scrub through months"
          aria-valuetext={MONTHS[monthIndex]}
        />
        <div className="flex justify-between px-0.5">
          {MONTHS.map((m, i) => (
            <span
              key={m}
              className={
                i === monthIndex
                  ? 'text-[10px] font-semibold text-indigo-400'
                  : 'text-[10px] text-[var(--ls-fg-4)]'
              }
            >
              {m.charAt(0)}
            </span>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="relative w-full">
        <svg
          viewBox="0 0 600 520"
          className="h-auto w-full"
          role="img"
          aria-label={`Florida county filing density for ${MONTHS[monthIndex]}`}
        >
          <defs>
            <filter id="ts-county-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {COUNTY_SERIES.map((county) => {
            const filings = county.byMonth[monthIndex]
            const isHovered = hover?.slug === county.slug
            return (
              <path
                key={county.slug}
                d={county.path}
                fill={densityColor(filings)}
                stroke={isHovered ? '#818cf8' : '#09090b'}
                strokeWidth={isHovered ? 2 : 1}
                strokeLinejoin="round"
                filter={isHovered ? 'url(#ts-county-glow)' : undefined}
                className="cursor-pointer transition-[fill] duration-500"
                style={{ opacity: hover && !isHovered ? 0.78 : 1 }}
                onMouseEnter={(e) => {
                  const rect = (
                    e.currentTarget.ownerSVGElement as SVGSVGElement
                  ).getBoundingClientRect()
                  const bbox = e.currentTarget.getBBox()
                  const scale = rect.width / 600
                  setHover({
                    slug: county.slug,
                    name: county.name,
                    filings,
                    x: (bbox.x + bbox.width / 2) * scale,
                    y: bbox.y * scale,
                  })
                }}
                onMouseLeave={() => setHover(null)}
                aria-label={`${county.name}: ${filings} filings in ${MONTHS[monthIndex]}`}
              />
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
              {hover.filings} filings · {MONTHS[monthIndex]}
            </p>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 px-1">
        <span className="text-[11px] font-medium text-[var(--ls-fg-3)]">Low</span>
        <div
          className="h-2 flex-1 rounded-full"
          style={{
            background: `linear-gradient(to right, rgb(${LOW_COLOR.r}, ${LOW_COLOR.g}, ${LOW_COLOR.b}), #6366f1)`,
          }}
        />
        <span className="text-[11px] font-medium text-[var(--ls-fg-2)]">High</span>
        <span className="ml-1 text-[11px] text-[var(--ls-fg-3)]">filings / month</span>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .ls-scrubber {
          appearance: none;
          -webkit-appearance: none;
          height: 6px;
          border-radius: 9999px;
          background: var(--ls-surface-2);
          border: 1px solid var(--ls-border);
          outline: none;
          cursor: pointer;
        }
        .ls-scrubber::-webkit-slider-thumb {
          appearance: none;
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 9999px;
          background: #6366f1;
          border: 2px solid var(--ls-surface);
          box-shadow: 0 0 10px rgba(99, 102, 241, 0.6);
          cursor: pointer;
        }
        .ls-scrubber::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 9999px;
          background: #6366f1;
          border: 2px solid var(--ls-surface);
          box-shadow: 0 0 10px rgba(99, 102, 241, 0.6);
          cursor: pointer;
        }
      `,
        }}
      />
    </div>
  )
}
