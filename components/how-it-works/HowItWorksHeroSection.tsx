'use client';

import { useCallback, useRef, useState } from 'react';
import {
  HIW_DESKTOP_STATS,
  HIW_HERO_DEMO_CTA_LABEL,
  HIW_HERO_HEADLINE,
  HIW_HERO_HEAD_GROUP_HEIGHT_PX,
  HIW_HERO_PROOF_LINE,
  HIW_HERO_SUBCOPY,
  HIW_HERO_CTA_SLOT_TOP_PX,
  HIW_HERO_TEXT_BLOCK_GAP_PX,
  HIW_HERO_TEXT_BLOCK_MIN_HEIGHT_PX,
} from '@/constants/how-it-works.constants';
import {
  getHiwHeroLayerMotionStyle,
  HERO_MOTION_CTA_CLUSTER_HEIGHT_PX,
  type HiwHeroMotionStep,
} from '@/constants/motion.constants';
import { runHeroMotion } from '@/lib/motion-sequence';
import { useOneWayMotion } from '@/lib/use-one-way-motion';
import { ids } from '@/tokens/build/test-ids';
import { HeroPrimaryCta } from '@/components/landing/HeroPrimaryCta';

function StatBar({ testId }: { testId: string }) {
  return (
    <span
      data-testid={testId}
      aria-hidden="true"
      className="h-[var(--spacing-4)] w-[var(--spacing-32)] rounded-full bg-[var(--color-action-primary-default-background)]"
    />
  );
}

function HeroStatsStrip() {
  const hero = ids.component.howItWorks.hero;

  return (
    <div
      data-testid={hero.statsStrip}
      className="flex w-full items-center justify-between border-y border-[var(--color-border-default)] bg-[var(--color-background-surface)] px-[var(--spacing-16)] py-[var(--spacing-24)] sm:px-[var(--spacing-32)] lg:px-[var(--spacing-180)]"
    >
      {HIW_DESKTOP_STATS.map((stat, index) => (
        <div key={stat.itemTestId} className="contents">
          <div
            data-testid={stat.itemTestId}
            className="flex flex-1 flex-col items-center justify-center gap-[var(--spacing-8)] px-[var(--spacing-12)] text-center"
          >
            <div
              data-testid={stat.valBlockTestId}
              className="flex flex-col items-center gap-[var(--spacing-8)]"
            >
              <span
                data-testid={stat.valueTestId}
                className="text-display-desktop-stat text-[var(--color-text-primary)]"
              >
                {stat.value}
              </span>
              <StatBar testId={stat.barTestId} />
            </div>
            <div
              data-testid={stat.labelBlockTestId}
              className="flex flex-col items-center gap-[var(--spacing-4)]"
            >
              <span
                data-testid={stat.labelTestId}
                className="text-label-desktop-md-stat uppercase text-[var(--color-text-primary)]"
              >
                {stat.label}
              </span>
              <span
                data-testid={stat.captionTestId}
                className="text-body-desktop-xs text-[var(--color-text-secondary)]"
              >
                {stat.caption}
              </span>
            </div>
          </div>
          {stat.dividerTestId && index < HIW_DESKTOP_STATS.length - 1 ? (
            <span
              data-testid={stat.dividerTestId}
              aria-hidden="true"
              className="hidden h-[var(--spacing-48)] w-px shrink-0 bg-[var(--color-border-default)] lg:block"
            />
          ) : null}
        </div>
      ))}
    </div>
  );
}

function HeroHeadCopy() {
  const hero = ids.component.howItWorks.hero;

  return (
    <div
      data-testid={hero.headGroup}
      className="flex flex-col items-center gap-[var(--spacing-8)] text-center"
    >
      <h1
        id="hiw-hero-heading"
        data-testid={hero.textBlock2}
        className="text-display-desktop-lg text-[var(--color-text-primary)]"
      >
        {HIW_HERO_HEADLINE}
      </h1>
      <p
        data-testid={hero.textBlock3}
        className="text-body-desktop-md text-[var(--color-text-secondary)]"
      >
        {HIW_HERO_SUBCOPY}
      </p>
    </div>
  );
}

