# Feature Memory — HIW-003: How It Works

## Feature Identity
- **Parent ticket:** HIW-003
- **FE ticket:** HIW-003-FE
- **BE ticket:** HIW-003-BE
- **Status:** contracted (slice 1 — GH#18 hero)
- **Last updated:** 2026-07-06
- **Git branch:** `feature/HIW-003-FE`
- **Grill-me:** complete (11 decisions)
- **Figma file key:** `h6BqI1ZRMSJxR7jESNF0Ep`
- **Figma anchor:** `5217:6696` (How It Works canvas)
- **Figma layout frames:** `5217:6697` (HIW-Desktop · 1440px) · `5217:6715` (HIW-Mobile · 393px)
- **Renamed from:** F-003 (2026-07-06)

---

## Grill-me decisions (2026-07-06)

| # | Decision |
|---|----------|
| 1 | **F-003 renamed to HIW-003** — single canonical parent ID; `features/F-003/` and `docs/features/F-003/` retired |
| 2 | **No HIW-003 BE API** — static FE-only page; pipeline BE gate via existing health stub (same pattern as CP-002) |
| 3 | **Dual pixel-match** — desktop `5217:6697` @ 1440px + mobile `5217:6715` @ 393px; separate visual baselines; mobile layout below `md`, desktop at `lg+` |
| 4 | **Reuse layout chrome** — `SiteNav` + `SiteFooter` from `app/layout.tsx`; HIW page = content sections only; Navbar/Footer excluded from figma-extract slices (hero starts at `5217:6699`) |
| 5 | **All Figma motion in scope** — extract motion chains per section via `figma-extract`; token-based durations; Playwright motion specs under `component.how-it-works.*` (separate from LP-001 teaser) |
| 6 | **Per-breakpoint section order** — follow each Figma frame's scroll order exactly; mobile-only blocks (testimonial quote + stats grid) render on mobile only; desktop order: Hero → Steps → Mid CTA → Six Week → Final CTA → FAQ |
| 7 | **All demo CTAs → `/contact`** — hero, mid-page, final CTA, and inline demo links navigate to CP-002 Calendly page |
| 8 | **FAQ: tabs + single-open accordion** — category tabs filter static question groups client-side; one question expanded at a time; first question in default tab open on load |
| 9 | **Reuse-first from LP-001** — audit every HIW slice against landing Figma; full reuse: `HowItWorksTeaserSection`, mobile hero+stats (`HeroSection` variant), `SocialProofSection` testimonial, `HeroPrimaryCta`, layout chrome; net-new only when no LP-001 match |
| 10 | **English only** — hardcoded Figma copy; no i18n or locale switching (matches LP-001 / CP-002) |
| 11 | **7 sequential slices** — one `/fe-implement` pass per Figma section: Hero → Steps → Mid CTA → Six Week → Mobile testimonial/stats → Final CTA → FAQ; each slice includes desktop + mobile + motion |

### Slice grill-me (2026-07-06)

| # | Decision |
|---|----------|
| S1 | Slices #18–#25 granularity approved — 8 sequential issues; Gherkins **1:1** per issue |
| S2 | Each `@fe` scenario asserts **dual pixel-match** — 1440px + 393px where Figma has both; mobile-only slices (#22, #23) assert visible @ 393px + absent @ 1440px; mid CTA (#20) desktop only |
| S3 | **Motion split** — Gherkins: layout, copy, CTA, FAQ interaction; separate `*-motion.spec.ts` per net-new slice; reused slices (#19, #22) use existing LP-001 motion specs |
| S4 | **Reuse visual baselines** — #19 / #22 use LP-001 component baselines; HIW e2e smoke for composition only; section baselines for net-new slices; full-page baselines on #25 |
| S5 | **#18 mobile hero** — extend `HeroSection` with `layout="hiw-page"` variant (hide panel, logos, secondary CTA); desktop `5217:6699` = separate thin wrapper + `HeroPrimaryCta` |

### Slice order (fe-implement)

| # | Section | Desktop node | Notes |
|---|---------|--------------|-------|
| 1 | Hero | `5217:6699` / `5217:7073` | Mobile: reuse `HeroSection` variant. Desktop: net-new wrapper + `HeroPrimaryCta` |
| 2 | Three-step How It Works | `5164:6567` (reuse) | `HowItWorksTeaserSection`; hide footer link |
| 3 | Mid CTA | `5217:6701` | Net-new + `HeroPrimaryCta` |
| 4 | Six-week timeline | `5217:6705` | Net-new |
| 5 | Testimonial + benefits | `5217:6867` / `5217:6883` | Reuse social proof testimonial; net-new benefits stats |
| 6 | Final CTA | `5217:7555` | Net-new + `HeroPrimaryCta` |
| 7 | FAQ | `5261:8072` | Net-new |

---

## Pipeline log
- **2026-07-06** — `/feature-brief` created (renamed from F-003).
- **2026-07-06** — `/grill-me` complete — 11 decisions locked (see above).
- **2026-07-06** — `/prd-author` → `docs/features/HIW-003/prd-v1.md` (Figma-first skeleton; steps section reuses LP-001 teaser per PRD grilling).
- **2026-07-06** — `/prd-review` — PRD v1 **approved** by human.
- **2026-07-06** — `/prd-update` → `docs/features/HIW-003/prd-v2.md`.
- **2026-07-06** — PRD v2 revised — reuse-first policy from LP-001 (human request).
- **2026-07-06** — `/prd-review` — PRD v2 **approved** by human.
- **2026-07-06** — `/ticket-generate` → `HIW-003-FE`, `HIW-003-BE` (BE waived).
- **2026-07-06** — `/to-issues` — GitHub #18–#25 published (8 FE slices; full Figma coverage map in `tickets/issues.md`).
- **2026-07-06** — `/grill-me` slice pass complete — S1–S5 locked (see Slice grill-me).
- **2026-07-06** — `/spec-author` → `features/HIW-003/HIW-003.feature` (8 @fe scenarios, GH#18–#25).
- **2026-07-06** — `/scenario-review` approved → `/gherkin-validate` all checks passed (paths fixed: `component.howItWorks.*`).
- **2026-07-06** — `figma-extract:rest` slice 1 (GH#18) — node `5217:6699`; `validate:figma-extract` pass.
- **2026-07-06** — Git branch `feature/HIW-003-FE` created (from `feature/cp-002-fe`).
- **2026-07-06** — `/design-contract` slice 1 (GH#18) → `features/HIW-003/contract.md`; `validate:contract` pass.

---

## PRD v1

See [`docs/features/HIW-003/prd-v1.md`](../../docs/features/HIW-003/prd-v1.md).

<!-- Approved by: human on 2026-07-06 -->

---

## PRD v2

<!-- Written by: prd-update on 2026-07-06 -->
<!-- Revised: 2026-07-06 — reuse-first from LP-001 per human review -->
<!-- Approved by: human on 2026-07-06 -->

Full file: [`docs/features/HIW-003/prd-v2.md`](../../docs/features/HIW-003/prd-v2.md)

### Summary

- Screens: 2 layout frames (desktop + mobile) + 7 implementation slices
- ACs: 14
- LP-001 reuses: navbar, footer, hero mobile variant, HIW teaser, social proof testimonial, HeroPrimaryCta
- Net-new: desktop hero wrapper, mid CTA, six-week, benefits stats, final CTA, FAQ
- Data-bound fields: 0 (fully static; health stub gate only)
- Edge cases: 10

---

## Gherkins

<!-- Written by: spec-author -->
<!-- Reviewed by: human on 2026-07-06 — approved -->
<!-- Validated by: gherkin-validate on 2026-07-06 — all checks passed -->
<!-- @fe scenarios: 8 | @be scenarios: 0 -->

Shared file: [`features/HIW-003/HIW-003.feature`](HIW-003.feature) — 8 `@fe` scenarios (1:1 with GitHub #18–#25).
Motion excluded per slice grill-me S3; health gate inherited from LP-001 GH#2.
Full file: features/HIW-003/HIW-003.feature

---

## UI Registry

<!-- Written by: ui-registry-build on 2026-07-06 — slice 1 (GH#18) -->
<!-- Validated by: registry-validate — passed 2026-07-06 (45 hero paths) -->

Full file: `tokens/ui-registry.json`

### Slice 1 — Hero (GH#18)

| Path | Figma node | Notes |
|------|------------|-------|
| `component.howItWorks.hero` | `5217:6699` | Desktop HIWHeroSection — Gherkin alias → `.root` |
| `component.howItWorks.hero.demoCta` | `I5217:6699;5218:6544;5218:14` | Book A Free Demo → `/contact` |
| `component.howItWorks.hero.statsStrip` | `I5217:6699;5218:6556` | Desktop hero stats row |
| Mobile hero | `5217:7073` | **Reuse** `component.landing.hero` (`hiw-page` variant) — no HIW registry entries |

`screen.howItWorks.page` → `$figmaNode` `5217:6697`

---

## FE Contract

<!-- Written by: design-contract on 2026-07-06 — slice 1 (GH#18 hero) -->
<!-- Validated: validate:figma-coverage + validate:contract — passed 2026-07-06 -->

Full file: [`features/HIW-003/contract.md`](contract.md)

Slices #19–#25 append in later contract passes after figma-extract per slice.

---

## BE Contract
<!-- To be written by: openapi-author + business-logic-author + orm-schema-author -->

---

## Implementation Notes

### FE notes
<!-- Written by: fe-implement on 2026-07-06 -->
- Components implemented: `HowItWorksHeroSection`, `HeroSection` (`layout="hiw-page"`), `/how-it-works` page
- Motion: `HIW-hero-animation` staged-sequence via `getHiwHeroLayerMotionStyle` + `runHeroMotion`; CTA slot at `HIW_HERO_CTA_SLOT_TOP_PX` (overlap fix)
- test:e2e: passed (GH#18 — 2 scenarios in `hiw-003.smoke.spec.ts`)
- test:visual: passed (`hiw-003.spec.ts`, `hiw-hero-motion.spec.ts`)
- typecheck: pass on slice files (pre-existing `cp-002.spec.ts` error unchanged)
- token-lint: not scaffolded
- Deviations: mobile stats reuse LP-001 `MOBILE_STATS`; `hero.group` icon subtree not individually test-id'd
- Human review: APPROVED on 2026-07-06 (GH#18)
- GH#19: `HowItWorksTeaserSection` on `/how-it-works` with `showFooterLink={false}` (reuse LP-001 `5164:6567` / `5164:6690`)
- Human review: APPROVED on 2026-07-06 (GH#19)
- GH#19 patch: onboarding note visible on HIW route; `HiwFooterMotionSlot` reserves space during cascade (overlap fix)
- GH#20: `HowItWorksMidCtaSection` desktop band `5217:6701` + `HeroPrimaryCta` → `/contact`; hidden below `lg`

<!-- To be written by: be-implement -->

---

## Gate Results
<!-- To be written by: impl-gate -->
