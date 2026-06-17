'use client'

import { TrendingUp, TrendingDown } from 'lucide-react'
import { AnimatedCounter } from '@/components/shared/animated-counter'
import type { StatCardData } from '@/lib/types'

interface StatCardProps {
  data: StatCardData
}

function Sparkline({ data }: { data: number[] }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const w = 56
  const h = 24
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w
      const y = h - ((v - min) / range) * h
      return `${x},${y}`
    })
    .join(' ')

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="opacity-60">
      <polyline
        points={points}
        fill="none"
        stroke="var(--color-indigo-500)"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function StatCard({ data }: StatCardProps) {
  const positive = data.change >= 0

  return (
    <div className="rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium text-[var(--ls-fg-3)] leading-tight">{data.label}</p>
        <Sparkline data={data.sparklineData} />
      </div>
      <div className="flex items-end justify-between gap-2">
        <p className="text-2xl font-bold text-[var(--ls-fg)] tabular-nums">
          <AnimatedCounter
            target={data.value}
            prefix={data.prefix}
            suffix={data.suffix}
          />
        </p>
        {data.change !== 0 && (
          <div
            className={`flex items-center gap-0.5 text-xs font-medium mb-0.5 ${
              positive ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {positive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {Math.abs(data.change)}%
          </div>
        )}
      </div>
    </div>
  )
}
