import { test, expect } from '@playwright/test';
import { ids } from '@/tokens/build/test-ids';

const MAX_DIFF_PIXEL_RATIO = 0.02;

test.describe('LP-001 visual regression', () => {
  test('navbar desktop 1440px', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 200 });
    await page.goto('/');
    await expect(page.getByTestId(ids.component.navbar.root)).toHaveScreenshot(
      'navbar-desktop.png',
      { maxDiffPixelRatio: MAX_DIFF_PIXEL_RATIO },
    );
  });

  test('hero desktop 1440px', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1200 });
    await page.goto('/');
    await expect(page.getByTestId(ids.component.landing.hero.root)).toHaveScreenshot(
      'hero-desktop.png',
      { maxDiffPixelRatio: MAX_DIFF_PIXEL_RATIO },
    );
  });

  test('hero mobile 393px', async ({ page }) => {
    await page.setViewportSize({ width: 393, height: 1200 });
    await page.goto('/');
    await expect(page.getByTestId(ids.component.landing.hero.mobile.root)).toHaveScreenshot(
      'hero-mobile.png',
      { maxDiffPixelRatio: MAX_DIFF_PIXEL_RATIO },
    );
  });
});
