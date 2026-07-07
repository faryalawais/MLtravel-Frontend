'use client';

import Image from 'next/image';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from 'react';
import {
  LANDING_SECTION_HEADING_ACCENT_CLASS,
  LANDING_SECTION_HEADING_DESKTOP_CLASS,
  LANDING_SECTION_HEADING_MOBILE_CLASS,
  LANDING_SECTION_SUBTITLE_CLASS,
  SOCIAL_PROOF_CAROUSEL_TRANSITION_STYLE,
  SOCIAL_PROOF_CLIENT_LOGO_IMAGE_CLASS,
  SOCIAL_PROOF_CLIENT_LOGO_IMAGE_STYLE,
  SOCIAL_PROOF_CLIENT_LOGOS,
  SOCIAL_PROOF_DESKTOP_FRAME_CLASS,
  SOCIAL_PROOF_DESKTOP_SLIDE_STEP_PX,
  SOCIAL_PROOF_DESKTOP_TESTIMONIALS,
  SOCIAL_PROOF_HEADING_LINE1,
  SOCIAL_PROOF_HEADING_LINE2,
  SOCIAL_PROOF_INTEGRATIONS_TAGLINE,
  SOCIAL_PROOF_INTEGRATIONS_TAGLINE_CLASS,
  SOCIAL_PROOF_MOBILE_TESTIMONIALS,
  SOCIAL_PROOF_AUTHOR_COMPANY_CLASS,
  SOCIAL_PROOF_AUTHOR_NAME_CLASS,
  SOCIAL_PROOF_AUTHOR_ROLE_CLASS,
  SOCIAL_PROOF_PILL_LABEL,
  SOCIAL_PROOF_PILL_LABEL_DESKTOP_CLASS,
  SOCIAL_PROOF_PILL_LABEL_MOBILE_CLASS,
  SOCIAL_PROOF_PLANE_CLASS,
  SOCIAL_PROOF_QUOTE_DESKTOP_CLASS,
  SOCIAL_PROOF_QUOTE_MOBILE_CLASS,
  SOCIAL_PROOF_SECTION_PILL_DESKTOP_CLASS,
  SOCIAL_PROOF_SECTION_PILL_MOBILE_CLASS,
  SOCIAL_PROOF_SECTION_SUBTITLE,
  SOCIAL_PROOF_SLIDE_COUNT,
  SOCIAL_PROOF_SLIDE_FILL_PERCENT,
  SOCIAL_PROOF_MOTION_STYLE,
  SOCIAL_PROOF_TOKENS,
} from '@/constants/landing.constants';
import {
  getMotionSlideRevealStyle,
  getSocialProofCarouselAdvanceMs,
  getSocialProofCarouselSlideMs,
  getSocialProofClientsLogoMotionStyle,
  type SocialProofClientsMotionStep,
  RESPONSIVE_IMAGE_DIMENSION_STYLE,
} from '@/constants/motion.constants';
import { runSimpleOneStepMotion } from '@/lib/motion-sequence';
import { useOneWayMotion } from '@/lib/use-one-way-motion';
import { ids } from '@/tokens/build/test-ids';
import type {
  SocialProofSectionPillProps,
  SocialProofTestimonialConfig,
} from '@/types/landing.types';

const sp = ids.component.landing.socialProof;
const spMotion = sp.motion;
const spClients = sp.clientsMotion;
const spMobile = sp.mobile;

const SOCIAL_PROOF_DESKTOP_TRACK = [
  ...SOCIAL_PROOF_DESKTOP_TESTIMONIALS,
  SOCIAL_PROOF_DESKTOP_TESTIMONIALS[0],
];

