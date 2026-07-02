import type { CSSProperties } from 'react';
import {
  getDurationTokenMs,
  MOTION_DURATION_AUTO_ADVANCE_VAR,
  MOTION_DURATION_DEFAULT_VAR,
} from '@/lib/motion-tokens';

/** Semantic step-delay tokens (MOTION-SPEC). */
export const MOTION_DELAY_STEP = 'var(--motion-duration-step-delay)';
export const MOTION_DELAY_AUTO_ADVANCE = 'var(--motion-duration-auto-advance)';

/** Cross-page motion token references (MOTION-SPEC + primitives/semantics). */
export const MOTION_TOKEN_REFS = {
  durationDefault: 'var(--motion-duration-default)',
  easingDefault: 'var(--motion-easing-default)',
  easingHero: 'var(--motion-easing-hero)',
  stepDelayVar: '--motion-duration-step-delay',
  autoAdvanceVar: '--motion-duration-auto-advance',
} as const;

/** Default section motion — ease-in, 700ms (MOTION-SPEC). */
export const DEFAULT_MOTION_STYLE: CSSProperties = {
  transitionDuration: MOTION_TOKEN_REFS.durationDefault,
  transitionTimingFunction: MOTION_TOKEN_REFS.easingDefault,
};

/** Hero-only motion — ease-out, 700ms (MOTION-SPEC §1). */
export const HERO_MOTION_STYLE: CSSProperties = {
  transitionDuration: MOTION_TOKEN_REFS.durationDefault,
  transitionTimingFunction: MOTION_TOKEN_REFS.easingHero,
};

/** Muted card copy during an active cascade step. */
export const MOTION_REVEAL_CASCADE_MUTED_OPACITY = 0.55;

/** Hero cluster idle opacity before first step. */
export const MOTION_REVEAL_HERO_IDLE_OPACITY = 0.88;

/** Smart Animate slide-up entry offset (spacing token). */
export const MOTION_SLIDE_ENTRY_TRANSFORM = 'translateY(var(--spacing-24))';

/** Cards waiting for their cascade step. */
export const MOTION_SLIDE_PENDING_TRANSFORM = 'translateY(var(--spacing-48))';

export const MOTION_SLIDE_REST_TRANSFORM = 'translateY(0)';

export const MOTION_SLIDE_LIFT_TRANSFORM = 'translateY(calc(var(--spacing-4) * -1))';

export const MOTION_TRANSITION_PROPERTIES =
  'opacity, transform, border-color, box-shadow, width, background, background-color, color';

export const MOTION_CARD_TRANSITION_PROPERTIES = 'opacity, transform, box-shadow';

interface MotionRevealOptions {
  transitionDelay?: string;
  transitionProperty?: string;
  /** When false, skip motion styles so static layout matches Figma before hover. */
  engaged?: boolean;
  liftWhenRevealed?: boolean;
  animateOpacity?: boolean;
  idleOpacity?: number;
  /** Snap to entry pose without transition (prime frame before staggered reveal). */
  snapPending?: boolean;
}

/** Text / block reveal — slide up from entry offset (Figma Smart Animate). */
export function getMotionSlideRevealStyle(
  revealed: boolean,
  baseStyle: CSSProperties = DEFAULT_MOTION_STYLE,
  options?: MotionRevealOptions,
): CSSProperties {
  if (options?.engaged === false) {
    return {};
  }

  const animateOpacity = options?.animateOpacity ?? true;
  const idleOpacity = options?.idleOpacity ?? MOTION_REVEAL_HERO_IDLE_OPACITY;

  return {
    ...baseStyle,
    transitionProperty: options?.transitionProperty ?? 'opacity, transform',
    transitionDelay: options?.transitionDelay ?? '0ms',
    transitionDuration:
      options?.snapPending && !revealed
        ? '0ms'
        : baseStyle.transitionDuration ?? MOTION_TOKEN_REFS.durationDefault,
    opacity: animateOpacity ? (revealed ? 1 : idleOpacity) : 1,
    transform: revealed
      ? options?.liftWhenRevealed
        ? MOTION_SLIDE_LIFT_TRANSFORM
        : MOTION_SLIDE_REST_TRANSFORM
      : MOTION_SLIDE_ENTRY_TRANSFORM,
  };
}

/** @deprecated Use getMotionSlideRevealStyle. */
export function getMotionRevealStyle(
  emphasized: boolean,
  baseStyle: CSSProperties = DEFAULT_MOTION_STYLE,
  options?: MotionRevealOptions,
): CSSProperties {
  return getMotionSlideRevealStyle(emphasized, baseStyle, {
    ...options,
    liftWhenRevealed: true,
  });
}

