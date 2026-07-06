/** Landing page (`app/page.tsx`) — hero section */
export interface HeroPrimaryCtaProps {
  testId: string;
  labelTestId: string;
  iconTestId: string;
  graphicTestId: string;
  href: string;
  label?: string;
  className?: string;
  /** One-way motion emphasis from hero section sequence (MOTION-SPEC §1). */
  emphasized?: boolean;
  useHeroEasing?: boolean;
}

export interface HeroOptionalClassNameProps {
  className?: string;
}

export type HeroSectionLayout = 'default' | 'hiw-page';

export interface HeroSectionProps {
  layout?: HeroSectionLayout;
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
  cardIndex: number;
  revealedUpTo: number;
  activeIndex: number | null;
  isHighlighted: boolean;
  cascadeRunning: boolean;
  motionEngaged: boolean;
}

export interface ProblemCardMobileProps {
  card: MobileCardConfig;
}

export interface GradientBarProps {
  testId?: string;
  isEmphasized?: boolean;
}

export interface ProblemCtaDesktopProps {
  isEmphasized?: boolean;
  motionEngaged?: boolean;
}

export interface HiwFooterLinkProps {
  isEmphasized?: boolean;
  motionEngaged?: boolean;
}

export interface HowItWorksTeaserSectionProps {
  /** When false, hides the learn-more link on `/how-it-works` but keeps the onboarding note. */
  showFooterLink?: boolean;
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
  cardIndex: number;
  revealedUpTo: number;
  activeIndex: number | null;
  isHighlighted: boolean;
  cascadeRunning: boolean;
  motionEngaged: boolean;
}

export interface HiwCardMobileProps {
  card: HiwCardConfig;
}

/** Landing page — feature grid section */
export type FeatureGridCardAccent = 'navy' | 'teal' | 'orange' | 'red';

export type FeatureGridCardSize = 'wide' | 'narrow';

export interface FeatureGridCardConfig {
  cardTestId: string;
  textBlockTestId: string;
  titleRowTestId?: string;
  titleTestId: string;
  badgeTestId?: string;
  badgeLabelTestId?: string;
  badgeLabel?: string;
  accentBarTestId: string;
  bodyTestId: string;
  heading: string;
  body: string;
  accent: FeatureGridCardAccent;
  size: FeatureGridCardSize;
}

export interface FeatureGridCardDesktopProps {
  card: FeatureGridCardConfig;
  cardIndex: number;
  activeIndex: number | null;
  isHighlighted: boolean;
  cascadeRunning: boolean;
  motionEngaged: boolean;
}

export interface FeatureGridCardMobileProps {
  card: FeatureGridCardConfig;
}

export interface FeatureGridSectionPillProps {
  pillTestId: string;
  labelTestId: string;
  variant?: 'desktop' | 'mobile';
}

export interface FeatureGridCtaProps {
  testId: string;
  labelTestId: string;
  iconTestId: string;
  graphicTestId: string;
  className?: string;
}

/** Landing page — social proof section (GH#9) */
export interface SocialProofTestimonialConfig {
  blockTestId: string;
  logoCardTestId: string;
  logoSlotTestId: string;
  companyLogoTestId: string;
  quoteTestId: string;
  authorTestId: string;
  avatarTestId: string;
  initialsTestId: string;
  nameTestId: string;
  roleTestId: string;
  companyTestId: string;
  logoSrc: string;
  quote: string;
  initials: string;
  name: string;
  role: string;
  company: string;
}

export interface SocialProofClientLogoConfig {
  src: string;
  testId: string;
}

export interface SocialProofSectionPillProps {
  pillTestId: string;
  labelTestId: string;
  variant?: 'desktop' | 'mobile';
}

/** Landing page — pricing section (GH#11) */
export interface PricingSectionPillProps {
  pillTestId: string;
  labelTestId: string;
  variant?: 'desktop' | 'mobile';
}
