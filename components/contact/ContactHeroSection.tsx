import {
  CONTACT_HERO_HEADLINE,
  CONTACT_HERO_SUBHEAD,
} from '@/constants/contact.constants';
import { ids } from '@/tokens/build/test-ids';

export function ContactHeroSection() {
  return (
    <section
      data-testid={ids.component.contact.hero.root}
      className="flex w-full max-w-[755px] flex-col items-center gap-[var(--space-sm)] text-center"
    >
      <h1
        data-testid={ids.component.contact.hero.heading}
        className="text-display-mobile-lg text-[var(--color-text-primary)] lg:text-display-desktop-lg"
      >
        {CONTACT_HERO_HEADLINE}
      </h1>
      <p
        data-testid={ids.component.contact.hero.subhead}
        className="text-body-desktop-md text-[var(--color-text-primary)]"
      >
        {CONTACT_HERO_SUBHEAD}
      </p>
    </section>
  );
}
