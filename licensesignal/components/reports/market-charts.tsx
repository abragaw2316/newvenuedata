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
  PieChart,
  Pie,
} from 'recharts'

/* -------------------------------------------------------------------------- */
/*  Data — hardcoded from the live Florida DBPR pipeline (data as of 2026-06-15) */
/* -------------------------------------------------------------------------- */

interface CountyDatum {
  county: string
  count: number
}

// Top-10 Florida counties by active retail liquor licensees.
const COUNTY_DATA: CountyDatum[] = [
  { county: 'Miami-Dade', count: 6565 },
  { county: 'Broward', count: 4337 },
  { county: 'Orange', count: 3454 },
  { county: 'Palm Beach', count: 3322 },
  { county: 'Hillsborough', count: 2901 },
  { county: 'Pinellas', count: 2803 },
  { county: 'Duval', count: 2421 },
  { county: 'Lee', count: 1960 },
  { county: 'Brevard', count: 1521 },
  { county: 'Volusia', count: 1497 },
]

interface TypeDatum {
  code: string
  label: string
  count: number
  color: string
}

// Liquor license-type mix across all active licensees.
const TYPE_DATA: TypeDatum[] = [
  { code: 'COP', label: 'Consumption On Premises (COP)', count: 28592, color: 'var(--color-indigo-500)' },
  { code: 'APS', label: 'Package Stores (APS)', count: 20861, color: 'var(--color-indigo-400)' },
  { code: 'BEV', label: 'Beer & Wine (BEV)', count: 2608, color: '#60a5fa' },
]

const numberFmt = new Intl.NumberFormat('en-US')

/* -------------------------------------------------------------------------- */
/*  County bar chart                                                          */
/* -------------------------------------------------------------------------- */

interface CountyTooltipProps {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
}

function CountyTooltip({ active, payload, label }: CountyTooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-[var(--ls-border-2)] bg-[var(--ls-surface)] p-3 shadow-xl">
      <p className="mb-1 text-xs font-medium text-[var(--ls-fg-2)]">{label} County</p>
      <p className="text-xs text-indigo-400">
        <span className="font-semibold">{numberFmt.format(payload[0].value)}</span> liquor licensees
      </p>
    </div>
  )
}

function CountyBars() {
  return (
    <ResponsiveContainer width="100%" height={COUNTY_DATA.length * 34 + 24}>
      <BarChart
        data={COUNTY_DATA}
        layout="vertical"
        margin={{ top: 0, right: 56, bottom: 0, left: 8 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#1f1f23" horizontal={false} />
        <XAxis
          type="number"
          tick={{ fill: '#71717a', fontSize: 10 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v: number) => numberFmt.format(v)}
        />
        <YAxis
          type="category"
          dataKey="county"
          tick={{ fill: '#a1a1aa', fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          width={92}
        />
        <Tooltip content={<CountyTooltip />} cursor={{ fill: 'rgba(31,107,76,0.08)' }} />
        <Bar dataKey="count" radius={[0, 3, 3, 0]} maxBarSize={18}>
          {COUNTY_DATA.map((_, i) => (
            <Cell key={i} fill={i === 0 ? 'var(--color-indigo-500)' : i < 4 ? 'var(--color-indigo-400)' : '#3f3f7c'} />
          ))}
          <LabelList
            dataKey="count"
            position="right"
            formatter={(v) => (typeof v === 'number' ? numberFmt.format(v) : String(v ?? ''))}
            style={{ fill: '#71717a', fontSize: 10 }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

/* -------------------------------------------------------------------------- */
/*  License-type donut                                                        */
/* -------------------------------------------------------------------------- */

interface TypeTooltipProps {
  active?: boolean
  payload?: Array<{ payload: TypeDatum }>
}

const TYPE_TOTAL = TYPE_DATA.reduce((sum, d) => sum + d.count, 0)

function TypeTooltip({ active, payload }: TypeTooltipProps) {
  if (!active || !payload?.length) return null
  const datum = payload[0].payload
  const share = ((datum.count / TYPE_TOTAL) * 100).toFixed(1)
  return (
    <div className="rounded-lg border border-[var(--ls-border-2)] bg-[var(--ls-surface)] p-3 shadow-xl">
      <p className="mb-1 text-xs font-medium text-[var(--ls-fg-2)]">{datum.label}</p>
      <p className="text-xs" style={{ color: datum.color }}>
        <span className="font-semibold">{numberFmt.format(datum.count)}</span> licensees · {share}%
      </p>
    </div>
  )
}

function TypeDonut() {
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
      <div className="relative h-[220px] w-full sm:w-[220px] sm:flex-shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={TYPE_DATA}
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
              {TYPE_DATA.map((entry) => (
                <Cell key={entry.code} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<TypeTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-semibold text-[var(--ls-fg)]">
            {numberFmt.format(TYPE_TOTAL)}
          </span>
          <span className="text-xs text-[var(--ls-fg-3)]">Liquor licensees</span>
        </div>
      </div>

      <ul className="flex flex-1 flex-col gap-3">
        {TYPE_DATA.map((entry) => {
          const share = ((entry.count / TYPE_TOTAL) * 100).toFixed(1)
          return (
            <li key={entry.code} className="flex items-center justify-between gap-3 text-sm">
              <span className="flex items-center gap-2 text-[var(--ls-fg-2)]">
                <span
                  className="h-2.5 w-2.5 flex-shrink-0 rounded-sm"
                  style={{ backgroundColor: entry.color }}
                />
                {entry.label}
              </span>
              <span className="flex items-baseline gap-2">
                <span className="font-medium text-[var(--ls-fg)] tabular-nums">
                  {numberFmt.format(entry.count)}
                </span>
                <span className="text-xs text-[var(--ls-fg-3)] tabular-nums">{share}%</span>
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Public component                                                          */
/* -------------------------------------------------------------------------- */

export function MarketCharts() {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="flex flex-col gap-4 rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-base font-semibold text-[var(--ls-fg)]">
            Top 10 counties by liquor licensees
          </h3>
          <p className="text-sm text-[var(--ls-fg-3)]">
            Active retail alcohol licensees, ranked. Source: DBPR AB&amp;T.
          </p>
        </div>
        <CountyBars />
      </div>

      <div className="flex flex-col gap-4 rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-base font-semibold text-[var(--ls-fg)]">
            Liquor license-type mix
          </h3>
          <p className="text-sm text-[var(--ls-fg-3)]">
            How statewide active licenses split across the three primary classes.
          </p>
        </div>
        <TypeDonut />
      </div>
    </div>
  )
}
