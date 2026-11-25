import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/authService'

/**
 * Login — email + password form.
 * On success the user is sent to the page they originally wanted
 * (`state.from`, set by ProtectedRoute) or back to the home hub.
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
    return e => {
      setForm(f => ({ ...f, [field]: e.target.value }))
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
      setError(err instanceof authService.AuthError ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto mt-8 max-w-[420px]">
      <div className="mb-6 text-center">
        <div className="text-[40px]">{isLogin ? '🔑' : '🇩🇪'}</div>
        <h1 className="mt-2 mb-1 text-2xl font-black">
          {isLogin ? 'Welcome back' : 'Create your account'}
        </h1>
        <p className="m-0 text-sm text-muted">
          {isLogin
            ? 'Log in to keep your learning progress across visits.'
            : 'Track your vocabulary and verb progress on this device.'}
        </p>
      </div>

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
          <>New here? <Link to="/signup" className="font-bold text-primary">Create an account</Link></>
        ) : (
          <>Already have an account? <Link to="/login" className="font-bold text-primary">Log in</Link></>
        )}
      </p>

      <p className="mt-3.5 rounded-[10px] border border-gold-line bg-gold-soft px-3.5 py-2.5 text-[12.5px] leading-relaxed text-muted">
        ℹ️ Demo mode: accounts live in this browser (localStorage). When the
        backend goes online, existing accounts will be migrated — your
        learning progress is saved locally either way.
      </p>
    </div>
  )
}
