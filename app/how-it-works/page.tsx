import { HowItWorksHeroSection } from '@/components/how-it-works/HowItWorksHeroSection';
import { HowItWorksMidCtaSection } from '@/components/how-it-works/HowItWorksMidCtaSection';
import { HowItWorksMobileSocialStripSection } from '@/components/how-it-works/HowItWorksMobileSocialStripSection';
import { HowItWorksSixWeekSection } from '@/components/how-it-works/HowItWorksSixWeekSection';
import { HeroSection } from '@/components/landing/HeroSection';
import { HowItWorksTeaserSection } from '@/components/landing/HowItWorksTeaserSection';
import { ids } from '@/tokens/build/test-ids';

export default function HowItWorksPage() {
  return (
    <div data-testid={ids.screen.howItWorks.page}>
      <HowItWorksHeroSection />
      <HeroSection layout="hiw-page" />
      <HowItWorksTeaserSection showFooterLink={false} />
      <HowItWorksMidCtaSection />
      <HowItWorksSixWeekSection />
      <HowItWorksMobileSocialStripSection />
    </div>
  );
}
