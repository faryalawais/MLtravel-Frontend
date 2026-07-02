import type { CSSProperties } from 'react';
import {
  DEFAULT_MOTION_STYLE,
  HERO_MOTION_STYLE,
  MOTION_TOKEN_REFS,
  SOCIAL_PROOF_CAROUSEL_SLIDE_DURATION,
} from '@/constants/motion.constants';
import { ids } from '@/tokens/build/test-ids';
import type { DesktopCardConfig, MobileCardConfig } from '@/types/landing.types';
import type {
  ComparisonMobileRowConfig,
  ComparisonRowConfig,
  FeatureGridCardAccent,
  FeatureGridCardConfig,
  HiwCardConfig,
  SocialProofClientLogoConfig,
  SocialProofTestimonialConfig,
} from '@/types/landing.types';

/** Landing page — hero section */
export const DESKTOP_STATS = [
  {
    testId: ids.component.landing.hero.stat1,
    value: '$1,200/mo',
    label: 'SAVED IN FEES',
    caption: 'Multiple Clients',
  },
  {
    testId: ids.component.landing.hero.stat2,
    value: '40%',
    label: 'FASTER PER BOOKING',
    caption: 'Post-migration measure',
  },
  {
    testId: ids.component.landing.hero.stat3,
    value: '6 Weeks',
    label: 'TO GO LIVE',
    caption: 'Dedicated Onboarding',
  },
  {
    testId: ids.component.landing.hero.stat4,
    value: '500+',
    label: 'AIRLINES CONNECTED',
    caption: 'Global inventory',
  },
] as const;

export const MOBILE_STATS = [
  { testId: ids.component.landing.hero.stat1, value: '$3,000/mo', label: 'SAVED IN FEES' },
  { testId: ids.component.landing.hero.stat2, value: '40%', label: 'FASTER PER BOOKING' },
  { testId: ids.component.landing.hero.stat3, value: '6 Weeks', label: 'TO GO LIVE' },
  { testId: ids.component.landing.hero.stat4, value: '500+', label: 'AIRLINES CONNECTED' },
] as const;

export const LOGO_PARTNERS = [
  'Sabre',
  'Amadeus',
  'Travelport',
  'IATA NDC',
  'Turkish Airlines',
  'Emirates',
  'British Airways',
  'Qatar Airways',
  'Etihad',
] as const;

/** Landing page — hero section (MOTION-SPEC §1) */
export const HERO_TOKENS = {
  motionDurationDefault: MOTION_TOKEN_REFS.durationDefault,
  motionEasingHero: MOTION_TOKEN_REFS.easingHero,
  motionAutoAdvanceVar: MOTION_TOKEN_REFS.autoAdvanceVar,
} as const;

export { HERO_MOTION_STYLE };

/** Landing page — problem section */
const problem = ids.component.landing.problem;

/** Semantic + motion token references (no raw values). */
export const PROBLEM_TOKENS = {
  shadowCard: 'var(--shadow-card)',
  motionDurationDefault: MOTION_TOKEN_REFS.durationDefault,
  motionEasingDefault: MOTION_TOKEN_REFS.easingDefault,
  motionStepDelayVar: MOTION_TOKEN_REFS.stepDelayVar,
  accentGradientHover:
    'linear-gradient(to right, var(--color-text-brand-navy), color-mix(in srgb, var(--color-text-brand-navy) 55%, var(--color-text-brand-orange)))',
  gradientBarBg:
    'linear-gradient(to right, var(--color-text-brand-navy), var(--color-text-brand-orange) 50%, color-mix(in srgb, var(--color-text-brand-navy) 55%, var(--color-text-brand-orange)))',
} as const;

export const PROBLEM_MOTION_STYLE: CSSProperties = DEFAULT_MOTION_STYLE;

export const PROBLEM_CARD_BASE_CLASS =
  'flex flex-col rounded-[var(--radius-panel)] bg-[var(--color-background-page)]';

export const CARD_SHELL_HIGHLIGHT = 'border-[var(--color-border-info)] shadow-[var(--shadow-card)]';

export const CARD_SHELL_DEFAULT = 'border-[var(--color-border-default)]';

export const CARD_SHELL_HOVER =
  'hover:border-[var(--color-border-info)] hover:shadow-[var(--shadow-card)] hover:-translate-y-[var(--spacing-4)]';

export const DESKTOP_CARDS: DesktopCardConfig[] = [
  {
    cardTestId: problem.card1,
    iconTestId: problem.card1Icon,
    graphicTestId: problem.card1Graphic,
    textBlockTestId: problem.card1TextBlock,
    headingTestId: problem.card1Heading,
    accentBarTestId: problem.card1AccentBar,
    bodyTestId: problem.card1Body,
    iconSrc: '/icons/icon-problem-card-1.svg',
    heading: 'Agents juggle multiple travel platforms to quote one fare.',
    body: 'Agents waste hours toggling between Sabre, Amadeus, Travelport, losing deals while competitors quote instantly.',
  },
  {
    cardTestId: problem.card2,
    iconTestId: problem.card2Icon,
    graphicTestId: problem.card2Graphic,
    textBlockTestId: problem.card2TextBlock,
    headingTestId: problem.card2Heading,
    accentBarTestId: problem.card2AccentBar,
    bodyTestId: problem.card2Body,
    iconSrc: '/icons/icon-problem-card-2.svg',
    heading: "Agencies pay heavily for 3rd party tools they'll never own.",
    body: 'Each booking enriches the platform, not you. Rising per-segment fees & IATA overhead eat your margin on tickets.',
  },
  {
    cardTestId: problem.card3,
    iconTestId: problem.card3Icon,
    graphicTestId: problem.card3Graphic,
    textBlockTestId: problem.card3TextBlock,
    headingTestId: problem.card3Heading,
    accentBarTestId: problem.card3AccentBar,
    bodyTestId: problem.card3Body,
    iconSrc: '/icons/icon-problem-card-3.svg',
    heading: 'GDS - airline disputes become your crisis',
    body: 'Policy disputes and NDC content blackouts turn into your crisis. Your bookings disappear when others fight.',
  },
];

export const MOBILE_CARDS: MobileCardConfig[] = [
  {
    cardTestId: problem.mobile.card1,
    iconTestId: problem.mobile.card1Icon,
    graphicTestId: problem.mobile.card1Graphic,
    headingTestId: problem.mobile.card1Heading,
    bodyTestId: problem.mobile.card1Body,
    iconSrc: '/icons/icon-problem-card-1.svg',
    heading: 'Agents juggle multiple travel platforms just to quote one fare.',
    body: 'Your team wastes hours toggling between Sabre, Amadeus and Travelport, losing deals while competitors quote instantly.',
  },
  {
    cardTestId: problem.mobile.card2,
    iconTestId: problem.mobile.card2Icon,
    graphicTestId: problem.mobile.card2Graphic,
    headingTestId: problem.mobile.card2Heading,
    bodyTestId: problem.mobile.card2Body,
    iconSrc: '/icons/icon-problem-card-2.svg',
    heading: "Agencies pay heavily for 3rd party tools they'll never own.",
    body: 'Every booking enriches the platform, not you. Rising per-segment fees and IATA overhead eat your margin on every ticket.',
  },
  {
    cardTestId: problem.mobile.card3,
    iconTestId: problem.mobile.card3Icon,
    graphicTestId: problem.mobile.card3Graphic,
    headingTestId: problem.mobile.card3Heading,
    accentBarTestId: problem.mobile.card3AccentBar,
    bodyTestId: problem.mobile.card3Body,
    iconSrc: '/icons/icon-problem-card-3.svg',
    heading: 'GDS–airline content wars ground your business operations.',
    body: 'Policy disputes and NDC content blackouts turn into your crisis. Your bookings disappear when others fight.',
  },
];

/** Landing page — comparison first section */
const comparison = ids.component.landing.comparisonFirst;

export const COMPARISON_MOTION_STYLE: CSSProperties = DEFAULT_MOTION_STYLE;

export const COMPARISON_TOKENS = {
  shadowTicket: 'var(--shadow-card-elevated)',
  shadowTicketReveal: 'var(--shadow-card-navy)',
} as const;

