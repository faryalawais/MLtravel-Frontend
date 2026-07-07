'use client';

import { useCallback, useState } from 'react';
import {
  HIW_FINAL_CTA_CARD_CLASS,
  HIW_FINAL_CTA_DESKTOP_MOTION_CLIP_CLASS,
  HIW_FINAL_CTA_HEADLINE_ACCENT,
  HIW_FINAL_CTA_HEADLINE_ACCENT_CLASS,
  HIW_FINAL_CTA_HEADLINE_CLASS,
  HIW_FINAL_CTA_HEADLINE_PREFIX,
  HIW_FINAL_CTA_INNER_CLASS,
  HIW_FINAL_CTA_SECTION_CLASS,
  HIW_FINAL_CTA_SUBCOPY,
  HIW_FINAL_CTA_SUBCOPY_CLASS,
  HIW_FINAL_CTA_TEXT_BLOCK_CLASS,
  HIW_HERO_DEMO_CTA_LABEL,
} from '@/constants/how-it-works.constants';
import {
  DEFAULT_MOTION_STYLE,
  getHiwFinalCtaBannerMotionStyle,
  type HiwFinalCtaMotionStep,
} from '@/constants/motion.constants';
import { runSimpleOneStepMotion } from '@/lib/motion-sequence';
import { useOneWayMotion } from '@/lib/use-one-way-motion';
import { HeroPrimaryCta } from '@/components/landing/HeroPrimaryCta';
import { ids } from '@/tokens/build/test-ids';

const finalCta = ids.component.howItWorks.finalCta;

export function HowItWorksFinalCtaSection() {
  const [motionStep, setMotionStep] = useState<HiwFinalCtaMotionStep>(-1);

  const playFinalCtaMotion = useCallback(
    () =>
      runSimpleOneStepMotion(
        () => setMotionStep(0),
        () => setMotionStep(1),
      ),
    [],
  );

  const triggerMotion = useOneWayMotion(playFinalCtaMotion);

  const motionEngaged = motionStep >= 0;
  const motionSettled = motionStep >= 1;

  return (
    <section data-testid={finalCta.root} className={HIW_FINAL_CTA_SECTION_CLASS}>
      <div
        data-testid={finalCta.motion.root}
        className="flex w-full flex-col items-center"
        onMouseEnter={triggerMotion}
      >
        <div className={HIW_FINAL_CTA_DESKTOP_MOTION_CLIP_CLASS}>
          <div
            className={HIW_FINAL_CTA_CARD_CLASS}
            style={getHiwFinalCtaBannerMotionStyle(
              motionEngaged,
              motionSettled,
              DEFAULT_MOTION_STYLE,
            )}
          >
            <div className={HIW_FINAL_CTA_INNER_CLASS}>
              <div data-testid={finalCta.textBlock} className={HIW_FINAL_CTA_TEXT_BLOCK_CLASS}>
                <p data-testid={finalCta.headline} className={HIW_FINAL_CTA_HEADLINE_CLASS}>
                  {HIW_FINAL_CTA_HEADLINE_PREFIX}
                  <span className={HIW_FINAL_CTA_HEADLINE_ACCENT_CLASS}>
                    {HIW_FINAL_CTA_HEADLINE_ACCENT}
                  </span>
                  .
                </p>
                <p data-testid={finalCta.subcopy} className={HIW_FINAL_CTA_SUBCOPY_CLASS}>
                  {HIW_FINAL_CTA_SUBCOPY}
                </p>
              </div>
              <HeroPrimaryCta
                testId={finalCta.demoCta}
                labelTestId={finalCta.label}
                iconTestId={finalCta.ctaIcon}
                graphicTestId={finalCta.graphic}
                href="/contact"
                label={HIW_HERO_DEMO_CTA_LABEL}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
