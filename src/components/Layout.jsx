import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { staticUrl } from '../utils/paths'
import ErrorBoundary from './ErrorBoundary'

/**
 * Layout — the shared shell (topbar + routed page).
 * The navbar reacts to auth state: signed-out visitors get Login/Signup,
 * signed-in users get their name, the profile page and a logout action.
 * The ErrorBoundary wraps only the routed page: if a page crashes, the
 * navbar (and navigation) keeps working (task C1).
 */
export default function Layout() {
  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-[960px] px-4 pb-20 pt-6">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
    </>
  )
}

function Navbar() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  // Shared look for every nav entry; NavLink toggles the active state.
  // py-2 keeps tap targets comfortably above the 32px touch minimum.
  const navLinkBase =
    'shrink-0 rounded-lg px-3 py-2 text-sm font-bold no-underline transition-colors'
  const linkClass = ({ isActive }) =>
    `${navLinkBase} ${isActive ? 'bg-primary-soft text-primary' : 'text-muted hover:bg-surface-2 hover:text-ink'}`

  const staticLink = `${navLinkBase} text-muted no-underline hover:bg-surface-2 hover:text-ink`

  return (
    <header className="topbar">
      {/* Stacks on phones (brand row above nav row), single row from md up.
          The brand is one grouped flex item so justify-between spreads
          [brand ……… nav] instead of leaving the title floating centered. */}
      <div className="flex flex-col gap-1.5 md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="lv-pill">DE</span>
          <Link to="/" className="crumb">
            <b>Deutschkurs</b> · A1 → C2
          </Link>
        </div>

        {/* Never wraps into multiple lines: on small screens the nav swipes
            horizontally (.nav-scroll hides the scrollbar). Secondary links
            are hidden below sm to keep the primary set compact. */}
        <nav
          className="nav-scroll -mx-1 flex items-center gap-0.5 overflow-x-auto px-1 py-0.5"
          aria-label="Main navigation"
        >
          <NavLink to="/" end className={linkClass}>Home</NavLink>
          <NavLink to="/konjugation" className={linkClass}>Konjugation</NavLink>
          <NavLink to="/vocab" className={linkClass}>Vocab</NavLink>
          {/* staticUrl() makes these absolute — plain relative hrefs would
              break whenever the navbar renders on a sub-route. */}
          <a href={staticUrl('hybrid/index.html')} className={`${staticLink} hidden sm:block`}>
            Lessons
          </a>
          <a href={staticUrl('resources.html')} className={`${staticLink} hidden sm:block`}>
            Resources
          </a>

          <span className="mx-1 hidden h-6 w-px shrink-0 bg-line md:block" aria-hidden="true" />

          {user ? (
            <>
              <NavLink
                to="/profile"
                className={`${navLinkBase} font-extrabold text-primary no-underline hover:bg-primary-soft`}
              >
                👤 {user.name.split(' ')[0]}
              </NavLink>
              <button className="btn btn-ghost btn-sm shrink-0" onClick={handleSignOut}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="btn btn-ghost btn-sm no-underline shrink-0">Login</NavLink>
              <NavLink to="/signup" className="btn btn-primary btn-sm no-underline shrink-0">Sign Up</NavLink>
            </>
          )}
        </nav>
      </div>
      {/* The tricolor line at the very bottom of this bar is the German
          flag stripe (.topbar::after in styles.css) — the platform's brand
          signature, identical on every lesson page. No other decoration. */}
    </header>
  )
}
