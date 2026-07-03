/** Shared layout / navigation components */
export interface NavbarCtaProps {
  testId: string;
  labelTestId: string;
  iconTestId: string;
  graphicTestId: string;
  href: string;
  variant: 'desktop' | 'mobile';
}

export interface FooterNavLinkConfig {
  label: string;
  href: string;
  linkTestId: string;
  labelTestId: string;
}

export interface FooterNavColumnConfig {
  heading: string;
  colTestId: string;
  headingTestId: string;
  links: readonly FooterNavLinkConfig[];
}

export interface FooterNavLinkProps {
  link: FooterNavLinkConfig;
  emphasized?: boolean;
  motionEngaged?: boolean;
  variant?: 'desktop' | 'mobile';
}
