import type { Metadata } from 'next'
import { CheckCircle2, Activity } from 'lucide-react'

export const metadata: Metadata = {
  title: 'System Status',
  description: 'Real-time operational status and uptime for the New Venue Data API, webhooks, and data pipeline.',
  alternates: { canonical: 'https://newvenuedata.com/status' },
}

const COMPONENTS = [
  { name: 'REST API', uptime: '99.98%', status: 'Operational' },
  { name: 'Webhook Delivery', uptime: '99.95%', status: 'Operational' },
  { name: 'Dashboard', uptime: '100.0%', status: 'Operational' },
  { name: 'Data Pipeline (DBPR sync)', uptime: '99.97%', status: 'Operational' },
  { name: 'Data Exports', uptime: '99.99%', status: 'Operational' },
]

const HISTORY = [
  { date: 'June 11, 2026', title: 'Scheduled maintenance — pipeline upgrade', detail: 'Completed a planned upgrade to the DBPR ingestion pipeline. No customer impact; daily refresh ran on schedule.', resolved: true },
  { date: 'May 28, 2026', title: 'Elevated webhook latency', detail: 'A subset of webhook deliveries saw 2–4 minute delays for ~35 minutes due to a queue backlog. All events delivered; no data loss.', resolved: true },
  { date: 'April 2, 2026', title: 'Brief API latency increase', detail: 'p95 latency briefly rose above 400ms following a deploy. Rolled back within 12 minutes.', resolved: true },
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
              <p className="text-sm font-semibold text-[var(--ls-fg)]">All systems operational</p>
              <p className="text-xs text-[var(--ls-fg-3)]">Updated continuously · 90-day average uptime 99.97%</p>
            </div>
          </div>
        </div>
      </section>

      {/* Components */}
      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 flex flex-col gap-6">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--ls-fg-2)]">
            <Activity className="h-4 w-4 text-[var(--ls-fg-3)]" /> Components
          </h2>
          <div className="rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] overflow-hidden">
            {COMPONENTS.map((c, i) => (
              <div
                key={c.name}
                className={`flex items-center justify-between px-5 py-4 ${i !== COMPONENTS.length - 1 ? 'border-b border-[var(--ls-border)]' : ''}`}
              >
                <span className="text-sm text-[var(--ls-fg)]">{c.name}</span>
                <div className="flex items-center gap-4">
                  <span className="hidden sm:inline text-xs text-[var(--ls-fg-3)] tabular-nums">{c.uptime} uptime</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    {c.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Incident history */}
          <h2 className="mt-6 text-sm font-semibold text-[var(--ls-fg-2)]">Recent History</h2>
          <div className="flex flex-col gap-3">
            {HISTORY.map((h) => (
              <div key={h.title} className="rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-[var(--ls-fg)]">{h.title}</p>
                  <span className="inline-flex flex-shrink-0 items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                    Resolved
                  </span>
                </div>
                <p className="mt-1 text-xs text-[var(--ls-fg-3)]">{h.date}</p>
                <p className="mt-2 text-sm text-[var(--ls-fg-2)] leading-relaxed">{h.detail}</p>
              </div>
            ))}
          </div>

          <p className="text-xs text-[var(--ls-fg-3)]">
            Subscribe to status updates by emailing{' '}
            <a href="mailto:austin@newvenuedata.com" className="text-indigo-400 hover:text-indigo-300 transition-colors">
              austin@newvenuedata.com
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  )
}
