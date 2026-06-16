'use client'

import dynamic from 'next/dynamic'

function ChartSkeleton({ height = 240 }: { height?: number }) {
  return (
    <div
      className="w-full animate-pulse rounded-lg bg-[var(--ls-hover)]"
      style={{ height }}
      aria-hidden="true"
    />
  )
}

/**
 * Recharts is a large dependency. We load the chart components lazily on the
 * client only (ssr: false), with a skeleton placeholder, so they don't bloat
 * the initial dashboard payload or block server rendering.
 */
export const LazyVolumeChart = dynamic(
  () => import('@/components/charts/license-volume-chart').then((m) => m.LicenseVolumeChart),
  { ssr: false, loading: () => <ChartSkeleton height={240} /> }
)

export const LazyCountyChart = dynamic(
  () => import('@/components/charts/county-bar-chart').then((m) => m.CountyBarChart),
  { ssr: false, loading: () => <ChartSkeleton height={320} /> }
)
