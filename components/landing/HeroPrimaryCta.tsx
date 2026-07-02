'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { HERO_TOKENS } from '@/constants/landing.constants';
import type { HeroPrimaryCtaProps } from '@/types/landing.types';

export function HeroPrimaryCta({
  testId,
  labelTestId,
  iconTestId,
  graphicTestId,
  href,
  label = 'Book A Demo',
  className = '',
  emphasized,
  useHeroEasing = false,
}: HeroPrimaryCtaProps) {
  const [localHovered, setLocalHovered] = useState(false);
  const isActive = emphasized ?? localHovered;

  return (
    <Link
      href={href}
      data-testid={testId}
      data-motion-duration="motion.duration.default"
      onMouseEnter={() => {
        if (emphasized === undefined) {
          setLocalHovered(true);
        }
      }}
      className={[
        'inline-flex items-center justify-center gap-[var(--spacing-6)] rounded-[var(--radius-6)] px-[var(--spacing-32)] py-[var(--spacing-12)] text-label-desktop-lg transition-[background-color,color] focus-visible:outline focus-visible:outline-[length:var(--spacing-3)] focus-visible:outline-offset-[var(--spacing-3)] focus-visible:outline-[var(--color-focus-ring)]',
        className,
      ].join(' ')}
      style={{
        transitionDuration: HERO_TOKENS.motionDurationDefault,
        transitionTimingFunction: useHeroEasing
          ? HERO_TOKENS.motionEasingHero
          : 'var(--motion-easing-default)',
        backgroundColor: isActive
          ? 'var(--color-action-primary-hover-background)'
          : 'var(--color-action-primary-default-background)',
        color: 'var(--color-action-primary-default-label)',
      }}
    >
      <span data-testid={labelTestId}>{label}</span>
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
