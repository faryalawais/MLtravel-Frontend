import type { CSSProperties } from 'react';
import { ids } from '@/tokens/build/test-ids';
import type { DesktopCardConfig, MobileCardConfig } from '@/types/landing.types';

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
