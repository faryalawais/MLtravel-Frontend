import Link from 'next/link';
import { ids } from '@/tokens/build/test-ids';
import { MobileNavbar } from './MobileNavbar';
import { NavbarCta } from './NavbarCta';

const navLinkClassName =
  'text-body-desktop-sm text-[var(--color-text-primary)] hover:underline focus-visible:outline focus-visible:outline-[length:var(--spacing-3)] focus-visible:outline-offset-[var(--spacing-3)] focus-visible:outline-[var(--color-focus-ring)]';

export function SiteNav() {
  return (
    <>
      <header
        data-testid={ids.component.navbar.root}
        className="hidden min-[1440px]:flex h-[var(--spacing-64)] w-full items-center justify-between bg-[var(--color-background-page)] px-[var(--spacing-40)] py-[var(--spacing-20)]"
      >
        <div
          data-testid={ids.component.navbar.brand}
          className="flex items-center gap-[var(--space-sm)]"
        >
          <span
            data-testid={ids.component.navbar.logoIcon}
            className="hidden"
            aria-hidden="true"
          />
          <span
            data-testid={ids.component.navbar.brandLabel}
            className="text-heading-desktop-h4 text-[var(--color-text-primary)]"
          >
            MaqsoodTravel
          </span>
        </div>

        <nav
          data-testid={ids.component.navbar.navLinks}
          className="flex items-center gap-[var(--spacing-52)]"
          aria-label="Main"
        >
          <Link
            href="#product"
            data-testid={ids.component.navbar.productLink}
            className={navLinkClassName}
          >
            <span data-testid={ids.component.navbar.productLinkLabel}>Product</span>
          </Link>
          <Link
            href="/how-it-works"
            data-testid={ids.component.navbar.howItWorksLink}
            className={navLinkClassName}
          >
            <span data-testid={ids.component.navbar.howItWorksLinkLabel}>
              How It Works
            </span>
          </Link>
          <Link
            href="#pricing"
            data-testid={ids.component.navbar.pricingLink}
            className={navLinkClassName}
          >
            <span data-testid={ids.component.navbar.pricingLinkLabel}>Pricing</span>
          </Link>
        </nav>

        <NavbarCta
          testId={ids.component.navbar.cta}
          labelTestId={ids.component.navbar.ctaLabel}
          iconTestId={ids.component.navbar.ctaIcon}
          graphicTestId={ids.component.navbar.ctaGraphic}
          href="/contact"
          variant="desktop"
        />
      </header>

      <MobileNavbar />
    </>
  );
}
