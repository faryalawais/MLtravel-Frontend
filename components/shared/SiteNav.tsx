import Link from 'next/link';
import { NAV_LINK_CLASS_NAME, SITE_NAV_LINKS } from '@/constants/shared.constants';
import { ids } from '@/tokens/build/test-ids';
import { MobileNavbar } from './MobileNavbar';
import { NavbarCta } from './NavbarCta';

export function SiteNav() {
  return (
    <>
      <header
        data-testid={ids.component.navbar.root}
        className="hidden lg:flex h-[var(--spacing-64)] w-full items-center justify-between bg-[var(--color-background-page)] px-[var(--spacing-40)] py-[var(--spacing-20)]"
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
          {SITE_NAV_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              data-testid={item.linkTestId}
              className={NAV_LINK_CLASS_NAME}
            >
              <span data-testid={item.labelTestId}>{item.label}</span>
            </Link>
          ))}
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
