import { VERBS } from '../data/verbs'
import { PRONOUNS, KEYS, TENSES } from './conjugationTable'

/**
 * Quiz generation — pure functions, no React.
 *
 * Extracted from the trainer components (task B4) so the generation
 * logic is unit-testable and can be shared by both quiz UIs.
 *
 * Invariants tested in quiz.test.js:
 * · every quiz has at most `count` questions, all distinct verbs
 * · MCQ: exactly 4 options, no duplicates, the answer is among them,
 *   and `answer` is the index of the correct option
 * · type-in: the answer is a non-empty string
 */

/**
 * Conjugation quiz — MCQ (60%) + type-in (40%) mix.
 *
 * MCQ distractors are REAL conjugated forms of other verbs from the same
 * level & person — much harder (and more useful) than made-up strings.
 *
 * @param {string} level CEFR level, e.g. 'A1'
 * @param {number} count requested question count
 * @returns {Array<object>} questions
 */
export function buildConjQuiz(level, count) {
  const pool = VERBS.filter((v) => v.level === level).slice()
  const questions = []

  for (let i = 0; i < count && pool.length; i++) {
    const verb = pool.splice(Math.floor(Math.random() * pool.length), 1)[0]
    const tense = TENSES[Math.floor(Math.random() * TENSES.length)]
    const personIdx = Math.floor(Math.random() * 6)
    const answer = tense.get(verb)[KEYS[personIdx]]
    if (!answer) continue

    if (Math.random() < 0.6) {
      // Distractors: same person, other verbs — deduplicated, never the answer.
      const wrong = pool
        .map((x) => tense.get(x)[KEYS[personIdx]])
        .filter((f) => f && f !== answer)
        .filter((f, idx, arr) => arr.indexOf(f) === idx)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
      while (wrong.length < 3) wrong.push(answer + 'e') // tiny-pool fallback
      const opts = [answer, ...wrong].sort(() => Math.random() - 0.5)
      questions.push({
        type: 'mcq',
        verb: verb.inf,
        person: PRONOUNS[personIdx],
        tenseLabel: tense.label,
        opts,
        answer: opts.indexOf(answer),
        display: answer,
        expl: `${verb.inf} = ${verb.en} · ${tense.label}`,
      })
    } else {
      questions.push({
        type: 'input',
        verb: verb.inf,
        person: PRONOUNS[personIdx],
        tenseLabel: tense.label,
        answer,
        display: answer,
        expl: `${verb.inf} = ${verb.en} · ${tense.label}`,
      })
    }
  }
  return questions
}

/**
 * Vocabulary quiz — randomly German→English or English→German.
 *
 * @param {Array<Array>} words the full WORDS array from src/data/vocab.js
 * @param {number} count requested question count
 * @returns {Array<object>} questions
 */
export function buildVocabQuiz(words, count) {
  const pool = words.slice()
  const questions = []
  for (let i = 0; i < count && pool.length; i++) {
    const word = pool.splice(Math.floor(Math.random() * pool.length), 1)[0]
    const germanToEnglish = Math.random() < 0.5

    // Distractors come from the same language side as the answer, so the
    // options are all plausible members of one language.
    const answer = germanToEnglish ? word[1] : word[0]
    const distract = pool
      .map((x) => (germanToEnglish ? x[1] : x[0]))
      .filter((f) => f && f !== answer)
      .filter((f, idx, arr) => arr.indexOf(f) === idx) // dedupe
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
    while (distract.length < 3) distract.push(answer + '!')

    const opts = [answer, ...distract].sort(() => Math.random() - 0.5)
    questions.push({
      prompt: germanToEnglish ? 'What does' : 'How do you say',
      highlight: germanToEnglish ? word[0] : word[1],
      opts,
      answer: opts.indexOf(answer),
      word,
    })
  }
  return questions
}
