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
