'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  buildCalendlyEmbedUrl,
  CALENDLY_EMBED_RENDER_HEIGHT_PX,
  CALENDLY_EMBED_RENDER_WIDTH_PX,
  CALENDLY_EMBED_WIDTH_SCALE,
  CALENDLY_IFRAME_TITLE,
  CONTACT_EMBED_FALLBACK_SHELL_CLASS,
  CONTACT_EMBED_IFRAME_CLASS,
  CONTACT_EMBED_IFRAME_MOBILE_CLASS,
  CONTACT_EMBED_IFRAME_WIDE_CLASS,
  CONTACT_EMBED_SCALED_FRAME_CLASS,
  CONTACT_EMBED_SHELL_CLASS,
  CONTACT_EMBED_SHELL_HEIGHT_CLASS,
  CONTACT_EMBED_SKELETON_CLASS,
  EMBED_FALLBACK_LINK_LABEL,
  EMBED_FALLBACK_MESSAGE,
  parseCalendlyPageHeightPx,
  resolveCalendlyShellHeightPx,
} from '@/constants/contact.constants';
import { useSectionEntranceMotion } from '@/lib/use-one-way-motion';
import { ids } from '@/tokens/build/test-ids';
import type { CalendlyPageHeightMessage, ContactEmbedSectionProps } from '@/types/contact.types';

const WIDE_EMBED_MEDIA_QUERY = '(min-width: 1024px)';

function isCalendlyOrigin(origin: string): boolean {
  try {
    return new URL(origin).hostname.endsWith('calendly.com');
  } catch {
    return false;
  }
}

function ContactEmbedSkeleton({ hidden }: { hidden: boolean }) {
  return (
    <div
      data-testid={ids.component.contact.embedSkeleton.root}
      className={`${CONTACT_EMBED_SKELETON_CLASS} ${hidden ? 'hidden' : ''}`}
      aria-hidden={hidden}
    />
  );
}

function ContactEmbedFallback({ calendlyUrl }: { calendlyUrl: string }) {
  const href = calendlyUrl || 'https://calendly.com';

  return (
    <div
      data-testid={ids.component.contact.embedFallback.root}
      className={CONTACT_EMBED_FALLBACK_SHELL_CLASS}
    >
      <p className="text-body-mobile-md text-[var(--color-text-secondary)] lg:text-body-desktop-md">
        {EMBED_FALLBACK_MESSAGE}
      </p>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-body-mobile-md text-[var(--color-text-brand-navy)] underline lg:text-body-desktop-md"
      >
        {EMBED_FALLBACK_LINK_LABEL}
      </a>
    </div>
  );
}

export function ContactEmbedSection({ calendlyUrl }: ContactEmbedSectionProps) {
  const { rootRef, triggerMotion, entranceStyle } = useSectionEntranceMotion();
  const trimmedUrl = calendlyUrl.trim();
  const [embedUrl, setEmbedUrl] = useState('');
  const [isWideLayout, setIsWideLayout] = useState(false);
  const [naturalHeightPx, setNaturalHeightPx] = useState(CALENDLY_EMBED_RENDER_HEIGHT_PX);
  const [isLoading, setIsLoading] = useState(Boolean(trimmedUrl));
  const [hasError, setHasError] = useState(false);

  const shellHeightPx = resolveCalendlyShellHeightPx(isWideLayout, naturalHeightPx);
  const shellHeightClass = isWideLayout ? '' : CONTACT_EMBED_SHELL_HEIGHT_CLASS;
  const entrance = entranceStyle({ animateOpacity: false });

  useEffect(() => {
    if (!trimmedUrl) {
      setEmbedUrl('');
      setIsLoading(false);
      return;
    }

    setEmbedUrl(buildCalendlyEmbedUrl(trimmedUrl, window.location.host));
    setNaturalHeightPx(CALENDLY_EMBED_RENDER_HEIGHT_PX);
    setIsLoading(true);
    setHasError(false);
  }, [trimmedUrl]);

  useEffect(() => {
    const mediaQuery = window.matchMedia(WIDE_EMBED_MEDIA_QUERY);
    const updateLayout = () => setIsWideLayout(mediaQuery.matches);
    updateLayout();
    mediaQuery.addEventListener('change', updateLayout);
    return () => mediaQuery.removeEventListener('change', updateLayout);
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!isCalendlyOrigin(event.origin)) {
        return;
      }

      const data = event.data as Partial<CalendlyPageHeightMessage>;
      if (data.event !== 'calendly.page_height' || !data.payload?.height) {
        return;
      }

      const nextHeight = parseCalendlyPageHeightPx(data.payload.height);
      if (nextHeight === null) {
        return;
      }

      setNaturalHeightPx(nextHeight);
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
  }, []);

  if (!trimmedUrl || !embedUrl || hasError) {
    return (
      <section
        ref={rootRef}
        data-testid={ids.component.contact.embed.root}
        className={`${CONTACT_EMBED_SHELL_CLASS} ${CONTACT_EMBED_SHELL_HEIGHT_CLASS}`}
        style={entrance}
        onMouseEnter={triggerMotion}
      >
        <ContactEmbedFallback calendlyUrl={trimmedUrl} />
      </section>
    );
  }

  return (
    <section
      ref={rootRef}
      data-testid={ids.component.contact.embed.root}
      className={`${CONTACT_EMBED_SHELL_CLASS} ${shellHeightClass}`}
      style={{
        ...entrance,
        ...(isWideLayout ? { height: `${shellHeightPx}px` } : null),
      }}
      onMouseEnter={triggerMotion}
    >
      <ContactEmbedSkeleton hidden={!isLoading} />
      {isWideLayout ? (
        <div
          className={`${CONTACT_EMBED_SCALED_FRAME_CLASS} ${
            isLoading ? 'invisible' : ''
          }`}
          style={{
            width: `${CALENDLY_EMBED_RENDER_WIDTH_PX}px`,
            height: `${naturalHeightPx}px`,
            transform: `scale(${CALENDLY_EMBED_WIDTH_SCALE})`,
          }}
        >
          <iframe
            src={embedUrl}
            title={CALENDLY_IFRAME_TITLE}
            onLoad={handleLoad}
            onError={handleError}
            scrolling="no"
            width={CALENDLY_EMBED_RENDER_WIDTH_PX}
            height={naturalHeightPx}
            style={{ width: `${CALENDLY_EMBED_RENDER_WIDTH_PX}px`, height: `${naturalHeightPx}px` }}
            className={`${CONTACT_EMBED_IFRAME_CLASS} ${CONTACT_EMBED_IFRAME_WIDE_CLASS}`}
          />
        </div>
      ) : (
        <iframe
          src={embedUrl}
          title={CALENDLY_IFRAME_TITLE}
          onLoad={handleLoad}
          onError={handleError}
          scrolling="no"
          className={`${CONTACT_EMBED_IFRAME_CLASS} ${CONTACT_EMBED_IFRAME_MOBILE_CLASS} ${
            isLoading ? 'invisible' : ''
          }`}
        />
      )}
    </section>
  );
}
