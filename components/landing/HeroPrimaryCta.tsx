'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

type HeroPrimaryCtaProps = {
  testId: string;
  labelTestId: string;
  iconTestId: string;
  graphicTestId: string;
  href: string;
  className?: string;
};

export function HeroPrimaryCta({
  testId,
  labelTestId,
  iconTestId,
  graphicTestId,
  href,
  className = '',
}: HeroPrimaryCtaProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={href}
      data-testid={testId}
      data-motion-duration="motion.duration.default"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={[
        'inline-flex items-center justify-center gap-[var(--spacing-6)] rounded-[var(--radius-6)] px-[var(--spacing-32)] py-[var(--spacing-12)] text-label-desktop-lg transition-[background-color,color] focus-visible:outline focus-visible:outline-[length:var(--spacing-3)] focus-visible:outline-offset-[var(--spacing-3)] focus-visible:outline-[var(--color-focus-ring)]',
        className,
      ].join(' ')}
      style={{
        transitionDuration: 'var(--motion-duration-default)',
        transitionTimingFunction: 'var(--motion-easing-default)',
        backgroundColor: hovered
          ? 'var(--color-action-primary-hover-background)'
          : 'var(--color-action-primary-default-background)',
        color: 'var(--color-action-primary-default-label)',
      }}
    >
      <span data-testid={labelTestId}>Book A Demo</span>
      <span data-testid={iconTestId} className="inline-flex shrink-0" aria-hidden="true">
        <Image
          data-testid={graphicTestId}
          src="/icons/icon-plane-arrow-white.svg"
          alt=""
          width={20}
          height={20}
          className="size-[var(--spacing-20)]"
        />
      </span>
    </Link>
  );
}
