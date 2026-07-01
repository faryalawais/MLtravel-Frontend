'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ids } from '@/tokens/build/test-ids';
import { HeroPrimaryCta } from './HeroPrimaryCta';

const DESKTOP_STATS = [
  {
    testId: ids.component.landing.hero.stat1,
    value: '$1,200/mo',
    label: 'SAVED IN FEES',
    caption: 'Multiple Clients',
  },
  {
    testId: ids.component.landing.hero.stat2,
    value: '40%',
    label: 'FASTER PER BOOKING',
    caption: 'Post-migration measure',
  },
  {
    testId: ids.component.landing.hero.stat3,
    value: '6 Weeks',
    label: 'TO GO LIVE',
    caption: 'Dedicated Onboarding',
  },
  {
    testId: ids.component.landing.hero.stat4,
    value: '500+',
    label: 'AIRLINES CONNECTED',
    caption: 'Global inventory',
  },
] as const;

const MOBILE_STATS = [
  { testId: ids.component.landing.hero.stat1, value: '$3,000/mo', label: 'SAVED IN FEES' },
  { testId: ids.component.landing.hero.stat2, value: '40%', label: 'FASTER PER BOOKING' },
  { testId: ids.component.landing.hero.stat3, value: '6 Weeks', label: 'TO GO LIVE' },
  { testId: ids.component.landing.hero.stat4, value: '500+', label: 'AIRLINES CONNECTED' },
] as const;

const LOGO_PARTNERS = [
  'Sabre',
  'Amadeus',
  'Travelport',
  'IATA NDC',
  'Turkish Airlines',
  'Emirates',
  'British Airways',
  'Qatar Airways',
  'Etihad',
] as const;

