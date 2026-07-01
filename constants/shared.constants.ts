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
