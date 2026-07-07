import { FEATURE_GRID_ACCENT_BAR_CLASS } from '@/constants/landing.constants';
import { ids, testIds } from '@/tokens/build/test-ids';
import type {
  HiwBenefitCardConfig,
  HowItWorksHeroStatConfig,
  SixWeekAccentBarVariant,
  SixWeekCardConfig,
} from '@/types/how-it-works.types';

const hero = ids.component.howItWorks.hero;
const sixWeek = ids.component.howItWorks.sixWeek;

/** GH#23 — mobile benefits row (`5217:6883`). Flat lookup avoids stale nested `ids` tree after registry edits. */
export const HIW_BENEFITS_STATS_ROOT_TEST_ID =
  testIds['component.howItWorks.benefitsStats.root'];

export const HIW_HERO_HEADLINE =
  'See exactly how your agency goes live in 6 weeks.';

export const HIW_HERO_SUBCOPY =
  'From your first call to agents searching every GDS from one screen. Here is every step, every week.';

export const HIW_HERO_PROOF_LINE =
  'No per-transaction fees. No revenue sharing. Complete ownership.';

export const HIW_HERO_DEMO_CTA_LABEL = 'Book A Free Demo';

export const HIW_MID_CTA_COPY = "Seen enough? Let's show you a live demo.";

export const HIW_MID_CTA_DEMO_LABEL = 'Book A Demo';

/** Figma S4-MidCTA band height (5217:6701) — spacing.64 + spacing.32 = 96px. */
export const HIW_MID_CTA_BAND_HEIGHT_CLASS =
  'min-h-[calc(var(--spacing-64)+var(--spacing-32))]';

/** Figma gap below mid CTA before six-week band — y 1574 − 1474 = 100px (spacing.60 + spacing.40). */
export const HIW_MID_CTA_BOTTOM_GAP_CLASS =
  'mb-[calc(var(--spacing-60)+var(--spacing-40))]';

export const HIW_MID_CTA_SECTION_CLASS = `${HIW_MID_CTA_BAND_HEIGHT_CLASS} ${HIW_MID_CTA_BOTTOM_GAP_CLASS}`;

export const HIW_MID_CTA_CARD_CLASS =
  'flex h-[calc(var(--spacing-64)+var(--spacing-32))] w-full max-w-[868px] items-center justify-between rounded-[var(--radius-surface)] border border-[var(--color-border-default)] bg-[var(--color-background-subtle)] px-[var(--spacing-20)] py-[var(--spacing-24)]';

export const HIW_MID_CTA_COPY_CLASS =
  'text-heading-desktop-h3-sm text-[var(--color-text-primary)]';

/** Figma Frame 2095585162 (5217:6866) — mobile-only social strip wrapper. */
export const HIW_MOBILE_SOCIAL_STRIP_SECTION_CLASS =
  'flex w-full flex-col items-center gap-[var(--spacing-20)] px-[var(--spacing-16)] py-[var(--spacing-40)] lg:hidden';

/** Figma test frame (5217:6867) — max content width 361px, vertical stack gap 16. */
export const HIW_MOBILE_TESTIMONIAL_BLOCK_CLASS =
  'flex w-full max-w-[361px] flex-col items-center gap-[var(--spacing-16)]';

/** Figma Logo frame — 132×120 (spacing.120 + spacing.12 width). */
export const HIW_MOBILE_TESTIMONIAL_LOGO_SHELL_CLASS =
  'flex h-[var(--spacing-120)] w-[calc(var(--spacing-120)+var(--spacing-12))] items-center justify-center rounded-[var(--radius-4)] bg-[var(--color-background-subtle)]';

export const HIW_MOBILE_TESTIMONIAL_CONTENT_CLASS =
  'flex w-full flex-col gap-[var(--spacing-12)]';

export const HIW_MOBILE_TESTIMONIAL_AUTHOR_ROW_CLASS =
  'flex flex-row items-start gap-[var(--spacing-20)]';

/** Figma AvatarInitials slot — 36px (spacing.32 + spacing.4). */
export const HIW_MOBILE_TESTIMONIAL_AVATAR_SHELL_CLASS =
  'relative size-[calc(var(--spacing-32)+var(--spacing-4))] shrink-0';

