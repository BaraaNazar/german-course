import { useMemo, useState } from 'react'
import { VERBS, LEVELS, TYPE_INFO } from '../../data/verbs'
import { useConjugationProgress } from '../../context/ProgressContext'
import VerbDetail from './VerbDetail'
import ConjugationQuiz from './ConjugationQuiz'

/**
 * ConjugationPage — full trainer with three views:
 *   Home   → progress stats + level decks grouped by verb type
 *   Browse → pick a level/type, open any verb's conjugation table
 *   Quiz   → generated MCQ / type-in questions
 */
export default function ConjugationPage() {
  const [view, setView] = useState('home')
  const [level, setLevel] = useState('A1')
  const [type, setType] = useState(null)
  const [verb, setVerb] = useState(null)

  const { progress } = useConjugationProgress()
  const knownSet = useMemo(() => new Set(progress.known), [progress.known])

  function openDeck(lv, tp) {
    setLevel(lv)
    setType(tp)
    setVerb(null)
    setView('table')
    window.scrollTo(0, 0)
  }

  const tabs = [
    { id: 'home', label: 'Home', sub: `${progress.known.length}/${VERBS.length}` },
    { id: 'table', label: 'Browse', sub: 'A1–C2' },
    { id: 'quiz', label: 'Quiz', sub: 'MCQ' },
  ]

  return (
    <>
      <div className="flex border-b-2 border-line">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setView(t.id)
              setVerb(null)
              window.scrollTo(0, 0)
            }}
            className={`flex-1 cursor-pointer border-b-[3px] bg-none px-2 py-3 text-center text-[13px] font-extrabold transition-all ${
              view === t.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted hover:text-ink'
            }`}
          >
            {t.label}
            <span className="block text-[10px] font-semibold text-muted">{t.sub}</span>
          </button>
        ))}
      </div>

      {view === 'home' && (
        <HomeView
          progress={progress}
          knownSet={knownSet}
          onOpenDeck={openDeck}
          onQuiz={(lv) => {
            setLevel(lv)
            setView('quiz')
          }}
        />
      )}

      {view === 'table' && (
        <BrowseView
          level={level}
          type={type}
          verb={verb}
          knownSet={knownSet}
          onSelectLevel={(lv) => {
            setLevel(lv)
            setType(null)
            setVerb(null)
          }}
          onSelectVerb={setVerb}
          onBack={() => setVerb(null)}
        />
      )}

      {view === 'quiz' && <ConjugationQuiz level={level} onSelectLevel={setLevel} />}
    </>
  )
}

/* ================= Home: stats + decks ================= */

function HomeView({ progress, knownSet, onOpenDeck, onQuiz }) {
  const numDecks = LEVELS ? Object.keys(LEVELS).length : 0
  const stats = [
    { num: progress.known.length, lbl: 'Mastered' },
    { num: VERBS.length, lbl: 'Total Verbs' },
    { num: numDecks, lbl: 'Levels' },
    { num: progress.scores.length, lbl: 'Quizzes' },
  ]

  return (
    <>
      <div className="mb-4 grid grid-cols-2 gap-2 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.lbl} className="rounded-[10px] border border-line bg-surface p-2 text-center">
            <div className="text-xl font-black text-primary">{s.num}</div>
            <div className="text-[9.5px] font-bold tracking-wider text-muted uppercase">
              {s.lbl}
            </div>
          </div>
        ))}
      </div>

      {/* Level sections, each with one sub-deck per verb type */}
      {Object.entries(LEVELS).map(([lvId, lv]) => {
        const verbs = VERBS.filter((v) => v.level === lvId)
        const known = verbs.filter((v) => knownSet.has(v.inf)).length
        return (
          <div key={lvId} className="my-4">
            <div className="mt-5 mb-2 flex items-center gap-3">
              <span
                className="rounded-[10px] px-4 py-1.5 text-xl font-black text-white"
                style={{ background: lv.color }}
              >
                {lvId}
              </span>
              <h3 className="m-0 flex-1 text-base">{lv.name}</h3>
              <span className="text-sm text-muted">
                {known}/{verbs.length}
              </span>
            </div>
            {Object.entries(TYPE_INFO).map(([typeName, info]) => {
              const typeVerbs = verbs.filter((v) => v.type === typeName)
              if (!typeVerbs.length) return null
              const tk = typeVerbs.filter((v) => knownSet.has(v.inf)).length
              return (
                <div
                  key={typeName}
                  onClick={() => onOpenDeck(lvId, typeName)}
                  className="my-2 flex cursor-pointer items-center gap-3.5 rounded-xl border border-line bg-surface px-4 py-3.5 transition-colors hover:border-primary"
                >
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-[10px] font-mono text-[13px] font-extrabold text-white"
                    style={{ background: info.color }}
                  >
                    {typeVerbs.length}
                  </div>
                  <div className="flex-1">
                    <b className="text-[15px]">{info.name}</b>
                    <span className="block text-xs text-muted">{typeVerbs.length} verbs</span>
                  </div>
                  <span className="text-[11px] font-extrabold text-good">
                    {tk}/{typeVerbs.length}
                  </span>
                </div>
              )
            })}
          </div>
        )
      })}

      {/* Quick quiz launcher */}
      <div className="card text-center">
        <h3 className="mt-0">Quick Quiz</h3>
        <p className="text-sm text-muted">Pick a level and test your forms</p>
        <LevelPicker onPick={onQuiz} />
        {progress.scores.length > 0 && (
          <p className="mt-3 text-sm text-muted">
            Recent:{' '}
            {progress.scores
              .slice(-3)
              .map((s) => `${s}%`)
              .join(', ')}
          </p>
        )}
      </div>
    </>
  )
}

