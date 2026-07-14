'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import {
  MENU_CLOSE_MS,
  MOBILE_NAV_LINKS,
  MOBILE_NAV_LINK_CLASS_NAME,
  MOBILE_NAV_MOTION_TRANSITION,
} from '@/constants/shared.constants';
import { ids } from '@/tokens/build/test-ids';
import { NavbarCta } from './NavbarCta';

export function MobileNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuMounted, setMenuMounted] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const panelId = useId();
  const panelRef = useRef<HTMLElement>(null);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    setMenuVisible(false);
  }, []);

  const toggleMenu = useCallback(() => {
    setMenuOpen((open) => {
      if (open) {
        setMenuVisible(false);
        return false;
      }
      setMenuMounted(true);
      return true;
    });
  }, []);

  useEffect(() => {
    if (!menuMounted || !menuOpen) return;

    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => setMenuVisible(true));
    });
    return () => cancelAnimationFrame(frame);
  }, [menuMounted, menuOpen]);

  useEffect(() => {
    if (menuVisible || !menuMounted) return;

    const panel = panelRef.current;
    const unmount = () => setMenuMounted(false);

    const timer = window.setTimeout(unmount, MENU_CLOSE_MS);
    panel?.addEventListener('transitionend', unmount, { once: true });

    return () => {
      window.clearTimeout(timer);
      panel?.removeEventListener('transitionend', unmount);
    };
  }, [menuVisible, menuMounted]);

  useEffect(() => {
    if (!menuMounted) {
      document.body.style.overflow = '';
      return;
    }

    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenu();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [menuMounted, closeMenu]);

  return (
    <>
      <header
        data-testid={ids.component.navbar.mobile.root}
        className="flex lg:hidden h-[var(--spacing-60)] w-full items-center justify-between bg-[var(--color-background-page)] px-[var(--space-md)] py-[var(--spacing-12)]"
      >
        <div
          data-testid={ids.component.navbar.mobile.leadingCluster}
          className="flex items-center gap-[var(--space-sm)]"
        >
          <div data-testid={ids.component.navbar.mobile.menuCluster}>
            <button
              type="button"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls={panelId}
              onClick={toggleMenu}
              className="inline-flex size-[var(--spacing-24)] shrink-0 items-center justify-center focus-visible:outline focus-visible:outline-[length:var(--spacing-3)] focus-visible:outline-offset-[var(--spacing-3)] focus-visible:outline-[var(--color-focus-ring)]"
            >
              <Image
                src="/icons/icon-menu.svg"
                alt=""
                width={24}
                height={24}
                className="size-[var(--spacing-24)]"
              />
            </button>
          </div>
          <Image
            src="/icons/logo-maqsood-travel.svg"
            alt="MaqsoodTravel"
            width={130}
            height={24}
            priority
            className="h-[var(--spacing-24)] w-auto max-w-[calc(100vw-var(--spacing-64))]"
            style={{ width: 'auto', height: 'auto' }}
          />
        </div>

        <div data-testid={ids.component.navbar.mobile.trailingCluster} aria-hidden="true" />

        <NavbarCta
          testId={ids.component.navbar.mobile.cta}
          labelTestId={ids.component.navbar.mobile.ctaLabel}
          iconTestId={ids.component.navbar.mobile.ctaIcon}
          graphicTestId={ids.component.navbar.mobile.ctaGraphic}
          href="/contact"
          variant="mobile"
        />
      </header>

      {menuMounted ? (
        <div
          className={`fixed inset-0 z-50 lg:hidden ${menuVisible ? '' : 'pointer-events-none'}`}
          role="presentation"
        >
          <button
            type="button"
            aria-label="Close menu"
            tabIndex={menuVisible ? 0 : -1}
            className={[
              'absolute inset-0 bg-[var(--color-neutral-900)] transition-opacity',
              MOBILE_NAV_MOTION_TRANSITION,
              menuVisible ? 'opacity-40' : 'opacity-0',
            ].join(' ')}
            onClick={closeMenu}
          />
          <nav
            ref={panelRef}
            id={panelId}
            data-testid={ids.component.navbar.navLinks}
            data-motion-duration="motion.duration.default"
            aria-label="Main"
            aria-hidden={!menuVisible}
            className={[
              'absolute left-0 top-0 flex h-full w-[min(100%,calc(var(--spacing-64)*5))] flex-col bg-[var(--color-background-page)] px-[var(--space-md)] pb-[var(--spacing-40)] pt-[var(--spacing-60)] shadow-[var(--shadow-md)] transition-transform will-change-transform',
              MOBILE_NAV_MOTION_TRANSITION,
              menuVisible ? 'translate-x-0' : '-translate-x-full',
            ].join(' ')}
          >
            {MOBILE_NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                data-testid={item.linkTestId}
                className={MOBILE_NAV_LINK_CLASS_NAME}
                tabIndex={menuVisible ? 0 : -1}
                onClick={closeMenu}
              >
                <span data-testid={item.labelTestId}>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </>
  );
}
