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

test.describe('HIW-003 visual — GH#19 teaser', () => {
  const teaser = ids.component.landing.howItWorksTeaser;

  test('hiw teaser desktop 1440px', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/how-it-works');
    await page.getByTestId(teaser.root).scrollIntoViewIfNeeded();
    await expect(page.getByTestId(teaser.root)).toHaveScreenshot('hiw-teaser-desktop.png');
  });

  test('hiw teaser mobile 393px', async ({ page }) => {
    await page.setViewportSize({ width: 393, height: 900 });
    await page.goto('/how-it-works');
    await page.getByTestId(teaser.mobile.sectionRoot).scrollIntoViewIfNeeded();
    await expect(page.getByTestId(teaser.mobile.sectionRoot)).toHaveScreenshot(
      'hiw-teaser-mobile.png',
    );
  });
});

test.describe('HIW-003 visual — GH#20 mid CTA', () => {
  const midCta = ids.component.howItWorks.midCta;

  test('hiw mid cta desktop 1440px', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/how-it-works');
    await page.getByTestId(midCta.root).scrollIntoViewIfNeeded();
    await expect(page.getByTestId(midCta.root)).toHaveScreenshot('hiw-mid-cta-desktop.png');
  });
});
