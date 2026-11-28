import { Component } from 'react'

/**
 * ErrorBoundary — catches render errors inside the routed page and shows
 * a recovery card instead of a white screen.
 *
 * Class component on purpose: React only supports error boundaries via
 * the class lifecycle API (getDerivedStateFromError / componentDidCatch)
 * — there is no hook equivalent.
 *
 * Mounted in Layout AROUND <Outlet/> (below the navbar): a broken page
 * still leaves navigation usable. Errors thrown in event handlers or
 * async code are NOT caught by boundaries — that's React's documented
 * behaviour; the boundary covers render-phase crashes, which are the
 * white-screen class of failure.
 */
export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    // Full details for the developer console. This is also where a
    // reporting service (Sentry & friends) would be wired in later.
    console.error('UI error caught by boundary:', error, info?.componentStack)
  }

  render() {
    const { error } = this.state
    if (!error) return this.props.children

    return (
      <div className="card relative overflow-hidden p-10 text-center">
        {/* German flag stripe — consistent with every error card in the app */}
        <span className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,var(--color-flag-black)_0_33%,var(--color-flag-red)_33%_66%,var(--color-flag-gold)_66%_100%)]" />
        <div className="text-[48px]">🧭</div>
        <h2 className="mt-2 mb-1 text-xl font-black">Something went wrong</h2>
        <p className="m-0 text-sm text-muted">
          Your learning progress is saved — nothing was lost.
        </p>
        <p className="mx-auto mt-2 mb-5 max-w-[480px] font-mono text-xs break-words text-muted">
          {String(error?.message ?? error)}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            ↻ Reload page
          </button>
          <button className="btn btn-ghost" onClick={() => this.setState({ error: null })}>
            Try again
          </button>
        </div>
      </div>
    )
  }
}
