'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useState } from 'react';
import {
  FOOTER_BOTTOM_ROW_CLASS,
  FOOTER_BOTTOM_ROW_MOBILE_CLASS,
  FOOTER_BRAND_COL_CLASS,
  FOOTER_BRAND_COL_MOBILE_CLASS,
  FOOTER_BRAND_HEADER_CLASS,
  FOOTER_BRAND_LABEL,
  FOOTER_BRAND_LABEL_DESKTOP_CLASS,
  FOOTER_BRAND_LABEL_MOBILE_CLASS,
  FOOTER_BRAND_MARK_CLASS,
  FOOTER_BRAND_MARK_SRC,
  FOOTER_CONTAINER_CLASS,
  FOOTER_COPYRIGHT,
  FOOTER_COPYRIGHT_DESKTOP_CLASS,
  FOOTER_COPYRIGHT_MOBILE_CLASS,
  FOOTER_DESKTOP_COLUMNS,
  FOOTER_DESKTOP_SHELL_CLASS,
  FOOTER_LEGAL_ITEMS,
  FOOTER_LEGAL_LINK_DESKTOP_CLASS,
  FOOTER_LEGAL_LINK_MOBILE_CLASS,
  FOOTER_LEGAL_LINKS_CLASS,
  FOOTER_LEGAL_LINKS_MOBILE_CLASS,
  FOOTER_MAIN_ROW_CLASS,
  FOOTER_MOBILE_COLUMNS,
  FOOTER_MOBILE_INNER_CLASS,
  FOOTER_MOBILE_NAV_ROW_CLASS,
  FOOTER_MOBILE_SHELL_CLASS,
  FOOTER_NAV_COL_CLASS,
  FOOTER_NAV_COLS_CLASS,
  FOOTER_NAV_HEADING_DESKTOP_CLASS,
  FOOTER_NAV_HEADING_MOBILE_CLASS,
  FOOTER_NAV_LINK_CLASS,
  FOOTER_NAV_LINK_LIST_CLASS,
  FOOTER_NAV_LINK_MOBILE_CLASS,
  FOOTER_TAGLINE,
  FOOTER_TAGLINE_CLASS,
} from '@/constants/shared.constants';
import {
  FOOTER_NAV_LINK_EMPHASIS_CLASS,
  getFooterNavLinkMotionStyle,
} from '@/constants/motion.constants';
import { runFooterLinkEmphasisMotion } from '@/lib/motion-sequence';
import { useOneWayMotion } from '@/lib/use-one-way-motion';
import { ids } from '@/tokens/build/test-ids';
import type { FooterNavColumnConfig, FooterNavLinkProps } from '@/types/shared.types';

const ft = ids.component.footer;
const ftMobile = ft.mobile;

function FooterNavLink({
  link,
  emphasized = false,
  motionEngaged = false,
  variant = 'desktop',
}: FooterNavLinkProps) {
  const isMobile = variant === 'mobile';

  return (
    <Link
      href={link.href}
      data-testid={link.linkTestId}
      className={[
        isMobile ? FOOTER_NAV_LINK_MOBILE_CLASS : FOOTER_NAV_LINK_CLASS,
        emphasized && motionEngaged ? FOOTER_NAV_LINK_EMPHASIS_CLASS : '',
      ].join(' ')}
      style={getFooterNavLinkMotionStyle()}
    >
      <span data-testid={link.labelTestId}>{link.label}</span>
    </Link>
  );
}