function LevelPicker({ onPick }) {
  const [selected, setSelected] = useState('A1')
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {Object.keys(LEVELS).map((id) => (
        <button
          key={id}
          onClick={() => {
            setSelected(id)
            onPick(id)
          }}
          className={`cursor-pointer rounded-lg border-[1.5px] px-3.5 py-1.5 text-xs font-extrabold transition-colors ${
            selected === id
              ? 'border-primary text-primary'
              : 'border-line bg-surface text-muted hover:border-primary'
          }`}
        >
          {id}
        </button>
      ))}
    </div>
  )
}

/* ================= Browse: level filter + verb list + detail ================= */

function BrowseView({ level, type, verb, knownSet, onSelectLevel, onSelectVerb, onBack }) {
  const verbs = useMemo(
    () => VERBS.filter((v) => v.level === level && (!type || v.type === type)),
    [level, type],
  )
  const typeName = type ? TYPE_INFO[type].name : 'All'

  // When a verb is selected, show its full conjugation table instead of the list.
  if (verb) {
    return (
      <>
        <button className="btn btn-ghost btn-sm mb-3" onClick={onBack}>
          ← Back
        </button>
        <VerbDetail verb={VERBS.find((v) => v.inf === verb)} known={knownSet.has(verb)} />
      </>
    )
  }

  return (
    <>
      <div className="mt-3 flex flex-wrap gap-2">
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

      <div className="card">
        <h3 className="mt-0">
          {level} · {typeName} ({verbs.length})
        </h3>
        <p className="text-sm text-muted">Click a verb to see its conjugation</p>

        {!type
          ? Object.entries(TYPE_INFO).map(([tn, ti]) => {
              const group = verbs.filter((v) => v.type === tn)
              if (!group.length) return null
              return (
                <div key={tn}>
                  <h4 className="mt-3.5 mb-1.5 text-sm font-black" style={{ color: ti.color }}>
                    {ti.name} ({group.length})
                  </h4>
                  {group.map((v) => (
                    <VerbRow
                      key={v.inf}
                      verb={v}
                      known={knownSet.has(v.inf)}
                      onClick={() => onSelectVerb(v.inf)}
                    />
                  ))}
                </div>
              )
            })
          : verbs.map((v) => (
              <VerbRow
                key={v.inf}
                verb={v}
                known={knownSet.has(v.inf)}
                onClick={() => onSelectVerb(v.inf)}
              />
            ))}
      </div>
    </>
  )
}

function VerbRow({ verb, known, onClick }) {
  return (
    <div
      onClick={onClick}
      className="flex cursor-pointer gap-2.5 border-t border-surface-3 px-3.5 py-2 text-sm hover:bg-surface-2"
    >
      <span className="flex-1 font-bold">
        {verb.inf} {known && <span className="text-good">✓</span>}
      </span>
      <span className="text-xs text-muted">{verb.en}</span>
    </div>
  )
}
