/**
 * Progress document sanitizers — the white-screen guard.
 *
 * localStorage can hold anything: corrupt JSON, half-written documents
 * from an old app version, or values mutated by hand in devtools. One
 * wrong-typed field (`known: null`) would crash every consumer
 * (`known.includes`) and take the whole page down.
 *
 * These functions coerce ANY input into the exact expected shape,
 * dropping entries that don't fit. They run on every read of the
 * persisted documents — cheap for well-formed data, life-saving for
 * broken data. (The backend does the same job with Zod on the server.)
 *
 * Must be module-level functions (stable identity) — they are passed to
 * useLocalStorage, which captures them in its sync-listener closure.
 */

export const EMPTY_CONJ = () => ({ known: [], scores: [], levelScores: {} })

export const EMPTY_VOCAB = () => ({
  known: [],
  scores: [],
  deckProgress: {},
  milestones: [],
})

export function sanitizeConj(doc) {
  if (!isPlainObject(doc)) return EMPTY_CONJ()
  return {
    known: stringArray(doc.known),
    scores: numberArray(doc.scores),
    levelScores: numberArrayMap(doc.levelScores),
  }
}

export function sanitizeVocab(doc) {
  if (!isPlainObject(doc)) return EMPTY_VOCAB()
  return {
    known: stringArray(doc.known),
    scores: numberArray(doc.scores),
    deckProgress: numberMap(doc.deckProgress),
    milestones: stringArray(doc.milestones),
  }
}

/* ---------- coercion helpers ---------- */

const isPlainObject = v => typeof v === 'object' && v !== null && !Array.isArray(v)

const stringArray = v => (Array.isArray(v) ? v.filter(x => typeof x === 'string') : [])

const numberArray = v =>
  Array.isArray(v) ? v.filter(x => typeof x === 'number' && Number.isFinite(x)) : []

/** { "A1": [80, 90], … } — per-key numeric arrays, corrupt keys dropped. */
const numberArrayMap = v =>
  mapValues(v, x => (Array.isArray(x) ? numberArray(x) : undefined))

/** { "1": 25, … } — per-key numbers, invalid entries dropped. */
const numberMap = v =>
  mapValues(v, x => (typeof x === 'number' && Number.isFinite(x) ? x : undefined))

function mapValues(v, sanitizeValue) {
  if (!isPlainObject(v)) return {}
  const out = {}
  for (const [key, value] of Object.entries(v)) {
    const sanitized = sanitizeValue(value)
    if (sanitized !== undefined) out[key] = sanitized
  }
  return out
}
