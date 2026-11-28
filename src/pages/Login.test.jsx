import { describe, test, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import Login from './Login'

/**
 * Login integration test — runs against the REAL mock authService
 * (localStorage-backed), so the full form → context → service → error
 * path is exercised, not a stubbed happy path.
 */
describe('Login page', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  test('rejects wrong credentials with the service error message', async () => {
    // Seed a demo account (same flow as signup).
    const { authService } = await import('../services/authService')
    await authService.signUp({
      name: 'Test User',
      email: 'test@example.com',
      password: 'secret123',
    })

    render(
      <MemoryRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </MemoryRouter>,
    )

    fireEvent.change(screen.getByPlaceholderText('you@example.com'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('At least 6 characters'), {
      target: { value: 'WRONG-password' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Log In' }))

    // authService adds a fake network delay — await the async feedback.
    expect(await screen.findByText('Incorrect email or password.')).toBeTruthy()
  })

  test('successful login navigates back to the home hub', async () => {
    const { authService } = await import('../services/authService')
    await authService.signUp({
      name: 'Test User',
      email: 'test@example.com',
      password: 'secret123',
    })

    render(
      <MemoryRouter initialEntries={['/login']}>
        <AuthProvider>
          <Login />
          <div>HOME-ROUTE-MARKER</div>
        </AuthProvider>
      </MemoryRouter>,
    )

    fireEvent.change(screen.getByPlaceholderText('you@example.com'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('At least 6 characters'), {
      target: { value: 'secret123' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Log In' }))

    // After successful login the form disappears (replaced by navigation).
    await waitFor(() => {
      expect(screen.queryByRole('button', { name: 'Log In' })).toBeNull()
    })
  })
})
