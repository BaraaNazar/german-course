import { describe, test, expect } from 'vitest'
import { splitEnding } from './endings'

describe('splitEnding', () => {
  test('-st endings split with priority over -t', () => {
    expect(splitEnding('sprichst')).toEqual({ stem: 'sprich', suffix: 'st', className: 'end-st' })
  })

  test('-en endings (wir/sie forms)', () => {
    expect(splitEnding('sprechen')).toEqual({ stem: 'sprech', suffix: 'en', className: 'end-en' })
  })

  test('-e endings win over nothing', () => {
    expect(splitEnding('mache')).toEqual({ stem: 'mach', suffix: 'e', className: 'end-e' })
  })

  test('bare -t endings', () => {
    expect(splitEnding('geht')).toEqual({ stem: 'geh', suffix: 't', className: 'end-t' })
  })

  test('separable prefixes are not the suffix concern (handled upstream)', () => {
    // "stehst auf" is split by EndingWithPrefix before splitEnding sees it.
    expect(splitEnding('stehst')).toEqual({ stem: 'steh', suffix: 'st', className: 'end-st' })
  })

  test('null/undefined/empty are inert', () => {
    expect(splitEnding(null)).toBeNull()
    expect(splitEnding(undefined)).toBeNull()
    expect(splitEnding('')).toBeNull()
  })

  test('single-character forms stay whole (length guard)', () => {
    // 't' alone: suffix would equal the whole form — guard returns null
    // for '' but 't' ends with 't' and length 1 > 1 is false → null
    expect(splitEnding('t')).toBeNull()
  })
})
