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
