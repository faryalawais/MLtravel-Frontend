Feature: Landing page (LP-001)

  # AC-8: token lint enforced by npm run gate (no raw hex/px) — not a UI scenario
  # AC-10: human visual sign-off vs current Figma after spacing fixes — not automatable in BDD
  # GitHub issues #1–#7, #9–#12 · one scenario per issue · PRD v2 approved 2026-07-02
  # Page flow: Navbar → Hero → Problem → Comparison → How-it-works → Feature grid → Social proof → Pricing → Footer
  # GH#8 cancelled — no Comparison (2nd); `5164:6563` off-canvas
  # Every @fe slice: D4-Desktop + D4-Mobile + animation frame + MOTION-SPEC

  # ── FE scenarios ──────────────────────────────────────────────────────────

  @fe
  Scenario: GH#1 — Marketing route stubs resolve
    Given the marketing app is deployed
    When a guest navigates to "/"
    Then `screen.landing` is visible
    When a guest navigates to "/contact"
    Then `screen.contact` is visible
    When a guest navigates to "/how-it-works"
    Then `screen.howItWorks` is visible

  @fe
  Scenario: GH#3 — Navbar matches desktop mobile and animation
    Given a guest views the site at 1440px width
    When the guest navigates to "/"
    Then `component.navbar` is visible
    And `component.navbar` matches Figma node "5164:6559"
    And `component.navbar` link "How It Works" navigates to "/how-it-works"
    And `component.navbar` link "Pricing" scrolls to `component.landing.pricing`
    And `component.navbar` cta "Book A Demo" navigates to "/contact"
    Given a guest views the site at 393px width
    When the guest navigates to "/"
    Then `component.navbar` is visible
    And `component.navbar` matches Figma node "5164:7031"
    When the guest hovers `component.navbar.cta`
    Then `component.navbar.cta` uses token "motion.duration.default"
    And `component.navbar` motion matches Figma node "5164:10334"

  @fe
  Scenario: GH#4 — Hero matches desktop mobile and animation
    Given a guest views the site at 1440px width
    When the guest navigates to "/"
    Then `component.landing.hero` is visible
    And `component.landing.hero` matches Figma node "5164:6560"
    When the guest activates `component.landing.hero.cta`
    Then the guest is on "/contact"
    Given a guest views the site at 393px width
    When the guest navigates to "/"
    Then `component.landing.hero` is visible
    And `component.landing.hero` matches Figma node "5164:7080"
    And `component.landing.hero` motion matches Figma node "5164:10343"

  @fe
  Scenario: GH#5 — Problem section matches desktop mobile and animation
    Given a guest views the site at 1440px width
    When the guest navigates to "/"
    Then `component.landing.problem` is visible
    And `component.landing.problem` matches Figma node "5164:6561"
    Given a guest views the site at 393px width
    When the guest navigates to "/"
    Then `component.landing.problem` is visible
    And `component.landing.problem` matches Figma node "5164:6571"
    And `component.landing.problem` motion matches Figma node "5164:10344"

  @fe
  Scenario: GH#6 — Comparison block matches desktop mobile and animation
    Given a guest views the site at 1440px width
    When the guest navigates to "/"
    Then `component.landing.comparisonFirst` is visible
    And `component.landing.comparisonFirst` matches Figma node "5164:6566"
    Given a guest views the site at 393px width
    When the guest navigates to "/"
    Then `component.landing.comparisonFirst` is visible
    And `component.landing.comparisonFirst` matches Figma node "5164:6609"
    And `component.landing.comparisonFirst` motion matches Figma node "5164:10411"

  @fe
  Scenario: GH#7 — How-it-works teaser matches desktop mobile and animation
    Given a guest views the site at 1440px width
    When the guest navigates to "/"
    Then `component.landing.howItWorksTeaser` is visible
    And `component.landing.howItWorksTeaser` matches Figma node "5164:6567"
    Given a guest views the site at 393px width
    When the guest navigates to "/"
    Then `component.landing.howItWorksTeaser` is visible
    And `component.landing.howItWorksTeaser` matches Figma node "5164:6690"
    And `component.landing.howItWorksTeaser` motion matches Figma node "5164:10412"

  @fe
  Scenario: GH#10 — Feature grid matches desktop mobile and animation
    Given a guest views the site at 1440px width
    When the guest navigates to "/"
    Then `component.landing.featureGrid` is visible
    And `component.landing.featureGrid` matches Figma node "5164:6562"
    Given a guest views the site at 393px width
    When the guest navigates to "/"
    Then `component.landing.featureGrid` is visible
    And `component.landing.featureGrid` matches Figma node "5164:6785"
    And `component.landing.featureGrid` motion matches Figma node "5404:6074"

  @fe
  Scenario: GH#9 — Social proof matches desktop mobile and animation
    Given a guest views the site at 1440px width
    When the guest navigates to "/"
    Then `component.landing.socialProof` is visible
    And `component.landing.socialProof` matches Figma node "5164:6568"
    Given a guest views the site at 393px width
    When the guest navigates to "/"
    Then `component.landing.socialProof` is visible
    And `component.landing.socialProof` matches Figma node "5164:6836"
    And `component.landing.socialProof` motion matches Figma nodes "5307:6608" and "5164:11204"

  @fe
  Scenario: GH#11 — Pricing section matches desktop mobile and animation
    Given a guest views the site at 1440px width
    When the guest navigates to "/"
    Then `component.landing.pricing` is visible
    And `component.landing.pricing` matches Figma node "5164:6564"
    And `component.landing.pricing` has anchor id "pricing"
    Given a guest views the site at 393px width
    When the guest navigates to "/"
    Then `component.landing.pricing` is visible
    And `component.landing.pricing` matches Figma node "5164:6915"
    And `component.landing.pricing` motion matches Figma node "5164:11487"

  @fe
  Scenario: GH#12 — Footer matches desktop mobile and animation on all marketing routes
    Given a guest views the site at 1440px width
    When the guest navigates to "/"
    Then `component.footer` is visible
    And `component.footer` matches Figma node "5164:6565"
    When the guest navigates to "/contact"
    Then `component.footer` is visible
    And `component.footer` is the shared LP-001 implementation
    When the guest navigates to "/how-it-works"
    Then `component.footer` is visible
    And `component.footer` is the shared LP-001 implementation
    Given a guest views the site at 393px width
    When the guest navigates to "/"
    Then `component.footer` is visible
    And `component.footer` matches Figma node "5164:7038"
    And `component.footer` motion matches Figma node "5164:10371"

  # ── BE scenarios ──────────────────────────────────────────────────────────

  @be
  Scenario: GH#2 — Health endpoint returns 200
    Given the API server is running
    When a GET request is made to "/api/health"
    Then the response status is 200
    And the response body contains field "status"
