import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { authService } from '../services/authService'
import AuthShell from '../components/AuthShell'

/**
 * ResetPassword — step 2 of the reset flow.
 * Opened from the one-time link: /reset-password?token=…
 *
 * The token is validated on mount (via the service) so invalid or
 * expired links fail BEFORE the user types a new password. The form
 * re-validates at submit time because tokens can expire while the
 * page is open.
 */
export default function ResetPassword() {
  const [params] = useSearchParams()
  const token = params.get('token') ?? ''
  const navigate = useNavigate()

  // No token in the URL = someone typed the address by hand — start
  // directly at the error screen (derived state, no effect needed).
  const [phase, setPhase] = useState(token ? 'checking' : 'invalid')
  const [expired, setExpired] = useState(false)

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let cancelled = false
    authService.validateResetToken(token).then((result) => {
      if (cancelled) return
      if (result.valid) setPhase('ready')
      else {
        setExpired(result.expired)
        setPhase('invalid')
      }
    })
    return () => {
      cancelled = true
    }
  }, [token])

  async function handleSubmit(e) {
    e.preventDefault()
    if (busy) return
    setError('')

    // Client-side checks give instant feedback; the service re-checks
    // the authoritative rules (length) and the token itself.
    if (password !== confirm) {
      setError('The passwords do not match.')
      return
    }

    setBusy(true)
    try {
      await authService.resetPassword({ token, password })
      // Back to login, with a banner explaining the next step.
      navigate('/login', {
        replace: true,
        state: { message: 'Password updated — please log in with your new password.' },
      })
    } catch (err) {
      setError(
        err instanceof authService.AuthError
          ? err.message
          : 'Something went wrong. Please try again.',
      )
      // An invalid/expired token at submit time → swap to the error screen.
      if (err?.code === 'RESET_INVALID' || err?.code === 'RESET_EXPIRED') {
        setExpired(err.code === 'RESET_EXPIRED')
        setPhase('invalid')
      }
    } finally {
      setBusy(false)
    }
  }

  if (phase === 'checking') {
    return (
      <AuthShell
        emoji="⏳"
        title="Checking your link…"
        subtitle="Verifying the reset token"
        note={false}
      >
        <div className="card center text-center text-muted">Validating…</div>
      </AuthShell>
    )
  }

  if (phase === 'invalid') {
    return (
      <AuthShell
        emoji="⚠️"
        title={expired ? 'Link expired' : 'Link not valid'}
        subtitle={
          expired
            ? 'Reset links are only valid for 15 minutes.'
            : 'This reset link was already used or never existed.'
        }
      >
        <div className="card text-center">
          <Link to="/forgot-password" className="btn btn-primary btn-lg w-full">
            Request a new link
          </Link>
          <p className="m-0 mt-4">
            <Link to="/login" className="text-sm font-bold text-primary">
              ← Back to login
            </Link>
          </p>
        </div>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      emoji="🔐"
      title="Set a new password"
      subtitle="Choose a password you don't use anywhere else."
    >
      <form className="card" onSubmit={handleSubmit} noValidate>
        <label className="field">
          <span>New password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setError('')
            }}
            placeholder="At least 6 characters"
            autoComplete="new-password"
            autoFocus
          />
        </label>
        <label className="field">
          <span>Confirm password</span>
          <input
            type="password"
            value={confirm}
            onChange={(e) => {
              setConfirm(e.target.value)
              setError('')
            }}
            placeholder="Repeat the new password"
            autoComplete="new-password"
          />
        </label>

        {error && (
          <div className="feedback bad">
            <div className="fb-title">{error}</div>
          </div>
        )}

        <button className="btn btn-primary btn-lg w-full" type="submit" disabled={busy}>
          {busy ? 'Please wait …' : 'Save new password'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm">
        Changed your mind?{' '}
        <Link to="/login" className="font-bold text-primary">
          Log in
        </Link>
      </p>
    </AuthShell>
  )
}
