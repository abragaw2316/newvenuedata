import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, LayoutDashboard, BarChart2, FileText, UserCircle } from 'lucide-react'
import { LogoMark } from '@/components/shared/logo-mark'
import { Button } from '@/components/ui/button'
import { StatCard } from '@/components/dashboard/stat-card'
import { LazyVolumeChart } from '@/components/dashboard/lazy-charts'
import { AlertFeed } from '@/components/dashboard/alert-feed'
import { DashboardContent } from '@/components/dashboard/dashboard-content'
import { STAT_CARDS } from '@/lib/mock-data'
import { getCurrentUser } from '@/lib/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Browse the live Florida license feed.',
  alternates: { canonical: 'https://newvenuedata.com/dashboard' },
  robots: { index: false, follow: false },
}

// Real destinations only — no dead "#" links, no Webhooks (not built yet).
const SIDEBAR_LINKS = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Feed', match: true },
  { href: '/analytics', icon: BarChart2, label: 'Analytics', match: false },
  { href: '/docs', icon: FileText, label: 'API Docs', match: false },
  { href: '/account', icon: UserCircle, label: 'Account', match: false },
]

const PLAN_LABEL: Record<string, { name: string; scope: string }> = {
  trial: { name: 'Free trial', scope: 'Sample access' },
  county: { name: 'County', scope: '1 Florida county' },
  south_fl: { name: 'South Florida', scope: 'Tri-county' },
  statewide: { name: 'Statewide', scope: 'All 67 counties' },
}

export default async function DashboardPage() {
  const user = await getCurrentUser()
  const plan = user ? (PLAN_LABEL[user.plan] ?? PLAN_LABEL.trial) : null

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
          {SIDEBAR_LINKS.map(({ href, icon: Icon, label, match }) => (
            <Link
              key={label}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                match
                  ? 'bg-indigo-500/15 text-indigo-400'
                  : 'text-[var(--ls-fg-3)] hover:text-[var(--ls-fg-2)] hover:bg-[var(--ls-hover)]'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Account — real session, no fabricated demo identity */}
        <div className="border-t border-[var(--ls-border)] p-4 flex flex-col gap-2">
          {user && plan ? (
            <>
              <Link
                href="/account"
                className="rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-3 py-2 transition-colors hover:border-indigo-500/40"
              >
                <p className="text-xs font-semibold text-indigo-400">{plan.name}</p>
                <p className="text-[10px] text-[var(--ls-fg-3)]">{plan.scope}</p>
              </Link>
              <p className="truncate text-[10px] text-[var(--ls-fg-3)] px-1">{user.email}</p>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-lg border border-[var(--ls-border-2)] bg-[var(--ls-surface)] px-3 py-2 text-xs font-medium text-[var(--ls-fg-2)] transition-colors hover:border-indigo-500/40 hover:text-[var(--ls-fg)]"
            >
              Sign in to your account →
            </Link>
          )}
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Honest context banner — the data below is real; full management is on /account */}
        <div className="flex items-center justify-between gap-3 border-b border-[var(--ls-border)] bg-[var(--ls-surface-2)] px-4 py-2.5">
          <p className="text-xs text-[var(--ls-fg-3)]">
            {user ? (
              <>Live preview of the Florida feed. Your weekly county list is delivered by email — manage everything in your account.</>
            ) : (
              <>A live preview of real Florida filings. Sign in to manage your account, or see plans to get your county&apos;s weekly list.</>
            )}
          </p>
          <Button
            render={<Link href={user ? '/account' : '/pricing'} />}
            nativeButton={false}
            size="sm"
            className="h-7 flex-shrink-0 bg-indigo-500 hover:bg-indigo-600 text-white border-0 text-xs"
          >
            {user ? 'Your account' : 'See plans'} <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </div>

        <div className="flex-1 overflow-auto p-4 lg:p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-[var(--ls-fg)]">License Feed</h1>
            <p className="text-sm text-[var(--ls-fg-3)] mt-0.5">Live Florida filings · updated daily from FL DBPR</p>
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