function HeroCtaCluster({ emphasized }: { emphasized: boolean }) {
  const hero = ids.component.howItWorks.hero;

  return (
    <div
      data-testid={hero.ctaGroup}
      className="flex flex-col items-center gap-[var(--spacing-12)]"
    >
      <HeroPrimaryCta
        testId={hero.demoCta}
        labelTestId={hero.label}
        iconTestId={hero.ctaIcon}
        graphicTestId={hero.graphic}
        href="/contact"
        label={HIW_HERO_DEMO_CTA_LABEL}
        emphasized={emphasized}
        useHeroEasing
      />
      <p
        data-testid={hero.textBlock4}
        className="text-body-desktop-xs text-[var(--color-text-secondary)]"
      >
        {HIW_HERO_PROOF_LINE}
      </p>
    </div>
  );
}

export function HowItWorksHeroSection() {
  const hero = ids.component.howItWorks.hero;
  const textBlockRef = useRef<HTMLDivElement>(null);
  const headGroupRef = useRef<HTMLDivElement>(null);
  const [motionEngaged, setMotionEngaged] = useState(false);
  const [motionStep, setMotionStep] = useState<HiwHeroMotionStep>(0);
  const [ctaSlotTopPx, setCtaSlotTopPx] = useState(HIW_HERO_CTA_SLOT_TOP_PX);
  const [textBlockMinHeightPx, setTextBlockMinHeightPx] = useState(
    HIW_HERO_TEXT_BLOCK_MIN_HEIGHT_PX,
  );

  const playMotion = useCallback(() => {
    const headHeight = headGroupRef.current?.offsetHeight ?? HIW_HERO_HEAD_GROUP_HEIGHT_PX;
    const slotTop = headHeight + HIW_HERO_TEXT_BLOCK_GAP_PX;
    const clusterHeight = textBlockRef.current?.offsetHeight ?? textBlockMinHeightPx;

    setCtaSlotTopPx(slotTop);
    setTextBlockMinHeightPx(
      Math.max(
        HIW_HERO_TEXT_BLOCK_MIN_HEIGHT_PX,
        slotTop + HERO_MOTION_CTA_CLUSTER_HEIGHT_PX,
        clusterHeight,
      ),
    );
    setMotionEngaged(true);
    setMotionStep(0);
    return runHeroMotion(
      () => setMotionStep(1),
      () => setMotionStep(2),
    );
  }, [textBlockMinHeightPx]);

  const triggerMotion = useOneWayMotion(playMotion);

  const headMotionStyle = getHiwHeroLayerMotionStyle(motionEngaged, motionStep, 'head');
  const ctaMotionStyle = getHiwHeroLayerMotionStyle(motionEngaged, motionStep, 'cta');

  return (
    <section
      data-testid={hero.root}
      aria-labelledby="hiw-hero-heading"
      className="hidden bg-[var(--color-background-page)] lg:block"
    >
      <div
        data-testid={hero.motion.root}
        className="flex flex-col"
        onMouseEnter={triggerMotion}
      >
        <div
          data-testid={hero.s1Hero}
          className="flex flex-col items-center py-[var(--spacing-52)]"
        >
          <div
            ref={textBlockRef}
            data-testid={hero.textBlock}
            className={`w-full max-w-[642px] ${motionEngaged ? 'relative overflow-hidden' : ''}`}
            style={
              motionEngaged ? { minHeight: `${textBlockMinHeightPx}px` } : undefined
            }
          >
            {motionEngaged ? (
              <>
                <div
                  data-testid={hero.motion.headGroup}
                  className="absolute left-0 top-0 z-10 w-full"
                  style={headMotionStyle}
                >
                  <HeroHeadCopy />
                </div>
                <div
                  data-testid={hero.motion.ctaGroup}
                  className="absolute left-0 z-0 w-full"
                  style={{ top: `${ctaSlotTopPx}px`, ...ctaMotionStyle }}
                >
                  <HeroCtaCluster emphasized={motionStep >= 2} />
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-[var(--spacing-24)]">
                <div ref={headGroupRef} data-testid={hero.motion.headGroup}>
                  <HeroHeadCopy />
                </div>
                <div data-testid={hero.motion.ctaGroup}>
                  <HeroCtaCluster emphasized={false} />
                </div>
              </div>
            )}
          </div>
        </div>

        <HeroStatsStrip />
      </div>
    </section>
  );
}