function HeroHeadingDesktop() {
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

function HeroHeadingMobile() {
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

function HeroSubheading() {
  return (
    <p
      data-testid={ids.component.landing.hero.subheading}
      className="text-body-desktop-md text-[var(--color-text-secondary)]"
    >
      MaqsoodTravel gives IATA-certified travel agencies a fully branded booking platform.
      Multi-source search across Sabre, Amadeus and Travelport, zero per-booking fees, and
      complete ownership of your inventory. Your agents. Your clients. Your system.
    </p>
  );
}

function HeroSecondaryCta() {
  return (
    <Link
      href="#pricing"
      data-testid={ids.component.landing.hero.secondaryCta}
      className="inline-flex items-center justify-center gap-[var(--spacing-8)] rounded-[var(--radius-6)] border border-[var(--color-border-brand-navy)] bg-[var(--color-background-page)] px-[var(--spacing-28)] py-[var(--spacing-12)] text-label-desktop-lg text-[var(--color-action-secondary-default-label)] transition-colors hover:bg-[var(--color-action-secondary-hover-background)] hover:text-[var(--color-action-secondary-hover-label)] focus-visible:outline focus-visible:outline-[length:var(--spacing-3)] focus-visible:outline-offset-[var(--spacing-3)] focus-visible:outline-[var(--color-focus-ring)]"
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

function HeroProofLine({ className = '' }: { className?: string }) {
  return (
    <p
      data-testid={ids.component.landing.hero.proofLine}
      className={`text-body-desktop-xs text-[var(--color-text-secondary)] ${className}`}
    >
      Agencies save an average of $1,200/month in platform fee within their first month of going
      live.
    </p>
  );
}

function HeroProductImage({ className = '' }: { className?: string }) {
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
      className="flex items-stretch justify-between border-y border-[var(--color-border-default)] bg-[var(--color-background-surface)] px-[var(--spacing-180)] py-[var(--spacing-24)]"
    >
      {DESKTOP_STATS.map((stat, index) => (
        <div key={stat.testId} className="flex items-center gap-[var(--spacing-24)]">
          {index > 0 ? (
            <span
              aria-hidden="true"
              className="self-stretch w-px bg-[var(--color-border-default)]"
            />
          ) : null}
          <div
            data-testid={stat.testId}
            className="flex flex-1 flex-col items-center gap-[var(--spacing-12)] text-center"
          >
            <div className="flex flex-col items-center gap-[var(--spacing-6)]">
              <span className="text-display-desktop-stat text-[var(--color-text-primary)]">
                {stat.value}
              </span>
              <StatBar />
            </div>
            <div className="flex flex-col gap-[var(--spacing-4)]">
              <span className="text-label-desktop-md-stat uppercase text-[var(--color-text-primary)]">
                {stat.label}
              </span>
              <span className="text-body-desktop-xs text-[var(--color-text-secondary)]">
                {stat.caption}
              </span>
            </div>
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
          className="flex flex-col items-center gap-[var(--spacing-8)] text-center"
        >
          <div className="flex flex-col items-center gap-[var(--spacing-6)]">
            <span className="text-display-mobile-stat text-[var(--color-text-primary)]">
              {stat.value}
            </span>
            <StatBar />
          </div>
          <span className="text-label-desktop-md-stat uppercase text-[var(--color-text-primary)]">
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
          <div key={name} className="flex shrink-0 items-center gap-[var(--spacing-12)] min-[1440px]:gap-[var(--spacing-32)]">
            {index > 0 ? (
              <span
                aria-hidden="true"
                className="h-[var(--font-lineheight-22)] w-px shrink-0 bg-[var(--color-border-default)]"
              />
            ) : null}
            <span className="text-label-desktop-nav-link font-bold text-[var(--color-text-muted)] min-[1440px]:text-heading-desktop-h4 min-[1440px]:font-bold">
              {name}
            </span>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
}

export function HeroSection() {
  const hero = ids.component.landing.hero;

  return (
    <section
      data-testid={hero.root}
      aria-label="Hero"
      className="bg-[var(--color-background-page)]"
    >
      {/* Desktop — Figma 5164:6560 */}
      <div className="hidden min-[1440px]:flex min-[1440px]:flex-col">
        <div
          data-testid={hero.heroTop}
          className="flex items-start justify-between px-[var(--spacing-64)] pt-[var(--spacing-44)]"
        >
          <div
            data-testid={hero.textBlock}
            className="flex max-w-[645px] flex-col gap-[var(--spacing-24)]"
          >
            <div
              data-testid={hero.headingGroup}
              className="flex flex-col gap-[var(--spacing-8)]"
            >
              <HeroHeadingDesktop />
              <HeroSubheading />
            </div>
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
          <HeroProductImage className="h-[400px] w-[536px] shrink-0" />
        </div>
        <div data-testid={hero.bottomFrame} className="flex flex-col">
          <HeroStatsDesktop />
          <HeroLogosStrip />
        </div>
      </div>

      {/* Mobile — Figma 5164:7080 */}
      <div
        data-testid={hero.mobile.root}
        className="flex flex-col min-[1440px]:hidden"
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
              <HeroHeadingMobile />
              <HeroSubheading />
            </div>
            <div data-testid={hero.ctaGroup} className="flex flex-col gap-[var(--spacing-12)]">
              <div
                data-testid={hero.ctaRow}
                className="flex flex-col gap-[var(--spacing-12)] sm:flex-row sm:flex-wrap"
              >
                <HeroPrimaryCta
                  testId={hero.mobile.cta}
                  labelTestId={hero.ctaLabel}
                  iconTestId={hero.ctaIcon}
                  graphicTestId={hero.ctaGraphic}
                  href="/contact"
                  className="w-full justify-center sm:w-auto"
                />
                <HeroSecondaryCta />
              </div>
              <HeroProofLine />
            </div>
          </div>
          <HeroProductImage className="aspect-[536/400] w-full max-w-[361px]" />
        </div>
        <div data-testid={hero.bottomFrame}>
          <HeroStatsMobile />
          <HeroLogosStrip />
        </div>
      </div>
    </section>
  );
}
