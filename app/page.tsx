import { PricingSection } from '@/components/landing/PricingSection';
import { ComparisonFirstSection } from '@/components/landing/ComparisonFirstSection';
import { FeatureGridSection } from '@/components/landing/FeatureGridSection';
import { HeroSection } from '@/components/landing/HeroSection';
import { HowItWorksTeaserSection } from '@/components/landing/HowItWorksTeaserSection';
import { ProblemSection } from '@/components/landing/ProblemSection';
import { SocialProofSection } from '@/components/landing/SocialProofSection';
import { ids } from '@/tokens/build/test-ids';

export default function Home() {
  return (
    <div data-testid={ids.screen.landing.home}>
      <HeroSection />
      <ProblemSection />
      <ComparisonFirstSection />
      <HowItWorksTeaserSection />
      <FeatureGridSection />
      <SocialProofSection />
      <PricingSection />
    </div>
  );
}
