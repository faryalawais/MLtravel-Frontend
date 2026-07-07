Feature: How It Works (HIW-003)

  # AC-12: motion validated in separate *-motion.spec.ts — not inline in @fe scenarios (slice grill-me S3)
  # AC-13: token lint enforced by npm run gate — not a UI scenario
  # AC-14: health endpoint — LP-001 GH#2 @be — not duplicated for HIW-003
  # GitHub issues #18–#25 · PRD v2 approved 2026-07-06
  # Every @fe slice: 1440px + 393px Figma match where applicable (slice grill-me S2)
  # Page flow: Navbar → Hero → Steps → Mid CTA → Six-week → (Testimonial → Benefits, mobile) → Final CTA → FAQ → Footer

  # ── FE scenarios (1:1 with vertical slice issues) ─────────────────────────

  @fe
  Scenario: GH#18 — HIW hero matches desktop Figma and mobile hiw-page hero variant
    Given a guest views the site at 1440px width
    When the guest navigates to "/how-it-works"
    Then `screen.howItWorks` is visible
    And `component.navbar` is visible
    And `component.footer` is visible
    And `component.howItWorks.hero` is visible
    And `component.howItWorks.hero` matches Figma node "5217:6699"
    When the guest activates `component.howItWorks.hero` demo cta
    Then the guest is on "/contact"
    Given a guest views the site at 393px width
    When the guest navigates to "/how-it-works"
    Then `screen.howItWorks` is visible
    And `component.landing.hero` is visible with layout "hiw-page"
    And `component.landing.hero` matches Figma node "5217:7073"
    And `component.landing.hero` displays hero stats grid
    And `component.landing.hero` does not display product panel
    And `component.landing.hero` does not display logos strip
    When the guest activates `component.landing.hero` primary cta
    Then the guest is on "/contact"

  @fe
  Scenario: GH#19 — Three-step section reuses landing teaser without footer link on HIW route
    Given a guest views the site at 1440px width
    When the guest navigates to "/how-it-works"
    Then `component.landing.howItWorksTeaser` is visible
    And `component.landing.howItWorksTeaser` matches Figma node "5164:6567"
    And `component.landing.howItWorksTeaser.footerNote` is not visible
    Given a guest views the site at 393px width
    When the guest navigates to "/how-it-works"
    Then `component.landing.howItWorksTeaser` is visible
    And `component.landing.howItWorksTeaser` matches Figma node "5164:6690"
    And `component.landing.howItWorksTeaser.footerNote` is not visible

  @fe
  Scenario: GH#20 — Mid CTA band matches desktop Figma and is absent on mobile
    Given a guest views the site at 1440px width
    When the guest navigates to "/how-it-works"
    Then `component.howItWorks.midCta` is visible
    And `component.howItWorks.midCta` matches Figma node "5217:6701"
    And `component.howItWorks.midCta` displays copy "Seen enough? Let's show you a live demo."
    When the guest activates `component.howItWorks.midCta` demo cta
    Then the guest is on "/contact"
    Given a guest views the site at 393px width
    When the guest navigates to "/how-it-works"
    Then `component.howItWorks.midCta` is not visible

  @fe
  Scenario: GH#21 — Six-week timeline matches desktop and mobile Figma
    Given a guest views the site at 1440px width
    When the guest navigates to "/how-it-works"
    Then `component.howItWorks.sixWeek` is visible
    And `component.howItWorks.sixWeek` matches Figma node "5217:6705"
    And `component.howItWorks.sixWeek` displays week cards "WEEK 1" through "WEEK 6"
    Given a guest views the site at 393px width
    When the guest navigates to "/how-it-works"
    Then `component.howItWorks.sixWeek` is visible
    And `component.howItWorks.sixWeek` matches Figma node "5217:6812"

  @fe
  Scenario: GH#22 — Testimonial reuses social proof card on mobile and desktop strip
    Given a guest views the site at 393px width
    When the guest navigates to "/how-it-works"
    Then `component.howItWorks.mobileSocialStrip` is visible
    And `component.landing.socialProof.testimonialBlock` is visible
    And `component.landing.socialProof.testimonialBlock` matches Figma node "5217:6867"
    And `component.landing.socialProof.testimonialBlock` displays attribution "Moazam Arshad"
    Given a guest views the site at 1440px width
    When the guest navigates to "/how-it-works"
    Then `component.howItWorks.mobileSocialStrip` is not visible
    And `component.howItWorks.sixWeek.socialProofStrip` is visible
    And `component.landing.socialProof.testimonialBlock` is visible on HIW page
    And `component.howItWorks.sixWeek.socialProofStrip` displays benefit "Zero booking fees"

  @fe
  Scenario: GH#23 — Mobile benefits stats row matches Figma and is absent on desktop
    Given a guest views the site at 393px width
    When the guest navigates to "/how-it-works"
    Then `component.howItWorks.benefitsStats` is visible
    And `component.howItWorks.benefitsStats` matches Figma node "5217:6883"
    And `component.howItWorks.benefitsStats` displays benefit "Zero booking fees"
    And `component.howItWorks.benefitsStats` displays benefit "Full white-label"
    And `component.howItWorks.benefitsStats` displays benefit "Multi-GDS search"
    Given a guest views the site at 1440px width
    When the guest navigates to "/how-it-works"
    Then `component.howItWorks.benefitsStats` is not visible

  @fe
  Scenario: GH#24 — Final CTA matches desktop and mobile Figma with demo link to contact
    Given a guest views the site at 1440px width
    When the guest navigates to "/how-it-works"
    Then `component.howItWorks.finalCta` is visible
    And `component.howItWorks.finalCta` matches Figma node "5217:7555"
    When the guest activates `component.howItWorks.finalCta` demo cta
    Then the guest is on "/contact"
    Given a guest views the site at 393px width
    When the guest navigates to "/how-it-works"
    Then `component.howItWorks.finalCta` is visible
    And `component.howItWorks.finalCta` matches Figma node "5217:7583"
    When the guest activates `component.howItWorks.finalCta` demo cta
    Then the guest is on "/contact"

  @fe
  Scenario: GH#25 — FAQ tabs filter questions and accordion expands one answer at a time
    Given a guest views the site at 1440px width
    When the guest navigates to "/how-it-works"
    Then `component.howItWorks.faq` is visible
    And `component.howItWorks.faq` matches Figma node "5261:8072"
    And `component.howItWorks.faq` has one expanded question in the default tab
    When the guest selects a different category tab on `component.howItWorks.faq`
    Then `component.howItWorks.faq` displays questions for the selected category only
    When the guest activates a collapsed question on `component.howItWorks.faq`
    Then that question answer is expanded
    And any other expanded question is collapsed
    Given a guest views the site at 393px width
    When the guest navigates to "/how-it-works"
    Then `component.howItWorks.faq` is visible
    And `component.howItWorks.faq` matches Figma node "5261:8150"
    And `screen.howItWorks` matches full page Figma nodes "5217:6697" and "5217:6715"
