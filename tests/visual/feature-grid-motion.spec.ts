import { test, expect } from '@playwright/test';
import featureGridFixture from '../../features/LP-001/fixtures/feature-grid-motion.fixture.json';
import { ids } from '@/tokens/build/test-ids';
import { getDurationTokenMs } from '@/lib/motion-tokens';
import {
  FEATURE_GRID_CONTENT_POSE_STATE2_PX,
} from '@/constants/motion.constants';
import { expectTranslateY, isTranslateYNear, parseTranslateY } from './helpers/transform';

const fg = ids.component.landing.featureGrid;
const DESKTOP_WIDTH = 1440;

async function getLayerTranslateY(
  page: import('@playwright/test').Page,
  testId: string,
): Promise<number> {
  const el = page.getByTestId(testId);
  const transform = await el.evaluate((node) => getComputedStyle(node).transform);
  return parseTranslateY(transform);
}

test.describe('GH#10 — Feature grid motion (fixture)', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: DESKTOP_WIDTH, height: 1200 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('fixture documents 4 states and staged-sequence transitions', () => {
    expect(featureGridFixture.figmaStates).toHaveLength(4);
    expect(featureGridFixture.transitions).toHaveLength(3);
    expect(featureGridFixture.transitions[0].trigger).toBe('MOUSE_ENTER');
    expect(featureGridFixture.motionDiffsExpected[0].helper).toBe('getFeatureGridContentMotionStyle');
    expect(featureGridFixture.layerOffsetsFromTerminal.featureRow2.state2).toBe(
      FEATURE_GRID_CONTENT_POSE_STATE2_PX,
    );
  });

  test('feature grid motion: row-wise staged slide → settled static', async ({ page }) => {
    const motionRoot = page.getByTestId(fg.motion.root);
    await motionRoot.scrollIntoViewIfNeeded();

    expectTranslateY(await getLayerTranslateY(page, fg.featureRow1), 0);
    expectTranslateY(await getLayerTranslateY(page, fg.featureRow2), 0);
    expectTranslateY(await getLayerTranslateY(page, fg.footerBar), 0);

    const transitionMs =
      featureGridFixture.transitions[0].durationMs ??
      getDurationTokenMs('var(--motion-duration-default)', 700);
    const autoAdvanceMs =
      featureGridFixture.transitions[1].delayMs ??
      getDurationTokenMs('var(--motion-duration-auto-advance)', 300);
    const stepIntervalMs = transitionMs + autoAdvanceMs;
    const finalStepMs = stepIntervalMs * 2 + transitionMs + 600;

    await motionRoot.hover({ force: true });

    // Mid-chain (state-2): Row1 at terminal, Row2/footer still offset (~270)
    await expect
      .poll(
        async () => {
          const row1 = await getLayerTranslateY(page, fg.featureRow1);
          const row2 = await getLayerTranslateY(page, fg.featureRow2);
          return (
            isTranslateYNear(row1, 0) &&
            (isTranslateYNear(row2, FEATURE_GRID_CONTENT_POSE_STATE2_PX) || row2 > 100)
          );
        },
        { timeout: stepIntervalMs * 2 + 400, intervals: [50] },
      )
      .toBe(true);

    await expect
      .poll(
        async () => {
          const row1 = await getLayerTranslateY(page, fg.featureRow1);
          const row2 = await getLayerTranslateY(page, fg.featureRow2);
          const footer = await getLayerTranslateY(page, fg.footerBar);
          return (
            isTranslateYNear(row1, 0) &&
            isTranslateYNear(row2, 0) &&
            isTranslateYNear(footer, 0)
          );
        },
        {
          timeout: finalStepMs,
          intervals: [50],
        },
      )
      .toBe(true);

    expectTranslateY(await getLayerTranslateY(page, fg.featureRow1), 0);
    expectTranslateY(await getLayerTranslateY(page, fg.featureRow2), 0);
    expectTranslateY(await getLayerTranslateY(page, fg.footerBar), 0);

    await expect(page.getByTestId(fg.featureCard6)).toBeVisible();
  });
});
