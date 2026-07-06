import { HowItWorksHeroSection } from '@/components/how-it-works/HowItWorksHeroSection';
import { HeroSection } from '@/components/landing/HeroSection';
import { HowItWorksTeaserSection } from '@/components/landing/HowItWorksTeaserSection';
import { ids } from '@/tokens/build/test-ids';

export default function HowItWorksPage() {
  return (
    <div data-testid={ids.screen.howItWorks.page}>
      <HowItWorksHeroSection />
      <HeroSection layout="hiw-page" />
      <HowItWorksTeaserSection showFooterLink={false} />
    </div>
  );
}
