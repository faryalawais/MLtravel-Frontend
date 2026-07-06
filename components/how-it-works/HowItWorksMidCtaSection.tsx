import {
  HIW_MID_CTA_CARD_CLASS,
  HIW_MID_CTA_COPY,
  HIW_MID_CTA_COPY_CLASS,
  HIW_MID_CTA_DEMO_LABEL,
} from '@/constants/how-it-works.constants';
import { HeroPrimaryCta } from '@/components/landing/HeroPrimaryCta';
import { ids } from '@/tokens/build/test-ids';

const midCta = ids.component.howItWorks.midCta;

export function HowItWorksMidCtaSection() {
  return (
    <section
      data-testid={midCta.root}
      className="hidden w-full justify-center bg-[var(--color-background-page)] px-[var(--spacing-16)] lg:flex"
    >
      <div data-testid={midCta.card} className={HIW_MID_CTA_CARD_CLASS}>
        <p data-testid={midCta.copy} className={HIW_MID_CTA_COPY_CLASS}>
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
