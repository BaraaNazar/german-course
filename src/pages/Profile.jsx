import { useAuth } from '../context/AuthContext'
import { useConjugationProgress, useVocabProgress } from '../context/ProgressContext'
import { WORDS } from '../data/vocab'
import { VERBS } from '../data/verbs'

/**
 * Profile — private area showing the account + a learning dashboard.
 * Progress numbers come from the same localStorage-backed hooks the
 * trainers use, so this page is always in sync with actual activity.
 */
export default function Profile() {
  const { user } = useAuth()
  const { progress: conj } = useConjugationProgress()
  const { progress: vocab } = useVocabProgress()

  const avg = (scores) =>
    scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null

  return (
    <>
      <div className="mb-6 text-center">
        <div className="text-[44px]">👤</div>
        <h1 className="mt-2 mb-1 text-2xl font-black">{user.name}</h1>
        <p className="m-0 text-sm text-muted">{user.email}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="card">
          <h3 className="mt-0 text-[15px] font-extrabold tracking-wider text-muted uppercase">
            Vocabulary
          </h3>
          <Row
            label="Words known"
            value={`${vocab.known.length} / ${WORDS.length.toLocaleString()}`}
          />
          <Row
            label="Progress"
            value={`${Math.round((vocab.known.length / WORDS.length) * 100)}%`}
          />
          <Row label="Quizzes taken" value={vocab.scores.length} />
          <Row label="Average score" value={avg(vocab.scores) ? `${avg(vocab.scores)}%` : '—'} />
        </div>

        <div className="card">
          <h3 className="mt-0 text-[15px] font-extrabold tracking-wider text-muted uppercase">
            Conjugation
          </h3>
          <Row label="Verbs mastered" value={`${conj.known.length} / ${VERBS.length}`} />
          <Row
            label="Progress"
            value={`${Math.round((conj.known.length / VERBS.length) * 100)}%`}
          />
          <Row label="Quizzes taken" value={conj.scores.length} />
          <Row label="Average score" value={avg(conj.scores) ? `${avg(conj.scores)}%` : '—'} />
        </div>
      </div>

      {conj.levelScores && Object.keys(conj.levelScores).length > 0 && (
        <div className="card">
          <h3 className="mt-0 text-[15px] font-extrabold tracking-wider text-muted uppercase">
            Conjugation · quiz history by level
          </h3>
          {Object.entries(conj.levelScores).map(([level, scores]) => (
            <Row
              key={level}
              label={level}
              value={scores
                .slice(-5)
                .map((s) => `${s}%`)
                .join(' · ')}
            />
          ))}
        </div>
      )}
    </>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between border-b border-surface-3 py-2 text-sm last:border-b-0">
      <span className="text-muted">{label}</span>
      <b className="font-extrabold">{value}</b>
    </div>
  )
}
