'use client';

import Image from 'next/image';
import { useCallback, useState } from 'react';
import {
  HIW_SIX_WEEK_ACCENT_BAR_CLASS,
  HIW_SIX_WEEK_ACCENT_BAR_FILL_CLASS,
  HIW_SIX_WEEK_BADGE_LABEL_DESKTOP_GREEN_CLASS,
  HIW_SIX_WEEK_BADGE_LABEL_DESKTOP_NAVY_CLASS,
  HIW_SIX_WEEK_BADGE_LABEL_MOBILE_GREEN_CLASS,
  HIW_SIX_WEEK_BADGE_LABEL_MOBILE_NAVY_CLASS,
  HIW_SIX_WEEK_BADGE_SHELL_GREEN_CLASS,
  HIW_SIX_WEEK_BADGE_SHELL_NAVY_CLASS,
  HIW_SIX_WEEK_CARD_BODY_DESKTOP_CLASS,
  HIW_SIX_WEEK_CARD_BODY_MOBILE_CLASS,
  HIW_SIX_WEEK_CARD_CONTENT_DESKTOP_CLASS,
  HIW_SIX_WEEK_CARD_CONTENT_MOBILE_CLASS,
  HIW_SIX_WEEK_CARD_SHELL_CLASS,
  HIW_SIX_WEEK_CARD_TITLE_DESKTOP_CLASS,
  HIW_SIX_WEEK_CARD_TITLE_MOBILE_CLASS,
  HIW_SIX_WEEK_CARDS,
  HIW_SIX_WEEK_HEADLINE,
  HIW_SIX_WEEK_MOBILE_GO_LIVE_ACCENT,
  HIW_SIX_WEEK_MOBILE_SUBCOPY_CLASS,
  HIW_SIX_WEEK_ONBOARDING_PILL_DESKTOP_CLASS,
  HIW_SIX_WEEK_ONBOARDING_PILL_MOBILE_CLASS,
  HIW_SIX_WEEK_PILL_LABEL,
  HIW_SIX_WEEK_PILL_LABEL_DESKTOP_CLASS,
  HIW_SIX_WEEK_PILL_LABEL_MOBILE_CLASS,
  HIW_SIX_WEEK_SUBCOPY,
} from '@/constants/how-it-works.constants';
import {
  beginMotionReveal,
  DEFAULT_MOTION_STYLE,
  getMotionCascadeCardSurfaceStyle,
  getMotionSlideRevealStyle,
} from '@/constants/motion.constants';
import {
  LANDING_SECTION_HEADING_DESKTOP_CLASS,
  LANDING_SECTION_HEADING_MOBILE_CLASS,
  LANDING_SECTION_SUBTITLE_CLASS,
  PROBLEM_TOKENS,
} from '@/constants/landing.constants';
import { runChainedTransitionMotion } from '@/lib/motion-sequence';
import { useOneWayMotion } from '@/lib/use-one-way-motion';
import { ids } from '@/tokens/build/test-ids';
import { HowItWorksDesktopSocialProofStrip } from '@/components/how-it-works/HowItWorksDesktopSocialProofStrip';
import type { SixWeekAccentBarVariant, SixWeekCardConfig } from '@/types/how-it-works.types';

const sixWeek = ids.component.howItWorks.sixWeek;

function SixWeekOnboardingPill({ variant }: { variant: 'desktop' | 'mobile' }) {
  const isMobile = variant === 'mobile';

  return (
    <div
      data-testid={sixWeek.sectionPill}
      className={
        isMobile ? HIW_SIX_WEEK_ONBOARDING_PILL_MOBILE_CLASS : HIW_SIX_WEEK_ONBOARDING_PILL_DESKTOP_CLASS
      }
    >
      <Image
        src="/icons/icon-section-pill-dot.svg"
        alt=""
        width={7}
        height={7}
        aria-hidden="true"
        className="shrink-0"
      />
      <span
        className={
          isMobile ? HIW_SIX_WEEK_PILL_LABEL_MOBILE_CLASS : HIW_SIX_WEEK_PILL_LABEL_DESKTOP_CLASS
        }
      >
        {HIW_SIX_WEEK_PILL_LABEL}
      </span>
    </div>
  );
}

