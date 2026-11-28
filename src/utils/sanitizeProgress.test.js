import { test } from 'node:test'
import assert from 'node:assert/strict'
import { sanitizeConj, sanitizeVocab, EMPTY_CONJ, EMPTY_VOCAB } from './sanitizeProgress.js'

test('B1: corrupt document (known: null) coerces to defaults — no crash', () => {
  const doc = sanitizeConj({ known: null, scores: 'oops', levelScores: 42 })
  assert.deepEqual(doc, EMPTY_CONJ())
})

test('B1: non-object input (number, string, undefined, array) → defaults', () => {
  for (const junk of [undefined, null, 7, 'x', [], [{ known: [] }]]) {
    assert.deepEqual(sanitizeConj(junk), EMPTY_CONJ())
    assert.deepEqual(sanitizeVocab(junk), EMPTY_VOCAB())
  }
})

test('B1: well-formed document passes through unchanged', () => {
  const input = {
    known: ['sein', 'haben'],
    scores: [80, 90],
    levelScores: { A1: [80, 90], B1: [70] },
  }
  assert.deepEqual(sanitizeConj(input), input)
})

test('B1: mixed garbage entries are dropped, valid entries survive', () => {
  const doc = sanitizeConj({
    known: ['sein', 42, null, 'haben'],
    scores: [80, 'nope', 90, Number.NaN],
    levelScores: { A1: [80, 'x', 90], bad: 'nope', B1: 12 },
  })
  assert.deepEqual(doc, {
    known: ['sein', 'haben'],
    scores: [80, 90],
    levelScores: { A1: [80, 90] },
  })
})

test('B1: vocab document sanitizes all five fields', () => {
  const doc = sanitizeVocab({
    known: ['der Mann', 7],
    scores: [70],
    deckProgress: { 1: 25, 2: 'x', 3: Number.POSITIVE_INFINITY },
    milestones: ['first'],
    extraField: 'ignored',
  })
  assert.deepEqual(doc, {
    known: ['der Mann'],
    scores: [70],
    deckProgress: { 1: 25 },
    milestones: ['first'],
  })
})

test('B1: sanitizer output always satisfies the consumer contract', () => {
  // The exact operations every component performs — must never throw.
  for (const junk of [{ known: null }, { known: {} }, 'garbage', 0]) {
    const doc = sanitizeVocab(junk)
    assert.doesNotThrow(() => doc.known.includes('x'))
    assert.doesNotThrow(() => Object.keys(doc.deckProgress).length)
  }
})
