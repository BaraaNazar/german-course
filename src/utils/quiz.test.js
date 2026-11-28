import { describe, test, expect } from 'vitest'
import { buildConjQuiz, buildVocabQuiz } from './quiz'
import { WORDS } from '../data/vocab'
import { VERBS } from '../data/verbs'

describe('buildConjQuiz', () => {
  test('respects the requested count and never repeats a verb', () => {
    const questions = buildConjQuiz('A1', 20)
    expect(questions.length).toBeLessThanOrEqual(20)
    const verbs = questions.map((q) => q.verb)
    expect(new Set(verbs).size).toBe(verbs.length)
  })

  test('MCQ: 4 unique options, answer among them, index points at it', () => {
    // Run many times — generation is random, invariants must always hold.
    for (let run = 0; run < 50; run++) {
      const questions = buildConjQuiz('B1', 20).filter((q) => q.type === 'mcq')
      expect(questions.length).toBeGreaterThan(0)
      for (const q of questions) {
        expect(q.opts.length).toBe(4)
        expect(new Set(q.opts).size).toBe(4)
        expect(q.opts[q.answer]).toBe(q.display)
      }
    }
  })

  test('type-in questions have a non-empty string answer', () => {
    const questions = buildConjQuiz('A2', 30).filter((q) => q.type === 'input')
    for (const q of questions) {
      expect(typeof q.answer).toBe('string')
      expect(q.answer.length).toBeGreaterThan(0)
    }
  })

  test('only verbs from the requested level appear', () => {
    const questions = buildConjQuiz('C1', 15)
    const c1 = new Set(VERBS.filter((v) => v.level === 'C1').map((v) => v.inf))
    for (const q of questions) expect(c1.has(q.verb)).toBe(true)
  })
})

describe('buildVocabQuiz', () => {
  test('count respected, distinct words, answer present', () => {
    // Subset keeps the distractor search cheap; invariants are the same.
    const sampleWords = WORDS.slice(0, 300)
    for (let run = 0; run < 20; run++) {
      const questions = buildVocabQuiz(sampleWords, 10)
      expect(questions.length).toBeLessThanOrEqual(10)
      const words = questions.map((q) => q.word[0])
      expect(new Set(words).size).toBe(words.length)
      for (const q of questions) {
        expect(q.opts.length).toBe(4)
        expect(new Set(q.opts).size).toBe(4)
        // The correct option is one of the two sides of the word.
        expect([q.word[0], q.word[1]]).toContain(q.opts[q.answer])
      }
    }
  })

  test('questions exist for both directions (de→en and en→de) over enough runs', () => {
    const sampleWords = WORDS.slice(0, 300)
    const prompts = new Set()
    for (let run = 0; run < 10; run++) {
      buildVocabQuiz(sampleWords, 20).forEach((q) => prompts.add(q.prompt))
    }
    expect(prompts.has('What does')).toBe(true)
    expect(prompts.has('How do you say')).toBe(true)
  })
})
