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

  test('problem desktop 1440px', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.getByTestId(ids.component.landing.problem.root).scrollIntoViewIfNeeded();
    await expect(page.getByTestId(ids.component.landing.problem.root)).toHaveScreenshot(
      'problem-desktop.png',
      { maxDiffPixelRatio: MAX_DIFF_PIXEL_RATIO },
    );
  });

  test('problem mobile 393px', async ({ page }) => {
    await page.setViewportSize({ width: 393, height: 1400 });
    await page.goto('/');
    await page.getByTestId(ids.component.landing.problem.mobile.root).scrollIntoViewIfNeeded();
    await expect(page.getByTestId(ids.component.landing.problem.mobile.root)).toHaveScreenshot(
      'problem-mobile.png',
      { maxDiffPixelRatio: MAX_DIFF_PIXEL_RATIO },
    );
  });

  test('comparison desktop 1440px', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1100 });
    await page.goto('/');
    await page.getByTestId(ids.component.landing.comparisonFirst.root).scrollIntoViewIfNeeded();
    await expect(page.getByTestId(ids.component.landing.comparisonFirst.root)).toHaveScreenshot(
      'comparison-first-desktop.png',
      { maxDiffPixelRatio: MAX_DIFF_PIXEL_RATIO },
    );
  });

  test('comparison mobile 393px', async ({ page }) => {
    await page.setViewportSize({ width: 393, height: 2200 });
    await page.goto('/');
    await page.getByTestId(ids.component.landing.comparisonFirst.mobile.root).scrollIntoViewIfNeeded();
    await expect(page.getByTestId(ids.component.landing.comparisonFirst.mobile.root)).toHaveScreenshot(
      'comparison-first-mobile.png',
      { maxDiffPixelRatio: MAX_DIFF_PIXEL_RATIO },
    );
  });

  test('how-it-works teaser desktop 1440px', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.getByTestId(ids.component.landing.howItWorksTeaser.root).scrollIntoViewIfNeeded();
    await expect(page.getByTestId(ids.component.landing.howItWorksTeaser.root)).toHaveScreenshot(
      'how-it-works-teaser-desktop.png',
      { maxDiffPixelRatio: MAX_DIFF_PIXEL_RATIO },
    );
  });

  test('how-it-works teaser mobile 393px', async ({ page }) => {
    await page.setViewportSize({ width: 393, height: 1800 });
    await page.goto('/');
    await page.getByTestId(ids.component.landing.howItWorksTeaser.mobile.sectionRoot).scrollIntoViewIfNeeded();
    await expect(page.getByTestId(ids.component.landing.howItWorksTeaser.mobile.sectionRoot)).toHaveScreenshot(
      'how-it-works-teaser-mobile.png',
      { maxDiffPixelRatio: MAX_DIFF_PIXEL_RATIO },
    );
  });

  test('feature grid desktop 1440px', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1400 });
    await page.goto('/');
    await page.getByTestId(ids.component.landing.featureGrid.root).scrollIntoViewIfNeeded();
    await expect(page.getByTestId(ids.component.landing.featureGrid.root)).toHaveScreenshot(
      'feature-grid-desktop.png',
      { maxDiffPixelRatio: MAX_DIFF_PIXEL_RATIO },
    );
  });

  test('feature grid mobile 393px', async ({ page }) => {
    await page.setViewportSize({ width: 393, height: 2200 });
    await page.goto('/');
    await page.getByTestId(ids.component.landing.featureGrid.mobile.root).scrollIntoViewIfNeeded();
    await expect(page.getByTestId(ids.component.landing.featureGrid.mobile.root)).toHaveScreenshot(
      'feature-grid-mobile.png',
      { maxDiffPixelRatio: MAX_DIFF_PIXEL_RATIO },
    );
  });

  test('social proof desktop 1440px', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1200 });
    await page.goto('/');
    await page.getByTestId(ids.component.landing.socialProof.root).scrollIntoViewIfNeeded();
    await expect(page.getByTestId(ids.component.landing.socialProof.root)).toHaveScreenshot(
      'social-proof-desktop.png',
      { maxDiffPixelRatio: MAX_DIFF_PIXEL_RATIO },
    );
  });

  test('social proof mobile 393px', async ({ page }) => {
    await page.setViewportSize({ width: 393, height: 1800 });
    await page.goto('/');
    await page.getByTestId(ids.component.landing.socialProof.mobile.root).scrollIntoViewIfNeeded();
    await expect(page.getByTestId(ids.component.landing.socialProof.mobile.root)).toHaveScreenshot(
      'social-proof-mobile.png',
      { maxDiffPixelRatio: MAX_DIFF_PIXEL_RATIO },
    );
  });

  test('pricing desktop 1440px', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1200 });
    await page.goto('/');
    await page.getByTestId(ids.component.landing.pricing.root).scrollIntoViewIfNeeded();
    await expect(page.getByTestId(ids.component.landing.pricing.root)).toHaveScreenshot(
      'pricing-desktop.png',
      { maxDiffPixelRatio: MAX_DIFF_PIXEL_RATIO },
    );
  });

  test('pricing mobile 393px', async ({ page }) => {
    await page.setViewportSize({ width: 393, height: 2000 });
    await page.goto('/');
    await page.getByTestId(ids.component.landing.pricing.mobile.root).scrollIntoViewIfNeeded();
    await expect(page.getByTestId(ids.component.landing.pricing.mobile.root)).toHaveScreenshot(
      'pricing-mobile.png',
      { maxDiffPixelRatio: MAX_DIFF_PIXEL_RATIO },
    );
  });
});
