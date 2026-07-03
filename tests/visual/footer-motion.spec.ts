import { test, expect } from '@playwright/test';
import footerFixture from '../../features/LP-001/fixtures/footer-motion.fixture.json';
import { ids } from '@/tokens/build/test-ids';
import { getDurationTokenMs } from '@/lib/motion-tokens';

const ft = ids.component.footer;
const MOBILE_WIDTH = 393;

async function isDocumentationLinkEmphasized(
  page: import('@playwright/test').Page,
  linkTestId: string,
): Promise<boolean> {
  return page.getByTestId(linkTestId).evaluate((el) => {
    const style = getComputedStyle(el);
    const weight = Number.parseInt(style.fontWeight, 10);
    return (
      el.className.includes('semibold') ||
      weight >= 600 ||
      style.textDecorationLine.includes('underline')
    );
  });
}

test.describe('GH#12 — Footer motion (closed inferred chain)', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: MOBILE_WIDTH, height: 900 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('fixture documents closed inferred chain and emphasis motion', () => {
    expect(footerFixture.$meta.chainStatus).toBe('closed');
    expect(footerFixture.$meta.inferred).toBe(true);
    expect(footerFixture.implementationExpected.trigger).toContain('component.footer.motion.root');
    expect(footerFixture.transitions[0].durationMs).toBe(700);
    expect(footerFixture.implementationExpected.helper).toBe('getFooterNavLinkMotionStyle');
  });

  test('footer motion: hover motion.root → link emphasis → settle', async ({ page }) => {
    const motionRoot = page.getByTestId(ft.motion.root);
    await motionRoot.scrollIntoViewIfNeeded();
    await expect(motionRoot).toBeVisible();

    const docLinkTestId = `${ft.mobile.navCols}-documentation`;
    expect(await isDocumentationLinkEmphasized(page, docLinkTestId)).toBe(false);

    const dwellMs =
      footerFixture.transitions[0].durationMs ??
      getDurationTokenMs('var(--motion-duration-default)', 700);

    await motionRoot.hover({ force: true });

    await expect
      .poll(async () => isDocumentationLinkEmphasized(page, docLinkTestId), {
        timeout: 1000,
        intervals: [32],
      })
      .toBe(true);

    await expect
      .poll(async () => !(await isDocumentationLinkEmphasized(page, docLinkTestId)), {
        timeout: dwellMs + 800,
        intervals: [50],
      })
      .toBe(true);
  });
});
