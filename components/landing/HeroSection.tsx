'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useRef, useState } from 'react';
import {
  DESKTOP_STATS,
  LOGO_PARTNERS,
  MOBILE_STATS,
} from '@/constants/landing.constants';
import {
  HIW_HERO_DEMO_CTA_LABEL,
  HIW_HERO_HEADLINE,
  HIW_HERO_PROOF_LINE,
  HIW_HERO_SUBCOPY,
} from '@/constants/how-it-works.constants';
import {
  getHeroColumnMotionStyle,
  getHeroCtaTerminalOffsetPx,
  HERO_MOTION_COPY_CLUSTER_MIN_HEIGHT_PX,
  HERO_MOTION_CTA_CLUSTER_HEIGHT_PX,
  HERO_MOTION_CTA_PARTIAL_OFFSET_PX,
  HERO_MOTION_TEXT_COLUMN_HEIGHT_PX,
  type HeroMotionStep,
} from '@/constants/motion.constants';
import { runHeroMotion } from '@/lib/motion-sequence';
import { useOneWayMotion } from '@/lib/use-one-way-motion';
import { ids } from '@/tokens/build/test-ids';
import type { HeroOptionalClassNameProps, HeroSectionProps } from '@/types/landing.types';
import { HeroPrimaryCta } from './HeroPrimaryCta';

function HeroHeadingDesktop({ layout = 'default' }: { layout?: 'default' | 'hiw-page' }) {
  if (layout === 'hiw-page') {
    return (
      <h1
        data-testid={ids.component.landing.hero.heading}
        className="text-display-desktop-lg text-[var(--color-text-primary)]"
      >
        {HIW_HERO_HEADLINE}
      </h1>
    );
  }

  return (
    <h1
      data-testid={ids.component.landing.hero.heading}
      className="text-display-desktop-lg text-[var(--color-text-primary)]"
    >
      Why sell under someone else&apos;s name when you can{' '}
      <span className="text-[var(--color-text-brand-navy)]">Build your Own Travel system</span>
    </h1>
  );
}

function HeroHeadingMobile({ layout = 'default' }: { layout?: 'default' | 'hiw-page' }) {
  if (layout === 'hiw-page') {
    return (
      <h1
        data-testid={ids.component.landing.hero.heading}
        className="text-display-mobile-lg text-[var(--color-text-primary)]"
      >
        {HIW_HERO_HEADLINE}
      </h1>
    );
  }

  return (
    <h1
      data-testid={ids.component.landing.hero.heading}
      className="text-display-mobile-lg text-[var(--color-text-primary)]"
    >
      Why sell under someone else&apos;s name when you can{' '}
      <span className="text-[var(--color-text-brand-navy)]">build your own Travel system</span>
    </h1>
  );
}

function HeroSubheading({
  layout = 'default',
  variant = 'desktop',
}: {
  layout?: 'default' | 'hiw-page';
  variant?: 'desktop' | 'mobile';
}) {
  const typeClass =
    variant === 'mobile' ? 'text-body-mobile-md' : 'text-body-desktop-md';

  if (layout === 'hiw-page') {
    return (
      <p
        data-testid={ids.component.landing.hero.subheading}
        className={`${typeClass} text-[var(--color-text-secondary)]`}
      >
        {HIW_HERO_SUBCOPY}
      </p>
    );
  }

  return (
    <p
      data-testid={ids.component.landing.hero.subheading}
      className={`${typeClass} text-[var(--color-text-primary)]`}
    >
      MaqsoodTravel gives IATA-certified travel agencies a fully branded booking platform.
      Multi-source search across Sabre, Amadeus and Travelport, zero per-booking fees, and
      complete ownership of your inventory. Your agents. Your clients. Your system.
    </p>
  );
}

