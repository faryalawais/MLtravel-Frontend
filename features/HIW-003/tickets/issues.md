# HIW-003 — GitHub issues

> **Published:** 2026-07-06 via `features/HIW-003/tickets/publish-issues.sh`  
> **Parent:** HIW-003 · **FE ticket:** HIW-003-FE · **BE:** HIW-003-BE waived (no issue)

**Global gate (all slices):** LP-001 [#3](https://github.com/faryalawais/MLtravel-Frontend/issues/3) Navbar · [#4](https://github.com/faryalawais/MLtravel-Frontend/issues/4) Hero · [#7](https://github.com/faryalawais/MLtravel-Frontend/issues/7) HIW teaser · [#9](https://github.com/faryalawais/MLtravel-Frontend/issues/9) Social proof · [#12](https://github.com/faryalawais/MLtravel-Frontend/issues/12) Footer · LP-001-BE [#2](https://github.com/faryalawais/MLtravel-Frontend/issues/2)

## Figma coverage map (`5217:6697` desktop · `5217:6715` mobile)

| Figma region | nodeId | Issue | Notes |
|--------------|--------|-------|-------|
| Navbar | `5217:6698` / `5217:7024` | LP-001 #3 | Layout chrome — not HIW slice |
| Hero (desktop) | `5217:6699` | [#18](https://github.com/faryalawais/MLtravel-Frontend/issues/18) | Net-new wrapper |
| Hero + stats (mobile top) | `5217:7073` | [#18](https://github.com/faryalawais/MLtravel-Frontend/issues/18) | Reuse `HeroSection` variant |
| Three-step section | `5217:6700` / `5164:6567` | [#19](https://github.com/faryalawais/MLtravel-Frontend/issues/19) | Reuse teaser |
| Mid CTA | `5217:6701` | [#20](https://github.com/faryalawais/MLtravel-Frontend/issues/20) | Desktop only |
| Six-week timeline | `5217:6705` / `5217:6812` | [#21](https://github.com/faryalawais/MLtravel-Frontend/issues/21) | Net-new |
| Testimonial (mobile) | `5217:6867` | [#22](https://github.com/faryalawais/MLtravel-Frontend/issues/22) | Reuse social proof |
| Benefits stats (mobile) | `5217:6883` | [#23](https://github.com/faryalawais/MLtravel-Frontend/issues/23) | Net-new |
| Final CTA | `5217:7555` / `5217:7583` | [#24](https://github.com/faryalawais/MLtravel-Frontend/issues/24) | Net-new |
| FAQ | `5261:8072` / `5261:8150` | [#25](https://github.com/faryalawais/MLtravel-Frontend/issues/25) | Net-new + full-page visual gate |
| Footer | `5217:6714` / `5217:7112` | LP-001 #12 | Layout chrome |

**Motion:** Each net-new slice (#18, #20–#25) includes Figma dev-mode motion extract + Playwright spec. Reused slices (#19, #22) inherit LP-001 motion tests.

---

| Slice | Issue | Title | Blocked by |
|-------|-------|-------|------------|
| 1 | [#18](https://github.com/faryalawais/MLtravel-Frontend/issues/18) | HIW-003-FE · Hero — desktop wrapper + mobile reuse variant | LP-001 #3, #4, #12 |
| 2 | [#19](https://github.com/faryalawais/MLtravel-Frontend/issues/19) | HIW-003-FE · Three-step section — compose landing teaser | #18 · LP-001 #7 |
| 3 | [#20](https://github.com/faryalawais/MLtravel-Frontend/issues/20) | HIW-003-FE · Mid CTA — Seen enough? live demo | #19 |
| 4 | [#21](https://github.com/faryalawais/MLtravel-Frontend/issues/21) | HIW-003-FE · Six-week onboarding timeline | #20 |
| 5 | [#22](https://github.com/faryalawais/MLtravel-Frontend/issues/22) | HIW-003-FE · Mobile testimonial — reuse social proof card | #21 · LP-001 #9 |
| 6 | [#23](https://github.com/faryalawais/MLtravel-Frontend/issues/23) | HIW-003-FE · Mobile benefits stats row | #22 |
| 7 | [#24](https://github.com/faryalawais/MLtravel-Frontend/issues/24) | HIW-003-FE · Final CTA — closing demo prompt | #23 |
| 8 | [#25](https://github.com/faryalawais/MLtravel-Frontend/issues/25) | HIW-003-FE · FAQ — category tabs + accordion | #24 |

**Layout order:** Hero → Steps → Mid CTA → Six-week → (Testimonial → Benefits, mobile only) → Final CTA → FAQ

**Gherkin rule:** One `@fe` scenario per issue #18–#25.

---

## Issue #18 — Hero

## Parent

HIW-003 — How It Works ([brief](docs/features/HIW-003/brief.md))

## What to build

HIW page hero: desktop `5217:6699`, mobile `5217:7073`. Mobile reuses `HeroSection` variant; desktop net-new + `HeroPrimaryCta` → `/contact`. Motion per Figma.

## Acceptance criteria

- [ ] Desktop `5217:6699` at 1440px
- [ ] Mobile `5217:7073` at 393px (single CTA + stats grid; no panel/logos)
- [ ] CTA → `/contact`; motion + visual baselines

## Blocked by

- LP-001 #3, #4, #12

---

## Issue #19 — Three-step

## Parent

HIW-003

## What to build

Compose `HowItWorksTeaserSection` — `5217:6700` / `5164:6567` desktop, `5164:6690` mobile. Hide footer link on `/how-it-works`.

## Acceptance criteria

- [ ] Cards, copy, hover motion match landing Figma
- [ ] No learn-more footer on HIW route

## Blocked by

- [#18](https://github.com/faryalawais/MLtravel-Frontend/issues/18) · LP-001 #7

---

## Issue #20 — Mid CTA

## Parent

HIW-003

## What to build

`S4-MidCTA` `5217:6701` — desktop band + `HeroPrimaryCta`. Omit on mobile if absent from `5217:6715`.

## Acceptance criteria

- [ ] Figma copy/layout desktop; motion spec

## Blocked by

- [#19](https://github.com/faryalawais/MLtravel-Frontend/issues/19)

---

## Issue #21 — Six-week

## Parent

HIW-003

## What to build

`SixWeekSection` `5217:6705` desktop, `5217:6812` mobile — Week 1–6 cards + timeline motion.

## Acceptance criteria

- [ ] All week cards + header; desktop + mobile baselines; motion spec

## Blocked by

- [#20](https://github.com/faryalawais/MLtravel-Frontend/issues/20)

---

## Issue #22 — Mobile testimonial

## Parent

HIW-003

## What to build

Reuse social proof testimonial for `5217:6867` — mobile only.

## Acceptance criteria

- [ ] Moazam Arshad block at 393px; absent at 1440px

## Blocked by

- [#21](https://github.com/faryalawais/MLtravel-Frontend/issues/21) · LP-001 #9

---

## Issue #23 — Mobile benefits stats

## Parent

HIW-003

## What to build

Benefits row `5217:6883` — 4 tiles (*Zero booking fees*, etc.) — mobile only.

## Acceptance criteria

- [ ] All tiles at 393px; absent at 1440px

## Blocked by

- [#22](https://github.com/faryalawais/MLtravel-Frontend/issues/22)

---

## Issue #24 — Final CTA

## Parent

HIW-003

## What to build

`FinalCTASection` `5217:7555` / `5217:7583` + `HeroPrimaryCta` → `/contact`.

## Acceptance criteria

- [ ] Desktop + mobile Figma match; motion spec

## Blocked by

- [#23](https://github.com/faryalawais/MLtravel-Frontend/issues/23)

---

## Issue #25 — FAQ

## Parent

HIW-003

## What to build

`FAQSection` `5261:8072` / `5261:8150` — tabs + single-open accordion. **Full-page visual gate** vs `5217:6697` + `5217:6715`.

## Acceptance criteria

- [ ] All FAQ copy; tab + accordion interaction; motion
- [ ] Full HIW page Figma coverage complete after this slice

## Blocked by

- [#24](https://github.com/faryalawais/MLtravel-Frontend/issues/24)
