# Feature Brief — HIW-003

**Feature:** How It Works section — a standalone page that explains how ML Travel works, with animated step-by-step content on desktop and mobile.
**Persona:** All users — visitors, prospects, agency owners, and operations leads exploring the product.
**Problem:** Users need a clear explanation of how the product works before they commit to a demo or signup; without it, the value and onboarding flow stay opaque.
**Figma:** [How It Works — faryal-updated](https://www.figma.com/design/h6BqI1ZRMSJxR7jESNF0Ep/ML-Travel-Project--faryal-updated-?node-id=5217-6696&p=f&m=dev) — **HIW-003** · includes desktop and mobile layouts and section animations; all frames and motion must be covered in implementation.
**Swagger:** none yet
**Created:** 2026-07-06

## Scope

**In:** HIW page at `/how-it-works` — **reuse-first from LP-001** (hero mobile variant, three-step teaser, social proof testimonial, `HeroPrimaryCta`, layout chrome); net-new sections: desktop hero, mid CTA, six-week timeline, mobile benefits stats, final CTA, FAQ; desktop + mobile layouts; section animations per Figma.

**Out:** Landing page HIW teaser (LP-001), Contact flow (CP-002), custom booking or backend APIs.

## Depends on

- LP-001 (shared Navbar/Footer and site chrome).
- Design tokens in `tokens/`.
- Motion spec in Figma dev mode for animated sections.
