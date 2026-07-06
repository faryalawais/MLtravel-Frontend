# FE Ticket — HIW-003-FE

**Parent:** HIW-003  
**Slice:** HIW-003.2 (UI)  
**Status:** tickets-created  
**Created:** 2026-07-06

## What to build

How It Works page at `/how-it-works` — static explainer with **reuse-first from LP-001**:

- Reuse LP-001 `component.navbar` and `component.footer` via layout (no duplicate chrome)
- **Reuse:** `HowItWorksTeaserSection` (three-step block; hide footer link on `/how-it-works`)
- **Reuse:** `HeroSection` mobile variant for top hero + `$3,000/mo` stats grid (`5217:7073` — no product panel, no logos strip)
- **Reuse:** `SocialProofSection` testimonial card (Moazam Arshad) on mobile only
- **Reuse:** `HeroPrimaryCta` for all demo buttons → `/contact`
- **Net-new:** desktop hero wrapper (`5217:6699`), mid CTA, six-week timeline, mobile benefits stats, final CTA, FAQ (tabs + single-open accordion)
- Dual pixel-match: desktop `5217:6697` @ 1440px, mobile `5217:6715` @ 393px
- English only; design tokens only — no raw hex or px
- Motion: net-new sections per Figma; reused sections keep LP-001 motion specs

### Implementation order (for `/to-issues`)

1. Hero — mobile: `HeroSection` variant; desktop: net-new wrapper + `HeroPrimaryCta`
2. Three-step — compose `HowItWorksTeaserSection`
3. Mid CTA — net-new + `HeroPrimaryCta` (desktop)
4. Six-week timeline — net-new
5. Testimonial + benefits — reuse social proof testimonial; net-new benefits stats (mobile only)
6. Final CTA — net-new + `HeroPrimaryCta`
7. FAQ — net-new (tabs + accordion)

Per slice: `figma-extract` → LP-001 reuse audit in `design-contract` → `fe-implement`.

## Figma frames

| # | Frame | nodeId | Role |
|---|-------|--------|------|
| 1 | HIW canvas | `5217:6696` | Anchor |
| 2 | HIW-Desktop | `5217:6697` | Canonical desktop layout |
| 3 | HIW-Mobile | `5217:6715` | Canonical mobile layout |
| 4 | HIWHeroSection | `5217:6699` | Desktop hero |
| 5 | Mobile hero+stats | `5217:7073` | Reuse LP-001 `5164:7080` variant |
| 6 | HowItWorksSection | `5217:6700` | Reuse LP-001 `5164:6567` |
| 7 | S4-MidCTA | `5217:6701` | Mid demo CTA |
| 8 | SixWeekSection | `5217:6705` / `5217:6812` | Timeline |
| 9 | Testimonial | `5217:6867` | Reuse social proof — mobile only |
| 10 | Benefits stats | `5217:6883` | Net-new — mobile only |
| 11 | FinalCTASection | `5217:7555` / `5217:7583` | Final CTA |
| 12 | FAQSection | `5261:8072` / `5261:8150` | FAQ |
| 13 | Landing HIW teaser | `5164:6567` / `5164:6690` | Reused three-step source |

**Registry roots:** `screen.how-it-works.*`, `component.how-it-works.*` (net-new); `component.landing.*` (reused paths)

## Data Points (fields this FE ticket needs from BE)

| UI Component | Data field | Source endpoint | Response path |
|-------------|-----------|-----------------|---------------|
| *(none — static HIW page)* | — | — | — |

HIW page does not call BE on load.

## Acceptance Criteria (@fe)

1. Guest on `/how-it-works` at **1440px** sees `screen.how-it-works.page` with LP-001 `component.navbar` and `component.footer`.
2. Desktop `component.how-it-works.hero` matches Figma `5217:6699` using `HeroPrimaryCta` → `/contact`.
3. At **393px**, `component.landing.hero.mobile` variant renders headline, single CTA, and hero stats grid matching `5217:7073`.
4. `component.landing.howItWorksTeaser` on `/how-it-works` matches landing behaviour with footer link hidden.
5. `component.how-it-works.midCta` shows *"Seen enough? Let's show you a live demo."* and `HeroPrimaryCta` → `/contact` at desktop width.
6. `component.how-it-works.sixWeek` shows Week 1–6 timeline per Figma `5217:6705` / `5217:6812`.
7. At **393px**, `component.landing.socialProof` testimonial card (Moazam Arshad) is visible — reused, not duplicated.
8. At **393px**, `component.how-it-works.benefitsStats` shows benefit tiles per `5217:6883`.
9. At **1440px**, testimonial and benefits stats are **not** in the DOM.
10. `component.how-it-works.finalCta` shows closing copy and `HeroPrimaryCta` → `/contact`.
11. `component.how-it-works.faq` — category tabs filter questions; accordion single-open.
12. Net-new section motion matches Figma; reused sections pass existing LP-001 motion specs.
13. No raw hex or px — token lint passes.
14. Visual sign-off: desktop `5217:6697` and mobile `5217:6715` match Figma.

## Dependencies

- **LP-001-FE:** Hero, How-it-works teaser, Social proof, Navbar, and Footer must be `fe-implemented` before HIW-003-FE starts.
- **LP-001-BE** (health stub): must be `be-implemented` before FE page work.
- **HIW-003-BE:** waived — no separate BE implementation.
- Per slice: `figma-extract` → `design-contract` → `fe-implement`.
