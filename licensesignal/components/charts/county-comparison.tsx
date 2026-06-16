'use client'

import { useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { COUNTY_VOLUME } from '@/lib/mock-data'

const MAX_SELECTED = 3

const BAR_COLORS = ['#6366f1', '#818cf8', '#34d399']

const sortedCounties = [...COUNTY_VOLUME].sort((a, b) => b.count - a.count)
const defaultSelected = sortedCounties.slice(0, MAX_SELECTED).map((c) => c.county)

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ value: number; payload: { county: string; color: string } }>
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  const datum = payload[0]
  return (
    <div className="rounded-lg border border-[var(--ls-border-2)] bg-[var(--ls-surface)] p-3 shadow-xl">
      <p className="mb-1 text-xs font-medium text-[var(--ls-fg-2)]">{datum.payload.county}</p>
      <p className="text-xs" style={{ color: datum.payload.color }}>
        Filings: <span className="font-semibold">{datum.value}</span>
      </p>
    </div>
  )
}

export function CountyComparison() {
  const [selected, setSelected] = useState<string[]>(defaultSelected)

  function toggle(county: string) {
    setSelected((prev) => {
      if (prev.includes(county)) {
        return prev.filter((c) => c !== county)
      }
      if (prev.length >= MAX_SELECTED) {
        return prev
      }
      return [...prev, county]
    })
  }

  const data = sortedCounties
    .filter((c) => selected.includes(c.county))
    .map((c, i) => ({
      county: c.county,
      count: c.count,
      color: BAR_COLORS[i % BAR_COLORS.length],
    }))

  const atLimit = selected.length >= MAX_SELECTED

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <p className="text-sm text-[var(--ls-fg-2)]">
          Compare counties{' '}
          <span className="text-[var(--ls-fg-3)]">
            ({selected.length}/{MAX_SELECTED} selected)
          </span>
        </p>
        <div className="flex flex-wrap gap-2">
          {sortedCounties.map((c) => {
            const isSelected = selected.includes(c.county)
            const isDisabled = !isSelected && atLimit
            return (
              <button
                key={c.county}
                type="button"
                onClick={() => toggle(c.county)}
                disabled={isDisabled}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-500/15 text-[#818cf8]'
                    : isDisabled
                      ? 'cursor-not-allowed border-[var(--ls-border)] text-[var(--ls-fg-4)]'
                      : 'border-[var(--ls-border)] text-[var(--ls-fg-2)] hover:border-[var(--ls-border-2)] hover:bg-[var(--ls-hover)] hover:text-[var(--ls-fg)]'
                }`}
              >
                {c.county}
              </button>
            )
          })}
        </div>
      </div>

      {data.length === 0 ? (
        <div className="flex h-[240px] items-center justify-center rounded-md border border-dashed border-[var(--ls-border)] text-sm text-[var(--ls-fg-3)]">
          Select at least one county to compare.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 4, right: 16, bottom: 0, left: 8 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1f1f23" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fill: '#71717a', fontSize: 10 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              type="category"
              dataKey="county"
              width={90}
              tick={{ fill: '#a1a1aa', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#18181b' }} />
            <Bar dataKey="count" name="Filings" radius={[0, 4, 4, 0]} maxBarSize={28}>
              {data.map((entry) => (
                <Cell key={entry.county} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
