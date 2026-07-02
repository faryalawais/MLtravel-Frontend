import { test, expect } from '@playwright/test';
import { ids } from '@/tokens/build/test-ids';

test.describe('GH#1 — marketing routes', () => {
  test('landing screen is visible at /', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId(ids.screen.landing.home)).toBeVisible();
  });

  test('contact screen resolves', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.getByTestId(ids.screen.contact.page)).toBeVisible();
  });

  test('how-it-works screen resolves', async ({ page }) => {
    await page.goto('/how-it-works');
    await expect(page.getByTestId(ids.screen.howItWorks.page)).toBeVisible();
  });
});

test.describe('GH#3 — Navbar', () => {
  test('navbar visible at 1440px', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await expect(page.getByTestId(ids.component.navbar.root)).toBeVisible();
  });

  test('mobile navbar visible at 393px', async ({ page }) => {
    await page.setViewportSize({ width: 393, height: 844 });
    await page.goto('/');
    await expect(page.getByTestId(ids.component.navbar.mobile.root)).toBeVisible();
  });

  test('How It Works link navigates to /how-it-works', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.getByTestId(ids.component.navbar.howItWorksLink).click();
    await expect(page).toHaveURL(/\/how-it-works/);
  });

  test('Book A Demo CTA navigates to /contact', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.getByTestId(ids.component.navbar.cta).click();
    await expect(page).toHaveURL(/\/contact/);
  });
});

test.describe('GH#4 — Hero', () => {
  test('hero visible at 1440px', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await expect(page.getByTestId(ids.component.landing.hero.root)).toBeVisible();
  });

  test('hero visible at 393px', async ({ page }) => {
    await page.setViewportSize({ width: 393, height: 844 });
    await page.goto('/');
    await expect(page.getByTestId(ids.component.landing.hero.mobile.root)).toBeVisible();
  });

  test('primary CTA navigates to /contact', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.getByTestId(ids.component.landing.hero.cta).click();
    await expect(page).toHaveURL(/\/contact/);
  });
});

test.describe('GH#5 — Problem', () => {
  test('problem section visible at 1440px', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await expect(page.getByTestId(ids.component.landing.problem.root)).toBeVisible();
    await expect(page.getByTestId(ids.component.landing.problem.sectionHeading)).toBeVisible();
    await expect(page.getByTestId(ids.component.landing.problem.card1)).toBeVisible();
  });

  test('problem section visible at 393px', async ({ page }) => {
    await page.setViewportSize({ width: 393, height: 844 });
    await page.goto('/');
    await expect(page.getByTestId(ids.component.landing.problem.mobile.root)).toBeVisible();
    await expect(page.getByTestId(ids.component.landing.problem.mobile.sectionHeading)).toBeVisible();
  });

  test('product nav link scrolls to problem section', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.getByTestId(ids.component.navbar.productLink).click();
    await expect(page.getByTestId(ids.component.landing.problem.root)).toBeInViewport();
  });
});

test.describe('GH#6 — Comparison first', () => {
  test('comparison section visible at 1440px', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1200 });
    await page.goto('/');
    await page.getByTestId(ids.component.landing.comparisonFirst.root).scrollIntoViewIfNeeded();
    await expect(page.getByTestId(ids.component.landing.comparisonFirst.root)).toBeVisible();
    await expect(page.getByTestId(ids.component.landing.comparisonFirst.sectionHeading)).toBeVisible();
    await expect(page.getByTestId(ids.component.landing.comparisonFirst.industryCard)).toBeVisible();
    await expect(page.getByTestId(ids.component.landing.comparisonFirst.maqsoodCard)).toBeVisible();
  });

  test('comparison section visible at 393px', async ({ page }) => {
    await page.setViewportSize({ width: 393, height: 1400 });
    await page.goto('/');
    await page.getByTestId(ids.component.landing.comparisonFirst.mobile.root).scrollIntoViewIfNeeded();
    await expect(page.getByTestId(ids.component.landing.comparisonFirst.mobile.root)).toBeVisible();
    await expect(page.getByTestId(ids.component.landing.comparisonFirst.mobile.sectionHeadingLine1)).toBeVisible();
  });

  test('Book A Free Demo CTA navigates to /contact', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1200 });
    await page.goto('/');
    await page.getByTestId(ids.component.landing.comparisonFirst.root).scrollIntoViewIfNeeded();
    await page.getByTestId(ids.component.landing.comparisonFirst.cta).click();
    await expect(page).toHaveURL(/\/contact/);
  });
});

