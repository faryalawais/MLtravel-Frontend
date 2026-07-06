# Feature Memory — CP-002: Contact Us

## Feature Identity
- **Parent ticket:** CP-002
- **FE ticket:** CP-002-FE
- **BE ticket:** CP-002-BE
- **Status:** fe-implemented (visual baselines pending human approval)
- **Branch:** `feature/cp-002-fe` (from `main` + `fix/Animations`, 2026-07-06)
- **Last updated:** 2026-07-06
- **Figma file key:** `h6BqI1ZRMSJxR7jESNF0Ep` (Contact frames only — not landing `5164:6346`)
- **Figma layout anchor:** `5185:4332` (Choose day — canonical page chrome)
- **Figma reference frames:** `5185:4332`, `5186:4533`, `5186:4857`, `5198:4102` (Summary — Calendly copy ref)
- **Figma placeholder (not layout):** `5198:3487` (designer note only)

---

## Grill-me decisions (2026-07-06)

| # | Decision |
|---|----------|
| 1 | Single `/contact` page: ML Travel chrome + **one Calendly inline iframe** (native `<iframe>`, not react-calendly) |
| 2 | **No** custom step/progress UI — Calendly handles steps inside embed |
| 3 | **No CP-002 BE API** — embed-only; pipeline BE gate via existing health stub |
| 4 | **Desktop** pixel match (`5185:4332`); **mobile** fluid stack + responsive embed (no separate mobile Figma) |
| 5 | `NEXT_PUBLIC_CALENDLY_URL` + `NEXT_PUBLIC_CONTACT_EMAIL` in `.env` |
| 6 | **Full Figma frame** chrome: hero, fallback block, embed container |
| 7 | Embed fail → fallback message + external Calendly link |
| 8 | Post-booking: **Calendly** success UI; Summary frame strings → Calendly admin config (not React) |
| 9 | Fallback email: `mailto:` from `NEXT_PUBLIC_CONTACT_EMAIL` (default `hello@maqsoodtravel.com`) |
| 10 | **LP-001 gate:** Navbar + Footer `fe-implemented` — reuse existing components, no duplicates |
| 11 | Loading **skeleton** in embed slot until iframe loads |
| 12 | Cookie/privacy/terms inside widget → **Calendly only** (out of FE scope) |
| 13 | **English only** — Figma copy is English; matches LP-001 |

### Slice grill-me (2026-07-06)

| # | Decision |
|---|----------|
| S1 | Slices #14–#16 granularity approved — sequential hero → embed → fallback |
| S2 | Gherkins **1:1** per issue #14–#16 |
| S3 | Each `@fe` scenario: **1440px + 393px** — desktop Figma node match; mobile visibility/layout only (no mobile Figma node, no animation steps) |

---

## PRD v1

See `docs/features/CP-002/prd-v1.md` — drafted 2026-07-06.

<!-- Approved by: human on 2026-07-06 -->

---

## PRD v2

<!-- Written by: prd-update on 2026-07-06 -->
<!-- Approved by: human on 2026-07-06 -->
Full file: `docs/features/CP-002/prd-v2.md`

### Summary
- Screens: 1 (`/contact`)
- ACs: 13
- Data-bound fields: 0 (static + env; health stub gate only)
- Edge cases: 9

---

## Gherkins

<!-- Written by: spec-author on 2026-07-06 -->
<!-- Reviewed by: human on 2026-07-06 — approved -->
<!-- Validated by: gherkin-validate on 2026-07-06 — all checks passed -->
<!-- @fe scenarios: 4 | @be scenarios: 0 -->
Full file: `features/CP-002/CP-002.feature`

AC exclusions (documented, same pattern as LP-001): AC-11 token lint via `npm run gate`; AC-12 Calendly admin ops; AC-13 health via LP-001 GH#2.

---

## UI Registry
<!-- Written by: figma-extract on 2026-07-06 -->
Roots: `screen.contact.page`, `component.contact.{hero,embed,embedSkeleton,embedFallback,fallback}` — see `tokens/ui-registry.json` + `npm run ui-registry:build`.

