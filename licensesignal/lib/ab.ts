'use client'

import { useEffect, useState } from 'react'

const VISITOR_KEY = 'ls_visitor_id'

/**
 * Read (or lazily create) a stable visitor id from localStorage.
 *
 * Uses crypto.randomUUID for the id. Wrapped in try/catch because
 * localStorage and crypto can both throw (private mode, SSR, etc.).
 */
function getVisitorId(): string | null {
  if (typeof window === 'undefined') return null
  try {
    let id = window.localStorage.getItem(VISITOR_KEY)
    if (!id) {
      id =
        typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
          ? crypto.randomUUID()
          : `v_${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`
      window.localStorage.setItem(VISITOR_KEY, id)
    }
    return id
  } catch {
    return null
  }
}

/**
 * Small deterministic string hash (djb2). Produces a stable non-negative
 * integer for a given input so the same visitor always maps to the same
 * variant — no randomness involved at selection time.
 */
function hashString(input: string): number {
  let hash = 5381
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 33) ^ input.charCodeAt(i)
  }
  // Coerce to an unsigned 32-bit integer.
  return hash >>> 0
}

/**
 * useExperiment — returns a stable A/B variant for the current visitor.
 *
 * Behavior:
 *  - Renders the first variant on the server and the very first client paint
 *    (avoids hydration mismatch). The resolved variant is applied in an effect.
 *  - The variant is derived deterministically from a per-visitor id, so a given
 *    visitor always sees the same variant for a given experiment name.
 *  - Once chosen, the variant is persisted per experiment name in localStorage,
 *    so it stays stable even if the variants array order changes between visits.
 *
 * @param name     Unique experiment name (used as the storage key).
 * @param variants Non-empty list of variants to choose from.
 * @returns The selected variant, plus a `ready` flag (false until the effect
 *          resolves the real variant on the client).
 */
export function useExperiment<T>(
  name: string,
  variants: readonly T[]
): { variant: T; ready: boolean; index: number } {
  const [index, setIndex] = useState(0)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (variants.length === 0) {
      setReady(true)
      return
    }

    const storageKey = `ls_ab_${name}`

    try {
      // Prefer a previously-stored choice so the variant is sticky across the
      // session even if the variants list changes length/order.
      const stored = window.localStorage.getItem(storageKey)
      if (stored !== null) {
        const parsed = Number.parseInt(stored, 10)
        if (Number.isInteger(parsed) && parsed >= 0 && parsed < variants.length) {
          setIndex(parsed)
          setReady(true)
          return
        }
      }

      const visitorId = getVisitorId()
      const seed = visitorId ?? name
      const chosen = hashString(`${name}:${seed}`) % variants.length

      window.localStorage.setItem(storageKey, String(chosen))
      setIndex(chosen)
      setReady(true)
    } catch {
      // Storage unavailable — fall back to a deterministic, storage-free choice.
      const chosen = hashString(name) % variants.length
      setIndex(chosen)
      setReady(true)
    }
    // Intentionally keyed on name + length only: re-running on identity changes
    // of the variants array would defeat stickiness.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, variants.length])

  const safeIndex = variants.length === 0 ? 0 : Math.min(index, variants.length - 1)

  return { variant: variants[safeIndex], ready, index: safeIndex }
}
