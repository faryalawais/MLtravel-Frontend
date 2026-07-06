# FE Ticket — CP-002-FE

**Parent:** CP-002  
**Slice:** CP-002.2 (UI)  
**Status:** tickets-created  
**Created:** 2026-07-06

## What to build

Contact Us page at `/contact` — ML Travel page chrome + Calendly inline iframe:

- Reuse LP-001 `component.navbar` and `component.footer` (no duplicate chrome)
- Static English copy from Figma `5185:4332` in `constants/contact.constants.ts`
- Native `<iframe>` embed from `NEXT_PUBLIC_CALENDLY_URL` (no `react-calendly`)
- Loading skeleton in embed slot until iframe `onLoad`
- Embed fallback (message + external Calendly link) when URL unset or load fails
- Fallback email block with `mailto:` from `NEXT_PUBLIC_CONTACT_EMAIL`
- Desktop pixel match at **1440px**; mobile fluid stack (no mobile Figma frame)
- Design tokens only — no raw hex or px
- Calendly booking + confirmation UI inside iframe only (not rebuilt in React)

### Implementation order (suggested slices for `/to-issues`)

1. Contact hero (`component.contact.hero`)
2. Calendly embed container — skeleton, iframe, fallback (`component.contact.embed`, `.embedSkeleton`, `.embedFallback`)
3. Fallback email block (`component.contact.fallback`)

### Environment

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_CALENDLY_URL` | Iframe `src` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Email CTA label + `mailto:` href |

## Figma frames

| # | Frame | nodeId | Role |
|---|-------|--------|------|
| 1 | Choose day (canonical) | `5185:4332` | Page layout — **design-contract primary** |
| 2 | Choose hour | `5186:4533` | Embed sizing reference |
| 3 | Details | `5186:4857` | Embed sizing reference |
| 4 | Summary | `5198:4102` | Calendly admin confirmation copy |
| — | Placeholder note | `5198:3487` | **Exclude** — designer note only |

**REST cache:** `features/CP-002/figma/nodes/`

**Registry roots:** `screen.contact.*`, `component.contact.*`

## Data Points (fields this FE ticket needs from BE)

| UI Component | Data field | Source endpoint | Response path |
|-------------|-----------|-----------------|---------------|
| *(none — static contact chrome)* | — | — | — |

Contact page does not call BE on load. Calendly handles scheduling client-side.

## Acceptance Criteria (@fe)

1. Guest on `/contact` at **1440px** sees `screen.contact.page` with LP-001 `component.navbar` and `component.footer`.
2. `component.contact.hero` shows Figma headline and subhead from `5185:4332`.
3. With valid `NEXT_PUBLIC_CALENDLY_URL`, `component.contact.embed` contains a Calendly iframe whose `src` includes the configured URL.
4. Before iframe loads, `component.contact.embedSkeleton` is visible in the embed container.
5. After iframe loads, skeleton is hidden and iframe is visible.
6. With `NEXT_PUBLIC_CALENDLY_URL` unset or iframe error, `component.contact.embedFallback` shows a message and external Calendly link.
7. `component.contact.fallback` shows *“Not ready to book a slot?”* and body copy from Figma.
8. Email CTA activates `mailto:` with address from `NEXT_PUBLIC_CONTACT_EMAIL`.
9. Guest on `/contact` at **393px** sees hero, embed, and fallback in fluid stacked layout.
10. No custom calendar, form, or step UI outside the iframe.
11. No raw hex or px in ML Travel contact components — token lint passes.
12. Visual sign-off: desktop page chrome matches Figma `5185:4332`.

## Dependencies

- **LP-001-FE:** Navbar + Footer must be `fe-implemented` before CP-002-FE starts.
- **LP-001-BE** (or pipeline health stub): must be `be-implemented` before FE page work (CP-002 has no domain BE).
- **CP-002-BE:** waived — no separate BE implementation.
- Per slice: `figma-extract` → `design-contract` → `fe-implement`.
- Ops: Calendly event confirmation copy aligned to Summary frame `5198:4102`.
