import { ids } from '@/tokens/build/test-ids';
import type { HowItWorksHeroStatConfig } from '@/types/how-it-works.types';

const hero = ids.component.howItWorks.hero;

export const HIW_HERO_HEADLINE =
  'See exactly how your agency goes live in 6 weeks.';

export const HIW_HERO_SUBCOPY =
  'From your first call to agents searching every GDS from one screen. Here is every step, every week.';

export const HIW_HERO_PROOF_LINE =
  'No per-transaction fees. No revenue sharing. Complete ownership.';

export const HIW_HERO_DEMO_CTA_LABEL = 'Book A Free Demo';

/** Figma HIWHeroTextBlock height (5217-6699 cache). */
export const HIW_HERO_TEXT_BLOCK_MIN_HEIGHT_PX = 280;

/** Figma head-group height (I5217:6699;5218:6544;5218:10). */
export const HIW_HERO_HEAD_GROUP_HEIGHT_PX = 176;

/** Figma HIWHeroTextBlock itemSpacing between head-group and cta-group. */
export const HIW_HERO_TEXT_BLOCK_GAP_PX = 24;

/** CTA layer slot below container top — Figma terminal pose offset (252 − 52). */
export const HIW_HERO_CTA_SLOT_TOP_PX =
  HIW_HERO_HEAD_GROUP_HEIGHT_PX + HIW_HERO_TEXT_BLOCK_GAP_PX;

export const HIW_DESKTOP_STATS: readonly HowItWorksHeroStatConfig[] = [
  {
    itemTestId: hero.statItem,
    valBlockTestId: hero.valBlock,
    valueTestId: hero.textBlock5,
    barTestId: hero.bar,
    labelBlockTestId: hero.labelBlock,
    labelTestId: hero.savedInFees,
    captionTestId: hero.multipleClients,
    dividerTestId: hero.divider,
    value: '$1,200/mo',
    label: 'SAVED IN FEES',
    caption: 'Multiple Clients',
  },
  {
    itemTestId: hero.statItem2,
    valBlockTestId: hero.valBlock2,
    valueTestId: hero.textBlock6,
    barTestId: hero.bar2,
    labelBlockTestId: hero.labelBlock2,
    labelTestId: hero.fasterPerBooking,
    captionTestId: hero.postmigrationMeasure,
    dividerTestId: hero.divider2,
    value: '40%',
    label: 'FASTER PER BOOKING',
    caption: 'Post-migration measure',
  },
  {
    itemTestId: hero.statItem3,
    valBlockTestId: hero.valBlock3,
    valueTestId: hero.n6Weeks,
    barTestId: hero.bar3,
    labelBlockTestId: hero.labelBlock3,
    labelTestId: hero.toGoLive,
    captionTestId: hero.dedicatedOnboarding,
    dividerTestId: hero.divider3,
    value: '6 Weeks',
    label: 'TO GO LIVE',
    caption: 'Dedicated Onboarding',
  },
  {
    itemTestId: hero.statItem4,
    valBlockTestId: hero.valBlock4,
    valueTestId: hero.n500,
    barTestId: hero.bar4,
    labelBlockTestId: hero.labelBlock4,
    labelTestId: hero.airlinesConnected,
    captionTestId: hero.globalInventory,
    value: '500+',
    label: 'AIRLINES CONNECTED',
    caption: 'Global inventory',
  },
] as const;
