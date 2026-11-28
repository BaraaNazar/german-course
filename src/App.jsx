import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProgressProvider } from './context/ProgressContext'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import SignupPage from './pages/Signup'
import Profile from './pages/Profile'
import ConjugationPage from './pages/conjugation/ConjugationPage'
import VocabPage from './pages/vocab/VocabPage'

/**
 * App — route table.
 *
 * Public:  /, /login, /signup, /konjugation, /vocab
 * Private: /profile (anything that later depends on a user account)
 *
 * The lesson tracks (kursraum/, textkurs/, hybrid/, pimsleur/) are 1,500+
 * pre-built static pages in /public — they are linked from Home and served
 * directly by GitHub Pages instead of being routed through React.
 */
export default function App() {
  return (
    <AuthProvider>
      {/* ProgressProvider: single writer for both progress documents */}
      <ProgressProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<SignupPage />} />
            <Route path="konjugation" element={<ConjugationPage />} />
            <Route path="vocab" element={<VocabPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="profile" element={<Profile />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </ProgressProvider>
    </AuthProvider>
  )
}

function NotFound() {
  return (
    <div className="card p-15 text-center">
      <div className="text-[48px]">🧭</div>
      <h2>Page not found</h2>
      <p className="text-muted">This page does not exist (yet).</p>
    </div>
  )
}
