'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Mail,
  MessageSquare,
  Smartphone,
  Plus,
  Trash2,
  BellPlus,
  Filter as FilterIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { FL_COUNTIES } from '@/lib/fl-counties'
import { LICENSE_TYPES } from '@/lib/license-type-info'

const STORAGE_KEY = 'ls-alert-rules'

type ChannelKey = 'email' | 'slack' | 'sms'
type Frequency = 'instant' | 'hourly' | 'daily'

interface AlertRule {
  id: string
  licenseType: string // license code, or 'any'
  county: string // county slug, or 'any'
  channels: ChannelKey[]
  frequency: Frequency
  enabled: boolean
}

const CHANNELS: { key: ChannelKey; label: string; icon: typeof Mail }[] = [
  { key: 'email', label: 'Email', icon: Mail },
  { key: 'slack', label: 'Slack', icon: MessageSquare },
  { key: 'sms', label: 'SMS', icon: Smartphone },
]

const FREQUENCIES: { key: Frequency; label: string; hint: string }[] = [
  { key: 'instant', label: 'Instant', hint: 'The moment a match is filed' },
  { key: 'hourly', label: 'Hourly digest', hint: 'Batched once an hour' },
  { key: 'daily', label: 'Daily digest', hint: 'One summary each morning' },
]

const FREQUENCY_LABEL: Record<Frequency, string> = {
  instant: 'Instant',
  hourly: 'Hourly digest',
  daily: 'Daily digest',
}

const CHANNEL_LABEL: Record<ChannelKey, string> = {
  email: 'Email',
  slack: 'Slack',
  sms: 'SMS',
}

function readRules(): AlertRule[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (Array.isArray(parsed)) {
      return parsed.filter(
        (r): r is AlertRule =>
          !!r &&
          typeof r === 'object' &&
          typeof (r as AlertRule).id === 'string'
      )
    }
  } catch {
    // ignore malformed storage
  }
  return []
}

