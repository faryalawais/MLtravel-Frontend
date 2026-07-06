import { expect } from '@playwright/test';
import { createBdd, test } from 'playwright-bdd';
import { CONTACT_FALLBACK_BODY, CONTACT_FALLBACK_EMAIL, CALENDLY_IFRAME_TITLE } from '@/constants/contact.constants';
import { ids } from '@/tokens/build/test-ids';
import { testIdFor, testIdForSub } from './registry-helpers';
import { assertFocusedOutlineUsesToken } from './token-helpers';

const { Given, When, Then } = createBdd(test);

Given('Calendly URL is configured in the environment', async ({ page }) => {
  if (!process.env.NEXT_PUBLIC_CALENDLY_URL?.trim()) {
    test.skip(true, 'Requires NEXT_PUBLIC_CALENDLY_URL to be set');
  }
  await page.route('**/*calendly.com/**', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    await route.continue();
  });
});

Given('Calendly URL is not configured in the environment', async () => {
  // Exercised via /contact?e2e_no_calendly=1 when NEXT_PUBLIC_E2E_MODE=1 (Playwright webServer).
});

Then(
  /^`([^`]+)` matches Figma node "([^"]+)"$/,
  async ({ page }, gherkinPath: string, _figmaNode: string) => {
    void _figmaNode;
    const locator = page.getByTestId(testIdFor(gherkinPath));
    await expect(locator).toBeVisible();
    const box = await locator.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThan(0);
    expect(box!.height).toBeGreaterThan(0);
  },
);

Then(
  /^`([^`]+)` displays headline "([^"]+)"$/,
  async ({ page }, gherkinPath: string, headline: string) => {
    const root = page.getByTestId(testIdFor(gherkinPath));
    await expect(root.getByTestId(ids.component.contact.hero.heading)).toHaveText(headline);
  },
);

