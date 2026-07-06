import { test, expect } from '@playwright/test';
import { ids } from '@/tokens/build/test-ids';
import { expectTypography } from './helpers/typography';

const contact = ids.component.contact;

/** Figma-verified typography from features/CP-002/figma/spec.json */
const CP002_TYPOGRAPHY = {
  heroHeading: { fontSize: 48, fontWeight: '700' },
  heroSubhead: { fontSize: 16, fontWeight: '400' },
  fallbackHeading: { fontSize: 26, fontWeight: '700' },
  fallbackBody: { fontSize: 14, fontWeight: '400' },
  emailCtaLabel: { fontSize: 16, fontWeight: '600' },
} as const;

test.describe('CP-002 dimensions and typography', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact', { waitUntil: 'domcontentloaded' });
  });

  test('hero typography desktop 1440px', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await expectTypography(
      page.getByTestId(contact.hero.heading),
      CP002_TYPOGRAPHY.heroHeading,
    );
    await expectTypography(
      page.getByTestId(contact.hero.subhead),
      CP002_TYPOGRAPHY.heroSubhead,
    );
  });

  test('fallback typography desktop 1440px', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.getByTestId(contact.fallback.root).scrollIntoViewIfNeeded();
    await expectTypography(
      page.getByTestId(contact.fallback.heading),
      CP002_TYPOGRAPHY.fallbackHeading,
    );
    await expectTypography(
      page.getByTestId(contact.fallback.body),
      CP002_TYPOGRAPHY.fallbackBody,
    );
    await expectTypography(
      page.getByTestId(contact.fallback.emailCta),
      CP002_TYPOGRAPHY.emailCtaLabel,
    );
  });

  test('embed container dimensions desktop 1440px', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const embed = page.getByTestId(contact.embed.root);
    await embed.scrollIntoViewIfNeeded();
    const box = await embed.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThanOrEqual(864);
    expect(box!.width).toBeLessThanOrEqual(872);
    expect(box!.height).toBeGreaterThanOrEqual(546);
    expect(box!.height).toBeLessThanOrEqual(554);
  });

  test('fallback block dimensions desktop 1440px', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const fallback = page.getByTestId(contact.fallback.root);
    await fallback.scrollIntoViewIfNeeded();
    const box = await fallback.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThanOrEqual(556);
    expect(box!.width).toBeLessThanOrEqual(564);

    const ctaBox = await page.getByTestId(contact.fallback.emailCta).boundingBox();
    expect(ctaBox).not.toBeNull();
    expect(ctaBox!.height).toBeGreaterThanOrEqual(44);
    expect(ctaBox!.height).toBeLessThanOrEqual(52);
  });
});