export const HIW_MOBILE_TESTIMONIAL_AVATAR_INITIALS_CLASS =
  'absolute [font-size:var(--font-size-18)] [font-weight:var(--font-weight-700)] [line-height:var(--font-lineheight-24)] text-[var(--color-text-inverse)]';

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

export const HIW_SIX_WEEK_PILL_LABEL = '6-week Onboarding';

export const HIW_SIX_WEEK_HEADLINE = "Live in 6 weeks. Here's exactly what happens.";

export const HIW_SIX_WEEK_SUBCOPY =
  'We handle the technical complexity. Your agents just search and book.';

export const HIW_SIX_WEEK_ONBOARDING_PILL_DESKTOP_CLASS =
  'inline-flex items-center justify-center gap-[var(--spacing-8)] rounded-[var(--radius-pill)] border-[0.3px] border-[var(--color-border-brand-navy)] bg-[color-mix(in_srgb,var(--color-text-brand-navy)_7%,transparent)] px-[var(--spacing-16)] py-[var(--spacing-8)]';

export const HIW_SIX_WEEK_ONBOARDING_PILL_MOBILE_CLASS =
  'inline-flex items-center justify-center gap-[var(--spacing-6)] rounded-[var(--radius-pill)] border-[0.3px] border-[var(--color-border-brand-navy)] bg-[color-mix(in_srgb,var(--color-text-brand-navy)_7%,transparent)] px-[var(--spacing-12)] py-[var(--spacing-8)]';

export const HIW_SIX_WEEK_PILL_LABEL_DESKTOP_CLASS =
  'text-label-desktop-md-tag text-[var(--color-text-brand-navy)]';

export const HIW_SIX_WEEK_PILL_LABEL_MOBILE_CLASS =
  '[font-family:var(--typography-label-mobile-md-tag-font-family)] [font-size:var(--typography-label-mobile-md-tag-font-size)] [font-weight:var(--typography-label-mobile-md-tag-font-weight)] [line-height:var(--typography-label-mobile-md-tag-line-height)] text-[var(--color-text-brand-navy)]';

export const HIW_SIX_WEEK_CARD_SHELL_CLASS =
  'flex w-full flex-col overflow-hidden rounded-[var(--radius-panel)] border border-[var(--color-border-default)] bg-[var(--color-background-page)] shadow-[var(--shadow-card)] lg:w-[314px] lg:shrink-0';

export const HIW_SIX_WEEK_CARD_CONTENT_DESKTOP_CLASS =
  'flex flex-col gap-[var(--spacing-12)] px-[var(--spacing-24)] pb-[var(--spacing-24)] pt-[var(--spacing-16)]';

export const HIW_SIX_WEEK_CARD_CONTENT_MOBILE_CLASS =
  'flex flex-col gap-[var(--spacing-12)] px-[var(--spacing-16)] pb-[var(--spacing-20)] pt-[var(--spacing-16)]';

export const HIW_SIX_WEEK_CARD_TITLE_DESKTOP_CLASS =
  'text-heading-desktop-h4 text-[var(--color-text-primary)]';

export const HIW_SIX_WEEK_CARD_TITLE_MOBILE_CLASS =
  'text-heading-mobile-h4 text-[var(--color-text-primary)]';

export const HIW_SIX_WEEK_CARD_BODY_DESKTOP_CLASS =
  '[font-family:var(--typography-body-desktop-xs-sm-font-family)] [font-size:var(--typography-body-desktop-xs-sm-font-size)] [font-weight:var(--typography-body-desktop-xs-sm-font-weight)] [line-height:var(--typography-body-desktop-xs-sm-line-height)] text-[var(--color-text-secondary)]';

export const HIW_SIX_WEEK_CARD_BODY_MOBILE_CLASS =
  '[font-family:var(--typography-body-mobile-xs-sm-font-family)] [font-size:var(--typography-body-mobile-xs-sm-font-size)] [font-weight:var(--typography-body-mobile-xs-sm-font-weight)] [line-height:var(--typography-body-mobile-xs-sm-line-height)] text-[var(--color-text-secondary)]';

