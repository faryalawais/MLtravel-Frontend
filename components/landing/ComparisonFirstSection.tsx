'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useState, type CSSProperties } from 'react';
import {
  COMPARISON_CARD_HEADER_BADGE_INDUSTRY_CLASS,
  COMPARISON_CARD_HEADER_BADGE_MAQSOOD_CLASS,
  COMPARISON_CARD_HEADER_BADGE_MOBILE_CLASS,
  COMPARISON_CARD_HEADER_TITLE_DESKTOP_CLASS,
  COMPARISON_CARD_HEADER_TITLE_MOBILE_CLASS,
  COMPARISON_FOOTNOTE_DESKTOP_CLASS,
  COMPARISON_FOOTNOTE_EMPHASIS_CLASS,
  COMPARISON_FOOTNOTE_MOBILE_CLASS,
  COMPARISON_MOTION_STYLE,
  COMPARISON_ROW_BODY_DESKTOP_CLASS,
  COMPARISON_ROW_BODY_MOBILE_CLASS,
  COMPARISON_ROW_MICRO_TAG_DESKTOP_CLASS,
  COMPARISON_ROW_MICRO_TAG_MOBILE_CLASS,
  COMPARISON_ROW_TITLE_DESKTOP_CLASS,
  COMPARISON_ROW_TITLE_MOBILE_CLASS,
  COMPARISON_SECTION_SUBTITLE_MOBILE_CLASS,
  COMPARISON_STAMP_DESKTOP_CLASS,
  COMPARISON_STAMP_MOBILE_CLASS,
  COMPARISON_TOKENS,
  INDUSTRY_DESKTOP_ROWS,
  INDUSTRY_MOBILE_ROWS,
  LANDING_SECTION_HEADING_ACCENT_CLASS,
  LANDING_SECTION_HEADING_DESKTOP_CLASS,
  LANDING_SECTION_HEADING_MOBILE_CLASS,
  LANDING_SECTION_PILL_LABEL_DESKTOP_CLASS,
  LANDING_SECTION_PILL_LABEL_MOBILE_CLASS,
  LANDING_SECTION_SUBTITLE_CLASS,
  MAQSOOD_DESKTOP_ROWS,
  MAQSOOD_MOBILE_ROWS,
} from '@/constants/landing.constants';
import { getMotionRevealStyle } from '@/constants/motion.constants';
import { useOneWayMotion } from '@/lib/use-one-way-motion';
import { ids } from '@/tokens/build/test-ids';
import type {
  ComparisonCtaProps,
  ComparisonMobileRowConfig,
  ComparisonRowAccent,
  ComparisonRowConfig,
} from '@/types/landing.types';

const comparison = ids.component.landing.comparisonFirst;

function rowAccentStyles(accent: ComparisonRowAccent) {
  const tokenMap = {
    danger: '--color-text-danger',
    success: '--color-text-success',
    navy: '--color-text-brand-navy',
    orange: '--color-text-brand-orange',
  } as const;
  const token = tokenMap[accent];

  return {
    tagBg: `bg-[color-mix(in_srgb,var(${token})_8%,transparent)]`,
    tagText: `text-[var(${token})]`,
    stampText: `text-[var(${token})]`,
    tagMuted: accent === 'danger' ? 'opacity-50' : '',
    stampMuted: accent === 'danger' ? 'opacity-50' : '',
    rowDivider: `bg-[color-mix(in_srgb,var(${token})_8%,transparent)]`,
  };
}

