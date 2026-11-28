import { useCallback, useEffect, useState } from 'react'

/**
 * useLocalStorage — persistent state backed by window.localStorage.
 *
 * Design notes:
 * - Accepts an initial value OR a lazy initializer (like useState) so large
 *   defaults are only computed once.
 * - The setter supports functional updates (`setX(prev => ...)`) so consumers
 *   never read stale state when several updates happen in one tick.
 * - Invalid/corrupt JSON in storage falls back to the initial value instead
 *   of crashing the app (defensive parsing).
 * - Optional `sanitize`: applied to EVERY read (initial load and sync
 *   re-reads). Coerces whatever is stored into the expected shape so one
 *   corrupt write can never crash the consumers of this key.
 * - Synchronisation: every write broadcasts a namespaced CustomEvent on
 *   `window`. All other hook instances that share the same key re-read from
 *   storage. This keeps components mounted in different parts of the tree in
 *   sync without forcing a global state manager, and the native `storage`
 *   event keeps separate browser tabs in sync as well.
 *
 * ⚠️ CONTRACT: `initial` and `sanitize` must be STABLE references
 * (module-level constants/functions, like the progress hooks use).
 * They appear in the dependency arrays below — inline object literals
 * would re-subscribe the sync listener on every render.
 *
 * @param {string} key        localStorage key
 * @param {*} initial         initial value or `() => value` lazy initializer
 * @param {Function} [sanitize] shape guard applied to parsed reads
 */
export function useLocalStorage(key, initial, sanitize = null) {
  const lazyInit = useCallback(() => {
    try {
      const raw = window.localStorage.getItem(key)
      if (raw !== null) {
        const parsed = JSON.parse(raw)
        return sanitize ? sanitize(parsed) : parsed
      }
    } catch (err) {
      // Corrupt JSON — treat as absent and fall through to the default.
      console.warn(`useLocalStorage: invalid JSON for "${key}", resetting`, err)
    }
    return typeof initial === 'function' ? initial() : initial
  }, [key, initial, sanitize])

  const [value, setValue] = useState(lazyInit)

  // Re-read when another hook instance (same tab) or another tab writes.
  useEffect(() => {
    const localEvent = `${EVENT_PREFIX}:${key}`
    const sync = () => {
      try {
        const raw = window.localStorage.getItem(key)
        if (raw !== null) {
          const parsed = JSON.parse(raw)
          setValue(sanitize ? sanitize(parsed) : parsed)
        } else {
          setValue(typeof initial === 'function' ? initial() : initial)
        }
      } catch {
        /* ignore corrupt reads — the initializer already warned */
      }
    }
    window.addEventListener(localEvent, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(localEvent, sync)
      window.removeEventListener('storage', sync)
    }
  }, [key, initial, sanitize])

  const set = useCallback(
    (next) => {
      setValue((prev) => {
        const resolved = typeof next === 'function' ? next(prev) : next
        try {
          window.localStorage.setItem(key, JSON.stringify(resolved))
          // Notify sibling instances in this tab (the `storage` event only
          // fires cross-tab, so we need our own event for same-tab sync).
          window.dispatchEvent(new CustomEvent(`${EVENT_PREFIX}:${key}`))
        } catch (err) {
          console.warn(`useLocalStorage: write failed for "${key}"`, err)
        }
        return resolved
      })
    },
    [key],
  )

  return [value, set]
}

const EVENT_PREFIX = 'gc-ls-sync'
