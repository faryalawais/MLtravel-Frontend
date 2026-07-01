import { ComparisonFirstSection } from '@/components/landing/ComparisonFirstSection';
import { HeroSection } from '@/components/landing/HeroSection';
import { HowItWorksTeaserSection } from '@/components/landing/HowItWorksTeaserSection';
import { ProblemSection } from '@/components/landing/ProblemSection';
import { ids } from '@/tokens/build/test-ids';

export default function Home() {
  return (
    <div data-testid={ids.screen.landing.home}>
      <HeroSection />
      <ProblemSection />
      <ComparisonFirstSection />
      <HowItWorksTeaserSection />
      <section id="pricing" aria-label="Pricing" className="scroll-mt-[var(--spacing-64)]" />
    </div>
  );
}
