import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/authService'
import AuthShell from '../components/AuthShell'

/**
 * Login — email + password form.
 * On success the user is sent to the page they originally wanted
 * (`state.from`, set by ProtectedRoute) or back to the home hub.
 * A banner is shown after a successful password reset (`state.message`).
 */
export default function Login() {
  return <AuthForm mode="login" />
}

/**
 * Signup — name + email + password form.
 * Both pages share AuthForm because the fields, validation and error
 * handling are identical apart from the submitted action.
 */
export function Signup() {
  return <AuthForm mode="signup" />
}

function AuthForm({ mode }) {
  const isLogin = mode === 'login'
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  function update(field) {
    return (e) => {
      setForm((f) => ({ ...f, [field]: e.target.value }))
      setError('')
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (busy) return
    setBusy(true)
    setError('')
    try {
      const action = isLogin ? signIn : signUp
      await action(form)
      // Return the user to where they were heading before the auth wall.
      navigate(location.state?.from ?? '/', { replace: true })
    } catch (err) {
      // authService throws AuthError with a human-readable message.
      setError(
        err instanceof authService.AuthError
          ? err.message
          : 'Something went wrong. Please try again.',
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthShell
      emoji={isLogin ? '🔑' : '🇩🇪'}
      title={isLogin ? 'Welcome back' : 'Create your account'}
      subtitle={
        isLogin
          ? 'Log in to keep your learning progress across visits.'
          : 'Track your vocabulary and verb progress on this device.'
      }
    >
      {/* Banner shown right after a successful password reset. */}
      {location.state?.message && (
        <div className="feedback ok mb-4">
          <div className="fb-title">✓ {location.state.message}</div>
        </div>
      )}

      <form className="card" onSubmit={handleSubmit} noValidate>
        {!isLogin && (
          <label className="field">
            <span>Name</span>
            <input
              type="text"
              value={form.name}
              onChange={update('name')}
              placeholder="Baraa Nazar"
              autoComplete="name"
              autoFocus
            />
          </label>
        )}
        <label className="field">
          <span>Email</span>
          <input
            type="email"
            value={form.email}
            onChange={update('email')}
            placeholder="you@example.com"
            autoComplete="email"
            autoFocus={isLogin}
          />
        </label>
        <label className="field">
          <span>Password</span>
          <input
            type="password"
            value={form.password}
            onChange={update('password')}
            placeholder="At least 6 characters"
            autoComplete={isLogin ? 'current-password' : 'new-password'}
          />
        </label>

        {isLogin && (
          <div className="-mt-2 mb-4 text-right">
            <Link to="/forgot-password" className="text-sm font-bold text-primary">
              Forgot password?
            </Link>
          </div>
        )}

        {error && (
          <div className="feedback bad">
            <div className="fb-title">{error}</div>
          </div>
        )}

        <button className="btn btn-primary btn-lg w-full" type="submit" disabled={busy}>
          {busy ? 'Please wait …' : isLogin ? 'Log In' : 'Sign Up'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm">
        {isLogin ? (
          <>
            New here?{' '}
            <Link to="/signup" className="font-bold text-primary">
              Create an account
            </Link>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-primary">
              Log in
            </Link>
          </>
        )}
      </p>
    </AuthShell>
  )
}
