import Image from 'next/image';
import {
  HIW_MOBILE_SOCIAL_STRIP_SECTION_CLASS,
  HIW_MOBILE_TESTIMONIAL_AUTHOR_ROW_CLASS,
  HIW_MOBILE_TESTIMONIAL_AVATAR_INITIALS_CLASS,
  HIW_MOBILE_TESTIMONIAL_AVATAR_SHELL_CLASS,
  HIW_MOBILE_TESTIMONIAL_BLOCK_CLASS,
  HIW_MOBILE_TESTIMONIAL_CONTENT_CLASS,
  HIW_MOBILE_TESTIMONIAL_LOGO_SHELL_CLASS,
} from '@/constants/how-it-works.constants';
import {
  SOCIAL_PROOF_AUTHOR_COMPANY_CLASS,
  SOCIAL_PROOF_AUTHOR_NAME_CLASS,
  SOCIAL_PROOF_AUTHOR_ROLE_CLASS,
  SOCIAL_PROOF_DESKTOP_TESTIMONIALS,
  SOCIAL_PROOF_QUOTE_MOBILE_CLASS,
} from '@/constants/landing.constants';
import { RESPONSIVE_IMAGE_DIMENSION_STYLE } from '@/constants/motion.constants';
import { ids } from '@/tokens/build/test-ids';

const mobileSocialStrip = ids.component.howItWorks.mobileSocialStrip;
const testimonial = SOCIAL_PROOF_DESKTOP_TESTIMONIALS[0];

function HiwMobileTestimonialAvatar({
  avatarTestId,
  initialsTestId,
  initials,
}: {
  avatarTestId: string;
  initialsTestId: string;
  initials: string;
}) {
  return (
    <div data-testid={avatarTestId} className={HIW_MOBILE_TESTIMONIAL_AVATAR_SHELL_CLASS}>
      <Image
        src="/icons/icon-avatar-glow.svg"
        alt=""
        width={36}
        height={36}
        aria-hidden="true"
        className="absolute inset-0 size-full"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <Image
          src="/icons/icon-avatar-circle.svg"
          alt=""
          width={32}
          height={32}
          aria-hidden="true"
          className="size-[var(--spacing-32)]"
        />
        <span data-testid={initialsTestId} className={HIW_MOBILE_TESTIMONIAL_AVATAR_INITIALS_CLASS}>
          {initials}
        </span>
      </div>
    </div>
  );
}

export function HowItWorksMobileSocialStripSection() {
  return (
    <section data-testid={mobileSocialStrip.root} className={HIW_MOBILE_SOCIAL_STRIP_SECTION_CLASS}>
      <article data-testid={testimonial.blockTestId} className={HIW_MOBILE_TESTIMONIAL_BLOCK_CLASS}>
        <div data-testid={mobileSocialStrip.testimonial} className="flex w-full flex-col items-center gap-[var(--spacing-16)]">
          <div data-testid={testimonial.logoCardTestId} className={HIW_MOBILE_TESTIMONIAL_LOGO_SHELL_CLASS}>
            <div data-testid={testimonial.logoSlotTestId} className="flex items-center justify-center">
              <Image
                data-testid={testimonial.companyLogoTestId}
                src={testimonial.logoSrc}
                alt=""
                width={100}
                height={20}
                className="h-auto w-[100px] max-w-full object-contain"
                style={RESPONSIVE_IMAGE_DIMENSION_STYLE}
              />
            </div>
          </div>
          <div className={HIW_MOBILE_TESTIMONIAL_CONTENT_CLASS}>
            <blockquote data-testid={testimonial.quoteTestId} className={SOCIAL_PROOF_QUOTE_MOBILE_CLASS}>
              {testimonial.quote}
            </blockquote>
            <div data-testid={testimonial.authorTestId} className={HIW_MOBILE_TESTIMONIAL_AUTHOR_ROW_CLASS}>
              <HiwMobileTestimonialAvatar
                avatarTestId={testimonial.avatarTestId}
                initialsTestId={testimonial.initialsTestId}
                initials={testimonial.initials}
              />
              <div className="flex flex-col gap-[var(--spacing-4)]">
                <p data-testid={testimonial.nameTestId} className={SOCIAL_PROOF_AUTHOR_NAME_CLASS}>
                  {testimonial.name}
                </p>
                <p data-testid={testimonial.roleTestId} className={SOCIAL_PROOF_AUTHOR_ROLE_CLASS}>
                  {testimonial.role}
                </p>
                <p data-testid={testimonial.companyTestId} className={SOCIAL_PROOF_AUTHOR_COMPANY_CLASS}>
                  {testimonial.company}
                </p>
              </div>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}