test.describe('GH#7 — How-it-works teaser', () => {
  test('how-it-works teaser visible at 1440px', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1200 });
    await page.goto('/');
    await page.getByTestId(ids.component.landing.howItWorksTeaser.root).scrollIntoViewIfNeeded();
    await expect(page.getByTestId(ids.component.landing.howItWorksTeaser.root)).toBeVisible();
    await expect(page.getByTestId(ids.component.landing.howItWorksTeaser.sectionHeader)).toBeVisible();
    await expect(page.getByTestId(ids.component.landing.howItWorksTeaser.hiwCard)).toBeVisible();
    await expect(page.getByTestId(ids.component.landing.howItWorksTeaser.hiwCard2)).toBeVisible();
    await expect(page.getByTestId(ids.component.landing.howItWorksTeaser.hiwCard3)).toBeVisible();
  });

  test('how-it-works teaser visible at 393px', async ({ page }) => {
    await page.setViewportSize({ width: 393, height: 1800 });
    await page.goto('/');
    await page.getByTestId(ids.component.landing.howItWorksTeaser.mobile.sectionRoot).scrollIntoViewIfNeeded();
    await expect(page.getByTestId(ids.component.landing.howItWorksTeaser.mobile.sectionRoot)).toBeVisible();
    await expect(page.getByTestId(ids.component.landing.howItWorksTeaser.mobile.hiwStack)).toBeVisible();
    await expect(page.getByTestId(ids.component.landing.howItWorksTeaser.mobile.hiwStack2)).toBeVisible();
    await expect(page.getByTestId(ids.component.landing.howItWorksTeaser.mobile.hiwStack3)).toBeVisible();
  });

  test('footer link navigates to /how-it-works', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1200 });
    await page.goto('/');
    await page.getByTestId(ids.component.landing.howItWorksTeaser.root).scrollIntoViewIfNeeded();
    await page.getByTestId(ids.component.landing.howItWorksTeaser.textBlock21).click();
    await expect(page).toHaveURL(/\/how-it-works/);
  });
});

test.describe('GH#10 — Feature grid', () => {
  test('feature grid visible at 1440px', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1400 });
    await page.goto('/');
    await page.getByTestId(ids.component.landing.featureGrid.root).scrollIntoViewIfNeeded();
    await expect(page.getByTestId(ids.component.landing.featureGrid.root)).toBeVisible();
    await expect(page.getByTestId(ids.component.landing.featureGrid.headingline1)).toBeVisible();
    await expect(page.getByTestId(ids.component.landing.featureGrid.featureCard)).toBeVisible();
    await expect(page.getByTestId(ids.component.landing.featureGrid.featureCard6)).toBeVisible();
  });

  test('feature grid visible at 393px', async ({ page }) => {
    await page.setViewportSize({ width: 393, height: 2200 });
    await page.goto('/');
    await page.getByTestId(ids.component.landing.featureGrid.mobile.root).scrollIntoViewIfNeeded();
    await expect(page.getByTestId(ids.component.landing.featureGrid.mobile.root)).toBeVisible();
    await expect(page.getByTestId(ids.component.landing.featureGrid.mobile.builtForSpeedPrecision)).toBeVisible();
    await expect(page.getByTestId(ids.component.landing.featureGrid.mobile.featureCard)).toBeVisible();
  });

  test('Start Building Now CTA navigates to /contact', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1400 });
    await page.goto('/');
    await page.getByTestId(ids.component.landing.featureGrid.root).scrollIntoViewIfNeeded();
    await page.getByTestId(ids.component.landing.featureGrid.cta).click();
    await expect(page).toHaveURL(/\/contact/);
  });
});

