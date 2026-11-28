import { describe, test, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ErrorBoundary from './ErrorBoundary'

/** A component that throws on render — simulates a page-level crash. */
function Bomb({ shouldThrow }) {
  if (shouldThrow) throw new Error('kaboom: simulated page crash')
  return <p>child rendered fine</p>
}

describe('ErrorBoundary (task C1)', () => {
  test('renders children when nothing throws', () => {
    render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>,
    )
    expect(screen.getByText('child rendered fine')).toBeTruthy()
  })

  test('catches a render crash and shows the recovery card', () => {
    // React logs caught errors via console.error — silence the noise.
    vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <ErrorBoundary>
        <Bomb shouldThrow />
      </ErrorBoundary>,
    )

    expect(screen.getByText('Something went wrong')).toBeTruthy()
    expect(screen.getByText(/kaboom: simulated page crash/)).toBeTruthy()
    expect(screen.getByRole('button', { name: /Reload page/ })).toBeTruthy()
    expect(screen.getByRole('button', { name: /Try again/ })).toBeTruthy()
  })

  test('Try again resets the boundary and re-renders children', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})

    // Child throws once, then stops throwing (simulating a retry).
    let throwOnce = true
    function FlakyBomb() {
      if (throwOnce) throw new Error('one-time crash')
      return <p>recovered</p>
    }

    render(
      <ErrorBoundary>
        <FlakyBomb />
      </ErrorBoundary>,
    )
    expect(screen.getByText('Something went wrong')).toBeTruthy()

    throwOnce = false
    fireEvent.click(screen.getByRole('button', { name: /Try again/ }))
    expect(screen.getByText('recovered')).toBeTruthy()
  })
})
