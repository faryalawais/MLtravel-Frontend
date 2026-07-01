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
