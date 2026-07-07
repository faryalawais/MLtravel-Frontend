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

/** How It Works page — desktop social proof strip benefit cards */
export interface HiwDesktopBenefitCardConfig {
  title: string;
  body: string;
  iconSrc: string;
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
