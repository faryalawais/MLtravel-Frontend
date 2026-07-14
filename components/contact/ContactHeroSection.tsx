'use client';

import {
  CONTACT_HERO_HEADLINE,
  CONTACT_HERO_HEADLINE_CLASS,
  CONTACT_HERO_SECTION_CLASS,
  CONTACT_HERO_SUBHEAD,
  CONTACT_HERO_SUBHEAD_CLASS,
} from '@/constants/contact.constants';
import { MOTION_DELAY_STEP } from '@/constants/motion.constants';
import { useSectionEntranceMotion } from '@/lib/use-one-way-motion';
import { ids } from '@/tokens/build/test-ids';

export function ContactHeroSection() {
  const { rootRef, triggerMotion, entranceStyle } = useSectionEntranceMotion();

  return (
    <section
      ref={rootRef}
      data-testid={ids.component.contact.hero.root}
      className={CONTACT_HERO_SECTION_CLASS}
      onMouseEnter={triggerMotion}
    >
      <h1
        data-testid={ids.component.contact.hero.heading}
        className={CONTACT_HERO_HEADLINE_CLASS}
        style={entranceStyle({ animateOpacity: false })}
      >
        {CONTACT_HERO_HEADLINE}
      </h1>
      <p
        data-testid={ids.component.contact.hero.subhead}
        className={CONTACT_HERO_SUBHEAD_CLASS}
        style={entranceStyle({
          animateOpacity: false,
          transitionDelay: MOTION_DELAY_STEP,
        })}
      >
        {CONTACT_HERO_SUBHEAD}
      </p>
    </section>
  );
}