function variantStyles(variant: 'industry' | 'maqsood') {
  const isIndustry = variant === 'industry';
  return {
    revealBorder: isIndustry
      ? 'border-[var(--color-border-warning)]'
      : 'border-[var(--color-border-info)]',
    accentBar: isIndustry
      ? 'bg-[var(--color-pill-problem-background)]'
      : 'bg-[linear-gradient(to_right,var(--color-text-brand-orange),var(--color-text-brand-navy))]',
    headerBg: isIndustry
      ? 'bg-[color-mix(in_srgb,var(--color-text-danger)_11%,transparent)]'
      : 'bg-[var(--color-background-dark-deep)]',
    titleLine1: isIndustry
      ? 'text-[var(--color-text-primary)]'
      : 'text-[var(--color-text-inverse)]',
    titleLine2: isIndustry
      ? 'text-[var(--color-text-danger)]'
      : 'text-[var(--color-text-brand-orange)]',
    badge:
      'inline-flex w-fit items-center rounded-[var(--radius-3)] px-[var(--spacing-10)] py-[var(--spacing-5)]',
    badgeLabelIndustry: COMPARISON_CARD_HEADER_BADGE_INDUSTRY_CLASS,
    badgeLabelMaqsood: COMPARISON_CARD_HEADER_BADGE_MAQSOOD_CLASS,
    badgeLabelMobileIndustry: `${COMPARISON_CARD_HEADER_BADGE_MOBILE_CLASS} text-[var(--color-text-brand-orange)]`,
    badgeLabelMobileMaqsood: `${COMPARISON_CARD_HEADER_BADGE_MOBILE_CLASS} text-[var(--color-text-success)]`,
    badgeSurface: isIndustry
      ? 'border border-[var(--color-border-warning)] bg-[color-mix(in_srgb,var(--color-text-brand-orange)_8%,transparent)]'
      : 'border border-[var(--color-pill-solution-border)] bg-[color-mix(in_srgb,var(--color-pill-solution-background)_8%,transparent)]',
    cardBg: isIndustry
      ? 'bg-[var(--color-background-surface-warm)]'
      : 'bg-[var(--color-background-subtle)]',
  };
}

function ComparisonSectionPill({
  pillTestId,
  labelTestId,
  dotTestId,
  variant = 'desktop',
}: {
  pillTestId: string;
  labelTestId: string;
  dotTestId?: string;
  variant?: 'desktop' | 'mobile';
}) {
  const isMobile = variant === 'mobile';

  return (
    <div
      data-testid={pillTestId}
      className={
        isMobile
          ? 'inline-flex items-center justify-center gap-[var(--spacing-6)] rounded-[var(--radius-pill)] border border-[var(--color-pill-feature-border)] bg-[color-mix(in_srgb,var(--color-pill-feature-background)_8%,transparent)] px-[var(--spacing-12)] py-[var(--spacing-8)]'
          : 'inline-flex items-center justify-center gap-[var(--spacing-8)] rounded-[var(--radius-pill)] border border-[var(--color-pill-feature-border)] bg-[color-mix(in_srgb,var(--color-pill-feature-background)_8%,transparent)] px-[var(--spacing-16)] py-[var(--spacing-8)]'
      }
    >
      <span
        data-testid={dotTestId}
        aria-hidden="true"
        className="size-[var(--spacing-6)] shrink-0 rounded-full bg-[var(--color-pill-feature-border)]"
      />
      <span
        data-testid={labelTestId}
        className={
          isMobile ? LANDING_SECTION_PILL_LABEL_MOBILE_CLASS : LANDING_SECTION_PILL_LABEL_DESKTOP_CLASS
        }
      >
        The Choice
      </span>
    </div>
  );
}

function ComparisonDemoCta({
  ctaTestId,
  labelTestId,
  iconTestId,
  graphicTestId,
}: ComparisonCtaProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href="/contact"
      data-testid={ctaTestId}
      data-motion-duration="motion.duration.default"
      onMouseEnter={() => setHovered(true)}
      className="inline-flex items-center justify-center gap-[var(--spacing-6)] rounded-[var(--radius-6)] px-[var(--spacing-32)] py-[var(--spacing-12)] text-label-desktop-lg transition-[background-color,color] focus-visible:outline focus-visible:outline-[length:var(--spacing-3)] focus-visible:outline-offset-[var(--spacing-3)] focus-visible:outline-[var(--color-focus-ring)]"
      style={{
        ...COMPARISON_MOTION_STYLE,
        transitionProperty: 'background-color, color',
        backgroundColor: hovered
          ? 'var(--color-action-primary-hover-background)'
          : 'var(--color-action-primary-default-background)',
        color: hovered
          ? 'var(--color-action-primary-hover-label)'
          : 'var(--color-action-primary-default-label)',
      }}
    >
      <span data-testid={labelTestId}>Book A Free Demo</span>
      <span data-testid={iconTestId} className="inline-flex shrink-0" aria-hidden="true">
        {graphicTestId ? (
          <Image
            data-testid={graphicTestId}
            src="/icons/icon-plane-arrow-white.svg"
            alt=""
            width={16}
            height={16}
            className="size-[var(--spacing-16)]"
          />
        ) : (
          <Image
            src="/icons/icon-plane-arrow-white.svg"
            alt=""
            width={16}
            height={16}
            className="size-[var(--spacing-16)]"
          />
        )}
      </span>
    </Link>
  );
}

