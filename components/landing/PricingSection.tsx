'use client';

import Image from 'next/image';
import { useCallback, useState, type CSSProperties } from 'react';
import { HeroPrimaryCta } from '@/components/landing/HeroPrimaryCta';
import {
  LANDING_SECTION_HEADING_ACCENT_CLASS,
  LANDING_SECTION_HEADING_DESKTOP_CLASS,
  LANDING_SECTION_HEADING_MOBILE_CLASS,
  LANDING_SECTION_SUBTITLE_CLASS,
  PRICING_ADDON_AMOUNT,
  PRICING_ADDON_FOOTNOTE,
  PRICING_ADDON_LABEL,
  PRICING_ADDON_PERIOD,
  PRICING_BOARDING_LABEL,
  PRICING_BOARDING_LABEL_CLASS,
  PRICING_BOARDING_LABEL_MOBILE_CLASS,
  PRICING_CARD_SHELL_CLASS,
  PRICING_CARD_HEADER_CLASS,
  PRICING_CARD_SUBTITLE_DESKTOP,
  PRICING_CARD_SUBTITLE_MOBILE,
  PRICING_CARD_SUBTITLE_DESKTOP_CLASS,
  PRICING_CARD_SUBTITLE_MOBILE_CLASS,
  PRICING_CARD_TITLE,
  PRICING_CARD_TITLE_DESKTOP_CLASS,
  PRICING_CARD_TITLE_MOBILE_CLASS,
  PRICING_CHECKLIST_HEADING,
  PRICING_CHECKLIST_HEADING_CLASS,
  PRICING_CHECKLIST_HEADING_MOBILE_CLASS,
  PRICING_CHECKLIST_ITEM_CLASS,
  PRICING_CHECKLIST_ITEM_MOBILE_CLASS,
  PRICING_CHECKLIST_ITEMS,
  PRICING_CHECKLIST_ITEMS_MOBILE,
  PRICING_CTA_LABEL,
  PRICING_DESKTOP_FRAME_CLASS,
  PRICING_HEADING_LINE1,
  PRICING_HEADING_LINE2,
  PRICING_MAP_DECORATION_CLASS,
  PRICING_MOTION_STYLE,
  PRICING_PILL_LABEL,
  PRICING_PILL_LABEL_DESKTOP_CLASS,
  PRICING_PILL_LABEL_MOBILE_CLASS,
  PRICING_PLATFORM_FEE_AMOUNT,
  PRICING_PLATFORM_FEE_FOOTNOTE,
  PRICING_PLATFORM_FEE_LABEL,
  PRICING_PRICE_FOOTNOTE_CLASS,
  PRICING_PRICE_FOOTNOTE_MOBILE_CLASS,
  PRICING_PRICE_PRIMARY_DESKTOP_CLASS,
  PRICING_PRICE_PRIMARY_MOBILE_CLASS,
  PRICING_PRICE_SECONDARY_DESKTOP_CLASS,
  PRICING_PRICE_SECONDARY_MOBILE_CLASS,
  PRICING_ROUTE_FROM,
  PRICING_ROUTE_LABEL_DESKTOP_CLASS,
  PRICING_ROUTE_LABEL_MOBILE_CLASS,
  PRICING_ROUTE_PLANE_DESKTOP_SRC,
  PRICING_ROUTE_PLANE_MOBILE_SRC,
  PRICING_ROUTE_STRIP_CLASS,
  PRICING_ROUTE_TO_DESKTOP,
  PRICING_ROUTE_TO_MOBILE,
  PRICING_SECTION_BG_DESKTOP_CLASS,
  PRICING_SECTION_BG_MOBILE_CLASS,
  PRICING_SECTION_PILL_DESKTOP_CLASS,
  PRICING_SECTION_PILL_MOBILE_CLASS,
  PRICING_SECTION_SUBTITLE,
  PRICING_SEAT_LABEL_CLASS,
  PRICING_SEAT_VALUE_CLASS,
  PRICING_TRACKING_LABEL_ADDON_CLASS,
  PRICING_TRACKING_LABEL_ADDON_MOBILE_CLASS,
  PRICING_TRACKING_LABEL_PLATFORM_CLASS,
  PRICING_TRACKING_LABEL_PLATFORM_MOBILE_CLASS,
  PRICING_TRUST_BAR_CLASS,
  PRICING_TRUST_BAR_MOBILE_CLASS,
  PRICING_TRUST_FOOTNOTE,
  PRICING_TRUST_FOOTNOTE_CLASS,
  PRICING_TRUST_FOOTNOTE_MOBILE_CLASS,
  PRICING_TRUST_HEADING,
  PRICING_TRUST_ITEM_CLASS,
  PRICING_TRUST_ITEM_MOBILE_CLASS,
  PRICING_TRUST_ITEMS,
  PRICING_TRUST_ITEMS_MOBILE,
  PRICING_TRUST_LABEL_CLASS,
  PRICING_TRUST_LABEL_MOBILE_CLASS,
} from '@/constants/landing.constants';
import { getMotionRevealStyle } from '@/constants/motion.constants';
import { useOneWayMotion } from '@/lib/use-one-way-motion';
import { ids } from '@/tokens/build/test-ids';
import type { PricingSectionPillProps } from '@/types/landing.types';

