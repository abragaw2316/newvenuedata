'use client'

import { useMemo, useState } from 'react'
import { FileText, Building2, Hammer, ShoppingBag, Search, MapPin, Phone, DollarSign } from 'lucide-react'
import { SectionHeading } from '@/components/shared/section-heading'
import { CtaBanner } from '@/components/sections/cta-banner'
import { BUSINESS_SIGNALS, SIGNAL_UNIVERSE } from '@/lib/signals'
import type { SignalSource } from '@/lib/types'
import { formatDate } from '@/lib/utils'

const META: Record<
  SignalSource,
  { label: string; icon: typeof FileText; accent: string; chip: string; dot: string }
> = {
  license: { label: 'Liquor Licenses', icon: FileText, accent: 'text-indigo-400', chip: 'border-indigo-500/30 bg-indigo-500/10 text-indigo-400', dot: 'bg-indigo-400' },
  registration: { label: 'New Businesses', icon: Building2, accent: 'text-emerald-400', chip: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400', dot: 'bg-emerald-400' },
  permit: { label: 'Building Permits', icon: Hammer, accent: 'text-amber-400', chip: 'border-amber-500/30 bg-amber-500/10 text-amber-400', dot: 'bg-amber-400' },
  retail_food: { label: 'Retail Food', icon: ShoppingBag, accent: 'text-violet-400', chip: 'border-violet-500/30 bg-violet-500/10 text-violet-400', dot: 'bg-violet-400' },
}

const STATS = [
  { label: 'Liquor licensees tracked', value: SIGNAL_UNIVERSE.licenseesTracked.toLocaleString() },
  { label: 'Retail food establishments', value: SIGNAL_UNIVERSE.retailFoodTracked.toLocaleString() },
  { label: 'New businesses / workday', value: SIGNAL_UNIVERSE.newBusinessesPerWorkday.toLocaleString() },
  { label: 'Commercial permit feed', value: 'Live' },
]

export function SignalsContent() {
  const [source, setSource] = useState<SignalSource | 'all'>('all')
  const [query, setQuery] = useState('')

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: BUSINESS_SIGNALS.length }
    for (const s of BUSINESS_SIGNALS) c[s.signalType] = (c[s.signalType] || 0) + 1
    return c
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return BUSINESS_SIGNALS.filter((s) => {
      if (source !== 'all' && s.signalType !== source) return false
      if (q && !`${s.businessName} ${s.city} ${s.county} ${s.category}`.toLowerCase().includes(q)) return false
      return true
    })
  }, [source, query])

  return (
    <div>
      <section className="py-20 lg:py-28 gradient-hero">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-10">
          <SectionHeading
            eyebrow="Business Signals"
            heading="Every Florida Opening Signal, In One Feed"
            subtext="Registrations → permits → licenses → confirmed openings. The full funnel of a new Florida business, from four live public-records sources."
          />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto w-full">
            {STATS.map((s) => (
              <div key={s.label} className="rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-5 text-center">
                <p className="text-2xl font-bold text-[var(--ls-fg)] tabular-nums">{s.value}</p>
                <p className="mt-1 text-xs text-[var(--ls-fg-3)]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 flex flex-col gap-6">
          {/* Filter chips */}
          <div className="flex flex-wrap items-center gap-2">
            <Chip active={source === 'all'} onClick={() => setSource('all')} label={`All (${counts.all})`} />
            {(Object.keys(META) as SignalSource[]).map((key) => (
              <Chip
                key={key}
                active={source === key}
                onClick={() => setSource(key)}
                label={`${META[key].label} (${counts[key] ?? 0})`}
                dot={META[key].dot}
              />
            ))}
            <div className="relative ml-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--ls-fg-3)]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search businesses, cities…"
                className="w-56 rounded-md border border-[var(--ls-border-2)] bg-[var(--ls-surface)] py-2 pl-9 pr-3 text-sm text-[var(--ls-fg)] placeholder:text-[var(--ls-fg-4)] focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/40"
              />
            </div>
          </div>

          {/* Feed */}
          <div className="flex flex-col gap-2">
            {filtered.length === 0 ? (
              <p className="py-16 text-center text-sm text-[var(--ls-fg-3)]">No signals match your filters.</p>
            ) : (
              filtered.map((s) => {
                const m = META[s.signalType]
                const Icon = m.icon
                return (
                  <div
                    key={s.id}
                    className="flex items-start gap-4 rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-4 transition-colors hover:border-indigo-500/30"
                  >
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--ls-hover)] border border-[var(--ls-border-2)]">
                      <Icon className={`h-4 w-4 ${m.accent}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-[var(--ls-fg)] truncate">{s.businessName}</span>
                        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${m.chip}`}>
                          {m.label}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-[var(--ls-fg-3)]">{s.detail}</p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--ls-fg-3)]">
                        {(s.city || s.county) && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {[s.city, s.county].filter(Boolean).join(', ')}
                          </span>
                        )}
                        {s.value != null && (
                          <span className="flex items-center gap-1 text-emerald-400">
                            <DollarSign className="h-3 w-3" /> {s.value.toLocaleString()}
                          </span>
                        )}
                        {s.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" /> {s.phone}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="flex-shrink-0 text-xs text-[var(--ls-fg-4)] whitespace-nowrap">
                      {s.date ? formatDate(s.date, { month: 'short', day: 'numeric' }) : ''}
                    </span>
                  </div>
                )
              })
            )}
          </div>
          <p className="text-xs text-[var(--ls-fg-4)]">
            Showing a live sample. Source: FL DBPR, FL Division of Corporations, City of Orlando, FDACS — public records under Florida Ch. 119.
          </p>
        </div>
      </section>

      <CtaBanner />
    </div>
  )
}

function Chip({ active, onClick, label, dot }: { active: boolean; onClick: () => void; label: string; dot?: string }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
        active
          ? 'border-indigo-500/40 bg-indigo-500/10 text-[var(--ls-fg)]'
          : 'border-[var(--ls-border-2)] text-[var(--ls-fg-2)] hover:text-[var(--ls-fg)]'
      }`}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />}
      {label}
    </button>
  )
}
