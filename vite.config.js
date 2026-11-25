import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const root = dirname(fileURLToPath(import.meta.url))

// Base path must match the GitHub Pages project URL:
// https://baraanazar.github.io/german-course/
//
// Deployment model (no Pages settings change required):
// · The Vite source entry lives at src/index.html (NOT the repo root —
//   the root index.html is the BUILT app that GitHub Pages serves).
// · publicDir is disabled: static content (1,522 lesson pages, manifest,
//   icons, the shared stylesheet) already sits at the repo root and is
//   served as-is in legacy Pages mode.
// · `npm run deploy` builds and copies dist/ over the repo root.
export default defineConfig({
  base: '/german-course/',
  plugins: [react()],
  publicDir: false,
  build: {
    rollupOptions: {
      input: resolve(root, 'src/index.html'),
      output: {
        // Split the big data modules (5,000 words / 1,539 verbs / stories)
        // from the app code so the framework chunk stays small and the
        // data chunks cache independently across deploys.
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          'data-verbs': ['./src/data/verbs.js'],
          'data-vocab': ['./src/data/vocab.js', './src/data/stories.js'],
        },
      },
    },
  },
})
