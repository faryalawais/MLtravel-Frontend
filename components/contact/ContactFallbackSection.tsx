import Image from 'next/image';
import {
  CONTACT_EMAIL_CTA_CLASS_NAME,
  CONTACT_FALLBACK_BODY,
  CONTACT_FALLBACK_HEADING,
} from '@/constants/contact.constants';
import { ids } from '@/tokens/build/test-ids';
import type { ContactFallbackSectionProps } from '@/types/contact.types';

export function ContactFallbackSection({ contactEmail }: ContactFallbackSectionProps) {
  const mailtoHref = `mailto:${contactEmail}`;

  return (
    <section
      data-testid={ids.component.contact.fallback.root}
      className="flex w-full max-w-[560px] flex-col items-center gap-[var(--space-md)] text-center"
    >
      <div className="flex w-full flex-col items-center gap-[var(--space-sm)]">
        <h2
          data-testid={ids.component.contact.fallback.heading}
          className="text-heading-mobile-h2 text-[var(--color-text-primary)] lg:text-heading-desktop-h2"
        >
          {CONTACT_FALLBACK_HEADING}
        </h2>
        <p
          data-testid={ids.component.contact.fallback.body}
          className="text-body-desktop-xs text-[var(--color-text-muted)]"
        >
          {CONTACT_FALLBACK_BODY}
        </p>
      </div>
      <a
        href={mailtoHref}
        data-testid={ids.component.contact.fallback.emailCta}
        className={CONTACT_EMAIL_CTA_CLASS_NAME}
      >
        <span>{contactEmail}</span>
        <Image
          src="/icons/icon-button-arrow.svg"
          alt=""
          width={16}
          height={16}
          className="size-[var(--spacing-16)] shrink-0"
          aria-hidden="true"
        />
      </a>
    </section>
  );
}
