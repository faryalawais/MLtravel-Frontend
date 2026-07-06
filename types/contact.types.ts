/** Contact page (`/contact`) — CP-002 */

export interface ContactPageProps {
  searchParams: Promise<{ e2e_no_calendly?: string }>;
}

export interface ContactEmbedSectionProps {
  calendlyUrl: string;
}

export interface ContactFallbackSectionProps {
  contactEmail: string;
}
