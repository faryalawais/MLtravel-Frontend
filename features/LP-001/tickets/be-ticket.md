# BE Ticket — LP-001-BE

**Parent:** LP-001  
**Slice:** LP-001.1 (API)  
**Status:** be-implemented  
**Created:** 2026-07-01

## What to build

Minimal health-check endpoint in **MLtravel-Backend** so the pipeline BE gate passes before LP-001 FE work. No landing-page domain APIs.

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/api/health` | Returns `200` + minimal health payload |

Documented via `openapi-author` from Gherkins. No database, no auth, no landing content.

## Data to expose

| Field | Endpoint | Response path | Used by UI |
|-------|----------|---------------|------------|
| `status` | `GET /api/health` | `$.status` (or equivalent per OpenAPI) | **Not rendered** — gate only |

LP-001 landing is static; health endpoint is not called on page load.

## Acceptance Criteria

9. `GET /api/health` returns `200` when LP-001.1 is deployed.

Additional BE gates:

- OpenAPI spec validates (`npm run gate:api` in MLtravel-Backend)
- Vitest API tests pass for health route
- Status → `be-implemented` before LP-001-FE starts

## Gherkins

Shared file: `features/LP-001/LP-001.feature`  
Run with `--tags @be` for BE-only execution.

## Dependencies

- Gherkins written by `spec-author` after `/to-issues`
- `openapi-author` → `business-logic-author` → `orm-schema-author` (minimal/no schema) → `be-implement`
