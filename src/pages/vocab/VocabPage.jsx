import { useState } from 'react'
import { WORDS } from '../../data/vocab'
import { STORIES } from '../../data/stories'
import { useVocabProgress } from '../../context/ProgressContext'
import Flashcards from './Flashcards'
import VocabQuiz from './VocabQuiz'
import Stories from './Stories'

/**
 * VocabPage — the vocabulary trainer shell with 4 tabs:
 *   Home       → stats, milestones, deck browser
 *   Flashcards → 3D flip cards with SRS-style grading
 *   Quiz       → generated MCQ (German→English and English→German)
 *   Stories    → reading comprehension with vocabulary highlighting
 */
export default function VocabPage() {
  const [view, setView] = useState('home')
  const [deck, setDeck] = useState(1)

  const { progress } = useVocabProgress()

  function startDeck(d) {
    setDeck(d)
    setView('flash')
    window.scrollTo(0, 0)
  }

  const tabs = [
    { id: 'home', label: 'Home', sub: `${progress.known.length}/${WORDS.length}` },
    { id: 'flash', label: 'Flashcards', sub: 'SRS' },
    { id: 'quiz', label: 'Quiz', sub: 'MCQ' },
    { id: 'story', label: 'Stories', sub: String(STORIES.length) },
  ]

  return (
    <>
      <div className="flex border-b-2 border-line">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setView(t.id)
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
        <HomeView progress={progress} onStartDeck={startDeck} onQuiz={() => setView('quiz')} />
      )}
      {view === 'flash' && (
        <Flashcards deck={deck} onDeckChange={startDeck} onQuiz={() => setView('quiz')} />
      )}
      {view === 'quiz' && <VocabQuiz progress={progress} />}
      {view === 'story' && <Stories progress={progress} />}
    </>
  )
}

/* ================= Home: stats + milestones + decks ================= */

/**
 * Milestones mirror the original app: reaching n known words unlocks the
 * badge; the first locked one is "current" and shows a progress bar.
 */
const MILESTONES = [
  { n: 50, name: 'First Words', icon: '🌱', desc: 'Learn your first 50 words' },
  { n: 100, name: 'Getting Started', icon: '📗', desc: '100 words — basic survival' },
  { n: 250, name: 'Foundation', icon: '📘', desc: '250 words — everyday topics' },
  { n: 500, name: 'Conversational', icon: '📙', desc: '500 words — hold a simple conversation' },
  { n: 1000, name: 'Intermediate', icon: '📕', desc: '1000 words — express opinions' },
  { n: 2000, name: 'Advanced', icon: '🎓', desc: '2000 words — read news, discuss topics' },
  { n: 3000, name: 'Master', icon: '👑', desc: '5000 words — near-fluent vocabulary' },
]

const DECK_SIZE = 50

function HomeView({ progress, onStartDeck, onQuiz }) {
  const known = progress.known.length
  const total = WORDS.length
  const pct = total ? Math.round((known / total) * 100) : 0
  const numDecks = Math.ceil(total / DECK_SIZE)
  const knownSet = new Set(progress.known)

  const stats = [
    { num: known, lbl: 'Known' },
    { num: total - known, lbl: 'To Learn' },
    { num: `${pct}%`, lbl: 'Progress' },
    { num: progress.scores.length, lbl: 'Quizzes' },
  ]

  return (
    <>
      <div className="mb-4 grid grid-cols-2 gap-2 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.lbl} className="rounded-xl border border-line bg-surface p-2.5 text-center">
            <div className="text-[22px] font-black text-primary">{s.num}</div>
            <div className="text-[10px] font-bold tracking-wider text-muted uppercase">{s.lbl}</div>
          </div>
        ))}
      </div>

      {/* Milestones */}
      <div className="card">
        <h3 className="mt-0">🏅 Milestones</h3>
        {MILESTONES.map((m) => {
          const unlocked = known >= m.n
          const current = !unlocked && MILESTONES.every((x) => x.n <= known || x === m) // first locked = current
          const barPct = Math.min(100, Math.round((known / m.n) * 100))
          return (
            <div
              key={m.n}
              className={`my-1.5 flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm ${
                unlocked
                  ? 'border border-gold-line bg-gold-soft text-gold-ink'
                  : current
                    ? 'border border-primary/20 bg-primary-soft'
                    : 'bg-surface-2 text-muted'
              }`}
            >
              <span className="text-xl">{m.icon}</span>
              <div className="flex-1">
                <b>{m.name}</b> — {m.desc}
                {current && (
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-3">
                    <i
                      className="block h-full rounded-full bg-good"
                      style={{ width: `${barPct}%` }}
                    />
                  </div>
                )}
              </div>
              {unlocked ? (
                <span className="font-black text-good">✓</span>
              ) : (
                <span className="text-xs text-muted">{m.n} words</span>
              )}
            </div>
          )
        })}
      </div>

      {/* Decks */}
      <div className="card">
        <h3 className="mt-0">📚 Decks</h3>
        {Array.from({ length: numDecks }, (_, i) => i + 1).map((d) => {
          const words = WORDS.filter((_, idx) => Math.floor(idx / DECK_SIZE) + 1 === d)
          if (!words.length) return null
          const k = words.filter((w) => knownSet.has(w[0])).length
          const p = Math.round((k / words.length) * 100)
          const cats = [...new Set(words.map((w) => w[5]))].join(', ')
          return (
            <div
              key={d}
              onClick={() => onStartDeck(d)}
              className="my-2 flex cursor-pointer items-center gap-3 rounded-xl border border-line bg-surface px-3.5 py-3 transition-all hover:border-primary hover:bg-primary-soft"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-flag-black font-mono text-[13px] font-extrabold text-gold">
                {d}
              </div>
              <div className="min-w-0 flex-1">
                <b className="text-sm">Deck {d}</b>
                <span className="block truncate text-[11.5px] text-muted">
                  {words.length} words · {cats}
                </span>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-3">
                  <i className="block h-full rounded-full bg-good" style={{ width: `${p}%` }} />
                </div>
              </div>
              <span className="text-[11px] font-extrabold text-good">
                {k}/{words.length}
              </span>
            </div>
          )
        })}
        <div className="mt-4 text-center">
          <button className="btn btn-primary" onClick={onQuiz}>
            Take a Quiz →
          </button>
        </div>
      </div>
    </>
  )
}
