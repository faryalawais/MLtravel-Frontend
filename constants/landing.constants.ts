import type { CSSProperties } from 'react';
import { ids } from '@/tokens/build/test-ids';
import type { DesktopCardConfig, MobileCardConfig } from '@/types/landing.types';
import type {
  ComparisonMobileRowConfig,
  ComparisonRowConfig,
  HiwCardConfig,
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

/** Landing page — problem section */
const problem = ids.component.landing.problem;

/** Semantic + motion token references (no raw values). */
export const PROBLEM_TOKENS = {
  shadowCard: 'var(--shadow-card)',
  motionDurationDefault: 'var(--motion-duration-default)',
  motionEasingDefault: 'var(--motion-easing-default)',
  motionStepDelayVar: '--motion-duration-step-delay',
  accentGradientHover:
    'linear-gradient(to right, var(--color-text-brand-navy), color-mix(in srgb, var(--color-text-brand-navy) 55%, var(--color-text-brand-orange)))',
  gradientBarBg:
    'linear-gradient(to right, var(--color-text-brand-navy), var(--color-text-brand-orange) 50%, color-mix(in srgb, var(--color-text-brand-navy) 55%, var(--color-text-brand-orange)))',
} as const;

export const PROBLEM_MOTION_STYLE: CSSProperties = {
  transitionDuration: PROBLEM_TOKENS.motionDurationDefault,
  transitionTimingFunction: PROBLEM_TOKENS.motionEasingDefault,
};

export const PROBLEM_CARD_BASE_CLASS =
  'flex flex-col rounded-[var(--radius-panel)] bg-[var(--color-background-page)]';

export const CARD_SHELL_HIGHLIGHT =
  'border-[var(--color-border-info)] shadow-[var(--shadow-card)] -translate-y-[var(--spacing-4)]';

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

export const COMPARISON_MOTION_STYLE: CSSProperties = {
  transitionDuration: 'var(--motion-duration-default)',
  transitionTimingFunction: 'var(--motion-easing-default)',
};

export const COMPARISON_TOKENS = {
  shadowTicket: 'var(--shadow-card-elevated)',
  shadowTicketReveal: 'var(--shadow-card-navy)',
} as const;

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
