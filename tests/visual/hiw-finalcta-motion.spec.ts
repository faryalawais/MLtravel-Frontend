import { test, expect } from '@playwright/test';
import hiwFinalCtaFixture from '../../features/HIW-003/fixtures/hiw-finalcta-motion.fixture.json';
import { ids } from '@/tokens/build/test-ids';
import { getDurationTokenMs } from '@/lib/motion-tokens';

const finalCta = ids.component.howItWorks.finalCta;
const DESKTOP_WIDTH = 1440;

test.describe('GH#24 — HIW final CTA motion (HIW-FinalCTA-animation)', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: DESKTOP_WIDTH, height: 1200 });
    await page.goto('/how-it-works');
    await page.waitForLoadState('networkidle');
  });

  test('fixture documents 2 states and 1 MOUSE_ENTER transition', () => {
    expect(hiwFinalCtaFixture.figmaStates).toHaveLength(2);
    expect(hiwFinalCtaFixture.transitions).toHaveLength(1);
    expect(hiwFinalCtaFixture.transitions[0].trigger).toBe('MOUSE_ENTER');
    expect(hiwFinalCtaFixture.chain).toBe('HIW-FinalCTA-animation');
  });

  test('final CTA motion: banner slides up into clip on hover', async ({ page }) => {
    const motionRoot = page.getByTestId(finalCta.motion.root);

    await motionRoot.scrollIntoViewIfNeeded();

    const transitionMs =
      hiwFinalCtaFixture.transitions[0].durationMs ??
      getDurationTokenMs('var(--motion-duration-default)', 700);
    const bannerOffsetPx = hiwFinalCtaFixture.implementationExpected.bannerOffsetPx;

    const readBannerTransform = () =>
      motionRoot.evaluate((root) => {
        const clip = root.firstElementChild;
        const banner = clip?.firstElementChild;
        if (!banner) return '';
        return getComputedStyle(banner).transform;
      });

    await motionRoot.hover({ force: true });

    await expect
      .poll(async () => readBannerTransform(), { timeout: 128, intervals: [16] })
      .toContain(String(bannerOffsetPx));

    const settleTimeoutMs = 32 + transitionMs * 2 + 200;

    await expect
      .poll(
        async () => {
          const transform = await readBannerTransform();
          return transform === 'none' || transform.includes('matrix(1, 0, 0, 1, 0, 0)');
        },
        { timeout: settleTimeoutMs, intervals: [50] },
      )
      .toBe(true);
  });
});
