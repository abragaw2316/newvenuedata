'use client'

import { useState } from 'react'
import { Play, Loader2, Check, Copy } from 'lucide-react'

const LICENSE_TYPES = ['', 'SRX', 'COP', 'BEV', 'APS', 'FOOD_SERVICE', 'SEATING', 'MOBILE_FOOD']
const EVENT_TYPES = ['', 'new_filing', 'renewal', 'ownership_transfer', 'status_change', 'cancellation']
const COUNTIES = ['', 'Miami-Dade', 'Broward', 'Palm Beach', 'Hillsborough', 'Orange', 'Pinellas', 'Duval', 'Collier']

interface QueryState {
  county: string
  license_type: string
  event_type: string
  limit: string
}

function buildQuery(state: QueryState): string {
  const params = new URLSearchParams()
  if (state.county) params.set('county', state.county)
  if (state.license_type) params.set('license_type', state.license_type)
  if (state.event_type) params.set('event_type', state.event_type)
  if (state.limit) params.set('limit', state.limit)
  const qs = params.toString()
  return qs ? `?${qs}` : ''
}

function Field({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: string[]
  onChange: (v: string) => void
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[10px] font-medium uppercase tracking-widest text-[var(--ls-fg-3)]">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-[var(--ls-border-2)] bg-[var(--ls-surface-2)] px-2.5 py-1.5 text-sm text-[var(--ls-fg)] focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/40"
      >
        {options.map((opt) => (
          <option key={opt || 'any'} value={opt} className="bg-[var(--ls-surface)]">
            {opt || 'Any'}
          </option>
        ))}
      </select>
    </label>
  )
}

export function ApiPlayground() {
  const [query, setQuery] = useState<QueryState>({
    county: 'Miami-Dade',
    license_type: '',
    event_type: 'new_filing',
    limit: '3',
  })
  const [response, setResponse] = useState<string | null>(null)
  const [statusCode, setStatusCode] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const path = `/api/licenses${buildQuery(query)}`
  const curl = `curl "https://api.newvenuedata.com/v1/licenses${buildQuery(query)}" \\\n  -H "Authorization: Bearer ls_live_xxxxx"`

  const run = async () => {
    setLoading(true)
    setResponse(null)
    setStatusCode(null)
    try {
      const res = await fetch(path)
      setStatusCode(res.status)
      const json = await res.json()
      setResponse(JSON.stringify(json, null, 2))
    } catch {
      setStatusCode(0)
      setResponse('{\n  "error": "Request failed. Is the dev server running?"\n}')
    } finally {
      setLoading(false)
    }
  }

  const copyCurl = async () => {
    await navigator.clipboard.writeText(curl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-indigo-500/20 bg-[var(--ls-surface)]">
      <div className="flex items-center justify-between border-b border-[var(--ls-border)] bg-indigo-500/[0.04] px-4 py-2.5">
        <span className="flex items-center gap-2 text-xs font-medium text-indigo-400">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
          Try it live
        </span>
        <span className="font-mono text-[11px] text-[var(--ls-fg-3)]">GET /v1/licenses</span>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-4">
        <Field label="County" value={query.county} options={COUNTIES} onChange={(v) => setQuery((q) => ({ ...q, county: v }))} />
        <Field label="License Type" value={query.license_type} options={LICENSE_TYPES} onChange={(v) => setQuery((q) => ({ ...q, license_type: v }))} />
        <Field label="Event Type" value={query.event_type} options={EVENT_TYPES} onChange={(v) => setQuery((q) => ({ ...q, event_type: v }))} />
        <Field label="Limit" value={query.limit} options={['1', '3', '5', '10']} onChange={(v) => setQuery((q) => ({ ...q, limit: v }))} />
      </div>

      {/* curl preview */}
      <div className="relative mx-4 mb-4 rounded-lg border border-[var(--ls-border)] bg-[var(--ls-surface-2)]">
        <button
          onClick={copyCurl}
          className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded border border-[var(--ls-border-2)] bg-[var(--ls-border)] text-[var(--ls-fg-3)] transition-colors hover:text-[var(--ls-fg)]"
          aria-label="Copy curl command"
        >
          {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
        </button>
        <pre className="overflow-x-auto p-3 pr-10 font-mono text-[11px] leading-5 text-[var(--ls-fg-2)]">{curl}</pre>
      </div>

      {/* Run button */}
      <div className="flex items-center gap-3 px-4 pb-4">
        <button
          onClick={run}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-600 disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
          {loading ? 'Sending…' : 'Send Request'}
        </button>
        {statusCode !== null && (
          <span
            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${
              statusCode >= 200 && statusCode < 300
                ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                : 'border-red-500/20 bg-red-500/10 text-red-400'
            }`}
          >
            {statusCode === 0 ? 'Network error' : `${statusCode} ${statusCode < 300 ? 'OK' : ''}`}
          </span>
        )}
      </div>

      {/* Response */}
      {response && (
        <div className="border-t border-[var(--ls-border)]">
          <div className="px-4 py-2 text-[10px] font-medium uppercase tracking-widest text-[var(--ls-fg-3)]">
            Response
          </div>
          <pre className="max-h-80 overflow-auto px-4 pb-4 font-mono text-[11px] leading-5 text-[var(--ls-fg-2)]">
            {response}
          </pre>
        </div>
      )}
    </div>
  )
}