function HeroSecondaryCta({ variant = 'desktop' }: { variant?: 'desktop' | 'mobile' }) {
  const typeClass =
    variant === 'mobile' ? 'text-label-mobile-lg' : 'text-label-desktop-lg';

  return (
    <Link
      href="#pricing"
      data-testid={ids.component.landing.hero.secondaryCta}
      className={`inline-flex items-center justify-center gap-[var(--spacing-8)] rounded-[var(--radius-6)] border border-[var(--color-border-brand-navy)] bg-[var(--color-background-page)] px-[var(--spacing-28)] py-[var(--spacing-12)] ${typeClass} text-[var(--color-action-secondary-default-label)] transition-colors hover:bg-[var(--color-action-secondary-hover-background)] hover:text-[var(--color-action-secondary-hover-label)] focus-visible:outline focus-visible:outline-[length:var(--spacing-3)] focus-visible:outline-offset-[var(--spacing-3)] focus-visible:outline-[var(--color-focus-ring)]`}
    >
      <span data-testid={ids.component.landing.hero.secondaryCtaLabel}>View Pricing</span>
      <Image
        src="/icons/icon-play-navy.svg"
        alt=""
        width={20}
        height={20}
        className="size-[var(--spacing-20)] shrink-0"
        aria-hidden="true"
      />
    </Link>
  );
}

function HeroProofLine({
  className = '',
  layout = 'default',
  variant = 'desktop',
}: HeroOptionalClassNameProps & {
  layout?: 'default' | 'hiw-page';
  variant?: 'desktop' | 'mobile';
}) {
  const copy =
    layout === 'hiw-page'
      ? HIW_HERO_PROOF_LINE
      : 'Agencies save an average of $1,200/month in platform fee within their first month of going live.';
  const typeClass =
    variant === 'mobile' ? 'text-body-mobile-xs' : 'text-body-desktop-xs';

  return (
    <p
      data-testid={ids.component.landing.hero.proofLine}
      className={`${typeClass} text-[var(--color-text-muted)] ${className}`}
    >
      {copy}
    </p>
  );
}

function HeroProductImage({ className = '' }: HeroOptionalClassNameProps) {
  return (
    <div
      data-testid={ids.component.landing.hero.productImage}
      className={`relative overflow-hidden rounded-[var(--radius-20)] bg-[var(--color-surface-muted)] ${className}`}
    >
      <Image
        src="/images/hero-product.png"
        alt="MaqsoodTravel booking platform product screenshot"
        width={536}
        height={400}
        className="h-full w-full object-cover"
        priority
      />
    </div>
  );
}

function StatBar() {
  return (
    <span
      aria-hidden="true"
      className="h-[var(--spacing-4)] w-[var(--spacing-32)] rounded-full bg-[var(--color-action-primary-default-background)]"
    />
  );
}

