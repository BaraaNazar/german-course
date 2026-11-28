import { describe, test, expect } from 'vitest'
import { sanitizeConj, sanitizeVocab, EMPTY_CONJ, EMPTY_VOCAB } from './sanitizeProgress'

describe('sanitizeConj / sanitizeVocab', () => {
  test('corrupt document (known: null) coerces to defaults — no crash', () => {
    expect(sanitizeConj({ known: null, scores: 'oops', levelScores: 42 })).toEqual(EMPTY_CONJ())
  })

  test('non-object input (number, string, undefined, array) → defaults', () => {
    for (const junk of [undefined, null, 7, 'x', [], [{ known: [] }]]) {
      expect(sanitizeConj(junk)).toEqual(EMPTY_CONJ())
      expect(sanitizeVocab(junk)).toEqual(EMPTY_VOCAB())
    }
  })

  test('well-formed document passes through unchanged', () => {
    const input = {
      known: ['sein', 'haben'],
      scores: [80, 90],
      levelScores: { A1: [80, 90], B1: [70] },
    }
    expect(sanitizeConj(input)).toEqual(input)
  })

  test('mixed garbage entries are dropped, valid entries survive', () => {
    expect(
      sanitizeConj({
        known: ['sein', 42, null, 'haben'],
        scores: [80, 'nope', 90, Number.NaN],
        levelScores: { A1: [80, 'x', 90], bad: 'nope', B1: 12 },
      }),
    ).toEqual({
      known: ['sein', 'haben'],
      scores: [80, 90],
      levelScores: { A1: [80, 90] },
    })
  })

  test('vocab document sanitizes all five fields', () => {
    expect(
      sanitizeVocab({
        known: ['der Mann', 7],
        scores: [70],
        deckProgress: { 1: 25, 2: 'x', 3: Number.POSITIVE_INFINITY },
        milestones: ['first'],
        extraField: 'ignored',
      }),
    ).toEqual({
      known: ['der Mann'],
      scores: [70],
      deckProgress: { 1: 25 },
      milestones: ['first'],
    })
  })

  test('sanitizer output always satisfies the consumer contract', () => {
    for (const junk of [{ known: null }, { known: {} }, 'garbage', 0]) {
      const doc = sanitizeVocab(junk)
      expect(() => doc.known.includes('x')).not.toThrow()
      expect(() => Object.keys(doc.deckProgress).length).not.toThrow()
    }
  })
})