function RowDivider({ accent }: { accent: ComparisonRowAccent }) {
  const { rowDivider } = rowAccentStyles(accent);
  return <div aria-hidden="true" className={`h-px w-full opacity-50 ${rowDivider}`} />;
}

function ComparisonRowDesktop({
  row,
  showDivider = true,
}: {
  row: ComparisonRowConfig;
  showDivider?: boolean;
}) {
  const { tagBg, tagText, tagMuted, stampText, stampMuted } = rowAccentStyles(row.accent);

  return (
    <>
      <div data-testid={row.rowTestId} className="flex flex-col gap-[var(--spacing-8)]">
        <div
          data-testid={row.microTagTestId}
          className={`inline-flex w-fit rounded-[var(--radius-3)] px-[var(--spacing-8)] py-[var(--spacing-3)] ${tagBg} ${tagMuted}`}
        >
          <span
            data-testid={row.tagLabelTestId}
            className={`${COMPARISON_ROW_MICRO_TAG_DESKTOP_CLASS} ${tagText}`}
          >
            {row.tagLabel}
          </span>
        </div>
        <div className="flex flex-col gap-[var(--spacing-4)]">
          <p data-testid={row.titleTestId} className={COMPARISON_ROW_TITLE_DESKTOP_CLASS}>
            {row.title}
          </p>
          <p data-testid={row.bodyTestId} className={COMPARISON_ROW_BODY_DESKTOP_CLASS}>
            {row.body}
          </p>
        </div>
        <div data-testid={row.stampTestId} className="flex justify-end">
          <span
            data-testid={row.stampLabelTestId}
            className={`text-right ${COMPARISON_STAMP_DESKTOP_CLASS} ${stampText} ${stampMuted}`}
          >
            {row.stampLabel}
          </span>
        </div>
      </div>
      {showDivider ? <RowDivider accent={row.accent} /> : null}
    </>
  );
}

function ComparisonRowMobile({
  row,
  showDivider = true,
}: {
  row: ComparisonMobileRowConfig;
  showDivider?: boolean;
}) {
  const { tagBg, tagText, tagMuted, stampText, stampMuted } = rowAccentStyles(row.accent);

  return (
    <>
      <div data-testid={row.rowTestId} className="flex flex-col gap-[var(--spacing-6)]">
        <span
          data-testid={row.tagTestId}
          className={`inline-flex w-fit rounded-[var(--radius-3)] px-[var(--spacing-8)] py-[var(--spacing-3)] ${COMPARISON_ROW_MICRO_TAG_MOBILE_CLASS} ${tagBg} ${tagText} ${tagMuted}`}
        >
          {row.tagLabel}
        </span>
        <p data-testid={row.titleTestId} className={COMPARISON_ROW_TITLE_MOBILE_CLASS}>
          {row.title}
        </p>
        <p data-testid={row.bodyTestId} className={COMPARISON_ROW_BODY_MOBILE_CLASS}>
          {row.body}
        </p>
        <span
          data-testid={row.stampTestId}
          className={`self-end text-right ${COMPARISON_STAMP_MOBILE_CLASS} ${stampText} ${stampMuted}`}
        >
          {row.stampLabel}
        </span>
      </div>
      {showDivider ? <RowDivider accent={row.accent} /> : null}
    </>
  );
}

function getCardEmphasisStyle(revealed: boolean): CSSProperties {
  return {
    ...COMPARISON_MOTION_STYLE,
    transitionProperty: 'border-color, box-shadow',
    boxShadow: revealed ? COMPARISON_TOKENS.shadowTicketReveal : 'none',
  };
}

