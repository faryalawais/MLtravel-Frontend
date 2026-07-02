# Feature Memory — LP-001: Landing page (D4)

## Feature Identity
- **Parent ticket:** LP-001
- **FE ticket:** LP-001-FE
- **BE ticket:** LP-001-BE
- **Status:** gherkins-ready
- **Last updated:** 2026-07-02
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
<!-- Corrected: prd-update on 2026-07-02 — D4-Desktop main column verified via Figma MCP -->
<!-- Layout: one Comparison; after How-it-works → Feature grid, Social proof, Pricing (3 sections) -->
<!-- Approved by: human on 2026-07-02 -->
Full file: [`docs/features/LP-001/prd-v2.md`](../../../docs/features/LP-001/prd-v2.md)

### Summary

- Screens: **9 in-flow sections** + 2 parent frames (D4-Desktop `5164:6558`, D4-Mobile `5164:6569`)
- Post–How-it-works: **Feature grid** (`6562`/`6785`) → **Social proof** (`6568`/`6836`) → **Pricing** (`6564`/`6915`)
- **No second comparison** — `5164:6563` off-canvas at `x=3234` — out of scope
- ACs: 12
- Data-bound UI fields: 0 (static landing; health stub only for BE gate)
- Edge cases: 9 (off-canvas duplicate, single comparison on mobile, placeholder node, etc.)

---

## Gherkins

<!-- Written by: spec-author on 2026-07-01 -->
<!-- Updated by: spec-author on 2026-07-02 — PRD v2: removed GH#8 (Comparison 2nd) -->
<!-- Reviewed by: human on 2026-07-02 — approved -->
<!-- Validated by: gherkin-validate on 2026-07-02 — all checks passed -->
<!-- @fe scenarios: 10 | @be scenarios: 1 -->
Full file: [`features/LP-001/LP-001.feature`](./LP-001.feature)

