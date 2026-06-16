'use client'

import { useState } from 'react'
import { TrendingUp } from 'lucide-react'

function formatCurrency(n: number): string {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
  format: (v: number) => string
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-sm text-[var(--ls-fg-2)]">{label}</label>
        <span className="text-sm font-semibold text-[var(--ls-fg)] tabular-nums">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-[var(--ls-border-2)] accent-indigo-500"
      />
    </div>
  )
}

export function RoiCalculator() {
  const [filings, setFilings] = useState(40)
  const [closeRate, setCloseRate] = useState(8)
  const [dealValue, setDealValue] = useState(6000)

  const wonPerMonth = (filings * closeRate) / 100
  const monthlyRevenue = wonPerMonth * dealValue
  const annualRevenue = monthlyRevenue * 12
  const planCost = 999 // Pro plan reference
  const roiMultiple = monthlyRevenue > 0 ? monthlyRevenue / planCost : 0

  return (
    <div className="rounded-2xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-6 lg:p-8">
      <div className="mb-6 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/15 border border-indigo-500/20">
          <TrendingUp className="h-4 w-4 text-indigo-400" />
        </div>
        <h3 className="text-base font-semibold text-[var(--ls-fg)]">ROI Calculator</h3>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Inputs */}
        <div className="flex flex-col gap-6">
          <Slider
            label="New filings you pursue / month"
            value={filings}
            min={5}
            max={300}
            step={5}
            onChange={setFilings}
            format={(v) => `${v}`}
          />
          <Slider
            label="Your close rate"
            value={closeRate}
            min={1}
            max={40}
            step={1}
            onChange={setCloseRate}
            format={(v) => `${v}%`}
          />
          <Slider
            label="Average deal value"
            value={dealValue}
            min={500}
            max={50000}
            step={500}
            onChange={setDealValue}
            format={formatCurrency}
          />
        </div>

        {/* Output */}
        <div className="flex flex-col justify-center gap-4 rounded-xl border border-indigo-500/20 bg-indigo-500/[0.04] p-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-[var(--ls-fg-3)]">Est. new accounts / month</p>
            <p className="mt-1 text-2xl font-bold text-[var(--ls-fg)] tabular-nums">
              {wonPerMonth.toFixed(1)}
            </p>
          </div>
          <div className="border-t border-[var(--ls-border)] pt-4">
            <p className="text-xs uppercase tracking-widest text-[var(--ls-fg-3)]">Est. monthly pipeline</p>
            <p className="mt-1 text-3xl font-bold tabular-nums gradient-text">
              {formatCurrency(monthlyRevenue)}
            </p>
            <p className="mt-1 text-xs text-[var(--ls-fg-3)]">{formatCurrency(annualRevenue)} / year</p>
          </div>
          <div className="border-t border-[var(--ls-border)] pt-4">
            <p className="text-sm text-[var(--ls-fg-2)]">
              That&apos;s{' '}
              <span className="font-semibold text-emerald-400">
                {roiMultiple >= 1 ? `${Math.round(roiMultiple)}×` : `${roiMultiple.toFixed(1)}×`}
              </span>{' '}
              the cost of the Pro plan.
            </p>
          </div>
        </div>
      </div>
      <p className="mt-5 text-xs text-[var(--ls-fg-3)]">
        Estimates only, for illustration. Your results depend on your market, territory, and sales process.
      </p>
    </div>
  )
}
