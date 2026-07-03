# Figma extract notes — LP-001

**File:** `h6BqI1ZRMSJxR7jESNF0Ep` — [ML Travel Project (faryal-updated)](https://www.figma.com/design/h6BqI1ZRMSJxR7jESNF0Ep/ML-Travel-Project--faryal-updated-?node-id=5164-6346&p=f&m=dev)  
**Extracted:** 2026-07-02 via REST (`figma:extract:rest` + `build:spec-from-cache`) · `figmaLastModified` 2026-07-02T12:52:45Z

## Slices extracted

| GH# | Section | Desktop | Mobile | Motion |
|-----|---------|---------|--------|--------|
| #3 | Navbar | `5164:6559` | `5164:7031` | `5164:10334` |
| #4 | Hero | `5164:6560` | `5164:7080` | `5164:10343` |
| #5 | Problem | `5164:6561` | `5164:6571` | `5164:10344` |
| #6 | Comparison (1st) | `5164:6566` | `5164:6609` | `5164:10411` |
| #7 | How-it-works teaser | `5164:6567` | `5164:6690` | `5164:10412` |
| #10 | Feature grid | `5164:6562` | `5164:6785` | `5404:6074` |
| #9 | Social proof | `5164:6568` | `5164:6836` | `5307:6608`, `5164:11204` |
| #11 | Pricing | `5164:6564` | `5164:6915` | `5164:11487` |

Reference PNGs: `reference-comparisonsectionfirst.png`, `reference-comparisonmobilefirst.png`, `reference-comparison-animation.png`, `reference-howitworkssection.png`, `reference-howitworksmobile.png`, `reference-howitworks-animation.png`, `reference-featuregrid.png`, `reference-featuregridmobile.png`, `reference-featuregrid-animation.png`, `reference-socialproofsectionbig.png`, `reference-socialproofmobile.png`, `reference-socialproof-animation.png`, `reference-socialproof-animation-alt.png`, `reference-newpricingsection.png`, `reference-pricingmobile.png`, `reference-pricing-animation.png`.

## Pricing slice (#11) — 2026-07-02

- **Desktop (`5164:6564` — NewPricingSection):** SectionHeader pill “Simple Pricing”, H2 “Own it, Don't Rent it”, RouteStrip (from → to with loading plane), boarding-pass `PricingCard` ($3,000 platform fee + $250/mo add-on), 8-item `ChecklistGrid`, Book A Demo CTA, `TrustStrip` platform-includes bar.
- **Mobile (`5164:6915` — Own it):** Stacked layout with same copy; compact checklist grid (2-col rows); mobile All Plans strip.
- **Motion (`5164:11487` — PricingSectionanimation):** 1-step hover reveal per `tokens/MOTION-SPEC.md` §6 (Property 1=1).
- **Assets:** Map decoration PNG, route-plane PNG, checklist check SVG (`5018:3129` master). CTA arrow reuses `public/icons/icon-plane-arrow-white.svg`. Section pill dot reuses `public/icons/icon-section-pill-dot.svg`.

### Dual-source reconciliation (Pricing)

| slice-root | REST cache | MCP / componentProperties | instanceVariants in checklist |
|------------|------------|---------------------------|------------------------------|
| `5164:6564` | ✓ `5164-6564.json` | ✓ REST `componentProperties` (desktop INSTANCE too large for single MCP call) | ✓ SectionPill Type=Pricing; PricingTrackingLabel; PriceDisplay; TrustStripItem; Button/Primary |
| `5164:6915` | ✓ `5164-6915.json` | ✓ MCP `get_design_context` (mobile frame) | ✓ |
| `5164:11487` | ✓ `5164-11487.json` | ✓ MCP `get_design_context` (animation) | ✓ PricingSectionanimation Property 1=1 |


## Social proof slice (#9) — 2026-07-02

- **Desktop (`5164:6568` — SocialProofSectionBig):** SectionHeader pill “Trusted by Leaders”, H2 “Built for Founders, Proven in Production”, horizontal testimonial carousel (2× `TestimonialBlock` Variant A/B with logo card + quote + `TestimonialAuthor`), `SlideProgressBar` (track/fill + slide numbers 1–3), decorative plane vector, integrations strip with 14 client logos.
- **Mobile (`5164:6836` — Social proof):** Stacked testimonial cards (horizontal scroll), same header copy, integrations logo grid below.
- **Motion testimonials (`5307:6608` — SocialProofSection):** Testimonial carousel animation frame per `tokens/MOTION-SPEC.md` §8 (1-step hover reveal).
- **Motion clients (`5164:11204` — clients-animaiton):** Integrations strip animation variant `Property 1=1` per `tokens/MOTION-SPEC.md` §5 (1-step hover reveal). Thin strip (1440×159) — reference PNG exported @4× to pass placeholder gate.
- **Assets:** 2 testimonial logos, decorative plane SVG, avatar glow/circle SVGs, 14 client logos → `public/images/social-proof-*` and `public/icons/icon-social-proof-plane.svg`.

### Dual-source reconciliation (Social proof)

| slice-root | REST cache | MCP / componentProperties | instanceVariants in checklist |
|------------|------------|---------------------------|------------------------------|
| `5164:6568` | ✓ `5164-6568.json` | ✓ MCP `get_design_context` + REST `componentProperties` | ✓ SectionPill Type=Trusted; 2× TestimonialBlock Variant=A/B |
| `5164:6836` | ✓ `5164-6836.json` | ✓ REST | ✓ |
| `5307:6608` | ✓ `5307-6608.json` | ✓ REST | ✓ |
| `5164:11204` | ✓ `5164-11204.json` | ✓ REST | ✓ clients-animaiton Property 1=1 |

## Feature grid slice (#10) — 2026-07-02

- **Desktop (`5164:6562` — FeatureGrid):** SectionHeader pill “Platform Features”, H2 “Built for Speed, Precision, and Total Control”, 6× `FeatureCard` in 2 rows (badges on row 1), footer tagline + “Start Building Now” CTA, decorative plane vectors top/bottom.
- **Mobile (`5164:6785` — FeatureGrid — Light Modern):** Stacked feature cards with same copy; mobile badge labels differ slightly (e.g. “Churning Validation” vs desktop “ADM Alert Engine”).
- **Motion (`5404:6074` — FeatureGrid-animation):** 4-step cascade (hover → auto ×3 @ 300ms step delay) per `tokens/MOTION-SPEC.md` §7.
- **Assets:** Decorative planes exported to `public/icons/icon-feature-grid-plane-{top,bottom}.svg`. CTA arrow reuses `public/icons/icon-plane-arrow-white.svg`.

### Dual-source reconciliation (Feature grid)

| slice-root | REST cache | MCP / componentProperties | instanceVariants in checklist |
|------------|------------|---------------------------|------------------------------|
| `5164:6562` | ✓ `5164-6562.json` | ✓ (REST nodes include `componentProperties`) | ✓ 6× FeatureCard + per-card AccentBar |
| `5164:6785` | ✓ `5164-6785.json` | ✓ | ✓ |
| `5404:6074` | ✓ `5404-6074.json` | ✓ | ✓ |

`build:spec-from-cache` emits `instanceVariants` on INSTANCE nodes — contract §4 must list
one accent row per card (not one generic “Accent bar” row).

## How-it-works teaser slice (#7) — 2026-07-01

- **Desktop (`5164:6567` — HowItWorksSection):** SectionHeader pill “How It Works”, H2 “From contract to booking in three steps.”, 3× `HIWCard` (GDS connect → parallel search → branded portal), footer link “How does the technical setup work? Read the full breakdown →”.
- **Mobile (`5164:6690` — How It Works):** Stacked HIW cards with same copy; narrower card visuals.
- **Motion (`5164:10412` — HowItWorks-animation):** 4-step cascade (hover → auto ×3 @ 120ms step delay) per `tokens/MOTION-SPEC.md` §4 — same pattern as ProblemSection.
- **Assets:** Card visuals are CSS mock UI (rectangles + text labels — Sabre, Amadeus, etc.); no new static SVG/PNG exports. Footer link arrow reuses `public/icons/icon-button-arrow.svg` (master `2780:1506`).

## Comparison first slice (#6) — 2026-07-01

- **Desktop (`5164:6566` — ComparisonSection):** SectionHeader “The Choice”, GiantTicket with industry-norm + MaqsoodTravel ComparisonCards (3 rows each), savings footnote, Book A Free Demo CTA.
- **Mobile (`5164:6609` — ComparisonSection — v3 FINAL):** Stacked LeftCard / RightCard with same copy; split H2 lines.
- **Motion (`5164:10411` — ComparisonSection-animation):** One-step hover reveal per `tokens/MOTION-SPEC.md`.
- **CTA arrow:** Primary button graphic exported to `public/icons/icon-plane-arrow-white.svg`.

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
| `I5164:6566;5151:7328;2780:1425;2780:1499` | Comparison CTA arrow | svg | `public/icons/icon-plane-arrow-white.svg` | primary CTA |
| `I5164:6562;3109:1189` | Feature grid plane top | svg | `public/icons/icon-feature-grid-plane-top.svg` | decorative |
| `I5164:6562;3109:1186` | Feature grid plane bottom | svg | `public/icons/icon-feature-grid-plane-bottom.svg` | decorative |
| `I5164:6568;5151:13742;5159:5008;5159:23;5158:14` | Social proof testimonial logo A | png | `public/images/social-proof-testimonial-logo-a.png` | Moazam Arshad block |
| `I5164:6568;5151:13742;5159:5023;5159:36;5158:14` | Social proof testimonial logo B | png | `public/images/social-proof-testimonial-logo-b.png` | Lance Bohling block |
| `I5164:6568;5151:13742;5151:13905` | Social proof decorative plane | svg | `public/icons/icon-social-proof-plane.svg` | decorative |
| `I5164:6568;5151:13742;5159:5008;5159:26;5159:14;3171:23` | Avatar initials glow ring | svg | `public/icons/icon-avatar-glow.svg` | testimonial author |
| `I5164:6568;5151:13742;5159:5008;5159:26;5159:14;3171:24` | Avatar initials circle fill | svg | `public/icons/icon-avatar-circle.svg` | testimonial author |
| `I5164:6568;5151:13791;5151:13718` | Social proof client logo 01 | png | `public/images/social-proof-client-01.png` | integrations strip |
| `I5164:6568;5151:13791;5151:13720` | Social proof client logo 02 | png | `public/images/social-proof-client-02.png` | integrations strip |
| `I5164:6568;5151:13791;5151:13721` | Social proof client logo 03 | png | `public/images/social-proof-client-03.png` | integrations strip |
| `I5164:6568;5151:13791;5151:13723` | Social proof client logo 04 | png | `public/images/social-proof-client-04.png` | integrations strip |
| `I5164:6568;5151:13791;5151:13724` | Social proof client logo 05 | png | `public/images/social-proof-client-05.png` | integrations strip |
| `I5164:6568;5151:13791;5151:13726` | Social proof client logo 06 | png | `public/images/social-proof-client-06.png` | integrations strip |
| `I5164:6568;5151:13791;5151:13727` | Social proof client logo 07 | png | `public/images/social-proof-client-07.png` | integrations strip |
| `I5164:6568;5151:13791;5151:13729` | Social proof client logo 08 | png | `public/images/social-proof-client-08.png` | integrations strip |
| `I5164:6568;5151:13791;5151:13730` | Social proof client logo 09 | png | `public/images/social-proof-client-09.png` | integrations strip |
| `I5164:6568;5151:13791;5151:13732` | Social proof client logo 10 | png | `public/images/social-proof-client-10.png` | integrations strip |
| `I5164:6568;5151:13791;5151:13734` | Social proof client logo 11 | png | `public/images/social-proof-client-11.png` | integrations strip |
| `I5164:6568;5151:13791;5151:13735` | Social proof client logo 12 | png | `public/images/social-proof-client-12.png` | integrations strip |
| `I5164:6568;5151:13791;5151:13737` | Social proof client logo 13 | png | `public/images/social-proof-client-13.png` | integrations strip |
| `I5164:6568;5151:13791;5151:13739` | Social proof client logo 14 | png | `public/images/social-proof-client-14.png` | integrations strip |

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

## Footer slice (GH#12)

- **Desktop (`5164:6565`):** brand column + Product/Company nav columns + bottom legal row.
- **Mobile (`5164:7038`):** stacked brand, Developers/Company columns, legal row.
- **Motion (`5164:10371`):** mobile link hover emphasis (1-step, 700ms).
- **Shared:** `component.footer` in `app/layout.tsx` on `/`, `/contact`, `/how-it-works`.
- **Refs:** `reference-footer.png`, `reference-footermobile.png`, `reference-footer-animation.png`