function IndustryCardDesktop({ revealed }: { revealed: boolean }) {
  const styles = variantStyles('industry');

  return (
    <article
      data-testid={comparison.industryCard}
      className={`flex min-w-0 flex-1 flex-col overflow-hidden border-y border-l border-r border-[var(--color-border-default)] ${styles.cardBg} ${revealed ? styles.revealBorder : ''}`}
      style={getCardEmphasisStyle(revealed)}
    >
      <header
        data-testid={comparison.industryCardHeader}
        className={`flex flex-col ${styles.headerBg}`}
      >
        <span
          aria-hidden="true"
          className={`h-[var(--spacing-6)] w-full shrink-0 ${styles.accentBar}`}
        />
        <div className="flex flex-col gap-[var(--spacing-16)] px-[var(--spacing-28)] py-[var(--spacing-24)]">
          <div
            data-testid={comparison.industryBadge}
            className={`${styles.badge} ${styles.badgeSurface}`}
          >
            <span data-testid={comparison.industryBadgeLabel} className={styles.badgeLabelIndustry}>
              ⚠ INDUSTRY NORM
            </span>
          </div>
          <div className="flex flex-col gap-[var(--spacing-4)]">
            <h3
              data-testid={comparison.industryTitleLine1}
              className={`${COMPARISON_CARD_HEADER_TITLE_DESKTOP_CLASS} ${styles.titleLine1}`}
            >
              Renting a seat on their platform
            </h3>
            <h3
              data-testid={comparison.industryTitleLine2}
              className={`${COMPARISON_CARD_HEADER_TITLE_DESKTOP_CLASS} ${styles.titleLine2}`}
            >
              Costs You Twice.
            </h3>
          </div>
        </div>
      </header>
      <div
        data-testid={comparison.industryCardBody}
        className="flex flex-col gap-[var(--spacing-24)] px-[var(--spacing-28)] py-[var(--spacing-40)]"
      >
        {INDUSTRY_DESKTOP_ROWS.map((row, index) => (
          <ComparisonRowDesktop
            key={row.rowTestId}
            row={row}
            showDivider={index < INDUSTRY_DESKTOP_ROWS.length - 1}
          />
        ))}
      </div>
    </article>
  );
}

function MaqsoodCardDesktop({ revealed }: { revealed: boolean }) {
  const styles = variantStyles('maqsood');

  return (
    <article
      data-testid={comparison.maqsoodCard}
      className={`flex min-w-0 flex-1 flex-col overflow-hidden border-y border-r border-[var(--color-border-info)] ${styles.cardBg} ${revealed ? styles.revealBorder : ''}`}
      style={getCardEmphasisStyle(revealed)}
    >
      <header
        data-testid={comparison.maqsoodCardHeader}
        className={`flex flex-col ${styles.headerBg}`}
      >
        <span
          aria-hidden="true"
          className={`h-[var(--spacing-6)] w-full shrink-0 ${styles.accentBar}`}
        />
        <div className="flex flex-col gap-[var(--spacing-16)] px-[var(--spacing-28)] py-[var(--spacing-24)]">
          <div
            data-testid={comparison.maqsoodBadge}
            className={`${styles.badge} ${styles.badgeSurface}`}
          >
            <span data-testid={comparison.maqsoodBadgeLabel} className={styles.badgeLabelMaqsood}>
              ✈ MAQSOODTRAVEL
            </span>
          </div>
          <div className="flex flex-col gap-[var(--spacing-4)]">
            <h3
              data-testid={comparison.maqsoodTitleLine1}
              className={`${COMPARISON_CARD_HEADER_TITLE_DESKTOP_CLASS} ${styles.titleLine1}`}
            >
              You Own Every
            </h3>
            <h3
              data-testid={comparison.maqsoodTitleLine2}
              className={`${COMPARISON_CARD_HEADER_TITLE_DESKTOP_CLASS} ${styles.titleLine2}`}
            >
              Booking. Forever.
            </h3>
          </div>
        </div>
      </header>
      <div
        data-testid={comparison.maqsoodCardBody}
        className="flex flex-col gap-[var(--spacing-24)] px-[var(--spacing-28)] py-[var(--spacing-40)]"
      >
        {MAQSOOD_DESKTOP_ROWS.map((row, index) => (
          <ComparisonRowDesktop
            key={row.rowTestId}
            row={row}
            showDivider={index < MAQSOOD_DESKTOP_ROWS.length - 1}
          />
        ))}
      </div>
    </article>
  );
}

