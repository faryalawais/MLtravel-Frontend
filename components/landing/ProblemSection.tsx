'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import {
  CARD_SHELL_DEFAULT,
  CARD_SHELL_HIGHLIGHT,
  CARD_SHELL_HOVER,
  DESKTOP_CARDS,
  MOBILE_CARDS,
  PROBLEM_CARD_BASE_CLASS,
  PROBLEM_MOTION_STYLE,
  PROBLEM_TOKENS,
} from '@/constants/landing.constants';
import { ids } from '@/tokens/build/test-ids';
import type {
  AccentBarProps,
  CardIconProps,
  GradientBarProps,
  ProblemCardDesktopProps,
  ProblemCardMobileProps,
  SectionPillProps,
} from '@/types/landing.types';

const problem = ids.component.landing.problem;

/** Reads a duration token from `:root` (e.g. `motion.duration.stepDelay`). */
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

function SectionPill({ pillTestId, labelTestId, variant = 'desktop' }: SectionPillProps) {
  const isMobile = variant === 'mobile';

  return (
    <div
      data-testid={pillTestId}
      className={
        isMobile
          ? 'inline-flex items-center justify-center gap-[var(--spacing-6)] rounded-[var(--radius-pill)] border border-[var(--color-pill-problem-border)] bg-[color-mix(in_srgb,var(--color-pill-problem-background)_8%,transparent)] px-[var(--spacing-12)] py-[var(--spacing-8)]'
          : 'inline-flex items-center justify-center gap-[var(--spacing-8)] rounded-[var(--radius-pill)] border border-[var(--color-pill-problem-border)] bg-[color-mix(in_srgb,var(--color-pill-problem-background)_8%,transparent)] px-[var(--spacing-16)] py-[var(--spacing-8)]'
      }
    >
      <span
        aria-hidden="true"
        className="size-[var(--spacing-6)] shrink-0 rounded-full bg-[var(--color-pill-problem-background)]"
      />
      <span
        data-testid={labelTestId}
        className="text-label-desktop-md-tag text-[var(--color-pill-problem-text)]"
      >
        The Problem
      </span>
    </div>
  );
}