function SixWeekSectionHeader({
  variant,
  headerEmphasized = false,
  motionEngaged = false,
}: {
  variant: 'desktop' | 'mobile';
  headerEmphasized?: boolean;
  motionEngaged?: boolean;
}) {
  const isMobile = variant === 'mobile';
  const motionStyle =
    variant === 'desktop'
      ? getMotionSlideRevealStyle(headerEmphasized, DEFAULT_MOTION_STYLE, {
          engaged: motionEngaged,
          animateOpacity: false,
        })
      : undefined;

  return (
    <div
      data-testid={sixWeek.sectionHeader}
      className="flex w-full flex-col items-center gap-[var(--spacing-16)] text-center"
      style={motionStyle}
    >
      <SixWeekOnboardingPill variant={variant} />
      <div className="flex w-full flex-col items-center gap-[var(--spacing-8)]">
        <h2
          data-testid={sixWeek.heading}
          className={
            isMobile ? LANDING_SECTION_HEADING_MOBILE_CLASS : LANDING_SECTION_HEADING_DESKTOP_CLASS
          }
          style={
            variant === 'desktop'
              ? getMotionSlideRevealStyle(headerEmphasized, DEFAULT_MOTION_STYLE, {
                  engaged: motionEngaged,
                  animateOpacity: false,
                })
              : undefined
          }
        >
          {HIW_SIX_WEEK_HEADLINE}
        </h2>
        <p
          data-testid={sixWeek.subheading}
          className={isMobile ? HIW_SIX_WEEK_MOBILE_SUBCOPY_CLASS : LANDING_SECTION_SUBTITLE_CLASS}
          style={
            variant === 'desktop'
              ? getMotionSlideRevealStyle(headerEmphasized, DEFAULT_MOTION_STYLE, {
                  engaged: motionEngaged,
                  animateOpacity: false,
                })
              : undefined
          }
        >
          {HIW_SIX_WEEK_SUBCOPY}
        </p>
      </div>
    </div>
  );
}

function SixWeekAccentBar({
  accent,
  variant,
}: {
  accent: SixWeekAccentBarVariant;
  variant: 'desktop' | 'mobile';
}) {
  const resolvedAccent =
    variant === 'mobile' && accent === 'teal' ? HIW_SIX_WEEK_MOBILE_GO_LIVE_ACCENT : accent;

  return (
    <span
      aria-hidden="true"
      className={`${HIW_SIX_WEEK_ACCENT_BAR_CLASS} ${HIW_SIX_WEEK_ACCENT_BAR_FILL_CLASS[resolvedAccent]}`}
    />
  );
}

function SixWeekOnboardingCard({
  card,
  variant,
  cardIndex,
  revealedUpTo,
  activeIndex,
  cascadeRunning,
  motionEngaged,
}: {
  card: SixWeekCardConfig;
  variant: 'desktop' | 'mobile';
  cardIndex?: number;
  revealedUpTo?: number;
  activeIndex?: number | null;
  cascadeRunning?: boolean;
  motionEngaged?: boolean;
}) {
  const isMobile = variant === 'mobile';
  const isDesktopMotion = variant === 'desktop' && cardIndex !== undefined;
  const isHighlighted = isDesktopMotion && activeIndex === cardIndex;
  const badgeShellClass =
    card.badgeVariant === 'green'
      ? HIW_SIX_WEEK_BADGE_SHELL_GREEN_CLASS
      : HIW_SIX_WEEK_BADGE_SHELL_NAVY_CLASS;
  const badgeLabelClass =
    card.badgeVariant === 'green'
      ? isMobile
        ? HIW_SIX_WEEK_BADGE_LABEL_MOBILE_GREEN_CLASS
        : HIW_SIX_WEEK_BADGE_LABEL_DESKTOP_GREEN_CLASS
      : isMobile
        ? HIW_SIX_WEEK_BADGE_LABEL_MOBILE_NAVY_CLASS
        : HIW_SIX_WEEK_BADGE_LABEL_DESKTOP_NAVY_CLASS;

  return (
    <article
      data-testid={card.cardTestId}
      className={HIW_SIX_WEEK_CARD_SHELL_CLASS}
      style={
        isDesktopMotion
          ? getMotionCascadeCardSurfaceStyle({
              cardIndex,
              revealedUpTo: revealedUpTo ?? -1,
              activeIndex: activeIndex ?? null,
              cascadeRunning: cascadeRunning ?? false,
              motionEngaged: motionEngaged ?? false,
              isHighlighted,
              shadowToken: PROBLEM_TOKENS.shadowCard,
              baseStyle: DEFAULT_MOTION_STYLE,
            })
          : undefined
      }
    >
      <div
        className={
          isMobile ? HIW_SIX_WEEK_CARD_CONTENT_MOBILE_CLASS : HIW_SIX_WEEK_CARD_CONTENT_DESKTOP_CLASS
        }
      >
        <div className={badgeShellClass}>
          <span className={badgeLabelClass}>{card.weekLabel}</span>
        </div>
        <div className="flex flex-col gap-[var(--spacing-8)]">
          <h3
            className={
              isMobile ? HIW_SIX_WEEK_CARD_TITLE_MOBILE_CLASS : HIW_SIX_WEEK_CARD_TITLE_DESKTOP_CLASS
            }
          >
            {card.title}
          </h3>
          <SixWeekAccentBar accent={card.accentBar} variant={variant} />
          <p
            className={
              isMobile ? HIW_SIX_WEEK_CARD_BODY_MOBILE_CLASS : HIW_SIX_WEEK_CARD_BODY_DESKTOP_CLASS
            }
          >
            {card.body}
          </p>
        </div>
      </div>
    </article>
  );
}

