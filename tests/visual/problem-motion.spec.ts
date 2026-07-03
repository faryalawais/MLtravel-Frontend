import { test, expect } from '@playwright/test';
import problemFixture from '../../features/LP-001/fixtures/problem-motion.fixture.json';
import { ids } from '@/tokens/build/test-ids';
import { getDurationTokenMs } from '@/lib/motion-tokens';
import { PROBLEM_MOTION_CTA_OFFSET_PX } from '@/constants/motion.constants';
import { expectTranslateY, isTranslateYNear, parseTranslateY } from './helpers/transform';

const problem = ids.component.landing.problem;
const DESKTOP_WIDTH = 1440;

async function getCtaTranslateY(page: import('@playwright/test').Page): Promise<number> {
  const cta = page.getByTestId(problem.cta).or(page.getByTestId(problem.motion.cta));
  const transform = await cta.evaluate((el) => getComputedStyle(el).transform);
  return parseTranslateY(transform);
}

test.describe('GH#5 — Problem motion (fixture)', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: DESKTOP_WIDTH, height: 1200 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('fixture documents 5 states and rapid-four-step transitions', () => {
    expect(problemFixture.figmaStates).toHaveLength(5);
    expect(problemFixture.transitions).toHaveLength(4);
    expect(problemFixture.transitions[0].trigger).toBe('MOUSE_ENTER');
    expect(problemFixture.motionDiffsExpected[0].helper).toBe('getProblemCtaMotionStyle');
  });

  test('problem motion: static → card cascade → CTA settles', async ({ page }) => {
    const motionRoot = page.getByTestId(problem.motion.root);
    await motionRoot.scrollIntoViewIfNeeded();

    // Static twin — CTA at natural position (problem.cta testId)
    await expect(page.getByTestId(problem.cta)).toBeVisible();

    const transitionMs =
      problemFixture.transitions[0].durationMs ??
      getDurationTokenMs('var(--motion-duration-default)', 700);
    const stepDelayMs =
      problemFixture.transitions[1].delayMs ??
      getDurationTokenMs('var(--motion-duration-step-delay)', 120);
    const stepIntervalMs = transitionMs + stepDelayMs;
    const finalStepMs = 32 + 3 * stepIntervalMs + transitionMs + 400;

    await motionRoot.hover({ force: true });

    await expect(page.getByTestId(problem.motion.cta)).toBeVisible({ timeout: 1000 });

    await expect
      .poll(
        async () =>
          isTranslateYNear(await getCtaTranslateY(page), PROBLEM_MOTION_CTA_OFFSET_PX),
        { timeout: stepIntervalMs * 2 + 400, intervals: [50] },
      )
      .toBe(true);

    // Terminal — CTA translateY 592 pose (= static twin offset 0)
    await expect
      .poll(async () => isTranslateYNear(await getCtaTranslateY(page), 0), {
        timeout: finalStepMs,
        intervals: [50],
      })
      .toBe(true);

    expectTranslateY(await getCtaTranslateY(page), 0);
  });
});