/**
 * Comparison section typography — Figma 5164:6566 (desktop) / 5164:6609 (mobile).
 * Sizes and fill variables from node cache; do not reuse semantic h2/h4 without px check.
 */
export const COMPARISON_CARD_HEADER_BADGE_DESKTOP_CLASS =
  '[font-family:var(--typography-label-desktop-stamp-font-family)] [font-size:var(--typography-label-desktop-stamp-font-size)] [font-weight:var(--typography-label-desktop-stamp-font-weight)] [line-height:var(--typography-label-desktop-stamp-line-height)] uppercase';

export const COMPARISON_CARD_HEADER_BADGE_INDUSTRY_CLASS = `${COMPARISON_CARD_HEADER_BADGE_DESKTOP_CLASS} text-[var(--color-text-brand-orange)]`;

export const COMPARISON_CARD_HEADER_BADGE_MAQSOOD_CLASS = `${COMPARISON_CARD_HEADER_BADGE_DESKTOP_CLASS} text-[var(--color-text-success)]`;

export const COMPARISON_CARD_HEADER_BADGE_MOBILE_CLASS =
  '[font-family:var(--typography-label-mobile-stamp-font-family)] [font-size:var(--typography-label-mobile-stamp-font-size)] [font-weight:var(--typography-label-mobile-stamp-font-weight)] [line-height:var(--typography-label-mobile-stamp-line-height)] uppercase';

export const COMPARISON_CARD_HEADER_TITLE_DESKTOP_CLASS = 'text-heading-desktop-h2';

export const COMPARISON_CARD_HEADER_TITLE_MOBILE_CLASS = 'text-heading-mobile-h2';

export const COMPARISON_ROW_MICRO_TAG_DESKTOP_CLASS = 'text-label-desktop-micro-tag uppercase';

export const COMPARISON_ROW_MICRO_TAG_MOBILE_CLASS = 'text-label-mobile-micro-tag uppercase';

export const COMPARISON_ROW_TITLE_DESKTOP_CLASS =
  'text-heading-desktop-h4 text-[var(--color-text-primary)]';

export const COMPARISON_ROW_TITLE_MOBILE_CLASS =
  'text-heading-mobile-h4 text-[var(--color-text-primary)]';

export const COMPARISON_ROW_BODY_DESKTOP_CLASS =
  '[font-family:var(--typography-body-desktop-xs-sm-font-family)] [font-size:var(--typography-body-desktop-xs-sm-font-size)] [font-weight:var(--typography-body-desktop-xs-sm-font-weight)] [line-height:var(--typography-body-desktop-xs-sm-line-height)] text-[var(--color-text-secondary)]';

export const COMPARISON_ROW_BODY_MOBILE_CLASS =
  '[font-family:var(--typography-body-mobile-xs-sm-font-family)] [font-size:var(--typography-body-mobile-xs-sm-font-size)] [font-weight:var(--typography-body-mobile-xs-sm-font-weight)] [line-height:var(--typography-body-mobile-xs-sm-line-height)] text-[var(--color-text-secondary)]';

export const COMPARISON_STAMP_DESKTOP_CLASS =
  '[font-family:var(--typography-label-desktop-stamp-font-family)] [font-size:var(--typography-label-desktop-stamp-font-size)] [font-weight:var(--typography-label-desktop-stamp-font-weight)] [line-height:var(--typography-label-desktop-stamp-line-height)] uppercase';

export const COMPARISON_STAMP_MOBILE_CLASS =
  '[font-family:var(--typography-label-mobile-micro-tag-font-family)] [font-size:var(--typography-label-mobile-micro-tag-font-size)] [font-weight:var(--typography-label-mobile-micro-tag-font-weight)] [line-height:var(--typography-label-mobile-micro-tag-line-height)] uppercase';

export const COMPARISON_FOOTNOTE_DESKTOP_CLASS =
  '[font-family:var(--typography-body-desktop-xs-font-family)] [font-size:var(--font-size-14)] [font-weight:var(--font-weight-500)] [line-height:var(--font-lineheight-22)] italic text-[var(--color-text-primary)]';

export const COMPARISON_FOOTNOTE_EMPHASIS_CLASS =
  'font-bold italic text-[var(--color-text-brand-navy)]';

export const COMPARISON_FOOTNOTE_MOBILE_CLASS =
  '[font-family:var(--typography-body-mobile-xs-font-family)] [font-size:var(--typography-body-mobile-xs-font-size)] [font-weight:var(--font-weight-500)] [line-height:var(--typography-body-mobile-xs-line-height)] italic text-[var(--color-text-primary)]';

export const COMPARISON_SECTION_SUBTITLE_MOBILE_CLASS =
  'text-body-desktop-xs text-[var(--color-text-secondary)]';

export const INDUSTRY_DESKTOP_ROWS: ComparisonRowConfig[] = [
  {
    rowTestId: comparison.industryRow1,
    microTagTestId: comparison.industryRow1MicroTag,
    tagLabelTestId: comparison.industryRow1TagLabel,
    titleTestId: comparison.industryRow1Title,
    bodyTestId: comparison.industryRow1Body,
    stampTestId: comparison.industryRow1Stamp,
    stampLabelTestId: comparison.industryRow1StampLabel,
    tagLabel: '$$$ PER TICKET',
    title: 'Others charge for every small piece.',
    body: 'Per-transaction fees, monthly subscriptions, support costs and hidden charges that never stop adding up. You bleed margins on every booking.',
    stampLabel: 'DRAINING YOUR MARGINS',
    accent: 'danger',
  },
  {
    rowTestId: comparison.industryRow2,
    microTagTestId: comparison.industryRow2MicroTag,
    tagLabelTestId: comparison.industryRow2TagLabel,
    titleTestId: comparison.industryRow2Title,
    bodyTestId: comparison.industryRow2Body,
    stampTestId: comparison.industryRow2Stamp,
    stampLabelTestId: comparison.industryRow2StampLabel,
    tagLabel: 'CONTROL',
    title: 'You live under their roof.',
    body: 'Your business depends on their infrastructure, their terms, their timeline. No control over your roadmap, your features or your future.',
    stampLabel: 'ZERO OWNERSHIP',
    accent: 'danger',
  },
  {
    rowTestId: comparison.industryRow3,
    microTagTestId: comparison.industryRow3MicroTag,
    tagLabelTestId: comparison.industryRow3TagLabel,
    titleTestId: comparison.industryRow3Title,
    bodyTestId: comparison.industryRow3Body,
    stampTestId: comparison.industryRow3Stamp,
    stampLabelTestId: comparison.industryRow3StampLabel,
    tagLabel: 'RISK',
    title: 'Their conflicts become your losses.',
    body: 'GDS vs airline disputes, content negotiations and platform politics shut you down — even when you did nothing wrong.',
    stampLabel: 'BUSINESS AT RISK',
    accent: 'danger',
  },
];

export const MAQSOOD_DESKTOP_ROWS: ComparisonRowConfig[] = [
  {
    rowTestId: comparison.maqsoodRow1,
    microTagTestId: comparison.maqsoodRow1MicroTag,
    tagLabelTestId: comparison.maqsoodRow1TagLabel,
    titleTestId: comparison.maqsoodRow1Title,
    bodyTestId: comparison.maqsoodRow1Body,
    stampTestId: comparison.maqsoodRow1Stamp,
    stampLabelTestId: comparison.maqsoodRow1StampLabel,
    tagLabel: 'PRICING',
    title: 'Straight price. Nothing hidden.',
    body: 'One transparent platform fee. No per-transaction costs, no surprise charges. Every margin you earn is yours to keep — always.',
    stampLabel: 'ZERO EXTRA FEES',
    accent: 'success',
  },
  {
    rowTestId: comparison.maqsoodRow2,
    microTagTestId: comparison.maqsoodRow2MicroTag,
    tagLabelTestId: comparison.maqsoodRow2TagLabel,
    titleTestId: comparison.maqsoodRow2Title,
    bodyTestId: comparison.maqsoodRow2Body,
    stampTestId: comparison.maqsoodRow2Stamp,
    stampLabelTestId: comparison.maqsoodRow2StampLabel,
    tagLabel: 'OWNERSHIP',
    title: 'Your platform. Your code. Your call.',
    body: 'Complete platform ownership. Your brand, your servers, your customers. Build on your roadmap, your timeline, your terms.',
    stampLabel: '100% YOURS',
    accent: 'navy',
  },
  {
    rowTestId: comparison.maqsoodRow3,
    microTagTestId: comparison.maqsoodRow3MicroTag,
    tagLabelTestId: comparison.maqsoodRow3TagLabel,
    titleTestId: comparison.maqsoodRow3Title,
    bodyTestId: comparison.maqsoodRow3Body,
    stampTestId: comparison.maqsoodRow3Stamp,
    stampLabelTestId: comparison.maqsoodRow3StampLabel,
    tagLabel: 'CONNECTIONS',
    title: 'Direct to every fare source.',
    body: 'GDS and NDC run in parallel — simultaneously. No aggregators, no markups, no blackouts. Best fare wins every time. ~23% avg savings.',
    stampLabel: 'EVERY FARE, ALWAYS',
    accent: 'orange',
  },
];

