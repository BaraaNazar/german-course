/**
 * Shared conjugation-table vocabulary.
 * KEYS[i] maps the display pronoun PRONOUNS[i] to the field name used in
 * the verb database (verb.praesens[KEYS[i]]).
 */
export const PRONOUNS = ['ich', 'du', 'er/sie/es', 'wir', 'ihr', 'sie/Sie']
export const KEYS = ['ich', 'du', 'er', 'wir', 'ihr', 'sie']

export const TENSES = [
  { key: 'praesens', label: 'Präsens', get: (v) => v.praesens },
  { key: 'praeteritum', label: 'Präteritum', get: (v) => v.praeteritum },
]
