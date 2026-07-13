'use client';

import Image from 'next/image';
import { useCallback, useState, type CSSProperties } from 'react';
import {
  FEATURE_GRID_ACCENT_BAR_CLASS,
  FEATURE_GRID_BADGE_LABEL_CLASS,
  FEATURE_GRID_BADGE_LABEL_MOBILE_CLASS,
  FEATURE_GRID_CTA_LABEL,
  FEATURE_GRID_DESKTOP_CARDS,
  FEATURE_GRID_DESKTOP_FRAME_CLASS,
  FEATURE_GRID_HEADING_LINE1,
  FEATURE_GRID_HEADING_LINE2,
  FEATURE_GRID_MOBILE_BODY_CLASS,
  FEATURE_GRID_MOBILE_CARDS,
  FEATURE_GRID_PLANE_BOTTOM_CLASS,
  LANDING_SECTION_HEADING_ACCENT_CLASS,
  LANDING_SECTION_HEADING_DESKTOP_CLASS,
  LANDING_SECTION_HEADING_MOBILE_CLASS,
  LANDING_SECTION_PILL_LABEL_DESKTOP_CLASS,
  LANDING_SECTION_PILL_LABEL_MOBILE_CLASS,
  LANDING_SECTION_SUBTITLE_CLASS,
  LANDING_SECTION_SUBTITLE_MOBILE_CLASS,
  FEATURE_GRID_PLANE_TOP_CLASS,
  FEATURE_GRID_SUBTITLE,
  FEATURE_GRID_TAGLINE,
  PROBLEM_CARD_BASE_CLASS,
  PROBLEM_MOTION_STYLE,
  PROBLEM_TOKENS,
} from '@/constants/landing.constants';
import {
  beginMotionReveal,
  getFeatureGridCardSurfaceStyle,
  getFeatureGridContentMotionStyle,
  getMotionCascadeTextStyle,
  getMotionSlideRevealStyle,
  MOTION_DELAY_AUTO_ADVANCE,
  MOTION_TRANSITION_PROPERTIES,
  type FeatureGridMotionStep,
} from '@/constants/motion.constants';
import { HeroPrimaryCta } from '@/components/landing/HeroPrimaryCta';
import { runFeatureGridMotion } from '@/lib/motion-sequence';
import { useOneWayMotion } from '@/lib/use-one-way-motion';
import { ids } from '@/tokens/build/test-ids';
import type {
  FeatureGridCardAccent,
  FeatureGridCardConfig,
  FeatureGridCardDesktopProps,
  FeatureGridCardMobileProps,
  FeatureGridSectionPillProps,
} from '@/types/landing.types';

const fg = ids.component.landing.featureGrid;
const fgMobile = fg.mobile;

const FEATURE_GRID_CARD_SHELL_HIGHLIGHT =
  'border-[var(--color-border-brand-navy)] shadow-[var(--shadow-card)]';

const FEATURE_GRID_CARD_SHELL_DEFAULT = 'border-[var(--color-border-default)]';

const FEATURE_GRID_CARD_SHELL_HOVER =
  'hover:border-[var(--color-border-brand-navy)] hover:shadow-[var(--shadow-card)] hover:-translate-y-[var(--spacing-4)]';

function getCardSurfaceStyle(
  motionEngaged: boolean,
  isHighlighted: boolean,
  cascadeRunning: boolean,
): CSSProperties {
  return getFeatureGridCardSurfaceStyle(
    motionEngaged,
    isHighlighted,
    cascadeRunning,
    PROBLEM_TOKENS.shadowCard,
    PROBLEM_MOTION_STYLE,
  );
}

function getCardChromeTransitionStyle(): CSSProperties {
  return {
    ...PROBLEM_MOTION_STYLE,
    transitionProperty: MOTION_TRANSITION_PROPERTIES,
  };
}

function isCardHighlighted(cardIndex: number, activeIndex: number | null): boolean {
  if (activeIndex === null) return false;
  if (activeIndex === 0) return cardIndex <= 1;
  if (activeIndex === 2) return cardIndex >= 2 && cardIndex <= 3;
  if (activeIndex === 4) return cardIndex >= 4;
  return false;
}

