# Product brief (PRD) — CP-002 Contact Us

> **Version:** v1 (Figma-first skeleton)  
> **Screen detail:** Component paths, embed dimensions, and mobile refinements to be added by `prd-update` after `figma-extract` + `design-contract`.

**Product:** Contact Us page at `/contact` — ML Travel page chrome (hero, fallback email block) with a Calendly inline iframe for demo booking; shared Navbar and Footer from LP-001.  
**Design source:** Figma file — [Contact — Choose day (canonical layout)](https://www.figma.com/design/h6BqI1ZRMSJxR7jESNF0Ep/ML-Travel-Project--faryal-updated-?node-id=5185-4332&m=dev) (`h6BqI1ZRMSJxR7jESNF0Ep`). Reference frames: `5185:4332`, `5186:4533`, `5186:4857`, `5198:4102` (Summary — Calendly admin copy).  
**Parent ticket:** CP-002  
**Consumers:** `spec-author` → Gherkins; `openapi-author` → none (BE waived); `figma-extract` → frame measurements; `design-contract` → UI contract.

---

## Problem

Prospects interested in ML Travel need a frictionless way to schedule a live demo without sales back-and-forth or a custom-built calendar. Without a dedicated Contact page that combines trustworthy site chrome with reliable scheduling, visitors drop off or resort to unstructured email.

---

## Goals

- Guest can book a demo via Calendly inline embed on `/contact` while page chrome matches Figma at **desktop** width.
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
- **Shared chrome** — reuse LP-001 Navbar and Footer (`component.navbar`, `component.footer`); **gate:** LP-001 Navbar + Footer must be `fe-implemented` before CP-002.2 FE starts.
- **Page chrome from Figma** (`5185:4332`) — hero headline/subhead, embed container, “Not ready to book a slot?” fallback block with `mailto:` link.
- **Calendly embed** — single native `<iframe>` sourced from `NEXT_PUBLIC_CALENDLY_URL`; loading skeleton until iframe loads; fallback UI (message + external Calendly link) when embed cannot load.
- **Static copy** — English only, hardcoded from Figma constants; email address from `NEXT_PUBLIC_CONTACT_EMAIL` (dev default `faryal.awais@maqsoodlabs.com`).
- **Responsive** — desktop pixel match at 1440px; mobile fluid stack with responsive Calendly embed (no separate mobile Figma frame in v1).
- **Design tokens** — all ML Travel UI uses tokens; no raw hex or px in components.
- **CP-002.1** — explicitly **waived**: no Contact-specific BE API; scheduling handled by Calendly client-side.

### Out of scope

- Custom calendar UI, date/time pickers, or booking form validation (Calendly inside iframe).
- Custom step/progress indicator outside the embed.
- CP-002-specific OpenAPI endpoints, webhooks, or booking persistence.
- Custom React thank-you / confirmation route — Calendly success UI inside iframe.
- Cookie consent, Privacy Policy, and Terms links inside the widget (Calendly-provided).
- Landing page sections (LP-001), How It Works page (HIW-003).
- CMS, i18n, dynamic APIs for contact copy.
- `react-calendly` or other embed wrapper packages (native iframe only).

---

## Feature requirements

### CP-002 — Contact Us

**Story intent:** As a visitor I want to book a live demo via Calendly on the Contact Us page so I can schedule without sales back-and-forth.

**Must deliver:**

- Guest navigates to `/contact` and sees Figma-matched page chrome (hero, fallback block, embed area) at desktop width.
- Calendly inline iframe loads from `NEXT_PUBLIC_CALENDLY_URL` and handles date → time → details → confirmation inside the embed.
- Fallback email block shows copy from Figma; email link uses `mailto:${NEXT_PUBLIC_CONTACT_EMAIL}`.
- If embed fails or URL is unset, fallback message and external Calendly link are shown in the embed container.
- Navbar and Footer match LP-001 shared implementation.

**Acceptance (high-level — vertical slices; detailed `component.contact.*` paths in v2):**

- Given a guest on `/contact` at desktop width and a valid `NEXT_PUBLIC_CALENDLY_URL`, when the page loads, then `screen.contact.page` is visible, hero copy matches Figma (`5185:4332`), and a Calendly iframe is present in the embed container.
- Given a guest on `/contact` before the iframe has loaded, when the page loads, then a loading skeleton is visible in the embed container.
- Given a guest on `/contact` and `NEXT_PUBLIC_CALENDLY_URL` is unset or the iframe fails to load, when the page loads, then a fallback message and an external link to the Calendly URL are visible in the embed container.
- Given a guest on `/contact`, when they activate the fallback email link, then navigation targets `mailto:` with the address from `NEXT_PUBLIC_CONTACT_EMAIL`.
- Given a guest on `/contact` at mobile width, when the page loads, then `screen.contact.page`, hero, fallback block, and responsive embed are visible (fluid layout; not pixel-matched to a mobile Figma frame).
- Given LP-001 shared chrome is implemented, when a guest loads `/contact`, then `component.navbar` and `component.footer` match the LP-001 implementation on `/`.
- Given a guest completes booking in Calendly, when confirmation is shown, then success messaging appears inside the Calendly iframe (configured in Calendly admin to match Figma Summary `5198:4102` strings — not a separate ML Travel route).

**Figma frames:**

| Frame | nodeId | Role |
|-------|--------|------|
| Choose day (canonical layout) | `5185:4332` | Page chrome + embed slot — **design-contract primary** |
| Choose hour | `5186:4533` | Calendly mock reference (embed sizing) |
| Details | `5186:4857` | Calendly mock reference |
| Summary | `5198:4102` | Confirmation copy for Calendly admin |
| Placeholder note | `5198:3487` | Designer note only — not a layout frame |

**API-first:**

| Slice | Type | Notes |
|-------|------|-------|
| CP-002.1 | BE waived | No Contact API; reuse LP-001 `GET /api/health` for pipeline gate |
| CP-002.2 | UI | `/contact` page chrome + Calendly iframe + env-driven config |

**Environment variables:**

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_CALENDLY_URL` | Calendly event URL for inline iframe `src` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Fallback `mailto:` address |

**Calendly admin (ops — not FE code):** Configure event confirmation text to match Figma Summary frame, e.g. *“You are scheduled”*, *“A calendar invitation has been sent to your email address.”*

**Suggested registry roots:** `screen.contact.*`, `component.contact.*` (hero, fallback, embed, embedSkeleton, embedFallback)

**Depends on:** LP-001 (Navbar + Footer `fe-implemented`).

---

## Requirements (cross-cutting)

### Design and tokens

- Figma is the source of truth for ML Travel page chrome layout, copy, and spacing.
- Calendly widget UI inside the iframe is not pixel-matched — only the embed container dimensions and page shell match Figma.
- Token files are the source of truth for values in code — no raw hex or px in `app/` or `components/`.
- Per feature: `figma-extract` → `design-contract` → `fe-implement`.
- No `color.input.*` tokens required — form fields are Calendly-owned (`docs/designer-token-handoff.md`).

### API and data

- No HTTP contracts for CP-002 in v1.
- No `docs/openapi/` entries for booking.

### Quality gates

- `npm run gate` (FE) after CP-002.2.
- Human visual sign-off vs Figma desktop frame `5185:4332` before `status: approved`.
- E2E: extend contact smoke tests for hero, embed/fallback, and `mailto:` href.

---

## Non-functional

- **Stack:** Next.js App Router, TypeScript, Tailwind CSS, Playwright (`CLAUDE.md`, `.claude/stack.yaml`). No new npm packages for Calendly.
- **Accessibility:** WCAG AA baseline — semantic landmarks, keyboard-focusable `mailto:` link, iframe `title` attribute; Calendly widget accessibility delegated to Calendly inside iframe.
- **Security:** Public page; no auth. `NEXT_PUBLIC_*` vars only — no secrets in FE repo. Third-party iframe loads Calendly origin only.
- **Performance:** Skeleton avoids layout shift; iframe lazy-load acceptable; no blocking API calls on contact page load.

---

## Appendix — Figma screen catalog

| # | Screen / frame | nodeId | CP-002 role |
|---|----------------|--------|-------------|
| 01 | Choose day | `5185:4332` | Canonical page layout |
| 02 | Choose hour | `5186:4533` | Embed reference |
| 03 | Details | `5186:4857` | Embed reference |
| 04 | Summary | `5198:4102` | Calendly confirmation copy reference |

> **Mobile frame:** None in v1 — fluid responsive layout per grill-me decision.  
> **REST cache:** `features/CP-002/figma/nodes/` (extracted 2026-07-06).  
> **Component anatomy:** To be populated by `prd-update` after `design-contract`.