function AccentBar({
  testId,
  isHighlighted = false,
  cascadeRunning = false,
}: AccentBarProps) {
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

function CardIcon({
  iconTestId,
  graphicTestId,
  iconSrc,
  isHighlighted,
  cascadeRunning = false,
}: CardIconProps) {
  const hoverRing =
    'group-hover/card:size-[var(--spacing-52)] group-hover/card:shadow-[0_0_0_var(--spacing-3)_var(--color-border-warning)]';
  return (
    <div
      data-testid={iconTestId}
      className={[
        'flex shrink-0 items-center justify-center rounded-[var(--radius-6)]',
        'transition-[width,height,box-shadow] duration-[var(--motion-duration-default)] ease-in',
        isHighlighted
          ? 'size-[var(--spacing-52)] shadow-[0_0_0_var(--spacing-3)_var(--color-border-warning)]'
          : `size-[var(--spacing-32)] shadow-none${cascadeRunning ? '' : ` ${hoverRing}`}`,
      ].join(' ')}
    >
      <Image
        data-testid={graphicTestId}
        src={iconSrc}
        alt=""
        width={32}
        height={32}
        className="size-[var(--spacing-32)] shrink-0"
        aria-hidden="true"
      />
    </div>
  );
}

const cardBaseClass = PROBLEM_CARD_BASE_CLASS;

function ProblemCardDesktop({
  card,
  isHighlighted,
  cascadeRunning,
}: ProblemCardDesktopProps) {
  return (
    <article
      data-testid={card.cardTestId}
      data-motion-duration="motion.duration.default"
      className={[
        'group/card',
        cardBaseClass,
        'w-full max-w-[424px] flex-1 gap-[var(--spacing-24)] border px-[var(--spacing-28)] py-[var(--spacing-40)]',
        'transition-[border-color,box-shadow,transform] duration-[var(--motion-duration-default)] ease-in',
        isHighlighted ? CARD_SHELL_HIGHLIGHT : CARD_SHELL_DEFAULT,
        cascadeRunning ? '' : CARD_SHELL_HOVER,
      ].join(' ')}
      style={getCardSurfaceStyle(isHighlighted)}
    >
      <CardIcon
        iconTestId={card.iconTestId}
        graphicTestId={card.graphicTestId}
        iconSrc={card.iconSrc}
        isHighlighted={isHighlighted}
        cascadeRunning={cascadeRunning}
      />
      <div
        data-testid={card.textBlockTestId}
        className="flex flex-col gap-[var(--spacing-8)]"
      >
        <h3
          data-testid={card.headingTestId}
          className="text-heading-desktop-h4 text-[var(--color-text-primary)]"
        >
          {card.heading}
        </h3>
        <AccentBar
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
      </div>
    </article>
  );
}

function ProblemCardMobile({ card }: ProblemCardMobileProps) {
  return (
    <article
      data-testid={card.cardTestId}
      className={`${cardBaseClass} w-full gap-[var(--spacing-16)] border border-[var(--color-border-default)] p-[var(--spacing-20)]`}
    >
      <div data-testid={card.iconTestId} className="flex items-center">
        <Image
          data-testid={card.graphicTestId}
          src={card.iconSrc}
          alt=""
          width={32}
          height={32}
          className="size-[var(--spacing-32)] shrink-0"
          aria-hidden="true"
        />
      </div>
      <div className="flex flex-col gap-[var(--spacing-8)]">
        <h3
          data-testid={card.headingTestId}
          className="text-heading-desktop-h4 text-[var(--color-text-primary)]"
        >
          {card.heading}
        </h3>
        {card.accentBarTestId ? <AccentBar testId={card.accentBarTestId} /> : null}
        <p
          data-testid={card.bodyTestId}
          className="text-body-desktop-sm text-[var(--color-text-secondary)]"
        >
          {card.body}
        </p>
      </div>
    </article>
  );
}

function GradientBar({ testId }: GradientBarProps) {
  return (
    <span
      {...(testId ? { 'data-testid': testId } : {})}
      aria-hidden="true"
      className="h-[var(--spacing-4)] w-[calc(var(--spacing-64)+var(--spacing-32))] rounded-full"
      style={{ background: PROBLEM_TOKENS.gradientBarBg }}
    />
  );
}

function ProblemCtaDesktop() {
  return (
    <div data-testid={problem.cta} className="flex flex-col items-center gap-[var(--spacing-12)]">
      <div
        data-testid={problem.ctaText}
        className="flex flex-row flex-wrap items-center justify-center gap-[var(--spacing-6)] text-center"
      >
        <span
          data-testid={problem.ctaLine1}
          className="whitespace-nowrap text-label-desktop-nav-link text-[var(--color-text-primary)]"
        >
          The model is broken on purpose.
        </span>
        <span
          data-testid={problem.ctaLine2}
          className="whitespace-nowrap text-label-desktop-lg text-[var(--color-text-brand-navy)]"
        >
          We built the alternative.
        </span>
      </div>
      <GradientBar testId={problem.gradientBar} />
    </div>
  );
}

function ProblemCtaMobile() {
  return (
    <div className="flex flex-col items-center gap-[var(--spacing-12)] text-center">
      <div className="flex flex-row flex-wrap items-center justify-center gap-[var(--spacing-6)]">
        <span
          data-testid={problem.mobile.ctaLine1}
          className="whitespace-nowrap text-label-desktop-md-tag text-[var(--color-text-primary)]"
        >
          The model is broken on purpose.
        </span>
        <span
          data-testid={problem.mobile.ctaLine2}
          className="whitespace-nowrap text-label-desktop-lg text-[var(--color-text-brand-navy)]"
        >
          We built the alternative.
        </span>
      </div>
      <GradientBar />
    </div>
  );
}

function ProblemCardsDesktop() {
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
    timersRef.current.push(
      setTimeout(() => setSequenceIndex(null), motionDuration),
    );
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
      data-testid={problem.cardsGrid}
      className="flex w-full flex-wrap items-stretch justify-center gap-[var(--spacing-20)]"
      onMouseEnter={playSequence}
    >
      {DESKTOP_CARDS.map((card, index) => (
        <ProblemCardDesktop
          key={card.cardTestId}
          card={card}
          isHighlighted={sequenceIndex === index}
          cascadeRunning={cascadeActive}
        />
      ))}
    </div>
  );
}