export const INDUSTRY_MOBILE_ROWS: ComparisonMobileRowConfig[] = [
  {
    rowTestId: comparison.mobile.industryRow1,
    tagTestId: comparison.mobile.industryRow1Tag,
    titleTestId: comparison.mobile.industryRow1Title,
    bodyTestId: comparison.mobile.industryRow1Body,
    stampTestId: comparison.mobile.industryRow1Stamp,
    tagLabel: '$$$ PER TICKET',
    title: 'Others charge for every small piece.',
    body: 'Per-transaction fees, subscriptions, support costs and hidden charges. You bleed margins on every booking.',
    stampLabel: 'DRAINING YOUR MARGINS',
    accent: 'danger',
  },
  {
    rowTestId: comparison.mobile.industryRow2,
    tagTestId: comparison.mobile.industryRow2Tag,
    titleTestId: comparison.mobile.industryRow2Title,
    bodyTestId: comparison.mobile.industryRow2Body,
    stampTestId: comparison.mobile.industryRow2Stamp,
    tagLabel: 'CONTROL',
    title: 'You live under their roof.',
    body: 'Your business depends on their infrastructure, their terms, their timeline. No control over your roadmap or future.',
    stampLabel: 'ZERO OWNERSHIP',
    accent: 'danger',
  },
  {
    rowTestId: comparison.mobile.industryRow3,
    tagTestId: comparison.mobile.industryRow3Tag,
    titleTestId: comparison.mobile.industryRow3Title,
    bodyTestId: comparison.mobile.industryRow3Body,
    stampTestId: comparison.mobile.industryRow3Stamp,
    tagLabel: 'RISK',
    title: 'Their conflicts become your losses.',
    body: 'GDS vs airline disputes and platform politics shut you down — even when you did nothing wrong.',
    stampLabel: 'BUSINESS AT RISK',
    accent: 'danger',
  },
];

export const MAQSOOD_MOBILE_ROWS: ComparisonMobileRowConfig[] = [
  {
    rowTestId: comparison.mobile.maqsoodRow1,
    tagTestId: comparison.mobile.maqsoodRow1Tag,
    titleTestId: comparison.mobile.maqsoodRow1Title,
    bodyTestId: comparison.mobile.maqsoodRow1Body,
    stampTestId: comparison.mobile.maqsoodRow1Stamp,
    tagLabel: 'PRICING',
    title: 'Straight price. Nothing hidden.',
    body: 'One transparent platform fee. No per-transaction costs, no surprise charges. Every margin you earn is yours to keep — always.',
    stampLabel: 'ZERO EXTRA FEES',
    accent: 'success',
  },
  {
    rowTestId: comparison.mobile.maqsoodRow2,
    tagTestId: comparison.mobile.maqsoodRow2Tag,
    titleTestId: comparison.mobile.maqsoodRow2Title,
    bodyTestId: comparison.mobile.maqsoodRow2Body,
    stampTestId: comparison.mobile.maqsoodRow2Stamp,
    tagLabel: 'OWNERSHIP',
    title: 'Your platform. Your code. Your call.',
    body: 'Complete platform ownership. Your brand, your servers, your customers. Build on your roadmap, your timeline, your terms.',
    stampLabel: '100% YOURS',
    accent: 'navy',
  },
  {
    rowTestId: comparison.mobile.maqsoodRow3,
    tagTestId: comparison.mobile.maqsoodRow3Tag,
    titleTestId: comparison.mobile.maqsoodRow3Title,
    bodyTestId: comparison.mobile.maqsoodRow3Body,
    stampTestId: comparison.mobile.maqsoodRow3Stamp,
    tagLabel: 'CONNECTIONS',
    title: 'Direct to every fare source.',
    body: 'GDS and NDC run in parallel — simultaneously. No aggregators, no markups, no blackouts. Best fare wins every time. ~23% avg savings.',
    stampLabel: 'EVERY FARE, ALWAYS',
    accent: 'orange',
  },
];

export const COMPARISON_FOOTNOTE_DESKTOP =
  'Agencies on 3rd-party GDS portals typically spend $1,200–$2,000/month in combined platform and per-booking fees. MaqqsedTravel starts at $250/month.';

export const COMPARISON_FOOTNOTE_MOBILE =
  'Agencies on 3rd-party GDS portals typically spend $1,200–$2,000/month in combined platform and per-booking fees. MaqsoodTravel starts at $250/month.';

/**
 * Landing page — shared section header typography (Figma-verified).
 * Nodes 5164:6567 (HIW), 5164:6562 (Feature grid): pill 14px/600 + brand-navy fill;
 * section heading 40px/700 desktop, 32px/700 mobile; subtitle 16px/400 secondary.
 * Map fontSize from cache → utility — do not use semantic h2/h4 names without checking px.
 */
export const LANDING_SECTION_PILL_LABEL_DESKTOP_CLASS =
  'text-label-desktop-md-tag text-[var(--color-text-brand-navy)]';

export const LANDING_SECTION_PILL_LABEL_MOBILE_CLASS =
  '[font-family:var(--typography-label-mobile-xs-semibold-font-family)] [font-size:var(--typography-label-mobile-xs-semibold-font-size)] [font-weight:var(--typography-label-mobile-xs-semibold-font-weight)] [line-height:var(--typography-label-mobile-xs-semibold-line-height)] text-[var(--color-text-brand-navy)]';

export const LANDING_SECTION_HEADING_DESKTOP_CLASS =
  'text-heading-desktop-h1 text-[var(--color-text-primary)]';

export const LANDING_SECTION_HEADING_MOBILE_CLASS =
  '[font-family:var(--typography-heading-mobile-h1-font-family)] [font-size:var(--typography-heading-mobile-h1-font-size)] [font-weight:var(--typography-heading-mobile-h1-font-weight)] [line-height:var(--typography-heading-mobile-h1-line-height)] text-[var(--color-text-primary)]';

export const LANDING_SECTION_HEADING_ACCENT_CLASS = 'text-[var(--color-text-brand-navy)]';

export const LANDING_SECTION_SUBTITLE_CLASS =
  'text-body-desktop-md text-[var(--color-text-secondary)]';

/**
 * Problem section typography — Figma 5164:6561 / 5164:6571.
 * Pill label uses danger fill (3003:28), not generic pill semantic token name alone.
 */
export const PROBLEM_SECTION_PILL_LABEL_DESKTOP_CLASS =
  'text-label-desktop-md-tag text-[var(--color-text-danger)]';

export const PROBLEM_SECTION_PILL_LABEL_MOBILE_CLASS =
  '[font-family:var(--typography-label-mobile-xs-semibold-font-family)] [font-size:var(--typography-label-mobile-xs-semibold-font-size)] [font-weight:var(--typography-label-mobile-xs-semibold-font-weight)] [line-height:var(--typography-label-mobile-xs-semibold-line-height)] text-[var(--color-text-danger)]';

export const PROBLEM_CARD_TITLE_DESKTOP_CLASS =
  'text-heading-desktop-h3-sm text-[var(--color-text-primary)]';

