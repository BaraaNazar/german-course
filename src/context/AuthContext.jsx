import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { authService } from '../services/authService'

/**
 * AuthContext — provides the current user + auth actions to the whole tree.
 *
 * Flow:
 *  1. On mount, `fetchMe()` restores an existing session from localStorage
 *     (later: from an httpOnly cookie / JWT) so refreshes keep you logged in.
 *  2. `initializing` is true during that restore — gates that depend on auth
 *     render a neutral state instead of flashing "logged out" then "logged in".
 *  3. signUp/signIn/signOut wrap the service and only manage local state.
 *     All persistence details stay inside authService.
 */
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [initializing, setInitializing] = useState(true)

  useEffect(() => {
    let cancelled = false
    authService
      .fetchMe()
      .then((me) => {
        if (!cancelled) setUser(me)
      })
      .catch(() => {
        if (!cancelled) setUser(null)
      }) // session restore is best-effort
      .finally(() => {
        if (!cancelled) setInitializing(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const value = useMemo(
    () => ({
      user,
      initializing,

      async signUp(credentials) {
        const created = await authService.signUp(credentials)
        setUser(created)
        return created
      },

      async signIn(credentials) {
        const found = await authService.signIn(credentials)
        setUser(found)
        return found
      },

      async signOut() {
        await authService.signOut()
        setUser(null)
      },
    }),
    [user, initializing],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/** Hook version — throws when used outside the provider (fail fast). */
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
