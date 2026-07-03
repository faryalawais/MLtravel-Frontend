import { test, expect } from '@playwright/test';
import comparisonFixture from '../../features/LP-001/fixtures/comparison-motion.fixture.json';
import { ids } from '@/tokens/build/test-ids';
import { getDurationTokenMs } from '@/lib/motion-tokens';
import { COMPARISON_MOTION_MAIN_GROUP_OFFSET_PX } from '@/constants/motion.constants';
import { expectTranslateY, isTranslateYNear, parseTranslateY } from './helpers/transform';

const comparison = ids.component.landing.comparisonFirst;
const DESKTOP_WIDTH = 1440;

async function getTicketTranslateY(page: import('@playwright/test').Page): Promise<number> {
  const motionRoot = page.getByTestId(comparison.motion.root);
  const transform = await motionRoot.getByTestId(comparison.giantTicket).evaluate((el) => {
    return getComputedStyle(el).transform;
  });
  return parseTranslateY(transform);
}

test.describe('GH#6 — Comparison motion (fixture)', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: DESKTOP_WIDTH, height: 1200 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('fixture documents 2 states and simple-one-step transition', () => {
    expect(comparisonFixture.figmaStates).toHaveLength(2);
    expect(comparisonFixture.transitions).toHaveLength(1);
    expect(comparisonFixture.transitions[0].trigger).toBe('MOUSE_ENTER');
    expect(comparisonFixture.motionDiffsExpected[0].helper).toBe('getComparisonMainGroupMotionStyle');
  });

  test('comparison motion: static ticket → entry snap → terminal settle', async ({ page }) => {
    const motionRoot = page.getByTestId(comparison.motion.root);
    await motionRoot.scrollIntoViewIfNeeded();

    // Static twin — ticket at natural flex position
    expectTranslateY(await getTicketTranslateY(page), 0);

    const transitionMs =
      comparisonFixture.transitions[0].durationMs ??
      getDurationTokenMs('var(--motion-duration-default)', 700);

    await motionRoot.hover({ force: true });

    // Entry snap — Frame 2095585108 offset from static (1028 − 212)
    await expect
      .poll(
        async () =>
          isTranslateYNear(await getTicketTranslateY(page), COMPARISON_MOTION_MAIN_GROUP_OFFSET_PX),
        { timeout: 600, intervals: [32] },
      )
      .toBe(true);

    // Terminal — entry snap (0ms) then Smart Animate (700ms) after step 1
    await expect
      .poll(async () => isTranslateYNear(await getTicketTranslateY(page), 0), {
        timeout: transitionMs * 2 + 500,
        intervals: [50],
      })
      .toBe(true);

    expectTranslateY(await getTicketTranslateY(page), 0);
  });
});
