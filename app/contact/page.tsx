import { ContactEmbedSection } from '@/components/contact/ContactEmbedSection';
import { ContactFallbackSection } from '@/components/contact/ContactFallbackSection';
import { ContactHeroSection } from '@/components/contact/ContactHeroSection';
import {
  CONTACT_FALLBACK_EMAIL,
  CONTACT_PAGE_SHELL_CLASS,
} from '@/constants/contact.constants';
import { ids } from '@/tokens/build/test-ids';
import type { ContactPageProps } from '@/types/contact.types';

function resolveCalendlyUrl(e2eNoCalendly: boolean): string {
  const allowTestOverride =
    process.env.NEXT_PUBLIC_E2E_MODE === '1' || process.env.NODE_ENV === 'development';
  if (allowTestOverride && e2eNoCalendly) {
    return '';
  }
  return process.env.NEXT_PUBLIC_CALENDLY_URL ?? '';
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const params = await searchParams;
  const calendlyUrl = resolveCalendlyUrl(params.e2e_no_calendly === '1');
  const contactEmail =
    process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? CONTACT_FALLBACK_EMAIL;

  return (
    <div data-testid={ids.screen.contact.page} className={CONTACT_PAGE_SHELL_CLASS}>
      <ContactHeroSection />
      <ContactEmbedSection calendlyUrl={calendlyUrl} />
      <ContactFallbackSection contactEmail={contactEmail} />
    </div>
  );
}
