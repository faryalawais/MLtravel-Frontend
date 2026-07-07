import Image from 'next/image';
import {
  CONTACT_EMAIL_CTA_CLASS_NAME,
  CONTACT_FALLBACK_BODY,
  CONTACT_FALLBACK_BODY_CLASS,
  CONTACT_FALLBACK_COPY_STACK_CLASS,
  CONTACT_FALLBACK_HEADING,
  CONTACT_FALLBACK_HEADING_CLASS,
  CONTACT_FALLBACK_SECTION_CLASS,
} from '@/constants/contact.constants';
import { ids } from '@/tokens/build/test-ids';
import type { ContactFallbackSectionProps } from '@/types/contact.types';

export function ContactFallbackSection({ contactEmail }: ContactFallbackSectionProps) {
  const mailtoHref = `mailto:${contactEmail}`;

  return (
    <section
      data-testid={ids.component.contact.fallback.root}
      className={CONTACT_FALLBACK_SECTION_CLASS}
    >
      <div className={CONTACT_FALLBACK_COPY_STACK_CLASS}>
        <h2
          data-testid={ids.component.contact.fallback.heading}
          className={CONTACT_FALLBACK_HEADING_CLASS}
        >
          {CONTACT_FALLBACK_HEADING}
        </h2>
        <p
          data-testid={ids.component.contact.fallback.body}
          className={CONTACT_FALLBACK_BODY_CLASS}
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
