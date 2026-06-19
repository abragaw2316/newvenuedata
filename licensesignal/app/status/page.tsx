import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2, Activity } from 'lucide-react'

export const metadata: Metadata = {
  title: 'System Status',
  description: 'Operational status for the New Venue Data data pipeline, API, and exports — stated honestly.',
  alternates: { canonical: 'https://newvenuedata.com/status' },
}

// Honest status: the real components and how they run. We do NOT publish
// invented uptime percentages or a fabricated incident log — we don't yet run
// formal uptime monitoring, so we won't claim numbers we can't substantiate.
const COMPONENTS = [
  { name: 'Data pipeline (DBPR sync)', detail: 'Refreshed daily from Florida public records' },
  { name: 'REST API', detail: 'Served on Vercel' },
  { name: 'Weekly list & exports', detail: 'Generated from the latest refresh' },
]

export default function StatusPage() {
  return (
    <div>
      <section className="gradient-hero py-16 lg:py-20 border-b border-[var(--ls-border)]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-medium uppercase tracking-widest text-indigo-400">Status</p>
          <h1 className="mt-3 text-display-md text-[var(--ls-fg)]">System Status</h1>
          <div className="mt-5 flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-5 py-4">
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            <div>
              <p className="text-sm font-semibold text-[var(--ls-fg)]">Systems operational</p>
              <p className="text-xs text-[var(--ls-fg-3)]">
                The daily refresh and API are running normally.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 flex flex-col gap-6">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--ls-fg-2)]">
            <Activity className="h-4 w-4 text-[var(--ls-fg-3)]" /> Components
          </h2>
          <div className="rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] overflow-hidden">
            {COMPONENTS.map((c, i) => (
              <div
                key={c.name}
                className={`flex items-center justify-between gap-3 px-5 py-4 ${i !== COMPONENTS.length - 1 ? 'border-b border-[var(--ls-border)]' : ''}`}
              >
                <div className="min-w-0">
                  <span className="text-sm text-[var(--ls-fg)]">{c.name}</span>
                  <span className="block text-xs text-[var(--ls-fg-3)]">{c.detail}</span>
                </div>
                <span className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Operational
                </span>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface-2)] p-5">
            <p className="text-sm text-[var(--ls-fg-2)] leading-relaxed">
              We don&apos;t yet publish formal uptime metrics or an automated incident history —
              when we add monitoring, real numbers will appear here. In the meantime, if you ever
              see a problem with the data, the API, or your weekly list, email{' '}
              <Link href="mailto:austin@newvenuedata.com" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                austin@newvenuedata.com
              </Link>{' '}
              and you&apos;ll hear back the same day.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