/** Card copy — mute siblings during active cascade step only. */
export function getMotionCascadeTextStyle(
  isActiveStep: boolean,
  cascadeRunning: boolean,
  motionEngaged: boolean,
  baseStyle: CSSProperties = DEFAULT_MOTION_STYLE,
): CSSProperties {
  if (!motionEngaged || !cascadeRunning) {
    return {};
  }

  if (!isActiveStep) {
    return {
      ...baseStyle,
      transitionProperty: 'opacity',
      transitionDuration: MOTION_TOKEN_REFS.durationDefault,
      opacity: MOTION_REVEAL_CASCADE_MUTED_OPACITY,
    };
  }

  return {};
}

export interface MotionCascadeCardOptions {
  cardIndex: number;
  /** Highest card index revealed so far (-1 = none yet). */
  revealedUpTo: number;
  activeIndex: number | null;
  cascadeRunning: boolean;
  motionEngaged: boolean;
  isHighlighted: boolean;
  shadowToken?: string;
  baseStyle?: CSSProperties;
}

/**
 * Card shell — one-by-one slide-up per MOTION-SPEC cascade.
 * Cards stay hidden below until their step; then slide into place.
 */
export function getMotionCascadeCardSurfaceStyle({
  cardIndex,
  revealedUpTo,
  activeIndex,
  cascadeRunning,
  motionEngaged,
  isHighlighted,
  shadowToken = 'var(--shadow-card)',
  baseStyle = DEFAULT_MOTION_STYLE,
}: MotionCascadeCardOptions): CSSProperties {
  const motionBase: CSSProperties = {
    ...baseStyle,
    transitionProperty: MOTION_CARD_TRANSITION_PROPERTIES,
    transitionTimingFunction: MOTION_TOKEN_REFS.easingDefault,
    transitionDuration: MOTION_TOKEN_REFS.durationDefault,
    opacity: 1,
    boxShadow: 'none',
    transform: MOTION_SLIDE_REST_TRANSFORM,
  };

  if (!motionEngaged) {
    return motionBase;
  }

  const hasRevealed = cardIndex <= revealedUpTo;

  if (!hasRevealed) {
    return {
      ...motionBase,
      transform: MOTION_SLIDE_PENDING_TRANSFORM,
      opacity: 0,
      pointerEvents: 'none',
      transitionDuration: '0ms',
    };
  }

  const isLifted =
    isHighlighted &&
    ((cascadeRunning && activeIndex === cardIndex) || (!cascadeRunning && isHighlighted));

  if (isLifted) {
    return {
      ...motionBase,
      transform: MOTION_SLIDE_LIFT_TRANSFORM,
      boxShadow: shadowToken,
      opacity: 1,
    };
  }

  return motionBase;
}

/** Paint entry keyframe on next frame so CSS transitions run (Smart Animate). */
export function beginMotionReveal(onPrime: () => void, onReveal: () => void): void {
  onPrime();
  requestAnimationFrame(() => {
    requestAnimationFrame(onReveal);
  });
}

/** Stagger delay for hero stats (motion.duration.stepDelay = 120ms). */
export function getMotionStaggerDelay(index: number): string {
  if (index === 0) {
    return '0ms';
  }

  return `calc(${index} * ${MOTION_DELAY_STEP})`;
}

/** Next/Image helper when Tailwind constrains one dimension — silences aspect-ratio warnings. */
export const RESPONSIVE_IMAGE_DIMENSION_STYLE: CSSProperties = {
  width: 'auto',
  height: 'auto',
};

/** Social proof testimonial carousel slide — 2× motion.duration.default (1400ms). */
export const SOCIAL_PROOF_CAROUSEL_SLIDE_DURATION =
  'calc(2 * var(--motion-duration-default))';

export function getSocialProofCarouselSlideMs(): number {
  return getDurationTokenMs(MOTION_DURATION_DEFAULT_VAR, 700) * 2;
}

/** Wait for slide to finish + 2× motion.duration.autoAdvance before next slide. */
export function getSocialProofCarouselAdvanceMs(): number {
  const slideMs = getSocialProofCarouselSlideMs();
  const pauseMs = getDurationTokenMs(MOTION_DURATION_AUTO_ADVANCE_VAR, 300) * 2;
  return slideMs + pauseMs;
}
