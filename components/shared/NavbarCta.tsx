'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

type NavbarCtaProps = {
  testId: string;
  labelTestId: string;
  iconTestId: string;
  graphicTestId: string;
  href: string;
  variant: 'desktop' | 'mobile';
};

export function NavbarCta({
  testId,
  labelTestId,
  iconTestId,
  graphicTestId,
  href,
  variant,
}: NavbarCtaProps) {
  const [hovered, setHovered] = useState(false);

  const isDesktop = variant === 'desktop';

  return (
    <Link
      href={href}
      data-testid={testId}
      data-motion-duration="motion.duration.default"
      onMouseEnter={() => setHovered(true)}
      className={[
        'inline-flex items-center justify-center rounded-[var(--radius-6)] text-label-desktop-lg transition-[background-color,color,padding] focus-visible:outline focus-visible:outline-[length:var(--spacing-3)] focus-visible:outline-offset-[var(--spacing-3)] focus-visible:outline-[var(--color-focus-ring)]',
        isDesktop
          ? hovered
            ? 'px-[var(--spacing-28)] py-[var(--spacing-12)]'
            : 'px-[var(--spacing-20)] py-[var(--spacing-10)]'
          : hovered
            ? 'px-[var(--spacing-20)] py-[var(--spacing-10)]'
            : 'px-[var(--spacing-12)] py-[var(--spacing-6)]',
      ].join(' ')}
      style={{
        transitionDuration: 'var(--motion-duration-default)',
        transitionTimingFunction: 'var(--motion-easing-default)',
        backgroundColor: hovered
          ? 'var(--color-action-secondary-active-background)'
          : 'var(--color-action-secondary-hover-background)',
        color: 'var(--color-action-secondary-hover-label)',
      }}
    >
      <span data-testid={labelTestId}>Book A Demo</span>
      {/* Icon/Button is visible:false in Figma — kept for anatomy + testids only */}
      <span data-testid={iconTestId} className="hidden" aria-hidden="true">
        <Image
          data-testid={graphicTestId}
          src="/icons/icon-button-arrow.svg"
          alt=""
          width={16}
          height={16}
          className="size-[var(--spacing-16)]"
        />
      </span>
    </Link>
  );
}
