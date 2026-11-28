import { useMemo, useState } from 'react'
import { WORDS } from '../../data/vocab'
import { useVocabProgress } from '../../context/ProgressContext'
import SpeakButton from '../../components/SpeakButton'

/**
 * Flashcards — one deck at a time, 3D flip cards.
 *
 * Grading logic (same as the original trainer):
 *   Again → word is REMOVED from known (it will reappear in the next review)
 *   Hard  → no change
 *   Good / Easy → word is marked known
 *
 * A word graded "Again" is pushed to the END of the session queue so the
 * user sees it again this round — a lightweight SRS loop.
 */
export default function Flashcards({ deck, onDeckChange, onQuiz }) {
  const DECK_SIZE = 50

  // The session queue: words of the deck + re-queued "again" words.
  // Rebuilt whenever the deck changes.
  const baseWords = useMemo(
    () => WORDS.filter((_, i) => Math.floor(i / DECK_SIZE) + 1 === deck),
    [deck],
  )

  const [queue, setQueue] = useState(baseWords)
  const [pos, setPos] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [sessionDeck, setSessionDeck] = useState(deck)

  // Reset the session when the parent switches to a different deck.
  if (sessionDeck !== deck) {
    setSessionDeck(deck)
    setQueue(baseWords)
    setPos(0)
    setFlipped(false)
  }

  const { progress, markWordKnown } = useVocabProgress()
  const knownSet = useMemo(() => new Set(progress.known), [progress.known])

  const word = queue[pos]
  const total = queue.length

  function grade(g) {
    if (!word) return
    if (g === 'again') {
      markWordKnown(word[0], false)
      // Re-queue: copy-on-write keeps this cheap for 50-word decks.
      setQueue((q) => [...q, word])
    } else if (g === 'good' || g === 'easy') {
      markWordKnown(word[0], true)
    }
    setFlipped(false)
    setPos((p) => p + 1)
  }

  /* ---------- deck finished ---------- */
  if (pos >= total) {
    return (
      <div className="card p-10 text-center">
        <div className="text-[48px]">🎉</div>
        <h2>Deck {deck} Complete!</h2>
        <p className="text-muted">You reviewed all {total} words.</p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <button className="btn btn-primary" onClick={() => onDeckChange(deck)}>
            ↻ Restart Deck
          </button>
          {deck < Math.ceil(WORDS.length / DECK_SIZE) && (
            <button className="btn btn-good" onClick={() => onDeckChange(deck + 1)}>
              Next Deck →
            </button>
          )}
          <button className="btn btn-ghost" onClick={onQuiz}>
            Take Quiz
          </button>
        </div>
      </div>
    )
  }

  /* ---------- card ---------- */
  const isKnown = knownSet.has(word[0])

  return (
    <>
      <div className="text-center text-[13px] text-muted">
        Deck {deck} · Card {pos + 1}/{total} {isKnown && '· ✓ known'}
      </div>

      {/* Click anywhere on the card flips it (both faces) */}
      <div className={`fc-scene my-4 h-[280px] ${flipped ? 'fc-flipped' : ''}`}>
        <div className="fc-card" onClick={() => setFlipped((f) => !f)}>
          <div className="fc-face">
            <div className="text-[clamp(26px,6vw,36px)] font-black">{word[0]}</div>
            <div className="mt-3" onClick={(e) => e.stopPropagation()}>
              <SpeakButton text={word[0]} />
            </div>
          </div>
          <div className="fc-face fc-back">
            <div className="text-[clamp(26px,6vw,36px)] font-black">{word[0]}</div>
            <div className="mt-2.5 text-[clamp(18px,4vw,22px)] text-muted">{word[1]}</div>
            {word[2] && (
              <div className="mt-1.5 text-[13px] font-bold text-gold-ink">Plural: {word[2]}</div>
            )}
            {word[3] && (
              <div className="mt-4 max-w-[480px] rounded-[10px] bg-surface-2 px-4 py-2.5 text-sm text-muted">
                “{word[3]}”<br />
                <span className="text-xs">{word[4]}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <p className="text-center text-sm text-muted">Click card to flip</p>

      <div className="mt-4 grid grid-cols-2 gap-2.5 md:grid-cols-4">
        <button className="grade-btn g-again" onClick={() => grade('again')}>
          Again<small>don’t know</small>
        </button>
        <button className="grade-btn g-hard" onClick={() => grade('hard')}>
          Hard<small>so-so</small>
        </button>
        <button className="grade-btn g-good" onClick={() => grade('good')}>
          Good<small>knew it</small>
        </button>
        <button className="grade-btn g-easy" onClick={() => grade('easy')}>
          Easy<small>easy!</small>
        </button>
      </div>
    </>
  )
}
