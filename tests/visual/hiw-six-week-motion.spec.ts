import { test, expect } from '@playwright/test';
import hiwSixWeekFixture from '../../features/HIW-003/fixtures/hiw-six-week-motion.fixture.json';
import { ids } from '@/tokens/build/test-ids';
import { getDurationTokenMs } from '@/lib/motion-tokens';

const sixWeek = ids.component.howItWorks.sixWeek;
const DESKTOP_WIDTH = 1440;

test.describe('GH#21 — HIW six-week motion (HIW-Sixweek-animation)', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: DESKTOP_WIDTH, height: 1200 });
    await page.goto('/how-it-works');
    await page.waitForLoadState('networkidle');
  });

  test('fixture documents 5 states and 4 chained transitions', () => {
    expect(hiwSixWeekFixture.figmaStates).toHaveLength(5);
    expect(hiwSixWeekFixture.transitions).toHaveLength(4);
    expect(hiwSixWeekFixture.transitions[0].trigger).toBe('MOUSE_ENTER');
    expect(hiwSixWeekFixture.chain).toBe('HIW-onboarding-animation');
    expect(hiwSixWeekFixture.alias).toBe('HIW-Sixweek-animation');
  });

  test('six-week motion: card cascade then social proof strip reveals', async ({ page }) => {
    const motionRoot = page.getByTestId(sixWeek.motion.root);
    const socialProofStrip = page.getByTestId(sixWeek.socialProofStrip);

    await motionRoot.scrollIntoViewIfNeeded();
    await expect(socialProofStrip).toBeVisible();

    const transitionMs =
      hiwSixWeekFixture.transitions[0].durationMs ??
      getDurationTokenMs('var(--motion-duration-default)', 700);
    const stepDelayMs =
      hiwSixWeekFixture.transitions[1].delayMs ??
      getDurationTokenMs('var(--motion-duration-auto-advance)', 300);
    const stepIntervalMs = transitionMs + stepDelayMs;
    const finalStepMs = 32 + 4 * stepIntervalMs + transitionMs + 400;

    await motionRoot.hover({ force: true });

    await expect
      .poll(
        async () => {
          const opacity = await socialProofStrip.evaluate(
            (el) => Number.parseFloat(getComputedStyle(el).opacity),
          );
          return opacity < 0.1;
        },
        { timeout: stepIntervalMs, intervals: [50] },
      )
      .toBe(true);

    await expect
      .poll(
        async () => {
          const opacity = await socialProofStrip.evaluate(
            (el) => Number.parseFloat(getComputedStyle(el).opacity),
          );
          return opacity > 0.95;
        },
        { timeout: finalStepMs, intervals: [50] },
      )
      .toBe(true);

    await expect(motionRoot.getByTestId(sixWeek.weekCard4)).toBeVisible();
  });
});