test.describe('GH#9 — Social proof', () => {
  test('social proof visible at 1440px', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1400 });
    await page.goto('/');
    await page.getByTestId(ids.component.landing.socialProof.root).scrollIntoViewIfNeeded();
    await expect(page.getByTestId(ids.component.landing.socialProof.root)).toBeVisible();
    await expect(page.getByTestId(ids.component.landing.socialProof.testimonialsRow)).toBeVisible();
    await expect(page.getByTestId(ids.component.landing.socialProof.testimonialBlock)).toBeVisible();
    await expect(page.getByTestId(ids.component.landing.socialProof.testimonialBlock2)).toBeVisible();
    await expect(page.getByTestId(ids.component.landing.socialProof.slideProgressBar)).toBeVisible();
    await expect(page.getByTestId(ids.component.landing.socialProof.integrationsStrip)).toBeVisible();
  });

  test('social proof visible at 393px', async ({ page }) => {
    await page.setViewportSize({ width: 393, height: 2000 });
    await page.goto('/');
    await page.getByTestId(ids.component.landing.socialProof.mobile.root).scrollIntoViewIfNeeded();
    await expect(page.getByTestId(ids.component.landing.socialProof.mobile.root)).toBeVisible();
    await expect(page.getByTestId(ids.component.landing.socialProof.mobile.builtForFounders)).toBeVisible();
    await expect(page.getByTestId(ids.component.landing.socialProof.mobile.frame2095585138)).toBeVisible();
    await expect(page.getByTestId(ids.component.landing.socialProof.mobile.frame2095585139)).toBeVisible();
  });
});

test.describe('GH#11 — Pricing', () => {
  test('pricing section visible at 1440px', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1200 });
    await page.goto('/');
    await page.getByTestId(ids.component.landing.pricing.root).scrollIntoViewIfNeeded();
    await expect(page.getByTestId(ids.component.landing.pricing.root)).toBeVisible();
    await expect(page.getByTestId(ids.component.landing.pricing.pricingCard)).toBeVisible();
    await expect(page.getByTestId(ids.component.landing.pricing.routeStrip)).toBeVisible();
    await expect(page.getByTestId(ids.component.landing.pricing.trustStrip)).toBeVisible();
    await expect(page.getByTestId(ids.component.landing.pricing.cta)).toBeVisible();
    await expect(page.locator('#pricing')).toBeVisible();
  });

  test('pricing section visible at 393px', async ({ page }) => {
    await page.setViewportSize({ width: 393, height: 2000 });
    await page.goto('/');
    await page.getByTestId(ids.component.landing.pricing.mobile.root).scrollIntoViewIfNeeded();
    await expect(page.getByTestId(ids.component.landing.pricing.mobile.root)).toBeVisible();
    await expect(page.getByTestId(ids.component.landing.pricing.mobile.pricingCard)).toBeVisible();
    await expect(page.getByTestId(ids.component.landing.pricing.mobile.routeStrip)).toBeVisible();
    await expect(page.getByTestId(ids.component.landing.pricing.mobile.cta)).toBeVisible();
    await expect(page.locator('#pricing')).toBeVisible();
  });

  test('Book A Demo CTA navigates to /contact', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1200 });
    await page.goto('/');
    await page.getByTestId(ids.component.landing.pricing.root).scrollIntoViewIfNeeded();
    await page.getByTestId(ids.component.landing.pricing.cta).click();
    await expect(page).toHaveURL(/\/contact/);
  });
});
