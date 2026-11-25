import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * ProtectedRoute — renders its children only for signed-in users.
 * Visitors get redirected to /login; `state.from` preserves the URL they
 * wanted so the login page can send them back after success.
 *
 * While the initial session restore is still running we render nothing —
 * redirecting too early would wrongly bounce a returning user to /login.
 */
export default function ProtectedRoute() {
  const { user, initializing } = useAuth()
  const location = useLocation()

  if (initializing) return null
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return <Outlet />
}
