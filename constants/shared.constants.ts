import { ids } from '@/tokens/build/test-ids';

/** Shared layout — site navigation (desktop) */
export const NAV_LINK_CLASS_NAME =
  'text-body-desktop-sm text-[var(--color-text-primary)] hover:underline focus-visible:outline focus-visible:outline-[length:var(--spacing-3)] focus-visible:outline-offset-[var(--spacing-3)] focus-visible:outline-[var(--color-focus-ring)]';

/** Shared layout — mobile navigation */
export const MOBILE_NAV_LINK_CLASS_NAME =
  'block py-[var(--spacing-12)] text-body-desktop-sm text-[var(--color-text-primary)] hover:underline focus-visible:outline focus-visible:outline-[length:var(--spacing-3)] focus-visible:outline-offset-[var(--spacing-3)] focus-visible:outline-[var(--color-focus-ring)]';

export const MOBILE_NAV_LINKS = [
  {
    href: '#product',
    label: 'Product',
    linkTestId: ids.component.navbar.productLink,
    labelTestId: ids.component.navbar.productLinkLabel,
  },
  {
    href: '/how-it-works',
    label: 'How It Works',
    linkTestId: ids.component.navbar.howItWorksLink,
    labelTestId: ids.component.navbar.howItWorksLinkLabel,
  },
  {
    href: '#pricing',
    label: 'Pricing',
    linkTestId: ids.component.navbar.pricingLink,
    labelTestId: ids.component.navbar.pricingLinkLabel,
  },
] as const;

export const MOBILE_NAV_MOTION_TRANSITION =
  'duration-[var(--motion-duration-default)] ease-[var(--motion-easing-default)]';

/** Matches `--motion-duration-default` (700ms) for unmount after slide-out. */
export const MENU_CLOSE_MS = 700;

/** Shared site footer */
export const FOOTER_BRAND_LABEL = 'MaqsoodTravel';

export const FOOTER_TAGLINE =
  'Travel infrastructure that removes IATA overhead and provides deep GDS integrations for modern travel businesses.';

export const FOOTER_COPYRIGHT =
  '© 2026 Maqsood Travel Infrastructure. All rights reserved.';

/** Figma `VariableID:3003:17` → `color.background.subtle` (#f0f5fb), not `color.background.page`. */
export const FOOTER_SHELL_BG_CLASS = 'bg-[var(--color-background-subtle)]';

/** Figma `I5164:6565;3167:1262` — 32×32 orange rounded square + white plane (not navbar wordmark). */
export const FOOTER_BRAND_MARK_SRC = '/icons/icon-footer-brand-mark.svg';

export const FOOTER_DESKTOP_SHELL_CLASS =
  `hidden min-[1440px]:flex w-full flex-col items-center ${FOOTER_SHELL_BG_CLASS} px-[var(--spacing-64)] pt-[var(--spacing-60)]`;

export const FOOTER_MOBILE_SHELL_CLASS =
  `flex min-[1440px]:hidden w-full flex-col items-center ${FOOTER_SHELL_BG_CLASS} px-[var(--spacing-16)] pb-[var(--spacing-20)] pt-[var(--spacing-32)]`;

/** Figma container `I5164:6565;3152:14` — 1312×208, gap 20 between main-row and bottom-row. */
export const FOOTER_CONTAINER_CLASS =
  'flex w-full max-w-[1312px] flex-col gap-[var(--spacing-20)]';

export const FOOTER_MAIN_ROW_CLASS =
  'flex w-full max-w-[1280px] items-start justify-between self-center';

export const FOOTER_BRAND_COL_CLASS = 'flex w-full max-w-[480px] flex-col gap-[var(--spacing-16)]';

export const FOOTER_BRAND_COL_MOBILE_CLASS =
  'flex w-full flex-col items-start gap-[var(--spacing-16)]';

export const FOOTER_BRAND_HEADER_CLASS = 'flex items-center gap-[var(--spacing-8)]';

