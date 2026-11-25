import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Base path must match the GitHub Pages project URL:
// https://baraanazar.github.io/german-course/
export default defineConfig({
  base: '/german-course/',
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
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
