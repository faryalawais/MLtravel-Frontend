import { HeroSection } from '@/components/landing/HeroSection';
import { ids } from '@/tokens/build/test-ids';

export default function Home() {
  return (
    <div data-testid={ids.screen.landing.home}>
      <HeroSection />
      <section id="pricing" aria-label="Pricing" className="scroll-mt-[var(--spacing-64)]" />
    </div>
  );
}
