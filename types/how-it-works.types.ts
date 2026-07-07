/** How It Works page — six-week timeline */
export type SixWeekAccentBarVariant = 'navy' | 'teal' | 'success';

export type SixWeekBadgeVariant = 'navy' | 'green';

export interface SixWeekCardConfig {
  cardTestId: string;
  weekLabel: string;
  title: string;
  body: string;
  accentBar: SixWeekAccentBarVariant;
  badgeVariant: SixWeekBadgeVariant;
}

/** How It Works page — benefit cards (desktop strip + mobile stat row) */
export interface HiwBenefitCardConfig {
  title: string;
  body: string;
  iconSrc: string;
  mobileIconShellClass: string;
}

/** How It Works page — FAQ accordion */
export interface HiwFaqItemConfig {
  id: string;
  questionTestId: string;
  answerTestId: string;
  question: string;
  answer: string;
  /** Omit on mobile when Figma mobile frame shows fewer items. */
  desktopOnly?: boolean;
}

export interface HiwFaqTabConfig {
  id: string;
  label: string;
  tabTestId?: string;
  items: readonly HiwFaqItemConfig[];
  /** Figma desktop `5261:8072` shows an extra placeholder tab not on mobile `5261:8150`. */
  desktopOnly?: boolean;
}

/** How It Works page — hero section */
export interface HowItWorksHeroStatConfig {
  itemTestId: string;
  valBlockTestId: string;
  valueTestId: string;
  barTestId: string;
  labelBlockTestId: string;
  labelTestId: string;
  captionTestId: string;
  dividerTestId?: string;
  value: string;
  label: string;
  caption: string;
}
