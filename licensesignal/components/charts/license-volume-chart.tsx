'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { DAILY_VOLUME } from '@/lib/mock-data'

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-[var(--ls-border-2)] bg-[var(--ls-surface)] p-3 shadow-xl">
      <p className="mb-2 text-xs font-medium text-[var(--ls-fg-2)]">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="text-xs" style={{ color: p.color }}>
          {p.name}: <span className="font-semibold">{p.value}</span>
        </p>
      ))}
    </div>
  )
}

interface LicenseVolumeChartProps {
  days?: number
}

export function LicenseVolumeChart({ days = 30 }: LicenseVolumeChartProps) {
  const data = DAILY_VOLUME.slice(-days).map((d) => ({
    ...d,
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }))

  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
        <defs>
          <linearGradient id="gradLiquor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gradFood" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1f1f23" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fill: '#71717a', fontSize: 10 }}
          tickLine={false}
          axisLine={false}
          interval={Math.floor(days / 6)}
        />
        <YAxis
          tick={{ fill: '#71717a', fontSize: 10 }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          iconType="square"
          iconSize={8}
          wrapperStyle={{ fontSize: '11px', color: '#a1a1aa' }}
        />
        <Area
          type="monotone"
          dataKey="liquor"
          name="Liquor"
          stroke="#6366f1"
          strokeWidth={1.5}
          fill="url(#gradLiquor)"
          dot={false}
        />
        <Area
          type="monotone"
          dataKey="food"
          name="Food Service"
          stroke="#22c55e"
          strokeWidth={1.5}
          fill="url(#gradFood)"
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
