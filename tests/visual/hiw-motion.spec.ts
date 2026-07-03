import { test, expect } from '@playwright/test';
import hiwFixture from '../../features/LP-001/fixtures/hiw-motion.fixture.json';
import { ids } from '@/tokens/build/test-ids';
import { getDurationTokenMs } from '@/lib/motion-tokens';
import { HIW_MOTION_FOOTER_OFFSET_PX } from '@/constants/motion.constants';
import { expectTranslateY, isTranslateYNear, parseTranslateY } from './helpers/transform';

const hiw = ids.component.landing.howItWorksTeaser;
const DESKTOP_WIDTH = 1440;

async function getFooterTranslateY(page: import('@playwright/test').Page): Promise<number> {
  const footer = page
    .getByTestId(hiw.footerNote)
    .or(page.getByTestId(hiw.motion.footerNote));
  const transform = await footer.evaluate((el) => getComputedStyle(el).transform);
  return parseTranslateY(transform);
}

test.describe('GH#7 — How-it-works motion (fixture)', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: DESKTOP_WIDTH, height: 1200 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('fixture documents 5 states and rapid-four-step transitions', () => {
    expect(hiwFixture.figmaStates).toHaveLength(5);
    expect(hiwFixture.transitions).toHaveLength(4);
    expect(hiwFixture.transitions[0].trigger).toBe('MOUSE_ENTER');
    expect(hiwFixture.motionDiffsExpected[0].helper).toBe('getHiwFooterMotionStyle');
  });

  test('hiw motion: static → card cascade → footer settles', async ({ page }) => {
    const motionRoot = page.getByTestId(hiw.motion.root);
    await motionRoot.scrollIntoViewIfNeeded();

    expectTranslateY(await getFooterTranslateY(page), 0);

    const transitionMs =
      hiwFixture.transitions[0].durationMs ??
      getDurationTokenMs('var(--motion-duration-default)', 700);
    const stepDelayMs =
      hiwFixture.transitions[1].delayMs ??
      getDurationTokenMs('var(--motion-duration-step-delay)', 120);
    const stepIntervalMs = transitionMs + stepDelayMs;
    const finalStepMs = 32 + 3 * stepIntervalMs + transitionMs + 400;

    await motionRoot.hover({ force: true });

    await expect(page.getByTestId(hiw.motion.footerNote)).toBeVisible({ timeout: 1000 });

    await expect
      .poll(
        async () =>
          isTranslateYNear(await getFooterTranslateY(page), HIW_MOTION_FOOTER_OFFSET_PX),
        { timeout: stepIntervalMs * 2 + 400, intervals: [50] },
      )
      .toBe(true);

    await expect
      .poll(async () => isTranslateYNear(await getFooterTranslateY(page), 0), {
        timeout: finalStepMs,
        intervals: [50],
      })
      .toBe(true);

    expectTranslateY(await getFooterTranslateY(page), 0);
  });
});
