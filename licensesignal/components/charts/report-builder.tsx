'use client'

import { useMemo, useState } from 'react'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { Download } from 'lucide-react'
import { COUNTY_VOLUME, DAILY_VOLUME, MOCK_LICENSES } from '@/lib/mock-data'

type MetricKey = 'county' | 'type' | 'time'
type ChartKey = 'bar' | 'line' | 'area' | 'pie'

interface MetricConfig {
  key: MetricKey
  label: string
  /** Column used as the category/label axis. */
  categoryKey: string
  categoryLabel: string
  valueKey: string
  valueLabel: string
  rows: Array<Record<string, string | number>>
  /** Chart types that make sense for this metric. */
  allowed: ChartKey[]
}

// Human-readable names for the license type codes in MOCK_LICENSES.
const TYPE_LABELS: Record<string, string> = {
  BEV: 'Beer & Wine',
  SRX: 'Special Restaurant',
  COP: 'Consumption on Premises',
  APS: 'Package Store',
  FOOD_SERVICE: 'Food Service',
  SEATING: 'Seating',
  MOBILE_FOOD: 'Mobile Food',
}

const SERIES_COLORS = ['#6366f1', '#818cf8', '#22c55e', '#f59e0b', '#a78bfa', '#60a5fa', '#f472b6']

function buildMetrics(): Record<MetricKey, MetricConfig> {
  // Filings by county (top 10)
  const county: MetricConfig = {
    key: 'county',
    label: 'Filings by county',
    categoryKey: 'county',
    categoryLabel: 'County',
    valueKey: 'filings',
    valueLabel: 'Filings',
    allowed: ['bar', 'pie'],
    rows: COUNTY_VOLUME.slice(0, 10).map((c) => ({
      county: c.county,
      filings: c.count,
    })),
  }

  // Filings by license type (aggregated from MOCK_LICENSES)
  const typeCounts = new Map<string, number>()
  for (const lic of MOCK_LICENSES) {
    typeCounts.set(lic.licenseType, (typeCounts.get(lic.licenseType) ?? 0) + 1)
  }
  const type: MetricConfig = {
    key: 'type',
    label: 'Filings by license type',
    categoryKey: 'type',
    categoryLabel: 'License Type',
    valueKey: 'filings',
    valueLabel: 'Filings',
    allowed: ['bar', 'pie'],
    rows: Array.from(typeCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([code, count]) => ({
        type: TYPE_LABELS[code] ?? code,
        filings: count,
      })),
  }

  // Filings over time (last 30 days, total per day)
  const time: MetricConfig = {
    key: 'time',
    label: 'Filings over time',
    categoryKey: 'date',
    categoryLabel: 'Date',
    valueKey: 'filings',
    valueLabel: 'Filings',
    allowed: ['line', 'area', 'bar'],
    rows: DAILY_VOLUME.slice(-30).map((d) => ({
      date: d.date,
      filings: d.total,
    })),
  }

  return { county, type, time }
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ name: string; value: number; color?: string; payload?: Record<string, unknown> }>
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-[var(--ls-border-2)] bg-[var(--ls-surface)] p-3 shadow-xl">
      {label != null && (
        <p className="mb-1 text-xs font-medium text-[var(--ls-fg-2)]">{label}</p>
      )}
      {payload.map((p, i) => (
        <p key={i} className="text-xs" style={{ color: p.color ?? '#6366f1' }}>
          {p.name}: <span className="font-semibold">{p.value}</span>
        </p>
      ))}
    </div>
  )
}

