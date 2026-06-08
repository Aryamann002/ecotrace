# Security

EcoTrace is designed to have the smallest reasonable attack surface.

## Security model

- **No backend, no database, no secrets.** The app is fully client-side and ships no API
  keys or credentials. There is nothing server-side to compromise and no `.env` to leak.
- **`localStorage` is treated as untrusted.** Everything read back from the browser is
  parsed and validated against a Zod schema (`src/lib/storage.ts`); malformed, tampered, or
  wrong-shaped data fails closed (returns `null`/empty) and never throws into the UI. Access
  is guarded so it is safe during SSR and in private-browsing / storage-disabled contexts.
- **Input validation.** All user input is validated and range-bounded by
  `footprintInputSchema` before use.
- **No raw HTML injection.** The app does not use `dangerouslySetInnerHTML` with user input.

## HTTP security headers

The `Content-Security-Policy` is set per request in `src/middleware.ts`; the remaining
headers are set in `next.config.ts` for every route.

- `Content-Security-Policy` — `default-src 'self'`; `script-src` uses a fresh per-request
  **nonce** plus `'strict-dynamic'`, so only Next.js's own nonce-carrying scripts execute
  and host-based allowlisting is disabled (no `'unsafe-inline'` for scripts). Setting a
  nonce requires dynamic rendering, so pages render on demand (`force-dynamic`). Styles
  allow `'unsafe-inline'` (a low-risk sink that Next/Tailwind require); `object-src 'none'`;
  `frame-ancestors 'none'`; `base-uri 'self'`; `form-action 'self'`. In development only,
  `'unsafe-eval'` and `ws:` are added for React Fast Refresh and HMR.
- `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` — camera, microphone, geolocation, and browsing-topics disabled
- `Strict-Transport-Security` — HSTS with preload (HTTPS enforced by the host)

Verify with [securityheaders.com](https://securityheaders.com) and the
[Mozilla Observatory](https://observatory.mozilla.org) after deployment.

## Dependencies

- Lockfile committed; CI installs with `npm ci`.
- Keep the dependency footprint minimal — each dependency is attack surface and bundle weight.
- Recommended: enable **Dependabot** (or `npm audit` in CI) and a secret scanner
  (e.g. **gitleaks**) on the repository.

## Reporting a vulnerability

Open a private security advisory on the GitHub repository, or contact the maintainer
directly. Please do not file public issues for security reports.
