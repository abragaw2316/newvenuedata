'use client'

import { useMemo, useState } from 'react'
import { DAILY_VOLUME } from '@/lib/mock-data'

const WEEKDAY_LABELS = ['Mon', 'Wed', 'Fri']
const MONTH_LABELS = [
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

const CELL = 13 // px size of each day cell
const GAP = 3 // px gap between cells

interface DayCell {
  date: string
  total: number
  weekday: number // 0 = Sunday
  weekIndex: number
}

interface HoverState {
  date: string
  total: number
  x: number
  y: number
}

// Bucket a value into one of 5 intensity levels (0 = empty/none).
function intensityLevel(total: number, max: number) {
  if (total <= 0) return 0
  const ratio = total / (max || 1)
  if (ratio > 0.8) return 4
  if (ratio > 0.6) return 3
  if (ratio > 0.4) return 2
  return 1
}

// Indigo intensity ramp (transparent-ish low -> bright indigo high).
const LEVEL_FILL = [
  'var(--ls-surface-2)',
  'rgba(99, 102, 241, 0.25)',
  'rgba(99, 102, 241, 0.45)',
  'rgba(99, 102, 241, 0.7)',
  '#6366f1',
]

export function HeatmapCalendar() {
  const [hover, setHover] = useState<HoverState | null>(null)

  const { cells, weekCount, maxTotal, monthTicks, totalFilings } = useMemo(() => {
    const max = DAILY_VOLUME.reduce((m, d) => Math.max(m, d.total), 0)
    const total = DAILY_VOLUME.reduce((s, d) => s + d.total, 0)

    // Align the grid so the first column starts on the Sunday of the first
    // data point's week. weekIndex increments each Sunday.
    const first = new Date(DAILY_VOLUME[0].date + 'T00:00:00')
    const startWeekday = first.getDay()

    const dayCells: DayCell[] = DAILY_VOLUME.map((d, i) => {
      const offset = startWeekday + i
      const date = new Date(d.date + 'T00:00:00')
      return {
        date: d.date,
        total: d.total,
        weekday: date.getDay(),
        weekIndex: Math.floor(offset / 7),
      }
    })

    const weeks = dayCells.length ? dayCells[dayCells.length - 1].weekIndex + 1 : 0

    // Month label ticks: first appearance of each month -> its week column.
    const ticks: { label: string; weekIndex: number }[] = []
    let lastMonth = -1
    for (const c of dayCells) {
      const m = new Date(c.date + 'T00:00:00').getMonth()
      if (m !== lastMonth) {
        ticks.push({ label: MONTH_LABELS[m], weekIndex: c.weekIndex })
        lastMonth = m
      }
    }

    return {
      cells: dayCells,
      weekCount: weeks,
      maxTotal: max,
      monthTicks: ticks,
      totalFilings: total,
    }
  }, [])

  const LEFT_GUTTER = 30 // room for weekday labels
  const TOP_GUTTER = 18 // room for month labels
  const width = LEFT_GUTTER + weekCount * (CELL + GAP)
  const height = TOP_GUTTER + 7 * (CELL + GAP)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-[var(--ls-fg-3)]">
          Daily filing volume · last {DAILY_VOLUME.length} days
        </p>
        <p className="font-mono text-xs font-medium tabular-nums text-[var(--ls-fg-2)]">
          {totalFilings.toLocaleString()} total filings
        </p>
      </div>

      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          width={width}
          height={height}
          className="max-w-none"
          role="img"
          aria-label="Calendar heatmap of daily license filing volume"
        >
          {/* Month labels */}
          {monthTicks.map((t) => (
            <text
              key={`${t.label}-${t.weekIndex}`}
              x={LEFT_GUTTER + t.weekIndex * (CELL + GAP)}
              y={11}
              className="fill-[var(--ls-fg-4)]"
              style={{ fontSize: 10 }}
            >
              {t.label}
            </text>
          ))}

          {/* Weekday labels (Mon/Wed/Fri) */}
          {WEEKDAY_LABELS.map((label, i) => {
            const row = i * 2 + 1 // rows 1,3,5 -> Mon,Wed,Fri
            return (
              <text
                key={label}
                x={0}
                y={TOP_GUTTER + row * (CELL + GAP) + CELL - 2}
                className="fill-[var(--ls-fg-4)]"
                style={{ fontSize: 10 }}
              >
                {label}
              </text>
            )
          })}

          {/* Day cells */}
          {cells.map((c) => {
            const level = intensityLevel(c.total, maxTotal)
            const x = LEFT_GUTTER + c.weekIndex * (CELL + GAP)
            const y = TOP_GUTTER + c.weekday * (CELL + GAP)
            const isHovered = hover?.date === c.date
            return (
              <rect
                key={c.date}
                x={x}
                y={y}
                width={CELL}
                height={CELL}
                rx={2.5}
                ry={2.5}
                fill={LEVEL_FILL[level]}
                stroke={isHovered ? '#818cf8' : 'var(--ls-border)'}
                strokeWidth={isHovered ? 1.5 : 0.5}
                className="cursor-pointer transition-[stroke] duration-150"
                onMouseEnter={(e) => {
                  const svg = e.currentTarget.ownerSVGElement as SVGSVGElement
                  const rect = svg.getBoundingClientRect()
                  const scale = rect.width / width
                  setHover({
                    date: c.date,
                    total: c.total,
                    x: (x + CELL / 2) * scale,
                    y: y * scale,
                  })
                }}
                onMouseLeave={() => setHover(null)}
                aria-label={`${c.date}: ${c.total} filings`}
              />
            )
          })}
        </svg>

        {/* Tooltip */}
        {hover && (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-lg border border-[var(--ls-border-2)] bg-[var(--ls-surface)] px-3 py-2 shadow-xl"
            style={{ left: hover.x, top: hover.y - 6 }}
          >
            <p className="whitespace-nowrap text-xs font-semibold text-[var(--ls-fg)]">
              {hover.total} filings
            </p>
            <p className="whitespace-nowrap text-[11px] text-[var(--ls-fg-3)]">
              {new Date(hover.date + 'T00:00:00').toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 px-0.5">
        <span className="text-[11px] text-[var(--ls-fg-3)]">Less</span>
        {LEVEL_FILL.map((fill, i) => (
          <span
            key={i}
            className="h-3 w-3 rounded-[2.5px] border border-[var(--ls-border)]"
            style={{ background: fill }}
          />
        ))}
        <span className="text-[11px] text-[var(--ls-fg-3)]">More</span>
      </div>
    </div>
  )
}
