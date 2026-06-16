import Link from 'next/link'
import { notFound } from 'next/navigation'
import { isProspectsEnabled, getProspect } from '@/lib/prospects-db'
import { ProspectDetail } from '@/components/prospects/prospect-detail'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const metadata = { title: 'Prospect (internal)', robots: { index: false, follow: false } }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function field(label: string, value: any) {
  if (!value) return null
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide text-[var(--ls-fg-4)]">{label}</div>
      <div className="text-sm text-[var(--ls-fg-2)] whitespace-pre-wrap">{value}</div>
    </div>
  )
}

export default async function ProspectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  if (!isProspectsEnabled()) notFound()
  const { id } = await params
  const data = await getProspect(Number(id))
  if (!data) notFound()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p = data.prospect as any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const r = data.research as any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const s = data.score as any
  const personalization: string[] = r?.personalization ? JSON.parse(r.personalization) : []

  return (
    <div className="min-h-screen bg-[var(--ls-bg)] text-[var(--ls-fg)] px-4 sm:px-6 lg:px-8 py-8">
      <div className="mx-auto max-w-4xl flex flex-col gap-6">
        <Link href="/prospects" className="text-sm text-indigo-400 hover:text-indigo-300">← all prospects</Link>

        <header className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold">{p.company}</h1>
          <p className="text-sm text-[var(--ls-fg-3)]">
            {[p.county && `${p.county} County`, p.segment, s && `score ${s.fit_score}`].filter(Boolean).join(' · ')}
          </p>
          <div className="flex flex-wrap gap-3 text-sm mt-1">
            {p.website && <a className="text-indigo-400 hover:text-indigo-300" href={p.website.startsWith('http') ? p.website : `https://${p.website}`} target="_blank" rel="noopener noreferrer">{p.website}</a>}
            {p.email && <span className="text-[var(--ls-fg-2)]">{p.email}</span>}
            {p.phone && <span className="text-[var(--ls-fg-2)]">{p.phone}</span>}
            {p.contact_page && <a className="text-indigo-400 hover:text-indigo-300" href={p.contact_page} target="_blank" rel="noopener noreferrer">contact form</a>}
          </div>
        </header>

        {/* Research brief */}
        <section className="rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Research brief</h2>
            {r && <span className="text-[11px] text-[var(--ls-fg-4)]">via {r.model} · conf {r.confidence}</span>}
          </div>
          {field('Summary', r?.summary)}
          {field('Why it fits', r?.why_fit)}
          {personalization.length > 0 && (
            <div>
              <div className="text-[11px] uppercase tracking-wide text-[var(--ls-fg-4)]">Personalization</div>
              <ul className="list-disc pl-5 text-sm text-[var(--ls-fg-2)]">
                {personalization.map((pt, i) => <li key={i}>{pt}</li>)}
              </ul>
            </div>
          )}
          {field('Suggested angle', r?.angle)}
          {!r && <p className="text-sm text-[var(--ls-fg-3)]">No research yet — run the agents stage.</p>}
        </section>

        {/* Drafts + outcomes (interactive) */}
        <ProspectDetail
          prospectId={p.id}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          initialDrafts={(data.drafts as any[]).map((d) => ({ id: d.id, step: d.step, subject: d.subject, body: d.body, status: d.status }))}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          initialEvents={(data.events as any[]).map((e) => ({ type: e.type, detail: e.detail, at: e.at }))}
        />
      </div>
    </div>
  )
}
