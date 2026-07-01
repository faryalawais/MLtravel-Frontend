# Figma extract notes — LP-001

**File:** `h6BqI1ZRMSJxR7jESNF0Ep` — [ML Travel Project (faryal-updated)](https://www.figma.com/design/h6BqI1ZRMSJxR7jESNF0Ep/ML-Travel-Project--faryal-updated-?node-id=5164-6346&p=f&m=dev)  
**Extracted:** 2026-07-01 via REST (`figma:extract:rest` + `build:spec-from-cache`) · `figmaLastModified` 2026-07-01T07:26:09Z

## Slices extracted

| GH# | Section | Desktop | Mobile | Motion |
|-----|---------|---------|--------|--------|
| #3 | Navbar | `5164:6559` | `5164:7031` | `5164:10334` |
| #4 | Hero | `5164:6560` | `5164:7080` | `5164:10343` |
| #5 | Problem | `5164:6561` | `5164:6571` | `5164:10344` |

Reference PNGs: `reference-problemsection.png`, `reference-problemmobile.png`, `reference-problem-animation.png`.

## Problem slice (#5) — 2026-07-01

- **Desktop (`5164:6561` — ProblemSection):** SectionHeader with pill “The Problem”, subtitle, 3× ProblemCard grid, ProblemCTA (“The model is broken on purpose. / We built the alternative.”), gradient-bar footer accent.
- **Mobile (`5164:6571` — ProblemPanelsSection):** Stacked cards + same header/CTA pattern; narrower layout.
- **Motion (`5164:10344` — ProblemSection-animation):** Desktop prototype for card/hover motion — pair with `tokens/MOTION-SPEC.md`.
- **Icons:** Each ProblemCard uses `Icon/ProblemCard` VECTOR graphics — exported to `public/icons/icon-problem-card-{1,2,3}.svg` (masters `3091:14`, `3091:20`, `3091:27`).

---

## Navbar slice (#3)

**Frame:** Navbar desktop `5164:6559` · mobile `5164:7031` · animation `5164:10334`

## Figma file key

Set `FIGMA_FILE_KEY=h6BqI1ZRMSJxR7jESNF0Ep` in `.env`. If `figma:check` shows a different file, run `unset FIGMA_FILE_KEY` in your shell (parent env can override `.env`).

## Motion / animation tokens

Animation **behaviour** is in `reference-navbar-animation.png` and Figma node `5164:10334`. **Motion tokens** follow Figma numeric primitives (`motion.duration.700` / `300` / `120`) with semantic aliases in `semantics.json` (`motion.duration.default`, etc.) — see `tokens/MOTION-SPEC.md`.

## Brand copy

Figma text reads **"MaqsoodTravel"** (desktop TEXT + mobile vector wordmark). PRD uses ML Travel branding — confirm with design whether copy or logo asset should change in implementation.

## Desktop vs mobile

- **Desktop (`5164:6559`):** brand = TEXT "MaqsoodTravel"; `logo-icon` frame is `visible: false`.
- **Mobile (`5164:7031`):** compact bar — hamburger `5164:7033`/`5164:7034` (24×24), wordmark `5164:7035`/`5164:7036`, CTA `5164:7037`. **MCP check (2026-07-01):** no open-menu / drawer frame in file — `get_metadata` on `5164:6569` and `5164:7031` shows only closed bar; `interactions: []` on menu node. Slide-out nav implemented in `MobileNavbar.tsx` with desktop link parity.

## MCP hamburger findings (2026-07-01)

| Node | MCP tool | Finding |
|------|----------|---------|
| `5164:7033` | `get_design_context` | 24×24 image frame — hamburger SVG only |
| `5164:7032` | `get_design_context` | `gap: spacing.8`, menu + wordmark row |
| `5164:7031` | `get_metadata` | Closed bar only — no child menu panel |
| `5164:6569` | `get_metadata` | D4-Mobile — no separate menu-open variant |

Open drawer is **not designed in Figma**; implement from desktop nav links + standard slide-in UX.
- **Animation (`5164:10334`):** desktop navbar prototype; use for hover/transition spec + MOTION-SPEC.md.

## Small-chunk extract (navbar only — never the full landing frame)

**Do not** call MCP `get_design_context` on `5164:6346` (full landing canvas) or retry a hung full-frame call.

| Goal | Command / tool |
|------|----------------|
| **Bulk cache (recommended)** | `npm run figma:extract:rest -- --feature LP-001 --frame 5164:6346` — writes only `slice-roots.json` rows (3 navbar nodes) |
| **One node refresh (REST)** | `npm run figma:refresh-node -- --feature LP-001 --refresh-node 5164:6559` |
| **MCP gap-fill** | One call per row in `mcp-chunks.json` → `mcpChunks.desktop` / `mobile` / `animation` |
| **Quick visual check** | MCP `get_screenshot` on `5164:6559` or `5164:7031` (fast, not data) |

Chunk list: `features/LP-001/figma/mcp-chunks.json`

After any cache change:

```bash
npm run build:spec-from-cache -- LP-001
npm run validate:figma-extract -- LP-001
```

## Downloaded assets

| Node ID | Node name | Type | File saved | Dimensions |
|---------|-----------|------|------------|------------|
| `I5164:6559;3147:1442;2780:1466;2780:1506` | CTA arrow Vector | svg | `public/icons/icon-button-arrow.svg` | master `2780:1506` (instance IDs null via REST) |
| `5164:7034` | Mobile menu Vector | svg | `public/icons/icon-menu.svg` | — |
| `5164:7036` | MaqsoodTravel wordmark | svg | `public/icons/logo-maqsood-travel.svg` | mobile only |

## Token mapping

Bound variables are present on REST cache nodes (`boundVariables` in `spec.json`). Exact semantic resolution runs in `ui-registry:enrich-tokens` after `ui-registry-build`. Spacing/colour values use Figma variables aliased to ML Travel tokens in `tokens/semantics.json`.

## Reference screenshots

| Section | File |
|---------|------|
| Navbar desktop | `reference-navbar.png` |
| Navbar mobile | `reference-navbar-mobile.png` |
| Navbar animation | `reference-navbar-animation.png` |

## Registry path note

`layout.json` / schema require 3+ path segments. Registry seeds use `screen.landing.home` and `component.navbar.bar` while Gherkin still says `screen.landing` / `component.navbar` — reconcile in `/ui-registry-build` (alias or Gherkin update).

## Next pipeline steps

1. `/design-tokens` — refresh when exact motion tokens are provided  
2. `/ui-registry-build` + `/registry-validate`  
3. `/design-contract` — Navbar slice  
4. Repeat `figma:extract:rest` per backlog section for Hero → Footer