function GiantTicketDesktop({ revealed }: { revealed: boolean }) {
  return (
    <div
      data-testid={comparison.giantTicket}
      className="relative flex w-full flex-row items-stretch overflow-hidden rounded-[var(--radius-panel)] border border-[var(--color-border-subtle)] bg-[var(--color-background-surface)]"
      style={{
        ...COMPARISON_MOTION_STYLE,
        transitionProperty: 'box-shadow',
        boxShadow: revealed ? COMPARISON_TOKENS.shadowTicketReveal : COMPARISON_TOKENS.shadowTicket,
      }}
    >
      <div
        data-testid={comparison.notchTop}
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 z-10 size-[calc(var(--spacing-32)+var(--spacing-4))] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-background-page)]"
      />
      <IndustryCardDesktop revealed={revealed} />
      <MaqsoodCardDesktop revealed={revealed} />
    </div>
  );
}

function IndustryCardMobile() {
  const styles = variantStyles('industry');

  return (
    <article
      data-testid={comparison.mobile.industryCard}
      className={`flex w-full flex-col overflow-hidden rounded-[var(--radius-panel)] border border-[var(--color-border-default)] ${styles.cardBg}`}
    >
      <span
        aria-hidden="true"
        className={`h-[var(--spacing-5)] w-full shrink-0 ${styles.accentBar}`}
      />
      <header
        data-testid={comparison.mobile.industryCardHeader}
        className={`flex flex-col px-[var(--spacing-16)] py-[var(--spacing-16)] ${styles.headerBg}`}
      >
        <div
          data-testid={comparison.mobile.industryBadge}
          className={`mb-[var(--spacing-12)] ${styles.badge} ${styles.badgeSurface}`}
        >
          <span className={styles.badgeLabelMobileIndustry}>⚠ INDUSTRY NORM</span>
        </div>
        <h3
          data-testid={comparison.mobile.industryTitleLine1}
          className={`${COMPARISON_CARD_HEADER_TITLE_MOBILE_CLASS} ${styles.titleLine1}`}
        >
          Every Booking
        </h3>
        <h3
          data-testid={comparison.mobile.industryTitleLine2}
          className={`${COMPARISON_CARD_HEADER_TITLE_MOBILE_CLASS} ${styles.titleLine2}`}
        >
          Costs You Twice.
        </h3>
      </header>
      <div
        data-testid={comparison.mobile.industryCardBody}
        className="flex flex-col gap-[var(--spacing-16)] px-[var(--spacing-16)] py-[var(--spacing-24)]"
      >
        {INDUSTRY_MOBILE_ROWS.map((row, index) => (
          <ComparisonRowMobile
            key={row.rowTestId}
            row={row}
            showDivider={index < INDUSTRY_MOBILE_ROWS.length - 1}
          />
        ))}
      </div>
    </article>
  );
}

