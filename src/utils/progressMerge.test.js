// Client twin of the backend's merge tests — the SAME invariants lock
// both copies of the algorithm (this one and german-course-api's).
import { describe, test, expect } from 'vitest'
import { mergeProgress, emptyProgress } from './progressMerge'

describe('mergeProgress', () => {
  test('known sets union — work on any device survives', () => {
    const server = { conj: { known: ['sein', 'haben'] }, vocab: { known: ['der Mann'] } }
    const incoming = { conj: { known: ['haben', 'gehen'] }, vocab: { known: ['die Frau'] } }
    const merged = mergeProgress(server, incoming)
    expect([...merged.conj.known].sort()).toEqual(['gehen', 'haben', 'sein'])
    expect([...merged.vocab.known].sort()).toEqual(['der Mann', 'die Frau'])
  })

  test('scores: device that ran more quizzes extends the log exactly', () => {
    const merged = mergeProgress({ conj: { scores: [80, 90] } }, { conj: { scores: [80, 90, 70] } })
    expect(merged.conj.scores).toEqual([80, 90, 70])
  })

  test('scores: server ahead of client (fresh login on old device)', () => {
    const merged = mergeProgress({ conj: { scores: [80, 90, 70] } }, { conj: { scores: [80, 90] } })
    expect(merged.conj.scores).toEqual([80, 90, 70])
  })

  test('scores: concurrent devices dedupe instead of duplicating', () => {
    const merged = mergeProgress({ conj: { scores: [80, 90] } }, { conj: { scores: [80, 95] } })
    expect(merged.conj.scores).toEqual([80, 90, 95])
  })

  test('idempotent: merging the same document twice changes nothing', () => {
    const doc = {
      conj: { known: ['sein'], scores: [80, 90], levelScores: { A1: [80], B1: [90, 70] } },
      vocab: {
        known: ['der Mann', 'die Frau'],
        scores: [70],
        deckProgress: { 1: 25, 2: 3 },
        milestones: ['x'],
      },
    }
    const once = mergeProgress(doc, doc)
    const twice = mergeProgress(once, once)
    expect(twice).toEqual(once)
    expect(once.conj.scores).toEqual([80, 90]) // no inflation
    expect(once.vocab.known.length).toBe(2)
  })

  test('levelScores merge per level', () => {
    const server = { conj: { levelScores: { A1: [80], B1: [90] } } }
    const incoming = { conj: { levelScores: { A1: [80, 100], B2: [60] } } }
    const merged = mergeProgress(server, incoming)
    expect(merged.conj.levelScores.A1).toEqual([80, 100])
    expect(merged.conj.levelScores.B1).toEqual([90])
    expect(merged.conj.levelScores.B2).toEqual([60])
  })

  test('deckProgress: higher counter wins (monotonic)', () => {
    const server = { vocab: { deckProgress: { 1: 40, 2: 10 } } }
    const incoming = { vocab: { deckProgress: { 1: 25, 2: 30, 3: 5 } } }
    const merged = mergeProgress(server, incoming)
    expect(merged.vocab.deckProgress).toEqual({ 1: 40, 2: 30, 3: 5 })
  })

  test('missing parts fall back to defaults (null / fresh device)', () => {
    expect(mergeProgress(null, null)).toEqual(emptyProgress())
    const oneSided = mergeProgress({ conj: { known: ['sein'] } }, null)
    expect(oneSided.conj.known).toEqual(['sein'])
    expect(oneSided.vocab.deckProgress).toEqual({})
  })

  test('learner bias: unmarking on one device is resurrected by a stale copy', () => {
    // Documented trade-off: union keeps the item "known".
    const merged = mergeProgress({ conj: { known: ['sein'] } }, { conj: { known: ['sein'] } })
    expect(merged.conj.known).toEqual(['sein'])
  })

  test('empty incoming merges into existing without changing it', () => {
    const server = { conj: { known: ['sein'], scores: [80] }, vocab: { known: ['der Mann'] } }
    const merged = mergeProgress(server, emptyProgress())
    expect(merged.conj.known).toEqual(['sein'])
    expect(merged.conj.scores).toEqual([80])
    expect(merged.vocab.known).toEqual(['der Mann'])
  })
})
