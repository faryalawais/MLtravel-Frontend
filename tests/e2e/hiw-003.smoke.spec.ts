import { test, expect } from '@playwright/test';
import { ids } from '@/tokens/build/test-ids';

const screen = ids.screen.howItWorks.page;
const hiwHero = ids.component.howItWorks.hero;
const landingHero = ids.component.landing.hero;
const teaser = ids.component.landing.howItWorksTeaser;

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

  test('GH#19 — desktop teaser without footer link at 1440px', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/how-it-works');

    await page.getByTestId(teaser.root).scrollIntoViewIfNeeded();
    await expect(page.getByTestId(teaser.root)).toBeVisible();
    await expect(page.getByTestId(teaser.sectionHeader)).toBeVisible();
    await expect(page.getByTestId(teaser.hiwCard)).toBeVisible();
    await expect(page.getByTestId(teaser.footerNote)).toBeHidden();
    await expect(page.getByTestId(teaser.motion.footerNote)).toBeHidden();
    await expect(page.getByTestId(teaser.textBlock21)).toHaveText(
      'All three steps completed within your 6-week onboarding.',
    );
  });

  test('GH#19 — mobile teaser without footer link at 393px', async ({ page }) => {
    await page.setViewportSize({ width: 393, height: 900 });
    await page.goto('/how-it-works');

    await page.getByTestId(teaser.mobile.sectionRoot).scrollIntoViewIfNeeded();
    await expect(page.getByTestId(teaser.mobile.sectionRoot)).toBeVisible();
    await expect(page.getByTestId(teaser.mobile.hiwStack)).toBeVisible();
    await expect(page.getByTestId(teaser.footerNote)).toBeHidden();
    await expect(page.getByTestId(teaser.motion.footerNote)).toBeHidden();
    await expect(page.getByTestId(teaser.textBlock21)).toHaveText(
      'All three steps completed within your 6-week onboarding.',
    );
  });

  test('GH#20 — desktop mid CTA at 1440px', async ({ page }) => {
    const midCta = ids.component.howItWorks.midCta;

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/how-it-works');

    await page.getByTestId(midCta.root).scrollIntoViewIfNeeded();
    await expect(page.getByTestId(midCta.root)).toBeVisible();
    await expect(page.getByTestId(midCta.copy)).toHaveText(
      "Seen enough? Let's show you a live demo.",
    );
    await page.getByTestId(midCta.demoCta).click();
    await expect(page).toHaveURL(/\/contact/);
  });

  test('GH#20 — mid CTA hidden on mobile at 393px', async ({ page }) => {
    const midCta = ids.component.howItWorks.midCta;

    await page.setViewportSize({ width: 393, height: 900 });
    await page.goto('/how-it-works');

    await expect(page.getByTestId(midCta.root)).toBeHidden();
  });
});
