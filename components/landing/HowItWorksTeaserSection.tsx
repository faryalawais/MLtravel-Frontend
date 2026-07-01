'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import {
  HIW_DESKTOP_CARDS,
  HIW_MOBILE_CARDS,
  HIW_SECTION_SUBTITLE,
  PROBLEM_CARD_BASE_CLASS,
  PROBLEM_MOTION_STYLE,
  PROBLEM_TOKENS,
} from '@/constants/landing.constants';
import { ids } from '@/tokens/build/test-ids';
import type {
  HiwCardAccent,
  HiwCardConfig,
  HiwCardDesktopProps,
  HiwCardMobileProps,
  HiwSectionPillProps,
} from '@/types/landing.types';

const hiw = ids.component.landing.howItWorksTeaser;

const ACCENT_TEXT: Record<HiwCardAccent, string> = {
  navy: 'text-[var(--color-text-brand-navy)]',
  orange: 'text-[var(--color-text-brand-orange)]',
  teal: 'text-[var(--color-text-brand-teal)]',
};

const ACCENT_STEP_BG: Record<HiwCardAccent, string> = {
  navy: 'bg-[color-mix(in_srgb,var(--color-text-brand-navy)_8%,transparent)]',
  orange: 'bg-[color-mix(in_srgb,var(--color-text-brand-orange)_8%,transparent)]',
  teal: 'bg-[color-mix(in_srgb,var(--color-text-brand-teal)_8%,transparent)]',
};

const ACCENT_BORDER: Record<HiwCardAccent, string> = {
  navy: 'border-[var(--color-border-brand-navy)]',
  orange: 'border-[var(--color-border-brand-orange)]',
  teal: 'border-[var(--color-border-brand-teal)]',
};

function getDurationTokenMs(cssVarName: string): number {
  if (typeof window === 'undefined') return 120;
  const raw = getComputedStyle(document.documentElement).getPropertyValue(cssVarName).trim();
  const parsed = Number.parseInt(raw, 10);
  return Number.isNaN(parsed) ? 120 : parsed;
}

function getCardSurfaceStyle(isHighlighted: boolean): CSSProperties {
  return {
    ...PROBLEM_MOTION_STYLE,
    transitionProperty: 'border-color, box-shadow, transform',
    boxShadow: isHighlighted ? PROBLEM_TOKENS.shadowCard : 'none',
    transform: isHighlighted ? 'translateY(calc(var(--spacing-4) * -1))' : 'translateY(0)',
  };
}

const ACCENT_HOVER_SHELL: Record<HiwCardAccent, string> = {
  navy: 'hover:border-[var(--color-border-brand-navy)] hover:shadow-[var(--shadow-card)] hover:-translate-y-[var(--spacing-4)]',
  orange:
    'hover:border-[var(--color-border-brand-orange)] hover:shadow-[var(--shadow-card)] hover:-translate-y-[var(--spacing-4)]',
  teal: 'hover:border-[var(--color-border-brand-teal)] hover:shadow-[var(--shadow-card)] hover:-translate-y-[var(--spacing-4)]',
};

function getCardShellClass(accent: HiwCardAccent, isHighlighted: boolean, cascadeRunning: boolean): string {
  if (isHighlighted) {
    return `${ACCENT_BORDER[accent]} shadow-[var(--shadow-card)] -translate-y-[var(--spacing-4)]`;
  }
  if (cascadeRunning) {
    return 'border-[var(--color-border-default)]';
  }
  return `border-[var(--color-border-default)] ${ACCENT_HOVER_SHELL[accent]}`;
}

