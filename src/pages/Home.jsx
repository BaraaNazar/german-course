import { Link } from 'react-router-dom'
import { WORDS } from '../data/vocab'
import { VERBS } from '../data/verbs'
import { STORIES } from '../data/stories'
import { useAuth } from '../context/AuthContext'
import { useConjugationProgress, useVocabProgress } from '../context/ProgressContext'
import { staticUrl } from '../utils/paths'

/**
 * Home — the hub. Shows live stats (from the actual data modules, not
 * hardcoded numbers) and the six learning tracks.
 *
 * The three lesson tracks (Kursraum / Textkurs / Hybrid) and Pimsleur are
 * static pages in /public — plain <a> tags give a full-page navigation,
 * which is the right behaviour for 1,500+ content pages.
 */
export default function Home() {
  const { user } = useAuth()
  const { progress: conj } = useConjugationProgress()
  const { progress: vocab } = useVocabProgress()

  const stats = [
    { num: WORDS.length.toLocaleString(), lbl: 'Words' },
    { num: VERBS.length, lbl: 'Verbs' },
    { num: STORIES.length, lbl: 'Stories' },
    { num: 5, lbl: 'Tracks' },
  ]

  return (
    <>
      <div className="my-5 mb-7 text-center">
        <h1 className="m-0 mb-1.5 text-[clamp(26px,5vw,36px)] font-black">
          🇩🇪 Dein Deutsch-Workspace
        </h1>
        <p className="m-0 text-[15px] text-muted">
          Five tracks, one goal: genuine communication from A1 to C2
          {user && <> — welcome back, {user.name.split(' ')[0]}!</>}
        </p>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-2.5 md:grid-cols-4">
        {stats.map(s => <StatCard key={s.lbl} {...s} />)}
      </div>

      {(vocab.known.length > 0 || conj.known.length > 0) && (
        <div className="card mb-5">
          <h3 className="mb-3 text-[15px] font-extrabold uppercase tracking-wider text-muted">
            Your Progress
          </h3>
          <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
            <StatCard num={vocab.known.length} lbl="Words Known" />
            <StatCard num={conj.known.length} lbl="Verbs Mastered" />
            <StatCard num={vocab.scores.length + conj.scores.length} lbl="Quizzes Taken" />
            <StatCard num={`${Math.round(vocab.known.length / WORDS.length * 100)}%`} lbl="Vocab Progress" />
          </div>
        </div>
      )}

      <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
        <TrackCard
          to={staticUrl('hybrid/index.html')} icon="⚡" title="Hybrid" badge="Recommended"
          desc="Audio + instant-feedback exercises + bilingual grammar with Mermaid diagrams. The complete package."
          tags={[['Interactive', 'primary'], ['498 lessons', 'muted']]}
        />
        <TrackCard
          to="/vocab" icon="🧠" title="Vocab Trainer" reactRoute
          desc={`${WORDS.length.toLocaleString()} words with flashcards, MCQ quizzes, and ${STORIES.length} reading comprehension stories.`}
          tags={[['Flashcards', 'primary'], [`${WORDS.length.toLocaleString()} words`, 'muted']]}
        />
        <TrackCard
          to="/konjugation" icon="🔀" title="Konjugation" reactRoute
          desc={`${VERBS.length} verbs across all 7 types. Präsens, Präteritum, Perfekt with color-coded endings. MCQ + type-in quizzes.`}
          tags={[['Interactive', 'primary'], [`${VERBS.length} verbs`, 'muted']]}
        />
        <TrackCard
          to={staticUrl('textkurs/index.html')} icon="📖" title="Textkurs"
          desc="Print-friendly text lessons. Bilingual A1–A2, increasingly German B1+. Works fully offline."
          tags={[['Text-based', 'gold'], ['498 lessons', 'muted']]}
        />
        <TrackCard
          to={staticUrl('kursraum/index.html')} icon="🏛️" title="Kursraum"
          desc="Interactive browser lessons with audio, quizzes, and flashcards. German-first from B1."
          tags={[['Interactive', 'primary'], ['498 lessons', 'muted']]}
        />
        <TrackCard
          to={staticUrl('pimsleur/index.html')} icon="🎧" title="Pimsleur-Style"
          desc="Audio-first, anticipation-driven. Max 5 new words per lesson. Grammar absorbed through patterns."
          tags={[['Audio-first', 'dark'], ['5 lessons', 'muted']]}
        />
      </div>

      <div className="card">
        <h3 className="mb-3 text-[15px] font-extrabold uppercase tracking-wider text-muted">Quick Links</h3>
        <div className="flex flex-wrap gap-2">
          <QuickLink href={staticUrl('about.html')}>🎯 About</QuickLink>
          <QuickLink href={staticUrl('resources.html')}>📚 Resources</QuickLink>
          <QuickLink to="/konjugation">🔀 Konjugation</QuickLink>
          <QuickLink to="/vocab">🧠 Vocab Trainer</QuickLink>
          <QuickLink href={staticUrl('hybrid/H-A1-M1-U1-L1.html')}>⚡ Start Lesson 1</QuickLink>
          {!user && <QuickLink to="/signup">👤 Create Account</QuickLink>}
        </div>
      </div>
    </>
  )
}

