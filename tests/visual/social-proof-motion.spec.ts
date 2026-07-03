import { test, expect } from '@playwright/test';
import socialProofFixture from '../../features/LP-001/fixtures/social-proof-motion.fixture.json';
import { ids } from '@/tokens/build/test-ids';
import { getDurationTokenMs } from '@/lib/motion-tokens';
import {
  getSocialProofCarouselSlideMs,
  SOCIAL_PROOF_CLIENTS_LOGO_SCALE_TERMINAL,
} from '@/constants/motion.constants';
import { SOCIAL_PROOF_DESKTOP_SLIDE_STEP_PX } from '@/constants/landing.constants';
import { parseTranslateX, parseUniformScale } from './helpers/transform';

const sp = ids.component.landing.socialProof;
const DESKTOP_WIDTH = 1440;

async function getCarouselTranslateX(page: import('@playwright/test').Page): Promise<number> {
  const track = page.getByTestId(sp.testimonialsRow).locator('> div').first();
  const transform = await track.evaluate((el) => {
    const inline = el.style.transform;
    if (inline) return inline;
    return getComputedStyle(el).transform;
  });
  return Math.abs(parseTranslateX(transform));
}

async function getFirstLogoScale(page: import('@playwright/test').Page): Promise<number> {
  const grid = page.getByTestId(sp.container3);
  const transform = await grid.locator('> div').first().evaluate((el) => getComputedStyle(el).transform);
  return parseUniformScale(transform);
}

test.describe('GH#9 — Social proof motion (fixture)', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: DESKTOP_WIDTH, height: 1200 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('fixture documents carousel + clients strip chains', () => {
    expect(socialProofFixture.carousel.figmaStates).toBe(21);
    expect(socialProofFixture.carousel.trigger.targetTestId).toBe(
      'component.landing.socialProof.motion.root',
    );
    expect(socialProofFixture.clientsStrip.figmaStates).toHaveLength(2);
    expect(socialProofFixture.clientsStrip.transitions[0].trigger).toBe('MOUSE_ENTER');
    expect(socialProofFixture.clientsStrip.motionDiffsExpected[0].helper).toBe(
      'getSocialProofClientsLogoMotionStyle',
    );
  });

  test('carousel motion: hover motion.root → header reveal + slide advance', async ({ page }) => {
    const motionRoot = page.getByTestId(sp.motion.root);
    await motionRoot.scrollIntoViewIfNeeded();
    await expect(motionRoot).toBeVisible();

    expect(await getCarouselTranslateX(page)).toBe(0);

    await motionRoot.hover({ force: true });

    await expect
      .poll(async () => {
        const offset = await getCarouselTranslateX(page);
        return Math.abs(offset - SOCIAL_PROOF_DESKTOP_SLIDE_STEP_PX) <= 2;
      }, {
        timeout: getSocialProofCarouselSlideMs() + 800,
        intervals: [50],
      })
      .toBe(true);
  });

  test('clients strip motion: hover clientsMotion.root → logo scale terminal', async ({ page }) => {
    const clientsRoot = page.getByTestId(sp.clientsMotion.root);
    await clientsRoot.scrollIntoViewIfNeeded();
    await expect(clientsRoot).toBeVisible();

    expect(await getFirstLogoScale(page)).toBeCloseTo(1, 2);

    const transitionMs =
      socialProofFixture.clientsStrip.transitions[0].durationMs ??
      getDurationTokenMs('var(--motion-duration-default)', 700);

    await clientsRoot.hover({ force: true });

    await expect
      .poll(
        async () =>
          Math.abs((await getFirstLogoScale(page)) - SOCIAL_PROOF_CLIENTS_LOGO_SCALE_TERMINAL) < 0.02,
        { timeout: transitionMs * 2 + 500, intervals: [50] },
      )
      .toBe(true);
  });
});