export const PROBLEM_CARD_TITLE_MOBILE_CLASS =
  'text-heading-mobile-h3-sm text-[var(--color-text-primary)]';

export const PROBLEM_CARD_BODY_CLASS =
  '[font-family:var(--typography-body-desktop-xs-sm-font-family)] [font-size:var(--typography-body-desktop-xs-sm-font-size)] [font-weight:var(--typography-body-desktop-xs-sm-font-weight)] [line-height:var(--typography-body-desktop-xs-sm-line-height)] text-[var(--color-text-secondary)]';

export const PROBLEM_CARD_BODY_MOBILE_CLASS =
  '[font-family:var(--typography-body-mobile-xs-sm-font-family)] [font-size:var(--typography-body-mobile-xs-sm-font-size)] [font-weight:var(--typography-body-mobile-xs-sm-font-weight)] [line-height:var(--typography-body-mobile-xs-sm-line-height)] text-[var(--color-text-secondary)]';

/** How-it-works card body — Figma 14px/400 secondary */
export const HIW_CARD_BODY_CLASS =
  'text-body-desktop-xs text-[var(--color-text-secondary)]';

/** Landing page — how-it-works teaser section */
const hiw = ids.component.landing.howItWorksTeaser;

export const HIW_FOOTER_LINK_TEXT =
  'How does the technical setup work? Read the full breakdown →';

export const HIW_SECTION_HEADING = 'From contract to booking in three steps.';

export const HIW_SECTION_SUBTITLE =
  'We handle the technical complexity. Your agents just search and book.';

export const HIW_CARD_VISUAL_IMAGES = {
  step1: '/images/hiw-card-visual-1.png',
  step2: '/images/hiw-card-visual-2.png',
  step3: '/images/hiw-card-visual-3.png',
} as const;

export const HIW_DESKTOP_CARDS = [
  {
    cardTestId: hiw.hiwCard,
    stackTestId: hiw.mobile.hiwStack,
    cardVisualTestId: hiw.cardVisual,
    cardContentTestId: hiw.cardContent,
    stepBadgeTestId: hiw.stepBadge,
    stepLabelTestId: hiw.step01,
    stepLabel: 'STEP 01',
    mainBlockTestId: hiw.mainBlock,
    headingTestId: hiw.textBlock4,
    heading: 'We plug into your GDS & NDC contracts.',
    accentBarTestId: hiw.accentBar,
    bodyTestId: hiw.textBlock5,
    body: 'You keep your Sabre, Amadeus or Travelport agreements & we configure the platform in week one. No new contracts. No renegotiation. NDC connections added automatically.',
    taglineTestId: hiw.textBlock6,
    tagline: 'Your contracts. Our infrastructure.',
    accent: 'navy',
    visualImageSrc: HIW_CARD_VISUAL_IMAGES.step1,
  },
  {
    cardTestId: hiw.hiwCard2,
    stackTestId: hiw.mobile.hiwStack2,
    cardVisualTestId: hiw.cardVisual2,
    cardContentTestId: hiw.cardContent2,
    stepBadgeTestId: hiw.stepBadge2,
    stepLabelTestId: hiw.step02,
    stepLabel: 'STEP 02',
    mainBlockTestId: hiw.mainBlock2,
    headingTestId: hiw.textBlock8,
    heading: 'One query. Every source. Simultaneously.',
    accentBarTestId: hiw.accentBar2,
    bodyTestId: hiw.textBlock9,
    body: 'Your agents type the route once. The platform fires parallel queries to all connected GDS and NDC sources at the same millisecond. Average fare saving vs single-GDS: ~23%.',
    taglineTestId: hiw.textBlock10,
    tagline: 'All sources. One result list.',
    accent: 'orange',
    visualImageSrc: HIW_CARD_VISUAL_IMAGES.step2,
  },
  {
    cardTestId: hiw.hiwCard3,
    stackTestId: hiw.mobile.hiwStack3,
    cardVisualTestId: hiw.cardVisual3,
    cardContentTestId: hiw.cardContent3,
    stepBadgeTestId: hiw.stepBadge3,
    stepLabelTestId: hiw.step03,
    stepLabel: 'STEP 03',
    mainBlockTestId: hiw.mainBlock3,
    headingTestId: hiw.textBlock18,
    heading: 'Book, and analyse: one branded portal.',
    accentBarTestId: hiw.accentBar3,
    bodyTestId: hiw.textBlock19,
    body: 'Everything inside your white-label platform. Book fares, issue tickets, set price alerts, pull reports under your own brand. Your data in your database. No shared logins. Full ownership.',
    taglineTestId: hiw.textBlock20,
    tagline: 'Your brand. Your data. Your platform.',
    accent: 'teal',
    visualImageSrc: HIW_CARD_VISUAL_IMAGES.step3,
  },
] as const satisfies HiwCardConfig[];

export const HIW_MOBILE_CARDS = [
  {
    ...HIW_DESKTOP_CARDS[0],
    stepLabelTestId: hiw.mobile.step01,
    headingTestId: hiw.mobile.textBlock4,
    accentBarTestId: hiw.mobile.accentBar,
    bodyTestId: hiw.mobile.textBlock5,
    taglineTestId: hiw.mobile.textBlock6,
  },
  {
    ...HIW_DESKTOP_CARDS[1],
    stepLabelTestId: hiw.mobile.step0w,
    headingTestId: hiw.mobile.textBlock8,
    accentBarTestId: hiw.mobile.accentBar2,
    bodyTestId: hiw.mobile.textBlock9,
    taglineTestId: hiw.mobile.textBlock10,
  },
  {
    ...HIW_DESKTOP_CARDS[2],
    stepLabelTestId: hiw.mobile.step03,
    headingTestId: hiw.mobile.textBlock18,
    accentBarTestId: hiw.mobile.accentBar3,
    bodyTestId: hiw.mobile.textBlock19,
    taglineTestId: hiw.mobile.textBlock20,
  },
] as const satisfies HiwCardConfig[];

/** Landing page — feature grid section */
const fg = ids.component.landing.featureGrid;
const fgMobile = fg.mobile;

export const FEATURE_GRID_TOKENS = {
  motionStepDelayVar: MOTION_TOKEN_REFS.autoAdvanceVar,
} as const;

/** Figma 5164:6562 frame — decorative planes positioned on the 1440×734 artboard */
export const FEATURE_GRID_DESKTOP_FRAME_CLASS = 'relative mx-auto w-full max-w-[1440px]';

export const FEATURE_GRID_PLANE_TOP_CLASS =
  'pointer-events-none absolute left-[78.56%] top-[13.31%] z-0 h-auto w-[11.82%]';

export const FEATURE_GRID_PLANE_BOTTOM_CLASS =
  'pointer-events-none absolute left-[17.85%] top-[0.41%] z-0 h-auto w-[21.18%]';

export const FEATURE_GRID_BADGE_LABEL_CLASS =
  'uppercase text-[var(--color-text-brand-navy)] [font-family:var(--typography-label-desktop-xs-semibold-font-family)] [font-size:var(--typography-label-desktop-xs-semibold-font-size)] [font-weight:var(--typography-label-desktop-xs-semibold-font-weight)] [line-height:var(--typography-label-desktop-xs-semibold-line-height)]';

export const FEATURE_GRID_MOBILE_BODY_CLASS =
  '[font-family:var(--typography-body-mobile-xs-font-family)] [font-size:var(--typography-body-mobile-xs-font-size)] [font-weight:var(--typography-body-mobile-xs-font-weight)] [line-height:var(--typography-body-mobile-xs-line-height)] text-[var(--color-text-secondary)]';

export const FEATURE_GRID_HEADING_LINE1 = 'Built for Speed, Precision,';
export const FEATURE_GRID_HEADING_LINE2 = 'and Total Control';
export const FEATURE_GRID_SUBTITLE =
  'Every feature engineered by aviation industry veterans who understand what you actually need.';
export const FEATURE_GRID_TAGLINE = 'Aviation-grade infrastructure, ready in weeks, not years.';
export const FEATURE_GRID_CTA_LABEL = 'Start Building Now';

