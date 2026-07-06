Feature: Contact Us (CP-002)

  # AC-11: token lint enforced by npm run gate — not a UI scenario
  # AC-12: Calendly confirmation copy — ops/Calendly admin — not FE E2E
  # AC-13: health endpoint — LP-001 GH#2 @be — not duplicated for CP-002
  # GitHub issues #14–#16 · PRD v2 approved 2026-07-06
  # Every @fe slice: 1440px Figma match + 393px visibility (no mobile Figma node, no animation)
  # Page flow: Navbar → Hero → Calendly embed → Email fallback → Footer (chrome from LP-001)

  # ── FE scenarios ──────────────────────────────────────────────────────────

  @fe
  Scenario: GH#14 — Contact hero matches desktop and is visible on mobile
    Given a guest views the site at 1440px width
    When the guest navigates to "/contact"
    Then `screen.contact` is visible
    And `component.navbar` is visible
    And `component.footer` is visible
    And `component.contact.hero` is visible
    And `component.contact.hero` matches Figma node "5185:4332"
    And `component.contact.hero` displays headline "Get a live demo of your platform"
    And `component.contact.hero` displays subhead "Pick a time and we'll show you exactly what the switch looks like for your setup."
    Given a guest views the site at 393px width
    When the guest navigates to "/contact"
    Then `screen.contact` is visible
    And `component.contact.hero` is visible
    And `component.contact.hero` is in fluid mobile layout

  @fe
  Scenario: GH#15 — Calendly embed loads with skeleton transition on desktop and mobile
    Given Calendly URL is configured in the environment
    And a guest views the site at 1440px width
    When the guest navigates to "/contact"
    Then `component.contact.embed` is visible
    And `component.contact.embedSkeleton` is visible before the Calendly iframe loads
    When the Calendly iframe finishes loading
    Then `component.contact.embedSkeleton` is not visible
    And `component.contact.embed` contains a Calendly iframe for the configured URL
    And `component.contact.embed` iframe has an accessible title
    And no custom calendar or booking form is visible outside the embed
    Given a guest views the site at 393px width
    When the guest navigates to "/contact"
    Then `component.contact.embed` is visible
    And `component.contact.embed` is in fluid mobile layout

  @fe
  Scenario: GH#15 — Calendly embed shows fallback when URL is not configured
    Given Calendly URL is not configured in the environment
    And a guest views the site at 1440px width
    When the guest navigates to "/contact?e2e_no_calendly=1"
    Then `component.contact.embedFallback` is visible
    And `component.contact.embedFallback` displays an external link to book via Calendly
    And no custom calendar or booking form is visible outside the embed

  @fe
  Scenario: GH#16 — Email fallback block matches desktop and mailto on mobile
    Given a guest views the site at 1440px width
    When the guest navigates to "/contact"
    Then `component.contact.fallback` is visible
    And `component.contact.fallback` matches Figma node "5185:4332"
    And `component.contact.fallback` displays heading "Not ready to book a slot?"
    And `component.contact.fallback` displays body copy about agency and GDS switching
    And `component.contact.fallback` email cta navigates to mailto for configured contact email
    When the guest focuses `component.contact.fallback` email cta
    Then `component.contact.fallback` email cta uses token "color.action.secondary.focused.border"
    Given a guest views the site at 393px width
    When the guest navigates to "/contact"
    Then `component.contact.fallback` is visible
    And `component.contact.fallback` is in fluid mobile layout below `component.contact.embed`
