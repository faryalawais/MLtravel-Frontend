# PRD v2 — HIW-003 How It Works

> **Enriched from PRD v1 on 2026-07-06.** Approved PRD v1 at: `docs/features/HIW-003/prd-v1.md`  
> **Figma source:** `h6BqI1ZRMSJxR7jESNF0Ep` · analysed via Figma Desktop MCP (canvas `5217:6696`).

**Product:** How It Works page at `/how-it-works` — standalone explainer with hero, reused landing three-step section, six-week onboarding timeline, FAQ, and demo CTAs; shared Navbar and Footer from LP-001.  
**Design source:** [How It Works — faryal-updated](https://www.figma.com/design/h6BqI1ZRMSJxR7jESNF0Ep/ML-Travel-Project--faryal-updated-?node-id=5217-6696&p=f&m=dev)  
**Parent ticket:** HIW-003

---

## Problem

Visitors exploring ML Travel cannot see how the product works or what onboarding involves. Without a dedicated How It Works page, the value proposition and six-week onboarding flow stay opaque, which reduces confidence before booking a demo.

---

## Goals

- **Reuse-first from LP-001** — every HIW slice must audit against landing Figma nodes; compose existing `components/landing/*` and `components/shared/*` when structure matches 1:1; build new `components/how-it-works/*` only for net-new sections.
- Guest can read the full How It Works story on `/how-it-works` with desktop (`5217:6697` @ 1440px) and mobile (`5217:6715` @ 393px) layouts matching Figma.
- All demo CTAs navigate to `/contact` (CP-002).
- Shared `component.navbar` and `component.footer` from LP-001 via root layout.
- API-first: **HIW-003.1** (waived) then **HIW-003.2** (UI). Pipeline BE gate via LP-001 health stub.

---

## Users

| Persona | Needs |
|---------|-------|
| **Every visitor** | Understand how ML Travel works and what switching involves before committing to a demo. |
| **Travel agency owner / operations lead** | Clarity on onboarding timeline, product steps, and effort; path to book a demo. |

No secondary persona with different HIW-003 requirements in v1.

---

## Scope

### In scope

- **Route** — `/how-it-works` (`screen.how-it-works.page`).
- **Reuse-first policy** — before any slice is built, `figma-extract` + `design-contract` compare HIW nodes to LP-001 equivalents; reuse landing/shared components when Figma structure and tokens match; only net-new sections get `component.how-it-works.*` registry paths.
- **Shared chrome** — LP-001 Navbar + Footer via `app/layout.tsx`; **gate:** LP-001 slices through Hero, How-it-works teaser, Social proof, and Footer must be `fe-implemented` before HIW-003.2.
- **Confirmed LP-001 reuses** (see reuse map below): `HowItWorksTeaserSection`, mobile hero+stats block, `SocialProofSection` testimonial card, `HeroPrimaryCta`, motion/typography primitives.
- **Net-new HIW sections** — desktop hero instance, mid CTA, six-week timeline, mobile benefits stats row, final CTA, FAQ.
- **Motion** — Figma dev-mode animations on net-new sections; reused landing sections keep existing LP-001 motion specs.
- **Static copy** — English only; reuse `landing.constants` where sections are shared.
- **Responsive** — dual pixel-match desktop 1440px + mobile 393px.
- **HIW-003.1** — **waived**: no HIW-specific BE API.

### Out of scope

- Duplicating any LP-001 component that already matches HIW Figma 1:1.
- HIW OpenAPI, CMS, i18n.
- CP-002 contact flow (CTAs link only).
- Navbar/Footer as HIW slices (layout chrome).

---

## Feature requirements

### HIW-003 — How It Works

**Story intent:** As a visitor I want to understand how ML Travel works and the onboarding timeline so I can decide whether to book a demo.

**API-first:**

| Slice | Type | Notes |
|-------|------|-------|
| HIW-003.1 | BE waived | No HIW API; reuse LP-001 `GET /api/health` for pipeline gate |
| HIW-003.2 | UI | `/how-it-works` page sections + reused teaser + FAQ interaction |

**Registry roots:** `screen.how-it-works.*`; `component.how-it-works.*` (net-new only); reused paths stay under `component.landing.*`, `component.navbar`, `component.footer`

**Depends on:** LP-001 (`fe-implemented`): Navbar, Footer, Hero, How-it-works teaser, Social proof (for testimonial reuse).

---

## Requirements (cross-cutting)

### Design and tokens

- **Reuse-first:** LP-001 components are the source of truth when HIW Figma nodes match (`5164:*` ↔ `5217:*` crosswalk in reuse map).
- Net-new HIW sections: Figma = layout, copy, spacing, motion.
- Per slice: `figma-extract` → LP-001 reuse audit → `design-contract` → `fe-implement`.
- Navbar/Footer excluded from HIW figma-extract slices.

### API and data

- No HTTP contracts for HIW-003 content in v1.

### Quality gates

- `npm run gate` (FE) after HIW-003.2 slices.
- Human visual sign-off vs Figma `5217:6697` (desktop) and `5217:6715` (mobile).
- E2E: route smoke, CTA → `/contact`, FAQ tab + accordion.
- Motion: Playwright specs per animated section.

---

## Non-functional

- **Stack:** Next.js App Router, TypeScript, Tailwind CSS, Playwright.
- **Accessibility:** WCAG AA — semantic headings, keyboard FAQ tabs/accordion, focus states, meaningful CTA labels.
- **Security:** Public page; no auth; no HIW API calls.
- **Performance:** Static page; CSS/token motion; no blocking API on load.

---

## Figma Analysis

### Page structure

| Frame | NodeId | Size | Role |
|-------|--------|------|------|
| **HIW-Desktop** | `5217:6697` | 1440×3778 | Canonical desktop layout |
| **HIW-Mobile** | `5217:6715` | 393×4981 | Canonical mobile layout |
| HIW canvas | `5217:6696` | — | Parent canvas anchor |

> **Navbar/Footer in Figma frames** — `5217:6698`, `5217:6714` (desktop), `5217:7031` / `5217:7112` (mobile) are **reference only**; implementation uses LP-001 layout chrome.

### Visual layout order — desktop (`5217:6697`)

| Order | Region | NodeId | HIW-003 implementation |
|-------|--------|--------|------------------------|
| — | Navbar | `5217:6698` | LP-001 `component.navbar` (layout) |
| 1 | Hero + mobile stats top | `5217:6699` / `5217:7073` | **Mobile:** reuse `HeroSection` variant (`5164:7080` subtree — headline, single CTA, 4-tile stats; omit panel + logos). **Desktop:** HIW-specific `HIWHeroSection` — reuse `HeroPrimaryCta` + landing typography tokens |
| 2 | Three-step How It Works | `5217:6700` / `5164:6567` | **Reuse** `HowItWorksTeaserSection`; hide footer link on `/how-it-works` |
| 3 | Mid CTA | `5217:6701` | Net-new wrapper; reuse `HeroPrimaryCta` for button |
| 4 | Six-week timeline | `5217:6705` / `5217:6812` | Net-new; may reuse `SectionPill` / `AccentBar` patterns from landing |
| 5 | Final CTA | `5217:7555` / `5217:7583` | Net-new copy block; reuse `HeroPrimaryCta` |
| 6 | FAQ | `5261:8072` / `5261:8150` | Net-new |
| — | Footer | `5217:6714` | LP-001 `component.footer` (layout) |

### Visual layout order — mobile (`5217:6715`)

| Order | Region | NodeId | HIW-003 implementation |
|-------|--------|--------|------------------------|
| — | Mobile nav bar | `5217:7024` | LP-001 `component.navbar` (layout) |
| 1 | Hero + stats top | `5217:7073` | **Reuse** `component.landing.hero.mobile` variant (same `Frame 2095585155` family as `5164:7080`; trimmed — no product panel, no logos strip) |
| 2 | Three-step cards | `5217:6717` subtree | **Reuse** `component.landing.howItWorksTeaser.mobile` |
| 3 | Six-week timeline | `5217:6812` | Net-new `component.how-it-works.sixWeek` |
| 4 | Testimonial quote | `5217:6867` (`test`) | **Reuse** `component.landing.socialProof` testimonial card (Moazam Arshad) — mobile only |
| 5 | Benefits stats row | `5217:6883` (`stat`) | Net-new `component.how-it-works.benefitsStats` — mobile only (*"Zero booking fees"*, etc.; **not** the hero `$3,000/mo` grid) |
| 6 | Final CTA | `5217:7583` | Net-new copy; reuse `HeroPrimaryCta` |
| 7 | FAQ | `5261:8150` | Net-new `component.how-it-works.faq` |
| — | Footer | `5217:7112` | LP-001 `component.footer` (layout) |

> **No mid CTA frame on mobile** at same position as desktop `5217:6701` — verify during `figma-extract` whether mid CTA is omitted or embedded elsewhere on mobile; if absent, do not render on mobile.

### Screens / frames reviewed

| Frame name | NodeId | Description |
|------------|--------|-------------|
| HIW-Desktop | `5217:6697` | Full desktop scroll — hero through FAQ |
| HIW-Mobile | `5217:6715` | Full mobile scroll — includes testimonial + stats |
| HIWHeroSection | `5217:6699` | Desktop hero instance |
| HowItWorksSection | `5217:6700` | Desktop steps reference — **reuse LP-001 `5164:6567`** |
| S4-MidCTA | `5217:6701` | *"Seen enough? Let's show you a live demo."* + primary button |
| SixWeekSection | `5217:6705` | 6-week onboarding timeline (Week 1–6 cards) |
| FinalCTASection | `5217:7555` | Closing headline + demo button |
| FAQSection | `5261:8072` / `5261:8150` | Category tabs + accordion Q&A |
| Landing HIW teaser | `5164:6567` / `5164:6690` | Reused three-step section |

### LP-001 reuse map (Figma crosswalk)

| HIW region | HIW nodeId | LP-001 nodeId | LP-001 component | Reuse action |
|------------|------------|---------------|------------------|--------------|
| Navbar | `5217:6698` / `5217:7024` | `5164:6559` / `5164:7031` | `SiteNav`, `MobileNavbar` | Compose from layout — no HIW slice |
| Footer | `5217:6714` / `5217:7112` | `5164:6565` / `5164:7038` | `SiteFooter` | Compose from layout — no HIW slice |
| Mobile hero + stats top | `5217:7073` | `5164:7080` | `HeroSection` (mobile) | **Reuse** with variant props: single primary CTA, hide product panel + logos strip |
| Desktop hero | `5217:6699` | `5164:6560` | `HeroSection` (desktop) | **Partial reuse** — HIW `HIWHeroSection` instance differs; share `HeroPrimaryCta`, typography tokens, motion helpers |
| Three-step section | `5217:6700` | `5164:6567` | `HowItWorksTeaserSection` | **Full reuse** — hide footer link on `/how-it-works` |
| Three-step (mobile) | `5217:6717` | `5164:6690` | `HowItWorksTeaserSection` (mobile) | **Full reuse** |
| Testimonial (mobile) | `5217:6867` | `5164:6836` | `SocialProofSection` | **Reuse** testimonial card (Moazam Arshad — already in `landing.constants`) |
| Demo CTAs (all) | various `Button/Primary` | LP-001 CTAs | `HeroPrimaryCta` | **Reuse** — all link to `/contact` |
| Mid CTA | `5217:6701` | — | — | Net-new text row + `HeroPrimaryCta` |
| Six-week timeline | `5217:6705` / `5217:6812` | — | — | Net-new (may borrow `SectionPill` / `AccentBar` atoms) |
| Mobile benefits stats | `5217:6883` | — | — | Net-new — different content from hero `$3,000/mo` stats grid |
| Final CTA | `5217:7555` / `5217:7583` | — | — | Net-new copy + `HeroPrimaryCta` |
| FAQ | `5261:8072` / `5261:8150` | — | — | Net-new |

> **Reuse audit rule:** `design-contract` documents each row as `reuse` | `variant` | `net-new` before `/fe-implement`.

### Components identified

| Component | Registry path | Source | States / behaviour |
|-----------|---------------|--------|-------------------|
| Navbar | `component.navbar` | LP-001 reuse | layout chrome |
| Footer | `component.footer` | LP-001 reuse | layout chrome |
| Hero (mobile top) | `component.landing.hero.mobile` | LP-001 **reuse variant** | HIW page: single CTA, stats grid, no panel/logos |
| Hero (desktop) | `component.how-it-works.hero` | Net-new wrapper | reuses `HeroPrimaryCta` + landing typography |
| Three-step section | `component.landing.howItWorksTeaser` | LP-001 **full reuse** | hover cascade · footer link hidden on `/how-it-works` |
| Mid CTA | `component.how-it-works.midCta` | Net-new | desktop only · `HeroPrimaryCta` |
| Six-week timeline | `component.how-it-works.sixWeek` | Net-new | scroll/progress motion |
| Testimonial (mobile) | `component.landing.socialProof` | LP-001 **reuse** | single testimonial card — mobile only |
| Benefits stats (mobile) | `component.how-it-works.benefitsStats` | Net-new | 4 benefit tiles — mobile only |
| Final CTA | `component.how-it-works.finalCta` | Net-new | `HeroPrimaryCta` → `/contact` |
| FAQ | `component.how-it-works.faq` | Net-new | tabs · single-open accordion |
| Primary CTA button | `component.landing.hero.primaryCta` | LP-001 **reuse** | shared across all demo buttons |

### Static content (no API) — key copy samples

| Section | Figma text (sample) | Implementation |
|---------|---------------------|----------------|
| Mid CTA | *"Seen enough? Let's show you a live demo."* | `constants/how-it-works.constants.ts` |
| Mobile hero + stats | *"Stop paying per booking…"* + `$3,000/mo` grid | LP-001 `landing.constants` (hero) |
| Steps (reuse) | *"From contract to booking in three steps."* | LP-001 `landing.constants` |
| Testimonial (reuse) | Moazam Arshad quote | LP-001 `SOCIAL_PROOF_*` constants |
| Benefits stats | *"Zero booking fees"*, *"Full white-label"*, etc. | `constants/how-it-works.constants.ts` |
| Six-week header | *"Live in 6 weeks. Here's exactly what happens."* | constants |
| Final CTA | *"Your agents could be searching every GDS from one screen in 6 weeks."* | constants |
| FAQ | Tab labels + Q&A pairs from `5261:8072` | constants (all groups) |
| Testimonial | Quote + *"Moazam Arshad, Founder & CEO"* | LP-001 `landing.constants` — mobile only |
| Hero stats grid | `$3,000/mo`, `40%`, `6 Weeks`, `500+` | LP-001 hero constants — mobile only |

### Navigation (LP-001 shared)

| Figma label | Route |
|-------------|-------|
| Product | `/` |
| How It Works | `/how-it-works` |
| Pricing | `#pricing` on `/` |
| Book A Demo | `/contact` |

All HIW page demo buttons → `/contact`.

---

## Swagger Analysis

**Swagger not yet available** — normal at this stage. HIW-003 has **no content API**. `openapi-author` is **not required** for HIW domain endpoints.

### Expected endpoints (pipeline gate only — LP-001.1)

| Method | Path | What it does |
|--------|------|--------------|
| `GET` | `/api/health` | Returns `200` + minimal health payload (LP-001 stub — satisfies BE-before-FE gate) |

No How It Works-specific endpoints.

### Response fields used by UI

None — HIW-003 UI does not consume BE response bodies on page load.

---

## Data Points FE Needs from BE

| UI Component | Data field | Source endpoint | Response path |
|-------------|-----------|-----------------|---------------|
| *(none — static HIW page)* | — | — | — |
| *(HIW-003.1 gate only)* | `status` | `GET /api/health` | `$.status` (LP-001 stub — not rendered on `/how-it-works`) |

> HIW page is **fully static**. FAQ content, stats, testimonial, and timeline copy are hardcoded from Figma. No CMS or API fields. Data Points table is empty for UI content by design.

---

## Edge Cases

| Case | Expected behaviour |
|------|-------------------|
| **Guest on `/how-it-works` via navbar** | Full page loads with layout chrome + all sections in breakpoint order |
| **Three-step section on HIW page** | Same as landing; **no** footer link to `/how-it-works` (already on page) |
| **Desktop viewport** | Testimonial + benefits stats blocks **not rendered** |
| **Mobile viewport (393px)** | Reused hero+stats top, testimonial, and benefits stats visible per `5217:6715` |
| **FAQ tab switch** | Only questions for selected category visible; accordion state resets or preserves per design-contract |
| **FAQ accordion** | One question open at a time; first in default tab open on load |
| **Demo CTA click** | Navigates to `/contact` — no new tab unless design-contract specifies |
| **LP-001 gate not met** | HIW-003.2 FE **blocked** until Hero, teaser, Social proof, Navbar, and Footer are `fe-implemented` |
| **Reduced motion preference** | Respect `prefers-reduced-motion` — motion helpers degrade gracefully (per LP-001 pattern) |
| **Mid CTA on mobile** | If Figma mobile frame omits `5217:6701`, do not render mid CTA on mobile |
| **English only** | All copy hardcoded English |

---

## Updated Acceptance Criteria

1. Guest on `/how-it-works` at **1440px** sees `screen.how-it-works.page` with LP-001 `component.navbar` and `component.footer`.
2. Desktop `component.how-it-works.hero` matches Figma `5217:6699` using `HeroPrimaryCta` → `/contact`.
3. At **393px**, `component.landing.hero.mobile` variant renders headline, single CTA, and hero stats grid matching `5217:7073` (no product panel, no logos strip).
4. `component.landing.howItWorksTeaser` on `/how-it-works` matches landing behaviour with footer link hidden.
5. `component.how-it-works.midCta` shows *"Seen enough? Let's show you a live demo."* and `HeroPrimaryCta` → `/contact` at desktop width.
6. `component.how-it-works.sixWeek` shows Week 1–6 timeline per Figma `5217:6705` / `5217:6812`.
7. At **393px**, `component.landing.socialProof` testimonial card (Moazam Arshad) is visible — reused, not duplicated.
8. At **393px**, `component.how-it-works.benefitsStats` shows benefit tiles (*"Zero booking fees"*, etc.) per `5217:6883`.
9. At **1440px**, testimonial and benefits stats are **not** in the DOM.
10. `component.how-it-works.finalCta` shows closing copy and `HeroPrimaryCta` → `/contact`.
11. `component.how-it-works.faq` — category tabs filter questions; accordion single-open.
12. Net-new section motion matches Figma; reused sections pass existing LP-001 motion specs.
13. No raw hex or px — token lint passes.
14. `GET /api/health` returns `200` (gate only).

---

## Definition of Done

- [ ] All ACs above have Gherkin scenarios (`spec-author`)
- [ ] All Figma data-bound fields have source endpoints *(N/A — fully static; health stub only)*
- [ ] Empty states covered *(N/A — no dynamic lists)*
- [ ] Error states covered *(N/A — no API; FAQ/motion edge cases in scenarios)*
- [ ] `figma-extract` cache populated under `features/HIW-003/figma/`
- [ ] `design-contract` with `component.how-it-works.*` paths per slice
- [ ] Human `prd-review` approval on this document
- [ ] Human visual sign-off vs Figma desktop + mobile before `status: approved`

---

## Appendix — Implementation slices

| # | Section | nodeId | Implementation |
|---|---------|--------|----------------|
| 1 | Hero | `5217:6699` / `5217:7073` | Mobile: **reuse** `HeroSection` variant. Desktop: net-new wrapper + `HeroPrimaryCta` |
| 2 | Three-step | `5164:6567` | **Reuse** `HowItWorksTeaserSection` |
| 3 | Mid CTA | `5217:6701` | Net-new + `HeroPrimaryCta` |
| 4 | Six-week | `5217:6705` | Net-new |
| 5 | Testimonial + benefits | `5217:6867` / `5217:6883` | **Reuse** social proof testimonial; net-new benefits stats row |
| 6 | Final CTA | `5217:7555` | Net-new + `HeroPrimaryCta` |
| 7 | FAQ | `5261:8072` | Net-new |

**Motion chains:** To be extracted by `figma-extract` into `features/HIW-003/figma/motion-chains.json`.