export const FEATURE_GRID_ACCENT_BAR_CLASS: Record<FeatureGridCardAccent, string> = {
  navy: 'bg-[linear-gradient(to_right,var(--color-text-brand-navy),color-mix(in_srgb,var(--color-text-brand-navy)_55%,var(--color-navy-500)))]',
  teal: 'bg-[linear-gradient(to_right,var(--color-text-brand-teal),color-mix(in_srgb,var(--color-text-brand-teal)_55%,var(--color-teal-500)))]',
  orange:
    'bg-[linear-gradient(to_right,var(--color-text-brand-orange),color-mix(in_srgb,var(--color-text-brand-orange)_55%,var(--color-orange-500)))]',
  red: 'bg-[linear-gradient(to_right,var(--color-text-danger),color-mix(in_srgb,var(--color-text-danger)_55%,var(--color-orange-500)))]',
};

export const FEATURE_GRID_DESKTOP_CARDS = [
  {
    cardTestId: fg.featureCard,
    textBlockTestId: fg.textblock,
    titleRowTestId: fg.titlerow,
    titleTestId: fg.title,
    badgeTestId: fg.badge,
    badgeLabelTestId: fg.badgelabel,
    badgeLabel: '<100ms',
    accentBarTestId: fg.accentBar,
    bodyTestId: fg.body,
    heading: 'Multi-Source Content',
    body: 'Pull live inventory from GDS and NDC simultaneously. One search surfaces every available fare — no source left behind.',
    accent: 'navy',
    size: 'wide',
  },
  {
    cardTestId: fg.featureCard2,
    textBlockTestId: fg.textblock2,
    titleRowTestId: fg.titlerow2,
    titleTestId: fg.title2,
    badgeTestId: fg.badge2,
    badgeLabelTestId: fg.badgelabel2,
    badgeLabel: '100% Yours',
    accentBarTestId: fg.accentBar2,
    bodyTestId: fg.body2,
    heading: 'Parallel Search',
    body: 'Fire searches across all connected airlines at once. Sub-second results, zero tab-switching.',
    accent: 'teal',
    size: 'wide',
  },
  {
    cardTestId: fg.featureCard3,
    textBlockTestId: fg.textblock3,
    titleTestId: fg.title3,
    accentBarTestId: fg.accentBar3,
    bodyTestId: fg.body3,
    heading: 'End-to-End Ticketing',
    body: 'Search, book, hold, void, reissue — every ticketing action in one seamless workflow.',
    accent: 'orange',
    size: 'narrow',
  },
  {
    cardTestId: fg.featureCard4,
    textBlockTestId: fg.textblock4,
    titleTestId: fg.title4,
    accentBarTestId: fg.accentBar4,
    bodyTestId: fg.body4,
    heading: 'Canned Itineraries',
    body: 'Save frequent route segments for instant repeat searches. Built for corporate travel desks.',
    accent: 'navy',
    size: 'narrow',
  },
  {
    cardTestId: fg.featureCard5,
    textBlockTestId: fg.textblock5,
    titleTestId: fg.title5,
    accentBarTestId: fg.accentBar5,
    bodyTestId: fg.body5,
    heading: 'ADM Alert Engine',
    body: 'Auto-detect duplicate PNRs and policy violations before they trigger costly ADM penalties.',
    accent: 'red',
    size: 'narrow',
  },
  {
    cardTestId: fg.featureCard6,
    textBlockTestId: fg.textblock6,
    titleTestId: fg.title6,
    accentBarTestId: fg.accentBar6,
    bodyTestId: fg.body6,
    heading: 'Agency Operations',
    body: 'Role-based access for agents and admins. Manage your team without IT dependency.',
    accent: 'teal',
    size: 'narrow',
  },
] as const satisfies FeatureGridCardConfig[];

export const FEATURE_GRID_MOBILE_CARDS = [
  {
    cardTestId: fgMobile.featureCard,
    textBlockTestId: fgMobile.textBlock2,
    titleRowTestId: fgMobile.titlerow,
    titleTestId: fgMobile.multisourceContent,
    badgeTestId: fgMobile.frame,
    badgeLabelTestId: fgMobile.n100Yours,
    badgeLabel: '100% Yours',
    accentBarTestId: fgMobile.frame2,
    bodyTestId: fgMobile.textBlock2,
    heading: 'Multi-Source Content',
    body: 'Pull live inventory from GDS and NDC simultaneously. One search surfaces every available fare — no source left behind.',
    accent: 'navy',
    size: 'wide',
  },
  {
    cardTestId: fgMobile.featureCard2,
    textBlockTestId: fgMobile.textBlock3,
    titleRowTestId: fgMobile.titlerow2,
    titleTestId: fgMobile.parallelSearch,
    badgeTestId: fgMobile.frame3,
    badgeLabelTestId: fgMobile.n100ms,
    badgeLabel: '<100ms',
    accentBarTestId: fgMobile.frame4,
    bodyTestId: fgMobile.textBlock3,
    heading: 'Parallel Search',
    body: 'Fire searches across all connected airlines at once. Sub-second results, zero tab-switching.',
    accent: 'teal',
    size: 'wide',
  },
  {
    cardTestId: fgMobile.featureCard3,
    textBlockTestId: fgMobile.textBlock4,
    titleRowTestId: fgMobile.titlerow3,
    titleTestId: fgMobile.endtoendTicketing,
    accentBarTestId: fgMobile.accentBar,
    bodyTestId: fgMobile.textBlock4,
    heading: 'End-to-End Ticketing',
    body: 'Search, book, hold, void, reissue — every ticketing action in one seamless workflow.',
    accent: 'orange',
    size: 'narrow',
  },
  {
    cardTestId: fgMobile.featureCard4,
    textBlockTestId: fgMobile.textBlock5,
    titleRowTestId: fgMobile.titlerow4,
    titleTestId: fgMobile.cannedItineraries,
    accentBarTestId: fgMobile.frame5,
    bodyTestId: fgMobile.textBlock5,
    heading: 'Canned Itineraries',
    body: 'Save frequent route segments for instant repeat searches. Built for corporate travel desks.',
    accent: 'navy',
    size: 'narrow',
  },
  {
    cardTestId: fgMobile.featureCard5,
    textBlockTestId: fgMobile.textBlock6,
    titleRowTestId: fgMobile.titlerow5,
    titleTestId: fgMobile.churningValidation,
    accentBarTestId: fgMobile.frame6,
    bodyTestId: fgMobile.textBlock6,
    heading: 'Churning Validation',
    body: 'Auto-detect duplicate PNRs and policy violations before they trigger costly ADM penalties.',
    accent: 'red',
    size: 'narrow',
  },
  {
    cardTestId: fgMobile.featureCard6,
    textBlockTestId: fgMobile.textBlock7,
    titleRowTestId: fgMobile.titlerow6,
    titleTestId: fgMobile.agencyOperations,
    accentBarTestId: fgMobile.frame7,
    bodyTestId: fgMobile.textBlock7,
    heading: 'Agency Operations',
    body: 'Role-based access for agents and admins. Manage your team without IT dependency.',
    accent: 'teal',
    size: 'narrow',
  },
] as const satisfies FeatureGridCardConfig[];

/** Landing page — social proof section (GH#9) */
const sp = ids.component.landing.socialProof;
const spMobile = sp.mobile;

export const SOCIAL_PROOF_TOKENS = {
  motionDurationDefault: MOTION_TOKEN_REFS.durationDefault,
  motionEasingDefault: MOTION_TOKEN_REFS.easingDefault,
} as const;

export const SOCIAL_PROOF_MOTION_STYLE: CSSProperties = DEFAULT_MOTION_STYLE;

export const SOCIAL_PROOF_DESKTOP_FRAME_CLASS = 'relative mx-auto w-full max-w-[1440px]';

export const SOCIAL_PROOF_PLANE_CLASS =
  'pointer-events-none absolute right-[12%] top-[38%] z-0 h-auto w-[6.4%]';

export const SOCIAL_PROOF_SECTION_PILL_DESKTOP_CLASS =
  'inline-flex items-center justify-center gap-[var(--spacing-8)] rounded-[var(--radius-pill)] border border-[var(--color-border-brand-orange)] bg-[color-mix(in_srgb,var(--color-feedback-warning-background)_10%,transparent)] px-[var(--spacing-16)] py-[var(--spacing-8)]';