---

## FE Contract
<!-- Written by: design-contract on 2026-07-06 -->
Full file: `features/CP-002/contract.md` — validations: `validate:figma-coverage`, `validate:figma-extract`, `validate:contract` all pass.

---

## BE Contract
<!-- To be written by: openapi-author + business-logic-author + orm-schema-author -->

---

## Implementation Notes
### FE notes
<!-- Written by: fe-implement on 2026-07-06 -->
- Components implemented: `ContactHeroSection`, `ContactEmbedSection`, `ContactFallbackSection`, `app/contact/page.tsx`
- Constants: `constants/contact.constants.ts`, `types/contact.types.ts`
- build: passed (after hero motion test-id registry fix)
- test:e2e: LP-001 smoke passes; CP-002 BDD via `npm run test:bdd` (4 scenarios)
- bdd-scaffold: `tests/steps/{shared,cp-002,field-bindings}.steps.ts` + `playwright-bdd` (`npm run bdd` / `npm run test:bdd`)
- Deviations from contract: none
- Human review: **pending** (see `reports/cp-002-visual.md`)

### Visual regression
<!-- Written by: visual-regression on 2026-07-06 -->
- `tests/visual/cp-002.spec.ts` — 7 golden-master snapshots (1440 + 393px slices, full page)
- `tests/visual/cp-002-dimensions.spec.ts` — typography + 868×550 embed / 560px fallback / CTA height
- `npm run test:visual` (CP-002): **11/11 pass**; baselines **established, pending human approval**
- Figma fidelity report: `reports/cp-002-visual.md` — 0 Missing, 0 Differs
- Motion (Job 4): N/A — no animation twins

## Gate Results
<!-- Partial — fe-implement + visual-regression 2026-07-06 -->
- `npm run build`: pass
- `npm run lint`: pass (contact files)
- `validate:figma-extract` / `validate:contract`: pass (from design-contract)
- `npm run test:visual` (CP-002): pass (baselines pending approval)

---

## Pipeline log
- **2026-07-06** — `/feature-brief` created (renamed from F-002). Contact Us page with Calendly iframe embeds. Depends on LP-001 (navbar/footer).
- **2026-07-06** — `/grill-me` complete. REST extract: `features/CP-002/figma/nodes/`. Figma Desktop MCP: `.cursor/mcp.json`.
- **2026-07-06** — `/prd-author` → `docs/features/CP-002/prd-v1.md`.
- **2026-07-06** — `/prd-review` → PRD v1 approved.
- **2026-07-06** — `/prd-update` → `docs/features/CP-002/prd-v2.md`.
- **2026-07-06** — `/prd-review` → PRD v2 **approved**.
- **2026-07-06** — `/ticket-generate` → `CP-002-FE`, `CP-002-BE` (BE waived).
- **2026-07-06** — `/to-issues` published — GH [#14](https://github.com/faryalawais/MLtravel-Frontend/issues/14) hero, [#15](https://github.com/faryalawais/MLtravel-Frontend/issues/15) embed, [#16](https://github.com/faryalawais/MLtravel-Frontend/issues/16) fallback.
- **2026-07-06** — `/grill-me` (slices) complete — Gherkin pattern A (desktop Figma + mobile visibility per issue).
- **2026-07-06** — `/spec-author` → `features/CP-002/CP-002.feature` (4 scenarios).
- **2026-07-06** — `/scenario-review` approved → `/gherkin-validate` all checks passed.
- **2026-07-06** — `/figma-extract` (frame `5185:4332`) — dual-source REST + MCP; 3 slice-roots; `spec.json`, `layout.json`, reference PNGs; all extract validations pass.
- **2026-07-06** — `/design-contract` → `features/CP-002/contract.md`; backlog `status: contracted`.
- **2026-07-06** — `/fe-implement` → contact page chrome + Calendly iframe + email fallback (GH#14–#16).
- **2026-07-06** — `/visual-regression` → golden-master + dimension tests; `reports/cp-002-visual.md`; baselines pending approval.
