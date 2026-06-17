import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, LayoutDashboard, BarChart2, Webhook, Settings } from 'lucide-react'
import { LogoMark } from '@/components/shared/logo-mark'
import { Button } from '@/components/ui/button'
import { StatCard } from '@/components/dashboard/stat-card'
import { LazyVolumeChart } from '@/components/dashboard/lazy-charts'
import { AlertFeed } from '@/components/dashboard/alert-feed'
import { DashboardContent } from '@/components/dashboard/dashboard-content'
import { STAT_CARDS } from '@/lib/mock-data'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Monitor Florida license filings in real time.',
  alternates: { canonical: 'https://newvenuedata.com/dashboard' },
}

const SIDEBAR_LINKS = [
  { href: '#', icon: LayoutDashboard, label: 'Feed', active: true },
  { href: '#', icon: BarChart2, label: 'Analytics', active: false },
  { href: '#', icon: Webhook, label: 'Webhooks', active: false },
  { href: '#', icon: Settings, label: 'Settings', active: false },
]

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-[var(--ls-bg)]">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-60 flex-col border-r border-[var(--ls-border)] bg-[var(--ls-surface-2)]">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b border-[var(--ls-border)] px-5">
          <div className="flex h-7 w-7 items-center justify-center">
            <LogoMark className="h-[18px] w-[18px] text-[var(--ls-fg)]" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-[var(--ls-fg)]">
            New Venue <span className="text-indigo-400">Data</span>
          </span>
        </div>

        {/* Nav */}
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {SIDEBAR_LINKS.map(({ href, icon: Icon, label, active }) => (
            <a
              key={label}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                active
                  ? 'bg-indigo-500/15 text-indigo-400'
                  : 'text-[var(--ls-fg-3)] hover:text-[var(--ls-fg-2)] hover:bg-[var(--ls-hover)]'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </a>
          ))}
        </nav>

        {/* Account */}
        <div className="border-t border-[var(--ls-border)] p-4 flex flex-col gap-2">
          <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-3 py-2">
            <p className="text-xs font-semibold text-indigo-400">Pro Plan</p>
            <p className="text-[10px] text-[var(--ls-fg-3)]">All 67 counties</p>
          </div>
          <p className="text-[10px] text-[var(--ls-fg-3)] px-1">demo@example.com</p>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Preview banner */}
        <div className="flex items-center justify-between border-b border-amber-500/20 bg-amber-500/10 px-4 py-2.5">
          <p className="text-xs text-amber-400 font-medium">
            Preview — a live dashboard is on the roadmap. Today, New Venue Data is delivered as a weekly email list.
          </p>
          <Button
            render={<Link href="/pricing" />}
            nativeButton={false}
            size="sm"
            className="h-7 bg-indigo-500 hover:bg-indigo-600 text-white border-0 text-xs"
          >
            See plans <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </div>

        <div className="flex-1 overflow-auto p-4 lg:p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-[var(--ls-fg)]">License Feed</h1>
            <p className="text-sm text-[var(--ls-fg-3)] mt-0.5">All 67 Florida counties · Updated daily</p>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {STAT_CARDS.map((stat) => (
              <StatCard key={stat.label} data={stat} />
            ))}
          </div>

          {/* Charts row */}
          <div className="grid lg:grid-cols-3 gap-4 mb-6">
            {/* Volume chart */}
            <div className="lg:col-span-2 rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-[var(--ls-fg)]">Filing Volume (30d)</h3>
                <span className="text-xs text-[var(--ls-fg-3)]">Liquor + Food Service</span>
              </div>
              <LazyVolumeChart days={30} />
            </div>

            {/* Alert feed */}
            <div className="rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-4">
              <AlertFeed />
            </div>
          </div>

          {/* Interactive feed: filters, sortable table, detail drawer, analytics charts */}
          <DashboardContent />
        </div>
      </div>
    </div>
  )
}
