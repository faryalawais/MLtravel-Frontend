# BE Ticket — HIW-003-BE

**Parent:** HIW-003  
**Slice:** HIW-003.1 (API) — **waived**  
**Status:** tickets-created  
**Created:** 2026-07-06

## What to build

**No HIW-003-specific backend work in v1.**

HIW-003.1 is explicitly waived per approved PRD v2: the How It Works page is fully static FE. The pipeline BE-before-FE gate is satisfied by the existing **LP-001-BE** health stub (`GET /api/health`).

| Method | Path | HIW-003 responsibility |
|--------|------|--------------------------|
| `GET` | `/api/health` | **None** — already implemented under LP-001-BE |

No new endpoints, webhooks, database schema, or OpenAPI specs for HIW content.

## Data to expose

| Field | Endpoint | Response path | Used by UI |
|-------|----------|---------------|------------|
| *(none)* | — | — | — |

HIW UI does not consume BE response bodies.

## Acceptance Criteria (@be)

14. `GET /api/health` returns `200` when LP-001.1 is deployed (gate only — inherited from LP-001-BE; **not** re-implemented for HIW-003).

Additional gates:

- HIW-003-BE marked **waived** / `be-implemented` via LP-001 health stub — no `openapi-author` work for HIW domain APIs.
- HIW-003-FE may start once LP-001-BE is `be-implemented`.

## Gherkins

Shared file: `features/HIW-003/HIW-003.feature`  
Run with `--tags @be` for BE-only execution.

Expected @be coverage: health gate reference only (no HIW-specific API scenarios unless pipeline requires explicit waiver scenario).

## Dependencies

- **LP-001-BE** must be `be-implemented` before HIW-003-FE starts.
- No `openapi-author` → `be-implement` cycle for HIW-003 domain logic.
