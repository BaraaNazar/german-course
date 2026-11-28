import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, renderHook, act, fireEvent } from '@testing-library/react'
import { ProgressProvider, useConjugationProgress, useVocabProgress } from './ProgressContext'

/**
 * Tests for the single-writer progress store (tasks B2 + B3):
 * debounce coalescing, flush-on-hide/unload, sanitization on load,
 * cross-tab adoption, and the stable hook API.
 */

function setupConj() {
  return renderHook(() => useConjugationProgress(), { wrapper: ProgressProvider })
}

function setupVocab() {
  return renderHook(() => useVocabProgress(), { wrapper: ProgressProvider })
}

const readStored = key => JSON.parse(window.localStorage.getItem(key))

describe('ProgressProvider', () => {
  beforeEach(() => {
    window.localStorage.clear()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  test('B2: actions update state immediately (UI never waits for the debounce)', () => {
    const { result } = setupConj()
    act(() => result.current.markKnown('sein'))
    expect(result.current.progress.known).toEqual(['sein'])
    // …while storage is still completely untouched (key not even written):
    expect(window.localStorage.getItem('conj_v2')).toBeNull()
  })

  test('B3: rapid updates coalesce into ONE storage write after the debounce', () => {
    const setItem = vi.spyOn(Storage.prototype, 'setItem')
    const { result } = setupConj()

    act(() => result.current.markKnown('sein'))
    act(() => result.current.markKnown('haben'))
    act(() => result.current.markKnown('gehen'))

    // Nothing written yet (all inside the 300 ms window):
    expect(setItem).toHaveBeenCalledTimes(0)

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(setItem).toHaveBeenCalledTimes(1)
    expect(readStored('conj_v2').known).toEqual(['sein', 'haben', 'gehen'])
  })

  test('B3: pending write is flushed when the tab becomes hidden', () => {
    const { result } = setupConj()
    act(() => result.current.markKnown('sein'))
    // Do NOT advance the timer — simulate the user leaving mid-debounce.

    const visibility = Object.defineProperty(document, 'visibilityState', {
      value: 'hidden',
      configurable: true,
    })
    act(() => {
      document.dispatchEvent(new Event('visibilitychange'))
    })

    expect(readStored('conj_v2').known).toEqual(['sein'])
    visibility // keep the override reference meaningful
  })

  test('B3: pending write is flushed on beforeunload', () => {
    const { result } = setupVocab()
    act(() => result.current.markWordKnown('der Mann'))

    act(() => {
      window.dispatchEvent(new Event('beforeunload'))
    })

    expect(readStored('vocab_v1').known).toEqual(['der Mann'])
  })

  test('B3: unmount with a pending write flushes instead of dropping it', () => {
    const { result, unmount } = setupConj()
    act(() => result.current.markKnown('sein'))
    // No timer advance, no unload event — just unmount:
    act(() => unmount())
    expect(readStored('conj_v2').known).toEqual(['sein'])
  })

  test('B1: corrupt stored data is sanitized on load, app keeps working', () => {
    window.localStorage.setItem('conj_v2', JSON.stringify({ known: null, scores: 'x' }))
    const { result } = setupConj()
    expect(result.current.progress).toEqual({
      known: [],
      scores: [],
      levelScores: {},
    })
    // And the store remains writable afterwards:
    act(() => result.current.markKnown('sein'))
    act(() => {
      vi.advanceTimersByTime(300)
    })
    expect(readStored('conj_v2').known).toEqual(['sein'])
  })

  test('cross-tab: a storage event adopts the other tab’s document', () => {
    const { result } = setupConj()
    act(() => result.current.markKnown('sein'))
    act(() => {
      vi.advanceTimersByTime(300)
    })

    // Another tab writes a bigger document:
    act(() => {
      window.localStorage.setItem(
        'conj_v2',
        JSON.stringify({ known: ['sein', 'haben'], scores: [90], levelScores: { A1: [90] } }),
      )
      window.dispatchEvent(new StorageEvent('storage', { key: 'conj_v2' }))
    })

    expect(result.current.progress.known).toEqual(['sein', 'haben'])
    // Pending local write was cancelled (would have clobbered the fresh value)
  })

  test('B2: recordQuiz writes both score histories', () => {
    const { result } = setupConj()
    act(() => result.current.recordQuiz('A1', 80))
    act(() => result.current.recordQuiz('A1', 90))
    act(() => {
      vi.advanceTimersByTime(300)
    })
    expect(readStored('conj_v2')).toEqual({
      known: [],
      scores: [80, 90],
      levelScores: { A1: [80, 90] },
    })
  })

  test('hooks throw a clear error outside the provider (fail fast)', () => {
    expect(() => renderHook(() => useVocabProgress())).toThrow(/ProgressProvider/)
  })

  test('sanity: children render inside the provider', () => {
    const { getByText } = render(
      <ProgressProvider>
        <p>child content</p>
      </ProgressProvider>,
    )
    expect(getByText('child content')).toBeTruthy()
  })
})