function HeroStatsDesktop() {
  return (
    <div
      data-testid={ids.component.landing.hero.statsStrip}
      className="grid grid-cols-4 divide-x divide-[var(--color-border-default)] border-y border-[var(--color-border-default)] bg-[var(--color-background-surface)] px-[var(--spacing-180)] py-[var(--spacing-24)]"
    >
      {DESKTOP_STATS.map((stat) => (
        <div
          key={stat.testId}
          data-testid={stat.testId}
          className="flex flex-col items-center justify-center gap-[var(--spacing-12)] px-[var(--spacing-12)] text-center"
        >
          <div className="flex flex-col items-center gap-[var(--spacing-6)]">
            <span className="text-display-desktop-stat text-[var(--color-text-brand-navy)]">
              {stat.value}
            </span>
            <StatBar />
          </div>
          <div className="flex flex-col items-center gap-[var(--spacing-4)]">
            <span className="text-label-desktop-md-stat uppercase text-[var(--color-text-primary)]">
              {stat.label}
            </span>
            <span className="text-body-desktop-xs text-[var(--color-text-secondary)]">
              {stat.caption}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function HeroStatsMobile() {
  return (
    <div
      data-testid={ids.component.landing.hero.statsStrip}
      className="grid grid-cols-2 gap-x-[var(--spacing-16)] gap-y-[var(--spacing-24)] border-y border-[var(--color-border-default)] bg-[var(--color-background-surface)] px-[var(--spacing-16)] py-[var(--spacing-24)]"
    >
      {MOBILE_STATS.map((stat) => (
        <div
          key={stat.testId}
          data-testid={stat.testId}
          className="flex flex-col items-center justify-center gap-[var(--spacing-8)] text-center"
        >
          <div className="flex flex-col items-center gap-[var(--spacing-6)]">
            <span className="text-display-mobile-stat text-[var(--color-text-brand-navy)]">
              {stat.value}
            </span>
            <StatBar />
          </div>
          <span className="text-label-mobile-md-stat uppercase text-[var(--color-text-primary)]">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function HeroLogosStrip() {
  return (
    <div
      data-testid={ids.component.landing.hero.logosStrip}
      className="border-y border-[var(--color-border-default)] bg-[var(--color-background-surface)]"
    >
      <div className="overflow-x-auto px-[var(--spacing-16)] py-[var(--spacing-20)] min-[1440px]:px-[var(--spacing-64)] min-[1440px]:py-[var(--spacing-30)]">
        <div className="mx-auto flex w-max items-center justify-center gap-[var(--spacing-12)] min-[1440px]:gap-[var(--spacing-32)]">
          {LOGO_PARTNERS.map((name, index) => (
            <div
              key={name}
              className="flex shrink-0 items-center gap-[var(--spacing-12)] min-[1440px]:gap-[var(--spacing-32)]"
            >
              {index > 0 ? (
                <span
                  aria-hidden="true"
                  className="h-[var(--font-lineheight-22)] w-px shrink-0 bg-[var(--color-border-default)]"
                />
              ) : null}
              <span className="text-label-mobile-lg text-[var(--color-text-muted)] min-[1440px]:text-heading-desktop-h4">
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HeroDesktopMotion() {
  const hero = ids.component.landing.hero;
  const textBlockRef = useRef<HTMLDivElement>(null);
  const textColumnRef = useRef<HTMLDivElement>(null);
  const [motionEngaged, setMotionEngaged] = useState(false);
  const [motionStep, setMotionStep] = useState<HeroMotionStep>(0);
  const [ctaTerminalOffsetPx, setCtaTerminalOffsetPx] = useState(
    HERO_MOTION_CTA_PARTIAL_OFFSET_PX,
  );
  const [clusterMinHeightPx, setClusterMinHeightPx] = useState(
    HERO_MOTION_COPY_CLUSTER_MIN_HEIGHT_PX,
  );

  const playMotion = useCallback(() => {
    const textHeight =
      textColumnRef.current?.offsetHeight ?? HERO_MOTION_TEXT_COLUMN_HEIGHT_PX;
    const terminalOffset = getHeroCtaTerminalOffsetPx(textHeight);
    const clusterHeight = textBlockRef.current?.offsetHeight ?? clusterMinHeightPx;

    setCtaTerminalOffsetPx(terminalOffset);
    setClusterMinHeightPx(
      Math.max(clusterHeight, terminalOffset + HERO_MOTION_CTA_CLUSTER_HEIGHT_PX),
    );
    setMotionEngaged(true);
    setMotionStep(0);
    return runHeroMotion(
      () => setMotionStep(1),
      () => setMotionStep(2),
    );
  }, []);

  const triggerMotion = useOneWayMotion(playMotion);

  return (
    <div
      data-testid={hero.motion.root}
      className="hidden min-[1440px]:flex min-[1440px]:flex-col"
      onMouseEnter={triggerMotion}
    >
      <div
        data-testid={hero.heroTop}
        className="flex items-start justify-between px-[var(--spacing-64)] pt-[var(--spacing-44)]"
      >
        <div
          ref={textBlockRef}
          data-testid={hero.textBlock}
          className={`relative w-[645px] max-w-full shrink-0 ${motionEngaged ? 'overflow-hidden' : ''}`}
          style={
            motionEngaged ? { minHeight: `${clusterMinHeightPx}px` } : undefined
          }
        >
          {motionEngaged ? (
            <>
              <div
                data-testid={hero.motion.textColumn}
                className="absolute left-0 top-0 z-10 w-full"
                style={getHeroColumnMotionStyle(motionEngaged, motionStep, 'text')}
              >
                <div
                  data-testid={hero.headingGroup}
                  className="flex flex-col gap-[var(--spacing-8)]"
                >
                  <HeroHeadingDesktop />
                  <HeroSubheading />
                </div>
              </div>
              <div
                data-testid={hero.motion.ctaColumn}
                className="absolute left-0 top-0 z-0 w-full"
                style={getHeroColumnMotionStyle(motionEngaged, motionStep, 'cta', {
                  ctaTerminalOffsetPx,
                })}
              >
                <div data-testid={hero.ctaGroup} className="flex flex-col gap-[var(--spacing-12)]">
                  <div
                    data-testid={hero.ctaRow}
                    className="flex flex-wrap items-center gap-[var(--spacing-20)]"
                  >
                    <HeroPrimaryCta
                      testId={hero.cta}
                      labelTestId={hero.ctaLabel}
                      iconTestId={hero.ctaIcon}
                      graphicTestId={hero.ctaGraphic}
                      href="/contact"
                      emphasized={motionStep >= 2}
                      useHeroEasing
                    />
                    <HeroSecondaryCta />
                  </div>
                  <HeroProofLine />
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-[var(--spacing-24)]">
              <div ref={textColumnRef} data-testid={hero.motion.textColumn}>
                <div
                  data-testid={hero.headingGroup}
                  className="flex flex-col gap-[var(--spacing-8)]"
                >
                  <HeroHeadingDesktop />
                  <HeroSubheading />
                </div>
              </div>
              <div data-testid={hero.motion.ctaColumn}>
                <div data-testid={hero.ctaGroup} className="flex flex-col gap-[var(--spacing-12)]">
                  <div
                    data-testid={hero.ctaRow}
                    className="flex flex-wrap items-center gap-[var(--spacing-20)]"
                  >
                    <HeroPrimaryCta
                      testId={hero.cta}
                      labelTestId={hero.ctaLabel}
                      iconTestId={hero.ctaIcon}
                      graphicTestId={hero.ctaGraphic}
                      href="/contact"
                    />
                    <HeroSecondaryCta />
                  </div>
                  <HeroProofLine />
                </div>
              </div>
            </div>
          )}
        </div>
        <HeroProductImage className="h-[400px] w-[536px] shrink-0" />
      </div>
      <div data-testid={hero.bottomFrame} className="flex flex-col">
        <HeroStatsDesktop />
        <HeroLogosStrip />
      </div>
    </div>
  );
}

export function HeroSection({ layout = 'default' }: HeroSectionProps) {
  const hero = ids.component.landing.hero;
  const isHiwPage = layout === 'hiw-page';
  const primaryCtaLabel = isHiwPage ? HIW_HERO_DEMO_CTA_LABEL : undefined;

  return (
    <section
      data-testid={hero.root}
      data-layout={layout}
      aria-label="Hero"
      className={`bg-[var(--color-background-page)] ${isHiwPage ? 'lg:hidden' : ''}`}
    >
      {!isHiwPage ? <HeroDesktopMotion /> : null}

      {/* Mobile — Figma 5164:7080 or HIW 5217:7073 */}
      <div
        data-testid={hero.mobile.root}
        className={`flex flex-col ${isHiwPage ? 'lg:hidden' : 'min-[1440px]:hidden'}`}
      >
        <div
          data-testid={hero.mobile.banner}
          className="flex flex-col items-center gap-[var(--spacing-16)] px-[var(--spacing-16)] py-[var(--spacing-24)]"
        >
          <div className="flex w-full flex-col gap-[var(--spacing-20)]">
            <div
              data-testid={hero.headingGroup}
              className="flex flex-col gap-[var(--spacing-8)]"
            >
              <HeroHeadingMobile layout={layout} />
              <HeroSubheading layout={layout} variant="mobile" />
            </div>
            <div data-testid={hero.ctaGroup} className="flex flex-col gap-[var(--spacing-12)]">
              <div
                data-testid={hero.ctaRow}
                className={`flex flex-col gap-[var(--spacing-12)] ${isHiwPage ? '' : 'sm:flex-row sm:flex-wrap'}`}
              >
                <HeroPrimaryCta
                  testId={hero.mobile.cta}
                  labelTestId={hero.ctaLabel}
                  iconTestId={hero.ctaIcon}
                  graphicTestId={hero.ctaGraphic}
                  href="/contact"
                  label={primaryCtaLabel}
                  typography="mobile"
                  className="w-full justify-center sm:w-auto"
                />
                {isHiwPage ? null : <HeroSecondaryCta variant="mobile" />}
              </div>
              <HeroProofLine layout={layout} variant="mobile" />
            </div>
          </div>
          {isHiwPage ? null : (
            <HeroProductImage className="aspect-[536/400] w-full max-w-[361px]" />
          )}
        </div>
        <div data-testid={hero.bottomFrame}>
          <HeroStatsMobile />
          {isHiwPage ? null : <HeroLogosStrip />}
        </div>
      </div>
    </section>
  );
}
