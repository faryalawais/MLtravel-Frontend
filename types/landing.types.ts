/** Landing page (`app/page.tsx`) — hero section */
export interface HeroPrimaryCtaProps {
  testId: string;
  labelTestId: string;
  iconTestId: string;
  graphicTestId: string;
  href: string;
  className?: string;
}

export interface HeroOptionalClassNameProps {
  className?: string;
}

/** Landing page — problem section */
export interface DesktopCardConfig {
  cardTestId: string;
  iconTestId: string;
  graphicTestId: string;
  textBlockTestId: string;
  headingTestId: string;
  accentBarTestId: string;
  bodyTestId: string;
  iconSrc: string;
  heading: string;
  body: string;
}

export interface MobileCardConfig {
  cardTestId: string;
  iconTestId: string;
  graphicTestId: string;
  headingTestId: string;
  bodyTestId: string;
  accentBarTestId?: string;
  iconSrc: string;
  heading: string;
  body: string;
}

export interface SectionPillProps {
  pillTestId: string;
  labelTestId: string;
  variant?: 'desktop' | 'mobile';
}

export interface AccentBarProps {
  testId: string;
  isHighlighted?: boolean;
  cascadeRunning?: boolean;
}

export interface CardIconProps {
  iconTestId: string;
  graphicTestId: string;
  iconSrc: string;
  isHighlighted: boolean;
  cascadeRunning?: boolean;
}

export interface ProblemCardDesktopProps {
  card: DesktopCardConfig;
  isHighlighted: boolean;
  cascadeRunning: boolean;
}

export interface ProblemCardMobileProps {
  card: MobileCardConfig;
}

export interface GradientBarProps {
  testId?: string;
}

/** Landing page — comparison first section */
export type ComparisonRowAccent = 'danger' | 'success' | 'navy' | 'orange';

export interface ComparisonRowConfig {
  rowTestId: string;
  microTagTestId: string;
  tagLabelTestId: string;
  titleTestId: string;
  bodyTestId: string;
  stampTestId: string;
  stampLabelTestId: string;
  tagLabel: string;
  title: string;
  body: string;
  stampLabel: string;
  accent: ComparisonRowAccent;
}

export interface ComparisonMobileRowConfig {
  rowTestId: string;
  tagTestId: string;
  titleTestId: string;
  bodyTestId: string;
  stampTestId: string;
  tagLabel: string;
  title: string;
  body: string;
  stampLabel: string;
  accent: ComparisonRowAccent;
}

export interface ComparisonCtaProps {
  ctaTestId: string;
  labelTestId: string;
  iconTestId: string;
  graphicTestId?: string;
}

/** Landing page — how-it-works teaser section */
export type HiwCardAccent = 'navy' | 'orange' | 'teal';

export interface HiwCardConfig {
  cardTestId: string;
  stackTestId: string;
  cardVisualTestId: string;
  cardContentTestId: string;
  stepBadgeTestId: string;
  stepLabelTestId: string;
  stepLabel: string;
  mainBlockTestId: string;
  headingTestId: string;
  heading: string;
  accentBarTestId: string;
  bodyTestId: string;
  body: string;
  taglineTestId: string;
  tagline: string;
  accent: HiwCardAccent;
  visualImageSrc: string;
}

export interface HiwSectionPillProps {
  pillTestId: string;
  labelTestId: string;
  variant?: 'desktop' | 'mobile';
}

export interface HiwCardDesktopProps {
  card: HiwCardConfig;
  isHighlighted: boolean;
  cascadeRunning: boolean;
}

export interface HiwCardMobileProps {
  card: HiwCardConfig;
}