export const SOCIAL_PROOF_SECTION_PILL_MOBILE_CLASS =
  'inline-flex items-center justify-center gap-[var(--spacing-6)] rounded-[var(--radius-pill)] border border-[var(--color-border-brand-orange)] bg-[color-mix(in_srgb,var(--color-feedback-warning-background)_10%,transparent)] px-[var(--spacing-12)] py-[var(--spacing-8)]';

export const SOCIAL_PROOF_PILL_LABEL_DESKTOP_CLASS =
  'text-label-desktop-md-tag text-[var(--color-text-brand-orange)]';

export const SOCIAL_PROOF_PILL_LABEL_MOBILE_CLASS =
  '[font-family:var(--typography-label-mobile-xs-semibold-font-family)] [font-size:var(--typography-label-mobile-xs-semibold-font-size)] [font-weight:var(--typography-label-mobile-xs-semibold-font-weight)] [line-height:var(--typography-label-mobile-xs-semibold-line-height)] text-[var(--color-text-brand-orange)]';

export const SOCIAL_PROOF_QUOTE_DESKTOP_CLASS =
  'text-body-desktop-testimonial text-[var(--color-text-primary)]';

export const SOCIAL_PROOF_QUOTE_MOBILE_CLASS =
  'text-body-mobile-testimonial text-[var(--color-text-primary)]';

export const SOCIAL_PROOF_AUTHOR_NAME_CLASS = 'text-label-desktop-lg text-[var(--color-text-primary)]';

export const SOCIAL_PROOF_AUTHOR_ROLE_CLASS =
  'text-label-desktop-md-stat text-[var(--color-text-secondary)]';

export const SOCIAL_PROOF_AUTHOR_COMPANY_CLASS =
  'text-label-desktop-xs-semibold text-[var(--color-text-brand-orange)]';

export const SOCIAL_PROOF_INTEGRATIONS_TAGLINE_CLASS =
  'text-label-desktop-md-stat font-semibold text-[var(--color-text-muted)]';

export const SOCIAL_PROOF_HEADING_LINE1 = 'Built for Founders,';
export const SOCIAL_PROOF_HEADING_LINE2 = 'Proven in Production';
export const SOCIAL_PROOF_SECTION_SUBTITLE =
  'Travel companies worldwide trust MaqsoodTravel to power their booking platforms.';
export const SOCIAL_PROOF_INTEGRATIONS_TAGLINE =
  'Travel agencies worldwide trust MaqsoodTravel to power their booking platforms.';
export const SOCIAL_PROOF_PILL_LABEL = 'Trusted by Leaders';

/** Desktop carousel step — TestimonialBlock width (868) + row gap (spacing.120). */
export const SOCIAL_PROOF_DESKTOP_SLIDE_STEP_PX = 868 + 120;

export const SOCIAL_PROOF_SLIDE_COUNT = 3;

export const SOCIAL_PROOF_SLIDE_FILL_PERCENT = ['36.3%', '66.7%', '100%'] as const;

export const SOCIAL_PROOF_CAROUSEL_TRANSITION_STYLE: CSSProperties = {
  transitionDuration: SOCIAL_PROOF_CAROUSEL_SLIDE_DURATION,
  transitionTimingFunction: SOCIAL_PROOF_TOKENS.motionEasingDefault,
  transitionProperty: 'transform',
};

export const SOCIAL_PROOF_DESKTOP_TESTIMONIALS: SocialProofTestimonialConfig[] = [
  {
    blockTestId: sp.testimonialBlock,
    logoCardTestId: sp.testimonialLogoCard,
    logoSlotTestId: sp.logoSlot,
    companyLogoTestId: sp.companyLogo,
    quoteTestId: sp.quote,
    authorTestId: sp.testimonialAuthor,
    avatarTestId: sp.avatarInitials,
    initialsTestId: sp.lI,
    nameTestId: sp.moazamArshad,
    roleTestId: sp.founderCeo,
    companyTestId: sp.ukbasedIataTravelAgency,
    logoSrc: '/images/social-proof-testimonial-logo-a.png',
    quote:
      '“We were paying for three separate tools that barely talked to each other. MaqqsedTravel replaced all of them. Our agents now search every GDS from one screen, under our own brand. We were live in under 6 weeks.”',
    initials: 'MA',
    name: 'Moazam Arshad',
    role: 'Founder & CEO',
    company: 'UK-based IATA travel agency',
  },
  {
    blockTestId: sp.testimonialBlock2,
    logoCardTestId: sp.testimonialLogoCard2,
    logoSlotTestId: sp.logoSlot2,
    companyLogoTestId: sp.companyLogo2,
    quoteTestId: sp.textBlock3,
    authorTestId: sp.testimonialAuthor2,
    avatarTestId: sp.avatarInitials2,
    initialsTestId: sp.lI2,
    nameTestId: sp.moazamArshad2,
    roleTestId: sp.founderCeo2,
    companyTestId: sp.ukbasedIataTravelAgency2,
    logoSrc: '/images/social-proof-testimonial-logo-b.png',
    quote:
      '"Switching off Amadeus felt risky. MaqqsedTravel had us connected to Sabre, NDC and Travelport in week one. We kept our existing contracts — nothing changed for our clients."',
    initials: 'LB',
    name: 'Lance Bohling',
    role: 'Founder & CEO',
    company: 'UK-based IATA travel agency',
  },
];

export const SOCIAL_PROOF_MOBILE_TESTIMONIALS: SocialProofTestimonialConfig[] = [
  {
    blockTestId: spMobile.frame2095585138,
    logoCardTestId: spMobile.logo,
    logoSlotTestId: spMobile.image27,
    companyLogoTestId: spMobile.image27,
    quoteTestId: spMobile.quote,
    authorTestId: spMobile.container2,
    avatarTestId: spMobile.container4,
    initialsTestId: spMobile.mA,
    nameTestId: spMobile.moazamArshad,
    roleTestId: spMobile.founderCeo,
    companyTestId: spMobile.ukbasedIataTravelAgency,
    logoSrc: '/images/social-proof-testimonial-logo-a.png',
    quote:
      '“We were paying for three separate tools that barely talked to each other. MaqqsedTravel replaced all of them. Our agents now search every GDS from one screen, under our own brand. We were live in under 6 weeks.”',
    initials: 'MA',
    name: 'Moazam Arshad',
    role: 'Founder & CEO',
    company: 'UK-based IATA travel agency',
  },
  {
    blockTestId: spMobile.frame2095585139,
    logoCardTestId: spMobile.logo2,
    logoSlotTestId: spMobile.logo2,
    companyLogoTestId: spMobile.logo2,
    quoteTestId: spMobile.quote2,
    authorTestId: spMobile.container6,
    avatarTestId: spMobile.container8,
    initialsTestId: spMobile.lB,
    nameTestId: spMobile.lanceBohlingArshad,
    roleTestId: spMobile.founderCeo2,
    companyTestId: spMobile.ukbasedIataTravelAgency2,
    logoSrc: '/images/social-proof-testimonial-logo-b.png',
    quote:
      '“Switching off Amadeus felt risky. MaqqsedTravel had us connected to Sabre, NDC and Travelport in week one. We kept our existing contracts — nothing changed for our clients."',
    initials: 'LB',
    name: 'Lance Bohling',
    role: 'Founder & CEO',
    company: 'UK-based IATA travel agency',
  },
];

export const SOCIAL_PROOF_CLIENT_LOGOS: SocialProofClientLogoConfig[] = [
  { src: '/images/social-proof-client-01.png', testId: sp.image23 },
  { src: '/images/social-proof-client-02.png', testId: sp.image14 },
  { src: '/images/social-proof-client-03.png', testId: sp.image16 },
  { src: '/images/social-proof-client-04.png', testId: sp.image13 },
  { src: '/images/social-proof-client-05.png', testId: sp.image26 },
  { src: '/images/social-proof-client-06.png', testId: sp.image12 },
  { src: '/images/social-proof-client-07.png', testId: sp.image17 },
  { src: '/images/social-proof-client-08.png', testId: sp.image19 },
  { src: '/images/social-proof-client-09.png', testId: sp.image18 },
  { src: '/images/social-proof-client-10.png', testId: sp.image25 },
  { src: '/images/social-proof-client-11.png', testId: sp.image15 },
  { src: '/images/social-proof-client-12.png', testId: sp.image24 },
  { src: '/images/social-proof-client-13.png', testId: sp.image22 },
  { src: '/images/social-proof-client-14.png', testId: spMobile.image24 },
];

