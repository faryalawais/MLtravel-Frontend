import { test, expect } from '@playwright/test';
import pricingFixture from '../../features/LP-001/fixtures/pricing-motion.fixture.json';
import { ids } from '@/tokens/build/test-ids';
import { getDurationTokenMs } from '@/lib/motion-tokens';
import { PRICING_MOTION_MAIN_GROUP_OFFSET_PX } from '@/constants/motion.constants';
import { expectTranslateY, isTranslateYNear, parseTranslateY } from './helpers/transform';

const pr = ids.component.landing.pricing;
const DESKTOP_WIDTH = 1440;

async function getMainGroupTranslateY(page: import('@playwright/test').Page): Promise<number> {
  const transform = await page.getByTestId(pr.maingroup).evaluate((el) => getComputedStyle(el).transform);
  return parseTranslateY(transform);
}

test.describe('GH#11 — Pricing motion (fixture)', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: DESKTOP_WIDTH, height: 1200 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('fixture documents 2 states and simple-one-step transition', () => {
    expect(pricingFixture.figmaStates).toHaveLength(2);
    expect(pricingFixture.transitions).toHaveLength(1);
    expect(pricingFixture.transitions[0].trigger).toBe('MOUSE_ENTER');
    expect(pricingFixture.motionDiffsExpected[0].helper).toBe('getPricingMainGroupMotionStyle');
    expect(pricingFixture.mainGroupPoses.offsetFromStaticPx).toBe(PRICING_MOTION_MAIN_GROUP_OFFSET_PX);
  });

  test('pricing motion: hover motion.root → header reveal + main-group settle', async ({ page }) => {
    const motionRoot = page.getByTestId(pr.motion.root);
    await motionRoot.scrollIntoViewIfNeeded();

    expectTranslateY(await getMainGroupTranslateY(page), 0);

    const transitionMs =
      pricingFixture.transitions[0].durationMs ??
      getDurationTokenMs('var(--motion-duration-default)', 700);

    const headerOpacityBefore = await page
      .getByTestId(pr.sectionHeader)
      .evaluate((el) => Number.parseFloat(getComputedStyle(el).opacity));

    await motionRoot.hover({ force: true });

    await expect
      .poll(async () => {
        const opacity = await page
          .getByTestId(pr.sectionHeader)
          .evaluate((el) => Number.parseFloat(getComputedStyle(el).opacity));
        return opacity > headerOpacityBefore + 0.05;
      }, { timeout: transitionMs + 400, intervals: [50] })
      .toBe(true);

    await expect
      .poll(async () => isTranslateYNear(await getMainGroupTranslateY(page), 0), {
        timeout: transitionMs + 400,
        intervals: [50],
      })
      .toBe(true);

    expectTranslateY(await getMainGroupTranslateY(page), 0);
  });
});
