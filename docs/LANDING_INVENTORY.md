# Landing Inventory (Phase 0)

## Canonical landing chain

- `/` resolves to `app/(marketing)/page.tsx` (route group path segment is omitted from URL).
- `app/layout.tsx` wraps all pages with shared shell (`TopNav`, `Footer`) and renders `children` in `<main>`.
- `components/TopNav.tsx` links visitors into `/pricing`, `/demo/demo`, and `/console/dashboard`.

## Landing files/components in use now

- `app/(marketing)/page.tsx` – current home hero and inline redaction sample.
- `app/layout.tsx` – shared app shell used by landing.
- `components/TopNav.tsx` – primary navigation and above-the-fold link affordances.
- `components/Footer.tsx` – global footer.
- `components/RedactionHighlighter.tsx` – current proof-style visual element on landing.

## “Scary system state” copy audit

- No user-facing string like `environment check failed` is currently rendered in landing components.
- User-facing API errors are still present in some endpoint payloads (`{ error: ... }`) and can bubble to clients if consumed directly.

## Middleware gating and protected routes

`middleware.ts` currently protects API subtrees only:

- Matcher: `/api/(leads|telemetry|pii|pdf)/:path*`
- Requires `Authorization: Bearer ${SGAI_API_KEY}`
- Applies in-memory rate limiting and request-id/security headers

Marketing/demo routes are not protected by middleware at present.
