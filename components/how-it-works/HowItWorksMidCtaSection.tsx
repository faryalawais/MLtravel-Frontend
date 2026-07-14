'use client';

import {
  HIW_MID_CTA_CARD_CLASS,
  HIW_MID_CTA_COPY,
  HIW_MID_CTA_COPY_CLASS,
  HIW_MID_CTA_DEMO_LABEL,
  HIW_MID_CTA_SECTION_CLASS,
} from '@/constants/how-it-works.constants';
import { MOTION_DELAY_STEP } from '@/constants/motion.constants';
import { HeroPrimaryCta } from '@/components/landing/HeroPrimaryCta';
import { useSectionEntranceMotion } from '@/lib/use-one-way-motion';
import { ids } from '@/tokens/build/test-ids';

const midCta = ids.component.howItWorks.midCta;

export function HowItWorksMidCtaSection() {
  const { rootRef, triggerMotion, entranceStyle } = useSectionEntranceMotion();

  return (
    <section
      ref={rootRef}
      data-testid={midCta.root}
      className={`hidden w-full flex-col items-center justify-center bg-[var(--color-background-page)] px-[var(--spacing-16)] lg:flex ${HIW_MID_CTA_SECTION_CLASS}`}
      onMouseEnter={triggerMotion}
    >
      <div
        data-testid={midCta.card}
        className={HIW_MID_CTA_CARD_CLASS}
        style={entranceStyle({ animateOpacity: false })}
      >
        <p
          data-testid={midCta.copy}
          className={HIW_MID_CTA_COPY_CLASS}
          style={entranceStyle({
            animateOpacity: false,
            transitionDelay: MOTION_DELAY_STEP,
          })}
        >
          {HIW_MID_CTA_COPY}
        </p>
        <HeroPrimaryCta
          testId={midCta.demoCta}
          labelTestId={midCta.label}
          iconTestId={midCta.ctaIcon}
          graphicTestId={midCta.graphic}
          href="/contact"
          label={HIW_MID_CTA_DEMO_LABEL}
        />
      </div>
    </section>
  );
}