function FeatureGridSectionPill({ pillTestId, labelTestId, variant = 'desktop' }: FeatureGridSectionPillProps) {
  const isMobile = variant === 'mobile';

  return (
    <div
      data-testid={pillTestId}
      className={
        isMobile
          ? 'inline-flex items-center justify-center gap-[var(--spacing-6)] rounded-[var(--radius-pill)] border-[0.3px] border-[var(--color-pill-feature-border)] bg-[color-mix(in_srgb,var(--color-pill-feature-background)_8%,transparent)] px-[var(--spacing-12)] py-[var(--spacing-8)]'
          : 'inline-flex items-center justify-center gap-[var(--spacing-8)] rounded-[var(--radius-pill)] border-[0.3px] border-[var(--color-pill-feature-border)] bg-[color-mix(in_srgb,var(--color-pill-feature-background)_8%,transparent)] px-[var(--spacing-16)] py-[var(--spacing-8)]'
      }
    >
      <span
        aria-hidden="true"
        className="size-[var(--spacing-6)] shrink-0 rounded-full bg-[var(--color-pill-feature-border)]"
      />
      <span
        data-testid={labelTestId}
        className={
          isMobile ? LANDING_SECTION_PILL_LABEL_MOBILE_CLASS : LANDING_SECTION_PILL_LABEL_DESKTOP_CLASS
        }
      >
        Platform Features
      </span>
    </div>
  );
}

function FeatureGridAccentBar({
  testId,
  accent,
  isHighlighted = false,
}: {
  testId: string;
  accent: FeatureGridCardAccent;
  isHighlighted?: boolean;
}) {
  const baseClass = FEATURE_GRID_ACCENT_BAR_CLASS[accent];
  const highlightClass =
    'bg-[linear-gradient(to_right,var(--color-text-brand-navy),color-mix(in_srgb,var(--color-text-brand-navy)_55%,var(--color-text-brand-orange)))]';

  return (
    <span
      data-testid={testId}
      aria-hidden="true"
      className={[
        'h-[var(--spacing-4)] w-[var(--spacing-64)] rounded-full',
        isHighlighted ? highlightClass : baseClass,
      ].join(' ')}
      style={getCardChromeTransitionStyle()}
    />
  );
}

function FeatureGridBadge({
  badgeTestId,
  badgeLabelTestId,
  badgeLabel,
  variant = 'desktop',
}: {
  badgeTestId: string;
  badgeLabelTestId: string;
  badgeLabel: string;
  variant?: 'desktop' | 'mobile';
}) {
  return (
    <div
      data-testid={badgeTestId}
      className="inline-flex items-center rounded-[var(--radius-6)] bg-[color-mix(in_srgb,var(--color-text-brand-navy)_8%,transparent)] px-[var(--spacing-8)] py-[var(--spacing-4)]"
    >
      <span
        data-testid={badgeLabelTestId}
        className={
          variant === 'mobile' ? FEATURE_GRID_BADGE_LABEL_MOBILE_CLASS : FEATURE_GRID_BADGE_LABEL_CLASS
        }
      >
        {badgeLabel}
      </span>
    </div>
  );
}

function getDesktopCardPaddingClass(size: FeatureGridCardConfig['size']): string {
  return size === 'wide'
    ? 'px-[var(--spacing-28)] py-[var(--spacing-28)]'
    : 'px-[var(--spacing-28)] py-[var(--spacing-32)]';
}

function FeatureGridCardDesktop({
  card,
  cardIndex,
  activeIndex,
  isHighlighted,
  cascadeRunning,
  motionEngaged,
}: FeatureGridCardDesktopProps) {
  return (
    <article
      data-testid={card.cardTestId}
      data-motion-duration="motion.duration.default"
      className={[
        'group/card',
        PROBLEM_CARD_BASE_CLASS,
        'min-w-0 flex-1 gap-[var(--spacing-16)] border bg-[var(--color-background-surface)]',
        getDesktopCardPaddingClass(card.size),
        isHighlighted ? FEATURE_GRID_CARD_SHELL_HIGHLIGHT : FEATURE_GRID_CARD_SHELL_DEFAULT,
        cascadeRunning || motionEngaged ? '' : FEATURE_GRID_CARD_SHELL_HOVER,
      ].join(' ')}
      style={getCardSurfaceStyle(motionEngaged, isHighlighted, cascadeRunning)}
    >
      <div
        data-testid={card.textBlockTestId}
        className="flex flex-col gap-[var(--spacing-16)]"
        style={getMotionCascadeTextStyle(
          isHighlighted,
          cascadeRunning,
          motionEngaged,
          PROBLEM_MOTION_STYLE,
        )}
      >
        {card.titleRowTestId ? (
          <div
            data-testid={card.titleRowTestId}
            className="flex items-center justify-between gap-[var(--spacing-10)]"
          >
            <h3
              data-testid={card.titleTestId}
              className="text-heading-desktop-h3-sm text-[var(--color-text-primary)]"
            >
              {card.heading}
            </h3>
            {card.badgeTestId && card.badgeLabelTestId && card.badgeLabel ? (
              <FeatureGridBadge
                badgeTestId={card.badgeTestId}
                badgeLabelTestId={card.badgeLabelTestId}
                badgeLabel={card.badgeLabel}
              />
            ) : null}
          </div>
        ) : (
          <h3
            data-testid={card.titleTestId}
            className="text-heading-desktop-h3-sm text-[var(--color-text-primary)]"
          >
            {card.heading}
          </h3>
        )}
        <FeatureGridAccentBar
          testId={card.accentBarTestId}
          accent={card.accent}
          isHighlighted={isHighlighted}
        />
        <p data-testid={card.bodyTestId} className="text-body-desktop-xs text-[var(--color-text-secondary)]">
          {card.body}
        </p>
      </div>
    </article>
  );
}

