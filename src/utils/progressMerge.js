/**
 * Progress merge engine — the CLIENT twin of the backend's merge
 * (german-course-api/src/lib/progressMerge.js, identical logic).
 *
 * Used in Phase 6: when the backend hookup lands, the client merges the
 * server document (GET /progress) with its local copy so offline
 * learning is never lost before the upload. Keeping both copies of the
 * algorithm in sync is enforced by mirrored unit tests.
 *
 * A user learns on their phone AND their laptop; both keep a local copy
 * of the same progress document (shapes mirror the localStorage keys
 * `conj_v2` / `vocab_v1`).
 *
 * Design rules:
 *   1. IDENTITY — merge(x, x) === x. Sync runs repeatedly; a naive
 *      concat would grow arrays on every round-trip and inflate stats.
 *   2. NO LOST DATA — work done on any device survives.
 *   3. LEARNER-FRIENDLY BIAS — when two states conflict, keep the one
 *      that represents MORE learning (known sets union, deck counters
 *      max). Consequently, "unmarking" a word on one device can be
 *      resurrected by a stale copy from another device — an acceptable
 *      trade-off for learning progress, and the standard Anki-style bias.
 */

/** Fresh document with the exact defaults the frontend expects. */
export const emptyProgress = () => ({
  conj: { known: [], scores: [], levelScores: {} },
  vocab: { known: [], scores: [], deckProgress: {}, milestones: [] },
})

/**
 * Set semantics (known verbs / known words): order is irrelevant,
 * membership is everything → union. Monotonic and idempotent.
 */
const unionSets = (a = [], b = []) => [...new Set([...a, ...b])]

/** True when `short` is a prefix of `long` (arrays of primitives). */
const isPrefix = (short, long) =>
  short.length <= long.length && short.every((v, i) => long[i] === v)

/**
 * Append-only history (quiz scores). Devices append to their local log:
 *
 *   · SEQUENTIAL CASE (the normal one): the device synced, then ran more
 *     quizzes → its log is the server log plus new entries, i.e. one is
 *     a prefix of the other → keep the longer. Exact, zero duplicates.
 *
 *   · CONCURRENT CASE: both devices ran quizzes between syncs → neither
 *     log is a prefix of the other. Concatenate and drop exact duplicate
 *     values (score history is statistics, not critical data — the
 *     approximation is deliberate and keeps the merge idempotent).
 */
function mergeLogArrays(a = [], b = []) {
  if (isPrefix(b, a)) return a
  if (isPrefix(a, b)) return b
  const out = []
  for (const value of [...a, ...b]) {
    if (!out.includes(value)) out.push(value)
  }
  return out
}

/**
 * Monotonic counters (deckProgress: "how many of deck 7 I know").
 * The higher value is strictly more information → max per key.
 */
const mergeMaxMaps = (a = {}, b = {}) => {
  const out = { ...a }
  for (const [key, value] of Object.entries(b)) {
    out[key] = Math.max(out[key] ?? -Infinity, value)
  }
  return out
}

/** levelScores: one quiz log per CEFR level → merge each key as a log. */
const mergeScoreMaps = (a = {}, b = {}) => {
  const out = { ...a }
  for (const [key, value] of Object.entries(b)) {
    out[key] = mergeLogArrays(out[key] ?? [], value)
  }
  return out
}

/**
 * Merges two progress documents. Tolerates missing parts (older clients,
 * fresh devices) by treating them as the empty default.
 *
 * @param {object|null} server   stored document (or null when none yet)
 * @param {object|null} incoming document sent by the client
 * @returns {object} the merged document (always complete)
 */
export function mergeProgress(server, incoming) {
  const s = { ...emptyProgress(), ...(server ?? {}) }
  const i = { ...emptyProgress(), ...(incoming ?? {}) }

  return {
    conj: {
      known: unionSets(s.conj.known, i.conj.known),
      scores: mergeLogArrays(s.conj.scores, i.conj.scores),
      levelScores: mergeScoreMaps(s.conj.levelScores, i.conj.levelScores),
    },
    vocab: {
      known: unionSets(s.vocab.known, i.vocab.known),
      scores: mergeLogArrays(s.vocab.scores, i.vocab.scores),
      deckProgress: mergeMaxMaps(s.vocab.deckProgress, i.vocab.deckProgress),
      milestones: unionSets(s.vocab.milestones, i.vocab.milestones),
    },
  }
}
