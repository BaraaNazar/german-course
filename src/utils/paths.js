/**
 * Absolute URLs for the static (non-React) content in /public.
 *
 * Plain relative hrefs like "hybrid/index.html" only work when the page
 * happens to be served at the base path — from any sub-route
 * (/konjugation, /vocab, …) they resolve against that route and 404.
 * Prefixing with Vite's BASE_URL makes them correct everywhere.
 */
export const staticUrl = path => `${import.meta.env.BASE_URL}${path}`