function MaqsoodCardMobile() {
  const styles = variantStyles('maqsood');

  return (
    <article
      data-testid={comparison.mobile.maqsoodCard}
      className={`flex w-full flex-col overflow-hidden rounded-[var(--radius-panel)] border border-[var(--color-border-info)] ${styles.cardBg}`}
    >
      <span
        aria-hidden="true"
        className={`h-[var(--spacing-5)] w-full shrink-0 ${styles.accentBar}`}
      />
      <header
        data-testid={comparison.mobile.maqsoodCardHeader}
        className={`flex flex-col px-[var(--spacing-16)] py-[var(--spacing-16)] ${styles.headerBg}`}
      >
        <div
          data-testid={comparison.mobile.maqsoodBadge}
          className={`mb-[var(--spacing-12)] ${styles.badge} ${styles.badgeSurface}`}
        >
          <span className={styles.badgeLabelMobileMaqsood}>✈ MAQSOODTRAVEL</span>
        </div>
        <h3
          data-testid={comparison.mobile.maqsoodTitleLine1}
          className={`${COMPARISON_CARD_HEADER_TITLE_MOBILE_CLASS} ${styles.titleLine1}`}
        >
          You Own Every
        </h3>
        <h3
          data-testid={comparison.mobile.maqsoodTitleLine2}
          className={`${COMPARISON_CARD_HEADER_TITLE_MOBILE_CLASS} ${styles.titleLine2}`}
        >
          Booking. Forever.
        </h3>
      </header>
      <div
        data-testid={comparison.mobile.maqsoodCardBody}
        className="flex flex-col gap-[var(--spacing-16)] px-[var(--spacing-16)] py-[var(--spacing-24)]"
      >
        {MAQSOOD_MOBILE_ROWS.map((row, index) => (
          <ComparisonRowMobile
            key={row.rowTestId}
            row={row}
            showDivider={index < MAQSOOD_MOBILE_ROWS.length - 1}
          />
        ))}
      </div>
    </article>
  );
}

function ComparisonFootnote({
  testId,
  variant = 'desktop',
}: {
  testId: string;
  variant?: 'desktop' | 'mobile';
}) {
  const className =
    variant === 'mobile' ? COMPARISON_FOOTNOTE_MOBILE_CLASS : COMPARISON_FOOTNOTE_DESKTOP_CLASS;
  const brandName = variant === 'mobile' ? 'MaqsoodTravel' : 'MaqqsedTravel';

  return (
    <p data-testid={testId} className={`max-w-[640px] ${className}`}>
      Agencies on 3rd-party GDS portals typically spend $1,200–$2,000/month in combined platform and
      per-booking fees. <span className={COMPARISON_FOOTNOTE_EMPHASIS_CLASS}>{brandName}</span> starts
      at $250/month.
    </p>
  );
}

function ComparisonCtaBlock({
  footnoteTestId,
  footnoteVariant = 'desktop',
  ctaTestId,
  labelTestId,
  iconTestId,
  graphicTestId,
  blockTestId,
  revealed = false,
}: {
  footnoteTestId: string;
  footnoteVariant?: 'desktop' | 'mobile';
  ctaTestId: string;
  labelTestId: string;
  iconTestId: string;
  graphicTestId?: string;
  blockTestId: string;
  revealed?: boolean;
}) {
  return (
    <div
      data-testid={blockTestId}
      className="flex w-full flex-col items-center gap-[var(--spacing-16)] text-center"
      style={getMotionRevealStyle(revealed, COMPARISON_MOTION_STYLE)}
    >
      <ComparisonFootnote testId={footnoteTestId} variant={footnoteVariant} />
      <ComparisonDemoCta
        ctaTestId={ctaTestId}
        labelTestId={labelTestId}
        iconTestId={iconTestId}
        graphicTestId={graphicTestId}
      />
    </div>
  );
}

