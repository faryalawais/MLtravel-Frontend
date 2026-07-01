# PRD v2 — LP-001 Landing page

> **Enriched from PRD v1 on 2026-07-01.** Approved PRD v1 at: `docs/features/LP-001/prd-v1.md`  
> **Figma source:** `h6BqI1ZRMSJxR7jESNF0Ep` · analysed via Figma REST API (`/files/.../nodes`).

**Product:** Pixel-accurate, responsive landing page for ML Travel — static marketing content with shared Navbar and Footer reused across the site.  
**Design source:** [Landing page — faryal](https://www.figma.com/design/h6BqI1ZRMSJxR7jESNF0Ep/ML-Travel-Project--faryal-updated-?node-id=5164-6346&p=f&m=dev)  
**Parent ticket:** LP-001

---

## Problem

Travel agency owners and operations leads evaluating booking platforms need a compelling first impression and a clear value proposition before they commit to a live demo or read deeper pages. Without a polished, trustworthy landing experience, prospects cannot quickly assess whether ML Travel is worth their time.

---

## Goals

- Guest can view the full landing page matching Figma at **desktop (1440px)** and **mobile (393px)** breakpoints with strict visual sign-off.
- Navbar, Hero CTA, and Footer provide clear paths to `/contact` (demo booking) and `/how-it-works`.
- Shared site chrome (Navbar, Footer) is built once in LP-001 and reused on F-002 and F-003 without duplication.
- API-first mandatory: feature-split → **LP-001.1** (minimal BE health stub) then **LP-001.2** (UI).
- Spacing corrections are tracked in Figma; implementation targets **post-fix** frames.

---

## Users

| Persona | Needs |
|---------|-------|
| **Travel agency owner / operations lead** | Understand ML Travel's value proposition at a glance; navigate to demo booking or deeper product pages; trust the brand from visual polish. |
| **Prospect (guest)** | Browse without login; read pricing, social proof, and feature highlights; book a demo via Contact. |

---

## Scope

### In scope

- **Static marketing content** — copy, images, and links hardcoded from Figma (English only).
- **Responsive layout** — each vertical slice ships **desktop + mobile together** from Figma.
- **Shared chrome** — Navbar / mobile top bar and Footer as reusable components.
- **Landing sections** — per **visual order** on `D4-Desktop` / `D4-Mobile` (see Figma Analysis).
- **Motion** — hovers, focus states, section motion per Figma + motion specs in `tokens/`.
- **Routes** — `/`, `/contact`, `/how-it-works`; nav CTA → `/contact`.
- **Design tokens** — no raw hex or px in components.
- **LP-001.1** — `GET /api/health` stub in MLtravel-Backend.

### Out of scope

- F-002 contact flow, F-003 page content (except shared chrome).
- CMS, i18n, dynamic APIs, Calendly embed.
- `Placeholder Content` node `5187:3101` on desktop (design artefact — do not implement unless design reactivates).

---

## Feature requirements

### LP-001 — Landing page (D4)

**Story intent:** As a travel agency owner I want a landing page that explains ML Travel's value proposition so I can decide whether to book a demo.

**Must deliver:** Full landing at `/` with all sections in Figma visual order; shared Navbar/Footer on all marketing routes; motion and token discipline per v1.

**API-first:**

| Slice | Type | Notes |
|-------|------|-------|
| LP-001.1 | BE stub | `GET /api/health` — gate only |
| LP-001.2 | UI | All landing sections + shared chrome |

**Registry roots:** `screen.landing.*`, `component.landing.*`, `component.navbar.*`, `component.footer.*`

---

## Requirements (cross-cutting)

### Design and tokens

- Figma = layout, copy, images, motion behaviour.
- Tokens = values in code (`primitives.json`, `semantics.json`, `typography.json`).
- Per slice: `figma-extract` → `design-contract` → `fe-implement`.

### API and data

- No landing content APIs. LP-001.1 health stub documented via `openapi-author` in MLtravel-Backend.

### Quality gates

- `npm run gate:api` (BE) · `npm run gate` (FE) · human visual sign-off (desktop + mobile).

---

## Non-functional

- **Stack:** Next.js App Router, TypeScript, Tailwind, Playwright BDD.
- **Accessibility:** WCAG AA — landmarks, visible focus rings, semantic tokens for contrast.
- **Security:** Public pages; no auth on LP-001.
- **Performance:** Static content; optimised Figma image exports; no blocking API on landing load.

---

## Figma Analysis

### Page structure

| Canvas / page | NodeId | Notes |
|---------------|--------|-------|
| 🟣 Landing D4 | `5164:6346` | Page canvas (LP-001 anchor) |
| **D4-Desktop** | `5164:6558` | 1440×6544 — primary desktop frame |
| **D4-Mobile** | `5164:6569` | 393×8874 — primary mobile frame |

### Screens / frames reviewed

| Frame name | Desktop nodeId | Mobile nodeId | Description |
|------------|----------------|---------------|-------------|
| Navbar | `5164:6559` | `5164:7031` (`PremiumTravelPlatform`) | Brand, nav links, CTA; mobile = compact top bar + CTA |
| HeroSection | `5164:6560` | `5164:7080` (`Frame 2095585155`) | Hero + partner/airline logo strip |
| ProblemSection | `5164:6561` | `5164:6571` (`ProblemPanelsSection`) | Problem statement panels |
| ComparisonSection (1st) | `5164:6566` | `5164:6609` (`ComparisonSection — v3 FINAL`) | First comparison block (desktop y≈1583) |
| HowItWorksSection | `5164:6567` | `5164:6690` (`How It Works`) | Landing HIW teaser (not F-003 page) |
| ComparisonSection (2nd) | `5164:6563` | — | Second comparison block (desktop y≈3195); **no separate mobile frame** — confirm collapse/merge at design-contract |
| FeatureGrid | `5164:6562` | `5164:6785` (`FeatureGrid — Light Modern`) | Feature cards grid |
| SocialProofSectionBig | `5164:6568` | `5164:6836` (`Social proof`) | Testimonials + integrations strip |
| NewPricingSection | `5164:6564` | `5164:6915` (`Own it`) | Pricing tiers |
| Footer | `5164:6565` | `5164:7038` | Site footer |

### Visual section order (Y-position, confirmed via REST)

**Desktop (`5164:6558`):** Navbar → Hero → Problem → Comparison₁ (`6566`) → How-it-works → Comparison₂ (`6563`) → Feature grid → Social proof → Pricing → Footer.

**Mobile (`5164:6569`):** Top bar (`7031`) → Hero (`7080`) → Problem → Comparison → How-it-works → Feature grid → Social proof → Pricing (`Own it`) → Footer.

### Components identified

| Component | States / behaviour |
|-----------|-------------------|
| `Navbar` | default · hover (nav links, CTA per `Button/Secondary2`) · active route (where Figma specifies) |
| `NavLink` | default · hover · focus |
| `Button/Secondary2` | default · hover · focus · pressed (motion spec) |
| `HeroSection` | default · CTA click → `/contact` |
| `ProblemSection` | static panels |
| `ComparisonSection` | static comparison layout (×2 on desktop) |
| `HowItWorksSection` | static; links per Figma |
| `FeatureGrid` | static cards |
| `SocialProofSectionBig` | static testimonials + integrations |
| `NewPricingSection` | static tiers |
| `Footer` | static links |
| `PremiumTravelPlatform` (mobile) | compact header · CTA only in extracted tree |

### Navigation labels (from Figma text)

| Figma label | Route / behaviour |
|-------------|-------------------|
| Product | `/` (home) or in-page anchor — confirm at design-contract |
| How It Works | `/how-it-works` |
| Pricing | `#pricing` scroll to `NewPricingSection` on `/` |
| Book A Demo | `/contact` |

### Static content (no API)

All copy, icons, images, pricing figures, testimonials, comparison tables, feature cards, footer links, and airline/partner logos are **hardcoded from Figma exports**. No field is fetched from BE on page load.

---

## Swagger Analysis

**Swagger not yet available** — normal at this stage. `openapi-author` will produce LP-001.1 from Gherkins.

### Expected endpoints (LP-001.1 only)

| Method | Path | What it does |
|--------|------|--------------|
| `GET` | `/api/health` | Returns `200` + minimal health payload for pipeline gate |

No landing-page content endpoints.

### Response fields used by UI

None — LP-001 UI does not consume BE response bodies. Health endpoint is gate-only (not rendered on landing).

---

## Data Points FE Needs from BE

| UI Component | Data field | Source endpoint | Response path |
|-------------|-----------|-----------------|---------------|
| *(none — static landing)* | — | — | — |
| *(LP-001.1 gate only)* | `status` | `GET /api/health` | `$.status` (or equivalent — defined by `openapi-author`) |

> **Note:** Landing page is 100% static. The Data Points table is intentionally empty for UI content. The health stub exists only to satisfy the BE-before-FE pipeline gate.

---

## Edge Cases

| Case | Expected behaviour |
|------|-------------------|
| **Two Comparison sections on desktop, one on mobile** | Implement desktop `6566` + `6563` in order; mobile uses `6609` only — design-contract confirms whether second block is omitted or merged on mobile |
| **Placeholder node `5187:3101`** | Exclude from implementation |
| **Figma spacing not yet updated** | Do not implement against stale spacing; wait for designer Figma fix per Q9 grill decision |
| **Token vs Figma value mismatch** | Update token export; never hard-code raw px/hex |
| **Missing / broken image export** | Show broken-image fallback in dev; block visual sign-off until asset fixed |
| **Unknown route** | Next.js 404 page (not LP-001 scope but chrome may appear when F-002/F-003 exist) |
| **Slow network** | Static page renders without waiting on API; no loading skeletons for content |
| **API health failure** | No user-visible impact on landing (health not called on page load) |
| **Keyboard navigation** | All interactive nav/CTA elements focusable with visible focus ring per tokens |

---

## Updated Acceptance Criteria

1. Guest on `/` at **1440px** width sees all desktop sections in Figma Y-order: Navbar, Hero, Problem, Comparison₁, How-it-works, Comparison₂, Feature grid, Social proof, Pricing, Footer.
2. Guest on `/` at **393px** width sees mobile frame layout: top bar, Hero, Problem, Comparison, How-it-works, Feature grid, Social proof, Pricing, Footer.
3. `component.navbar` shows Figma labels; **How It Works** navigates to `/how-it-works`; **Book A Demo** navigates to `/contact`.
4. Hero primary CTA navigates to `/contact`.
5. **Pricing** nav control scrolls to pricing section on `/` (or navigates per design-contract).
6. Each section matches Figma layout, typography, color, spacing (tokens), and motion at both breakpoints.
7. `component.navbar` and `component.footer` on `/contact` and `/how-it-works` match LP-001 shared implementation.
8. No raw hex or px in component code — token lint passes.
9. `GET /api/health` returns `200` when LP-001.1 is deployed.
10. Visual sign-off: strict pixel match to **current** Figma file after spacing fixes.
11. Motion: button hover/focus and section motion match `MOTION-SPEC` where Figma indicates interaction.
12. Slice 1 (Navbar / mobile top bar) can be demoed standalone before Hero is built.

---

## Definition of Done

- [ ] All ACs above have Gherkin scenarios (`spec-author`)
- [ ] All Figma data-bound fields have source endpoints *(N/A — static; health stub only for BE)*
- [ ] Empty states covered *(N/A for static marketing — no dynamic lists)*
- [ ] Error states covered *(asset failures, keyboard focus documented in design-contract)*
- [ ] Mobile node IDs mapped per section in `features/backlog.yaml`
- [ ] `figma-extract` cache populated under `features/LP-001/figma/`
- [ ] Human `prd-review` approval on this document
- [ ] Human visual sign-off per slice before `status: approved`

---

## Appendix — Full Figma catalog

### Desktop + mobile mapping

| # | Section | Desktop nodeId | Mobile nodeId | Slice |
|---|---------|----------------|---------------|-------|
| 1 | Navbar | `5164:6559` | `5164:7031` | 1 |
| 2 | Hero | `5164:6560` | `5164:7080` | 2 |
| 3 | Problem | `5164:6561` | `5164:6571` | 3 |
| 4 | Comparison (1st) | `5164:6566` | `5164:6609` | 4 |
| 5 | How-it-works | `5164:6567` | `5164:6690` | 5 |
| 6 | Comparison (2nd) | `5164:6563` | — | 6 |
| 7 | Feature grid | `5164:6562` | `5164:6785` | 7 |
| 8 | Social proof | `5164:6568` | `5164:6836` | 8 |
| 9 | Pricing | `5164:6564` | `5164:6915` | 9 |
| 10 | Footer | `5164:6565` | `5164:7038` | 10 |

### Parent frames

| Frame | nodeId |
|-------|--------|
| Landing canvas | `5164:6346` |
| D4-Desktop | `5164:6558` |
| D4-Mobile | `5164:6569` |