function HiwSectionPill({ pillTestId, labelTestId, variant = 'desktop' }: HiwSectionPillProps) {
  const isMobile = variant === 'mobile';

  return (
    <div
      data-testid={pillTestId}
      className={
        isMobile
          ? 'inline-flex items-center justify-center gap-[var(--spacing-6)] rounded-[var(--radius-pill)] border border-[var(--color-pill-solution-border)] bg-[color-mix(in_srgb,var(--color-pill-solution-background)_8%,transparent)] px-[var(--spacing-12)] py-[var(--spacing-8)]'
          : 'inline-flex items-center justify-center gap-[var(--spacing-8)] rounded-[var(--radius-pill)] border border-[var(--color-pill-solution-border)] bg-[color-mix(in_srgb,var(--color-pill-solution-background)_8%,transparent)] px-[var(--spacing-16)] py-[var(--spacing-8)]'
      }
    >
      <span
        aria-hidden="true"
        className="size-[var(--spacing-6)] shrink-0 rounded-full bg-[var(--color-pill-solution-background)]"
      />
      <span
        data-testid={labelTestId}
        className={
          isMobile
            ? 'text-label-mobile-micro-tag text-[var(--color-pill-solution-text)]'
            : 'text-label-desktop-md-tag text-[var(--color-pill-solution-text)]'
        }
      >
        How It Works
      </span>
    </div>
  );
}

function HiwAccentBar({
  testId,
  isHighlighted = false,
  cascadeRunning = false,
}: {
  testId: string;
  isHighlighted?: boolean;
  cascadeRunning?: boolean;
}) {
  const hoverAccent =
    'group-hover/card:bg-[linear-gradient(to_right,var(--color-text-brand-navy),color-mix(in_srgb,var(--color-text-brand-navy)_55%,var(--color-text-brand-orange)))]';

  return (
    <span
      data-testid={testId}
      aria-hidden="true"
      className={[
        'h-[var(--spacing-4)] w-[var(--spacing-64)] rounded-full',
        'transition-[background] duration-[var(--motion-duration-default)] ease-in',
        isHighlighted
          ? 'bg-[linear-gradient(to_right,var(--color-text-brand-navy),color-mix(in_srgb,var(--color-text-brand-navy)_55%,var(--color-text-brand-orange)))]'
          : `bg-[var(--color-action-primary-default-background)]${cascadeRunning ? '' : ` ${hoverAccent}`}`,
      ].join(' ')}
    />
  );
}

function CardVisualImage({ card }: { card: HiwCardConfig }) {
  return (
    <Image
      data-testid={card.cardVisualTestId}
      src={card.visualImageSrc}
      alt=""
      width={424}
      height={184}
      className="h-auto w-full"
      aria-hidden="true"
    />
  );
}

function HiwCardContent({
  card,
  isHighlighted = false,
  cascadeRunning = false,
}: {
  card: HiwCardConfig;
  isHighlighted?: boolean;
  cascadeRunning?: boolean;
}) {
  return (
    <div
      data-testid={card.cardContentTestId}
      className="flex flex-col gap-[var(--spacing-16)] bg-[var(--color-background-surface)] px-[var(--spacing-28)] py-[var(--spacing-32)]"
    >
      <div
        data-testid={card.stepBadgeTestId}
        className={`inline-flex w-fit items-center rounded-[var(--radius-6)] px-[var(--spacing-8)] py-[var(--spacing-4)] ${ACCENT_STEP_BG[card.accent]}`}
      >
        <span
          data-testid={card.stepLabelTestId}
          className={`text-label-desktop-micro-tag uppercase ${ACCENT_TEXT[card.accent]}`}
        >
          {card.stepLabel}
        </span>
      </div>
      <div data-testid={card.mainBlockTestId} className="flex flex-col gap-[var(--spacing-8)]">
        <h3
          data-testid={card.headingTestId}
          className="text-heading-desktop-h4 text-[var(--color-text-primary)]"
        >
          {card.heading}
        </h3>
        <HiwAccentBar
          testId={card.accentBarTestId}
          isHighlighted={isHighlighted}
          cascadeRunning={cascadeRunning}
        />
        <p
          data-testid={card.bodyTestId}
          className="text-body-desktop-sm text-[var(--color-text-secondary)]"
        >
          {card.body}
        </p>
        <p
          data-testid={card.taglineTestId}
          className={`text-body-desktop-sm font-semibold ${ACCENT_TEXT[card.accent]}`}
        >
          {card.tagline}
        </p>
      </div>
    </div>
  );
}