export function ComparisonFirstSection() {
  const [revealed, setRevealed] = useState(false);

  const playReveal = useCallback(() => {
    setRevealed(true);
    return () => undefined;
  }, []);

  const triggerReveal = useOneWayMotion(playReveal);

  return (
    <section
      data-testid={comparison.root}
      aria-label="The Choice"
      className="bg-[var(--color-background-page)]"
    >
      {/* Desktop — Figma 5164:6566 */}
      <div className="hidden min-[1440px]:block">
        <div
          data-testid={comparison.motion.root}
          className="flex justify-center px-[var(--spacing-64)] py-[var(--spacing-40)]"
          onMouseEnter={triggerReveal}
        >
          <div
            data-testid={comparison.columnsFrame}
            className="flex w-full max-w-[1312px] flex-col items-center gap-[var(--spacing-40)]"
          >
            <div
              data-testid={comparison.sectionHeader}
              className="flex w-full max-w-[1035px] flex-col items-center gap-[var(--spacing-16)] text-center"
              style={getMotionRevealStyle(revealed, COMPARISON_MOTION_STYLE)}
            >
              <ComparisonSectionPill
                pillTestId={comparison.sectionPill}
                labelTestId={comparison.sectionPillLabel}
              />
              <div
                data-testid={comparison.headingBlock}
                className="flex flex-col items-center gap-[var(--spacing-8)]"
                style={getMotionRevealStyle(revealed, COMPARISON_MOTION_STYLE)}
              >
                <h2
                  data-testid={comparison.sectionHeading}
                  className={LANDING_SECTION_HEADING_DESKTOP_CLASS}
                  style={getMotionRevealStyle(revealed, COMPARISON_MOTION_STYLE)}
                >
                  Dependency or{' '}
                  <span className={LANDING_SECTION_HEADING_ACCENT_CLASS}>Ownership</span>
                </h2>
                <p
                  data-testid={comparison.sectionSubtitle}
                  className={LANDING_SECTION_SUBTITLE_CLASS}
                  style={getMotionRevealStyle(revealed, COMPARISON_MOTION_STYLE, {
                    transitionDelay: 'var(--motion-duration-step-delay)',
                  })}
                >
                  The travel industry runs on outdated models built for their profit, not yours. Choose
                  differently.
                </p>
              </div>
            </div>

            <GiantTicketDesktop revealed={revealed} />

            <ComparisonCtaBlock
              blockTestId={comparison.ctaBlock}
              footnoteTestId={comparison.footnote}
              footnoteVariant="desktop"
              ctaTestId={comparison.cta}
              labelTestId={comparison.ctaLabel}
              iconTestId={comparison.ctaIcon}
              graphicTestId={comparison.ctaGraphic}
              revealed={revealed}
            />
          </div>
        </div>
      </div>

      {/* Mobile — Figma 5164:6609 */}
      <div
        data-testid={comparison.mobile.root}
        className="flex min-h-0 flex-col justify-between gap-[var(--spacing-32)] px-[var(--spacing-16)] py-[var(--spacing-28)] min-[1440px]:hidden"
      >
        <div className="flex flex-col gap-[var(--spacing-32)]">
          <div
            data-testid={comparison.mobile.headerBlock}
            className="flex flex-col items-center gap-[var(--spacing-8)] text-center"
          >
            <ComparisonSectionPill
              pillTestId={comparison.mobile.sectionPill}
              labelTestId={comparison.mobile.sectionPillLabel}
              dotTestId={comparison.mobile.sectionPillDot}
              variant="mobile"
            />
            <div
              data-testid={comparison.mobile.headRow}
              className="flex flex-wrap items-center justify-center gap-x-[var(--spacing-8)]"
            >
              <h2
                data-testid={comparison.mobile.sectionHeadingLine1}
                className={LANDING_SECTION_HEADING_MOBILE_CLASS}
              >
                Dependency or
              </h2>
              <h2
                data-testid={comparison.mobile.sectionHeadingLine2}
                className={`${LANDING_SECTION_HEADING_MOBILE_CLASS} ${LANDING_SECTION_HEADING_ACCENT_CLASS}`}
              >
                Ownership
              </h2>
            </div>
            <p data-testid={comparison.mobile.sectionSubtitle} className={COMPARISON_SECTION_SUBTITLE_MOBILE_CLASS}>
              The travel industry runs on outdated models built for their profit, not yours. Choose
              differently.
            </p>
          </div>

          <div
            data-testid={comparison.mobile.contentFrame}
            className="flex flex-col gap-[var(--spacing-32)]"
          >
            <div
              data-testid={comparison.mobile.giantTicket}
              className="flex flex-col gap-[var(--spacing-16)]"
            >
              <IndustryCardMobile />
              <MaqsoodCardMobile />
            </div>
          </div>
        </div>

        <ComparisonCtaBlock
          blockTestId={comparison.mobile.ctaBlock}
          footnoteTestId={comparison.mobile.footnote}
          footnoteVariant="mobile"
          ctaTestId={comparison.mobile.cta}
          labelTestId={comparison.mobile.ctaLabel}
          iconTestId={comparison.mobile.ctaIcon}
        />
      </div>
    </section>
  );
}
