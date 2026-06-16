import Link from 'next/link'
import { notFound } from 'next/navigation'
import { isProspectsEnabled, listProspects, funnelCounts } from '@/lib/prospects-db'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const metadata = { title: 'Prospects (internal)', robots: { index: false, follow: false } }

const FUNNEL_ORDER = ['discovered', 'enriched', 'scored', 'researched', 'drafted', 'approved', 'sent', 'replied', 'trial', 'won', 'suppressed']

function scoreColor(s: number | null) {
  if (s == null) return 'text-[var(--ls-fg-4)]'
  if (s >= 85) return 'text-emerald-400'
  if (s >= 60) return 'text-amber-400'
  return 'text-[var(--ls-fg-3)]'
}

export default async function ProspectsPage() {
  if (!isProspectsEnabled()) notFound()
  const [rows, funnel] = await Promise.all([listProspects(), funnelCounts()])
  const total = rows.length
  const withEmail = rows.filter((r) => r.email).length

  return (
    <div className="min-h-screen bg-[var(--ls-bg)] text-[var(--ls-fg)] px-4 sm:px-6 lg:px-8 py-8">
      <div className="mx-auto max-w-7xl flex flex-col gap-6">
        <header className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">Prospecting pipeline</h1>
            <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-300">internal · not public</span>
          </div>
          <p className="text-sm text-[var(--ls-fg-3)]">{total} prospects · {withEmail} with a public email · draft + human send (no auto-send)</p>
        </header>

        {/* Funnel */}
        <section className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-11 gap-2">
          {FUNNEL_ORDER.map((s) => (
            <div key={s} className="rounded-lg border border-[var(--ls-border)] bg-[var(--ls-surface)] px-3 py-2">
              <div className="text-lg font-semibold tabular-nums">{funnel[s] || 0}</div>
              <div className="text-[11px] text-[var(--ls-fg-3)] capitalize">{s}</div>
            </div>
          ))}
        </section>

        {/* Deliverability panel */}
        <section className="rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-4 text-sm">
          <h2 className="font-medium mb-2">Deliverability health</h2>
          <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-[var(--ls-fg-2)]">
            <li>✅ SPF / DKIM / DMARC live on newvenuedata.com</li>
            <li>✅ Sending: manual, low volume, 1:1 (no auto-blast)</li>
            <li>⚠️ Set a real postal address in drafts (CAN-SPAM)</li>
            <li>🔗 Verify each send: <a className="text-indigo-400 hover:text-indigo-300" href="https://www.mail-tester.com" target="_blank" rel="noopener noreferrer">mail-tester.com</a> · <a className="text-indigo-400 hover:text-indigo-300" href="https://postmaster.google.com" target="_blank" rel="noopener noreferrer">Google Postmaster</a></li>
          </ul>
        </section>

        {/* Prospect table */}
        <section className="rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="border-b border-[var(--ls-border)] text-left text-xs text-[var(--ls-fg-3)]">
                <th className="px-4 py-2.5 w-12">#</th>
                <th className="px-4 py-2.5">Company</th>
                <th className="px-4 py-2.5">County</th>
                <th className="px-4 py-2.5">Score</th>
                <th className="px-4 py-2.5">LL</th>
                <th className="px-4 py-2.5">Email</th>
                <th className="px-4 py-2.5">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.id} className="border-b border-[var(--ls-border)] last:border-0 hover:bg-[var(--ls-hover)]">
                  <td className="px-4 py-2.5 text-[var(--ls-fg-4)] tabular-nums">{i + 1}</td>
                  <td className="px-4 py-2.5">
                    <Link href={`/prospects/${r.id}`} className="font-medium text-[var(--ls-fg)] hover:text-indigo-400">{r.company}</Link>
                    {r.website && <span className="ml-2 text-xs text-[var(--ls-fg-4)]">{r.website}</span>}
                  </td>
                  <td className="px-4 py-2.5 text-[var(--ls-fg-2)]">{r.county || '—'}</td>
                  <td className={`px-4 py-2.5 font-semibold tabular-nums ${scoreColor(r.fit_score)}`}>{r.fit_score ?? '—'}</td>
                  <td className="px-4 py-2.5">{r.writes_liquor_liability ? '✓' : ''}</td>
                  <td className="px-4 py-2.5 text-[var(--ls-fg-3)] text-xs">{r.email || '—'}</td>
                  <td className="px-4 py-2.5"><span className="rounded-full border border-[var(--ls-border-2)] px-2 py-0.5 text-[11px] capitalize text-[var(--ls-fg-2)]">{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  )
}