function SocialProofSectionPill({ pillTestId, labelTestId, variant = 'desktop' }: SocialProofSectionPillProps) {
  const isMobile = variant === 'mobile';

  return (
    <div
      data-testid={pillTestId}
      className={isMobile ? SOCIAL_PROOF_SECTION_PILL_MOBILE_CLASS : SOCIAL_PROOF_SECTION_PILL_DESKTOP_CLASS}
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
        className={isMobile ? SOCIAL_PROOF_PILL_LABEL_MOBILE_CLASS : SOCIAL_PROOF_PILL_LABEL_DESKTOP_CLASS}
      >
        {SOCIAL_PROOF_PILL_LABEL}
      </span>
    </div>
  );
}

function TestimonialAvatar({
  avatarTestId,
  initialsTestId,
  initials,
}: {
  avatarTestId?: string;
  initialsTestId?: string;
  initials: string;
}) {
  return (
    <div
      {...(avatarTestId ? { 'data-testid': avatarTestId } : {})}
      className="relative size-[var(--spacing-48)] shrink-0"
    >
      <Image
        src="/icons/icon-avatar-glow.svg"
        alt=""
        width={48}
        height={48}
        aria-hidden="true"
        className="absolute inset-0"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <Image
          src="/icons/icon-avatar-circle.svg"
          alt=""
          width={40}
          height={40}
          aria-hidden="true"
        />
        <span
          {...(initialsTestId ? { 'data-testid': initialsTestId } : {})}
          className="absolute [font-size:var(--font-size-18)] [font-weight:var(--font-weight-700)] [line-height:var(--font-lineheight-24)] text-[var(--color-text-inverse)]"
        >
          {initials}
        </span>
      </div>
    </div>
  );
}