export const FOOTER_BRAND_MARK_CLASS = 'size-[var(--spacing-32)] shrink-0';

/** Figma style `2176:21` — Satoshi 18px/24, -0.3px tracking. */
export const FOOTER_BRAND_LABEL_DESKTOP_CLASS =
  'text-heading-desktop-h4 tracking-[length:-0.3px] text-[var(--color-text-primary)]';

/** Figma style `2196:22` — Satoshi 16px/22, -0.44px tracking. */
export const FOOTER_BRAND_LABEL_MOBILE_CLASS =
  'text-heading-mobile-h4 tracking-[length:-0.44px] text-[var(--color-text-primary)]';

export const FOOTER_TAGLINE_CLASS =
  'text-[length:var(--font-size-13)] font-normal leading-[var(--font-lineheight-20)] text-[var(--color-text-secondary)]';

/** Figma nav-cols `itemSpacing: 48`. */
export const FOOTER_NAV_COLS_CLASS =
  'flex shrink-0 items-start gap-[calc(var(--spacing-40)+var(--spacing-8))]';

export const FOOTER_NAV_COL_CLASS = 'flex flex-col gap-[var(--spacing-12)]';

export const FOOTER_NAV_HEADING_DESKTOP_CLASS =
  'text-heading-desktop-h4 tracking-[length:-0.3px] text-[var(--color-text-primary)]';

export const FOOTER_NAV_HEADING_MOBILE_CLASS =
  'text-heading-mobile-h4 tracking-[length:-0.44px] text-[var(--color-text-primary)]';

export const FOOTER_NAV_LINK_LIST_CLASS = 'flex flex-col gap-[var(--spacing-12)]';

const FOOTER_LINK_INTERACTION_CLASS =
  'transition-colors hover:text-[var(--color-text-brand-navy)] hover:underline focus-visible:outline focus-visible:outline-[length:var(--spacing-3)] focus-visible:outline-offset-[var(--spacing-3)] focus-visible:outline-[var(--color-focus-ring)]';

/** Figma style `5151:9371` — 15px/24, secondary, -0.15px tracking. */
export const FOOTER_NAV_LINK_CLASS = `text-body-desktop-sm tracking-[length:-0.15px] text-[var(--color-text-secondary)] ${FOOTER_LINK_INTERACTION_CLASS}`;

/** Figma style `2196:28` — 13px/20 mobile footer links. */
export const FOOTER_NAV_LINK_MOBILE_CLASS = `${FOOTER_TAGLINE_CLASS} ${FOOTER_LINK_INTERACTION_CLASS}`;

export const FOOTER_BOTTOM_ROW_CLASS =
  'flex w-full max-w-[1280px] items-center justify-between self-center border-t border-[var(--color-border-default)] py-[var(--spacing-16)]';

export const FOOTER_BOTTOM_ROW_MOBILE_CLASS =
  'flex w-full flex-col items-center gap-[var(--spacing-8)] border-t border-[var(--color-border-default)]';

/** Figma style `2756:19` — 13px/20, muted, 0 tracking. */
export const FOOTER_COPYRIGHT_DESKTOP_CLASS =
  'text-[length:var(--font-size-13)] font-normal leading-[var(--font-lineheight-20)] text-[var(--color-text-muted)]';

/** Figma style `2756:20` — 12px/16, muted, -0.31px tracking, centered. */
export const FOOTER_COPYRIGHT_MOBILE_CLASS =
  'text-center text-[length:var(--font-size-12)] font-normal leading-[var(--font-lineheight-16)] tracking-[length:-0.31px] text-[var(--color-text-muted)]';

export const FOOTER_LEGAL_LINKS_CLASS = 'flex items-center gap-[var(--spacing-24)]';

export const FOOTER_LEGAL_LINKS_MOBILE_CLASS =
  'flex items-center justify-center gap-[var(--spacing-10)]';

export const FOOTER_LEGAL_LINK_DESKTOP_CLASS = `${FOOTER_COPYRIGHT_DESKTOP_CLASS} ${FOOTER_LINK_INTERACTION_CLASS}`;