const pr = ids.component.landing.pricing;
const prMobile = pr.mobile;

function PricingSectionPill({ pillTestId, labelTestId, variant = 'desktop' }: PricingSectionPillProps) {
  const isMobile = variant === 'mobile';

  return (
    <div
      data-testid={pillTestId}
      className={isMobile ? PRICING_SECTION_PILL_MOBILE_CLASS : PRICING_SECTION_PILL_DESKTOP_CLASS}
    >
      <Image
        src="/icons/icon-section-pill-dot.svg"
        alt=""
        width={7}
        height={7}
        aria-hidden="true"
        className="shrink-0"
      />
      <span
        data-testid={labelTestId}
        className={isMobile ? PRICING_PILL_LABEL_MOBILE_CLASS : PRICING_PILL_LABEL_DESKTOP_CLASS}
      >
        {PRICING_PILL_LABEL}
      </span>
    </div>
  );
}

function ChecklistIcon() {
  return (
    <Image
      src="/icons/icon-pricing-checklist-check.svg"
      alt=""
      width={16}
      height={16}
      aria-hidden="true"
      className="shrink-0"
    />
  );
}

function PricingRouteStrip({
  routeStripTestId,
  fromTestId,
  planeTestId,
  toTestId,
  toLabel,
  planeSrc,
  planeWidth,
  planeHeight,
  labelClass,
}: {
  routeStripTestId: string;
  fromTestId: string;
  planeTestId: string;
  toTestId: string;
  toLabel: string;
  planeSrc: string;
  planeWidth: number;
  planeHeight: number;
  labelClass: string;
}) {
  return (
    <div data-testid={routeStripTestId} className={PRICING_ROUTE_STRIP_CLASS}>
      <span data-testid={fromTestId} className={labelClass}>
        {PRICING_ROUTE_FROM}
      </span>
      <Image
        data-testid={planeTestId}
        src={planeSrc}
        alt=""
        width={planeWidth}
        height={planeHeight}
        unoptimized
        className="mx-[var(--spacing-8)] h-auto shrink-0"
        aria-hidden="true"
      />
      <span data-testid={toTestId} className={labelClass}>
        {toLabel}
      </span>
    </div>
  );
}

