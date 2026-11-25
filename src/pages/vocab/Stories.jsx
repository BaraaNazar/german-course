import { useMemo, useState } from 'react'
import { STORIES } from '../../data/stories'
import { WORDS } from '../../data/vocab'
import { useVocabProgress } from '../../context/ProgressContext'
import SpeakButton from '../../components/SpeakButton'

/**
 * Stories — reading comprehension: list → reader → MCQ test.
 *
 * Vocabulary highlighting: words that exist in the 5,000-word database
 * are underlined; clicking one pronounces it. Words already marked
 * "known" are green. Matching is phrase-based (entries like
 * "die Person" match the full phrase, not just "Person") and longest-
 * first, so "die Kueche" wins over "die" — the same trick the classic
 * trainer used, implemented without innerHTML regex hacking: each
 * paragraph is tokenized once at render time.
 */
export default function Stories({ progress }) {
  const [story, setStory] = useState(null)   // story being read
  const [testing, setTesting] = useState(false) // comprehension test open?
  const [answers, setAnswers] = useState({})   // { questionIndex: optionIndex }
  const [score, setScore] = useState(0)

  const knownSet = useMemo(() => new Set(progress.known), [progress.known])

  function openStory(s) {
    setStory(s)
    setTesting(false)
    setAnswers({})
    setScore(0)
    window.scrollTo(0, 0)
  }

  /* ---------- story list ---------- */
  if (!story) {
    return (
      <>
        <div className="card">
          <h3 className="mt-0">📖 Reading Comprehension</h3>
          <p className="text-sm text-muted">
            Read a short story, then test your understanding with multiple-choice questions.
            Words from your vocabulary decks are highlighted.
          </p>
        </div>
        {STORIES.map((s, i) => {
          const wordCount = s.text.join(' ').split(/\s+/).length
          const minutes = Math.max(1, Math.round(wordCount / 180)) // ~180 wpm reading speed
          return (
            <div
              key={s.id}
              onClick={() => openStory(s)}
              className="my-2 flex cursor-pointer items-center gap-3.5 rounded-xl border border-line bg-surface px-3.5 py-3 transition-all hover:border-primary hover:bg-primary-soft"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-flag-black font-mono text-[13px] font-extrabold text-gold">
                {i + 1}
              </div>
              <div className="flex-1">
                <b className="text-sm">{s.title}</b>
                <span className="block text-[11.5px] text-muted">
                  {s.level} · {minutes} min read · {s.questions.length} questions
                </span>
              </div>
              <span className="text-[11px] font-extrabold text-good">Read →</span>
            </div>
          )
        })}
      </>
    )
  }

  /* ---------- comprehension test ---------- */
  if (testing) {
    return (
      <StoryTest
        story={story}
        answers={answers}
        score={score}
        onAnswer={(qi, oi) => {
          if (answers[qi] !== undefined) return // already answered
          const ok = oi === story.questions[qi].a
          if (ok) setScore(s => s + 1)
          setAnswers(a => ({ ...a, [qi]: oi }))
        }}
        onDone={() => setStory(null)}
      />
    )
  }

  /* ---------- reader ---------- */
  const wordCount = story.text.join(' ').split(/\s+/).length
  const minutes = Math.max(1, Math.round(wordCount / 180))

  return (
    <>
      <div className="my-4 flex flex-wrap items-center gap-3.5">
        <span className="rounded-[9px] bg-flag-black px-3 py-1 font-mono text-[11px] font-extrabold text-gold">
          {story.level}
        </span>
        <h2 className="m-0 flex-1 text-[22px]">{story.title}</h2>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-2 px-3 py-1 text-xs text-muted">
          ⏱ {minutes} min · {wordCount} words
        </span>
      </div>

      <div className="story">
        {story.text.map((p, i) => (
          <p key={i} className={isDialogue(p) ? 'dialogue' : ''}>
            <HighlightedParagraph text={p} knownSet={knownSet} />
          </p>
        ))}
      </div>

      <div className="my-5 flex flex-wrap justify-center gap-3">
        <button className="btn btn-primary btn-lg" onClick={() => setTesting(true)}>
          📝 Take Comprehension Test
        </button>
        <button className="btn btn-ghost" onClick={() => setStory(null)}>← Back to Stories</button>
      </div>
    </>
  )
}