export const HIW_SIX_WEEK_MOBILE_SUBCOPY_CLASS =
  '[font-family:var(--typography-body-mobile-md-font-family)] [font-size:var(--typography-body-mobile-md-font-size)] [font-weight:var(--typography-body-mobile-md-font-weight)] [line-height:var(--typography-body-mobile-md-line-height)] text-[var(--color-text-secondary)]';

export const HIW_SIX_WEEK_BADGE_SHELL_NAVY_CLASS =
  'inline-flex w-fit items-center rounded-[var(--radius-4)] bg-[color-mix(in_srgb,var(--color-text-brand-navy)_8%,transparent)] px-[var(--spacing-8)] py-[var(--spacing-4)]';

export const HIW_SIX_WEEK_BADGE_SHELL_GREEN_CLASS =
  'inline-flex w-fit items-center rounded-[var(--radius-4)] bg-[color-mix(in_srgb,var(--color-text-success)_8%,transparent)] px-[var(--spacing-8)] py-[var(--spacing-4)]';

export const HIW_SIX_WEEK_BADGE_LABEL_DESKTOP_NAVY_CLASS =
  'text-label-desktop-micro-tag uppercase text-[var(--color-text-brand-navy)]';

export const HIW_SIX_WEEK_BADGE_LABEL_DESKTOP_GREEN_CLASS =
  'text-label-desktop-micro-tag uppercase text-[var(--color-text-success)]';

export const HIW_SIX_WEEK_BADGE_LABEL_MOBILE_NAVY_CLASS =
  'text-label-mobile-micro-tag uppercase text-[var(--color-text-brand-navy)]';

export const HIW_SIX_WEEK_BADGE_LABEL_MOBILE_GREEN_CLASS =
  'text-label-mobile-micro-tag uppercase text-[var(--color-text-success)]';

export const HIW_SIX_WEEK_ACCENT_BAR_CLASS =
  'h-[var(--spacing-4)] w-[var(--spacing-64)] rounded-[var(--radius-pill)]';

export const HIW_SIX_WEEK_ACCENT_BAR_FILL_CLASS: Record<SixWeekAccentBarVariant, string> = {
  navy: FEATURE_GRID_ACCENT_BAR_CLASS.navy,
  teal: FEATURE_GRID_ACCENT_BAR_CLASS.teal,
  success: 'bg-[var(--color-text-success)]',
};

export const HIW_SIX_WEEK_CARDS: readonly SixWeekCardConfig[] = [
  {
    cardTestId: sixWeek.weekCard1,
    weekLabel: 'WEEK 1',
    title: 'GDS & NDC Integration',
    body: 'We connect to your existing contracts. All sources live and tested.',
    accentBar: 'navy',
    badgeVariant: 'navy',
  },
  {
    cardTestId: sixWeek.weekCard2,
    weekLabel: 'WEEK 2-3',
    title: 'Platform Build & Brand',
    body: 'White-label applied. Your logo, branding, and domain configured.',
    accentBar: 'navy',
    badgeVariant: 'navy',
  },
  {
    cardTestId: sixWeek.weekCard3,
    weekLabel: 'WEEK 4-5',
    title: 'Testing & QA',
    body: 'All fare sources validated. Full booking flow tested end-to-end.',
    accentBar: 'navy',
    badgeVariant: 'navy',
  },
  {
    cardTestId: sixWeek.weekCard4,
    weekLabel: 'WEEK 6',
    title: 'Go Live 🚀',
    body: 'Platform launches under your brand. 30-day support included.',
    accentBar: 'teal',
    badgeVariant: 'green',
  },
] as const;

/** Mobile go-live accent bar uses success solid per Figma `5217:6864`. */
export const HIW_SIX_WEEK_MOBILE_GO_LIVE_ACCENT: SixWeekAccentBarVariant = 'success';

/** Figma SocialProofStrip (I5217:6705;5223:6722) — desktop-only row below onboarding. */
export const HIW_DESKTOP_SOCIAL_PROOF_STRIP_CLASS =
  'hidden w-full flex-row items-center justify-center gap-[var(--spacing-20)] pt-[var(--spacing-40)] pl-[var(--spacing-64)] lg:flex';

export const HIW_DESKTOP_BENEFIT_STACK_CLASS =
  'flex w-full max-w-[422px] shrink-0 flex-col gap-[var(--spacing-20)]';

