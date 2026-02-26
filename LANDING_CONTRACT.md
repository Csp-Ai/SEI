# Landing Contract

## Proof rules
- Landing must render meaningful above-the-fold proof on first paint (`app/(marketing)/page.tsx` + `components/landing/BoardPreviewSSR.tsx`).
- If live/cache data is unavailable, SSR falls back to deterministic demo slate and never blank content.

## Mode rules
- Output surfaces use a shared `ModeBadge` (`components/status/ModeBadge.tsx`).
- Supported states: `LIVE`, `CACHED`, `DEMO`.
- Demo copy is neutral and explicit: **"Demo mode (live feeds off)"**.

## Spine rules
- Shared spine context lives in `NervousSystemContext` and tracks `sport`, `tz`, `date`, `mode`, `trace_id`.
- CTA links must use `nervous.toHref` + `appendQuery` (`lib/core/spine.ts`), never manual query string concatenation.
- `trace_id` from `/api/today` is hydrated into context via `TraceHydrator`.

## API envelope rules
- Stable envelope shape:
  - Success: `{ ok: true, data, provenance, trace_id }`
  - Failure: `{ ok: false, error: { code, message }, provenance?, trace_id? }`
- `/api/today`, `/api/slips/submit`, and `/api/slips/extract` follow this contract.
- Boundary adapters should runtime-validate payloads (`lib/core/adapters.ts`).