function HiwCardDesktop({ card, isHighlighted, cascadeRunning }: HiwCardDesktopProps) {
  return (
    <article
      data-testid={card.cardTestId}
      data-motion-duration="motion.duration.default"
      className={[
        'group/card',
        PROBLEM_CARD_BASE_CLASS,
        'w-full max-w-[424px] flex-1 overflow-hidden border bg-[var(--color-background-surface)]',
        'transition-[border-color,box-shadow,transform] duration-[var(--motion-duration-default)] ease-in',
        getCardShellClass(card.accent, isHighlighted, cascadeRunning),
      ].join(' ')}
      style={getCardSurfaceStyle(isHighlighted)}
    >
      <CardVisualImage card={card} />
      <HiwCardContent card={card} isHighlighted={isHighlighted} cascadeRunning={cascadeRunning} />
    </article>
  );
}

function HiwCardMobile({ card }: HiwCardMobileProps) {
  return (
    <article
      data-testid={card.stackTestId}
      className={`${PROBLEM_CARD_BASE_CLASS} w-full overflow-hidden border border-[var(--color-border-default)] bg-[var(--color-background-surface)]`}
    >
      <CardVisualImage card={card} />
      <HiwCardContent card={card} />
    </article>
  );
}

function HiwFooterLink() {
  return (
    <div data-testid={hiw.footerNote} className="flex w-full justify-center text-center">
      <Link
        href="/how-it-works"
        data-testid={hiw.textBlock21}
        className="inline-flex flex-wrap items-center justify-center gap-[var(--spacing-6)] text-body-desktop-sm transition-colors focus-visible:outline focus-visible:outline-[length:var(--spacing-3)] focus-visible:outline-offset-[var(--spacing-3)] focus-visible:outline-[var(--color-focus-ring)]"
      >
        <span className="text-[var(--color-text-secondary)]">How does the technical setup work?</span>
        <span className="inline-flex items-center gap-[var(--spacing-6)] font-semibold text-[var(--color-text-brand-navy)]">
          Read the full breakdown →
          <Image
            src="/icons/icon-button-arrow.svg"
            alt=""
            width={16}
            height={16}
            className="size-[var(--spacing-16)] shrink-0"
            aria-hidden="true"
          />
        </span>
      </Link>
    </div>
  );
}

function HiwCardsDesktop() {
  const [sequenceIndex, setSequenceIndex] = useState<number | null>(null);
  const [cascadeActive, setCascadeActive] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const hasPlayedRef = useRef(false);
  const cascadeActiveRef = useRef(false);

  const clearSequence = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const endCascade = useCallback(() => {
    cascadeActiveRef.current = false;
    setCascadeActive(false);
    const motionDuration = getDurationTokenMs('--motion-duration-default');
    timersRef.current.push(setTimeout(() => setSequenceIndex(null), motionDuration));
  }, []);

  const playSequence = useCallback(() => {
    if (hasPlayedRef.current) return;

    hasPlayedRef.current = true;
    clearSequence();
    const stepDelay = getDurationTokenMs(PROBLEM_TOKENS.motionStepDelayVar);

    cascadeActiveRef.current = true;
    setCascadeActive(true);
    setSequenceIndex(0);

    timersRef.current.push(
      setTimeout(() => setSequenceIndex(1), stepDelay),
      setTimeout(() => {
        setSequenceIndex(2);
        endCascade();
      }, stepDelay * 2),
    );
  }, [clearSequence, endCascade]);

  useEffect(() => () => clearSequence(), [clearSequence]);

  return (
    <div
      data-testid={hiw.cardsWrap}
      className="flex w-full flex-wrap items-stretch justify-center gap-[var(--spacing-20)]"
      onMouseEnter={playSequence}
    >
      {HIW_DESKTOP_CARDS.map((card, index) => (
        <HiwCardDesktop
          key={card.cardTestId}
          card={card}
          isHighlighted={sequenceIndex === index}
          cascadeRunning={cascadeActive}
        />
      ))}
    </div>
  );
}

