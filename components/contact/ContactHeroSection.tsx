import {
  CONTACT_HERO_HEADLINE,
  CONTACT_HERO_HEADLINE_CLASS,
  CONTACT_HERO_SECTION_CLASS,
  CONTACT_HERO_SUBHEAD,
  CONTACT_HERO_SUBHEAD_CLASS,
} from '@/constants/contact.constants';
import { ids } from '@/tokens/build/test-ids';

export function ContactHeroSection() {
  return (
    <section
      data-testid={ids.component.contact.hero.root}
      className={CONTACT_HERO_SECTION_CLASS}
    >
      <h1
        data-testid={ids.component.contact.hero.heading}
        className={CONTACT_HERO_HEADLINE_CLASS}
      >
        {CONTACT_HERO_HEADLINE}
      </h1>
      <p
        data-testid={ids.component.contact.hero.subhead}
        className={CONTACT_HERO_SUBHEAD_CLASS}
      >
        {CONTACT_HERO_SUBHEAD}
      </p>
    </section>
  );
}