function makeId(): string {
  return `rule-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

function licenseTypeLabel(code: string): string {
  if (code === 'any') return 'any license type'
  const t = LICENSE_TYPES.find((lt) => lt.code === code)
  return t ? `${t.code} — ${t.name}` : code
}

function countyLabel(slug: string): string {
  if (slug === 'any') return 'any Florida county'
  const c = FL_COUNTIES.find((fc) => fc.slug === slug)
  return c ? `${c.name} County` : slug
}

export function AlertRuleBuilder() {
  const [rules, setRules] = useState<AlertRule[]>([])
  const [hydrated, setHydrated] = useState(false)

  // Draft form state.
  const [licenseType, setLicenseType] = useState('any')
  const [county, setCounty] = useState('any')
  const [channels, setChannels] = useState<ChannelKey[]>(['email'])
  const [frequency, setFrequency] = useState<Frequency>('instant')

  // Hydrate persisted rules once on mount.
  useEffect(() => {
    setRules(readRules())
    setHydrated(true)
  }, [])

  // Persist whenever rules change (after hydration so we never clobber storage).
  useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rules))
    } catch {
      // storage may be unavailable (private mode) — fail silently
    }
  }, [rules, hydrated])

  const sortedCounties = useMemo(
    () => [...FL_COUNTIES].sort((a, b) => a.name.localeCompare(b.name)),
    []
  )

  function toggleChannel(key: ChannelKey) {
    setChannels((prev) =>
      prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key]
    )
  }

  function addRule(e: React.FormEvent) {
    e.preventDefault()
    if (channels.length === 0) return
    const rule: AlertRule = {
      id: makeId(),
      licenseType,
      county,
      channels: [...channels],
      frequency,
      enabled: true,
    }
    setRules((prev) => [rule, ...prev])
    // Reset draft to sensible defaults.
    setLicenseType('any')
    setCounty('any')
    setChannels(['email'])
    setFrequency('instant')
  }

  function toggleEnabled(id: string) {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    )
  }

  function deleteRule(id: string) {
    setRules((prev) => prev.filter((r) => r.id !== id))
  }

  const canSubmit = channels.length > 0

  return (
    <div className="flex flex-col gap-8">
      {/* Builder form */}
      <form
        onSubmit={addRule}
        className="rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-6 sm:p-8 gradient-card"
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/15">
            <BellPlus className="h-5 w-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-[var(--ls-fg)]">Create an alert rule</h3>
            <p className="text-sm text-[var(--ls-fg-3)]">
              Get notified the moment a license matching your criteria is filed.
            </p>
          </div>
        </div>

        {/* Natural-language rule sentence */}
        <div className="mb-6 rounded-lg border border-[var(--ls-border)] bg-[var(--ls-surface-2)] px-4 py-3">
          <p className="text-sm leading-relaxed text-[var(--ls-fg-2)]">
            Notify me when{' '}
            <span className="font-semibold text-indigo-400">
              {licenseTypeLabel(licenseType)}
            </span>{' '}
            files in{' '}
            <span className="font-semibold text-indigo-400">{countyLabel(county)}</span>.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {/* License type */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="rule-license-type"
              className="text-xs font-medium uppercase tracking-wide text-[var(--ls-fg-3)]"
            >
              License type
            </label>
            <select
              id="rule-license-type"
              value={licenseType}
              onChange={(e) => setLicenseType(e.target.value)}
              className="w-full rounded-md border border-[var(--ls-border)] bg-[var(--ls-bg)] px-3 py-2 text-sm text-[var(--ls-fg)] transition-colors focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/40"
            >
              <option value="any">Any license type</option>
              {LICENSE_TYPES.map((lt) => (
                <option key={lt.slug} value={lt.code}>
                  {lt.code} — {lt.name}
                </option>
              ))}
            </select>
          </div>

          {/* County */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="rule-county"
              className="text-xs font-medium uppercase tracking-wide text-[var(--ls-fg-3)]"
            >
              County
            </label>
            <select
              id="rule-county"
              value={county}
              onChange={(e) => setCounty(e.target.value)}
              className="w-full rounded-md border border-[var(--ls-border)] bg-[var(--ls-bg)] px-3 py-2 text-sm text-[var(--ls-fg)] transition-colors focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/40"
            >
              <option value="any">Any Florida county</option>
              {sortedCounties.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Channels */}
        <div className="mt-6 flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-[var(--ls-fg-3)]">
            Deliver via
          </span>
          <div className="flex flex-wrap gap-2.5">
            {CHANNELS.map((ch) => {
              const Icon = ch.icon
              const checked = channels.includes(ch.key)
              return (
                <label
                  key={ch.key}
                  className={cn(
                    'inline-flex cursor-pointer select-none items-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors',
                    checked
                      ? 'border-indigo-500/40 bg-indigo-500/10 text-[var(--ls-fg)]'
                      : 'border-[var(--ls-border)] text-[var(--ls-fg-2)] hover:border-[var(--ls-border-2)] hover:bg-[var(--ls-hover)]'
                  )}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleChannel(ch.key)}
                    className="sr-only"
                  />
                  <Icon
                    className={cn(
                      'h-4 w-4',
                      checked ? 'text-indigo-400' : 'text-[var(--ls-fg-3)]'
                    )}
                  />
                  {ch.label}
                </label>
              )
            })}
          </div>
          {!canSubmit && (
            <p className="text-xs text-amber-400">Select at least one delivery channel.</p>
          )}
        </div>

        {/* Frequency */}
        <div className="mt-6 flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-[var(--ls-fg-3)]">
            Frequency
          </span>
          <div className="grid gap-2.5 sm:grid-cols-3">
            {FREQUENCIES.map((f) => {
              const active = frequency === f.key
              return (
                <label
                  key={f.key}
                  className={cn(
                    'flex cursor-pointer flex-col gap-0.5 rounded-lg border px-3.5 py-2.5 transition-colors',
                    active
                      ? 'border-indigo-500/40 bg-indigo-500/10'
                      : 'border-[var(--ls-border)] hover:border-[var(--ls-border-2)] hover:bg-[var(--ls-hover)]'
                  )}
                >
                  <input
                    type="radio"
                    name="rule-frequency"
                    value={f.key}
                    checked={active}
                    onChange={() => setFrequency(f.key)}
                    className="sr-only"
                  />
                  <span
                    className={cn(
                      'text-sm font-medium',
                      active ? 'text-indigo-400' : 'text-[var(--ls-fg)]'
                    )}
                  >
                    {f.label}
                  </span>
                  <span className="text-xs text-[var(--ls-fg-3)]">{f.hint}</span>
                </label>
              )
            })}
          </div>
        </div>

        <div className="mt-7 flex justify-end">
          <button
            type="submit"
            disabled={!canSubmit}
            className="inline-flex items-center justify-center rounded-md bg-indigo-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Create rule
          </button>
        </div>
      </form>

      {/* Rule list */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-[var(--ls-fg)]">Your alert rules</h3>
          {hydrated && rules.length > 0 && (
            <span className="text-xs text-[var(--ls-fg-3)]">
              {rules.length} {rules.length === 1 ? 'rule' : 'rules'}
            </span>
          )}
        </div>

        {!hydrated ? null : rules.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-[var(--ls-border)] bg-[var(--ls-surface-2)] px-6 py-10 text-center">
            <FilterIcon className="h-6 w-6 text-[var(--ls-fg-4)]" />
            <p className="text-sm text-[var(--ls-fg-2)]">No rules yet.</p>
            <p className="text-xs text-[var(--ls-fg-3)]">
              Create your first rule above to start matching new Florida filings.
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {rules.map((rule) => (
              <li
                key={rule.id}
                className={cn(
                  'flex flex-col gap-3 rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-4 sm:flex-row sm:items-center sm:justify-between',
                  !rule.enabled && 'opacity-60'
                )}
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-[var(--ls-fg)]">
                    <span className="text-[var(--ls-fg-2)]">Notify me when </span>
                    <span className="font-semibold">{licenseTypeLabel(rule.licenseType)}</span>
                    <span className="text-[var(--ls-fg-2)]"> files in </span>
                    <span className="font-semibold">{countyLabel(rule.county)}</span>
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    {rule.channels.map((ch) => (
                      <span
                        key={ch}
                        className="inline-flex items-center gap-1 rounded-full border border-[var(--ls-border)] bg-[var(--ls-surface-2)] px-2 py-0.5 text-xs text-[var(--ls-fg-2)]"
                      >
                        {CHANNEL_LABEL[ch]}
                      </span>
                    ))}
                    <span className="inline-flex items-center gap-1 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-xs font-medium text-indigo-400">
                      {FREQUENCY_LABEL[rule.frequency]}
                    </span>
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium',
                        rule.enabled
                          ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                          : 'border-[var(--ls-border)] bg-[var(--ls-surface-2)] text-[var(--ls-fg-3)]'
                      )}
                    >
                      {rule.enabled ? 'Enabled' : 'Paused'}
                    </span>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  {/* Enable / pause toggle */}
                  <button
                    type="button"
                    role="switch"
                    aria-checked={rule.enabled}
                    aria-label={rule.enabled ? 'Pause rule' : 'Enable rule'}
                    onClick={() => toggleEnabled(rule.id)}
                    className={cn(
                      'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors',
                      rule.enabled ? 'bg-indigo-500' : 'bg-[var(--ls-border-2)]'
                    )}
                  >
                    <span
                      className={cn(
                        'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                        rule.enabled ? 'translate-x-6' : 'translate-x-1'
                      )}
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteRule(rule.id)}
                    aria-label="Delete rule"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[var(--ls-border)] text-[var(--ls-fg-3)] transition-colors hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
