import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

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

  const linkClass = ({ isActive }) =>
    `rounded-lg px-2.5 py-1.5 text-[13.5px] font-bold no-underline transition-colors ${
      isActive ? 'bg-primary-soft text-primary' : 'text-muted hover:text-ink'
    }`

  return (
    <div className="topbar">
      <div className="row">
        <span className="lv-pill">DE</span>
        <Link to="/" className="crumb">
          <b>Deutschkurs</b> · A1 → C2
        </Link>
        <nav className="flex flex-wrap items-center gap-1.5">
          <NavLink to="/" end className={linkClass}>Home</NavLink>
          <NavLink to="/konjugation" className={linkClass}>Konjugation</NavLink>
          <NavLink to="/vocab" className={linkClass}>Vocab</NavLink>
          <a href="hybrid/index.html" className={linkClass({ isActive: false })}>Lessons</a>
          <a href="resources.html" className={linkClass({ isActive: false })}>Resources</a>
          {user ? (
            <>
              <NavLink to="/profile" className={`${linkClass} !text-primary`}>
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
      <div className="h-1 rounded-pill bg-surface-3 overflow-hidden">
        <i className="block h-full w-full bg-gold/60" />
      </div>
    </div>
  )
}