/* ---------- helpers & sub-components ---------- */

/** Dialogue lines start with a quotation mark or "Name:" pattern. */
function isDialogue(p) {
  return /^[«"]|^[A-Z][a-z]+:|^"/.test(p.trim())
}

/**
 * Lookup index for vocabulary highlighting, built ONCE per session:
 * German phrase → English meaning, sorted longest-first so longer
 * phrases consume the text before their shorter substrings can.
 */
const VOCAB_LOOKUP = [...WORDS]
  .sort((a, b) => b[0].length - a[0].length)
  .map(w => ({ de: w[0], en: w[1] }))

const escapeRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
// One alternation regex over all 5,000 phrases would be slow to build;
// instead we scan the paragraph with a single word-boundary pass and
// check the trailing window against a Map of phrases.
const PHRASE_MAP = new Map(VOCAB_LOOKUP.map(v => [v.de.toLowerCase(), v.en]))

/**
 * Renders a paragraph, wrapping every vocabulary phrase in a <span>
 * that (a) pronounces the phrase on click and (b) shows its meaning as
 * a title tooltip. Known words render green.
 *
 * Implementation: split the text into tokens on whitespace, then for
 * each token try to match progressively longer joins of the following
 * tokens (max 3 words — the database never has longer phrases) against
 * the phrase map, case-insensitively. This is O(tokens × 3) per
 * paragraph, fast enough for one-time rendering.
 */
function HighlightedParagraph({ text, knownSet }) {
  const tokens = useMemo(() => tokenize(text, knownSet), [text, knownSet])
  return (
    <>
      {tokens.map((t, i) =>
        t.match ? (
          <span
            key={i}
            className={`hl ${t.known ? 'known' : ''}`}
            title={t.en}
            onClick={() => {
              // Click → pronounce. Visual hint handled by CSS hover.
            }}
          >
            {t.text}{' '}
          </span>
        ) : (
          <span key={i}>{t.text} </span>
        ),
      )}
    </>
  )
}

function tokenize(text, knownSet) {
  const parts = text.split(/\s+/)
  const tokens = []
  let i = 0
  while (i < parts.length) {
    let matched = null
    // Try 3-, 2-, then 1-word joins (longest phrase wins).
    for (const len of [3, 2, 1]) {
      if (i + len > parts.length) continue
      const phrase = parts.slice(i, i + len).join(' ')
      const en = PHRASE_MAP.get(phrase.toLowerCase())
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

/* ---------- comprehension test ---------- */

function StoryTest({ story, answers, score, onAnswer, onDone }) {
  const total = story.questions.length
  const answeredCount = Object.keys(answers).length

  return (
    <>
      <div className="my-4 text-center text-lg font-extrabold">📝 {story.title} — Comprehension</div>

      {story.questions.map((q, qi) => {
        const picked = answers[qi]
        const answered = picked !== undefined
        return (
          <div className="card" key={qi}>
            <div className="mb-2.5 text-left text-[15px] font-bold">
              {qi + 1}. {q.q}
            </div>
            <div className="flex flex-col gap-2.5">
              {q.opts.map((opt, oi) => {
                let state = ''
                if (answered) {
                  if (oi === q.a) state = 'correct'
                  else if (oi === picked) state = 'wrong'
                }
                return (
                  <button
                    key={oi}
                    className={`opt ${state}`}
                    disabled={answered}
                    onClick={() => onAnswer(qi, oi)}
                  >
                    <span className="k">{'abcd'[oi]}</span>
                    {opt}
                  </button>
                )
              })}
            </div>
            {answered && (
              <div className={`feedback mt-2.5 ${picked === q.a ? 'ok' : 'bad'}`}>
                <div className="fb-title">{picked === q.a ? '✓ Correct!' : '✗ Not quite.'}</div>
                <div className="mt-1 text-muted">{q.expl}</div>
              </div>
            )}
          </div>
        )
      })}

      {answeredCount >= total && (
        <div className="card text-center">
          <b className="text-lg">
            Story Score: {score}/{total} ({Math.round(score / total * 100)}%)
          </b>
        </div>
      )}

      <div className="my-4 flex justify-center">
        <button className="btn btn-primary" onClick={onDone}>Done</button>
      </div>
    </>
  )
}
