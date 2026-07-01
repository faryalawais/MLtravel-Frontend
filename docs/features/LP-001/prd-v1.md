# Product brief (PRD) — LP-001 Landing page

> **Version:** v1 (Figma-first skeleton)  
> **Screen detail:** To be added by `prd-update` after `figma-extract` runs (desktop + mobile frames per section).

**Product:** Pixel-accurate, responsive landing page for ML Travel — static marketing content with shared Navbar and Footer reused across the site.  
**Design source:** Figma file — [Landing page — faryal](https://www.figma.com/design/h6BqI1ZRMSJxR7jESNF0Ep/ML-Travel-Project--faryal-updated-?node-id=5164-6346&p=f&m=dev) (`h6BqI1ZRMSJxR7jESNF0Ep`, page frame `5164:6346`; section node IDs in `features/backlog.yaml`).  
**Parent ticket:** LP-001  
**Consumers:** `spec-author` → Gherkins; `openapi-author` → minimal health stub; `figma-extract` → frame measurements; `design-contract` → UI contract.

---

## Problem

Travel agency owners and operations leads evaluating booking platforms need a compelling first impression and a clear value proposition before they commit to a live demo or read deeper pages. Without a polished, trustworthy landing experience, prospects cannot quickly assess whether ML Travel is worth their time.

---

## Goals

- Guest can view the full landing page matching Figma at **desktop and mobile** breakpoints with strict visual sign-off.
- Navbar, Hero CTA, and Footer provide clear paths to `/contact` (demo booking) and `/how-it-works`.
- Shared site chrome (Navbar, Footer) is built once in LP-001 and reused on F-002 and F-003 without duplication.
- API-first mandatory: feature-split → **LP-001.1** (minimal BE health stub) then **LP-001.2** (UI).
- Spacing corrections are tracked in Figma; implementation targets **post-fix** frames (designer updates Figma first, then FE matches).

---

## Users

| Persona | Needs |
|---------|-------|
| **Travel agency owner / operations lead** | Understand ML Travel's value proposition at a glance; navigate to demo booking or deeper product pages; trust the brand from visual polish. |
| **Prospect (guest)** | Browse without login; read pricing, social proof, and feature highlights; book a demo via Contact. |

No secondary persona with different LP-001 requirements in v1.

---

## Scope

### In scope

- **Static marketing content** — copy, images, and links hardcoded from Figma (English only); no CMS, no i18n in v1.
- **Responsive layout** — each vertical slice ships **desktop + mobile together** from Figma (not a deferred mobile pass).
- **Shared chrome** — Navbar (`5164:6559`) and Footer (`5164:6565`) as reusable components on `/`, `/contact`, `/how-it-works`.
- **Landing sections** — Hero, Problem, Comparison, How-it-works (landing section), Feature grid, Social proof, Pricing, Footer.
- **Motion** — button hovers, focus states, and section motion per Figma + `tokens/MOTION-SPEC.md` (in v1, not deferred).
- **Routes** — `/` (landing), `/contact` (F-002), `/how-it-works` (F-003); Hero primary CTA → `/contact`.
- **Design tokens** — all values from `tokens/primitives.json`, `semantics.json`, `typography.json`; no raw hex or px in components.
- **LP-001.1** — minimal `GET /api/health` (or equivalent) in MLtravel-Backend so pipeline BE gate passes; no landing-specific domain APIs.

### Out of scope

- Contact booking flow (F-002).
- How It Works standalone page content (F-003) — except shared Navbar/Footer built here.
- Dynamic content (CMS, API-driven copy, pricing, testimonials).
- i18n / multi-language.
- Calendly or third-party embed configuration (F-002 scope).

---

## Feature requirements

### LP-001 — Landing page (D4)

**Story intent:** As a travel agency owner I want a landing page that explains ML Travel's value proposition so I can decide whether to book a demo.

**Must deliver:**

- Guest loads `/` and sees all landing sections in Figma order.
- Navbar links to `/contact` and `/how-it-works`; active route styling where Figma specifies.
- Hero primary CTA navigates to `/contact`.
- Each section matches Figma layout, typography, color, spacing (via tokens), and motion at desktop and mobile breakpoints.
- Navbar and Footer render identically on F-002 and F-003 routes once those pages exist.

**Acceptance (high-level — vertical slices; detailed paths in v2 after `figma-extract`):**

- Given a guest on `/` at desktop width, when the page loads, then `screen.landing` is visible and `component.navbar` shows links to `/contact` and `/how-it-works`.
- Given a guest on `/` at mobile width, when the page loads, then `screen.landing` and `component.navbar` match the mobile Figma frame for the landing page.
- Given a guest on `/`, when they activate `component.landing.hero.cta`, then navigation goes to `/contact`.
- Given a guest on `/`, when the page loads, then all landing sections (hero, problem, comparison, how-it-works, features, social proof, pricing, footer) are visible in order.
- Given a guest on `/contact` or `/how-it-works`, when the page loads, then `component.navbar` and `component.footer` match the shared LP-001 implementation (no duplicate components).
- Given LP-001.1 deployed, when `GET /api/health` is called, then response is `200` with a valid health payload (thin stub only).
- Given Figma spacing is updated by design, when FE implements a section, then visual sign-off compares app to the **current** Figma frame (strict pixel match).

**Figma:** [Landing page](https://www.figma.com/design/h6BqI1ZRMSJxR7jESNF0Ep/ML-Travel-Project--faryal-updated-?node-id=5164-6346&p=f&m=dev) — desktop section node IDs in backlog; mobile node IDs **TBD** until `figma-extract` + `prd-update`.

**API-first:**

| Slice | Type | Notes |
|-------|------|-------|
| LP-001.1 | BE stub | `GET /api/health` — gate only; no landing data APIs |
| LP-001.2 | UI | All landing sections + shared Navbar/Footer |

**Suggested implementation order (tracer bullets):**

1. Navbar — responsive, shared (`5164:6559`)
2. Hero (`5164:6560`)
3. Problem (`5164:6561`)
4. Comparison (`5164:6566`)
5. How-it-works section (`5164:6567`)
6. Feature grid (`5164:6562`)
7. Social proof (`5164:6568`)
8. Pricing (`5164:6564`)
9. Footer — shared (`5164:6565`)

Each slice: one GitHub issue, one `/fe-implement` pass, desktop + mobile in the same slice.

**Suggested registry roots:** `screen.landing.*`, `component.landing.*`, `component.navbar.*`, `component.footer.*`

---

## Requirements (cross-cutting)

### Design and tokens

- Figma is the source of truth for layout, copy, images, and motion behaviour.
- Token files are the source of truth for values in code — if Figma and tokens disagree on spacing/color, update tokens (designer re-export) then implement; never hard-code raw hex or px.
- Per slice: `figma-extract` (section frame mode) → `design-contract` → `fe-implement`.
- Motion: `tokens/MOTION-SPEC.md` + HIW spec where referenced.

### API and data

- No landing-page data APIs in v1.
- LP-001.1 documented in MLtravel-Backend OpenAPI as health-check only.

### Quality gates

- `npm run gate` (FE) after LP-001.2 slices.
- `npm run gate:api` (BE) after LP-001.1 stub.
- Human visual sign-off vs Figma (desktop + mobile) before `status: approved`.

---

## Non-functional

- **Stack:** Next.js App Router, TypeScript, Tailwind CSS, Playwright BDD (`CLAUDE.md`, `.claude/stack.yaml`). Backend health stub in MLtravel-Backend.
- **Accessibility:** WCAG AA baseline — semantic landmarks, keyboard focus visible (token-driven focus rings per Figma), sufficient color contrast via semantic tokens.
- **Security:** Public marketing pages; no auth on LP-001. No secrets in FE repo.
- **Performance:** Static content; optimize images from Figma export; no blocking API calls on landing load.

---

## Appendix — Figma screen catalog (desktop)

| Section | nodeId | Slice order |
|---------|--------|-------------|
| Landing page (page) | `5164:6346` | — |
| Navbar | `5164:6559` | 1 |
| HeroSection | `5164:6560` | 2 |
| ProblemSection | `5164:6561` | 3 |
| ComparisonSection | `5164:6566` | 4 |
| HowItWorksSection | `5164:6567` | 5 |
| FeatureGrid | `5164:6562` | 6 |
| SocialProofSectionBig | `5164:6568` | 7 |
| NewPricingSection | `5164:6564` | 8 |
| Footer | `5164:6565` | 9 |

> **Mobile frames:** To be populated by `prd-update` after `figma-extract` maps mobile node IDs per section.  
> See `features/LP-001/figma/spec.json` once extraction runs.
