import { ids } from '@/tokens/build/test-ids';

export default function HowItWorksPage() {
  return (
    <div
      data-testid={ids.screen.howItWorks.page}
      className="px-[var(--space-md)] py-[var(--spacing-40)]"
    >
      <h1 className="text-heading-desktop-h4 text-[var(--color-text-primary)]">
        How It Works
      </h1>
    </div>
  );
}
