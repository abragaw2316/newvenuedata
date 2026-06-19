'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from 'recharts'
import { COUNTY_VOLUME } from '@/lib/mock-data'

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-[var(--ls-border-2)] bg-[var(--ls-surface)] p-3 shadow-xl">
      <p className="text-xs font-medium text-[var(--ls-fg-2)]">{label}</p>
      <p className="text-xs text-indigo-400">
        {payload[0].value} filings
      </p>
    </div>
  )
}

interface CountyBarChartProps {
  topN?: number
  horizontal?: boolean
  /** Optional explicit county volumes; defaults to the liquor-licensee COUNTY_VOLUME. */
  source?: { county: string; count: number }[]
}

export function CountyBarChart({ topN = 10, horizontal = true, source }: CountyBarChartProps) {
  const data = (source ?? COUNTY_VOLUME).slice(0, topN)

  if (horizontal) {
    return (
      <ResponsiveContainer width="100%" height={topN * 32 + 20}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 40, bottom: 0, left: 8 }}
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
            tick={{ fill: '#a1a1aa', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={90}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" radius={[0, 3, 3, 0]} maxBarSize={16}>
            {data.map((_, i) => (
              <Cell
                key={i}
                fill={i === 0 ? '#6366f1' : i < 3 ? '#818cf8' : '#3f3f7c'}
              />
            ))}
            <LabelList
              dataKey="count"
              position="right"
              style={{ fill: '#71717a', fontSize: 10 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 4, right: 4, bottom: 24, left: -20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1f1f23" vertical={false} />
        <XAxis
          dataKey="county"
          tick={{ fill: '#71717a', fontSize: 9 }}
          tickLine={false}
          axisLine={false}
          angle={-35}
          textAnchor="end"
          interval={0}
        />
        <YAxis
          tick={{ fill: '#71717a', fontSize: 10 }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="count" radius={[3, 3, 0, 0]} maxBarSize={24}>
          {data.map((_, i) => (
            <Cell
              key={i}
              fill={i === 0 ? '#6366f1' : i < 3 ? '#818cf8' : '#3f3f7c'}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
