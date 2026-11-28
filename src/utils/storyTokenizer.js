/**
 * Story tokenizer — vocabulary highlighting logic, pure (task B4).
 *
 * Given a paragraph and a phrase lookup (built from the 5,000-word
 * database), splits the text into tokens where every vocabulary phrase
 * becomes a highlight token carrying its English meaning.
 *
 * Algorithm: walk the whitespace-split tokens; at each position try to
 * match 3-, 2-, then 1-word joins (longest phrase wins) against the
 * case-insensitive phrase map. O(tokens × 3) per paragraph — fast
 * enough for one-time rendering, no innerHTML regex hacking.
 */

/**
 * @param {Array<Array>} words the WORDS array from src/data/vocab.js
 * @returns {Map<string, string>} lowercase German phrase → English meaning
 */
export function buildVocabLookup(words) {
  // Sort longest-first is NOT needed for the map itself (we try joins
  // longest-first at tokenize time) — but harmless and keeps intent clear.
  return new Map(words.map((w) => [w[0].toLowerCase(), w[1]]))
}

/** Trailing/leading punctuation (periods, quotes, dashes, …) to strip for lookup. */
const EDGE_PUNCT = /^[^\p{L}\p{N}\s]+|[^\p{L}\p{N}\s]+$/gu
const stripEdges = (phrase) => phrase.replace(EDGE_PUNCT, '')

/**
 * @param {string} text paragraph
 * @param {Map<string,string>} lookup from buildVocabLookup
 * @param {Set<string>} knownSet German phrases the user has learned
 * @returns {Array<{text: string, match: boolean, en?: string, known?: boolean}>}
 */
export function tokenizeParagraph(text, lookup, knownSet) {
  const parts = text.split(/\s+/)
  const tokens = []
  let i = 0
  while (i < parts.length) {
    let matched = null
    // Try 3-, 2-, then 1-word joins (longest phrase wins). A join is
    // matched as-is OR with edge punctuation stripped — "liest." still
    // matches the phrase "liest" while keeping its original text for
    // faithful rendering.
    for (const len of [3, 2, 1]) {
      if (i + len > parts.length) continue
      const phrase = parts.slice(i, i + len).join(' ')
      const key = phrase.toLowerCase()
      const en = lookup.get(key) ?? lookup.get(stripEdges(key))
      if (en !== undefined) {
        matched = { text: phrase, en, known: knownSet.has(phrase) }
        i += len
        break
      }
    }
    if (!matched) {
      tokens.push({ text: parts[i], match: false })
      i++
    } else {
      tokens.push({ ...matched, match: true })
    }
  }
  return tokens
}

/** Dialogue lines start with a quotation mark or a "Name:" pattern. */
export function isDialogue(paragraph) {
  return /^[«"]|^[A-Z][a-z]+:|^"/.test(paragraph.trim())
}
