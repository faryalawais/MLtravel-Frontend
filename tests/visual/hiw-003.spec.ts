import { test, expect } from '@playwright/test';
import { ids } from '@/tokens/build/test-ids';

test.describe('HIW-003 visual — GH#18 hero', () => {
  test('hiw hero desktop 1440px', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/how-it-works');
    await page.getByTestId(ids.component.howItWorks.hero.root).scrollIntoViewIfNeeded();
    await expect(page.getByTestId(ids.component.howItWorks.hero.root)).toHaveScreenshot(
      'hiw-hero-desktop.png',
    );
  });

  test('hiw hero mobile 393px', async ({ page }) => {
    await page.setViewportSize({ width: 393, height: 900 });
    await page.goto('/how-it-works');
    await page.getByTestId(ids.component.landing.hero.root).scrollIntoViewIfNeeded();
    await expect(page.getByTestId(ids.component.landing.hero.root)).toHaveScreenshot(
      'hiw-hero-mobile.png',
    );
  });
});
