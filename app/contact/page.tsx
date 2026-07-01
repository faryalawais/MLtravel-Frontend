import { ids } from '@/tokens/build/test-ids';

export default function ContactPage() {
  return (
    <div
      data-testid={ids.screen.contact.page}
      className="px-[var(--space-md)] py-[var(--spacing-40)]"
    >
      <h1 className="text-heading-desktop-h4 text-[var(--color-text-primary)]">Contact</h1>
    </div>
  );
}
