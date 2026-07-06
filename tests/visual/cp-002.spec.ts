import { test, expect } from '@playwright/test';
import { ids } from '@/tokens/build/test-ids';

const MAX_DIFF_PIXEL_RATIO = 0.02;

const contact = ids.component.contact;

test.describe('CP-002 visual regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact', { waitUntil: 'domcontentloaded' });
  });

  test('contact hero desktop 1440px', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await expect(page.getByTestId(contact.hero.root)).toHaveScreenshot('contact-hero-desktop.png', {
      maxDiffPixelRatio: MAX_DIFF_PIXEL_RATIO,
    });
  });

  test('contact hero mobile 393px', async ({ page }) => {
    await page.setViewportSize({ width: 393, height: 900 });
    await expect(page.getByTestId(contact.hero.root)).toHaveScreenshot('contact-hero-mobile.png', {
      maxDiffPixelRatio: MAX_DIFF_PIXEL_RATIO,
    });
  });

  test('contact embed container desktop 1440px', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const embed = page.getByTestId(contact.embed.root);
    await embed.scrollIntoViewIfNeeded();
    await expect(embed).toHaveScreenshot('contact-embed-desktop.png', {
      maxDiffPixelRatio: MAX_DIFF_PIXEL_RATIO,
      mask: [embed.locator('iframe')],
    });
  });

  test('contact embed container mobile 393px', async ({ page }) => {
    await page.setViewportSize({ width: 393, height: 1200 });
    const embed = page.getByTestId(contact.embed.root);
    await embed.scrollIntoViewIfNeeded();
    await expect(embed).toHaveScreenshot('contact-embed-mobile.png', {
      maxDiffPixelRatio: MAX_DIFF_PIXEL_RATIO,
      mask: [embed.locator('iframe')],
    });
  });

  test('contact fallback desktop 1440px', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const fallback = page.getByTestId(contact.fallback.root);
    await fallback.scrollIntoViewIfNeeded();
    await expect(fallback).toHaveScreenshot('contact-fallback-desktop.png', {
      maxDiffPixelRatio: MAX_DIFF_PIXEL_RATIO,
    });
  });

  test('contact fallback mobile 393px', async ({ page }) => {
    await page.setViewportSize({ width: 393, height: 1200 });
    const fallback = page.getByTestId(contact.fallback.root);
    await fallback.scrollIntoViewIfNeeded();
    await expect(fallback).toHaveScreenshot('contact-fallback-mobile.png', {
      maxDiffPixelRatio: MAX_DIFF_PIXEL_RATIO,
    });
  });

  test('contact page desktop 1440px', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1200 });
    await expect(page.getByTestId(ids.screen.contact.page)).toHaveScreenshot(
      'contact-page-desktop.png',
      {
        maxDiffPixelRatio: MAX_DIFF_PIXEL_RATIO,
        mask: [page.locator('iframe')],
        fullPage: true,
      },
    );
  });
});
