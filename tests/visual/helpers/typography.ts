import { expect, type Locator } from '@playwright/test';

/** Figma-verified section header sizes (LP-001 implemented slices). */
export const FIGMA_TYPOGRAPHY = {
  sectionPillDesktop: { fontSize: 14, fontWeight: '600' },
  sectionPillMobile: { fontSize: 10, fontWeight: '600' },
  sectionHeadingDesktop: { fontSize: 40, fontWeight: '700' },
  sectionHeadingMobile: { fontSize: 32, fontWeight: '700' },
  sectionSubtitleDesktop: { fontSize: 16, fontWeight: '400' },
  sectionSubtitleMobile: { fontSize: 14, fontWeight: '400' },
  heroHeadingDesktop: { fontSize: 48, fontWeight: '700' },
  problemCardTitleDesktop: { fontSize: 24, fontWeight: '500' },
  problemCardBodyDesktop: { fontSize: 13, fontWeight: '400' },
  comparisonCardHeaderDesktop: { fontSize: 26, fontWeight: '700' },
  comparisonRowTitleDesktop: { fontSize: 18, fontWeight: '700' },
  comparisonRowBodyDesktop: { fontSize: 13, fontWeight: '400' },
  featureGridCardTitleDesktop: { fontSize: 24, fontWeight: '500' },
  featureGridCardBodyDesktop: { fontSize: 14, fontWeight: '400' },
  hiwCardBodyDesktop: { fontSize: 14, fontWeight: '400' },
} as const;

export async function expectTypography(
  locator: Locator,
  expected: { fontSize: number; fontWeight: string },
  tolerancePx = 0,
): Promise<void> {
  const styles = await locator.evaluate((el) => {
    const computed = getComputedStyle(el);
    return {
      fontSize: Number.parseFloat(computed.fontSize),
      fontWeight: computed.fontWeight,
    };
  });

  expect(styles.fontSize).toBeGreaterThanOrEqual(expected.fontSize - tolerancePx);
  expect(styles.fontSize).toBeLessThanOrEqual(expected.fontSize + tolerancePx);
  expect(styles.fontWeight).toBe(expected.fontWeight);
}

export async function expectColorToken(
  locator: Locator,
  cssVarName: string,
): Promise<void> {
  const expected = await locator.evaluate((_, varName) => {
    return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  }, cssVarName);

  const actual = await locator.evaluate((el) => getComputedStyle(el).color);

  expect(actual).toBe(expected);
}
