# Feature Memory — LP-001: Landing page (D4)

## Feature Identity
- **Parent ticket:** LP-001
- **FE ticket:** LP-001-FE
- **BE ticket:** LP-001-BE
- **Status:** be-implemented (LP-001-BE merged · FE unblocked)
- **Last updated:** 2026-07-01
- **Figma file key:** `h6BqI1ZRMSJxR7jESNF0Ep`
- **Figma anchor:** `5164:6346` (landing page only — not used for F-002 / F-003)

## Brief inputs (Step 1 — `/feature-brief`)
<!-- Confirmed by user: "fill it if you know" — sourced from backlog + Figma + project context -->

1. **Feature:** Landing page (D4) — static marketing page from Figma; shared Navbar + Footer for the site.
2. **Persona:** Travel agency owner or operations lead evaluating whether to switch booking platforms.
3. **Problem:** Prospects need a compelling first impression and clear value proposition before booking a demo or reading deeper pages.
4. **Figma:** Yes — [Landing page only](https://www.figma.com/design/h6BqI1ZRMSJxR7jESNF0Ep/ML-Travel-Project--faryal-updated-?node-id=5164-6346&p=f&m=dev) · frame `5164:6346` · section nodes in `features/backlog.yaml`.
5. **Swagger:** none yet (static marketing page; no API at planning stage).

## Grill-me decisions (Step 1a — `/grill-me` ✅ pass 1)

| # | Decision |
|---|----------|
| 1 | **Static v1** — no landing APIs; all content in FE |
| 2 | **Responsive** — desktop + mobile (Figma has both; brief “mobile later” is **wrong**) |
| 3 | **Each slice** ships desktop + mobile together |
| 4 | **Routes:** `/` · `/contact` · `/how-it-works` · Hero CTA → `/contact` · shared Navbar/Footer, no duplication |
| 5 | **BE:** LP-001.1 = minimal health stub so gate passes |
| 6 | **Motion in v1** — hovers, focus, `MOTION-SPEC` behaviour per section |
| 7 | **First slice:** Navbar `5164:6559` |
| 8 | **Copy:** English only, hardcoded from Figma text |
| 9 | **Acceptance:** strict pixel match to Figma; spacing gaps fixed in Figma first, then FE implements post-fix frames |

**PRD / backlog must fix:** remove “mobile layouts (later pass)” from brief; add mobile Figma node IDs per section; LP-001.1 = health-check stub.

## Grill-me pass 2 (post `/to-issues` ✅)

| # | Decision |
|---|----------|
| 1 | Social proof [#9] stays **one issue** |
| 2 | **Every slice extracts mobile** from `D4-Mobile` — #8 included |
| 3 | **#1 App shell** separate from **#3 Navbar** |
| 4 | FE slices **parallel after #2** |
| 5 | Motion tokens: Figma primitives `motion.duration.{700,300,120}` + semantics aliases; behaviour in `tokens/MOTION-SPEC.md` |
| 6 | **Gherkins 1:1** — one `@fe` scenario per GitHub issue #1–#12, one `@be` for #2 |

---

## PRD v1

See [`docs/features/LP-001/prd-v1.md`](../../../docs/features/LP-001/prd-v1.md) — written 2026-07-01 (Figma-first skeleton; mobile node IDs TBD in v2).

<!-- Approved by: human on 2026-07-01 -->

---

## PRD v2

<!-- Written by: prd-update on 2026-07-01 -->
<!-- Approved by: human on 2026-07-01 -->
Full file: [`docs/features/LP-001/prd-v2.md`](../../../docs/features/LP-001/prd-v2.md)

### Summary

- Screens: 10 sections + 2 parent frames (D4-Desktop `5164:6558`, D4-Mobile `5164:6569`)
- ACs: 12
- Data-bound UI fields: 0 (static landing; health stub only for BE gate)
- Edge cases: 9 documented (incl. dual Comparison on desktop, single on mobile)

---

## Gherkins

<!-- Written by: spec-author on 2026-07-01 -->
<!-- Reviewed by: human on 2026-07-01 — approved -->
<!-- Validated by: gherkin-validate on 2026-07-01 — all checks passed -->
<!-- @fe scenarios: 11 | @be scenarios: 1 -->
Full file: [`features/LP-001/LP-001.feature`](./LP-001.feature)

1:1 with GitHub issues [#1](https://github.com/faryalawais/MLtravel-Frontend/issues/1)–[#12](https://github.com/faryalawais/MLtravel-Frontend/issues/12).

---

## UI Registry
<!-- To be written by: ui-registry-build -->

---

## FE Contract
<!-- To be written by: design-contract -->

---

## BE Contract
<!-- openapi-author completed: 2026-07-01 -->
### Endpoints (Contract 1 — OpenAPI)
| Method | Path | Operation ID | Status codes |
|--------|------|--------------|--------------|
| GET | `/api/health` | `getHealth` | 200 |

Full spec: `docs/openapi/paths/LP-001-BE.yaml`  
Human summary: `docs/features/LP-001-BE/api-contract.md`  
Feature view: `http://localhost:3001/api/docs?feature=LP-001-BE`

---

## Implementation Notes
### BE notes
<!-- Written by: be-implement on 2026-07-01 -->
- Endpoints implemented: GET /api/health
- NestJS files: `src/health/health.{module,controller,service}.ts`
- Test files: `tests/api/LP-001-BE/` (1 test)
- gate:api: passed
- Deviations from contract: none

<!-- To be written by: fe-implement -->

---

## UI Registry
<!-- Written by: ui-registry-build on 2026-07-01 -->
<!-- Validated by: ui-registry:validate — passed -->
<!-- registry-validate: passed 2026-07-01 (38/38 checklist rows, 0 data-binding — static v1) -->
Full file: `tokens/ui-registry.json` · glossary: `reports/ui-registry-glossary.md` · test-ids: `tokens/build/test-ids.ts`

**Gherkin path aliases** (registry requires 3+ segments): see `$metadata.gherkinAliases` in ui-registry.json — e.g. Gherkin `component.navbar` → `component.navbar.root`, `screen.landing` → `screen.landing.home`.

### Components catalogued (Navbar slice #3 — 38 entries)
- `component.navbar.root` — desktop navbar `5164:6559`
- `component.navbar.cta` — Book A Demo CTA
- `component.navbar.mobile.*` — mobile bar `5164:7031` (8 entries)
- `component.navbar.motion.*` — animation reference `5164:10334` (15 entries)
- Nav links: `productLink`, `howItWorksLink`, `pricingLink` (+ labels)

**Token enrich:** `ui-registry:enrich-tokens` ran — 0 enriched (PAT needs `file_variables:read` for boundVariables → semantic mapping). Manual `$tokens` in design-contract until scope added.

---

## Design contract
<!-- Written by: design-contract on 2026-07-01 -->
<!-- validate:figma-coverage: passed · validate:contract: passed -->
**Scope:** Navbar slice (#3) only — `features/LP-001/contract.md`  
**Branch:** `feature/LP-001-FE`  
**Next:** `/fe-implement` — GH#1 app shell + GH#3 Navbar

---

## Implementation Notes
### FE notes
<!-- Written by: fe-implement on 2026-07-01 -->
- Components implemented: `SiteNav`, `NavbarCta`; route stubs `/`, `/contact`, `/how-it-works`
- `globals.css` imports `tokens/build/tokens.css`; typography utilities for h4 + body-sm
- Added primitive tokens `spacing.52`, `spacing.60` (Figma navbar gaps/heights)
- test:e2e: not scaffolded yet (no Playwright config)
- test:visual: not scaffolded yet
- typecheck: passed (`npx tsc --noEmit`, `next build`)
- token-lint: not scaffolded yet
- Deviations from contract: `#pricing` anchor is empty stub until Hero/Pricing slice (GH#11); Product link uses `#product` pending section anchor

---

## Gate Results
<!-- To be written by: impl-gate -->

---

## Pipeline log
- **2026-06-30** — `/feature-brief` — parent ID LP-001; landing page D4; owns shared Navbar + Footer for F-002 / F-003 reuse.
- **2026-06-30** — New Figma file `h6BqI1ZRMSJxR7jESNF0Ep`; designer token upload (6 files in `tokens/`).
- **2026-06-30** — `/grill-me` complete — 9 decisions locked (static, responsive, routes, BE stub, motion, Navbar first, Figma-driven acceptance).
- **2026-07-01** — `/prd-author` — `docs/features/LP-001/prd-v1.md` written (Figma-first; grill-me decisions incorporated).
- **2026-07-01** — `/prd-review` — PRD v1 **approved** by human. Next: `/prd-update`.
- **2026-07-01** — `/prd-update` — `docs/features/LP-001/prd-v2.md` written (Figma REST analysis; mobile node IDs mapped; section order corrected).
- **2026-07-01** — `/prd-review` — PRD v2 **approved** by human. Next: `/ticket-generate`.
- **2026-07-01** — `/ticket-generate` — FE `LP-001-FE`, BE `LP-001-BE`. Next: `/to-issues`.
- **2026-07-01** — `/to-issues` — 12 GitHub issues published; index in `features/LP-001/tickets/issues.md`.
- **2026-07-01** — `/scenario-review` — Gherkins approved by human.
- **2026-07-01** — `/gherkin-validate` — all 6 checks passed. Planning gate complete for LP-001.
- **2026-07-01** — `/openapi-author` — LP-001-BE OpenAPI fragment + api-registry written.
- **2026-07-01** — **LP-001-BE merged** — NestJS scaffold + `GET /api/health`; `gate:api` passed. FE unblocked.
- **2026-07-01** — Figma file updated to `h6BqI1ZRMSJxR7jESNF0Ep` (faryal-updated); motion tokens merged; Navbar re-extracted (`figmaLastModified` 2026-07-01).
- **2026-07-01** — `/ui-registry-build` — 3 screens + 38 Navbar components; `ui-registry:validate` passed.
- **2026-07-01** — `/design-contract` — Navbar slice contract; `validate:figma-coverage` + `validate:contract` passed.
- **2026-07-01** — `/fe-implement` — GH#1 route stubs + GH#3 Navbar (desktop/mobile/CTA motion); `next build` passed.
- **2026-07-01** — Navbar re-extract (small chunks): 3 slice-roots + 8 sub-chunks via REST; 11 cache files; all validate gates pass.
