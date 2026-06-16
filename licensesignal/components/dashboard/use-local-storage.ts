'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * useLocalStorage — SSR-safe persisted state.
 *
 * Reads lazily on mount (never during render on the server), writes through to
 * localStorage on change, and tolerates malformed/blocked storage gracefully.
 * Returns a tuple shaped like useState plus a `hydrated` flag so callers can
 * avoid flashing default values before the stored value is read.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, boolean] {
  const [value, setValue] = useState<T>(initialValue)
  const [hydrated, setHydrated] = useState(false)
  // Keep a ref to the latest value so the setter stays referentially stable.
  const valueRef = useRef(value)
  valueRef.current = value

  // Read once on mount (client only).
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key)
      if (raw !== null) {
        setValue(JSON.parse(raw) as T)
      }
    } catch {
      // Ignore: storage unavailable or corrupt JSON — fall back to initial.
    }
    setHydrated(true)
    // Only re-run if the key itself changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved =
          typeof next === 'function' ? (next as (p: T) => T)(prev) : next
        try {
          window.localStorage.setItem(key, JSON.stringify(resolved))
        } catch {
          // Ignore write failures (private mode, quota, etc.).
        }
        return resolved
      })
    },
    [key]
  )

  return [value, set, hydrated]
}
