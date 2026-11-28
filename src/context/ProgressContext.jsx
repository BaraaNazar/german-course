import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { sanitizeConj, sanitizeVocab, EMPTY_CONJ, EMPTY_VOCAB } from '../utils/sanitizeProgress'

/**
 * Progress state — the SINGLE SOURCE OF TRUTH (task B2 + B3).
 *
 * Architecture:
 *   One <ProgressProvider> at the app root owns both progress documents
 *   (conj_v2 / vocab_v1). Components consume them via the two context
 *   hooks below — same API the old per-component hooks exposed, so no
 *   page had to change. One writer means:
 *   · one JSON.parse per change instead of one per consumer
 *   · one localStorage write, which is DEBOUNCED (300 ms trailing):
 *     quiz grading fires many updates per second and each write
 *     serializes the whole document (~100 KB with a full vocabulary)
 *   · the natural place to plug in server sync in Phase 6 (PUT /progress)
 *
 * Reliability rules:
 *   · state updates are IMMEDIATE (UI never lags); only persistence waits
 *   · pending writes are flushed when the tab hides or unloads — the
 *     last answer can never be lost to the debounce window
 *   · corrupt/legacy data is sanitized on load (task B1 guards)
 *   · cross-tab writes are adopted via the `storage` event
 *     (last-write-wins; real conflict resolution is the server-side
 *     merge in Phase 6)
 */

const WRITE_DEBOUNCE_MS = 300

/* ── storage helpers ──────────────────────────────────────────── */

function loadDoc(key, makeDefault, sanitize) {
  try {
    const raw = window.localStorage.getItem(key)
    if (raw !== null) return sanitize(JSON.parse(raw))
  } catch (err) {
    console.warn(`progress: invalid JSON for "${key}", resetting`, err)
  }
  return makeDefault()
}

function writeDoc(key, doc) {
  try {
    window.localStorage.setItem(key, JSON.stringify(doc))
  } catch (err) {
    // Quota exceeded or storage disabled — learning continues in
    // memory; the state itself is unaffected.
    console.warn(`progress: write failed for "${key}"`, err)
  }
}

/**
 * One persisted document: React state is the source of truth, storage
 * is a debounced mirror (see module docs).
 */
function usePersistentDocument(key, makeDefault, sanitize) {
  const [doc, setDoc] = useState(() => loadDoc(key, makeDefault, sanitize))

  const docRef = useRef(doc) // latest value for the timer & flush paths
  const timerRef = useRef(null) // null = no pending write

  // Schedule a debounced write whenever the document changes.
  useEffect(() => {
    docRef.current = doc

    // The very first run just mirrors the loaded value — writing it
    // back would be a no-op, skip it.
    if (docRefSkipFirst.current) {
      docRefSkipFirst.current = false
      return
    }
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      timerRef.current = null
      writeDoc(key, docRef.current)
    }, WRITE_DEBOUNCE_MS)
  }, [doc, key])

  const docRefSkipFirst = useRef(true)

  // Flush NOW — called when the tab hides, unloads, or the provider
  // unmounts. No-op unless a write is actually pending.
  const flush = useCallback(() => {
    if (timerRef.current === null) return
    clearTimeout(timerRef.current)
    timerRef.current = null
    writeDoc(key, docRef.current)
  }, [key])

  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') flush()
    }
    window.addEventListener('beforeunload', flush)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      window.removeEventListener('beforeunload', flush)
      document.removeEventListener('visibilitychange', onVisibility)
      flush() // unmount with a pending write = flush, never drop
    }
  }, [flush])

  // Cross-tab: another tab persisted this key → adopt it and cancel our
  // pending write so we don't immediately clobber the fresh value.
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== key) return
      clearTimeout(timerRef.current)
      timerRef.current = null
      setDoc(loadDoc(key, makeDefault, sanitize))
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [key, makeDefault, sanitize])

  const update = useCallback((updater) => {
    setDoc((prev) => (typeof updater === 'function' ? updater(prev) : updater))
  }, [])

  return [doc, update]
}

/* ── contexts ─────────────────────────────────────────────────── */
// Two separate contexts so a conjugation change doesn't re-render
// vocabulary consumers (and vice versa).

const ConjProgressContext = createContext(null)
const VocabProgressContext = createContext(null)

export function ProgressProvider({ children }) {
  const [conj, updateConj] = usePersistentDocument('conj_v2', EMPTY_CONJ, sanitizeConj)
  const [vocab, updateVocab] = usePersistentDocument('vocab_v1', EMPTY_VOCAB, sanitizeVocab)

  /* conjugation actions (identical API to the previous hook) */
  const toggleKnown = useCallback(
    (inf) => {
      updateConj((p) => {
        const known = p.known.includes(inf) ? p.known.filter((k) => k !== inf) : [...p.known, inf]
        return { ...p, known }
      })
    },
    [updateConj],
  )

  const markKnown = useCallback(
    (inf) => {
      updateConj((p) => (p.known.includes(inf) ? p : { ...p, known: [...p.known, inf] }))
    },
    [updateConj],
  )

  const recordConjQuiz = useCallback(
    (level, percent) => {
      updateConj((p) => ({
        ...p,
        scores: [...p.scores, percent],
        levelScores: {
          ...p.levelScores,
          [level]: [...(p.levelScores[level] ?? []), percent],
        },
      }))
    },
    [updateConj],
  )

  const conjValue = useMemo(
    () => ({ progress: conj, toggleKnown, markKnown, recordQuiz: recordConjQuiz }),
    [conj, toggleKnown, markKnown, recordConjQuiz],
  )

  /* vocabulary actions (identical API to the previous hook) */
  const markWordKnown = useCallback(
    (de, known = true) => {
      updateVocab((p) => {
        if (known && p.known.includes(de)) return p
        if (!known) return { ...p, known: p.known.filter((k) => k !== de) }
        return { ...p, known: [...p.known, de] }
      })
    },
    [updateVocab],
  )

  const recordVocabQuiz = useCallback(
    (percent) => {
      updateVocab((p) => ({ ...p, scores: [...p.scores, percent] }))
    },
    [updateVocab],
  )

  const vocabValue = useMemo(
    () => ({ progress: vocab, markWordKnown, recordQuiz: recordVocabQuiz }),
    [vocab, markWordKnown, recordVocabQuiz],
  )

  return (
    <ConjProgressContext.Provider value={conjValue}>
      <VocabProgressContext.Provider value={vocabValue}>{children}</VocabProgressContext.Provider>
    </ConjProgressContext.Provider>
  )
}

/** Conjugation trainer progress: mastered verbs, quiz history per level. */
export function useConjugationProgress() {
  const ctx = useContext(ConjProgressContext)
  if (!ctx) throw new Error('useConjugationProgress must be used inside <ProgressProvider>')
  return ctx
}

/** Vocab trainer progress: known words, quiz scores, per-deck completion. */
export function useVocabProgress() {
  const ctx = useContext(VocabProgressContext)
  if (!ctx) throw new Error('useVocabProgress must be used inside <ProgressProvider>')
  return ctx
}