function escapeCsv(value: string | number) {
  const s = String(value)
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`
  return s
}

function downloadCsv(metric: MetricConfig) {
  const header = [metric.categoryLabel, metric.valueLabel]
  const lines = [
    header.map(escapeCsv).join(','),
    ...metric.rows.map((row) =>
      [escapeCsv(row[metric.categoryKey]), escapeCsv(row[metric.valueKey])].join(',')
    ),
  ]
  const csv = lines.join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `licensesignal-${metric.key}-report.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const CHART_LABELS: Record<ChartKey, string> = {
  bar: 'Bar',
  line: 'Line',
  area: 'Area',
  pie: 'Pie',
}

export function ReportBuilder() {
  const metrics = useMemo(buildMetrics, [])
  const [metricKey, setMetricKey] = useState<MetricKey>('county')
  const metric = metrics[metricKey]

  const [chartKey, setChartKey] = useState<ChartKey>('bar')
  // If the chosen chart isn't valid for this metric, fall back to its first allowed type.
  const activeChart: ChartKey = metric.allowed.includes(chartKey)
    ? chartKey
    : metric.allowed[0]

  function chooseMetric(next: MetricKey) {
    setMetricKey(next)
    if (!metrics[next].allowed.includes(chartKey)) {
      setChartKey(metrics[next].allowed[0])
    }
  }

  const data = metric.rows

  return (
    <div className="flex flex-col gap-6">
      {/* Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
          {/* Metric */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-[var(--ls-fg-3)]">Metric</span>
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(metrics) as MetricKey[]).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => chooseMetric(k)}
                  className={
                    metricKey === k
                      ? 'rounded-md border border-indigo-500/40 bg-indigo-500/15 px-3 py-1.5 text-xs font-medium text-indigo-400'
                      : 'rounded-md border border-[var(--ls-border)] bg-transparent px-3 py-1.5 text-xs font-medium text-[var(--ls-fg-3)] transition-colors hover:border-[var(--ls-border-2)] hover:text-[var(--ls-fg-2)]'
                  }
                >
                  {metrics[k].label}
                </button>
              ))}
            </div>
          </div>

          {/* Chart type */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-[var(--ls-fg-3)]">Chart type</span>
            <div className="flex flex-wrap gap-1.5">
              {(['bar', 'line', 'area', 'pie'] as ChartKey[]).map((k) => {
                const enabled = metric.allowed.includes(k)
                return (
                  <button
                    key={k}
                    type="button"
                    disabled={!enabled}
                    onClick={() => setChartKey(k)}
                    className={
                      !enabled
                        ? 'cursor-not-allowed rounded-md border border-[var(--ls-border)] bg-transparent px-3 py-1.5 text-xs font-medium text-[var(--ls-fg-4)] opacity-40'
                        : activeChart === k
                          ? 'rounded-md border border-indigo-500/40 bg-indigo-500/15 px-3 py-1.5 text-xs font-medium text-indigo-400'
                          : 'rounded-md border border-[var(--ls-border)] bg-transparent px-3 py-1.5 text-xs font-medium text-[var(--ls-fg-3)] transition-colors hover:border-[var(--ls-border-2)] hover:text-[var(--ls-fg-2)]'
                    }
                  >
                    {CHART_LABELS[k]}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Export */}
        <button
          type="button"
          onClick={() => downloadCsv(metric)}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-600"
        >
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>

      {/* Chart */}
      <div className="rounded-lg border border-[var(--ls-border)] bg-[var(--ls-surface-2)] p-4">
        <ResponsiveContainer width="100%" height={300}>
          {activeChart === 'bar' ? (
            <BarChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: -16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f1f23" vertical={false} />
              <XAxis
                dataKey={metric.categoryKey}
                tick={{ fill: '#71717a', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                angle={metricKey === 'time' ? 0 : -25}
                textAnchor={metricKey === 'time' ? 'middle' : 'end'}
                height={metricKey === 'time' ? 24 : 56}
                interval={metricKey === 'time' ? 4 : 0}
                tickFormatter={(v: string) =>
                  metricKey === 'time'
                    ? new Date(v + 'T00:00:00').toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })
                    : v
                }
              />
              <YAxis tick={{ fill: '#71717a', fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.08)' }} />
              <Bar dataKey={metric.valueKey} name={metric.valueLabel} radius={[3, 3, 0, 0]} maxBarSize={36}>
                {data.map((_, i) => (
                  <Cell key={i} fill={i === 0 ? '#6366f1' : i < 3 ? '#818cf8' : '#3f3f7c'} />
                ))}
              </Bar>
            </BarChart>
          ) : activeChart === 'line' ? (
            <LineChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: -16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f1f23" vertical={false} />
              <XAxis
                dataKey={metric.categoryKey}
                tick={{ fill: '#71717a', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                interval={4}
                tickFormatter={(v: string) =>
                  new Date(v + 'T00:00:00').toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })
                }
              />
              <YAxis tick={{ fill: '#71717a', fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey={metric.valueKey}
                name={metric.valueLabel}
                stroke="#6366f1"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: '#818cf8' }}
              />
            </LineChart>
          ) : activeChart === 'area' ? (
            <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: -16 }}>
              <defs>
                <linearGradient id="rb-area" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f1f23" vertical={false} />
              <XAxis
                dataKey={metric.categoryKey}
                tick={{ fill: '#71717a', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                interval={4}
                tickFormatter={(v: string) =>
                  new Date(v + 'T00:00:00').toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })
                }
              />
              <YAxis tick={{ fill: '#71717a', fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey={metric.valueKey}
                name={metric.valueLabel}
                stroke="#6366f1"
                strokeWidth={1.5}
                fill="url(#rb-area)"
                dot={false}
              />
            </AreaChart>
          ) : (
            <PieChart>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: '11px', color: '#a1a1aa' }}
              />
              <Pie
                data={data}
                dataKey={metric.valueKey}
                nameKey={metric.categoryKey}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={95}
                paddingAngle={2}
                stroke="var(--ls-surface-2)"
                strokeWidth={2}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={SERIES_COLORS[i % SERIES_COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Underlying data preview */}
      <div className="overflow-hidden rounded-lg border border-[var(--ls-border)]">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--ls-surface-2)] text-xs uppercase tracking-wide text-[var(--ls-fg-3)]">
            <tr>
              <th className="px-4 py-2.5 font-medium">{metric.categoryLabel}</th>
              <th className="px-4 py-2.5 text-right font-medium">{metric.valueLabel}</th>
            </tr>
          </thead>
          <tbody>
            {data.slice(0, 8).map((row, i) => (
              <tr
                key={i}
                className="border-t border-[var(--ls-border)] text-[var(--ls-fg-2)]"
              >
                <td className="px-4 py-2">
                  {metricKey === 'time'
                    ? new Date(String(row[metric.categoryKey]) + 'T00:00:00').toLocaleDateString(
                        'en-US',
                        { month: 'short', day: 'numeric', year: 'numeric' }
                      )
                    : row[metric.categoryKey]}
                </td>
                <td className="px-4 py-2 text-right font-mono tabular-nums text-[var(--ls-fg)]">
                  {row[metric.valueKey]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {data.length > 8 && (
          <p className="border-t border-[var(--ls-border)] bg-[var(--ls-surface-2)] px-4 py-2 text-[11px] text-[var(--ls-fg-4)]">
            Showing 8 of {data.length} rows — export CSV for the full dataset.
          </p>
        )}
      </div>
    </div>
  )
}
