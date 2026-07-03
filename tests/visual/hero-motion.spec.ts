import { test, expect } from '@playwright/test';
import heroFixture from '../../features/LP-001/fixtures/hero-motion.fixture.json';
import { ids } from '@/tokens/build/test-ids';
import { getDurationTokenMs } from '@/lib/motion-tokens';
import { expectTranslateY, isTranslateYNear, parseTranslateY } from './helpers/transform';

const hero = ids.component.landing.hero;
const DESKTOP_WIDTH = 1440;

const CTA_ENTRY = heroFixture.motionDiffsExpected[1].translateY.fromPx;

async function getColumnTranslateY(
  page: import('@playwright/test').Page,
  testId: string,
): Promise<number> {
  const motionRoot = page.getByTestId(hero.motion.root);
  const transform = await motionRoot.getByTestId(testId).evaluate((el) => {
    return getComputedStyle(el).transform;
  });
  return parseTranslateY(transform);
}

async function triggerHeroMotion(page: import('@playwright/test').Page): Promise<void> {
  const motionRoot = page.getByTestId(hero.motion.root);
  await motionRoot.scrollIntoViewIfNeeded();
  await motionRoot.hover({ force: true });
}

/**
 * GH#4 hero motion — fixture-driven checks against hero-motion.fixture.json.
 */
test.describe('GH#4 — Hero motion (fixture)', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: DESKTOP_WIDTH, height: 900 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('fixture documents 3 cached Figma states and 2 transitions', () => {
    expect(heroFixture.figmaStates).toHaveLength(3);
    expect(heroFixture.transitions).toHaveLength(2);
    expect(heroFixture.transitions[0].trigger).toBe('MOUSE_ENTER');
    expect(heroFixture.transitions[1].trigger).toBe('AFTER_TIMEOUT');
  });

  test('hero motion sequence: static visible → hover reveal → settled', async ({ page }) => {
    const motionRoot = page.getByTestId(hero.motion.root);
    await expect(motionRoot).toBeVisible();

    // Static twin (5164:6560) — flex column, no translateY transforms
    expectTranslateY(await getColumnTranslateY(page, hero.motion.textColumn), 0);
    expectTranslateY(await getColumnTranslateY(page, hero.motion.ctaColumn), 0);

    const product = motionRoot.getByTestId(hero.productImage);
    const productTransformBefore = await product.evaluate(
      (el) => getComputedStyle(el).transform,
    );

    const hoverDurationMs =
      heroFixture.transitions[0].durationMs ??
      getDurationTokenMs('var(--motion-duration-default)', 700);

    const autoAdvanceMs =
      heroFixture.transitions[1].delayMs ??
      getDurationTokenMs('var(--motion-duration-auto-advance)', 300);

    const state2TimeoutMs = hoverDurationMs + autoAdvanceMs + 800;
    const totalSettleMs = hoverDurationMs * 2 + autoAdvanceMs + 1000;

    await triggerHeroMotion(page);

    // Figma state 2 — text settled at 0, CTA still at entry 370 (300ms hold before step 2)
    await expect
      .poll(
        async () => {
          const textY = await getColumnTranslateY(page, hero.motion.textColumn);
          const ctaY = await getColumnTranslateY(page, hero.motion.ctaColumn);
          return isTranslateYNear(textY, 0) && isTranslateYNear(ctaY, CTA_ENTRY);
        },
        { timeout: state2TimeoutMs, intervals: [50] },
      )
      .toBe(true);

    // State 3 — CTA sits below copy (measured text height + gap, not fixed Figma 284)
    await expect
      .poll(
        async () => {
          const textCol = motionRoot.getByTestId(hero.motion.textColumn);
          const ctaCol = motionRoot.getByTestId(hero.motion.ctaColumn);
          const textBox = await textCol.boundingBox();
          const ctaBox = await ctaCol.boundingBox();
          if (!textBox || !ctaBox) return false;
          return ctaBox.y >= textBox.y + textBox.height - 4;
        },
        { timeout: totalSettleMs, intervals: [50] },
      )
      .toBe(true);

    const productTransformAfter = await product.evaluate(
      (el) => getComputedStyle(el).transform,
    );
    expect(productTransformAfter).toBe(productTransformBefore);
  });
});
