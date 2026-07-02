# FE Ticket — LP-001-FE

**Parent:** LP-001  
**Slice:** LP-001.2 (UI)  
**Status:** tickets-created  
**Created:** 2026-07-01

## What to build

Pixel-accurate, responsive landing page at `/` plus **shared site chrome** reused on `/contact` and `/how-it-works`:

- Static marketing content hardcoded from Figma (English only)
- Each vertical slice ships **desktop (`5164:6558`) + mobile (`5164:6569`)** together
- Motion: hovers, focus, section motion per Figma + motion specs in `tokens/`
- Design tokens only — no raw hex or px
- Implementation order: Navbar → Hero → Problem → Comparison → How-it-works → Feature grid → Social proof → Pricing → Footer

### Routes / navigation

| Figma label | Behaviour |
|-------------|-----------|
| Product | `/` (home) |
| How It Works | `/how-it-works` |
| Pricing | `#pricing` scroll on `/` |
| Book A Demo | `/contact` |
| Hero CTA | `/contact` |

## Figma frames

| # | Section | Desktop | Mobile |
|---|---------|---------|--------|
| — | Landing canvas | `5164:6346` | — |
| — | D4-Desktop / D4-Mobile | `5164:6558` | `5164:6569` |
| 1 | Navbar | `5164:6559` | `5164:7031` |
| 2 | Hero | `5164:6560` | `5164:7080` |
| 3 | Problem | `5164:6561` | `5164:6571` |
| 4 | Comparison (1st) | `5164:6566` | `5164:6609` |
| 5 | How-it-works | `5164:6567` | `5164:6690` |
| 6 | Feature grid | `5164:6562` | `5164:6785` |
| 7 | Social proof | `5164:6568` | `5164:6836` |
| 8 | Pricing | `5164:6564` | `5164:6915` |
| 9 | Footer | `5164:6565` | `5164:7038` |

**Exclude:** `5187:3101` (Placeholder Content)

**Registry roots:** `screen.landing.*`, `component.landing.*`, `component.navbar.*`, `component.footer.*`

## Data Points (fields this FE ticket needs from BE)

| UI Component | Data field | Source endpoint | Response path |
|-------------|-----------|-----------------|---------------|
| *(none — static landing)* | — | — | — |

Landing page does not call BE on load. No UI fields from API.

## Acceptance Criteria

1. Guest on `/` at **1440px** sees all desktop sections in Figma Y-order.
2. Guest on `/` at **393px** sees mobile layout (top bar, Hero, sections, Footer).
3. Navbar: **How It Works** → `/how-it-works`; **Book A Demo** → `/contact`.
4. Hero primary CTA → `/contact`.
5. **Pricing** nav scrolls to pricing section on `/`.
6. Each section matches Figma (layout, type, color, spacing via tokens, motion) at both breakpoints.
7. Shared `component.navbar` and `component.footer` on `/contact` and `/how-it-works` match LP-001 implementation.
8. No raw hex or px — token lint passes.
10. Visual sign-off: strict pixel match to current Figma after spacing fixes.
11. Motion per MOTION-SPEC where Figma indicates interaction.
12. Slice 1 (Navbar / mobile top bar) demoable standalone.

## Dependencies

- **BE ticket (LP-001-BE)** must be `be-implemented` before FE page work starts (pipeline gate).
- Design tokens must pass `tokens:validate` + `tokens:build`.
- Per slice: `figma-extract` → `design-contract` → `fe-implement`.
