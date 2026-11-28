import { useState } from 'react'
import { WORDS } from '../../data/vocab'
import { buildVocabQuiz } from '../../utils/quiz'
import { useVocabProgress } from '../../context/ProgressContext'

/**
 * VocabQuiz — generated multiple-choice quiz.
 * Each question is randomly German→English or English→German, with
 * distractors drawn from the real word list (same language side as the
 * answer, never equal to it, deduplicated).
 */
export default function VocabQuiz({ progress }) {
  const [questions, setQuestions] = useState([])
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(null)

  const { markWordKnown, recordQuiz } = useVocabProgress()

  function start(n) {
    setQuestions(buildVocabQuiz(WORDS, n))
    setIndex(0)
    setScore(0)
    setAnswered(null)
  }

  function answer(i) {
    if (answered) return
    const q = questions[index]
    const ok = i === q.answer
    setAnswered({ picked: i, ok })
    if (ok) {
      setScore((s) => s + 1)
      markWordKnown(q.word[0], true)
    }
  }

  function next() {
    if (index + 1 >= questions.length) {
      // Persist the final score once, when the quiz actually ends.
      recordQuiz(Math.round((score / questions.length) * 100))
      setAnswered(null)
      setIndex(index + 1)
    } else {
      setIndex((i) => i + 1)
      setAnswered(null)
    }
  }

  /* ---------- start screen ---------- */
  if (!questions.length) {
    return (
      <div className="card p-10 text-center">
        <h2>🧠 Vocabulary Quiz</h2>
        <p className="text-muted">Test your knowledge with multiple-choice questions</p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <button className="btn btn-primary" onClick={() => start(10)}>
            Quick · 10
          </button>
          <button className="btn btn-good" onClick={() => start(25)}>
            Standard · 25
          </button>
          <button className="btn btn-dark" onClick={() => start(50)}>
            Marathon · 50
          </button>
        </div>
        {progress.scores.length > 0 && (
          <div className="mt-5 text-sm">
            <b>Recent scores:</b>{' '}
            {progress.scores
              .slice(-5)
              .map((s) => `${s}%`)
              .join(', ')}
          </div>
        )}
      </div>
    )
  }

  /* ---------- results ---------- */
  if (index >= questions.length) {
    const pct = Math.round((score / questions.length) * 100)
    return (
      <div className="card results-hero">
        <div className="stars">
          {pct >= 90 ? '★★★' : pct >= 70 ? '★★☆' : pct >= 50 ? '★☆☆' : '☆☆☆'}
        </div>
        <div className="results-score">{pct}%</div>
        <p className="text-muted">
          Quiz complete! {score}/{questions.length} correct
        </p>
        <div className="mt-4 flex justify-center gap-3">
          <button className="btn btn-primary" onClick={() => setQuestions([])}>
            New Quiz
          </button>
        </div>
      </div>
    )
  }

  /* ---------- question ---------- */
  const q = questions[index]

  return (
    <div className="card">
      <div className="mb-2 text-center text-[13px] text-muted">
        Question {index + 1}/{questions.length} · Score: {score}
      </div>
      <div className="my-5 text-center text-lg font-extrabold">
        {q.prompt} <b className="text-primary">{q.highlight}</b>?
      </div>
      <div className="flex flex-col gap-2.5">
        {q.opts.map((opt, i) => {
          let state = ''
          if (answered) {
            if (i === q.answer) state = 'correct'
            else if (i === answered.picked) state = 'wrong'
          }
          return (
            <button
              key={i}
              className={`opt ${state}`}
              disabled={!!answered}
              onClick={() => answer(i)}
            >
              <span className="k">{'abcd'[i]}</span>
              {opt}
            </button>
          )
        })}
      </div>

      {answered && (
        <>
          <div className={`feedback mt-3.5 ${answered.ok ? 'ok' : 'bad'}`}>
            <div className="fb-title">{answered.ok ? '✓ Correct!' : '✗ Not quite.'}</div>
            <div className="mt-1">
              {q.word[0]} = {q.word[1]}
            </div>
            {q.word[3] && (
              <div className="mt-2 rounded-[10px] bg-surface-2 px-3.5 py-2 text-sm text-muted">
                “{q.word[3]}”<br />
                <span className="text-xs">{q.word[4]}</span>
              </div>
            )}
          </div>
          <div className="mt-3.5 flex justify-center">
            <button className="btn btn-primary btn-sm" onClick={next}>
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  )
}
