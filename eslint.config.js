import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'

/**
 * Flat config (ESLint 9).
 *
 * react-hooks rules are the important ones: they catch the stale-state
 * and missing-dependency bug class automatically (the type-in quiz bug
 * fixed in A1 would have been flagged here).
 */
export default [
  // Static lesson pages and local-only folders are not React source.
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'kursraum/**',
      'textkurs/**',
      'hybrid/**',
      'pimsleur/**',
      'assets/**',
      'tools/**',
      'reference/**',
      'learning-records/**',
    ],
  },

  js.configs.recommended,
  {
    files: ['src/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
    },
    settings: { react: { version: 'detect' } },
    rules: {
      ...react.configs.flat.recommended.rules,
      ...reactHooks.configs.recommended.rules,

      // Vite uses the automatic JSX runtime — no `import React` needed.
      'react/react-in-jsx-scope': 'off',
      // Component props are documented via JSDoc; full type safety is a
      // deliberate future step (TypeScript migration, see TASKS.md).
      'react/prop-types': 'off',
    },
  },
]
