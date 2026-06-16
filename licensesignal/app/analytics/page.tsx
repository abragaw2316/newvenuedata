import type { Metadata } from 'next'
import { Info, Map, CalendarDays, SlidersHorizontal } from 'lucide-react'
import { SectionHeading } from '@/components/shared/section-heading'
import { TagBadge } from '@/components/shared/tag-badge'
import { CtaBanner } from '@/components/sections/cta-banner'
import { TimeScrubberMap } from '@/components/charts/time-scrubber-map'
import { HeatmapCalendar } from '@/components/charts/heatmap-calendar'
import { ReportBuilder } from '@/components/charts/report-builder'

export const metadata: Metadata = {
  title: 'Analytics & Visualizations',
  description:
    'Explore Florida license-filing trends with interactive analytics — a time-scrubbing county density map, a daily-volume calendar heatmap, and a build-your-own report tool with CSV export.',
  alternates: { canonical: 'https://newvenuedata.com/analytics' },
}

interface ChartCardProps {
  icon: React.ReactNode
  title: string
  description: string
  children: React.ReactNode
}

function ChartCard({ icon, title, description, children }: ChartCardProps) {
  return (
    <div className="rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-6 gradient-card lg:p-8">
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10 text-indigo-400">
          {icon}
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold text-[var(--ls-fg)]">{title}</h3>
          <p className="text-sm text-[var(--ls-fg-3)]">{description}</p>
        </div>
      </div>
      {children}
    </div>
  )
}

export default function AnalyticsPage() {
  return (
    <div>
      {/* Hero */}
      <section className="py-20 lg:py-28 gradient-hero">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Analytics"
            heading="Visualize Florida License Activity"
            subtext="Interactive analytics built on the New Venue Data feed. Scrub through monthly filing density across counties, scan a calendar heatmap of daily volume, and assemble your own report — then export the underlying data to CSV."
          />
          <div className="mt-8 flex justify-center">
            <TagBadge variant="beta">Interactive demo</TagBadge>
          </div>
        </div>
      </section>

      {/* Charts */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
          {/* Demo notice */}
          <div className="flex items-start gap-3 rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-3">
            <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-400" />
            <p className="text-sm text-[var(--ls-fg-2)]">
              <span className="font-medium text-amber-400">Preview:</span>{' '}
              These visualizations run on illustrative sample data to demonstrate
              what the analytics layer looks like. Live customers get the same
              charts wired to real-time filings across all 67 Florida counties.
            </p>
          </div>

          <ChartCard
            icon={<Map className="h-5 w-5" />}
            title="Filing Density Over Time"
            description="Scrub or play through the year to watch county filing density shift month by month."
          >
            <TimeScrubberMap />
          </ChartCard>

          <ChartCard
            icon={<CalendarDays className="h-5 w-5" />}
            title="Daily Volume Heatmap"
            description="A calendar view of total daily filings — darker cells mark the busiest filing days."
          >
            <HeatmapCalendar />
          </ChartCard>

          <ChartCard
            icon={<SlidersHorizontal className="h-5 w-5" />}
            title="Report Builder"
            description="Pick a metric and a chart type to compose a view, then export the underlying data as CSV."
          >
            <ReportBuilder />
          </ChartCard>
        </div>
      </section>

      <CtaBanner />
    </div>
  )
}
