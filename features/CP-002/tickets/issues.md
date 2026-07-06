# CP-002 — GitHub issues

> **Published:** 2026-07-06 via `features/CP-002/tickets/publish-issues.sh`  
> **Parent:** CP-002 · **FE ticket:** CP-002-FE · **BE:** CP-002-BE waived (no issue)

**Global gate (all slices):** LP-001 [#3](https://github.com/faryalawais/MLtravel-Frontend/issues/3) Navbar + [#12](https://github.com/faryalawais/MLtravel-Frontend/issues/12) Footer · LP-001-BE [#2](https://github.com/faryalawais/MLtravel-Frontend/issues/2) `be-implemented`

| Slice | Issue | Title | Blocked by |
|-------|-------|-------|------------|
| 1 | [#14](https://github.com/faryalawais/MLtravel-Frontend/issues/14) | CP-002-FE · Contact hero — headline and subhead | LP-001 #3, #12 |
| 2 | [#15](https://github.com/faryalawais/MLtravel-Frontend/issues/15) | CP-002-FE · Calendly embed — iframe, skeleton, error fallback | #14 |
| 3 | [#16](https://github.com/faryalawais/MLtravel-Frontend/issues/16) | CP-002-FE · Email fallback — “Not ready to book a slot?” | #15 |

**Layout order:** Hero → Calendly embed → email fallback (sequential implementation).

**Gherkin rule:** One `@fe` scenario per issue #14–#16.

---

## Issue #14 — Contact hero

## Parent

CP-002 — Contact Us ([brief](docs/features/CP-002/brief.md))

## What to build

Figma-matched contact hero on `/contact`: headline *“Get a live demo of your platform”* and subhead *“Pick a time and we'll show you exactly what the switch looks like for your setup.”* from frame `5185:4332`.

Registers as `component.contact.hero`. Desktop pixel match at 1440px; mobile fluid stack. Copy in `constants/contact.constants.ts`; tokens only — no raw hex or px.

Reuses LP-001 `component.navbar` and `component.footer` (no duplicate chrome).

## Acceptance criteria

- [ ] Guest on `/contact` at 1440px sees `component.contact.hero` with Figma headline and subhead
- [ ] Guest on `/contact` at 393px sees hero in fluid layout
- [ ] `screen.contact.page` test id present
- [ ] No raw hex or px in hero component — token lint passes
- [ ] Visual sign-off vs Figma `5185:4332` hero region

## Blocked by

- [LP-001 #3](https://github.com/faryalawais/MLtravel-Frontend/issues/3) Navbar
- [LP-001 #12](https://github.com/faryalawais/MLtravel-Frontend/issues/12) Footer

---

## Issue #15 — Calendly embed

## Parent

CP-002 — Contact Us

## What to build

Calendly booking area on `/contact`: native `<iframe>` sourced from `NEXT_PUBLIC_CALENDLY_URL` (no `react-calendly` package).

Three states in the embed container (`component.contact.embed`):
- **Loading:** `component.contact.embedSkeleton` until iframe `onLoad`
- **Loaded:** iframe visible, skeleton hidden
- **Error / unset URL:** `component.contact.embedFallback` — message + external link to Calendly URL

Embed container dimensions match Figma slot (~868×550 booking area in `5185:4332`). Calendly handles date/time/details/confirmation inside iframe — do not build custom calendar UI.

## Acceptance criteria

- [ ] With valid `NEXT_PUBLIC_CALENDLY_URL`, iframe `src` includes configured URL
- [ ] Skeleton visible before iframe loads; hidden after `onLoad`
- [ ] With URL unset or load failure, fallback message + external link visible
- [ ] No custom calendar, form, or step UI outside iframe
- [ ] iframe has accessible `title` attribute
- [ ] Mobile: responsive embed in fluid layout

## Blocked by

- [#14](https://github.com/faryalawais/MLtravel-Frontend/issues/14) (hero establishes page layout above embed)

---

## Issue #16 — Email fallback block

## Parent

CP-002 — Contact Us

## What to build

Email fallback section below the Calendly embed on `/contact` (`component.contact.fallback`):

- Heading: *“Not ready to book a slot?”*
- Body copy from Figma `5185:4332` (agency / GDS / switching message)
- Email CTA styled as `Button/Secondary2` — `mailto:` link using `NEXT_PUBLIC_CONTACT_EMAIL` (label shows env email, not hardcoded Figma `hello@maqsoodtravel.com`)

## Acceptance criteria

- [ ] Fallback heading and body copy match Figma
- [ ] Email CTA `href` is `mailto:` with address from `NEXT_PUBLIC_CONTACT_EMAIL`
- [ ] CTA keyboard-focusable with visible focus ring (tokens)
- [ ] Mobile: fallback block stacks in fluid layout below embed
- [ ] Visual sign-off vs Figma fallback region in `5185:4332`

## Blocked by

- [#15](https://github.com/faryalawais/MLtravel-Frontend/issues/15) (embed sits above fallback in Figma Y-order)