export function HowItWorksTeaserSection() {
  return (
    <section
      data-testid={hiw.root}
      aria-label="How It Works"
      className="bg-[var(--color-background-page)]"
    >
      {/* Desktop — Figma 5164:6567 */}
      <div className="hidden min-[1440px]:block">
        <div className="flex justify-center px-[var(--spacing-64)] py-[var(--spacing-40)]">
          <div
            data-testid={hiw.frame2095585115}
            className="flex w-full max-w-[1312px] flex-col items-center gap-[var(--spacing-40)]"
          >
            <div
              data-testid={hiw.sectionHeader}
              className="flex w-full max-w-[725px] flex-col items-center gap-[var(--spacing-16)] text-center"
            >
              <HiwSectionPill pillTestId={hiw.sectionPill} labelTestId={hiw.sectionRoot} />
              <div data-testid={hiw.headingBlock} className="flex flex-col items-center gap-[var(--spacing-8)]">
                <h2
                  data-testid={hiw.textBlock}
                  className="text-heading-desktop-h2 text-[var(--color-text-primary)]"
                >
                  From contract to booking in{' '}
                  <span className="text-[var(--color-text-brand-navy)]">three steps.</span>
                </h2>
                <p
                  data-testid={hiw.textBlock2}
                  className="text-body-desktop-md text-[var(--color-text-secondary)]"
                >
                  {HIW_SECTION_SUBTITLE}
                </p>
              </div>
            </div>

            <HiwCardsDesktop />
          </div>
        </div>
      </div>

      {/* Mobile — Figma 5164:6690 */}
      <div
        data-testid={hiw.mobile.sectionRoot}
        className="flex flex-col gap-[var(--spacing-24)] px-[var(--spacing-16)] py-[var(--spacing-28)] min-[1440px]:hidden"
      >
        <div
          data-testid={hiw.mobile.frame1561553974}
          className="flex flex-col gap-[var(--spacing-24)]"
        >
          <div
            data-testid={hiw.mobile.frame1561553973}
            className="flex flex-col items-center gap-[var(--spacing-8)] text-center"
          >
            <div data-testid={hiw.mobile.container} className="flex flex-col items-center gap-[var(--spacing-8)]">
              <HiwSectionPill
                pillTestId={hiw.mobile.sectionPill}
                labelTestId={hiw.mobile.sectionRoot2}
                variant="mobile"
              />
              <div data-testid={hiw.mobile.heading} className="flex flex-col items-center gap-[var(--spacing-8)]">
                <h2
                  data-testid={hiw.mobile.textBlock}
                  className="text-heading-mobile-h2 text-[var(--color-text-primary)]"
                >
                  From contract to booking in{' '}
                  <span className="text-[var(--color-text-brand-navy)]">three steps.</span>
                </h2>
                <p
                  data-testid={hiw.mobile.paragraph}
                  className="text-body-desktop-md text-[var(--color-text-secondary)]"
                >
                  {HIW_SECTION_SUBTITLE}
                </p>
              </div>
            </div>
          </div>

          <div data-testid={hiw.mobile.container2} className="flex flex-col gap-[var(--spacing-16)]">
            <div data-testid={hiw.mobile.container3} className="flex flex-col gap-[var(--spacing-16)]">
              {HIW_MOBILE_CARDS.map((card) => (
                <HiwCardMobile key={card.stackTestId} card={card} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center px-[var(--spacing-16)] pb-[var(--spacing-28)] min-[1440px]:px-[var(--spacing-64)] min-[1440px]:pb-[var(--spacing-40)]">
        <HiwFooterLink />
      </div>
    </section>
  );
}