function TestimonialBlockDesktop({
  testimonial,
  includeTestIds = true,
}: {
  testimonial: SocialProofTestimonialConfig;
  includeTestIds?: boolean;
}) {
  const testId = (id: string) => (includeTestIds ? { 'data-testid': id } : {});

  return (
    <article
      {...testId(testimonial.blockTestId)}
      className="flex w-[868px] max-w-none shrink-0 flex-row items-center gap-[var(--spacing-20)]"
      aria-hidden={!includeTestIds}
    >
      <div
        {...testId(testimonial.logoCardTestId)}
        className="flex h-[280px] w-[313px] shrink-0 items-center justify-center rounded-[var(--radius-4)] bg-[var(--color-background-subtle)]"
      >
        <div {...testId(testimonial.logoSlotTestId)} className="flex items-center justify-center">
          <Image
            {...testId(testimonial.companyLogoTestId)}
            src={testimonial.logoSrc}
            alt=""
            width={240}
            height={80}
            className="h-auto w-[240px] max-w-full object-contain"
            style={RESPONSIVE_IMAGE_DIMENSION_STYLE}
          />
        </div>
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-[var(--spacing-20)]">
        <blockquote {...testId(testimonial.quoteTestId)} className={SOCIAL_PROOF_QUOTE_DESKTOP_CLASS}>
          {testimonial.quote}
        </blockquote>
        <div
          {...testId(testimonial.authorTestId)}
          className="flex flex-row items-start gap-[var(--spacing-16)]"
        >
          <TestimonialAvatar
            avatarTestId={includeTestIds ? testimonial.avatarTestId : undefined}
            initialsTestId={includeTestIds ? testimonial.initialsTestId : undefined}
            initials={testimonial.initials}
          />
          <div className="flex flex-col">
            <p {...testId(testimonial.nameTestId)} className={SOCIAL_PROOF_AUTHOR_NAME_CLASS}>
              {testimonial.name}
            </p>
            <p {...testId(testimonial.roleTestId)} className={SOCIAL_PROOF_AUTHOR_ROLE_CLASS}>
              {testimonial.role}
            </p>
            <p {...testId(testimonial.companyTestId)} className={SOCIAL_PROOF_AUTHOR_COMPANY_CLASS}>
              {testimonial.company}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

function TestimonialBlockMobile({ testimonial }: { testimonial: SocialProofTestimonialConfig }) {
  return (
    <article
      data-testid={testimonial.blockTestId}
      className="flex w-[min(100%,320px)] shrink-0 snap-center flex-col gap-[var(--spacing-16)] rounded-[var(--radius-panel)] bg-[var(--color-background-page)] p-[var(--spacing-16)]"
    >
      <div
        data-testid={testimonial.logoCardTestId}
        className="flex h-[120px] w-full items-center justify-center rounded-[var(--radius-4)] bg-[var(--color-background-subtle)]"
      >
        <Image
          data-testid={testimonial.companyLogoTestId}
          src={testimonial.logoSrc}
          alt=""
          width={200}
          height={64}
          className="h-auto max-h-[64px] w-auto max-w-[200px] object-contain"
          style={RESPONSIVE_IMAGE_DIMENSION_STYLE}
        />
      </div>
      <blockquote data-testid={testimonial.quoteTestId} className={SOCIAL_PROOF_QUOTE_MOBILE_CLASS}>
        {testimonial.quote}
      </blockquote>
      <div data-testid={testimonial.authorTestId} className="flex flex-row items-start gap-[var(--spacing-12)]">
        <TestimonialAvatar
          avatarTestId={testimonial.avatarTestId}
          initialsTestId={testimonial.initialsTestId}
          initials={testimonial.initials}
        />
        <div className="flex flex-col gap-[var(--spacing-4)]">
          <p data-testid={testimonial.nameTestId} className={SOCIAL_PROOF_AUTHOR_NAME_CLASS}>
            {testimonial.name}
          </p>
          <p data-testid={testimonial.roleTestId} className={SOCIAL_PROOF_AUTHOR_ROLE_CLASS}>
            {testimonial.role}
          </p>
          <p data-testid={testimonial.companyTestId} className={SOCIAL_PROOF_AUTHOR_COMPANY_CLASS}>
            {testimonial.company}
          </p>
        </div>
      </div>
    </article>
  );
}

function SlideProgressBar({
  testId,
  trackTestId,
  fillTestId,
  numbersTestId,
  n1TestId,
  n2TestId,
  n3TestId,
  activeSlide,
  onSelectSlide,
}: {
  testId: string;
  trackTestId: string;
  fillTestId: string;
  numbersTestId: string;
  n1TestId: string;
  n2TestId: string;
  n3TestId: string;
  activeSlide: number;
  onSelectSlide: (index: number) => void;
}) {
  const numberTestIds = [n1TestId, n2TestId, n3TestId] as const;

  return (
    <div data-testid={testId} className="flex w-full flex-row items-center gap-[var(--spacing-20)]">
      <div className="relative h-[var(--spacing-4)] min-w-0 flex-1">
        <div
          data-testid={trackTestId}
          className="absolute inset-0 rounded-full bg-[var(--color-border-default)]"
          aria-hidden="true"
        />
        <div
          data-testid={fillTestId}
          className="absolute left-0 top-0 h-full rounded-full bg-[var(--color-border-brand-navy)]"
          style={{
            ...SOCIAL_PROOF_CAROUSEL_TRANSITION_STYLE,
            transitionProperty: 'width',
            width: SOCIAL_PROOF_SLIDE_FILL_PERCENT[activeSlide],
          }}
          aria-hidden="true"
        />
      </div>
      <div
        data-testid={numbersTestId}
        className="flex shrink-0 flex-row items-center gap-[var(--spacing-20)] text-body-desktop-xs"
        role="tablist"
        aria-label="Testimonial slides"
      >
        {numberTestIds.map((numberTestId, index) => (
          <button
            key={numberTestId}
            type="button"
            data-testid={numberTestId}
            role="tab"
            aria-selected={activeSlide === index}
            aria-label={`Show testimonial slide ${index + 1}`}
            onClick={() => onSelectSlide(index)}
            className={
              activeSlide === index
                ? 'text-[var(--color-text-brand-navy)]'
                : 'text-[var(--color-text-muted)]'
            }
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

function scrollMobileTrackToSlide(
  scrollRef: RefObject<HTMLDivElement | null>,
  slideIndex: number,
): void {
  const track = scrollRef.current;
  if (!track || track.children.length === 0) return;

  const firstCard = track.children[0] as HTMLElement;
  const cardWidth = firstCard.offsetWidth;
  const gap = Number.parseInt(
    getComputedStyle(track).columnGap || getComputedStyle(track).gap || '16',
    10,
  );
  const cardIndex = slideIndex >= SOCIAL_PROOF_SLIDE_COUNT - 1 ? 0 : Math.min(slideIndex, track.children.length - 1);

  track.scrollTo({
    left: cardIndex * (cardWidth + gap),
    behavior: 'smooth',
  });
}

function IntegrationsStrip({
  testId,
  taglineTestId,
  gridTestId,
  clientsMotionStep,
  variant = 'desktop',
}: {
  testId: string;
  taglineTestId: string;
  gridTestId: string;
  clientsMotionStep: SocialProofClientsMotionStep;
  variant?: 'desktop' | 'mobile';
}) {
  const isMobile = variant === 'mobile';
  const taglineRevealed = clientsMotionStep >= 0;

  return (
    <section
      data-testid={testId}
      className={
        isMobile
          ? 'flex w-full flex-col items-center gap-[var(--spacing-28)] px-[var(--spacing-16)] py-[var(--spacing-32)]'
          : 'flex w-full flex-col items-center gap-[var(--spacing-28)] py-[var(--spacing-40)]'
      }
    >
      <p
        data-testid={taglineTestId}
        className={`text-center ${SOCIAL_PROOF_INTEGRATIONS_TAGLINE_CLASS}`}
        style={getMotionSlideRevealStyle(taglineRevealed, SOCIAL_PROOF_MOTION_STYLE)}
      >
        {SOCIAL_PROOF_INTEGRATIONS_TAGLINE}
      </p>
      <div
        data-testid={gridTestId}
        className={
          isMobile
            ? 'flex w-full flex-row flex-wrap items-center justify-center gap-x-[var(--spacing-40)] gap-y-[var(--spacing-30)]'
            : 'flex w-full max-w-[1312px] flex-row flex-wrap items-center justify-center gap-x-[var(--spacing-40)] gap-y-[var(--spacing-30)] px-[var(--spacing-64)]'
        }
      >
        {SOCIAL_PROOF_CLIENT_LOGOS.map((logo) => (
          <div
            key={logo.src}
            className="flex h-[var(--spacing-32)] items-center justify-center px-[var(--spacing-8)]"
            style={getSocialProofClientsLogoMotionStyle(clientsMotionStep)}
          >
            <Image
              data-testid={logo.testId}
              src={logo.src}
              alt=""
              width={92}
              height={32}
              className={SOCIAL_PROOF_CLIENT_LOGO_IMAGE_CLASS}
              style={SOCIAL_PROOF_CLIENT_LOGO_IMAGE_STYLE}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export function SocialProofTestimonialDesktopBlock({
  includeTestIds = true,
}: {
  includeTestIds?: boolean;
}) {
  return (
    <TestimonialBlockDesktop
      testimonial={SOCIAL_PROOF_DESKTOP_TESTIMONIALS[0]}
      includeTestIds={includeTestIds}
    />
  );
}

export function SocialProofSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [carouselTransitionEnabled, setCarouselTransitionEnabled] = useState(true);
  const [testimonialsMotionActive, setTestimonialsMotionActive] = useState(false);
  const [clientsMotionStep, setClientsMotionStep] = useState<SocialProofClientsMotionStep>(-1);

  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const carouselStartedRef = useRef(false);
  const carouselAutoPausedRef = useRef(false);
  const autoAdvanceTimerRef = useRef<number | null>(null);
  const isScrollingFromStateRef = useRef(false);

  const desktopOffset = activeSlide * SOCIAL_PROOF_DESKTOP_SLIDE_STEP_PX;

  const clearAutoAdvance = () => {
    if (autoAdvanceTimerRef.current !== null) {
      window.clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
  };

  const goToSlide = useCallback((index: number) => {
    const nextSlide = ((index % SOCIAL_PROOF_SLIDE_COUNT) + SOCIAL_PROOF_SLIDE_COUNT) % SOCIAL_PROOF_SLIDE_COUNT;
    setCarouselTransitionEnabled(true);
    setActiveSlide(nextSlide);
    isScrollingFromStateRef.current = true;
    scrollMobileTrackToSlide(mobileScrollRef, nextSlide);
    window.setTimeout(() => {
      isScrollingFromStateRef.current = false;
    }, getSocialProofCarouselSlideMs());
  }, []);

  const playTestimonialsMotion = useCallback(() => {
    setTestimonialsMotionActive(true);

    const timers: ReturnType<typeof setTimeout>[] = [];

    if (!carouselStartedRef.current && !carouselAutoPausedRef.current) {
      carouselStartedRef.current = true;
      timers.push(
        setTimeout(() => {
          goToSlide(1);
        }, 32),
      );
    }

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [goToSlide]);

  const triggerTestimonialsMotion = useOneWayMotion(playTestimonialsMotion);

  const playClientsMotion = useCallback(() => {
    return runSimpleOneStepMotion(
      () => setClientsMotionStep(0),
      () => setClientsMotionStep(1),
    );
  }, []);

  const triggerClientsMotion = useOneWayMotion(playClientsMotion);

  const selectSlideManually = useCallback(
    (index: number) => {
      carouselAutoPausedRef.current = true;
      clearAutoAdvance();
      goToSlide(index);
    },
    [goToSlide],
  );

  const handleDesktopTransitionEnd = useCallback(() => {
    if (activeSlide !== SOCIAL_PROOF_SLIDE_COUNT - 1) return;

    setCarouselTransitionEnabled(false);
    setActiveSlide(0);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setCarouselTransitionEnabled(true);
      });
    });
  }, [activeSlide]);

  useEffect(() => {
    clearAutoAdvance();

    if (
      !carouselStartedRef.current ||
      carouselAutoPausedRef.current ||
      activeSlide >= SOCIAL_PROOF_SLIDE_COUNT - 1
    ) {
      return undefined;
    }

    const stepMs = getSocialProofCarouselAdvanceMs();

    autoAdvanceTimerRef.current = window.setTimeout(() => {
      autoAdvanceTimerRef.current = null;
      goToSlide(activeSlide + 1);
    }, stepMs);

    return clearAutoAdvance;
  }, [activeSlide, goToSlide]);

  const handleMobileScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    if (isScrollingFromStateRef.current) return;

    const track = event.currentTarget;
    if (track.children.length === 0) return;

    const firstCard = track.children[0] as HTMLElement;
    const cardWidth = firstCard.offsetWidth;
    const gap = Number.parseInt(
      getComputedStyle(track).columnGap || getComputedStyle(track).gap || '16',
      10,
    );
    const index = Math.round(track.scrollLeft / (cardWidth + gap));
    const nextSlide = Math.min(index, SOCIAL_PROOF_SLIDE_COUNT - 1);
    setActiveSlide((current) => (current === nextSlide ? current : nextSlide));
  }, []);

  return (
    <section
      aria-label="Social proof"
      style={
        {
          '--social-proof-motion-duration': SOCIAL_PROOF_TOKENS.motionDurationDefault,
          '--social-proof-motion-easing': SOCIAL_PROOF_TOKENS.motionEasingDefault,
        } as CSSProperties
      }
    >
      <div data-testid={sp.root} className="hidden min-[1440px]:block">
        <div className={SOCIAL_PROOF_DESKTOP_FRAME_CLASS}>
          <div className="relative flex flex-col gap-[var(--spacing-40)] pb-[var(--spacing-40)]">
            <div
              data-testid={spMotion.root}
              className="relative flex flex-col items-center gap-[var(--spacing-40)] px-[var(--spacing-64)] pt-[var(--spacing-64)]"
              onMouseEnter={triggerTestimonialsMotion}
            >
              <Image
                data-testid={spMotion.vector}
                src="/icons/icon-social-proof-plane.svg"
                alt=""
                width={92}
                height={100}
                className={SOCIAL_PROOF_PLANE_CLASS}
                aria-hidden="true"
              />
              <div data-testid={sp.headerWrap} className="relative z-10 flex w-full flex-col items-center">
                <div
                  data-testid={sp.sectionHeader}
                  className="flex w-full max-w-[1312px] flex-col items-center gap-[var(--spacing-16)] text-center"
                  style={getMotionSlideRevealStyle(testimonialsMotionActive, SOCIAL_PROOF_MOTION_STYLE)}
                >
                  <SocialProofSectionPill
                    pillTestId={sp.sectionPill}
                    labelTestId={sp.trustedByLeaders}
                  />
                  <div
                    data-testid={sp.textBlock}
                    className="flex flex-col items-center gap-[var(--spacing-8)]"
                    style={getMotionSlideRevealStyle(testimonialsMotionActive, SOCIAL_PROOF_MOTION_STYLE)}
                  >
                    <div
                      data-testid={sp.textBlock2}
                      className={`flex flex-col items-center ${LANDING_SECTION_HEADING_DESKTOP_CLASS}`}
                      style={getMotionSlideRevealStyle(testimonialsMotionActive, SOCIAL_PROOF_MOTION_STYLE)}
                    >
                      <span>{SOCIAL_PROOF_HEADING_LINE1}</span>
                      <span className={LANDING_SECTION_HEADING_ACCENT_CLASS}>{SOCIAL_PROOF_HEADING_LINE2}</span>
                    </div>
                    <p
                      data-testid={sp.paragraph}
                      className={LANDING_SECTION_SUBTITLE_CLASS}
                      style={getMotionSlideRevealStyle(testimonialsMotionActive, SOCIAL_PROOF_MOTION_STYLE, {
                        transitionDelay: 'var(--motion-duration-step-delay)',
                      })}
                    >
                      {SOCIAL_PROOF_SECTION_SUBTITLE}
                    </p>
                  </div>
                </div>
              </div>

              <div
              data-testid={sp.frame2095585155}
              className="relative z-10 flex w-full max-w-[1440px] flex-col"
              style={getMotionSlideRevealStyle(testimonialsMotionActive, SOCIAL_PROOF_MOTION_STYLE, {
                idleOpacity: 0.92,
              })}
            >
                <div
                  data-testid={sp.testimonialsRow}
                  className="w-full overflow-hidden py-[var(--spacing-28)] pl-[var(--spacing-64)]"
                >
                  <div
                    className="flex w-max flex-row items-center gap-[var(--spacing-120)]"
                    style={{
                      ...(carouselTransitionEnabled ? SOCIAL_PROOF_CAROUSEL_TRANSITION_STYLE : {}),
                      transform: `translateX(-${desktopOffset}px)`,
                    }}
                    onTransitionEnd={handleDesktopTransitionEnd}
                  >
                    {SOCIAL_PROOF_DESKTOP_TRACK.map((testimonial, index) => (
                      <TestimonialBlockDesktop
                        key={`${testimonial.blockTestId}-${index}`}
                        testimonial={testimonial}
                        includeTestIds={index < SOCIAL_PROOF_DESKTOP_TESTIMONIALS.length}
                      />
                    ))}
                  </div>
                </div>
                <div data-testid={sp.progressWrap} className="flex w-full justify-center pl-[var(--spacing-64)]">
                  <div className="w-full max-w-[1376px]">
                    <SlideProgressBar
                      testId={sp.slideProgressBar}
                      trackTestId={sp.track}
                      fillTestId={sp.fill}
                      numbersTestId={sp.slideNumbers}
                      n1TestId={sp.n1}
                      n2TestId={sp.n2}
                      n3TestId={sp.n3}
                      activeSlide={activeSlide}
                      onSelectSlide={selectSlideManually}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div
              data-testid={spClients.root}
              onMouseEnter={triggerClientsMotion}
            >
              <IntegrationsStrip
                testId={sp.integrationsStrip}
                taglineTestId={sp.textBlock4}
                gridTestId={sp.container3}
                clientsMotionStep={clientsMotionStep}
              />
            </div>
          </div>
        </div>
      </div>

      <div
        data-testid={spMobile.root}
        className="flex flex-col gap-[var(--spacing-28)] pt-[var(--spacing-32)] min-[1440px]:hidden"
      >
        <div data-testid={spMobile.sectionRoot} className="flex flex-col items-center gap-[var(--spacing-28)]">
          <div data-testid={spMobile.container} className="flex flex-col items-center gap-[var(--spacing-16)] px-[var(--spacing-16)] text-center">
            <SocialProofSectionPill
              pillTestId={spMobile.sectionPill}
              labelTestId={spMobile.trustedByLeaders}
              variant="mobile"
            />
            <div data-testid={spMobile.heading} className="flex flex-col items-center gap-[var(--spacing-8)]">
              <h2 className={LANDING_SECTION_HEADING_MOBILE_CLASS}>
                <span data-testid={spMobile.builtForFounders}>{SOCIAL_PROOF_HEADING_LINE1}</span>{' '}
                <span
                  data-testid={spMobile.provenInProduction}
                  className={LANDING_SECTION_HEADING_ACCENT_CLASS}
                >
                  {SOCIAL_PROOF_HEADING_LINE2}
                </span>
              </h2>
              <p data-testid={spMobile.paragraph} className={LANDING_SECTION_SUBTITLE_CLASS}>
                {SOCIAL_PROOF_SECTION_SUBTITLE}
              </p>
            </div>
          </div>

          <div
            ref={mobileScrollRef}
            data-testid={spMobile.textBlock}
            className="flex w-full snap-x snap-mandatory flex-row gap-[var(--spacing-16)] overflow-x-auto px-[var(--spacing-16)] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            onScroll={handleMobileScroll}
          >
            {SOCIAL_PROOF_MOBILE_TESTIMONIALS.map((testimonial) => (
              <TestimonialBlockMobile key={testimonial.blockTestId} testimonial={testimonial} />
            ))}
          </div>

          <Image
            data-testid={spMobile.planeDecor}
            src="/icons/icon-social-proof-plane.svg"
            alt=""
            width={72}
            height={78}
            className="pointer-events-none mx-auto opacity-80"
            aria-hidden="true"
          />

          <div data-testid={spMobile.frame2095585144} className="w-full px-[var(--spacing-16)]">
            <SlideProgressBar
              testId={spMobile.frame2095585140}
              trackTestId={spMobile.frame2095585141}
              fillTestId={spMobile.frame2095585142}
              numbersTestId={spMobile.textBlock3}
              n1TestId={spMobile.n1}
              n2TestId={spMobile.n2}
              n3TestId={spMobile.n3}
              activeSlide={activeSlide}
              onSelectSlide={selectSlideManually}
            />
          </div>
        </div>

        <div data-testid={spMobile.container10}>
          <IntegrationsStrip
            testId={spMobile.container11}
            taglineTestId={spMobile.paragraph4}
            gridTestId={spMobile.container12}
            clientsMotionStep={-1}
            variant="mobile"
          />
        </div>
      </div>
    </section>
  );
}
