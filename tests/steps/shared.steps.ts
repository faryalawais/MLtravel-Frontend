import { expect } from '@playwright/test';
import { createBdd, test } from 'playwright-bdd';
import { testIdFor } from './registry-helpers';

const { Given, When, Then } = createBdd(test);

Given('a guest views the site at {int}px width', async ({ page }, width: number) => {
  await page.setViewportSize({ width, height: 900 });
});

When('the guest navigates to {string}', async ({ page }, path: string) => {
  await page.goto(path, { waitUntil: 'domcontentloaded' });
});

Then(
  /^`([^`]+)` is visible$/,
  async ({ page }, gherkinPath: string) => {
    await expect(page.getByTestId(testIdFor(gherkinPath))).toBeVisible();
  },
);

Then(
  /^`([^`]+)` is not visible$/,
  async ({ page }, gherkinPath: string) => {
    await expect(page.getByTestId(testIdFor(gherkinPath))).toBeHidden();
  },
);
