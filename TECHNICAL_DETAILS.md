# Technical Details

## URL format

```text
https://<user>.github.io/Timer/?end=<time>[&start=<time>][&title=<text>]
```

| Parameter | Required | Meaning |
|-----------|----------|---------|
| `end`     | yes | When the timer expires. Unix seconds (`1790000000`), unix milliseconds (`1790000000000`) or ISO 8601 (`2026-09-27T14:30:00Z`, `2026-09-27T14:30:00+02:00`; without an offset it's the viewer's local time). |
| `start`   | no  | When the timer started (same formats). If present, a progress ring is shown. |
| `title`   | no  | Heading shown above the countdown. |

Examples:

- `…/Timer/?end=2026-09-27T14:30:00Z`
- `…/Timer/?end=2026-09-27T14:30:00+02:00&title=Coffee%20break`

Without `end` (or with an unreadable one) the setup screen is shown.

## GitHub Pages

GitHub Pages is a static host with no SPA fallback, so the app deliberately has **no client-side routes**: everything is `index.html` at the site root and all state is in the query string. `vite.config.ts` uses `base: './'`, so assets resolve under `/Timer/` (or any repo name / custom domain). As a safety net, `public/404.html` redirects any unknown path under the site back to the root while keeping the query string.

## Development

```bash
npm install
npm run dev      # local dev server
npm run build    # type-check + production build into dist/
npm run preview  # serve the production build
```

## Deployment

`.github/workflows/deploy.yml` builds and deploys to GitHub Pages on every push to `main`.
One-time setup: in the repository go to **Settings → Pages → Build and deployment → Source** and select **GitHub Actions**.