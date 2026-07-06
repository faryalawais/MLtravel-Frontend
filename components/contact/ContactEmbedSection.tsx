'use client';

import { useCallback, useState } from 'react';
import {
  CALENDLY_IFRAME_TITLE,
  EMBED_FALLBACK_LINK_LABEL,
  EMBED_FALLBACK_MESSAGE,
} from '@/constants/contact.constants';
import { ids } from '@/tokens/build/test-ids';
import type { ContactEmbedSectionProps } from '@/types/contact.types';

function ContactEmbedSkeleton({ hidden }: { hidden: boolean }) {
  return (
    <div
      data-testid={ids.component.contact.embedSkeleton.root}
      className={`absolute inset-0 animate-pulse rounded-[var(--radius-6)] bg-[var(--color-surface-muted)] ${hidden ? 'hidden' : ''}`}
      aria-hidden={hidden}
    />
  );
}

function ContactEmbedFallback({ calendlyUrl }: { calendlyUrl: string }) {
  const href = calendlyUrl || 'https://calendly.com';

  return (
    <div
      data-testid={ids.component.contact.embedFallback.root}
      className="flex min-h-[550px] w-full flex-col items-center justify-center gap-[var(--space-md)] rounded-[var(--radius-6)] border border-[var(--color-border-default)] bg-[var(--color-background-page)] px-[var(--spacing-16)] py-[var(--spacing-24)] text-center"
    >
      <p className="text-body-desktop-md text-[var(--color-text-primary)]">
        {EMBED_FALLBACK_MESSAGE}
      </p>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-body-desktop-md text-[var(--color-action-primary-default-label)] underline"
      >
        {EMBED_FALLBACK_LINK_LABEL}
      </a>
    </div>
  );
}

export function ContactEmbedSection({ calendlyUrl }: ContactEmbedSectionProps) {
  const trimmedUrl = calendlyUrl.trim();
  const [isLoading, setIsLoading] = useState(Boolean(trimmedUrl));
  const [hasError, setHasError] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
  }, []);

  if (!trimmedUrl || hasError) {
    return (
      <section
        data-testid={ids.component.contact.embed.root}
        className="flex w-full max-w-[868px] justify-center"
      >
        <ContactEmbedFallback calendlyUrl={trimmedUrl} />
      </section>
    );
  }

  return (
    <section
      data-testid={ids.component.contact.embed.root}
      className="relative w-full max-w-[868px] min-h-[550px]"
    >
      <ContactEmbedSkeleton hidden={!isLoading} />
      <iframe
        src={trimmedUrl}
        title={CALENDLY_IFRAME_TITLE}
        onLoad={handleLoad}
        onError={handleError}
        className={`h-[550px] w-full rounded-[var(--radius-6)] border-0 ${
          isLoading ? 'invisible absolute inset-0' : 'relative'
        }`}
      />
    </section>
  );
}
