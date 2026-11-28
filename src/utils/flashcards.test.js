import { describe, test, expect } from 'vitest'
import { gradeDecision } from './flashcards'

describe('gradeDecision', () => {
  test("'again' unmarks the word and re-queues it", () => {
    expect(gradeDecision('again')).toEqual({ known: false, requeue: true })
  })

  test("'hard' changes nothing", () => {
    expect(gradeDecision('hard')).toEqual({ known: null, requeue: false })
  })

  test("'good' and 'easy' mark the word known", () => {
    expect(gradeDecision('good')).toEqual({ known: true, requeue: false })
    expect(gradeDecision('easy')).toEqual({ known: true, requeue: false })
  })

  test('unknown grades are inert (no side effects applied)', () => {
    expect(gradeDecision('nonsense')).toEqual({ known: null, requeue: false })
    expect(gradeDecision(undefined)).toEqual({ known: null, requeue: false })
  })
})
