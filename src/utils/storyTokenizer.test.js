import { describe, test, expect } from 'vitest'
import { buildVocabLookup, tokenizeParagraph, isDialogue } from './storyTokenizer'

const lookup = buildVocabLookup([
  ['die Person', 'person'],
  ['der Mann', 'man'],
  ['liest', 'reads'],
])

describe('buildVocabLookup', () => {
  test('maps lowercase German phrases to English meanings', () => {
    expect(lookup.get('die person')).toBe('person')
    expect(lookup.get('der mann')).toBe('man')
  })
})

describe('tokenizeParagraph', () => {
  test('wraps vocabulary phrases with their meaning', () => {
    const tokens = tokenizeParagraph('Der Mann liest.', lookup, new Set())
    expect(tokens).toEqual([
      { text: 'Der Mann', en: 'man', known: false, match: true },
      { text: 'liest.', en: 'reads', known: false, match: true },
    ])
  })

  test('matching is case-insensitive', () => {
    const tokens = tokenizeParagraph('DIE PERSON kommt', lookup, new Set())
    expect(tokens[0]).toMatchObject({ text: 'DIE PERSON', match: true, en: 'person' })
  })

  test('multi-word phrases win over single-word matches', () => {
    // 'die Person' must consume both words, not match 'Person' alone.
    const tokens = tokenizeParagraph('die Person schläft', lookup, new Set())
    expect(tokens[0]).toMatchObject({ text: 'die Person', match: true })
    expect(tokens[1]).toMatchObject({ match: false })
  })

  test('known phrases are flagged', () => {
    const tokens = tokenizeParagraph('der Mann', lookup, new Set(['der Mann']))
    expect(tokens[0]).toMatchObject({ known: true })
  })

  test('plain text passes through as non-matching tokens', () => {
    const tokens = tokenizeParagraph('Heute ist Sonntag', lookup, new Set())
    expect(tokens.every((t) => t.match === false)).toBe(true)
    expect(tokens.map((t) => t.text).join(' ')).toBe('Heute ist Sonntag')
  })
})

describe('isDialogue', () => {
  test('detects quoted lines and Name: prefixes', () => {
    expect(isDialogue('"Guten Morgen"')).toBe(true)
    expect(isDialogue('«Bonjour»')).toBe(true)
    expect(isDialogue('Anna: Hallo')).toBe(true)
  })

  test('narrative lines are not dialogue', () => {
    expect(isDialogue('Anna wohnt in Berlin.')).toBe(false)
    expect(isDialogue('  Sie liest ein Buch.')).toBe(false)
  })
})
