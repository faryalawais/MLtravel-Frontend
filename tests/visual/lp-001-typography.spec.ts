import { test } from '@playwright/test';
import { ids } from '@/tokens/build/test-ids';
import { expectTypography, FIGMA_TYPOGRAPHY } from './helpers/typography';

const landing = ids.component.landing;

test.describe('LP-001 typography fidelity (Figma cache)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('hero desktop heading 48px/700', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1200 });
    await expectTypography(
      page.getByTestId(landing.hero.textBlock).locator('h1'),
      FIGMA_TYPOGRAPHY.heroHeadingDesktop,
    );
  });

  test('problem section header desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1200 });
    await page.getByTestId(landing.problem.root).scrollIntoViewIfNeeded();

    await expectTypography(
      page.getByTestId(landing.problem.sectionPillLabel),
      FIGMA_TYPOGRAPHY.sectionPillDesktop,
    );
    await expectTypography(
      page.getByTestId(landing.problem.sectionHeading),
      FIGMA_TYPOGRAPHY.sectionHeadingDesktop,
    );
    await expectTypography(
      page.getByTestId(landing.problem.sectionSubtitle),
      FIGMA_TYPOGRAPHY.sectionSubtitleDesktop,
    );
    await expectTypography(
      page.getByTestId(landing.problem.card1Heading),
      FIGMA_TYPOGRAPHY.problemCardTitleDesktop,
    );
    await expectTypography(
      page.getByTestId(landing.problem.card1Body),
      FIGMA_TYPOGRAPHY.problemCardBodyDesktop,
    );
  });

  test('comparison section header desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1200 });
    await page.getByTestId(landing.comparisonFirst.root).scrollIntoViewIfNeeded();

    await expectTypography(
      page.getByTestId(landing.comparisonFirst.sectionPillLabel),
      FIGMA_TYPOGRAPHY.sectionPillDesktop,
    );
    await expectTypography(
      page.getByTestId(landing.comparisonFirst.sectionHeading),
      FIGMA_TYPOGRAPHY.sectionHeadingDesktop,
    );
    await expectTypography(
      page.getByTestId(landing.comparisonFirst.industryTitleLine1),
      FIGMA_TYPOGRAPHY.comparisonCardHeaderDesktop,
    );
    await expectTypography(
      page.getByTestId(landing.comparisonFirst.industryRow1Title),
      FIGMA_TYPOGRAPHY.comparisonRowTitleDesktop,
    );
    await expectTypography(
      page.getByTestId(landing.comparisonFirst.industryRow1Body),
      FIGMA_TYPOGRAPHY.comparisonRowBodyDesktop,
    );
  });

  test('how-it-works teaser section header desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1200 });
    await page.getByTestId(landing.howItWorksTeaser.root).scrollIntoViewIfNeeded();

    await expectTypography(
      page.getByTestId(landing.howItWorksTeaser.sectionRoot),
      FIGMA_TYPOGRAPHY.sectionPillDesktop,
    );
    await expectTypography(
      page.getByTestId(landing.howItWorksTeaser.textBlock),
      FIGMA_TYPOGRAPHY.sectionHeadingDesktop,
    );
    await expectTypography(
      page.getByTestId(landing.howItWorksTeaser.textBlock2),
      FIGMA_TYPOGRAPHY.sectionSubtitleDesktop,
    );
    await expectTypography(
      page.getByTestId(landing.howItWorksTeaser.textBlock5),
      FIGMA_TYPOGRAPHY.hiwCardBodyDesktop,
    );
  });

  test('how-it-works teaser mobile section header', async ({ page }) => {
    await page.setViewportSize({ width: 393, height: 1800 });
    await page.getByTestId(landing.howItWorksTeaser.mobile.sectionRoot).scrollIntoViewIfNeeded();

    await expectTypography(
      page.getByTestId(landing.howItWorksTeaser.mobile.sectionRoot2),
      FIGMA_TYPOGRAPHY.sectionPillMobile,
    );
    await expectTypography(
      page.getByTestId(landing.howItWorksTeaser.mobile.textBlock),
      FIGMA_TYPOGRAPHY.sectionHeadingMobile,
    );
    await expectTypography(
      page.getByTestId(landing.howItWorksTeaser.mobile.paragraph),
      FIGMA_TYPOGRAPHY.sectionSubtitleDesktop,
    );
  });

  test('feature grid section header and card desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1400 });
    await page.getByTestId(landing.featureGrid.root).scrollIntoViewIfNeeded();

    await expectTypography(
      page.getByTestId(landing.featureGrid.sectionPillLabel),
      FIGMA_TYPOGRAPHY.sectionPillDesktop,
    );
    await expectTypography(
      page.getByTestId(landing.featureGrid.headingline1),
      FIGMA_TYPOGRAPHY.sectionHeadingDesktop,
    );
    await expectTypography(
      page.getByTestId(landing.featureGrid.subtitle),
      FIGMA_TYPOGRAPHY.sectionSubtitleDesktop,
    );
    await expectTypography(
      page.getByTestId(landing.featureGrid.title),
      FIGMA_TYPOGRAPHY.featureGridCardTitleDesktop,
    );
    await expectTypography(
      page.getByTestId(landing.featureGrid.body),
      FIGMA_TYPOGRAPHY.featureGridCardBodyDesktop,
    );
  });

  test('feature grid mobile heading 32px/700', async ({ page }) => {
    await page.setViewportSize({ width: 393, height: 1600 });
    await page.getByTestId(landing.featureGrid.mobile.root).scrollIntoViewIfNeeded();

    await expectTypography(
      page.getByTestId(landing.featureGrid.mobile.heading).locator('h2'),
      FIGMA_TYPOGRAPHY.sectionHeadingMobile,
    );
    await expectTypography(
      page.getByTestId(landing.featureGrid.mobile.paragraph),
      FIGMA_TYPOGRAPHY.sectionSubtitleDesktop,
    );
  });

  test('social proof section header and quote desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1400 });
    await page.getByTestId(landing.socialProof.root).scrollIntoViewIfNeeded();

    await expectTypography(
      page.getByTestId(landing.socialProof.trustedByLeaders),
      FIGMA_TYPOGRAPHY.sectionPillDesktop,
    );
    await expectTypography(
      page.getByTestId(landing.socialProof.textBlock2),
      FIGMA_TYPOGRAPHY.sectionHeadingDesktop,
    );
    await expectTypography(
      page.getByTestId(landing.socialProof.paragraph),
      FIGMA_TYPOGRAPHY.sectionSubtitleDesktop,
    );
    await expectTypography(page.getByTestId(landing.socialProof.quote), {
      fontSize: 24,
      fontWeight: '500',
    });
  });
});
