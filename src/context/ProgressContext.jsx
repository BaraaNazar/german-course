import { useCallback, useMemo } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { sanitizeConj, sanitizeVocab, EMPTY_CONJ, EMPTY_VOCAB } from '../utils/sanitizeProgress'

/**
 * Progress hooks — all learning progress lives in localStorage.
 *
 * KEY COMPATIBILITY: the keys below ('conj_v2', 'vocab_v1') are the exact
 * keys the pre-React app used. Users who already trained with the old site
 * keep their progress — it is picked up automatically on first load.
 */

/** Conjugation trainer progress: mastered verbs, quiz history per level. */
export function useConjugationProgress() {
  // sanitizeConj guards against corrupt/legacy localStorage data:
  // a wrong-typed field can never white-screen the app (task B1).
  const [progress, setProgress] = useLocalStorage('conj_v2', EMPTY_CONJ, sanitizeConj)

  const toggleKnown = useCallback(
    inf => {
      setProgress(p => {
        const known = p.known.includes(inf) ? p.known.filter(k => k !== inf) : [...p.known, inf]
        return { ...p, known }
      })
    },
    [setProgress],
  )

  const markKnown = useCallback(
    inf => {
      setProgress(p => (p.known.includes(inf) ? p : { ...p, known: [...p.known, inf] }))
    },
    [setProgress],
  )

  const unmarkKnown = useCallback(
    inf => {
      setProgress(p => ({ ...p, known: p.known.filter(k => k !== inf) }))
    },
    [setProgress],
  )

  const recordQuiz = useCallback(
    (level, percent) => {
      setProgress(p => ({
        ...p,
        scores: [...p.scores, percent],
        levelScores: { ...p.levelScores, [level]: [...(p.levelScores[level] ?? []), percent] },
      }))
    },
    [setProgress],
  )

  return { progress, toggleKnown, markKnown, unmarkKnown, recordQuiz }
}

/** Vocab trainer progress: known words, quiz scores, per-deck completion. */
export function useVocabProgress() {
  // sanitizeVocab — same white-screen guard for the vocabulary document.
  const [progress, setProgress] = useLocalStorage('vocab_v1', EMPTY_VOCAB, sanitizeVocab)

  const markWordKnown = useCallback(
    (de, known = true) => {
      setProgress(p => {
        if (known && p.known.includes(de)) return p
        if (!known) return { ...p, known: p.known.filter(k => k !== de) }
        return { ...p, known: [...p.known, de] }
      })
    },
    [setProgress],
  )

  const recordQuiz = useCallback(
    percent => {
      setProgress(p => ({ ...p, scores: [...p.scores, percent] }))
    },
    [setProgress],
  )

  return { progress, markWordKnown, recordQuiz }
}
