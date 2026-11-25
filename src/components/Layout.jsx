import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { staticUrl } from '../utils/paths'

/**
 * Layout — the shared shell (topbar + routed page).
 * The navbar reacts to auth state: signed-out visitors get Login/Signup,
 * signed-in users get their name, the profile page and a logout action.
 */
export default function Layout() {
  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-[960px] px-4 pb-20 pt-6">
        <Outlet />
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
  const navLinkBase =
    'rounded-lg px-2.5 py-1.5 text-[13.5px] font-bold no-underline transition-colors'
  const linkClass = ({ isActive }) =>
    `${navLinkBase} ${isActive ? 'bg-primary-soft text-primary' : 'text-muted hover:text-ink'}`

  return (
    <div className="topbar">
      <div className="row">
        {/* Brand = pill + title grouped as ONE flex item, so
            justify-between spreads [brand … nav] instead of leaving the
            title floating centered between pill and nav. */}
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="lv-pill">DE</span>
          <Link to="/" className="crumb">
            <b>Deutschkurs</b> · A1 → C2
          </Link>
        </div>

        <nav className="flex flex-wrap items-center gap-1.5">
          <NavLink to="/" end className={linkClass}>Home</NavLink>
          <NavLink to="/konjugation" className={linkClass}>Konjugation</NavLink>
          <NavLink to="/vocab" className={linkClass}>Vocab</NavLink>
          {/* Secondary links hidden on phones to keep the bar compact.
              staticUrl() makes these absolute — plain relative hrefs would
              break whenever the navbar renders on a sub-route. */}
          <a href={staticUrl('hybrid/index.html')} className={`${navLinkBase} hidden text-muted hover:text-ink sm:inline-block`}>
            Lessons
          </a>
          <a href={staticUrl('resources.html')} className={`${navLinkBase} hidden text-muted hover:text-ink sm:inline-block`}>
            Resources
          </a>
          {user ? (
            <>
              <NavLink
                to="/profile"
                className={`${navLinkBase} font-extrabold text-primary hover:bg-primary-soft`}
              >
                👤 {user.name.split(' ')[0]}
              </NavLink>
              <button className="btn btn-ghost btn-sm" onClick={handleSignOut}>Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="btn btn-ghost btn-sm no-underline">Login</NavLink>
              <NavLink to="/signup" className="btn btn-primary btn-sm no-underline">Sign Up</NavLink>
            </>
          )}
        </nav>
      </div>
      <div className="h-1 overflow-hidden rounded-pill bg-surface-3">
        <i className="block h-full w-full bg-gold/60" />
      </div>
    </div>
  )
}
