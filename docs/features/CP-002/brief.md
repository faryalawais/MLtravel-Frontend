# Feature Brief — CP-002

**Feature:** Contact Us page — Calendly iframe embeds for demo booking (choose date/time, hours, details, and summary), pixel-accurate from Figma.
**Persona:** Every visitor — prospects, agency owners, and operations leads who want to book a live demo.
**Problem:** Interested users need a frictionless way to schedule a demo without sales back-and-forth or a custom-built calendar.
**Figma:** [Contact — Choose day (canonical layout)](https://www.figma.com/design/h6BqI1ZRMSJxR7jESNF0Ep/ML-Travel-Project--faryal-updated-?node-id=5185-4332&m=dev) — **CP-002 only** · layout `5185:4332` · reference `5186:4533`, `5186:4857`, `5198:4102` (Summary copy for Calendly admin).
**Swagger:** none yet
**Created:** 2026-07-06

## Scope

**In:** Contact page layout matching Figma; Calendly booking widget iframe embeds for the multi-step flow (date/time, hours, details, summary); shared Navbar/Footer from LP-001.

**Out:** Custom calendar or booking API (Calendly handles scheduling), Landing page sections (LP-001), How It Works page (HIW-003).

## Depends on

- LP-001 (shared Navbar/Footer and site chrome).
- Design tokens in `tokens/`.
- Calendly embed configuration (frontend iframe integration).
