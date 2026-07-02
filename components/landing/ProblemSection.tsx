'use client';

import Image from 'next/image';
import { useCallback, useState, type CSSProperties } from 'react';
import {
  CARD_SHELL_DEFAULT,
  CARD_SHELL_HIGHLIGHT,
  CARD_SHELL_HOVER,
  DESKTOP_CARDS,
  MOBILE_CARDS,
  PROBLEM_CARD_BODY_CLASS,
  PROBLEM_CARD_BODY_MOBILE_CLASS,
  PROBLEM_CARD_TITLE_DESKTOP_CLASS,
  PROBLEM_CARD_TITLE_MOBILE_CLASS,
  PROBLEM_SECTION_PILL_LABEL_DESKTOP_CLASS,
  PROBLEM_SECTION_PILL_LABEL_MOBILE_CLASS,
  LANDING_SECTION_HEADING_DESKTOP_CLASS,
  LANDING_SECTION_HEADING_MOBILE_CLASS,
  LANDING_SECTION_SUBTITLE_CLASS,
  PROBLEM_CARD_BASE_CLASS,
  PROBLEM_MOTION_STYLE,
  PROBLEM_TOKENS,
} from '@/constants/landing.constants';
import {
  beginMotionReveal,
  getMotionCascadeCardSurfaceStyle,
  getMotionCascadeTextStyle,
  getMotionSlideRevealStyle,
  MOTION_DELAY_STEP,
  MOTION_TRANSITION_PROPERTIES,
} from '@/constants/motion.constants';
import { runRapidFourStepMotion } from '@/lib/motion-sequence';
import { useOneWayMotion } from '@/lib/use-one-way-motion';
import { ids } from '@/tokens/build/test-ids';
import type {
  AccentBarProps,
  CardIconProps,
  GradientBarProps,
  ProblemCardDesktopProps,
  ProblemCardMobileProps,
  ProblemCtaDesktopProps,
  SectionPillProps,
} from '@/types/landing.types';

const problem = ids.component.landing.problem;

function getCardSurfaceStyle(
  cardIndex: number,
  revealedUpTo: number,
  activeIndex: number | null,
  cascadeRunning: boolean,
  motionEngaged: boolean,
  isHighlighted: boolean,
): CSSProperties {
  return getMotionCascadeCardSurfaceStyle({
    cardIndex,
    revealedUpTo,
    activeIndex,
    cascadeRunning,
    motionEngaged,
    isHighlighted,
    shadowToken: PROBLEM_TOKENS.shadowCard,
    baseStyle: PROBLEM_MOTION_STYLE,
  });
}

function getCardChromeTransitionStyle(): CSSProperties {
  return {
    ...PROBLEM_MOTION_STYLE,
    transitionProperty: MOTION_TRANSITION_PROPERTIES,
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
        className={
          isMobile ? PROBLEM_SECTION_PILL_LABEL_MOBILE_CLASS : PROBLEM_SECTION_PILL_LABEL_DESKTOP_CLASS
        }
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
        isHighlighted
          ? 'bg-[linear-gradient(to_right,var(--color-text-brand-navy),color-mix(in_srgb,var(--color-text-brand-navy)_55%,var(--color-text-brand-orange)))]'
          : `bg-[var(--color-action-primary-default-background)]${cascadeRunning ? '' : ` ${hoverAccent}`}`,
      ].join(' ')}
      style={getCardChromeTransitionStyle()}
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
        isHighlighted
          ? 'size-[var(--spacing-52)] shadow-[0_0_0_var(--spacing-3)_var(--color-border-warning)]'
          : `size-[var(--spacing-32)] shadow-none${cascadeRunning ? '' : ` ${hoverRing}`}`,
      ].join(' ')}
      style={getCardChromeTransitionStyle()}
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
  cardIndex,
  revealedUpTo,
  activeIndex,
  isHighlighted,
  cascadeRunning,
  motionEngaged,
}: ProblemCardDesktopProps) {
  return (
    <article
      data-testid={card.cardTestId}
      data-motion-duration="motion.duration.default"
      className={[
        'group/card',
        cardBaseClass,
        'w-full max-w-[424px] flex-1 gap-[var(--spacing-24)] border px-[var(--spacing-28)] py-[var(--spacing-40)]',
        isHighlighted ? CARD_SHELL_HIGHLIGHT : CARD_SHELL_DEFAULT,
        cascadeRunning || motionEngaged ? '' : CARD_SHELL_HOVER,
      ].join(' ')}
      style={getCardSurfaceStyle(
        cardIndex,
        revealedUpTo,
        activeIndex,
        cascadeRunning,
        motionEngaged,
        isHighlighted,
      )}
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
        style={getMotionCascadeTextStyle(
          isHighlighted,
          cascadeRunning,
          motionEngaged,
          PROBLEM_MOTION_STYLE,
        )}
      >
        <h3
          data-testid={card.headingTestId}
          className={PROBLEM_CARD_TITLE_DESKTOP_CLASS}
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
          className={PROBLEM_CARD_BODY_CLASS}
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
          className={PROBLEM_CARD_TITLE_MOBILE_CLASS}
        >
          {card.heading}
        </h3>
        {card.accentBarTestId ? <AccentBar testId={card.accentBarTestId} /> : null}
        <p
          data-testid={card.bodyTestId}
          className={PROBLEM_CARD_BODY_MOBILE_CLASS}
        >
          {card.body}
        </p>
      </div>
    </article>
  );
}

