# Product brief (PRD) — HIW-003 How It Works

> **Version:** v1 (Figma-first skeleton)  
> **Screen detail:** Component paths, motion chains, and mobile-only section anatomy to be added by `prd-update` after `figma-extract` + `design-contract`.

**Product:** How It Works page at `/how-it-works` — standalone explainer with hero, reused landing three-step section, six-week onboarding timeline, FAQ, and demo CTAs; shared Navbar and Footer from LP-001.  
**Design source:** Figma file — [How It Works — faryal-updated](https://www.figma.com/design/h6BqI1ZRMSJxR7jESNF0Ep/ML-Travel-Project--faryal-updated-?node-id=5217-6696&p=f&m=dev) (`h6BqI1ZRMSJxR7jESNF0Ep`). Layout frames: `5217:6697` (HIW-Desktop · 1440px), `5217:6715` (HIW-Mobile · 393px).  
**Parent ticket:** HIW-003  
**Consumers:** `spec-author` → Gherkins; `openapi-author` → none (BE waived); `figma-extract` → frame measurements; `design-contract` → UI contract.

---

## Problem

Visitors exploring ML Travel cannot see how the product works or what onboarding involves. Without a dedicated How It Works page, the value proposition and six-week onboarding flow stay opaque, which reduces confidence before booking a demo.

---

## Goals

- Guest can read the full How It Works story on `/how-it-works` with desktop (`5217:6697` @ 1440px) and mobile (`5217:6715` @ 393px) layouts matching Figma.
- The **three-step How It Works section** is identical to the landing page — reuse LP-001 `HowItWorksTeaserSection` (`5164:6567` / `5164:6690`), not rebuilt.
- Page-specific sections (hero, mid CTA, six-week timeline, mobile testimonial/stats, final CTA, FAQ) ship as new HIW-003 slices with Figma motion.
- All demo CTAs navigate to `/contact` (CP-002 Calendly page).
- Shared `component.navbar` and `component.footer` from LP-001 render via root layout — no duplicate chrome.
- API-first mandatory: feature-split → **HIW-003.1** (waived — no domain API) then **HIW-003.2** (UI). Pipeline BE gate satisfied by existing LP-001 health stub.

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
- **Shared chrome** — reuse LP-001 Navbar and Footer via `app/layout.tsx` (`component.navbar`, `component.footer`); **gate:** LP-001 Navbar + Footer must be `fe-implemented` before HIW-003.2 FE slices start.
- **Three-step section — reuse LP-001** — compose `HowItWorksTeaserSection` on `/how-it-works`; same layout, copy, and motion as landing (`component.landing.howItWorksTeaser.*`); omit or hide teaser footer link to `/how-it-works` when already on that route.
- **New page sections (HIW-003)** — hero, mid CTA, six-week timeline, mobile-only testimonial + stats, final CTA, FAQ (tabs + single-open accordion).
- **Section order** — per-breakpoint Figma scroll order; desktop: Hero → Steps (reused) → Mid CTA → Six Week → Final CTA → FAQ; mobile includes testimonial/stats block between six-week and final CTA.
- **Motion** — all Figma dev-mode animations on new sections; token-based durations; Playwright motion specs under `component.how-it-works.*`.
- **Static copy** — English only, hardcoded from Figma constants.
- **Responsive** — dual pixel-match: desktop 1440px + mobile 393px; mobile layout below `md`, desktop at `lg+`.
- **Design tokens** — all ML Travel UI uses tokens; no raw hex or px in components.
- **HIW-003.1** — explicitly **waived**: no How It Works-specific BE API.

### Out of scope

- Rebuilding the three-step section when LP-001 `HowItWorksTeaserSection` already implements it.
- HIW-003-specific OpenAPI endpoints, CMS, or i18n.
- Contact / Calendly flow (CP-002) — CTAs link there only.
- Landing page sections beyond the reused teaser (LP-001).
- Custom booking, scheduling, or analytics APIs.

---

## Feature requirements

### HIW-003 — How It Works

**Story intent:** As a visitor I want to understand how ML Travel works and the onboarding timeline so I can decide whether to book a demo.

**Must deliver:**

- Guest navigates to `/how-it-works` and sees all page sections in Figma scroll order at desktop and mobile widths.
- Three-step section matches landing page behaviour (reuse `HowItWorksTeaserSection`).
- Hero, mid CTA, six-week timeline, final CTA, and FAQ match Figma; mobile testimonial/stats render on mobile only.
- FAQ category tabs filter static question groups; accordion expands one question at a time (first in default tab open on load).
- Every demo CTA links to `/contact`.
- Section animations play per Figma on new HIW sections.
- Navbar and Footer match LP-001 shared implementation.

**Acceptance (high-level — vertical slices; detailed `component.how-it-works.*` paths in v2):**

- Given a guest navigates to `/how-it-works` at 1440px width, when the page loads, then `screen.how-it-works.page` is visible and shared `component.navbar` and `component.footer` match LP-001.
- Given a guest on `/how-it-works` at 1440px width, when the page loads, then the three-step section matches landing `component.landing.howItWorksTeaser` (same cards, copy, and hover motion).
- Given a guest on `/how-it-works` at 393px width, when the page loads, then page-specific sections use the mobile Figma layout (`5217:6715`) and the three-step section matches landing mobile teaser behaviour.
- Given a guest on `/how-it-works`, when they activate any demo CTA (hero, mid-page, or final), then navigation targets `/contact`.
- Given a guest on `/how-it-works` in the FAQ section, when they select a category tab, then only questions for that category are visible.
- Given a guest on `/how-it-works` with FAQ open, when they click a collapsed question, then that answer expands and any other open question collapses.
- Given a guest on `/how-it-works` at desktop width, when they scroll through new HIW sections, then section motion matches Figma dev-mode spec (validated by motion Playwright specs).
- Given a guest on `/how-it-works` at mobile width, when the page loads, then the testimonial quote and stats grid sections are visible (mobile-only blocks from `5217:6715`).
- Given a guest on `/how-it-works` at desktop width, when the page loads, then the testimonial/stats mobile-only block is not rendered.

**Figma frames:**

| Frame | nodeId | Role |
|-------|--------|------|
| HIW canvas (anchor) | `5217:6696` | Page canvas |
| HIW-Desktop | `5217:6697` | Canonical desktop layout |
| HIW-Mobile | `5217:6715` | Canonical mobile layout |
| HIWHeroSection | `5217:6699` | Hero slice |
| HowItWorksSection (page) | `5217:6700` | Reference — **implementation reuses LP-001 `5164:6567`** |
| S4-MidCTA | `5217:6701` | Mid-page demo CTA |
| SixWeekSection | `5217:6705` | Six-week timeline |
| FinalCTASection | `5217:7555` | Final demo CTA |
| FAQSection | `5261:8072` | FAQ tabs + accordion |
| Landing HIW teaser (reuse) | `5164:6567` / `5164:6690` | Three-step section source of truth |

**Implementation slices (sequential `/fe-implement`):**

| # | Section | nodeId | Notes |
|---|---------|--------|-------|
| 1 | Hero | `5217:6699` | New |
| 2 | Three-step How It Works | `5164:6567` (reuse) | Compose LP-001 `HowItWorksTeaserSection`; hide footer link on `/how-it-works` |
| 3 | Mid CTA | `5217:6701` | New |
| 4 | Six-week timeline | `5217:6705` | New |
| 5 | Testimonial + stats | mobile subtree | New; mobile-only |
| 6 | Final CTA | `5217:7555` | New |
| 7 | FAQ | `5261:8072` | New |

**API-first:**

| Slice | Type | Notes |
|-------|------|-------|
| HIW-003.1 | BE waived | No HIW API; reuse LP-001 `GET /api/health` for pipeline gate |
| HIW-003.2 | UI | `/how-it-works` page sections + reused teaser + FAQ interaction |

**Suggested registry roots:** `screen.how-it-works.*`, `component.how-it-works.*` (new sections); `component.landing.howItWorksTeaser.*` (reused steps)

**Depends on:** LP-001 (Navbar + Footer + `HowItWorksTeaserSection` `fe-implemented`).

---

## Requirements (cross-cutting)

### Design and tokens

- Figma is the source of truth for layout, copy, spacing, and motion on new HIW sections.
- Three-step section: LP-001 implementation is source of truth (already matched to `5164:6567` / `5164:6690`).
- Token files are the source of truth for values in code — no raw hex or px in `app/` or `components/`.
- Per slice: `figma-extract` → `design-contract` → `fe-implement`.
- Navbar/Footer excluded from HIW figma-extract slices — provided by root layout.

### API and data

- No HTTP contracts for HIW-003 in v1.
- No `docs/openapi/` entries.

### Quality gates

- `npm run gate` (FE) after HIW-003.2 slices complete.
- Human visual sign-off vs Figma desktop `5217:6697` and mobile `5217:6715` before `status: approved`.
- E2E: route smoke, CTA → `/contact`, FAQ tab + accordion interaction.
- Motion: Playwright specs per animated section.

---

## Non-functional

- **Stack:** Next.js App Router, TypeScript, Tailwind CSS, Playwright (`CLAUDE.md`, `.claude/stack.yaml`).
- **Accessibility:** WCAG AA baseline — semantic headings, keyboard-navigable FAQ tabs and accordion, visible focus states, meaningful CTA link text.
- **Security:** Public page; no auth; no user data collection; no HIW-specific API calls.
- **Performance:** Static page; motion uses CSS/token transitions; no blocking API on load.

---

## Appendix — Figma screen catalog

| # | Screen / frame | nodeId | HIW-003 role |
|---|----------------|--------|--------------|
| 01 | HIW canvas | `5217:6696` | Anchor |
| 02 | HIW-Desktop | `5217:6697` | Canonical desktop layout |
| 03 | HIW-Mobile | `5217:6715` | Canonical mobile layout |
| 04 | HIWHeroSection | `5217:6699` | Hero slice |
| 05 | HowItWorksSection | `5217:6700` | Page reference — reuse LP-001 teaser |
| 06 | S4-MidCTA | `5217:6701` | Mid CTA slice |
| 07 | SixWeekSection | `5217:6705` | Timeline slice |
| 08 | FinalCTASection | `5217:7555` | Final CTA slice |
| 09 | FAQSection | `5261:8072` | FAQ slice |
| 10 | Landing HIW teaser | `5164:6567` / `5164:6690` | Reused three-step section |

> **Component anatomy and motion chains:** To be populated by `prd-update` after `figma-extract` + `design-contract`.
