'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { MOCK_LICENSES } from '@/lib/mock-data'
import type { LicenseType } from '@/lib/types'

const TYPE_LABELS: Record<LicenseType, string> = {
  SRX: 'Spirituous (SRX)',
  COP: 'Consumption (COP)',
  BEV: 'Beer & Wine (BEV)',
  APS: 'Lounge (APS)',
  FOOD_SERVICE: 'Food Service',
  SEATING: 'Seating',
  MOBILE_FOOD: 'Mobile Food',
}

const TYPE_COLORS: Record<LicenseType, string> = {
  SRX: '#6366f1', // indigo
  COP: '#818cf8', // violet-indigo
  BEV: '#60a5fa', // blue
  FOOD_SERVICE: '#34d399', // emerald
  APS: '#fbbf24', // amber
  SEATING: '#fb923c', // orange
  MOBILE_FOOD: '#f472b6', // pink
}

interface DonutDatum {
  type: LicenseType
  label: string
  count: number
  color: string
}

function buildData(): DonutDatum[] {
  const counts = new Map<LicenseType, number>()
  for (const lic of MOCK_LICENSES) {
    counts.set(lic.licenseType, (counts.get(lic.licenseType) ?? 0) + 1)
  }
  return Array.from(counts.entries())
    .map(([type, count]) => ({
      type,
      label: TYPE_LABELS[type],
      count,
      color: TYPE_COLORS[type],
    }))
    .sort((a, b) => b.count - a.count)
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ payload: DonutDatum }>
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  const datum = payload[0].payload
  return (
    <div className="rounded-lg border border-[var(--ls-border-2)] bg-[var(--ls-surface)] p-3 shadow-xl">
      <p className="mb-1 text-xs font-medium text-[var(--ls-fg-2)]">{datum.label}</p>
      <p className="text-xs" style={{ color: datum.color }}>
        Records: <span className="font-semibold">{datum.count}</span>
      </p>
    </div>
  )
}

export function LicenseTypeDonut() {
  const data = buildData()
  const total = data.reduce((sum, d) => sum + d.count, 0)

  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
      <div className="relative h-[220px] w-full sm:w-[220px] sm:flex-shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius={62}
              outerRadius={92}
              paddingAngle={2}
              stroke="#09090b"
              strokeWidth={2}
            >
              {data.map((entry) => (
                <Cell key={entry.type} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-semibold text-[var(--ls-fg)]">{total}</span>
          <span className="text-xs text-[var(--ls-fg-3)]">Total Records</span>
        </div>
      </div>

      <ul className="flex flex-1 flex-col gap-2">
        {data.map((entry) => (
          <li key={entry.type} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2 text-[var(--ls-fg-2)]">
              <span
                className="h-2.5 w-2.5 flex-shrink-0 rounded-sm"
                style={{ backgroundColor: entry.color }}
              />
              {entry.label}
            </span>
            <span className="font-medium text-[var(--ls-fg)]">{entry.count}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
