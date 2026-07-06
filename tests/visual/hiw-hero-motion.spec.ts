import { test, expect } from '@playwright/test';
import hiwHeroFixture from '../../features/HIW-003/fixtures/hiw-hero-motion.fixture.json';
import { ids } from '@/tokens/build/test-ids';
import { HIW_HERO_MOTION_LAYER_OFFSET_PX } from '@/constants/motion.constants';
import { getDurationTokenMs } from '@/lib/motion-tokens';
import { expectTranslateY, isTranslateYNear, parseTranslateY } from './helpers/transform';

const hero = ids.component.howItWorks.hero;
const DESKTOP_WIDTH = 1440;

async function getLayerTranslateY(
  page: import('@playwright/test').Page,
  testId: string,
): Promise<number> {
  const transform = await page.getByTestId(testId).evaluate((el) => getComputedStyle(el).transform);
  return parseTranslateY(transform);
}

test.describe('GH#18 — HIW hero motion (fixture)', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: DESKTOP_WIDTH, height: 900 });
    await page.goto('/how-it-works');
    await page.waitForLoadState('networkidle');
  });

  test('fixture documents 3 states and 2 transitions', () => {
    expect(hiwHeroFixture.figmaStates).toHaveLength(3);
    expect(hiwHeroFixture.transitions).toHaveLength(2);
    expect(hiwHeroFixture.transitions[0].trigger).toBe('MOUSE_ENTER');
    expect(hiwHeroFixture.transitions[1].trigger).toBe('AFTER_TIMEOUT');
  });

  test('hiw hero motion: static → head settles → cta settles', async ({ page }) => {
    const motionRoot = page.getByTestId(hero.motion.root);
    await motionRoot.scrollIntoViewIfNeeded();

    expectTranslateY(await getLayerTranslateY(page, hero.motion.headGroup), 0);
    expectTranslateY(await getLayerTranslateY(page, hero.motion.ctaGroup), 0);

    const hoverDurationMs =
      hiwHeroFixture.transitions[0].durationMs ??
      getDurationTokenMs('var(--motion-duration-default)', 700);
    const autoAdvanceMs =
      hiwHeroFixture.transitions[1].delayMs ??
      getDurationTokenMs('var(--motion-duration-auto-advance)', 300);
    const state2TimeoutMs = hoverDurationMs + autoAdvanceMs + 800;
    const totalSettleMs = hoverDurationMs * 2 + autoAdvanceMs + 1000;

    await motionRoot.hover({ force: true });

    await expect
      .poll(
        async () => {
          const headY = await getLayerTranslateY(page, hero.motion.headGroup);
          const ctaY = await getLayerTranslateY(page, hero.motion.ctaGroup);
          return (
            isTranslateYNear(headY, 0) &&
            isTranslateYNear(ctaY, HIW_HERO_MOTION_LAYER_OFFSET_PX)
          );
        },
        { timeout: state2TimeoutMs, intervals: [50] },
      )
      .toBe(true);

    await expect
      .poll(async () => isTranslateYNear(await getLayerTranslateY(page, hero.motion.ctaGroup), 0), {
        timeout: totalSettleMs,
        intervals: [50],
      })
      .toBe(true);

    expectTranslateY(await getLayerTranslateY(page, hero.motion.headGroup), 0);
    expectTranslateY(await getLayerTranslateY(page, hero.motion.ctaGroup), 0);
  });
});