function FeatureGridCardMobile({ card }: FeatureGridCardMobileProps) {
  return (
    <article
      data-testid={card.cardTestId}
      className={`${PROBLEM_CARD_BASE_CLASS} w-full gap-[var(--spacing-16)] border border-[var(--color-border-default)] bg-[var(--color-background-surface)] p-[var(--spacing-20)] shadow-[var(--shadow-card)]`}
    >
      <div data-testid={card.textBlockTestId} className="flex flex-col gap-[var(--spacing-16)]">
        {card.titleRowTestId ? (
          <div
            data-testid={card.titleRowTestId}
            className="flex items-center justify-between gap-[var(--spacing-10)]"
          >
            <h3
              data-testid={card.titleTestId}
              className="text-heading-mobile-h3-sm text-[var(--color-text-primary)]"
            >
              {card.heading}
            </h3>
            {card.badgeTestId && card.badgeLabelTestId && card.badgeLabel ? (
              <FeatureGridBadge
                badgeTestId={card.badgeTestId}
                badgeLabelTestId={card.badgeLabelTestId}
                badgeLabel={card.badgeLabel}
                variant="mobile"
              />
            ) : null}
          </div>
        ) : (
          <h3
            data-testid={card.titleTestId}
            className="text-heading-mobile-h3-sm text-[var(--color-text-primary)]"
          >
            {card.heading}
          </h3>
        )}
        <FeatureGridAccentBar testId={card.accentBarTestId} accent={card.accent} />
        <p data-testid={card.bodyTestId} className={FEATURE_GRID_MOBILE_BODY_CLASS}>
          {card.body}
        </p>
      </div>
    </article>
  );
}

function FeatureGridCardsDesktop({
  activeIndex,
  cascadeActive,
  motionEngaged,
  motionStep,
}: {
  activeIndex: number | null;
  cascadeActive: boolean;
  motionEngaged: boolean;
  motionStep: FeatureGridMotionStep;
}) {
  const row1 = FEATURE_GRID_DESKTOP_CARDS.slice(0, 2);
  const row2 = FEATURE_GRID_DESKTOP_CARDS.slice(2);

  return (
    <div className="flex w-full flex-col gap-[var(--spacing-20)]">
      <div
        data-testid={fg.featureRow1}
        className="flex w-full flex-wrap items-stretch justify-center gap-[var(--spacing-20)]"
        style={getFeatureGridContentMotionStyle(
          motionEngaged,
          motionStep,
          'featureRow1',
          PROBLEM_MOTION_STYLE,
        )}
      >
        {row1.map((card, index) => (
          <FeatureGridCardDesktop
            key={card.cardTestId}
            card={card}
            cardIndex={index}
            activeIndex={activeIndex}
            isHighlighted={isCardHighlighted(index, activeIndex)}
            cascadeRunning={cascadeActive}
            motionEngaged={motionEngaged}
          />
        ))}
      </div>
      <div
        data-testid={fg.featureRow2}
        className="flex w-full flex-wrap items-stretch justify-center gap-[var(--spacing-20)]"
        style={getFeatureGridContentMotionStyle(
          motionEngaged,
          motionStep,
          'featureRow2',
          PROBLEM_MOTION_STYLE,
        )}
      >
        {row2.map((card, index) => (
          <FeatureGridCardDesktop
            key={card.cardTestId}
            card={card}
            cardIndex={index + 2}
            activeIndex={activeIndex}
            isHighlighted={isCardHighlighted(index + 2, activeIndex)}
            cascadeRunning={cascadeActive}
            motionEngaged={motionEngaged}
          />
        ))}
      </div>
    </div>
  );
}

