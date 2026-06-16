'use client'

/**
 * feature-flags.ts — typed, dependency-free feature-flag registry.
 *
 * Every flag is declared once in FLAGS with a stable default. Read a flag's
 * effective value with getFlag(name) (safe in server or client code) or, inside
 * a React client component, with the useFlag(name) hook.
 *
 * Overrides: defaults are the only source today. A future provider can supply
 * overrides via setFlagOverrides(...) (e.g. hydrated from the org's plan, a
 * cookie, or a remote config service) without changing any call sites.
 *
 * NOTE: This module carries 'use client' because it exports a React hook. The
 * non-hook exports (FLAGS, getFlag, isEnabled, setFlagOverrides) are plain
 * functions and remain usable from server code that imports them directly.
 */

import { useEffect, useState } from 'react'

export interface FlagDefinition {
  /** Stable on/off default applied when no override is present. */
  default: boolean
  /** Human-readable purpose, shown in any internal flags UI. */
  description: string
  /** Optional owning area, useful for grouping in an admin panel. */
  group?: 'dashboard' | 'api' | 'billing' | 'marketing' | 'experimental'
}

/**
 * The single source of truth for every flag in the app. Add a flag here and its
 * name is automatically part of the FlagName union below.
 */
export const FLAGS = {
  'dashboard.realtime-map': {
    default: true,
    description: 'Live county heat-map on the dashboard home.',
    group: 'dashboard',
  },
  'dashboard.saved-views': {
    default: true,
    description: 'Allow saving and sharing license search filters.',
    group: 'dashboard',
  },
  'dashboard.alert-rules': {
    default: false,
    description: 'Configurable alert rules that fan out to email/webhook/slack.',
    group: 'dashboard',
  },
  'api.bulk-export': {
    default: false,
    description: 'CSV/JSON bulk export endpoint for license result sets.',
    group: 'api',
  },
  'api.v2-cursor-pagination': {
    default: true,
    description: 'Cursor-based pagination on /api/licenses (v2 default).',
    group: 'api',
  },
  'api.webhook-replays': {
    default: false,
    description: 'Self-serve replay of failed webhook deliveries.',
    group: 'api',
  },
  'billing.annual-pricing': {
    default: true,
    description: 'Show annual pricing toggle on the pricing page.',
    group: 'billing',
  },
  'billing.usage-metering': {
    default: false,
    description: 'Per-call usage metering and overage billing.',
    group: 'billing',
  },
  'marketing.changelog-banner': {
    default: false,
    description: 'Site-wide banner announcing the latest changelog entry.',
    group: 'marketing',
  },
  'experimental.ai-summaries': {
    default: false,
    description: 'AI-generated summaries of new filings (experimental).',
    group: 'experimental',
  },
} as const satisfies Record<string, FlagDefinition>

/** Union of every declared flag name, derived from FLAGS. */
export type FlagName = keyof typeof FLAGS

/**
 * Process-level overrides. Empty by default; a provider may populate this later
 * (e.g. from remote config) via setFlagOverrides. Kept module-private.
 */
let overrides: Partial<Record<FlagName, boolean>> = {}

/**
 * Replace the current override set. Pass a partial map of flag -> boolean.
 * Intended to be called once during app/provider initialization. Unknown keys
 * are ignored at the type level.
 */
export function setFlagOverrides(next: Partial<Record<FlagName, boolean>>): void {
  overrides = { ...next }
}

/** Clear all overrides, reverting every flag to its declared default. */
export function resetFlagOverrides(): void {
  overrides = {}
}

/**
 * Effective value of a flag: the override if one exists, otherwise the default.
 */
export function getFlag(name: FlagName): boolean {
  if (Object.prototype.hasOwnProperty.call(overrides, name)) {
    return overrides[name] as boolean
  }
  return FLAGS[name].default
}

/** Alias reading as a guard, e.g. `if (isEnabled('api.bulk-export')) {}`. */
export function isEnabled(name: FlagName): boolean {
  return getFlag(name)
}

/** Snapshot of every flag's current effective value. */
export function getAllFlags(): Record<FlagName, boolean> {
  const out = {} as Record<FlagName, boolean>
  for (const name of Object.keys(FLAGS) as FlagName[]) {
    out[name] = getFlag(name)
  }
  return out
}

/**
 * React hook returning a flag's effective value. Today this resolves to the same
 * value as getFlag, but it is implemented with state so a future provider can
 * push live updates (e.g. via context or an event) without changing callers.
 *
 * Usage (client component):
 *   const showMap = useFlag('dashboard.realtime-map')
 */
export function useFlag(name: FlagName): boolean {
  const [value, setValue] = useState<boolean>(() => getFlag(name))

  useEffect(() => {
    // Re-sync if the flag (or its override) changed between render and mount.
    setValue(getFlag(name))
  }, [name])

  return value
}
