import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

// One shared design system for the whole platform: Tailwind v4 with the
// platform's design tokens declared as theme utilities (src/styles.css).
import './styles.css'

/* SPA routing on GitHub Pages:
   deep links like /vocab are intercepted by public/404.html, which
   re-enters the app as /?route=vocab. We lift that param into the
   real pathname BEFORE the router mounts, so the URL bar and history
   look identical to a direct visit. */
const route = new URLSearchParams(window.location.search).get('route')
if (route) {
  const clean = `${import.meta.env.BASE_URL}${route.replace(/^\/+/, '')}`
  window.history.replaceState(null, '', clean)
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