function GradientBar({ testId, isEmphasized = false }: GradientBarProps) {
  return (
    <span
      {...(testId ? { 'data-testid': testId } : {})}
      aria-hidden="true"
      className="h-[var(--spacing-4)] rounded-full"
      style={{
        ...PROBLEM_MOTION_STYLE,
        transitionProperty: 'opacity, transform, width',
        width: isEmphasized
          ? 'calc(var(--spacing-64) + var(--spacing-32))'
          : 'var(--spacing-64)',
        opacity: isEmphasized ? 1 : 0.45,
        transform: isEmphasized ? 'scaleX(1)' : 'scaleX(0.75)',
        transformOrigin: 'center',
        background: PROBLEM_TOKENS.gradientBarBg,
      }}
    />
  );
}

function ProblemCtaDesktop({ isEmphasized = false, motionEngaged = false }: ProblemCtaDesktopProps) {
  return (
    <div
      data-testid={problem.cta}
      className="flex flex-col items-center gap-[var(--spacing-12)]"
      style={getMotionSlideRevealStyle(isEmphasized, PROBLEM_MOTION_STYLE, {
        engaged: motionEngaged,
        animateOpacity: false,
        liftWhenRevealed: true,
      })}
    >
      <div
        data-testid={problem.ctaText}
        className="flex flex-row flex-wrap items-center justify-center gap-[var(--spacing-6)] text-center"
        style={getMotionSlideRevealStyle(isEmphasized, PROBLEM_MOTION_STYLE, {
          engaged: motionEngaged,
          animateOpacity: false,
          liftWhenRevealed: true,
        })}
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
      <GradientBar testId={problem.gradientBar} isEmphasized={isEmphasized} />
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

function ProblemDesktopContent() {
  const [revealedUpTo, setRevealedUpTo] = useState(-1);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [headerEmphasized, setHeaderEmphasized] = useState(false);
  const [ctaEmphasized, setCtaEmphasized] = useState(false);
  const [cascadeActive, setCascadeActive] = useState(false);
  const [motionEngaged, setMotionEngaged] = useState(false);

  const playSequence = useCallback(
    () =>
      runRapidFourStepMotion([
        () => {
          beginMotionReveal(
            () => {
              setMotionEngaged(true);
              setCascadeActive(true);
              setRevealedUpTo(-1);
              setActiveIndex(null);
            },
            () => {
              setHeaderEmphasized(true);
              setRevealedUpTo(0);
              setActiveIndex(0);
            },
          );
        },
        () => {
          setRevealedUpTo(1);
          setActiveIndex(1);
        },
        () => {
          setRevealedUpTo(2);
          setActiveIndex(2);
        },
        () => {
          setActiveIndex(null);
          setCascadeActive(false);
          setCtaEmphasized(true);
        },
      ]),
    [],
  );

  const triggerMotion = useOneWayMotion(playSequence);

  return (
    <div
      data-testid={problem.motion.root}
      data-motion-duration="motion.duration.default"
      className="flex justify-center px-[var(--spacing-64)] py-[var(--spacing-40)]"
      onMouseEnter={triggerMotion}
    >
      <div
        data-testid={problem.outerFrame}
        className="flex w-full max-w-[1312px] flex-col items-center gap-[var(--spacing-40)]"
      >
        <div
          data-testid={problem.innerFrame}
          className="flex w-full flex-col items-center gap-[var(--spacing-40)]"
        >
            <div
              data-testid={problem.headerWrap}
              className="flex w-full max-w-[900px] flex-col items-center"
              style={getMotionSlideRevealStyle(headerEmphasized, PROBLEM_MOTION_STYLE, {
                engaged: motionEngaged,
                animateOpacity: false,
              })}
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
                  style={getMotionSlideRevealStyle(headerEmphasized, PROBLEM_MOTION_STYLE, {
                    engaged: motionEngaged,
                    animateOpacity: false,
                  })}
                >
                  <h2
                    data-testid={problem.sectionHeading}
                    className={LANDING_SECTION_HEADING_DESKTOP_CLASS}
                    style={getMotionSlideRevealStyle(headerEmphasized, PROBLEM_MOTION_STYLE, {
                      engaged: motionEngaged,
                      animateOpacity: false,
                    })}
                  >
                    The industry charges you
                    <br />
                    for every move you make.
                  </h2>
                  <p
                    data-testid={problem.sectionSubtitle}
                    className={LANDING_SECTION_SUBTITLE_CLASS}
                    style={getMotionSlideRevealStyle(headerEmphasized, PROBLEM_MOTION_STYLE, {
                      engaged: motionEngaged,
                      animateOpacity: false,
                      transitionDelay: MOTION_DELAY_STEP,
                    })}
                  >
                    The travel industry runs on a broken model. Your agency is paying the price.
                  </p>
                </div>
              </div>
            </div>

          <div
            data-testid={problem.cardsGrid}
            className="flex w-full flex-wrap items-stretch justify-center gap-[var(--spacing-20)]"
          >
            {DESKTOP_CARDS.map((card, index) => (
              <ProblemCardDesktop
                key={card.cardTestId}
                card={card}
                cardIndex={index}
                revealedUpTo={revealedUpTo}
                activeIndex={activeIndex}
                isHighlighted={activeIndex === index}
                cascadeRunning={cascadeActive}
                motionEngaged={motionEngaged}
              />
            ))}
          </div>

          <ProblemCtaDesktop isEmphasized={ctaEmphasized} motionEngaged={motionEngaged} />
        </div>
      </div>
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
        <ProblemDesktopContent />
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
              className={LANDING_SECTION_HEADING_MOBILE_CLASS}
            >
              The industry charges you for every move you make.
            </h2>
            <p
              data-testid={problem.mobile.sectionSubtitle}
              className={LANDING_SECTION_SUBTITLE_CLASS}
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
