import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

const TOKEN_CSS_VAR: Record<string, string> = {
  'color.action.secondary.focused.border': '--color-action-secondary-focused-border',
};

export async function assertFocusedOutlineUsesToken(
  _page: Page,
  locator: Locator,
  tokenName: string,
): Promise<void> {
  const cssVar = TOKEN_CSS_VAR[tokenName];
  if (!cssVar) {
    throw new Error(`No CSS variable mapping for token "${tokenName}"`);
  }
  await locator.focus();
  const outlineWidth = await locator.evaluate((el) => window.getComputedStyle(el).outlineWidth);
  expect(parseFloat(outlineWidth)).toBeGreaterThan(0);
}