export const FOOTER_LEGAL_LINK_MOBILE_CLASS = `${FOOTER_COPYRIGHT_MOBILE_CLASS} ${FOOTER_LINK_INTERACTION_CLASS}`;

export const FOOTER_MOBILE_INNER_CLASS =
  'flex w-full max-w-[361px] flex-col gap-[var(--spacing-20)]';

/** Figma Frame 8 — two columns space-between across 361px. */
export const FOOTER_MOBILE_NAV_ROW_CLASS = 'flex w-full flex-row items-start justify-between';

export const FOOTER_MOTION_STYLE = {
  transitionDuration: 'var(--motion-duration-default)',
  transitionTimingFunction: 'var(--motion-easing-default)',
} as const;

const ft = ids.component.footer;
const ftMobile = ft.mobile;

export const FOOTER_DESKTOP_COLUMNS = [
  {
    heading: 'Product',
    colTestId: ft.productCol,
    headingTestId: `${ft.productCol}-heading`,
    links: [
      { label: 'Features', href: '#product', linkTestId: `${ft.productCol}-features`, labelTestId: `${ft.productCol}-features-label` },
      { label: 'Pricing', href: '#pricing', linkTestId: `${ft.productCol}-pricing`, labelTestId: `${ft.productCol}-pricing-label` },
      { label: 'How It Works', href: '/how-it-works', linkTestId: `${ft.productCol}-howItWorks`, labelTestId: `${ft.productCol}-howItWorks-label` },
    ],
  },
  {
    heading: 'Company',
    colTestId: ft.companyCol,
    headingTestId: `${ft.companyCol}-heading`,
    links: [
      { label: 'Contact Us', href: '/contact', linkTestId: `${ft.companyCol}-contact`, labelTestId: `${ft.companyCol}-contact-label` },
      { label: 'Blog', href: '#', linkTestId: `${ft.companyCol}-blog`, labelTestId: `${ft.companyCol}-blog-label` },
    ],
  },
] as const;

export const FOOTER_MOBILE_COLUMNS = [
  {
    heading: 'Developers',
    colTestId: `${ftMobile.navCols}-developers`,
    headingTestId: `${ftMobile.navCols}-developers-heading`,
    links: [
      { label: 'Documentation', href: '#', linkTestId: `${ftMobile.navCols}-documentation`, labelTestId: `${ftMobile.navCols}-documentation-label` },
      { label: 'API Reference', href: '#', linkTestId: `${ftMobile.navCols}-apiReference`, labelTestId: `${ftMobile.navCols}-apiReference-label` },
      { label: 'SDKs', href: '#', linkTestId: `${ftMobile.navCols}-sdks`, labelTestId: `${ftMobile.navCols}-sdks-label` },
    ],
  },
  {
    heading: 'Company',
    colTestId: `${ftMobile.navCols}-company`,
    headingTestId: `${ftMobile.navCols}-company-heading`,
    links: [
      { label: 'About', href: '#', linkTestId: `${ftMobile.navCols}-about`, labelTestId: `${ftMobile.navCols}-about-label` },
      { label: 'Blog', href: '#', linkTestId: `${ftMobile.navCols}-blog`, labelTestId: `${ftMobile.navCols}-blog-label` },
      { label: 'Contact', href: '/contact', linkTestId: `${ftMobile.navCols}-contact`, labelTestId: `${ftMobile.navCols}-contact-label` },
    ],
  },
] as const;

export const FOOTER_LEGAL_ITEMS = [
  { label: 'Privacy', href: '#', linkTestId: `${ft.legalLinks}-privacy`, labelTestId: `${ft.legalLinks}-privacy-label` },
  { label: 'Terms', href: '#', linkTestId: `${ft.legalLinks}-terms`, labelTestId: `${ft.legalLinks}-terms-label` },
  { label: 'Security', href: '#', linkTestId: `${ft.legalLinks}-security`, labelTestId: `${ft.legalLinks}-security-label` },
] as const;