export const HIW_DESKTOP_BENEFIT_CARD_CLASS =
  'flex w-full flex-row items-center gap-[var(--spacing-10)] rounded-[var(--radius-12)] border border-[var(--color-border-default)] bg-[var(--color-background-page)] p-[var(--spacing-18)]';

export const HIW_DESKTOP_BENEFIT_ICON_SHELL_CLASS =
  'flex size-[var(--spacing-40)] shrink-0 items-center justify-center rounded-[var(--radius-12)] bg-[color-mix(in_srgb,var(--color-text-brand-teal)_8%,transparent)]';

export const HIW_DESKTOP_BENEFIT_TITLE_CLASS =
  'text-heading-desktop-h4-feature text-[var(--color-text-primary)]';

export const HIW_DESKTOP_BENEFIT_BODY_CLASS =
  '[font-family:var(--typography-body-desktop-xs-font-family)] [font-size:var(--typography-body-desktop-xs-font-size)] [font-weight:var(--typography-body-desktop-xs-font-weight)] [line-height:var(--typography-body-desktop-xs-line-height)] text-[var(--color-text-secondary)]';

/** Figma stat row (5217:6883) — mobile-only vertical benefit stack. */
export const HIW_MOBILE_BENEFITS_STATS_CLASS =
  'flex w-full max-w-[361px] flex-col gap-[var(--spacing-12)] lg:hidden';

export const HIW_MOBILE_BENEFIT_CARD_CLASS =
  'flex w-full flex-row items-center gap-[var(--spacing-8)] rounded-[var(--radius-12)] border border-[var(--color-border-default)] bg-[var(--color-background-page)] p-[var(--spacing-16)]';

export const HIW_MOBILE_BENEFIT_ICON_SHELL_BASE_CLASS =
  'flex size-[calc(var(--spacing-32)+var(--spacing-4))] shrink-0 items-center justify-center rounded-[var(--radius-12)]';

export const HIW_MOBILE_BENEFIT_ICON_SHELL_SUCCESS_CLASS =
  'bg-[color-mix(in_srgb,var(--color-text-success)_8%,transparent)]';

export const HIW_MOBILE_BENEFIT_ICON_SHELL_NAVY_CLASS =
  'bg-[color-mix(in_srgb,var(--color-text-brand-navy)_8%,transparent)]';

export const HIW_MOBILE_BENEFIT_ICON_SHELL_PRIMARY_CLASS =
  'bg-[color-mix(in_srgb,var(--color-action-primary-default-background)_8%,transparent)]';

export const HIW_MOBILE_BENEFIT_TITLE_CLASS =
  'text-heading-mobile-h4 text-[var(--color-text-primary)]';

export const HIW_MOBILE_BENEFIT_BODY_CLASS =
  '[font-family:var(--typography-body-mobile-xs-font-family)] [font-size:var(--typography-body-mobile-xs-font-size)] [font-weight:var(--typography-body-mobile-xs-font-weight)] [line-height:var(--typography-body-mobile-xs-line-height)] text-[var(--color-text-secondary)]';

export const HIW_BENEFIT_CARDS: readonly HiwBenefitCardConfig[] = [
  {
    title: 'Zero booking fees',
    body: 'Pay once. Keep every margin.',
    iconSrc: '/icons/icon-benefit-zero-fees.svg',
    mobileIconShellClass: HIW_MOBILE_BENEFIT_ICON_SHELL_SUCCESS_CLASS,
  },
  {
    title: 'Full white-label',
    body: 'Your brand on every screen and domain.',
    iconSrc: '/icons/icon-benefit-white-label.svg',
    mobileIconShellClass: HIW_MOBILE_BENEFIT_ICON_SHELL_NAVY_CLASS,
  },
  {
    title: 'Multi-GDS search',
    body: 'All sources simultaneously, one list.',
    iconSrc: '/icons/icon-benefit-multi-gds.svg',
    mobileIconShellClass: HIW_MOBILE_BENEFIT_ICON_SHELL_PRIMARY_CLASS,
  },
] as const;

/** @deprecated Use HIW_BENEFIT_CARDS */
export const HIW_DESKTOP_BENEFIT_CARDS = HIW_BENEFIT_CARDS;