1:1 with open GitHub issues [#1](https://github.com/faryalawais/MLtravel-Frontend/issues/1)–[#7](https://github.com/faryalawais/MLtravel-Frontend/issues/7), [#9](https://github.com/faryalawais/MLtravel-Frontend/issues/9)–[#12](https://github.com/faryalawais/MLtravel-Frontend/issues/12). [#8](https://github.com/faryalawais/MLtravel-Frontend/issues/8) cancelled.

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

### Components catalogued (Problem slice #5 — 71 entries)
- `component.landing.problem.root` — desktop `5164:6561` (Gherkin: `component.landing.problem`)
- `component.landing.problem.*` — header, 3× cards (icon/graphic/heading/body), CTA, gradient bar (37 desktop entries)
- `component.landing.problem.mobile.*` — mobile stack `5164:6571` (22 entries)
- `component.landing.problem.motion.*` — animation reference `5164:10344` (8 entries)

**Registry total:** 137 components (navbar 38 + hero 28 + problem 71) · `layout.json` 15 leaf slugs

### Components catalogued (Comparison first slice #6 — 138 entries)
- `component.landing.comparisonFirst.root` — desktop `5164:6566` (Gherkin: `component.landing.comparisonFirst`)
- `component.landing.comparisonFirst.*` — header, GiantTicket, industry + Maqsood cards (3 rows each), footnote, CTA (desktop)
- `component.landing.comparisonFirst.mobile.*` — mobile stack `5164:6609` (52 entries)
- `component.landing.comparisonFirst.motion.*` — animation reference `5164:10411` (7 entries)

**Registry total:** 275 components (navbar 38 + hero 28 + problem 71 + comparisonFirst 138) · `layout.json` 18 leaf slugs

<!-- registry-validate: passed 2026-07-01 (275 components, 3 screens; ui-registry:validate + validate:layout pass) -->

### Components catalogued (How-it-works teaser slice #7 — 251 entries)
- `component.landing.howItWorksTeaser.root` — desktop `5164:6567` (Gherkin: `component.landing.howItWorksTeaser`)
- `component.landing.howItWorksTeaser.*` — header, 3× HIWCard (visual + step badge + copy), footer link (desktop)
- `component.landing.howItWorksTeaser.mobile.*` — mobile stack `5164:6690` (stacked HIW cards + footer link)
- `component.landing.howItWorksTeaser.motion.*` — animation reference `5164:10412` (4-step cascade states)

**Registry total:** 526 components (navbar 38 + hero 28 + problem 71 + comparisonFirst 138 + howItWorksTeaser 251) · `layout.json` 21 leaf slugs

### Components catalogued (Feature grid slice #10 — 338 entries)
- `component.landing.featureGrid.root` — desktop `5164:6562` (Gherkin: `component.landing.featureGrid`)
- `component.landing.featureGrid.*` — section header, 6× FeatureCard (2 rows), footer tagline + CTA, decorative planes
- `component.landing.featureGrid.mobile.*` — mobile stack `5164:6785` (stacked cards + CTA row)
- `component.landing.featureGrid.motion.*` — animation reference `5404:6074` (4-step cascade per MOTION-SPEC §7)

### Components catalogued (Social proof slice #9 — 224 entries under `socialProof.*`)
- `component.landing.socialProof.root` — desktop `5164:6568` (Gherkin: `component.landing.socialProof`)
- `component.landing.socialProof.*` — header, 2× TestimonialBlock, SlideProgressBar, integrations strip (14 client logos), decorative plane
- `component.landing.socialProof.mobile.*` — mobile stack `5164:6836` (scrollable testimonials + logo grid)
- `component.landing.socialProof.motion.*` — testimonials animation `5307:6608` (MOTION-SPEC §8)
- `component.landing.socialProof.clientsMotion.*` — clients strip animation `5164:11204` (MOTION-SPEC §5)

**Registry total:** 1534 components · `layout.json` 28 leaf slugs

<!-- figma-extract: passed 2026-07-02 (GH#9 Social proof — desktop/mobile/motion) -->
<!-- ui-registry-build: passed 2026-07-02 (1534 components) -->
<!-- registry-validate: passed 2026-07-02 (ui-registry:validate) -->

<!-- figma-extract: passed 2026-07-02 (GH#10 Feature grid — desktop/mobile/motion) -->
<!-- registry-validate: passed 2026-07-02 (864 components) -->

<!-- registry-validate: passed 2026-07-02 (526 components; comparisonSecond removed per PRD v2) -->

---

## Design contract
<!-- Written by: design-contract on 2026-07-01 -->
<!-- Updated: 2026-07-02 — Social proof GH#9 contracted -->
<!-- validate:figma-coverage: passed · validate:contract: passed -->
**Scope:** Navbar (#3) + Hero (#4) + Problem (#5) + Comparison₁ (#6) + How-it-works teaser (#7) + Feature grid (#10) + Social proof (#9) — `features/LP-001/contract.md`  
**Branch:** `feature/LP-001-FE`  
**Next:** Human **APPROVE** GH#9 Social proof slice, then `/figma-extract` GH#11 Pricing

---

## Implementation Notes
### FE notes
<!-- Written by: fe-implement on 2026-07-01 -->
- Components implemented: `SiteNav`, `MobileNavbar`, `NavbarCta`; route stubs `/`, `/contact`, `/how-it-works`
- `globals.css` imports `tokens/build/tokens.css`; typography utilities for h4 + body-sm
- Added primitive tokens `spacing.52`, `spacing.60` (Figma navbar gaps/heights)
- test:e2e: not scaffolded yet (no Playwright config)
- test:visual: not scaffolded yet
- typecheck: passed (`npx tsc --noEmit`, `next build`)
- token-lint: not scaffolded yet
- Deviations from contract: `#pricing` anchor is empty stub until Pricing slice (GH#11); Product link uses `#product` pending section anchor

### FE notes — Hero GH#4
<!-- Written by: fe-implement on 2026-07-01 -->
- Components implemented: `HeroSection`, `HeroPrimaryCta`
- ui-registry: 66 entries (navbar 38 + hero 28); `build:layout` updated
- Hero contract appended to `features/LP-001/contract.md`
- Product image: `public/images/hero-product.png` (Figma `I5164:6560;5160:5290`)
- test:e2e: not scaffolded yet
- typecheck + `next build`: passed
- Deviations: mobile stats omit per-stat captions (2-line mobile Figma uses shorter stat blocks)

### FE notes — Problem GH#5
<!-- Written by: fe-implement on 2026-07-01 -->
<!-- Human review: APPROVED 2026-07-01 -->
- Components implemented: `ProblemSection` (desktop + mobile); wired on `app/page.tsx` with `id="product"`
- ui-registry: 137 entries (+71 problem); `build:layout` updated
- Problem contract appended to `features/LP-001/contract.md`
- Card icons: `public/icons/icon-problem-card-{1,2,3}.svg`
- Shadow token fix: `tokens/sd.config.mjs` — `--shadow-card` now valid rgba
- test:e2e: passed (13 scenarios incl. GH#5 smoke + product nav scroll)
- test:visual: problem desktop/mobile baselines added
- typecheck + `next build`: passed
- Motion: card cascade on grid mouse-enter (120ms step delay); one-way per MOTION-SPEC; manual per-card CSS hover after cascade
- Deviations: section heading uses h1 vs contract h2; card titles h4 vs Figma 24px; CTA not in cascade sequence (Figma has 5 motion states)

### FE notes — Comparison₁ GH#6
<!-- Written by: fe-implement on 2026-07-01 -->
<!-- Human review: APPROVED 2026-07-01 -->
- Components implemented: `ComparisonFirstSection` (desktop GiantTicket + mobile stacked cards); wired on `app/page.tsx` after `ProblemSection`
- ui-registry: 275 entries (+138 comparisonFirst); `build:layout` updated
- Comparison contract appended to `features/LP-001/contract.md`
- Figma color pass: header tints, per-row accent tags/stamps, Maqsood `background-subtle` card body
- Desktop: center perforated divider removed per human review
- test:e2e: passed (GH#6 smoke + CTA → `/contact`)
- test:visual: comparison desktop/mobile baselines
- typecheck: passed
- Motion: one-way GiantTicket hover reveal (700ms ease-in)
- Deviations: center perforated divider omitted vs contract/Figma anatomy (human request)

### FE notes — Social proof GH#9
<!-- Written by: fe-implement on 2026-07-02 -->
- Components implemented: `SocialProofSection` (desktop testimonials row + integrations strip; mobile horizontal-scroll cards); wired on `app/page.tsx` after `FeatureGridSection`
- Assets: testimonial logos, 14 client logos, avatar glow/circle SVGs, decorative plane, section pill dot
- Typography utilities added: `text-body-desktop-testimonial`, `text-body-mobile-testimonial`, `text-label-desktop-xs-semibold`, `text-heading-mobile-h1`
- test:e2e: passed (`--grep GH#9`, 2 scenarios)
- test:visual: social proof desktop/mobile baselines established (pending human approval)
- test:visual typography: social proof header + quote desktop passed
- typecheck + `next build`: passed
- Motion: one-way testimonials hover (700ms) on section enter; integrations strip logo emphasis on strip enter
- Deviations: slide carousel is static (2 blocks visible, progress shows slide 1); third testimonial not in Figma extract as separate block

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
- **2026-07-01** — `feat(LP-001-FE)` committed + pushed (`22a666d`) — GH#1 + GH#3 navbar slice.
- **2026-07-01** — Hero `figma-extract:rest` started — slice-roots `5164:6560`, `5164:7080`, `5164:10343`; 237 checklist nodes; validate:figma-extract pass.
- **2026-07-01** — `/ui-registry-build` Hero slice — 28 hero paths; registry total 66; `build:layout` + contract Hero § appended.
- **2026-07-01** — `/fe-implement` GH#4 Hero — `HeroSection`, `HeroPrimaryCta`; `next build` passed.
- **2026-07-01** — Problem `figma-extract:rest` — nodes `5164:6561`, `5164:6571`, `5164:10344`; validate:figma-extract pass.
- **2026-07-01** — `/ui-registry-build` Problem slice — 71 problem paths; registry total 137; `build:layout` + `validate:layout` pass.
- **2026-07-01** — `/design-contract` Problem slice — contract §2 + GH#5 anatomy; `validate:figma-coverage` + `validate:contract` pass; problem card icons exported.
- **2026-07-01** — `/fe-implement` GH#5 Problem — `ProblemSection`; cascade motion + token shadow fix; e2e/visual pass; human **APPROVED**.
- **2026-07-01** — Comparison `figma-extract:rest` — nodes `5164:6566`, `5164:6609`, `5164:10411`; reference PNGs exported; `validate:figma-extract` pass.
- **2026-07-01** — `/ui-registry-build` Comparison₁ slice — 138 comparisonFirst paths; registry total 275; `build:layout` + `validate:layout` pass.
- **2026-07-01** — `/design-contract` Comparison₁ slice — contract §2 + GH#6 anatomy; `validate:figma-coverage` + `validate:contract` pass.
- **2026-07-01** — `/fe-implement` GH#6 Comparison₁ — `ComparisonFirstSection`; Figma color fixes + visual/e2e pass; human **APPROVED**.
- **2026-07-01** — How-it-works `figma-extract:rest` — nodes `5164:6567`, `5164:6690`, `5164:10412`; reference PNGs exported; `validate:figma-extract` + `validate:assets` pass; `build:layout` + `validate:layout` pass (939 checklist nodes total).
- **2026-07-01** — `/ui-registry-build` How-it-works teaser slice — 251 howItWorksTeaser paths; registry total 526; Gherkin alias `component.landing.howItWorksTeaser` → `.root`; `build:layout` + `validate:layout` pass.
- **2026-07-01** — `/design-contract` How-it-works teaser slice — contract §2 + GH#7 anatomy; `validate:figma-coverage` + `validate:contract` pass.
- **2026-07-01** — `/fe-implement` GH#6 + GH#7 — `ComparisonFirstSection`, `HowItWorksTeaserSection`; e2e + visual pass; commit `e8dd434`.
- **2026-07-02** — `/prd-update` — PRD v2 corrected: no Comparison₂ in page flow; post-HIW = Feature grid → Social proof → Pricing.
- **2026-07-02** — `/prd-review` — PRD v2 **re-approved** by human.
- **2026-07-02** — `/to-issues` — GH#8 cancelled; slices 6–9 renumbered on #10, #9, #11, #12.
- **2026-07-02** — `/spec-author` — Gherkins updated (10 @fe + 1 @be; GH#8 removed).
- **2026-07-02** — `/scenario-review` — Gherkins **approved** by human.
- **2026-07-02** — `/figma-extract` GH#9 Social proof — nodes `5164:6568`, `5164:6836`, `5307:6608`, `5164:11204`; 20 assets exported; `validate:figma-extract` pass (clients-animation-alt @4×).
- **2026-07-02** — `/ui-registry-build` GH#9 Social proof — 224 `socialProof.*` paths; registry total 1534; `ui-registry:validate` + `validate:layout` pass (28 leaf slugs).
- **2026-07-02** — Reverted GH#8 Comparison₂ artifacts (registry, contract, figma cache, slice-roots).
- **2026-07-02** — `/fe-implement` GH#10 Feature grid — `FeatureGridSection`; typography constants + plane positioning; e2e/visual/typography gates pass; **human APPROVE pending**.
- **2026-07-02** — `/design-contract` GH#9 Social proof — contract §2 + slice appendix; added `spacing.120` primitive; 19 assets in `notes.md`; Gherkin sub-component visibility steps; `validate:figma-coverage` + `validate:contract` pass.
- **2026-07-02** — `/fe-implement` GH#9 Social proof — `SocialProofSection`; wired after `FeatureGridSection`; e2e/visual/typography gates pass; **human APPROVE pending**.
