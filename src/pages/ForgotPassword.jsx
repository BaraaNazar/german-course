import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'
import AuthShell from '../components/AuthShell'

/**
 * ForgotPassword — step 1 of the reset flow.
 * The user submits an email; the service issues a one-time token.
 *
 * The confirmation screen deliberately shows the same neutral message
 * whether or not the email is registered (so the page can't be used to
 * probe for accounts). In demo mode only, a registered email also gets
 * a direct "continue" link because no real email can be sent.
 */
export default function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(null) // { resetPath } once submitted

  async function handleSubmit(e) {
    e.preventDefault()
    if (busy) return
    setBusy(true)
    setError('')
    try {
      const result = await authService.requestPasswordReset({ email })
      setSent({ resetPath: result.resetPath })
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  if (sent) {
    return (
      <AuthShell
        emoji="📧"
        title="Check your inbox"
        subtitle="If an account exists for this email, a reset link is on its way."
      >
        <div className="card text-center">
          {sent.resetPath ? (
            <>
              <p className="m-0 mb-4 text-sm text-muted">
                <b>Demo shortcut:</b> there is no mail server in demo mode, so your one-time link is
                right here (valid 15 minutes):
              </p>
              <button
                className="btn btn-primary btn-lg w-full"
                onClick={() => navigate(sent.resetPath)}
              >
                Set a new password →
              </button>
            </>
          ) : (
            <p className="m-0 text-sm text-muted">
              Didn’t get a link? Double-check the email address — the message looks the same for
              unknown addresses on purpose.
            </p>
          )}
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
      emoji="🔑"
      title="Forgot your password?"
      subtitle="Enter your account email and we'll send a reset link."
    >
      <form className="card" onSubmit={handleSubmit} noValidate>
        <label className="field">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setError('')
            }}
            placeholder="you@example.com"
            autoComplete="email"
            autoFocus
          />
        </label>

        {error && (
          <div className="feedback bad">
            <div className="fb-title">{error}</div>
          </div>
        )}

        <button className="btn btn-primary btn-lg w-full" type="submit" disabled={busy}>
          {busy ? 'Please wait …' : 'Send reset link'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm">
        Remembered it?{' '}
        <Link to="/login" className="font-bold text-primary">
          Log in
        </Link>
      </p>
    </AuthShell>
  )
}
