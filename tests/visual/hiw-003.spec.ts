import { test, expect } from '@playwright/test';
import { ids } from '@/tokens/build/test-ids';

/** Fidelity tolerance per `features/HIW-003/contract.md` §11. */
const MAX_DIFF_PIXEL_RATIO = 0.02;

const sliceScreenshotOptions = {
  maxDiffPixelRatio: MAX_DIFF_PIXEL_RATIO,
} as const;

test.describe('HIW-003 visual — GH#18 hero', () => {
  test('hiw hero desktop 1440px', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/how-it-works');
    await page.getByTestId(ids.component.howItWorks.hero.root).scrollIntoViewIfNeeded();
    await expect(page.getByTestId(ids.component.howItWorks.hero.root)).toHaveScreenshot(
      'hiw-hero-desktop.png',
      sliceScreenshotOptions,
    );
  });

  test('hiw hero mobile 393px', async ({ page }) => {
    await page.setViewportSize({ width: 393, height: 900 });
    await page.goto('/how-it-works');
    await page.getByTestId(ids.component.landing.hero.root).scrollIntoViewIfNeeded();
    await expect(page.getByTestId(ids.component.landing.hero.root)).toHaveScreenshot(
      'hiw-hero-mobile.png',
      sliceScreenshotOptions,
    );
  });
});

test.describe('HIW-003 visual — GH#19 teaser', () => {
  const teaser = ids.component.landing.howItWorksTeaser;

  test('hiw teaser desktop 1440px', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/how-it-works');
    await page.getByTestId(teaser.root).scrollIntoViewIfNeeded();
    await expect(page.getByTestId(teaser.root)).toHaveScreenshot(
      'hiw-teaser-desktop.png',
      sliceScreenshotOptions,
    );
  });

  test('hiw teaser mobile 393px', async ({ page }) => {
    await page.setViewportSize({ width: 393, height: 900 });
    await page.goto('/how-it-works');
    await page.getByTestId(teaser.mobile.sectionRoot).scrollIntoViewIfNeeded();
    await expect(page.getByTestId(teaser.mobile.sectionRoot)).toHaveScreenshot(
      'hiw-teaser-mobile.png',
      sliceScreenshotOptions,
    );
  });
});

test.describe('HIW-003 visual — GH#20 mid CTA', () => {
  const midCta = ids.component.howItWorks.midCta;

  test('hiw mid cta desktop 1440px', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/how-it-works');
    await page.getByTestId(midCta.root).scrollIntoViewIfNeeded();
    await expect(page.getByTestId(midCta.root)).toHaveScreenshot(
      'hiw-mid-cta-desktop.png',
      sliceScreenshotOptions,
    );
  });
});

test.describe('HIW-003 visual — GH#21 six-week timeline', () => {
  const sixWeek = ids.component.howItWorks.sixWeek;

  test('hiw six-week desktop 1440px', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/how-it-works');
    await page.getByTestId(sixWeek.onboardingSection).scrollIntoViewIfNeeded();
    await expect(page.getByTestId(sixWeek.onboardingSection)).toHaveScreenshot(
      'hiw-six-week-desktop.png',
      sliceScreenshotOptions,
    );
  });

  test('hiw six-week mobile 393px', async ({ page }) => {
    await page.setViewportSize({ width: 393, height: 900 });
    await page.goto('/how-it-works');
    await page.getByTestId(sixWeek.mobile).scrollIntoViewIfNeeded();
    await expect(page.getByTestId(sixWeek.mobile)).toHaveScreenshot(
      'hiw-six-week-mobile.png',
      sliceScreenshotOptions,
    );
  });
});

test.describe('HIW-003 visual — GH#22 social proof strip', () => {
  const mobileSocialStrip = ids.component.howItWorks.mobileSocialStrip;
  const socialProofStrip = ids.component.howItWorks.sixWeek.socialProofStrip;

  test('hiw mobile social strip 393px', async ({ page }) => {
    await page.setViewportSize({ width: 393, height: 900 });
    await page.goto('/how-it-works');
    await page.getByTestId(mobileSocialStrip.root).scrollIntoViewIfNeeded();
    await expect(page.getByTestId(mobileSocialStrip.root)).toHaveScreenshot(
      'hiw-mobile-social-strip.png',
      sliceScreenshotOptions,
    );
  });

  test('hiw desktop social proof strip 1440px', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/how-it-works');
    await page.getByTestId(socialProofStrip).scrollIntoViewIfNeeded();
    await expect(page.getByTestId(socialProofStrip)).toHaveScreenshot(
      'hiw-desktop-social-proof-strip.png',
      sliceScreenshotOptions,
    );
  });
});

test.describe('HIW-003 visual — GH#24 final CTA', () => {
  const finalCta = ids.component.howItWorks.finalCta;

  test('hiw final cta desktop 1440px', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/how-it-works');
    await page.getByTestId(finalCta.root).scrollIntoViewIfNeeded();
    await expect(page.getByTestId(finalCta.root)).toHaveScreenshot(
      'hiw-final-cta-desktop.png',
      sliceScreenshotOptions,
    );
  });

  test('hiw final cta mobile 393px', async ({ page }) => {
    await page.setViewportSize({ width: 393, height: 900 });
    await page.goto('/how-it-works');
    await page.getByTestId(finalCta.root).scrollIntoViewIfNeeded();
    await expect(page.getByTestId(finalCta.root)).toHaveScreenshot(
      'hiw-final-cta-mobile.png',
      sliceScreenshotOptions,
    );
  });
});

test.describe('HIW-003 visual — GH#25 FAQ', () => {
  const faq = ids.component.howItWorks.faq;

  test('hiw faq desktop 1440px', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/how-it-works');
    await page.getByTestId(faq.root).scrollIntoViewIfNeeded();
    await expect(page.getByTestId(faq.root)).toHaveScreenshot(
      'hiw-faq-desktop.png',
      sliceScreenshotOptions,
    );
  });

  test('hiw faq mobile 393px', async ({ page }) => {
    await page.setViewportSize({ width: 393, height: 900 });
    await page.goto('/how-it-works');
    await page.getByTestId(faq.root).scrollIntoViewIfNeeded();
    await expect(page.getByTestId(faq.root)).toHaveScreenshot(
      'hiw-faq-mobile.png',
      sliceScreenshotOptions,
    );
  });

  test('hiw full page mobile 393px', async ({ page }) => {
    await page.setViewportSize({ width: 393, height: 900 });
    await page.goto('/how-it-works');
    await page.getByTestId(faq.root).scrollIntoViewIfNeeded();
    await expect(page).toHaveScreenshot('hiw-full-page-mobile.png', {
      ...sliceScreenshotOptions,
      fullPage: true,
    });
  });
});