/** Landing page — pricing section (GH#11, Figma 5164:6564 / 5164:6915 / 5164:11487) */
const pr = ids.component.landing.pricing;
const prMobile = pr.mobile;

export const PRICING_MOTION_STYLE: CSSProperties = DEFAULT_MOTION_STYLE;

export const PRICING_TOKENS = {
  shadowCardNavy: 'var(--shadow-card-navy)',
  motionDurationDefault: 'var(--motion-duration-default)',
  motionEasingDefault: 'var(--motion-easing-default)',
} as const;

export const PRICING_DESKTOP_FRAME_CLASS = 'relative mx-auto w-full max-w-[1440px]';

export const PRICING_SECTION_BG_DESKTOP_CLASS =
  'bg-[var(--color-background-page)] bg-[image:url(/images/pricing-section-bg-desktop.png)] bg-cover bg-center bg-no-repeat';

export const PRICING_SECTION_BG_MOBILE_CLASS =
  'bg-[var(--color-background-page)] bg-[image:url(/images/pricing-section-bg-mobile.png)] bg-cover bg-center bg-no-repeat';

export const PRICING_MAP_DECORATION_CLASS =
  'pointer-events-none absolute left-[8%] top-[var(--spacing-64)] z-0 h-auto w-[213px] max-w-[15%]';

export const PRICING_SECTION_PILL_DESKTOP_CLASS =
  'inline-flex items-center justify-center gap-[var(--spacing-8)] rounded-[var(--radius-pill)] border border-[var(--color-border-brand-teal)] bg-[color-mix(in_srgb,var(--color-text-brand-teal)_8%,transparent)] px-[var(--spacing-16)] py-[var(--spacing-8)]';

export const PRICING_SECTION_PILL_MOBILE_CLASS =
  'inline-flex items-center justify-center gap-[var(--spacing-6)] rounded-[var(--radius-pill)] border border-[var(--color-border-brand-teal)] bg-[color-mix(in_srgb,var(--color-text-brand-teal)_8%,transparent)] px-[var(--spacing-12)] py-[var(--spacing-8)]';

export const PRICING_PILL_LABEL_DESKTOP_CLASS =
  'text-label-desktop-md-tag text-[var(--color-text-brand-teal)]';

export const PRICING_PILL_LABEL_MOBILE_CLASS =
  '[font-family:var(--typography-label-mobile-xs-semibold-font-family)] [font-size:var(--typography-label-mobile-xs-semibold-font-size)] [font-weight:var(--typography-label-mobile-xs-semibold-font-weight)] [line-height:var(--typography-label-mobile-xs-semibold-line-height)] text-[var(--color-text-brand-teal)]';

export const PRICING_ROUTE_STRIP_CLASS =
  'flex w-full max-w-[868px] items-center justify-between rounded-[var(--radius-pill)] border-[0.3px] border-[var(--color-border-brand-navy)] bg-[color-mix(in_srgb,var(--color-text-brand-navy)_8%,transparent)] px-[var(--spacing-12)] py-[var(--spacing-6)]';

export const PRICING_ROUTE_LABEL_DESKTOP_CLASS =
  'text-label-desktop-sm-semibold text-[var(--color-text-secondary)]';

export const PRICING_ROUTE_LABEL_MOBILE_CLASS =
  '[font-family:var(--typography-label-mobile-xs-medium-font-family)] [font-size:var(--typography-label-mobile-xs-medium-font-size)] [font-weight:var(--typography-label-mobile-xs-medium-font-weight)] [line-height:var(--typography-label-mobile-xs-medium-line-height)] text-[var(--color-text-secondary)]';

export const PRICING_CARD_SHELL_CLASS =
  'flex w-full max-w-[868px] flex-col overflow-hidden rounded-[var(--radius-panel)] border-2 border-[var(--color-border-default)] bg-[var(--color-background-page)] shadow-[var(--shadow-card-navy)]';

export const PRICING_CARD_HEADER_CLASS =
  'flex items-start justify-between bg-[var(--color-background-subtle)] px-[var(--spacing-28)] py-[var(--spacing-20)]';

export const PRICING_BOARDING_LABEL_CLASS =
  'text-label-desktop-xs-medium uppercase tracking-wide text-[var(--color-text-brand-navy)]';

export const PRICING_BOARDING_LABEL_MOBILE_CLASS =
  '[font-family:var(--typography-label-mobile-xs-medium-font-family)] [font-size:var(--typography-label-mobile-xs-medium-font-size)] [font-weight:var(--typography-label-mobile-xs-medium-font-weight)] [line-height:var(--typography-label-mobile-xs-medium-line-height)] uppercase tracking-wide text-[var(--color-text-brand-navy)]';

export const PRICING_CARD_TITLE_DESKTOP_CLASS =
  'text-heading-desktop-h2 text-[var(--color-text-primary)]';

export const PRICING_CARD_TITLE_MOBILE_CLASS =
  'text-heading-mobile-h2 text-[var(--color-text-primary)]';

export const PRICING_CARD_SUBTITLE_DESKTOP_CLASS =
  'text-body-desktop-xs text-[var(--color-text-muted)]';

export const PRICING_CARD_SUBTITLE_MOBILE_CLASS =
  'text-body-mobile-xs text-[var(--color-text-muted)]';

export const PRICING_SEAT_LABEL_CLASS =
  'text-label-desktop-xs-medium uppercase text-[var(--color-text-muted)]';

export const PRICING_SEAT_VALUE_CLASS =
  'text-label-desktop-lg text-[var(--color-text-primary)]';

export const PRICING_TRACKING_LABEL_PLATFORM_CLASS =
  'text-label-desktop-xs-semibold uppercase text-[var(--color-text-brand-orange)]';

export const PRICING_TRACKING_LABEL_ADDON_CLASS =
  'text-label-desktop-xs-semibold uppercase text-[var(--color-text-muted)]';

export const PRICING_TRACKING_LABEL_PLATFORM_MOBILE_CLASS =
  '[font-family:var(--typography-label-mobile-xs-semibold-font-family)] [font-size:var(--typography-label-mobile-xs-semibold-font-size)] [font-weight:var(--typography-label-mobile-xs-semibold-font-weight)] [line-height:var(--typography-label-mobile-xs-semibold-line-height)] uppercase text-[var(--color-text-brand-orange)]';

export const PRICING_TRACKING_LABEL_ADDON_MOBILE_CLASS =
  '[font-family:var(--typography-label-mobile-xs-semibold-font-family)] [font-size:var(--typography-label-mobile-xs-semibold-font-size)] [font-weight:var(--typography-label-mobile-xs-semibold-font-weight)] [line-height:var(--typography-label-mobile-xs-semibold-line-height)] uppercase text-[var(--color-text-muted)]';

export const PRICING_PRICE_PRIMARY_DESKTOP_CLASS =
  'text-display-desktop-pricing-xl text-[var(--color-text-primary)]';

export const PRICING_PRICE_SECONDARY_DESKTOP_CLASS =
  'text-display-desktop-pricing-sm text-[var(--color-text-primary)]';

export const PRICING_PRICE_PRIMARY_MOBILE_CLASS =
  'text-display-mobile-pricing-xl text-[var(--color-text-primary)]';

export const PRICING_PRICE_SECONDARY_MOBILE_CLASS =
  'text-display-mobile-pricing-sm text-[var(--color-text-primary)]';

export const PRICING_PRICE_FOOTNOTE_CLASS =
  'text-body-desktop-xs text-[var(--color-text-muted)]';

export const PRICING_PRICE_FOOTNOTE_MOBILE_CLASS =
  'text-body-mobile-xs text-[var(--color-text-muted)]';

export const PRICING_CHECKLIST_HEADING_CLASS =
  'text-label-desktop-md-stat text-[var(--color-text-primary)]';

