#!/usr/bin/env bash
# Deploys the React app to GitHub Pages.
#
# How this works (no Pages settings change required):
#   1. Build the app → dist/ (index.html + hashed asset bundles)
#   2. Copy dist/index.html to the repo root — that is the file GitHub
#      Pages serves at /german-course/
#   3. Copy the hashed bundles into assets/ (next to the shared
#      styles.css used by the static lesson pages) and prune bundles
#      from previous deploys so the repo does not accumulate them
#   4. Commit and push — legacy Pages mode serves main directly
#
# The 1,522 static lesson pages and the shared stylesheet are regular
# repo files and are served as-is (Jekyll is disabled via .nojekyll).
set -euo pipefail
cd "$(dirname "$0")/.."

echo "▸ Building…"
npm run build

echo "▸ Deploying bundle to repo root"
# Vite mirrors the input path (src/index.html → dist/src/index.html),
# but the built file references assets via absolute /german-course/ URLs,
# so copying it to the repo root is safe.
cp dist/src/index.html index.html

# Prune stale hashed bundles, then copy the fresh ones.
rm -f assets/index-*.js assets/index-*.css assets/vendor-*.js assets/data-*.js
cp dist/assets/*.js dist/assets/*.css assets/

echo "▸ Committing"
git add index.html assets/
git commit -m "Deploy: rebuild app bundle" || { echo "Nothing to deploy (no changes)"; exit 0; }
git push

echo "▸ Live at https://baraanazar.github.io/german-course/ (allow ~60s for the CDN)"
