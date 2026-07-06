# Figma extract notes — HIW-003

**File:** `h6BqI1ZRMSJxR7jESNF0Ep` — [ML Travel Project (faryal-updated)](https://www.figma.com/design/h6BqI1ZRMSJxR7jESNF0Ep/ML-Travel-Project--faryal-updated-?node-id=5217-6696&p=f&m=dev)  
**Extracted:** 2026-07-06 via REST (`figma:extract:rest` + `build:spec-from-cache`) · `figmaLastModified` 2026-07-02T12:52:45Z

## Slices extracted

| GH# | Section | Desktop node | Mobile / reuse | Status |
|-----|---------|--------------|----------------|--------|
| #18 | Hero | `5217:6699` | `5217:7073` → reuse `component.landing.hero` (`hiw-page`) | ✓ extracted |
| #19 | Three-step teaser | reuse `5164:6567` / `5164:6690` | LP-001 cache | ✓ reuse (no HIW re-extract) |

## Slice 1 — Hero (#18)

| Item | Value |
|------|-------|
| Slice-root | `5217:6699` HIWHeroSection |
| Reference PNG | `reference-hiwherosection.png` |
| Registry paths | 45 under `component.howItWorks.hero.*` |
| Layout leaf | `component.howItWorks.hero.root` in `layout.json` |

### Reuse audit

| Region | Action |
|--------|--------|
| Desktop hero `5217:6699` | **net-new** `component.howItWorks.hero` |
| Mobile hero `5217:7073` | **reuse** `component.landing.hero` — no HIW registry |
| Demo CTA | **reuse** `HeroPrimaryCta` / LP-001 `Button/Primary` pattern |
| Navbar / Footer | **reuse** LP-001 layout chrome |

## Dual-source reconciliation

| slice-root | REST | MCP | instanceVariants | action |
|------------|------|-----|------------------|--------|
| `5217:6699` | ✓ `5217-6699.json` | — (REST-only slice 1) | ✓ `Button/Primary` State=Default, IconPosition=Right; `Icon/Button` Icon=Plane Arrow; `HeroStatItem` Stat=Fees\|Speed\|GoLive\|Airlines | REST `componentProperties` in cache — sufficient for contract §4 |

> MCP gap-fill not run for slice 1. Variant matrix sourced from REST cache `componentProperties` on INSTANCE nodes (same pattern as LP-001 Pricing desktop).

## Token mapping (slice 1 — HIW hero)

| Node path | Property | Figma value | Token used | Exact? |
|-----------|----------|-------------|------------|--------|
| HIWHeroSection | background | page wash | `color.background.page` | YES |
| HIWHeroTextBlock | gap | 24px | `spacing.24` | YES |
| head-group | gap | 8px | `spacing.8` | YES |
| Headline | typography | 48/60 Satoshi Bold | `typography.display.desktop.lg` | YES |
| Subcopy | typography | 16/24 Inter Regular | `typography.body.desktop.md` | YES |
| cta-group | gap | 12px | `spacing.12` | YES |
| Button/Primary | padding | 32×12 | `spacing.32` / `spacing.12` | YES |
| Button/Primary | gap | 6px | `spacing.6` | YES |
| Button/Primary | radius | 6px | `radius.6` | YES |
| Proof line | typography | 13/20 | `typography.body.desktop.xs` | YES |
| S1-Hero | padding-y | 52px | `spacing.52` | YES |
| HeroStatsStrip | direction | row, space-between | layout from cache | YES |
| HeroStatsStrip | padding-x | 180px | `spacing.180` | YES |
| HeroStatsStrip | background / border | surface + top/bottom stroke | `color.background.surface` / `color.border.default` | YES |
| HeroStatItem | gap | 8px | `spacing.8` | YES |
| Stat value | typography | 32px bold | `typography.display.desktop.stat` | YES |
| Stat bar | fill | orange | `color.action.primary.default.background` | YES |
| Stat label | typography | uppercase label | `typography.label.desktop.md.stat` | YES |
| Stat caption | typography | 13px | `typography.body.desktop.xs` | YES |

## Downloaded assets

| Node ID | Node name | Type | File saved |
|---------|-----------|------|------------|
| `I5217:6699;5218:6544;5218:14;2780:1425` | CTA plane arrow | svg | `public/icons/icon-button-arrow.svg` (shared with LP-001 / CP-002) |

No IMAGE/LOGO raster assets in slice 1 — stats and copy are text/vector only.

## Motion extract — HIW-hero-animation (GH#18)

> **Note:** User link `node-id=5404-6598` resolved to a Jira **Work Status** widget (not hero motion). Correct twin on 🎇 Animations page: **`5404:6761` `HIW-hero-animation`** component set; chain starts at variant **`5404:6760`** (Property 1=1).

| State | nodeId | Cached | Transition | Reference PNG |
|-------|--------|--------|------------|---------------|
| 1 | `5404:6760` | ✓ | → `5409:11417` MOUSE_ENTER 700ms | `reference-hiw-hero-animation-state-1.png` |
| 2 | `5409:11417` | ✓ | → `5409:11462` AFTER_TIMEOUT 300ms + 700ms | `reference-hiw-hero-animation-state-2.png` |
| 3 | `5409:11462` | ✓ | terminal | `reference-hiw-hero-animation-state-3.png` |

Chain status: **closed** | `motion-chains.json` built | `validate:motion-chains`: pass  
Pattern: `staged-sequence` / `runHeroMotion` | static twin: `5217:6699` | `initialRender`: `staticTwin`

Registry motion paths: `component.howItWorks.hero.motion.root`, `.headGroup`, `.ctaGroup`

## Missing tokens

None for slice 1 — all measurements resolve to tokens in `reports/tokens-report.md`.
