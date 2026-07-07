import Image from 'next/image';
import { SocialProofTestimonialDesktopBlock } from '@/components/landing/SocialProofSection';
import {
  HIW_DESKTOP_BENEFIT_BODY_CLASS,
  HIW_DESKTOP_BENEFIT_CARD_CLASS,
  HIW_DESKTOP_BENEFIT_CARDS,
  HIW_DESKTOP_BENEFIT_ICON_SHELL_CLASS,
  HIW_DESKTOP_BENEFIT_STACK_CLASS,
  HIW_DESKTOP_BENEFIT_TITLE_CLASS,
  HIW_DESKTOP_SOCIAL_PROOF_STRIP_CLASS,
} from '@/constants/how-it-works.constants';
import { DEFAULT_MOTION_STYLE, getMotionSlideRevealStyle } from '@/constants/motion.constants';
import { ids } from '@/tokens/build/test-ids';
import type { HiwDesktopBenefitCardConfig } from '@/types/how-it-works.types';

const socialProofStrip = ids.component.howItWorks.sixWeek.socialProofStrip;

function HiwDesktopBenefitCard({ card }: { card: HiwDesktopBenefitCardConfig }) {
  return (
    <article className={HIW_DESKTOP_BENEFIT_CARD_CLASS}>
      <div className={HIW_DESKTOP_BENEFIT_ICON_SHELL_CLASS} aria-hidden="true">
        <Image src={card.iconSrc} alt="" width={24} height={24} className="size-[var(--spacing-24)]" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-[var(--spacing-8)]">
        <h3 className={HIW_DESKTOP_BENEFIT_TITLE_CLASS}>{card.title}</h3>
        <p className={HIW_DESKTOP_BENEFIT_BODY_CLASS}>{card.body}</p>
      </div>
    </article>
  );
}

export function HowItWorksDesktopSocialProofStrip({
  motionEngaged = false,
  socialProofRevealed = false,
}: {
  motionEngaged?: boolean;
  socialProofRevealed?: boolean;
}) {
  const stripVisible = !motionEngaged || socialProofRevealed;

  return (
    <div
      data-testid={socialProofStrip}
      className={HIW_DESKTOP_SOCIAL_PROOF_STRIP_CLASS}
      style={getMotionSlideRevealStyle(stripVisible, DEFAULT_MOTION_STYLE, {
        engaged: motionEngaged,
        animateOpacity: true,
        idleOpacity: 0,
      })}
    >
      <SocialProofTestimonialDesktopBlock />
      <div className={HIW_DESKTOP_BENEFIT_STACK_CLASS}>
        {HIW_DESKTOP_BENEFIT_CARDS.map((card) => (
          <HiwDesktopBenefitCard key={card.title} card={card} />
        ))}
      </div>
    </div>
  );
}