function PricingChecklistDesktop() {
  return (
    <div data-testid={pr.checklistGrid} className="flex w-full flex-col gap-[var(--spacing-12)]">
      <p data-testid={pr.everythingIncluded} className={PRICING_CHECKLIST_HEADING_CLASS}>
        {PRICING_CHECKLIST_HEADING}
      </p>
      <div data-testid={pr.columns} className="grid grid-cols-4 gap-x-[var(--spacing-20)] gap-y-[var(--spacing-12)]">
        {PRICING_CHECKLIST_ITEMS.map((item) => (
          <div
            key={item.label}
            data-testid={item.itemTestId}
            className="flex items-center gap-[var(--spacing-6)]"
          >
            <ChecklistIcon />
            <span data-testid={item.testId} className={PRICING_CHECKLIST_ITEM_CLASS}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PricingChecklistMobile() {
  const rows = [
    [PRICING_CHECKLIST_ITEMS_MOBILE[0], PRICING_CHECKLIST_ITEMS_MOBILE[1]],
    [PRICING_CHECKLIST_ITEMS_MOBILE[2], PRICING_CHECKLIST_ITEMS_MOBILE[3]],
    [PRICING_CHECKLIST_ITEMS_MOBILE[4], PRICING_CHECKLIST_ITEMS_MOBILE[5]],
    [PRICING_CHECKLIST_ITEMS_MOBILE[6], PRICING_CHECKLIST_ITEMS_MOBILE[7]],
  ];

  return (
    <div className="flex w-full flex-col gap-[var(--spacing-12)]">
      <p data-testid={prMobile.everythingIncluded} className={PRICING_CHECKLIST_HEADING_MOBILE_CLASS}>
        {PRICING_CHECKLIST_HEADING}
      </p>
      <div className="flex flex-col gap-[var(--spacing-12)]">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex items-center justify-between gap-[var(--spacing-24)]">
            {row.map((item) => (
              <div key={item.label} className="flex min-w-0 flex-1 items-center gap-[var(--spacing-6)]">
                <ChecklistIcon />
                <span data-testid={item.testId} className={PRICING_CHECKLIST_ITEM_MOBILE_CLASS}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function PricingTrustStripDesktop({ footnoteTestId }: { footnoteTestId: string }) {
  return (
    <div data-testid={pr.trustStrip} className="flex w-full max-w-[868px] flex-col gap-[var(--spacing-12)]">
      <div data-testid={pr.allPlansBar} className={PRICING_TRUST_BAR_CLASS}>
        <span data-testid={pr.platformIncludes} className={PRICING_TRUST_LABEL_CLASS}>
          {PRICING_TRUST_HEADING}
        </span>
        <div className="flex flex-1 flex-wrap items-center justify-end gap-[var(--spacing-16)]">
          {PRICING_TRUST_ITEMS.map((item) => (
            <span key={item.label} data-testid={item.testId} className={PRICING_TRUST_ITEM_CLASS}>
              <span aria-hidden="true">{item.emoji} </span>
              {item.label}
            </span>
          ))}
        </div>
      </div>
      <p data-testid={footnoteTestId} className={PRICING_TRUST_FOOTNOTE_CLASS}>
        {PRICING_TRUST_FOOTNOTE}
      </p>
    </div>
  );
}

function PricingTrustStripMobile() {
  return (
    <div data-testid={prMobile.allPlansStrip} className="flex w-full flex-col gap-[var(--spacing-12)]">
      <div className={PRICING_TRUST_BAR_MOBILE_CLASS}>
        <span data-testid={prMobile.platformIncludes} className={PRICING_TRUST_LABEL_MOBILE_CLASS}>
          {PRICING_TRUST_HEADING}
        </span>
        {PRICING_TRUST_ITEMS_MOBILE.map((item) => (
          <span key={item.label} data-testid={item.testId} className={PRICING_TRUST_ITEM_MOBILE_CLASS}>
            <span aria-hidden="true">{item.emoji} </span>
            {item.label}
          </span>
        ))}
      </div>
      <p data-testid={prMobile.textBlock9} className={PRICING_TRUST_FOOTNOTE_MOBILE_CLASS}>
        {PRICING_TRUST_FOOTNOTE}
      </p>
    </div>
  );
}

function PricingCardDesktop({
  ctaTestId,
  labelTestId,
  iconTestId,
  graphicTestId,
  emphasized,
}: {
  ctaTestId: string;
  labelTestId: string;
  iconTestId: string;
  graphicTestId: string;
  emphasized?: boolean;
}) {
  return (
    <article data-testid={pr.pricingCard} className={PRICING_CARD_SHELL_CLASS}>
      <header data-testid={pr.pricingCardHeader} className={PRICING_CARD_HEADER_CLASS}>
        <div data-testid={pr.leftblock} className="flex min-w-0 flex-1 flex-col gap-[var(--spacing-8)]">
          <p data-testid={pr.boardingPassPlatformOwnership} className={PRICING_BOARDING_LABEL_CLASS}>
            {PRICING_BOARDING_LABEL}
          </p>
          <div data-testid={pr.titleblock} className="flex flex-col gap-[var(--spacing-4)]">
            <h3 data-testid={pr.ownYourPlatform} className={PRICING_CARD_TITLE_DESKTOP_CLASS}>
              {PRICING_CARD_TITLE}
            </h3>
            <p data-testid={pr.textBlock5} className={PRICING_CARD_SUBTITLE_DESKTOP_CLASS}>
              {PRICING_CARD_SUBTITLE_DESKTOP}
            </p>
          </div>
        </div>
        <div data-testid={pr.seatblock} className="flex shrink-0 flex-col items-end gap-[var(--spacing-4)] text-right">
          <span data-testid={pr.sEAT} className={PRICING_SEAT_LABEL_CLASS}>
            SEAT
          </span>
          <span data-testid={pr.n32A} className={PRICING_SEAT_VALUE_CLASS}>
            32A
          </span>
        </div>
      </header>

      <div
        data-testid={pr.pricingbody}
        className="flex flex-col gap-[var(--spacing-16)] px-[38px] pb-[var(--spacing-32)] pt-[var(--spacing-16)]"
      >
        <div data-testid={pr.frame2095585112} className="flex items-start gap-[50px]">
          <div data-testid={pr.frame2095585110} className="flex min-w-0 flex-1 flex-col gap-[var(--spacing-8)]">
            <p data-testid={pr.onetimePlatformFee} className={PRICING_TRACKING_LABEL_PLATFORM_CLASS}>
              {PRICING_PLATFORM_FEE_LABEL}
            </p>
            <p data-testid={pr.n3000} className={PRICING_PRICE_PRIMARY_DESKTOP_CLASS}>
              {PRICING_PLATFORM_FEE_AMOUNT}
            </p>
            <p data-testid={pr.textBlock6} className={PRICING_PRICE_FOOTNOTE_CLASS}>
              {PRICING_PLATFORM_FEE_FOOTNOTE}
            </p>
          </div>
          <div data-testid={pr.rectangle} className="w-px self-stretch bg-[var(--color-border-default)]" aria-hidden="true" />
          <div data-testid={pr.frame2095585111} className="flex min-w-0 flex-1 flex-col gap-[var(--spacing-8)]">
            <p data-testid={pr.optionalSupportAddon} className={PRICING_TRACKING_LABEL_ADDON_CLASS}>
              {PRICING_ADDON_LABEL}
            </p>
            <p data-testid={pr.pricerow} className="flex items-baseline gap-[var(--spacing-4)]">
              <span data-testid={pr.n250} className={PRICING_PRICE_SECONDARY_DESKTOP_CLASS}>
                {PRICING_ADDON_AMOUNT}
              </span>
              <span data-testid={pr.month} className={PRICING_PRICE_FOOTNOTE_CLASS}>
                {PRICING_ADDON_PERIOD}
              </span>
            </p>
            <p data-testid={pr.supportUpdatesCancelAnytime} className={PRICING_PRICE_FOOTNOTE_CLASS}>
              {PRICING_ADDON_FOOTNOTE}
            </p>
          </div>
        </div>

        <div data-testid={pr.hdivider} className="h-px w-full bg-[var(--color-border-default)]" aria-hidden="true" />

        <PricingChecklistDesktop />

        <div data-testid={pr.btnwrap} className="flex justify-center pt-[var(--spacing-8)]">
          <HeroPrimaryCta
            testId={ctaTestId}
            labelTestId={labelTestId}
            iconTestId={iconTestId}
            graphicTestId={graphicTestId}
            href="/contact"
            label={PRICING_CTA_LABEL}
            emphasized={emphasized}
          />
        </div>
      </div>
    </article>
  );
}

function PricingCardMobile({
  ctaTestId,
  labelTestId,
  iconTestId,
  graphicTestId,
}: {
  ctaTestId: string;
  labelTestId: string;
  iconTestId: string;
  graphicTestId: string;
}) {
  return (
    <article
      data-testid={prMobile.pricingCard}
      className="flex w-full flex-col gap-[var(--spacing-8)] rounded-[var(--radius-panel)] border-2 border-[var(--color-border-default)] bg-[var(--color-background-page)] p-[var(--spacing-12)] shadow-[var(--shadow-card-navy)]"
    >
      <div className="flex flex-col gap-[var(--spacing-8)] rounded-[var(--radius-surface)] bg-[var(--color-background-subtle)] p-[var(--spacing-12)]">
        <p data-testid={prMobile.boardingPassPlatformOwnership} className={PRICING_BOARDING_LABEL_MOBILE_CLASS}>
          {PRICING_BOARDING_LABEL}
        </p>
        <div className="flex items-start justify-between gap-[var(--spacing-12)]">
          <div className="min-w-0 flex-1">
            <h3 data-testid={prMobile.ownYourPlatform} className={PRICING_CARD_TITLE_MOBILE_CLASS}>
              {PRICING_CARD_TITLE}
            </h3>
            <p data-testid={prMobile.textBlock4} className={PRICING_CARD_SUBTITLE_MOBILE_CLASS}>
              {PRICING_CARD_SUBTITLE_MOBILE}
            </p>
          </div>
          <div data-testid={prMobile.frame1561553874} className="flex shrink-0 flex-col items-end text-right">
            <span data-testid={prMobile.sEAT} className={PRICING_SEAT_LABEL_CLASS}>
              SEAT
            </span>
            <span data-testid={prMobile.n32A} className={PRICING_SEAT_VALUE_CLASS}>
              32A
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-[var(--spacing-8)]">
        <div className="flex flex-col gap-[var(--spacing-4)]">
          <p data-testid={prMobile.onetimePlatformFee} className={PRICING_TRACKING_LABEL_PLATFORM_MOBILE_CLASS}>
            {PRICING_PLATFORM_FEE_LABEL}
          </p>
          <p data-testid={prMobile.n3000} className={PRICING_PRICE_PRIMARY_MOBILE_CLASS}>
            {PRICING_PLATFORM_FEE_AMOUNT}
          </p>
          <p data-testid={prMobile.textBlock5} className={PRICING_PRICE_FOOTNOTE_MOBILE_CLASS}>
            {PRICING_PLATFORM_FEE_FOOTNOTE}
          </p>
        </div>

        <div className="flex flex-col gap-[var(--spacing-4)]">
          <p data-testid={prMobile.optionalSupportAddon} className={PRICING_TRACKING_LABEL_ADDON_MOBILE_CLASS}>
            {PRICING_ADDON_LABEL}
          </p>
          <p className="flex items-baseline gap-[var(--spacing-4)]">
            <span data-testid={prMobile.n250} className={PRICING_PRICE_SECONDARY_MOBILE_CLASS}>
              {PRICING_ADDON_AMOUNT}
            </span>
            <span data-testid={prMobile.month} className={PRICING_PRICE_FOOTNOTE_MOBILE_CLASS}>
              {PRICING_ADDON_PERIOD}
            </span>
          </p>
          <p data-testid={prMobile.supportUpdatesCancelAnytime} className={PRICING_PRICE_FOOTNOTE_MOBILE_CLASS}>
            {PRICING_ADDON_FOOTNOTE}
          </p>
        </div>
      </div>

      <PricingChecklistMobile />

      <HeroPrimaryCta
        testId={ctaTestId}
        labelTestId={labelTestId}
        iconTestId={iconTestId}
        graphicTestId={graphicTestId}
        href="/contact"
        label={PRICING_CTA_LABEL}
        className="w-full justify-center"
      />
    </article>
  );
}

function PricingDesktopPanel() {
  const [revealed, setRevealed] = useState(false);

  const playReveal = useCallback(() => {
    setRevealed(true);
    return () => undefined;
  }, []);

  const triggerReveal = useOneWayMotion(playReveal);

  const motionStyle = (options?: { transitionDelay?: string; idleOpacity?: number }): CSSProperties =>
    getMotionRevealStyle(revealed, PRICING_MOTION_STYLE, options);

  return (
    <div data-testid={pr.root} className={`hidden min-[1440px]:block ${PRICING_SECTION_BG_DESKTOP_CLASS}`}>
      <div className={PRICING_DESKTOP_FRAME_CLASS}>
        <div
          data-testid={pr.motion.root}
          className="relative flex flex-col items-center py-[var(--spacing-40)]"
          onMouseEnter={triggerReveal}
        >
          <Image
            data-testid={pr.kuzu420map1475411}
            src="/images/pricing-map-decoration.png"
            alt=""
            width={213}
            height={120}
            className={PRICING_MAP_DECORATION_CLASS}
            aria-hidden="true"
          />

          <div
            data-testid={pr.frame2095585158}
            className="relative z-10 flex w-full max-w-[868px] flex-col items-center gap-[var(--spacing-40)]"
          >
            <div
              data-testid={pr.sectionHeader}
              className="flex flex-col items-center gap-[var(--spacing-12)] text-center"
              style={motionStyle()}
            >
              <PricingSectionPill pillTestId={pr.sectionPill} labelTestId={pr.simplePricing} />
              <div data-testid={pr.h1block} className="flex flex-col items-center gap-[var(--spacing-8)]">
                <h2
                  data-testid={pr.ownItDontRentIt}
                  className={LANDING_SECTION_HEADING_DESKTOP_CLASS}
                  style={motionStyle()}
                >
                  {PRICING_HEADING_LINE1}{' '}
                  <span className={LANDING_SECTION_HEADING_ACCENT_CLASS}>{PRICING_HEADING_LINE2}</span>
                </h2>
                <p data-testid={pr.textBlock} className={LANDING_SECTION_SUBTITLE_CLASS} style={motionStyle()}>
                  {PRICING_SECTION_SUBTITLE}
                </p>
              </div>
            </div>

            <div
              data-testid={pr.frame2095585157}
              className="flex w-full flex-col items-center gap-[14px]"
              style={motionStyle({ idleOpacity: 0.92 })}
            >
              <PricingRouteStrip
                routeStripTestId={pr.routeStrip}
                fromTestId={pr.textBlock2}
                planeTestId={pr.textBlock3}
                toTestId={pr.textBlock4}
                toLabel={PRICING_ROUTE_TO_DESKTOP}
                planeSrc={PRICING_ROUTE_PLANE_DESKTOP_SRC}
                planeWidth={150}
                planeHeight={22}
                labelClass={PRICING_ROUTE_LABEL_DESKTOP_CLASS}
              />

              <div
                data-testid={pr.maingroup}
                className="flex w-full flex-col items-center gap-[var(--spacing-24)]"
                style={motionStyle({ transitionDelay: 'var(--motion-duration-step-delay)' })}
              >
                <PricingCardDesktop
                  ctaTestId={pr.cta}
                  labelTestId={pr.label}
                  iconTestId={pr.iconButton}
                  graphicTestId={pr.graphic}
                  emphasized={revealed}
                />
                <PricingTrustStripDesktop footnoteTestId={pr.textBlock10} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PricingMobilePanel() {
  return (
    <div
      data-testid={prMobile.root}
      className={`flex flex-col gap-[var(--spacing-20)] px-[var(--spacing-16)] pb-[var(--spacing-32)] pt-[var(--spacing-32)] min-[1440px]:hidden ${PRICING_SECTION_BG_MOBILE_CLASS}`}
    >
      <div data-testid={prMobile.frame1561553979} className="flex flex-col gap-[var(--spacing-20)]">
        <div data-testid={prMobile.frame1561553964} className="flex flex-col items-center gap-[var(--spacing-8)] text-center">
          <PricingSectionPill
            pillTestId={prMobile.sectionPill}
            labelTestId={prMobile.simplePricing}
            variant="mobile"
          />
          <div data-testid={prMobile.headRow} className="flex flex-col items-center gap-[var(--spacing-8)]">
            <h2 className={LANDING_SECTION_HEADING_MOBILE_CLASS}>
              <span data-testid={prMobile.ownIt}>{PRICING_HEADING_LINE1}</span>{' '}
              <span data-testid={prMobile.dontRentIt} className={LANDING_SECTION_HEADING_ACCENT_CLASS}>
                {PRICING_HEADING_LINE2}
              </span>
            </h2>
            <p data-testid={prMobile.textBlock} className={LANDING_SECTION_SUBTITLE_CLASS}>
              {PRICING_SECTION_SUBTITLE}
            </p>
          </div>
        </div>

        <div data-testid={prMobile.frame1561553978} className="flex flex-col gap-[var(--spacing-16)]">
          <PricingRouteStrip
            routeStripTestId={prMobile.routeStrip}
            fromTestId={prMobile.textBlock2}
            planeTestId={prMobile.loadingPlane1}
            toTestId={prMobile.textBlock3}
            toLabel={PRICING_ROUTE_TO_MOBILE}
            planeSrc={PRICING_ROUTE_PLANE_MOBILE_SRC}
            planeWidth={72}
            planeHeight={10}
            labelClass={PRICING_ROUTE_LABEL_MOBILE_CLASS}
          />

          <PricingCardMobile
            ctaTestId={prMobile.cta}
            labelTestId={prMobile.label}
            iconTestId={prMobile.iconButton}
            graphicTestId={prMobile.graphic}
          />
        </div>
      </div>

      <PricingTrustStripMobile />
    </div>
  );
}

export function PricingSection() {
  return (
    <section
      id="pricing"
      aria-label="Pricing"
      className="scroll-mt-[var(--spacing-64)]"
    >
      <PricingDesktopPanel />
      <PricingMobilePanel />
    </section>
  );
}