function StatCard({ num, lbl }) {
  return (
    <div className="rounded-xl border border-line bg-surface p-3 text-center">
      <div className="text-[22px] font-black text-primary">{num}</div>
      <div className="mt-0.5 text-[10.5px] font-bold uppercase tracking-wider text-muted">{lbl}</div>
    </div>
  )
}

const TAG_STYLES = {
  primary: 'bg-primary-soft text-primary-dark',
  gold: 'bg-gold-soft text-gold-ink border border-gold-line',
  dark: 'bg-flag-black text-gold',
  muted: 'bg-surface-3 text-muted',
}

/**
 * A track card. `reactRoute` → SPA navigation;
 * otherwise a static /public page (full page load).
 */
function TrackCard({ to, icon, title, badge, desc, tags, reactRoute }) {
  const inner = (
    <>
      {/* German flag stripe across the top of every card */}
      <span className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,var(--color-flag-black)_0_33%,var(--color-flag-red)_33%_66%,var(--color-flag-gold)_66%_100%)]" />
      <div className="mb-2.5 flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-surface-2 text-[28px]">
          {icon}
        </span>
        <h2 className="m-0 flex-1 text-[17px] leading-tight font-extrabold">
          {title}{' '}
          {badge && <span className="text-[13px] font-normal text-muted">{badge}</span>}
        </h2>
      </div>
      <p className="mb-3.5 flex-1 text-[13.5px] leading-relaxed text-muted">{desc}</p>
      <div className="mt-auto flex flex-wrap items-center gap-1.5">
        {tags.map(([label, cls]) => (
          <span key={label} className={`rounded-md px-2.5 py-[3px] text-[11px] font-extrabold tracking-wide uppercase whitespace-nowrap ${TAG_STYLES[cls]}`}>
            {label}
          </span>
        ))}
      </div>
    </>
  )
  const cls =
    'relative flex flex-col overflow-hidden rounded-2xl border-[1.5px] border-line bg-surface p-[22px] no-underline text-ink shadow-1 transition-colors hover:border-primary'
  return reactRoute
    ? <Link className={cls} to={to}>{inner}</Link>
    : <a className={cls} href={to}>{inner}</a>
}

function QuickLink({ href, to, children }) {
  const cls =
    'inline-flex items-center gap-1.5 rounded-[10px] border border-line bg-surface-2 px-4 py-2 text-[13.5px] font-bold text-ink no-underline transition-all hover:border-primary hover:text-primary'
  return href
    ? <a href={href} className={cls}>{children}</a>
    : <Link to={to} className={cls}>{children}</Link>
}
