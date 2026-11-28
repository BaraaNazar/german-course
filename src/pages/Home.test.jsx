import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import { ProgressProvider } from '../context/ProgressContext'
import Home from './Home'

/**
 * Smoke tests: the page renders inside its real providers with the real
 * (heavy) data modules. Catches import errors, hook misuse, and render
 * crashes — the classes of failure that would otherwise white-screen.
 */
describe('Home page', () => {
  test('renders the hero and track cards', async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <ProgressProvider>
            <Home />
          </ProgressProvider>
        </AuthProvider>
      </MemoryRouter>,
    )

    // AuthProvider resolves fetchMe asynchronously — await async content.
    expect(await screen.findByText(/Dein Deutsch-Workspace/)).toBeTruthy()
    expect(screen.getByText('Vocab Trainer')).toBeTruthy()
    expect(screen.getByText('Konjugation')).toBeTruthy()
    expect(screen.getByText('Hybrid')).toBeTruthy()
    expect(screen.getByText('Pimsleur-Style')).toBeTruthy()
  })

  test('shows live stats from the data modules, not hardcoded numbers', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <ProgressProvider>
            <Home />
          </ProgressProvider>
        </AuthProvider>
      </MemoryRouter>,
    )
    // WORDS.length is 5,000 → formatted "5,000"
    expect(screen.getByText('5,000')).toBeTruthy()
    expect(screen.getByText('Words')).toBeTruthy()
    expect(screen.getByText('Verbs')).toBeTruthy()
  })
})