export function HowItWorksSixWeekSection() {
  const [revealedUpTo, setRevealedUpTo] = useState(-1);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [headerEmphasized, setHeaderEmphasized] = useState(false);
  const [cascadeActive, setCascadeActive] = useState(false);
  const [motionEngaged, setMotionEngaged] = useState(false);
  const [socialProofRevealed, setSocialProofRevealed] = useState(false);

  const playSequence = useCallback(
    () =>
      runChainedTransitionMotion(
        [
          () => {
            beginMotionReveal(
              () => {
                setMotionEngaged(true);
                setCascadeActive(true);
                setSocialProofRevealed(false);
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
            setRevealedUpTo(3);
            setActiveIndex(3);
          },
          () => {
            setActiveIndex(null);
            setCascadeActive(false);
            setSocialProofRevealed(true);
          },
        ],
        300,
      ),
    [],
  );

  const triggerMotion = useOneWayMotion(playSequence);

  return (
    <section
      data-testid={sixWeek.root}
      className="flex w-full flex-col items-center gap-[var(--spacing-60)] bg-[var(--color-background-page)]"
    >
      <div
        data-testid={sixWeek.motion.root}
        className="hidden w-full flex-col items-center gap-[var(--spacing-60)] lg:flex"
        onMouseEnter={triggerMotion}
      >
        <div
          data-testid={sixWeek.onboardingSection}
          className="flex w-full flex-col items-center gap-[var(--spacing-40)] bg-[var(--color-background-subtle)] py-[var(--spacing-40)]"
        >
          <div className="flex w-full flex-col items-center gap-[var(--spacing-40)]">
            <SixWeekSectionHeader
              variant="desktop"
              headerEmphasized={headerEmphasized}
              motionEngaged={motionEngaged}
            />
            <div className="flex w-full flex-col items-center gap-[var(--spacing-24)] px-[var(--spacing-16)] sm:px-[var(--spacing-32)] lg:px-[var(--spacing-60)]">
              <Image
                data-testid={sixWeek.timelineTrack}
                src="/icons/icon-timeline-track-desktop.svg"
                alt=""
                width={1316}
                height={14}
                className="h-auto w-full max-w-[1316px]"
                aria-hidden="true"
                style={getMotionSlideRevealStyle(headerEmphasized, DEFAULT_MOTION_STYLE, {
                  engaged: motionEngaged,
                  animateOpacity: false,
                })}
              />
              <div className="flex w-full max-w-[1316px] flex-row flex-wrap justify-center gap-[var(--spacing-20)] lg:flex-nowrap">
                {HIW_SIX_WEEK_CARDS.map((card, index) => (
                  <SixWeekOnboardingCard
                    key={card.cardTestId}
                    card={card}
                    variant="desktop"
                    cardIndex={index}
                    revealedUpTo={revealedUpTo}
                    activeIndex={activeIndex}
                    cascadeRunning={cascadeActive}
                    motionEngaged={motionEngaged}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <HowItWorksDesktopSocialProofStrip
          motionEngaged={motionEngaged}
          socialProofRevealed={socialProofRevealed}
        />
      </div>

      <div
        data-testid={sixWeek.mobile}
        className="flex w-full flex-col items-center px-[var(--spacing-16)] py-[var(--spacing-40)] lg:hidden"
      >
        <div className="flex w-full max-w-[361px] flex-col gap-[var(--spacing-32)]">
          <SixWeekSectionHeader variant="mobile" />
          <div className="flex w-full flex-row items-stretch gap-[var(--spacing-6)]">
            <div className="flex w-[var(--spacing-10)] shrink-0 justify-center">
              <Image
                src="/icons/icon-timeline-progress-mobile.svg"
                alt=""
                width={10}
                height={508}
                className="h-full min-h-full w-[var(--spacing-10)] object-cover"
                aria-hidden="true"
              />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-[var(--spacing-20)]">
              {HIW_SIX_WEEK_CARDS.map((card) => (
                <SixWeekOnboardingCard key={card.cardTestId} card={card} variant="mobile" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