export const PRICING_CHECKLIST_HEADING_MOBILE_CLASS =
  'text-label-mobile-md-stat text-[var(--color-text-primary)]';

export const PRICING_CHECKLIST_ITEM_CLASS =
  '[font-family:var(--typography-body-desktop-xs-sm-font-family)] [font-size:var(--typography-body-desktop-xs-sm-font-size)] [font-weight:var(--typography-body-desktop-xs-sm-font-weight)] [line-height:var(--typography-body-desktop-xs-sm-line-height)] text-[var(--color-text-secondary)]';

export const PRICING_CHECKLIST_ITEM_MOBILE_CLASS =
  '[font-family:var(--typography-body-mobile-xs-sm-font-family)] [font-size:var(--typography-body-mobile-xs-sm-font-size)] [font-weight:var(--typography-body-mobile-xs-sm-font-weight)] [line-height:var(--typography-body-mobile-xs-sm-line-height)] text-[var(--color-text-secondary)]';

export const PRICING_TRUST_BAR_CLASS =
  'flex w-full max-w-[868px] items-center justify-between rounded-[var(--radius-surface)] border border-[var(--color-border-default)] bg-[var(--color-background-subtle)] px-[var(--spacing-40)] py-[var(--spacing-10)]';

export const PRICING_TRUST_BAR_MOBILE_CLASS =
  'flex w-full flex-wrap items-center justify-center gap-[var(--spacing-6)] rounded-[var(--radius-surface)] border border-[var(--color-border-default)] bg-[var(--color-background-subtle)] px-[var(--spacing-6)] py-[var(--spacing-8)]';

export const PRICING_TRUST_LABEL_CLASS =
  'text-label-desktop-xs-semibold uppercase text-[var(--color-text-muted)]';

export const PRICING_TRUST_LABEL_MOBILE_CLASS =
  '[font-family:var(--typography-label-mobile-xs-semibold-font-family)] [font-size:var(--typography-label-mobile-xs-semibold-font-size)] [font-weight:var(--typography-label-mobile-xs-semibold-font-weight)] [line-height:var(--typography-label-mobile-xs-semibold-line-height)] uppercase text-[var(--color-text-muted)]';

export const PRICING_TRUST_ITEM_CLASS =
  'text-label-desktop-xs-semibold text-[var(--color-text-secondary)]';

export const PRICING_TRUST_ITEM_MOBILE_CLASS =
  '[font-family:var(--typography-label-mobile-xs-semibold-font-family)] [font-size:var(--typography-label-mobile-xs-semibold-font-size)] [font-weight:var(--typography-label-mobile-xs-semibold-font-weight)] [line-height:var(--typography-label-mobile-xs-semibold-line-height)] text-[var(--color-text-secondary)]';

export const PRICING_TRUST_FOOTNOTE_CLASS =
  '[font-family:var(--typography-body-desktop-xs-sm-font-family)] [font-size:var(--typography-body-desktop-xs-sm-font-size)] [font-weight:var(--typography-body-desktop-xs-sm-font-weight)] [line-height:var(--typography-body-desktop-xs-sm-line-height)] text-center text-[var(--color-text-muted)]';

export const PRICING_TRUST_FOOTNOTE_MOBILE_CLASS =
  '[font-family:var(--typography-body-mobile-xs-sm-font-family)] [font-size:var(--typography-body-mobile-xs-sm-font-size)] [font-weight:var(--typography-body-mobile-xs-sm-font-weight)] [line-height:var(--typography-body-mobile-xs-sm-line-height)] text-center text-[var(--color-text-muted)]';

export const PRICING_PILL_LABEL = 'Simple Pricing';
export const PRICING_HEADING_LINE1 = 'Own it,';
export const PRICING_HEADING_LINE2 = "Don't Rent it";
export const PRICING_SECTION_SUBTITLE =
  'No per-transaction fees. No revenue sharing. Complete ownership.';
export const PRICING_ROUTE_FROM = '🛫  From: Your Current Platform';
export const PRICING_ROUTE_TO_DESKTOP = '🛬  To: Full Platform Ownership';
export const PRICING_ROUTE_TO_MOBILE = '🛬  To: Full Ownership';
export const PRICING_BOARDING_LABEL = 'BOARDING PASS · PLATFORM OWNERSHIP';
export const PRICING_CARD_TITLE = 'Own Your Platform';
export const PRICING_CARD_SUBTITLE_DESKTOP =
  'No per-booking fees. No revenue share. No surprises. Just one platform, fully yours. Priced to fit your agency.';
export const PRICING_CARD_SUBTITLE_MOBILE =
  'Complete source code. Production-ready. Yours forever.';
export const PRICING_PLATFORM_FEE_LABEL = 'ONE-TIME PLATFORM FEE';
export const PRICING_PLATFORM_FEE_AMOUNT = '$3,000';
export const PRICING_PLATFORM_FEE_FOOTNOTE = 'One-time payment · No recurring platform costs';
export const PRICING_ADDON_LABEL = 'OPTIONAL SUPPORT ADD-ON';
export const PRICING_ADDON_AMOUNT = '$250';
export const PRICING_ADDON_PERIOD = '/month';
export const PRICING_ADDON_FOOTNOTE = 'Support & updates · Cancel anytime';
export const PRICING_CHECKLIST_HEADING = 'Everything included:';
export const PRICING_CTA_LABEL = 'Book A Demo';
export const PRICING_TRUST_HEADING = 'PLATFORM INCLUDES:';
export const PRICING_TRUST_FOOTNOTE =
  'No per-transaction fees. No revenue sharing. Complete ownership.';

export const PRICING_CHECKLIST_ITEMS = [
  { label: 'Complete source code', testId: pr.completeSourceCode, itemTestId: pr.checklistItem },
  { label: 'Multi-currency', testId: pr.completeSourceCode2, itemTestId: pr.checklistItem2 },
  { label: 'GDS & NDC ready', testId: pr.completeSourceCode3, itemTestId: pr.checklistItem3 },
  { label: 'API documentation', testId: pr.completeSourceCode4, itemTestId: pr.checklistItem4 },
  { label: 'White-label engine', testId: pr.completeSourceCode5, itemTestId: pr.checklistItem5 },
  { label: 'Admin dashboard', testId: pr.completeSourceCode6, itemTestId: pr.checklistItem6 },
  { label: 'Payment processing', testId: pr.completeSourceCode7, itemTestId: pr.checklistItem7 },
  { label: 'Security certified', testId: pr.completeSourceCode8, itemTestId: pr.checklistItem8 },
] as const;

export const PRICING_CHECKLIST_ITEMS_MOBILE = [
  { label: 'Complete source code', testId: prMobile.completeSourceCode },
  { label: 'GDS & NDC ready', testId: prMobile.gdsNdcReady },
  { label: 'White-label engine', testId: prMobile.whitelabelEngine },
  { label: 'API documentation', testId: prMobile.apiDocumentation },
  { label: 'Multi-currency', testId: prMobile.multicurrency },
  { label: 'Admin dashboard', testId: prMobile.adminDashboard },
  { label: 'Payment processing', testId: prMobile.paymentProcessing },
  { label: 'Security certified', testId: prMobile.securityCertified },
] as const;

export const PRICING_TRUST_ITEMS = [
  { emoji: '🔒', label: 'Bank-level security', testId: pr.trustStripItem },
  { emoji: '✈', label: 'GDS & NDC certified', testId: pr.trustStripItem2 },
  { emoji: '👥', label: 'Trusted by agencies', testId: pr.trustStripItem3 },
  { emoji: '📞', label: '24/7 support available', testId: pr.trustStripItem4 },
] as const;

export const PRICING_TRUST_ITEMS_MOBILE = [
  { emoji: '🔒', label: 'Bank-level security', testId: prMobile.banklevelSecurity },
  { emoji: '✈', label: 'GDS & NDC certified', testId: prMobile.gdsNdcCertified },
  { emoji: '👥', label: 'Trusted by agencies', testId: prMobile.trustedByAgencies },
  { emoji: '📞', label: '24/7 support available', testId: prMobile.n247SupportAvailable },
] as const;