export function ProblemSection() {
  return (
    <section
      id="product"
      data-testid={problem.root}
      aria-label="The Problem"
      className="bg-[var(--color-background-page)]"
    >
      {/* Desktop — Figma 5164:6561 */}
      <div className="hidden min-[1440px]:block">
        <div
          data-testid={problem.outerFrame}
          className="flex justify-center px-[var(--spacing-64)] py-[var(--spacing-40)]"
        >
          <div
            data-testid={problem.innerFrame}
            className="flex w-full max-w-[1312px] flex-col items-center gap-[var(--spacing-40)]"
          >
            <div
              data-testid={problem.headerWrap}
              className="flex w-full max-w-[900px] flex-col items-center"
            >
              <div
                data-testid={problem.sectionHeader}
                className="flex flex-col items-center gap-[var(--spacing-16)] text-center"
              >
                <SectionPill
                  pillTestId={problem.sectionPill}
                  labelTestId={problem.sectionPillLabel}
                />
                <div
                  data-testid={problem.headingBlock}
                  className="flex flex-col items-center gap-[var(--spacing-8)]"
                >
                  <h2
                    data-testid={problem.sectionHeading}
                    className="text-heading-desktop-h1 text-[var(--color-text-primary)]"
                  >
                    The industry charges you
                    <br />
                    for every move you make.
                  </h2>
                  <p
                    data-testid={problem.sectionSubtitle}
                    className="text-body-desktop-md text-[var(--color-text-secondary)]"
                  >
                    The travel industry runs on a broken model. Your agency is paying the price.
                  </p>
                </div>
              </div>
            </div>

            <ProblemCardsDesktop />

            <ProblemCtaDesktop />
          </div>
        </div>
      </div>

      {/* Mobile — Figma 5164:6571 */}
      <div
        data-testid={problem.mobile.root}
        className="flex flex-col gap-[var(--spacing-32)] px-[var(--spacing-16)] py-[var(--spacing-28)] min-[1440px]:hidden"
      >
        <div
          data-testid={problem.mobile.headerContainer}
          className="flex flex-col items-center gap-[var(--spacing-8)] text-center"
        >
          <SectionPill
            pillTestId={problem.mobile.sectionPill}
            labelTestId={problem.mobile.sectionPillLabel}
            variant="mobile"
          />
          <div
            data-testid={problem.mobile.headingBlock}
            className="flex flex-col items-center gap-[var(--spacing-8)]"
          >
            <h2
              data-testid={problem.mobile.sectionHeading}
              className="text-display-mobile-lg text-[var(--color-text-primary)]"
            >
              The industry charges you for every move you make.
            </h2>
            <p
              data-testid={problem.mobile.sectionSubtitle}
              className="text-body-desktop-md text-[var(--color-text-secondary)]"
            >
              The travel industry runs on outdated infrastructure that holds you back
            </p>
          </div>
        </div>

        <div
          data-testid={problem.mobile.cardsContainer}
          className="flex flex-col gap-[var(--spacing-16)]"
        >
          {MOBILE_CARDS.map((card) => (
            <ProblemCardMobile key={card.cardTestId} card={card} />
          ))}
        </div>

        <ProblemCtaMobile />
      </div>
    </section>
  );
}
