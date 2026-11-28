import { useCallback, useState } from 'react'
import { LEVELS } from '../../data/verbs'
import { useConjugationProgress } from '../../context/ProgressContext'
import { buildConjQuiz } from '../../utils/quiz'

/**
 * ConjugationQuiz — generated quiz with two question formats:
 *   · MCQ   (60%) — pick the correctly conjugated form
 *   · type-in (40%) — write the form yourself
 *
 * Question generation happens once per quiz (useMemo on the "round"
 * counter) so answering does not reshuffle upcoming questions.
 */
export default function ConjugationQuiz({ level, onSelectLevel }) {
  // Questions are generated ONCE per quiz run, in start() — explicit
  // state instead of a useMemo keyed to a "round" counter.
  const [questions, setQuestions] = useState([])
  const [started, setStarted] = useState(false)
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(null) // { picked, correct } for feedback

  const { progress, recordQuiz, markKnown } = useConjugationProgress()

  function start(n) {
    setQuestions(buildConjQuiz(level, n))
    setStarted(true)
    setIndex(0)
    setScore(0)
    setAnswered(null)
  }

  function restart() {
    setStarted(false)
    setIndex(0)
    setScore(0)
    setAnswered(null)
  }

  /**
   * Answer flow: record correctness → show feedback → "Next" advances.
   * A correct answer also marks the verb as mastered (same rule the old
   * trainer used), which syncs to localStorage via the progress hook.
   */
  const handleAnswer = useCallback(
    (pickedIndex, isCorrect, q) => {
      if (answered) return // one answer per question
      setAnswered({ picked: pickedIndex, correct: isCorrect })
      if (isCorrect) {
        setScore((s) => s + 1)
        markKnown(q.verb)
      }
    },
    [answered, markKnown],
  )

  function next() {
    if (index + 1 >= questions.length) {
      // Quiz finished — persist the score once.
      const pct = Math.round((score / questions.length) * 100)
      recordQuiz(level, pct)
      setIndex(index + 1) // pushes past the end → results screen
      setAnswered(null)
    } else {
      setIndex((i) => i + 1)
      setAnswered(null)
    }
  }

  /* ---------- render ---------- */

  if (!started) {
    return (
      <div className="card p-10 text-center">
        <h2>🧠 Konjugation Quiz</h2>
        <p className="text-muted">Choose a level, then start</p>
        <div className="my-3.5 flex flex-wrap justify-center gap-2">
          {Object.keys(LEVELS).map((id) => (
            <button
              key={id}
              onClick={() => onSelectLevel(id)}
              className={`cursor-pointer rounded-lg border-[1.5px] px-3.5 py-1.5 text-xs font-extrabold transition-colors ${
                level === id
                  ? 'border-primary text-primary'
                  : 'border-line bg-surface text-muted hover:border-primary'
              }`}
            >
              {id}
            </button>
          ))}
        </div>
        <div className="flex justify-center gap-3">
          <button className="btn btn-primary" onClick={() => start(10)}>
            10 Questions
          </button>
          <button className="btn btn-good" onClick={() => start(20)}>
            20 Questions
          </button>
        </div>
        {progress.levelScores[level]?.length > 0 && (
          <p className="mt-3 text-sm text-muted">
            Recent {level} scores:{' '}
            {progress.levelScores[level]
              .slice(-3)
              .map((s) => `${s}%`)
              .join(', ')}
          </p>
        )}
      </div>
    )
  }

  if (index >= questions.length) {
    const pct = Math.round((score / questions.length) * 100)
    return (
      <div className="card results-hero">
        <div className="stars">
          {pct >= 90 ? '★★★' : pct >= 70 ? '★★☆' : pct >= 50 ? '★☆☆' : '☆☆☆'}
        </div>
        <div className="results-score">{pct}%</div>
        <p className="text-muted">
          Quiz · {level} · {score}/{questions.length} correct
        </p>
        <div className="mt-4 flex justify-center gap-3">
          <button className="btn btn-primary" onClick={restart}>
            New Quiz
          </button>
        </div>
      </div>
    )
  }

  const q = questions[index]

  return (
    <>
      <div className="py-2.5 text-center font-mono text-[13px] font-extrabold text-muted">
        Question {index + 1}/{questions.length} · Score: {score}
      </div>

      <div className="my-4 rounded-2xl border-2 border-line bg-surface p-5 text-center shadow-1">
        <span className="mb-2.5 inline-block rounded-md bg-gold-soft px-3 py-0.5 text-xs font-extrabold tracking-wider text-gold-ink uppercase">
          {q.tenseLabel}
        </span>
        <div className="mb-1.5 text-sm text-muted">{q.person}</div>
        <div className="text-[26px] font-black text-primary">{q.verb}</div>
      </div>

      {/* key={index} forces a fresh component per question — without it,
          two consecutive type-in questions share one instance and the
          input would still hold the previous answer. */}
      {q.type === 'mcq' ? (
        <McqQuestion key={index} q={q} answered={answered} onAnswer={handleAnswer} />
      ) : (
        <InputQuestion key={index} q={q} answered={answered} onAnswer={handleAnswer} />
      )}

      {answered && (
        <>
          <Feedback correct={answered.correct} q={q} />
          <div className="mt-3.5 flex justify-center">
            <button className="btn btn-primary btn-sm" onClick={next}>
              Next →
            </button>
          </div>
        </>
      )}
    </>
  )
}

/* ---------- question renderers ---------- */

function McqQuestion({ q, answered, onAnswer }) {
  return (
    <div className="mt-3.5 grid grid-cols-2 gap-2.5 md:grid-cols-4">
      {q.opts.map((opt, i) => {
        let state = ''
        // Lock styles once answered: correct option goes green,
        // the (wrong) pick goes red — mirroring the classic trainer look.
        if (answered) {
          if (i === q.answer) state = 'correct'
          else if (i === answered.picked) state = 'wrong'
        }
        return (
          <button
            key={i}
            disabled={!!answered}
            className={`opt ${state} justify-center`}
            onClick={() => onAnswer(i, i === q.answer, q)}
          >
            <span className="k">{'abcd'[i]}</span>
            {opt}
          </button>
        )
      })}
    </div>
  )
}

function InputQuestion({ q, answered, onAnswer }) {
  const [value, setValue] = useState('')

  function submit() {
    // Case- and whitespace-insensitive comparison — "Sprichst" == "sprichst".
    const normalized = value.trim().toLowerCase()
    onAnswer(-1, normalized === q.answer.toLowerCase(), q)
  }

  if (answered) {
    return (
      <div className="feedback ok mt-3.5">
        <div className="fb-title">Your answer: {value.trim() || '—'}</div>
      </div>
    )
  }

  return (
    <>
      <input
        className="mx-auto block w-full max-w-[360px] rounded-xl border-2 border-line bg-surface-2 px-4 py-3 text-center text-lg focus:border-primary focus:outline-none"
        placeholder="Deine Antwort …"
        value={value}
        autoFocus
        autoComplete="off"
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && submit()}
      />
      <div className="mt-3.5 flex justify-center">
        <button className="btn btn-primary" onClick={submit}>
          Check
        </button>
      </div>
    </>
  )
}

function Feedback({ correct, q }) {
  return (
    <div className={`feedback mt-3.5 ${correct ? 'ok' : 'bad'}`}>
      <div className="fb-title">{correct ? '✓ Richtig!' : '✗ Nicht ganz.'}</div>
      {!correct && (
        <div>
          Richtig: <u>{q.display}</u>
        </div>
      )}
      {q.expl && <div className="mt-1 text-muted">{q.expl}</div>}
    </div>
  )
}
