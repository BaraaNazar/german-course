/**
 * authService — the ONLY module that knows how users are authenticated.
 *
 * ⚠️ MOCK BACKEND ⚠️
 * This implementation simulates a REST API entirely in localStorage so the
 * signup/login flow can be built and tested before the real backend exists.
 *
 * The function signatures deliberately mirror what a real API will look like:
 *
 *   signUp(...)  →  POST /api/auth/signup   { name, email, password }
 *   signIn(...)  →  POST /api/auth/login    { email, password }
 *   signOut()    →  POST /api/auth/logout
 *   fetchMe()    →  GET  /api/auth/me       (session restore on page load)
 *
 * WHEN THE BACKEND IS READY, replace the bodies with `fetch` calls —
 * no component or context needs to change, because everything above this
 * layer only depends on these four functions and the shapes they return.
 *
 * Security notes for the demo:
 * - Passwords are stored *transformed*, never in plain text (see `hash`).
 *   Real hashing (bcrypt/argon2, salted, server-side) is a backend job —
 *   this is only to avoid storing readable passwords in the browser.
 * - Sessions carry an expiry timestamp and are validated on every fetchMe().
 */

const USERS_KEY = 'gc_users'      // demo "user database"
const SESSION_KEY = 'gc_session'  // active session (token + expiry)
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000 // 7 days
const FAKE_LATENCY_MS = 450 // mimic network round-trip so UI loading states are realistic

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Demo-grade password transform.
 * NOT cryptographically secure (it is reversible) — it exists only so a
 * passers-by peeking at localStorage does not see plain passwords.
 * The real backend will hash properly with bcrypt/argon2.
 */
function hash(password) {
  return btoa(unescape(encodeURIComponent(`gc::${password}`)))
}

const readJSON = key => {
  try { return JSON.parse(window.localStorage.getItem(key) ?? 'null') } catch { return null }
}
const writeJSON = (key, value) => window.localStorage.setItem(key, JSON.stringify(value))

const isValidEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

class AuthError extends Error {
  constructor(message, code) {
    super(message)
    this.code = code // machine-readable, e.g. 'EMAIL_TAKEN' — lets the UI show precise messages
  }
}

/** @returns {Promise<{id,name,email}>} */
async function signUp({ name, email, password }) {
  await delay(FAKE_LATENCY_MS)

  name = (name ?? '').trim()
  email = (email ?? '').trim().toLowerCase()

  if (name.length < 2) throw new AuthError('Please enter your name (at least 2 characters).', 'NAME_SHORT')
  if (!isValidEmail(email)) throw new AuthError('Please enter a valid email address.', 'EMAIL_INVALID')
  if (password.length < 6) throw new AuthError('Password must be at least 6 characters.', 'PASSWORD_SHORT')

  const users = readJSON(USERS_KEY) ?? []
  if (users.some(u => u.email === email)) {
    throw new AuthError('An account with this email already exists. Try logging in instead.', 'EMAIL_TAKEN')
  }

  const user = {
    id: crypto.randomUUID(),
    name,
    email,
    passwordHash: hash(password),
    createdAt: new Date().toISOString(),
  }
  writeJSON(USERS_KEY, [...users, user])

  return createSession(user)
}

/** @returns {Promise<{id,name,email}>} */
async function signIn({ email, password }) {
  await delay(FAKE_LATENCY_MS)

  email = (email ?? '').trim().toLowerCase()
  const users = readJSON(US_KEY_SAFE()) ?? []
  const user = users.find(u => u.email === email)

  // Same generic message for "no such user" and "wrong password" so the
  // login form does not leak which emails are registered.
  if (!user || user.passwordHash !== hash(password)) {
    throw new AuthError('Incorrect email or password.', 'BAD_CREDENTIALS')
  }

  return createSession(user)
}

async function signOut() {
  await delay(FAKE_LATENCY_MS)
  window.localStorage.removeItem(SESSION_KEY)
}

/**
 * Session restore (called once on app start).
 * @returns {Promise<{id,name,email}|null>} the user, or null when no valid session
 */
async function fetchMe() {
  await delay(FAKE_LATENCY_MS)

  const session = readJSON(SESSION_KEY)
  if (!session) return null

  // Expired session → clean it up so we do not keep stale data around.
  if (Date.now() > session.expiresAt) {
    window.localStorage.removeItem(SESSION_KEY)
    return null
  }

  const user = (readJSON(US_KEY_SAFE()) ?? []).find(u => u.id === session.userId)
  return user ? { id: user.id, name: user.name, email: user.email } : null
}

// ---- internals ----

const US_KEY_SAFE = () => USERS_KEY

function createSession(user) {
  const session = {
    token: crypto.randomUUID(),
    userId: user.id,
    expiresAt: Date.now() + SESSION_TTL_MS,
  }
  writeJSON(SESSION_KEY, session)
  // Never expose the password hash (or the hash itself) beyond this layer.
  return { id: user.id, name: user.name, email: user.email }
}

export const authService = { signUp, signIn, signOut, fetchMe, AuthError }
