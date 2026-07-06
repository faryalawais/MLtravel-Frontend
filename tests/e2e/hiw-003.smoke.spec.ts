import { test, expect } from '@playwright/test';
import { ids } from '@/tokens/build/test-ids';

const screen = ids.screen.howItWorks.page;
const hiwHero = ids.component.howItWorks.hero;
const landingHero = ids.component.landing.hero;

test.describe('HIW-003 smoke', () => {
  test('GH#18 — desktop HIW hero at 1440px', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/how-it-works');

    await expect(page.getByTestId(screen)).toBeVisible();
    await expect(page.getByTestId(ids.component.navbar.root)).toBeVisible();
    await expect(page.getByTestId(ids.component.footer.root)).toBeVisible();
    await expect(page.getByTestId(hiwHero.root)).toBeVisible();

    const heroBox = await page.getByTestId(hiwHero.root).boundingBox();
    expect(heroBox).not.toBeNull();
    expect(heroBox!.width).toBeGreaterThan(0);
    expect(heroBox!.height).toBeGreaterThan(0);

    await page.getByTestId(hiwHero.demoCta).click();
    await expect(page).toHaveURL(/\/contact/);
  });

  test('GH#18 — mobile hiw-page hero at 393px', async ({ page }) => {
    await page.setViewportSize({ width: 393, height: 900 });
    await page.goto('/how-it-works');

    await expect(page.getByTestId(screen)).toBeVisible();
    await expect(page.getByTestId(hiwHero.root)).toBeHidden();

    const mobileHero = page.getByTestId(landingHero.root);
    await expect(mobileHero).toBeVisible();
    await expect(mobileHero).toHaveAttribute('data-layout', 'hiw-page');
    await expect(page.getByTestId(landingHero.statsStrip)).toBeVisible();
    await expect(page.getByTestId(landingHero.productImage)).toBeHidden();
    await expect(page.getByTestId(landingHero.logosStrip)).toBeHidden();
    await expect(page.getByTestId(landingHero.secondaryCta)).toBeHidden();

    await page.getByTestId(landingHero.mobile.cta).click();
    await expect(page).toHaveURL(/\/contact/);
  });
});