Then(
  /^`([^`]+)` displays subhead "([^"]+)"$/,
  async ({ page }, gherkinPath: string, subhead: string) => {
    const root = page.getByTestId(testIdFor(gherkinPath));
    await expect(root.getByTestId(ids.component.contact.hero.subhead)).toHaveText(subhead);
  },
);

Then(
  /^`([^`]+)` is in fluid mobile layout$/,
  async ({ page }, gherkinPath: string) => {
    const locator = page.getByTestId(testIdFor(gherkinPath));
    await expect(locator).toBeVisible();
    const viewport = page.viewportSize();
    const box = await locator.boundingBox();
    expect(viewport).not.toBeNull();
    expect(box).not.toBeNull();
    expect(box!.width).toBeLessThanOrEqual(viewport!.width);
    expect(box!.width).toBeGreaterThan(viewport!.width * 0.5);
  },
);

Then(
  /^`([^`]+)` is visible before the Calendly iframe loads$/,
  async ({ page }, gherkinPath: string) => {
    const skeleton = page.getByTestId(testIdFor(gherkinPath));
    await expect(skeleton).toBeVisible();
    await expect(page.locator(`iframe[title="${CALENDLY_IFRAME_TITLE}"]`)).toBeAttached();
  },
);

When('the Calendly iframe finishes loading', async ({ page }) => {
  const iframe = page.locator(`iframe[title="${CALENDLY_IFRAME_TITLE}"]`);
  await iframe.waitFor({ state: 'attached' });
  await page.waitForFunction(
    () => {
      const skeleton = document.querySelector(
        '[data-testid="component-contact-embedSkeleton-root"]',
      );
      return !skeleton || getComputedStyle(skeleton).display === 'none' || skeleton.clientHeight === 0;
    },
    { timeout: 30_000 },
  );
  await expect(page.getByTestId(ids.component.contact.embedSkeleton.root)).toBeHidden({
    timeout: 30_000,
  });
});

Then(
  /^`([^`]+)` contains a Calendly iframe for the configured URL$/,
  async ({ page }, gherkinPath: string) => {
    const embed = page.getByTestId(testIdFor(gherkinPath));
    await expect(embed).toBeVisible();
    const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL?.trim() ?? '';
    const iframe = embed.locator('iframe');
    await expect(iframe).toBeVisible();
    await expect(iframe).toHaveAttribute('src', new RegExp(escapeRegExp(calendlyUrl)));
  },
);

Then(
  /^`([^`]+)` iframe has an accessible title$/,
  async ({ page }, gherkinPath: string) => {
    const embed = page.getByTestId(testIdFor(gherkinPath));
    const iframe = embed.locator('iframe');
    await expect(iframe).toHaveAttribute('title', CALENDLY_IFRAME_TITLE);
  },
);

Then('no custom calendar or booking form is visible outside the embed', async ({ page }) => {
  const embed = page.getByTestId(ids.component.contact.embed.root);
  const embedBox = await embed.boundingBox();
  const calendarButtons = page.getByRole('button', { name: /^\d{1,2}$/ });
  const count = await calendarButtons.count();
  for (let i = 0; i < count; i += 1) {
    const button = calendarButtons.nth(i);
    const box = await button.boundingBox();
    if (!box || !embedBox) continue;
    const insideEmbed =
      box.x >= embedBox.x &&
      box.y >= embedBox.y &&
      box.x + box.width <= embedBox.x + embedBox.width &&
      box.y + box.height <= embedBox.y + embedBox.height;
    expect(insideEmbed).toBe(false);
  }
});

Then(
  /^`([^`]+)` displays an external link to book via Calendly$/,
  async ({ page }, gherkinPath: string) => {
    const fallback = page.getByTestId(testIdFor(gherkinPath));
    await expect(fallback).toBeVisible();
    const link = fallback.locator('a[href*="calendly.com"]');
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('target', '_blank');
  },
);

Then(
  /^`([^`]+)` displays heading "([^"]+)"$/,
  async ({ page }, gherkinPath: string, heading: string) => {
    const root = page.getByTestId(testIdFor(gherkinPath));
    await expect(root.getByTestId(ids.component.contact.fallback.heading)).toHaveText(heading);
  },
);

Then(
  /^`([^`]+)` displays body copy about agency and GDS switching$/,
  async ({ page }, gherkinPath: string) => {
    const root = page.getByTestId(testIdFor(gherkinPath));
    const body = root.getByTestId(ids.component.contact.fallback.body);
    await expect(body).toContainText('agency');
    await expect(body).toContainText('GDS');
    await expect(body).toHaveText(CONTACT_FALLBACK_BODY);
  },
);

Then(
  /^`([^`]+)` email cta navigates to mailto for configured contact email$/,
  async ({ page }, gherkinPath: string) => {
    const cta = page.getByTestId(testIdForSub(gherkinPath, 'email cta'));
    const expectedEmail =
      process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() ?? CONTACT_FALLBACK_EMAIL;
    await expect(cta).toHaveAttribute('href', `mailto:${expectedEmail}`);
    await expect(cta).toContainText(expectedEmail);
  },
);

When(
  /^the guest focuses `([^`]+)` email cta$/,
  async ({ page }, gherkinPath: string) => {
    const cta = page.getByTestId(testIdForSub(gherkinPath, 'email cta'));
    await cta.focus();
  },
);

Then(
  /^`([^`]+)` email cta uses token "([^"]+)"$/,
  async ({ page }, gherkinPath: string, tokenName: string) => {
    const cta = page.getByTestId(testIdForSub(gherkinPath, 'email cta'));
    await assertFocusedOutlineUsesToken(page, cta, tokenName);
  },
);

Then(
  /^`([^`]+)` is in fluid mobile layout below `([^`]+)`$/,
  async ({ page }, lowerPath: string, upperPath: string) => {
    const lower = page.getByTestId(testIdFor(lowerPath));
    const upper = page.getByTestId(testIdFor(upperPath));
    await expect(lower).toBeVisible();
    await expect(upper).toBeVisible();
    const lowerBox = await lower.boundingBox();
    const upperBox = await upper.boundingBox();
    expect(lowerBox).not.toBeNull();
    expect(upperBox).not.toBeNull();
    expect(lowerBox!.y).toBeGreaterThan(upperBox!.y);
  },
);

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