function FeatureGridDesktopPanel() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [headerEmphasized, setHeaderEmphasized] = useState(false);
  const [cascadeActive, setCascadeActive] = useState(false);
  const [motionEngaged, setMotionEngaged] = useState(false);
  const [motionStep, setMotionStep] = useState<FeatureGridMotionStep>(-1);

  const playSequence = useCallback(
    () =>
      runFeatureGridMotion([
        () => {
          beginMotionReveal(
            () => {
              setMotionEngaged(true);
              setMotionStep(0);
              setCascadeActive(true);
              setActiveIndex(null);
            },
            () => {
              setMotionStep(1);
              setHeaderEmphasized(true);
              setActiveIndex(0);
            },
          );
        },
        () => {
          setMotionStep(2);
          setActiveIndex(2);
        },
        () => {
          setMotionStep(3);
          setActiveIndex(null);
          setCascadeActive(false);
        },
      ]),
    [],
  );

  const triggerMotion = useOneWayMotion(playSequence);

  return (
    <div data-testid={fg.root} className="hidden min-[1440px]:block">
      <div
        data-testid={fg.motion.root}
        className={`${FEATURE_GRID_DESKTOP_FRAME_CLASS} overflow-hidden`}
        onMouseEnter={triggerMotion}
      >
        <Image
          data-testid={fg.planeDecor}
          src="/icons/icon-feature-grid-plane-bottom.svg"
          alt=""
          width={306}
          height={299}
          className={FEATURE_GRID_PLANE_BOTTOM_CLASS}
          aria-hidden="true"
        />
        <Image
          data-testid={fg.planeDecor2}
          src="/icons/icon-feature-grid-plane-top.svg"
          alt=""
          width={171}
          height={264}
          className={FEATURE_GRID_PLANE_TOP_CLASS}
          aria-hidden="true"
        />
        <div className="relative z-10 flex justify-center px-[var(--spacing-64)] py-[var(--spacing-40)]">
          <div className="flex w-full max-w-[1312px] flex-col items-center gap-[var(--spacing-40)]">
            <div
              data-testid={fg.headerWrap}
              className="flex w-full flex-col items-center gap-[var(--spacing-16)]"
              style={getMotionSlideRevealStyle(headerEmphasized, PROBLEM_MOTION_STYLE, {
                engaged: motionEngaged,
                animateOpacity: false,
              })}
            >
              <div
                data-testid={fg.sectionHeader}
                className="flex w-full max-w-[900px] flex-col items-center gap-[var(--spacing-16)] text-center"
              >
                <FeatureGridSectionPill pillTestId={fg.sectionPill} labelTestId={fg.sectionPillLabel} />
                <div
                  data-testid={fg.headingBlock}
                  className="flex flex-col items-center gap-[var(--spacing-8)]"
                  style={getMotionSlideRevealStyle(headerEmphasized, PROBLEM_MOTION_STYLE, {
                    engaged: motionEngaged,
                    animateOpacity: false,
                  })}
                >
                  <div
                    data-testid={fg.frame2095585102}
                    className={`flex flex-col items-center ${LANDING_SECTION_HEADING_DESKTOP_CLASS}`}
                    style={getMotionSlideRevealStyle(headerEmphasized, PROBLEM_MOTION_STYLE, {
                      engaged: motionEngaged,
                      animateOpacity: false,
                    })}
                  >
                    <span data-testid={fg.headingline1}>{FEATURE_GRID_HEADING_LINE1}</span>
                    <span data-testid={fg.headingline2} className={LANDING_SECTION_HEADING_ACCENT_CLASS}>
                      {FEATURE_GRID_HEADING_LINE2}
                    </span>
                  </div>
                  <p
                    data-testid={fg.subtitle}
                    className={`max-w-[725px] ${LANDING_SECTION_SUBTITLE_CLASS}`}
                    style={getMotionSlideRevealStyle(headerEmphasized, PROBLEM_MOTION_STYLE, {
                      engaged: motionEngaged,
                      animateOpacity: false,
                      transitionDelay: MOTION_DELAY_AUTO_ADVANCE,
                    })}
                  >
                    {FEATURE_GRID_SUBTITLE}
                  </p>
                </div>
              </div>
            </div>

            <div
              data-testid={fg.cardsGrid}
              className="flex w-full flex-col gap-[var(--spacing-40)] overflow-hidden"
            >
              <FeatureGridCardsDesktop
                activeIndex={activeIndex}
                cascadeActive={cascadeActive}
                motionEngaged={motionEngaged}
                motionStep={motionStep}
              />
              <FeatureGridFooter motionEngaged={motionEngaged} motionStep={motionStep} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureGridFooter({
  variant = 'desktop',
  motionEngaged = false,
  motionStep = -1,
}: {
  variant?: 'desktop' | 'mobile';
  motionEngaged?: boolean;
  motionStep?: FeatureGridMotionStep;
}) {
  const isMobile = variant === 'mobile';
  const ctaTestId = isMobile ? fgMobile.cta : fg.cta;
  const labelTestId = isMobile ? fgMobile.label : fg.label;
  const iconTestId = isMobile ? fgMobile.iconButton : fg.iconButton;
  const graphicTestId = isMobile ? fgMobile.graphic : fg.graphic;
  const taglineTestId = isMobile ? fgMobile.textBlock8 : fg.tagline;
  const footerTestId = isMobile ? fgMobile.ctaRow : fg.footerBar;

  return (
    <div
      data-testid={footerTestId}
      className={
        isMobile
          ? 'flex w-full flex-col items-center gap-[var(--spacing-16)]'
          : 'flex w-full flex-row items-center justify-between gap-[var(--spacing-16)] py-[var(--spacing-20)]'
      }
      style={
        isMobile
          ? undefined
          : getFeatureGridContentMotionStyle(
              motionEngaged,
              motionStep,
              'footerBar',
              PROBLEM_MOTION_STYLE,
            )
      }
    >
      <p
        data-testid={taglineTestId}
        className={`${
          isMobile ? 'text-body-mobile-md' : 'text-body-desktop-md'
        } text-[var(--color-text-secondary)] ${isMobile ? 'text-center' : 'text-left'}`}
      >
        {FEATURE_GRID_TAGLINE}
      </p>
      <HeroPrimaryCta
        testId={ctaTestId}
        labelTestId={labelTestId}
        iconTestId={iconTestId}
        graphicTestId={graphicTestId}
        href="/contact"
        label={FEATURE_GRID_CTA_LABEL}
        className={isMobile ? 'w-full justify-center' : ''}
        emphasized={motionStep >= 3}
      />
    </div>
  );
}

export function FeatureGridSection() {
  return (
    <section aria-label="Platform Features" className="bg-[var(--color-background-page)]">
      <FeatureGridDesktopPanel />

      {/* Mobile — Figma 5164:6785 */}
      <div
        data-testid={fgMobile.root}
        className="flex flex-col gap-[var(--spacing-10)] px-[var(--spacing-16)] py-[var(--spacing-32)] min-[1440px]:hidden"
      >
        <div
          data-testid={fgMobile.frame1561553791}
          className="flex flex-col gap-[var(--spacing-20)]"
        >
          <div
            data-testid={fgMobile.frame1561553790}
            className="flex flex-col items-center gap-[var(--spacing-8)] text-center"
          >
            <div data-testid={fgMobile.container} className="flex flex-col items-center gap-[var(--spacing-8)]">
              <FeatureGridSectionPill
                pillTestId={fgMobile.sectionPill}
                labelTestId={fgMobile.sectionPillLabel}
                variant="mobile"
              />
              <div data-testid={fgMobile.heading} className="flex flex-col items-center gap-[var(--spacing-8)]">
                <h2 className={LANDING_SECTION_HEADING_MOBILE_CLASS}>
                  <span data-testid={fgMobile.builtForSpeedPrecision}>{FEATURE_GRID_HEADING_LINE1}</span>{' '}
                  <span data-testid={fgMobile.andTotalControl} className={LANDING_SECTION_HEADING_ACCENT_CLASS}>
                    {FEATURE_GRID_HEADING_LINE2}
                  </span>
                </h2>
                <p
                  data-testid={fgMobile.paragraph}
                  className={LANDING_SECTION_SUBTITLE_MOBILE_CLASS}
                >
                  {FEATURE_GRID_SUBTITLE}
                </p>
              </div>
            </div>
          </div>

          <div
            data-testid={fgMobile.cardsGrid}
            className="flex flex-col gap-[var(--spacing-16)]"
          >
            {FEATURE_GRID_MOBILE_CARDS.map((card) => (
              <FeatureGridCardMobile key={card.cardTestId} card={card} />
            ))}
          </div>

          <FeatureGridFooter variant="mobile" />
        </div>
      </div>
    </section>
  );
}
