'use client'

import { useState } from 'react'

interface Draft { id: number; step: number; subject: string; body: string; status: string }
interface EventItem { type: string; detail: string; at: string }

const STEP_LABEL = ['Intro email', 'Follow-up 1 (day 3)', 'Follow-up 2 (day 7)']
const OUTCOMES = ['reply', 'positive_reply', 'trial', 'won', 'unsubscribed', 'bounced']

export function ProspectDetail({ prospectId, initialDrafts, initialEvents }: {
  prospectId: number
  initialDrafts: Draft[]
  initialEvents: EventItem[]
}) {
  const [drafts, setDrafts] = useState<Draft[]>(initialDrafts)
  const [events, setEvents] = useState<EventItem[]>(initialEvents)
  const [busy, setBusy] = useState<number | null>(null)
  const [copied, setCopied] = useState<number | null>(null)

  const update = (id: number, patch: Partial<Draft>) =>
    setDrafts((ds) => ds.map((d) => (d.id === id ? { ...d, ...patch } : d)))

  async function saveDraft(d: Draft, status?: string) {
    setBusy(d.id)
    try {
      const res = await fetch(`/api/prospects/drafts/${d.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: d.subject, body: d.body, ...(status ? { status } : {}) }),
      })
      if (res.ok) {
        const updated = await res.json()
        update(d.id, { status: updated.status })
        if (status === 'sent') setEvents((e) => [{ type: 'sent', detail: `step ${d.step}`, at: new Date().toISOString() }, ...e])
      }
    } finally {
      setBusy(null)
    }
  }

  async function copyDraft(d: Draft) {
    await navigator.clipboard.writeText(`${d.subject}\n\n${d.body}`)
    setCopied(d.id)
    setTimeout(() => setCopied(null), 1500)
  }

  async function logOutcome(type: string) {
    const res = await fetch(`/api/prospects/${prospectId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: { type } }),
    })
    if (res.ok) setEvents((e) => [{ type, detail: '', at: new Date().toISOString() }, ...e])
  }

  const btn = 'rounded-md border border-[var(--ls-border-2)] px-2.5 py-1 text-xs text-[var(--ls-fg-2)] hover:border-indigo-500/40 hover:text-[var(--ls-fg)] transition-colors disabled:opacity-50'

  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-medium">Outreach drafts <span className="text-xs font-normal text-[var(--ls-fg-3)]">— review &amp; edit, then send manually from austin@newvenuedata.com</span></h2>

      {drafts.length === 0 && <p className="text-sm text-[var(--ls-fg-3)]">No drafts yet — run the agents stage.</p>}

      {drafts.map((d) => (
        <div key={d.id} className="rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[var(--ls-fg-2)]">{STEP_LABEL[d.step] || `Step ${d.step}`}</span>
            <span className={`rounded-full px-2 py-0.5 text-[11px] capitalize ${d.status === 'sent' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'border border-[var(--ls-border-2)] text-[var(--ls-fg-3)]'}`}>{d.status}</span>
          </div>
          <input
            value={d.subject}
            onChange={(e) => update(d.id, { subject: e.target.value })}
            className="w-full rounded-md border border-[var(--ls-border)] bg-[var(--ls-bg)] px-3 py-2 text-sm text-[var(--ls-fg)] focus:outline-none focus:border-indigo-500/40"
            placeholder="Subject"
          />
          <textarea
            value={d.body}
            onChange={(e) => update(d.id, { body: e.target.value })}
            rows={d.step === 0 ? 14 : 6}
            className="w-full rounded-md border border-[var(--ls-border)] bg-[var(--ls-bg)] px-3 py-2 text-sm text-[var(--ls-fg-2)] font-mono focus:outline-none focus:border-indigo-500/40"
          />
          <div className="flex flex-wrap gap-2">
            <button className={btn} onClick={() => copyDraft(d)}>{copied === d.id ? 'Copied ✓' : 'Copy'}</button>
            <button className={btn} disabled={busy === d.id} onClick={() => saveDraft(d)}>Save edits</button>
            <button className={btn} disabled={busy === d.id} onClick={() => saveDraft(d, 'approved')}>Approve</button>
            <button className={btn} disabled={busy === d.id} onClick={() => saveDraft(d, 'sent')}>Mark sent</button>
          </div>
        </div>
      ))}

      {/* Outcomes */}
      <div className="rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-4 flex flex-col gap-3">
        <h3 className="text-sm font-medium">Log outcome</h3>
        <div className="flex flex-wrap gap-2">
          {OUTCOMES.map((o) => (
            <button key={o} className={btn} onClick={() => logOutcome(o)}>{o.replace('_', ' ')}</button>
          ))}
        </div>
        {events.length > 0 && (
          <ul className="text-xs text-[var(--ls-fg-3)] flex flex-col gap-1 mt-1">
            {events.map((e, i) => (
              <li key={i}><span className="text-[var(--ls-fg-2)] capitalize">{e.type.replace('_', ' ')}</span>{e.detail ? ` · ${e.detail}` : ''} · {new Date(e.at).toLocaleString()}</li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
