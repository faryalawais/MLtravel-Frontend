# BE Ticket — CP-002-BE

**Parent:** CP-002  
**Slice:** CP-002.1 (API) — **waived**  
**Status:** tickets-created  
**Created:** 2026-07-06

## What to build

**No CP-002-specific backend work in v1.**

CP-002.1 is explicitly waived per approved PRD v2: demo booking is handled entirely by Calendly on the frontend. The pipeline BE-before-FE gate is satisfied by the existing **LP-001-BE** health stub (`GET /api/health`).

| Method | Path | CP-002 responsibility |
|--------|------|------------------------|
| `GET` | `/api/health` | **None** — already implemented under LP-001-BE |

No new endpoints, webhooks, database schema, or OpenAPI specs for Contact booking.

## Data to expose

| Field | Endpoint | Response path | Used by UI |
|-------|----------|---------------|------------|
| *(none)* | — | — | — |

Contact UI does not consume BE response bodies. Scheduling data lives in Calendly.

## Acceptance Criteria (@be)

13. `GET /api/health` returns `200` when LP-001.1 is deployed (gate only — inherited from LP-001-BE; **not** re-implemented for CP-002).

Additional gates:

- CP-002-BE marked **waived** / `be-implemented` via LP-001 health stub — no `openapi-author` work for Contact domain APIs.
- CP-002-FE may start once LP-001-BE is `be-implemented` (already merged per LP-001 pipeline).

## Gherkins

Shared file: `features/CP-002/CP-002.feature`  
Run with `--tags @be` for BE-only execution.

Expected @be coverage: health gate reference only (no Contact-specific API scenarios unless pipeline requires explicit waiver scenario).

## Dependencies

- **LP-001-BE** must be `be-implemented` before CP-002-FE starts.
- No `openapi-author` → `be-implement` cycle for CP-002 domain logic.
