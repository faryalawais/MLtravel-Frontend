# PRD v2 — CP-002 Contact Us

> **Enriched from PRD v1 on 2026-07-06.** Approved PRD v1 at: `docs/features/CP-002/prd-v1.md`  
> **Figma source:** `h6BqI1ZRMSJxR7jESNF0Ep` · analysed via Figma REST API (`features/CP-002/figma/nodes/`).

**Product:** Contact Us page at `/contact` — ML Travel page chrome (hero, fallback email block) with a Calendly inline iframe for demo booking; shared Navbar and Footer from LP-001.  
**Design source:** [Contact — Choose day (canonical layout)](https://www.figma.com/design/h6BqI1ZRMSJxR7jESNF0Ep/ML-Travel-Project--faryal-updated-?node-id=5185-4332&m=dev)  
**Parent ticket:** CP-002

---

## Problem

Prospects interested in ML Travel need a frictionless way to schedule a live demo without sales back-and-forth or a custom-built calendar. Without a dedicated Contact page that combines trustworthy site chrome with reliable scheduling, visitors drop off or resort to unstructured email.

---

## Goals

- Guest can book a demo via Calendly inline embed on `/contact` while page chrome matches Figma at **desktop (1440px)** width.
- Hero and fallback email block give a clear path when scheduling is unavailable or the visitor prefers email.
- Shared `component.navbar` and `component.footer` from LP-001 render on `/contact` with no duplicate chrome components.
- API-first mandatory: feature-split → **CP-002.1** (waived — no domain API) then **CP-002.2** (UI). Pipeline BE gate satisfied by existing LP-001 health stub.
- Calendly confirmation messaging aligned to Figma Summary frame (`5198:4102`) via Calendly admin configuration — not a custom React confirmation page.

---

## Users

| Persona | Needs |
|---------|-------|
| **Every visitor (prospect)** | Book a live demo quickly; understand what the demo covers; contact the team by email if not ready to schedule. |
| **Travel agency owner / operations lead** | Same as prospect — evaluate ML Travel before committing; low-friction scheduling. |

No secondary persona with different CP-002 requirements in v1.

---

## Scope

### In scope

- **Route** — `/contact` (`screen.contact.page`).
- **Shared chrome** — reuse LP-001 Navbar and Footer; **gate:** LP-001 Navbar + Footer must be `fe-implemented` before CP-002.2 FE starts.
- **Page chrome from Figma** (`5185:4332`) — hero, embed container (~868×550px booking area), fallback block with email CTA.
- **Calendly embed** — single native `<iframe>` from `NEXT_PUBLIC_CALENDLY_URL`; loading skeleton; embed-failure fallback.
- **Static copy** — English only from Figma constants; email display/href from `NEXT_PUBLIC_CONTACT_EMAIL`.
- **Responsive** — desktop pixel match at 1440px; mobile fluid stack (no mobile Figma frame in v1).
- **Design tokens** — all ML Travel UI uses tokens; no raw hex or px.
- **CP-002.1** — **waived**: no Contact-specific BE API.

### Out of scope

- Custom calendar UI, date/time pickers, booking form validation (Calendly inside iframe).
- Custom step/progress indicator outside the embed.
- CP-002 OpenAPI endpoints, webhooks, booking persistence.
- Custom React thank-you route — Calendly success UI inside iframe.
- Cookie consent, Privacy Policy, Terms inside widget (Calendly-provided).
- LP-001 landing sections, F-003 How It Works content.
- CMS, i18n, `react-calendly` package.
- Pixel-matching Calendly mock UI (calendar grid, timezone picker, form fields) — replaced by iframe.

---

## Feature requirements

### CP-002 — Contact Us

**Story intent:** As a visitor I want to book a live demo via Calendly on the Contact Us page so I can schedule without sales back-and-forth.

**Must deliver:** Figma-matched page chrome at desktop width; Calendly iframe; fallback email path; shared LP-001 chrome; env-driven config.

**API-first:**

| Slice | Type | Notes |
|-------|------|-------|
| CP-002.1 | BE waived | No Contact API; reuse LP-001 `GET /api/health` for pipeline gate |
| CP-002.2 | UI | `/contact` page chrome + Calendly iframe + env config |

**Registry roots:** `screen.contact.*`, `component.contact.*`

**Depends on:** LP-001 (Navbar + Footer `fe-implemented`).

---

## Requirements (cross-cutting)

### Design and tokens

- Figma = layout, copy, spacing for **ML Travel chrome only**.
- Calendly widget inside iframe is not pixel-matched.
- Per feature: `figma-extract` → `design-contract` → `fe-implement`.
- No `color.input.*` tokens — form fields are Calendly-owned.

### API and data

- No HTTP contracts for CP-002 booking in v1.

### Quality gates

- `npm run gate` (FE) after CP-002.2.
- Human visual sign-off vs Figma `5185:4332` (desktop).
- E2E: hero, embed/skeleton/fallback, `mailto:` href.

---

## Non-functional

- **Stack:** Next.js App Router, TypeScript, Tailwind CSS, Playwright.
- **Accessibility:** WCAG AA — landmarks, focusable email CTA, iframe `title`; Calendly a11y inside iframe.
- **Security:** Public page; `NEXT_PUBLIC_*` only; iframe loads Calendly origin.
- **Performance:** Skeleton prevents layout shift; no blocking API on page load.

---

## Figma Analysis

### Page structure

| Frame | NodeId | Size | Role |
|-------|--------|------|------|
| **Choose day (canonical)** | `5185:4332` | 1440×1020 | Full Contact page layout — **design-contract primary** |
| Choose hour | `5186:4533` | — | Calendly mock reference (embed sizing) |
| Details | `5186:4857` | — | Calendly mock reference |
| Summary | `5198:4102` | — | Confirmation copy for Calendly admin |
| Placeholder note | `5198:3487` / `5198:3485` | — | Designer note — **not implemented** |

> **No Footer in Contact frames** — Footer comes from LP-001 `app/layout.tsx` shared chrome.  
> **No mobile Contact frame** in v1 — fluid responsive layout per grill-me.

### Visual layout order (`5185:4332`, desktop 1440px)

| Region | Approx position | NodeId / name | CP-002 implementation |
|--------|-----------------|---------------|------------------------|
| Navbar | y=0, h=64 | `5185:4333` (`Navbar` instance) | Reuse LP-001 `component.navbar` |
| Hero headline + subhead | y≈88, centered | `5198:3440`–`5198:3442` | `component.contact.hero` |
| Booking area | y≈220, 868×550 | `5185:4334` (`Choose day` group) | **Calendly iframe** replaces Calendly mock (sidebar + calendar) |
| Fallback block | y≈810 | `5198:3429` | `component.contact.fallback` |
| Designer embed note | overlay | `5198:3485` | Not rendered — replaced by live iframe |

### Screens / frames reviewed

| Frame name | NodeId | Description |
|------------|--------|-------------|
| Choose day | `5185:4332` | Navbar + hero + two-column Calendly mock (event summary + calendar) + fallback email block |
| Choose hour | `5186:4533` | Same chrome; mock shows time-slot picker |
| Details | `5186:4857` | Same chrome; mock shows name/email form |
| Summary | `5198:4102` | Confirmation: *“You are scheduled”*, calendar invite message, event details |

### Components identified

| Component | Registry path (proposed) | States / behaviour |
|-----------|--------------------------|------------------|
| Contact hero | `component.contact.hero` | default — headline + subhead (static) |
| Calendly embed container | `component.contact.embed` | loading (skeleton) · loaded (iframe) · error (fallback) |
| Embed skeleton | `component.contact.embedSkeleton` | visible until iframe `onLoad` |
| Embed fallback | `component.contact.embedFallback` | message + external Calendly link when URL unset or load fails |
| Fallback email block | `component.contact.fallback` | default — heading, body copy, email CTA (`Button/Secondary2` styled `mailto:`) |
| Navbar | `component.navbar` | LP-001 shared — default · hover · focus |
| Footer | `component.footer` | LP-001 shared — from layout |

### Static content (no API) — ML Travel chrome copy

| Element | Figma text (`5185:4332`) | Implementation |
|---------|---------------------------|----------------|
| Hero headline | *“Get a live demo of your platform”* | `constants/contact.constants.ts` |
| Hero subhead | *“Pick a time and we'll show you exactly what the switch looks like for your setup.”* | constants |
| Fallback heading | *“Not ready to book a slot?”* | constants |
| Fallback body | *“Send us a few lines about your agency, which GDS you are on, and what you want to change. We will reply within one business day with a view on what switching would actually look like for you.”* | constants |
| Email CTA label | Figma shows `hello@maqsoodtravel.com` | Display + `mailto:` from `NEXT_PUBLIC_CONTACT_EMAIL` (dev: `faryal.awais@maqsoodlabs.com`) |

### Calendly-owned content (inside iframe — not FE-built)

- Date/time picker, timezone selector, name/email form, Schedule button.
- Cookie settings, Privacy Policy links (`calendly.com`).
- Event sidebar: *“Discovery call with MaqsoodTravel”*, *“30 min”*, conferencing note.
- Confirmation (Summary `5198:4102`): *“You are scheduled”*, *“A calendar invitation has been sent to your email address.”*, event time, *“Web conferencing details to follow.”* — configure in **Calendly admin**.

### Navigation (LP-001 shared)

| Figma label | Route |
|-------------|-------|
| Product | `/` |
| How It Works | `/how-it-works` |
| Pricing | `#pricing` on `/` |
| Book A Demo | `/contact` |

---

## Swagger Analysis

**Swagger not yet available** — normal at this stage. CP-002 has **no booking API**. `openapi-author` is **not required** for CP-002 domain endpoints.

### Expected endpoints (pipeline gate only — LP-001.1)

| Method | Path | What it does |
|--------|------|--------------|
| `GET` | `/api/health` | Returns `200` + minimal health payload (LP-001 stub — satisfies BE-before-FE gate) |

No Contact-specific endpoints.

### Response fields used by UI

None — CP-002 UI does not consume BE response bodies on page load.

---

## Data Points FE Needs from BE

| UI Component | Data field | Source endpoint | Response path |
|-------------|-----------|-----------------|---------------|
| *(none — static contact chrome)* | — | — | — |
| *(CP-002.1 gate only)* | `status` | `GET /api/health` | `$.status` (LP-001 stub — not rendered on `/contact`) |

**Environment configuration (FE — not BE):**

| Variable | Used by | Notes |
|----------|---------|-------|
| `NEXT_PUBLIC_CALENDLY_URL` | `component.contact.embed` | Calendly event URL for iframe `src` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | `component.contact.fallback` | Email CTA label + `mailto:` href |

> Contact page is **static + third-party embed**. No booking data APIs. Data Points table is empty for UI content by design.

---

## Edge Cases

| Case | Expected behaviour |
|------|-------------------|
| **`NEXT_PUBLIC_CALENDLY_URL` unset** | `component.contact.embedFallback` visible; external link uses URL if partially set, else disabled/hidden per design-contract |
| **Iframe blocked (ad blocker, CSP, network)** | Fallback message + link to open Calendly in new tab |
| **Iframe slow load** | `component.contact.embedSkeleton` visible until `onLoad` |
| **Mobile viewport** | Hero + fallback stack above/below embed; Calendly responsive widget; not pixel-matched to mobile Figma |
| **LP-001 Footer not shipped** | CP-002.2 FE **blocked** — do not start until Navbar + Footer `fe-implemented` |
| **Figma email vs env email** | Figma `hello@maqsoodtravel.com` is visual reference; runtime uses `NEXT_PUBLIC_CONTACT_EMAIL` |
| **User completes booking** | Confirmation inside Calendly iframe only — no ML Travel `/contact/confirmed` route |
| **Keyboard navigation** | Email CTA focusable; iframe title set; navbar/footer LP-001 focus behaviour |
| **English only** | All ML Travel copy hardcoded English; Calendly language via Calendly admin |

---

## Updated Acceptance Criteria

1. Guest on `/contact` at **1440px** sees `screen.contact.page` with LP-001 `component.navbar` and `component.footer`.
2. `component.contact.hero` shows Figma headline and subhead from `5185:4332`.
3. With valid `NEXT_PUBLIC_CALENDLY_URL`, `component.contact.embed` contains a Calendly iframe whose `src` includes the configured URL.
4. Before iframe loads, `component.contact.embedSkeleton` is visible in the embed container.
5. After iframe loads, skeleton is hidden and iframe is visible.
6. With `NEXT_PUBLIC_CALENDLY_URL` unset or iframe error, `component.contact.embedFallback` shows a message and external Calendly link.
7. `component.contact.fallback` shows *“Not ready to book a slot?”* and body copy from Figma.
8. Email CTA activates `mailto:` with address from `NEXT_PUBLIC_CONTACT_EMAIL`.
9. Guest on `/contact` at **393px** width sees hero, embed, and fallback in fluid stacked layout (no mobile Figma pixel match).
10. No custom calendar, form, or step UI outside the iframe.
11. No raw hex or px in ML Travel contact components — token lint passes.
12. Calendly confirmation strings documented for ops (Summary `5198:4102`) — verified in Calendly admin, not in FE E2E.
13. `GET /api/health` returns `200` when LP-001.1 is deployed (gate only — not called on contact page load).

---

## Definition of Done

- [ ] All ACs above have Gherkin scenarios (`spec-author`)
- [ ] All Figma data-bound fields have source endpoints *(N/A — static + Calendly; health stub only)*
- [ ] Empty states covered *(N/A — no dynamic lists)*
- [ ] Error states covered (embed fallback, skeleton → loaded transition)
- [ ] `figma-extract` cache populated under `features/CP-002/figma/nodes/`
- [ ] `design-contract` for `5185:4332` with `component.contact.*` paths
- [ ] Human `prd-review` approval on this document
- [ ] Human visual sign-off vs Figma desktop before `status: approved`

---

## Appendix — Full Figma catalog

| # | Frame | nodeId | CP-002 role |
|---|-------|--------|-------------|
| 01 | Choose day | `5185:4332` | Canonical page layout |
| 02 | Choose hour | `5186:4533` | Embed sizing reference |
| 03 | Details | `5186:4857` | Embed sizing reference |
| 04 | Summary | `5198:4102` | Calendly confirmation copy |
| — | Placeholder note | `5198:3487` | Not implemented |

**REST cache:** `features/CP-002/figma/nodes/` (2026-07-06)
