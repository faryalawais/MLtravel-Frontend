/** Contact page — CP-002 static copy and shared class strings */

export const CONTACT_HERO_HEADLINE = 'Get a live demo of your platform';

export const CONTACT_HERO_SUBHEAD =
  "Pick a time and we'll show you exactly what the switch looks like for your setup.";

export const CONTACT_FALLBACK_HEADING = 'Not ready to book a slot?';

export const CONTACT_FALLBACK_BODY =
  'Send us a few lines about your agency, which GDS you are on, and what you want to change. We will reply within one business day with a view on what switching would actually look like for you.';

export const CALENDLY_IFRAME_TITLE = 'Schedule a discovery call with MaqsoodTravel';

export const EMBED_FALLBACK_MESSAGE =
  'Online scheduling is temporarily unavailable. You can still book a discovery call directly on Calendly.';

export const EMBED_FALLBACK_LINK_LABEL = 'Book via Calendly';

export const CONTACT_FALLBACK_EMAIL = 'hello@maqsoodtravel.com';

/** Figma `5185:4332` — centered column below shared navbar (64px). */
export const CONTACT_PAGE_SHELL_CLASS =
  'flex w-full flex-col items-center gap-[var(--spacing-40)] bg-[var(--color-background-page)] px-[var(--spacing-16)] pb-[var(--spacing-40)] pt-[var(--spacing-24)] lg:px-[var(--spacing-64)]';

/** Figma hero slice `5198:3440` — 755×92 centered copy stack. */
export const CONTACT_HERO_SECTION_CLASS =
  'flex w-full max-w-[755px] flex-col items-center gap-[var(--space-sm)] text-center';

export const CONTACT_HERO_HEADLINE_CLASS =
  'text-display-mobile-lg text-[var(--color-text-primary)] lg:text-display-desktop-lg';

export const CONTACT_HERO_SUBHEAD_CLASS =
  'max-w-[640px] text-body-mobile-md text-[var(--color-text-secondary)] lg:text-body-desktop-md';

/** Figma embed slot `5186:4368` — 868×550 white card with border + radius (`radius.panel`). */
export const CALENDLY_EMBED_MAX_WIDTH_PX = 868;

/** Visible embed height on desktop — matches Figma `5186:4368`. */
export const CALENDLY_EMBED_HEIGHT_PX = 550;

/** Calendly two-column layout requires a ~1100px-wide iframe viewport. */
export const CALENDLY_EMBED_RENDER_WIDTH_PX = 1100;

/** Default render height before `calendly.page_height` postMessage. */
export const CALENDLY_EMBED_RENDER_HEIGHT_PX = 700;

/** Scale 1100px Calendly layout down to the Figma card width. */
export const CALENDLY_EMBED_WIDTH_SCALE =
  CALENDLY_EMBED_MAX_WIDTH_PX / CALENDLY_EMBED_RENDER_WIDTH_PX;

/** Mobile stacked layout may need more room than the Figma desktop slot. */
export const CALENDLY_EMBED_MOBILE_HEIGHT_PX = 720;

export const CONTACT_EMBED_SHELL_CLASS =
  'relative w-full max-w-[868px] overflow-hidden rounded-[var(--radius-panel)] border border-[var(--color-border-default)] bg-[var(--color-background-page)] shadow-[var(--shadow-card-elevated)] lg:w-[868px] lg:max-w-none';

export const CONTACT_EMBED_SHELL_HEIGHT_CLASS = 'h-[720px] lg:h-[550px]';

export const CONTACT_EMBED_SCALED_FRAME_CLASS = 'absolute top-0 left-0 origin-top-left';

export const CONTACT_EMBED_IFRAME_CLASS =
  'block border-0 bg-[var(--color-background-page)]';

export const CONTACT_EMBED_IFRAME_WIDE_CLASS = 'absolute top-0 left-0';

export const CONTACT_EMBED_IFRAME_MOBILE_CLASS = 'absolute inset-0 h-full w-full';

export const CONTACT_EMBED_SKELETON_CLASS =
  'absolute inset-0 animate-pulse bg-[var(--color-surface-muted)]';

export const CONTACT_EMBED_FALLBACK_SHELL_CLASS =
  'absolute inset-0 flex flex-col items-center justify-center gap-[var(--space-md)] px-[var(--spacing-16)] py-[var(--spacing-24)] text-center';

/** Figma fallback slice `5198:3429` — 560×170 centered stack. */
export const CONTACT_FALLBACK_SECTION_CLASS =
  'flex w-full max-w-[560px] flex-col items-center gap-[var(--space-md)] text-center';

export const CONTACT_FALLBACK_COPY_STACK_CLASS =
  'flex w-full flex-col items-center gap-[var(--space-sm)]';

export const CONTACT_FALLBACK_HEADING_CLASS =
  'text-heading-mobile-h2 text-[var(--color-text-primary)] lg:text-heading-desktop-h2';

export const CONTACT_FALLBACK_BODY_CLASS =
  'text-body-mobile-xs text-[var(--color-text-secondary)] lg:text-body-desktop-xs';

export const CONTACT_EMAIL_CTA_CLASS_NAME =
  'inline-flex items-center justify-center gap-[var(--spacing-8)] rounded-[var(--radius-6)] border border-[var(--color-border-brand-navy)] bg-[var(--color-action-secondary-default-background)] px-[var(--spacing-28)] py-[var(--spacing-12)] text-label-mobile-lg text-[var(--color-action-secondary-default-label)] transition-colors hover:bg-[var(--color-action-secondary-hover-background)] hover:text-[var(--color-action-secondary-hover-label)] focus-visible:bg-[var(--color-action-secondary-focused-background)] focus-visible:text-[var(--color-action-secondary-focused-label)] focus-visible:outline focus-visible:outline-[length:var(--spacing-3)] focus-visible:outline-offset-[var(--spacing-3)] focus-visible:outline-[var(--color-action-secondary-focused-border)] lg:text-label-desktop-lg';

/** Calendly inline branding — navy primary matches `color.text.brand.navy`. */
const CALENDLY_EMBED_QUERY = {
  embed_type: 'Inline',
  hide_gdpr_banner: '1',
  background_color: 'ffffff',
  text_color: '101828',
  primary_color: '003d82',
} as const;

export function buildCalendlyEmbedUrl(baseUrl: string, embedDomain?: string): string {
  const trimmed = baseUrl.trim();
  if (!trimmed) {
    return '';
  }

  try {
    const url = new URL(trimmed);
    for (const [key, value] of Object.entries(CALENDLY_EMBED_QUERY)) {
      url.searchParams.set(key, value);
    }
    if (embedDomain) {
      url.searchParams.set('embed_domain', embedDomain);
    }
    return url.toString();
  } catch {
    return trimmed;
  }
}

export function parseCalendlyPageHeightPx(height: string): number | null {
  const parsed = Number.parseInt(height.replace(/px$/i, ''), 10);
  return Number.isFinite(parsed) ? parsed : null;
}

export function resolveCalendlyShellHeightPx(
  isWideLayout: boolean,
  naturalHeightPx: number,
): number {
  if (isWideLayout) {
    const scaledHeightPx = Math.ceil(naturalHeightPx * CALENDLY_EMBED_WIDTH_SCALE);
    return Math.max(CALENDLY_EMBED_HEIGHT_PX, scaledHeightPx);
  }

  return Math.max(naturalHeightPx, CALENDLY_EMBED_MOBILE_HEIGHT_PX);
}