function FooterNavColumn({
  column,
  colTestId,
  emphasizedLinkIndex,
  motionEngaged,
  variant = 'desktop',
}: {
  column: FooterNavColumnConfig;
  colTestId: string;
  emphasizedLinkIndex: number | null;
  motionEngaged: boolean;
  variant?: 'desktop' | 'mobile';
}) {
  const isMobile = variant === 'mobile';
  const headingClass = isMobile ? FOOTER_NAV_HEADING_MOBILE_CLASS : FOOTER_NAV_HEADING_DESKTOP_CLASS;

  return (
    <div data-testid={colTestId} className={FOOTER_NAV_COL_CLASS}>
      <p data-testid={column.headingTestId} className={headingClass}>
        {column.heading}
      </p>
      <ul className={FOOTER_NAV_LINK_LIST_CLASS}>
        {column.links.map((link, index) => (
          <li key={link.label}>
            <FooterNavLink
              link={link}
              emphasized={emphasizedLinkIndex === index}
              motionEngaged={motionEngaged}
              variant={variant}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

function FooterBrandBlock({
  brandColTestId,
  variant = 'desktop',
}: {
  brandColTestId: string;
  variant?: 'desktop' | 'mobile';
}) {
  const isMobile = variant === 'mobile';
  const brandColClass = isMobile ? FOOTER_BRAND_COL_MOBILE_CLASS : FOOTER_BRAND_COL_CLASS;
  const brandLabelClass = isMobile ? FOOTER_BRAND_LABEL_MOBILE_CLASS : FOOTER_BRAND_LABEL_DESKTOP_CLASS;

  return (
    <div data-testid={brandColTestId} className={brandColClass}>
      <div data-testid={ft.brandHeader} className={FOOTER_BRAND_HEADER_CLASS}>
        <Image
          data-testid={ft.logoIcon}
          src={FOOTER_BRAND_MARK_SRC}
          alt=""
          width={32}
          height={32}
          className={FOOTER_BRAND_MARK_CLASS}
          aria-hidden="true"
        />
        <span data-testid={ft.brandLabel} className={brandLabelClass}>
          {FOOTER_BRAND_LABEL}
        </span>
      </div>
      <p data-testid={ft.tagline} className={FOOTER_TAGLINE_CLASS}>
        {FOOTER_TAGLINE}
      </p>
    </div>
  );
}

function FooterBottomBar({
  bottomRowTestId,
  variant,
}: {
  bottomRowTestId: string;
  variant: 'desktop' | 'mobile';
}) {
  const isMobile = variant === 'mobile';

  return (
    <div
      data-testid={bottomRowTestId}
      className={isMobile ? FOOTER_BOTTOM_ROW_MOBILE_CLASS : FOOTER_BOTTOM_ROW_CLASS}
    >
      <p
        data-testid={ft.copyright}
        className={isMobile ? FOOTER_COPYRIGHT_MOBILE_CLASS : FOOTER_COPYRIGHT_DESKTOP_CLASS}
      >
        {FOOTER_COPYRIGHT}
      </p>
      <div
        data-testid={ft.legalLinks}
        className={isMobile ? FOOTER_LEGAL_LINKS_MOBILE_CLASS : FOOTER_LEGAL_LINKS_CLASS}
      >
        {FOOTER_LEGAL_ITEMS.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            data-testid={item.linkTestId}
            className={isMobile ? FOOTER_LEGAL_LINK_MOBILE_CLASS : FOOTER_LEGAL_LINK_DESKTOP_CLASS}
          >
            <span data-testid={item.labelTestId}>{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function FooterDesktop() {
  return (
    <footer data-testid={ft.root} className={FOOTER_DESKTOP_SHELL_CLASS}>
      <div className={FOOTER_CONTAINER_CLASS}>
        <div className={FOOTER_MAIN_ROW_CLASS}>
          <FooterBrandBlock brandColTestId={ft.brandCol} variant="desktop" />
          <nav data-testid={ft.navCols} className={FOOTER_NAV_COLS_CLASS} aria-label="Footer">
            {FOOTER_DESKTOP_COLUMNS.map((column) => (
              <FooterNavColumn
                key={column.heading}
                column={column}
                colTestId={column.colTestId}
                emphasizedLinkIndex={null}
                motionEngaged={false}
                variant="desktop"
              />
            ))}
          </nav>
        </div>
        <FooterBottomBar bottomRowTestId={ft.bottomRow} variant="desktop" />
      </div>
    </footer>
  );
}

function FooterMobile() {
  const [motionEngaged, setMotionEngaged] = useState(false);
  const [emphasizedLinkIndex, setEmphasizedLinkIndex] = useState<number | null>(null);

  const playMotion = useCallback(() => {
    return runFooterLinkEmphasisMotion(
      () => {
        setMotionEngaged(true);
        setEmphasizedLinkIndex(0);
      },
      () => setEmphasizedLinkIndex(null),
    );
  }, []);

  const triggerMotion = useOneWayMotion(playMotion);

  return (
    <footer data-testid={ftMobile.root} className={FOOTER_MOBILE_SHELL_CLASS}>
      <div
        data-testid={ft.motion.root}
        className={FOOTER_MOBILE_INNER_CLASS}
        onMouseEnter={triggerMotion}
      >
        <FooterBrandBlock brandColTestId={ftMobile.brandCol} variant="mobile" />
        <div data-testid={ftMobile.navCols} className={FOOTER_MOBILE_NAV_ROW_CLASS}>
          {FOOTER_MOBILE_COLUMNS.map((column) => (
            <FooterNavColumn
              key={column.heading}
              column={column}
              colTestId={column.colTestId}
              emphasizedLinkIndex={emphasizedLinkIndex}
              motionEngaged={motionEngaged}
              variant="mobile"
            />
          ))}
        </div>
        <FooterBottomBar bottomRowTestId={ftMobile.bottomRow} variant="mobile" />
      </div>
    </footer>
  );
}

export function SiteFooter() {
  return (
    <>
      <FooterDesktop />
      <FooterMobile />
    </>
  );
}
