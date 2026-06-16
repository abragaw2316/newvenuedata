'use client'

import { useState } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { DAILY_VOLUME } from '@/lib/mock-data'

const RANGES = [7, 30, 90] as const
type Range = (typeof RANGES)[number]

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-[var(--ls-border-2)] bg-[var(--ls-surface)] p-3 shadow-xl">
      <p className="mb-1 text-xs font-medium text-[var(--ls-fg-2)]">{label}</p>
      <p className="text-xs text-[#818cf8]">
        Filings: <span className="font-semibold">{payload[0].value}</span>
      </p>
    </div>
  )
}

export function VelocityTrend() {
  const [range, setRange] = useState<Range>(30)

  const data = DAILY_VOLUME.slice(-range).map((d) => ({
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    total: d.total,
  }))

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-[var(--ls-fg-2)]">Filing velocity</p>
        <div className="inline-flex items-center gap-1 rounded-md border border-[var(--ls-border)] bg-[var(--ls-surface-2)] p-1">
          {RANGES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
                range === r
                  ? 'bg-indigo-500 text-white'
                  : 'text-[var(--ls-fg-2)] hover:bg-[var(--ls-hover)] hover:text-[var(--ls-fg)]'
              }`}
            >
              {r}d
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id="gradVelocity" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f1f23" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: '#71717a', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            interval={Math.max(0, Math.floor(range / 6))}
          />
          <YAxis tick={{ fill: '#71717a', fontSize: 10 }} tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="total"
            name="Filings"
            stroke="#818cf8"
            strokeWidth={1.5}
            fill="url(#gradVelocity)"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
