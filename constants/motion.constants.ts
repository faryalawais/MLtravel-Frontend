import type { CSSProperties } from 'react';
import {
  getDurationTokenMs,
  MOTION_DURATION_AUTO_ADVANCE_VAR,
  MOTION_DURATION_DEFAULT_VAR,
} from '@/lib/motion-tokens';

/**
 * Playwright sets `NEXT_PUBLIC_E2E_MODE=1` — keep Figma staticTwin idle so visual
 * baselines and fixture timing still measure hover from the finished layout.
 * Real browsers hide motion layers until the section enters view, then play.
 */
export function isStaticTwinIdleMode(): boolean {
  return process.env.NEXT_PUBLIC_E2E_MODE === '1';
}

/** Production: motion layers stay invisible until reveal/settle. */
export function getMotionVisibilityOpacity(
  visible: boolean,
): Pick<CSSProperties, 'opacity' | 'pointerEvents'> {
  if (visible) {
    return { opacity: 1 };
  }

  return { opacity: 0, pointerEvents: 'none' };
}

/** Simple-one-step / gate: visible after settle; E2E shows static twin before hover. */
export function isMotionLayerVisible(
  motionEngaged: boolean,
  motionSettled: boolean,
): boolean {
  if (isStaticTwinIdleMode() && !motionEngaged) {
    return true;
  }

  return motionSettled;
}

/** Semantic step-delay tokens (motion-chains / primitives). */
export const MOTION_DELAY_STEP = 'var(--motion-duration-step-delay)';
export const MOTION_DELAY_AUTO_ADVANCE = 'var(--motion-duration-auto-advance)';

/** Cross-page motion token references (primitives/semantics). */
export const MOTION_TOKEN_REFS = {
  durationDefault: 'var(--motion-duration-default)',
  easingDefault: 'var(--motion-easing-default)',
  easingHero: 'var(--motion-easing-hero)',
  stepDelayVar: '--motion-duration-step-delay',
  autoAdvanceVar: '--motion-duration-auto-advance',
} as const;

/** Default section motion — ease-in, 700ms (motion-chains default). */
export const DEFAULT_MOTION_STYLE: CSSProperties = {
  transitionDuration: MOTION_TOKEN_REFS.durationDefault,
  transitionTimingFunction: MOTION_TOKEN_REFS.easingDefault,
};

/** Hero-only motion — ease-out, 700ms (hero-animation chain). */
export const HERO_MOTION_STYLE: CSSProperties = {
  transitionDuration: MOTION_TOKEN_REFS.durationDefault,
  transitionTimingFunction: MOTION_TOKEN_REFS.easingHero,
};

/** Muted card copy during an active cascade step. */
export const MOTION_REVEAL_CASCADE_MUTED_OPACITY = 0.55;

/** Hero cluster idle opacity before first step. */
export const MOTION_REVEAL_HERO_IDLE_OPACITY = 0.88;

/** Problem CTA — motion-state-poses / motion-diffs (ProblemCTA translateY). */
export const PROBLEM_MOTION_CTA_POSE_ENTRY_PX = 692;
export const PROBLEM_MOTION_CTA_POSE_TERMINAL_PX = 592;
/** Offset from static-twin position while cascade runs (entry − terminal). */
export const PROBLEM_MOTION_CTA_OFFSET_PX =
  PROBLEM_MOTION_CTA_POSE_ENTRY_PX - PROBLEM_MOTION_CTA_POSE_TERMINAL_PX;

export type ProblemMotionStep = 0 | 1 | 2 | 3;

/** Comparison ticket frame — motion-state-poses / motion-diffs (Frame 2095585108 translateY). */
export const COMPARISON_MOTION_MAIN_GROUP_POSE_ENTRY_PX = 1028;
export const COMPARISON_MOTION_MAIN_GROUP_POSE_STATIC_PX = 212;
export const COMPARISON_MOTION_MAIN_GROUP_POSE_TERMINAL_PX = 232;
/** Entry offset from static-twin pose while the slide runs (entry − static). */
export const COMPARISON_MOTION_MAIN_GROUP_OFFSET_PX =
  COMPARISON_MOTION_MAIN_GROUP_POSE_ENTRY_PX - COMPARISON_MOTION_MAIN_GROUP_POSE_STATIC_PX;

export type ComparisonMotionStep = -1 | 0 | 1;

/** Pricing main-group — motion-state-poses / motion-diffs (main-group translateY). */
export const PRICING_MOTION_MAIN_GROUP_POSE_ENTRY_PX = 868;
export const PRICING_MOTION_MAIN_GROUP_POSE_STATIC_PX = 58;
export const PRICING_MOTION_MAIN_GROUP_POSE_TERMINAL_PX = 270;
/** Entry offset from static-twin pose while the slide runs (entry − static). */
export const PRICING_MOTION_MAIN_GROUP_OFFSET_PX =
  PRICING_MOTION_MAIN_GROUP_POSE_ENTRY_PX - PRICING_MOTION_MAIN_GROUP_POSE_STATIC_PX;

export type PricingMotionStep = ComparisonMotionStep;

/** HIW-FinalCTA-animation — banner translateY (`5409:11616` top 280px → `5409:11646` top 0). */
export const HIW_FINAL_CTA_MOTION_BANNER_OFFSET_PX = 280;

export type HiwFinalCtaMotionStep = -1 | 0 | 1;

export function getHiwFinalCtaBannerTransform(
  motionEngaged: boolean,
  motionSettled: boolean,
): string {
  if (motionSettled) {
    return MOTION_SLIDE_REST_TRANSFORM;
  }

  if (isStaticTwinIdleMode() && !motionEngaged) {
    return MOTION_SLIDE_REST_TRANSFORM;
  }

  return `translateY(${HIW_FINAL_CTA_MOTION_BANNER_OFFSET_PX}px)`;
}

/** Final CTA banner slide for HIW-FinalCTA-animation simple-one-step chain. */
export function getHiwFinalCtaBannerMotionStyle(
  motionEngaged: boolean,
  motionSettled: boolean,
  baseStyle: CSSProperties = DEFAULT_MOTION_STYLE,
): CSSProperties {
  const snapEntry = motionEngaged && !motionSettled;
  const visible = isMotionLayerVisible(motionEngaged, motionSettled);

  return {
    ...baseStyle,
    transitionProperty: 'transform, opacity',
    transitionDuration: snapEntry || (!motionEngaged && !isStaticTwinIdleMode())
      ? '0ms'
      : baseStyle.transitionDuration ?? MOTION_TOKEN_REFS.durationDefault,
    transform: getHiwFinalCtaBannerTransform(motionEngaged, motionSettled),
    ...getMotionVisibilityOpacity(visible),
  };
}

export function getPricingMainGroupTransform(
  motionEngaged: boolean,
  motionSettled: boolean,
): string {
  if (motionSettled) {
    return MOTION_SLIDE_REST_TRANSFORM;
  }

  if (isStaticTwinIdleMode() && !motionEngaged) {
    return MOTION_SLIDE_REST_TRANSFORM;
  }

  return `translateY(${PRICING_MOTION_MAIN_GROUP_OFFSET_PX}px)`;
}

/** Main card + trust strip slide for pricing simple-one-step (motion-chains Pricing-animation). */
export function getPricingMainGroupMotionStyle(
  motionEngaged: boolean,
  motionSettled: boolean,
  baseStyle: CSSProperties = DEFAULT_MOTION_STYLE,
): CSSProperties {
  const snapEntry = motionEngaged && !motionSettled;
  const visible = isMotionLayerVisible(motionEngaged, motionSettled);

  return {
    ...baseStyle,
    transitionProperty: 'transform, opacity',
    transitionDuration: snapEntry || (!motionEngaged && !isStaticTwinIdleMode())
      ? '0ms'
      : baseStyle.transitionDuration ?? MOTION_TOKEN_REFS.durationDefault,
    transform: getPricingMainGroupTransform(motionEngaged, motionSettled),
    ...getMotionVisibilityOpacity(visible),
  };
}

export function getComparisonMainGroupTransform(
  motionEngaged: boolean,
  motionSettled: boolean,
): string {
  if (motionSettled) {
    return MOTION_SLIDE_REST_TRANSFORM;
  }

  if (isStaticTwinIdleMode() && !motionEngaged) {
    return MOTION_SLIDE_REST_TRANSFORM;
  }

  return `translateY(${COMPARISON_MOTION_MAIN_GROUP_OFFSET_PX}px)`;
}

/** Main ticket group slide for comparison simple-one-step (motion-chains comparison-animation). */
export function getComparisonMainGroupMotionStyle(
  motionEngaged: boolean,
  motionSettled: boolean,
  baseStyle: CSSProperties = DEFAULT_MOTION_STYLE,
): CSSProperties {
  const snapEntry = motionEngaged && !motionSettled;
  const visible = isMotionLayerVisible(motionEngaged, motionSettled);

  return {
    ...baseStyle,
    transitionProperty: 'transform, opacity',
    transitionDuration: snapEntry || (!motionEngaged && !isStaticTwinIdleMode())
      ? '0ms'
      : baseStyle.transitionDuration ?? MOTION_TOKEN_REFS.durationDefault,
    transform: getComparisonMainGroupTransform(motionEngaged, motionSettled),
    ...getMotionVisibilityOpacity(visible),
  };
}

export function getProblemCtaTransform(motionEngaged: boolean, settled: boolean): string {
  if (settled) {
    return MOTION_SLIDE_REST_TRANSFORM;
  }

  if (isStaticTwinIdleMode() && !motionEngaged) {
    return MOTION_SLIDE_REST_TRANSFORM;
  }

  return `translateY(${PROBLEM_MOTION_CTA_OFFSET_PX}px)`;
}

/** CTA column style for problem rapid-four-step (motion-chains problem-animation). */
export function getProblemCtaMotionStyle(
  motionEngaged: boolean,
  settled: boolean,
  baseStyle: CSSProperties = DEFAULT_MOTION_STYLE,
): CSSProperties {
  const visible = isMotionLayerVisible(motionEngaged, settled);

  return {
    ...baseStyle,
    transitionProperty: 'transform, opacity',
    transitionDuration:
      !motionEngaged && !isStaticTwinIdleMode()
        ? '0ms'
        : baseStyle.transitionDuration ?? MOTION_TOKEN_REFS.durationDefault,
    transform: getProblemCtaTransform(motionEngaged, settled),
    ...getMotionVisibilityOpacity(visible),
  };
}

/** HIW footer-note — motion-state-poses / motion-diffs (footer-note translateY). */
export const HIW_MOTION_FOOTER_POSE_ENTRY_PX = 725;
export const HIW_MOTION_FOOTER_POSE_TERMINAL_PX = 644;
export const HIW_MOTION_FOOTER_POSE_STATIC_PX = 410;
/** Offset from static-twin position while cascade runs (entry − terminal). */
export const HIW_MOTION_FOOTER_OFFSET_PX =
  HIW_MOTION_FOOTER_POSE_ENTRY_PX - HIW_MOTION_FOOTER_POSE_TERMINAL_PX;

export function getHiwFooterTransform(motionEngaged: boolean, settled: boolean): string {
  if (settled) {
    return MOTION_SLIDE_REST_TRANSFORM;
  }

  if (isStaticTwinIdleMode() && !motionEngaged) {
    return MOTION_SLIDE_REST_TRANSFORM;
  }

  return `translateY(${HIW_MOTION_FOOTER_OFFSET_PX}px)`;
}

/** Footer link style for HIW rapid-four-step (motion-chains HowItWorks-animation). */
export function getHiwFooterMotionStyle(
  motionEngaged: boolean,
  settled: boolean,
  baseStyle: CSSProperties = DEFAULT_MOTION_STYLE,
): CSSProperties {
  const visible = isMotionLayerVisible(motionEngaged, settled);

  return {
    ...baseStyle,
    transitionProperty: 'transform, opacity',
    transitionDuration:
      !motionEngaged && !isStaticTwinIdleMode()
        ? '0ms'
        : baseStyle.transitionDuration ?? MOTION_TOKEN_REFS.durationDefault,
    transform: getHiwFooterTransform(motionEngaged, settled),
    ...getMotionVisibilityOpacity(visible),
  };
}

/**
 * FeatureGrid-animation absolute Y poses (motion-state-poses.json).
 * Offsets for CSS = poseY − state4 (terminal / static twin).
 */
export const FEATURE_GRID_LAYER_POSE_Y = {
  featureRow1: { idle: 734, state2: 284, state3: 284, state4: 284 },
  featureRow2: { idle: 914, state2: 734, state3: 457, state4: 464 },
  footerBar: { idle: 1096, state2: 916, state3: 916, state4: 646 },
} as const;

export type FeatureGridMotionLayer = keyof typeof FEATURE_GRID_LAYER_POSE_Y;

/** @deprecated Absolute idle Y of FeatureRow1 — prefer FEATURE_GRID_LAYER_POSE_Y. */
export const FEATURE_GRID_CONTENT_POSE_ENTRY_PX = FEATURE_GRID_LAYER_POSE_Y.featureRow1.idle;
/** Mid-chain Row2 offset from terminal (state-2): 734 − 464. */
export const FEATURE_GRID_CONTENT_POSE_STATE2_PX =
  FEATURE_GRID_LAYER_POSE_Y.featureRow2.state2 - FEATURE_GRID_LAYER_POSE_Y.featureRow2.state4;
/** @deprecated Row1 is already at terminal in state-2/3 — always 0 offset. */
export const FEATURE_GRID_CONTENT_POSE_STATE3_PX = 0;

export type FeatureGridMotionStep = -1 | 0 | 1 | 2 | 3;

/** Card shell — highlight/lift only; rows/footer own translateY (FeatureGrid-animation). */
export function getFeatureGridCardSurfaceStyle(
  motionEngaged: boolean,
  isHighlighted: boolean,
  cascadeRunning: boolean,
  shadowToken: string = 'var(--shadow-card)',
  baseStyle: CSSProperties = DEFAULT_MOTION_STYLE,
): CSSProperties {
  const motionBase: CSSProperties = {
    ...baseStyle,
    transitionProperty: MOTION_CARD_TRANSITION_PROPERTIES,
    transitionTimingFunction: MOTION_TOKEN_REFS.easingDefault,
    transitionDuration: MOTION_TOKEN_REFS.durationDefault,
    opacity: 1,
    boxShadow: 'none',
    transform: MOTION_SLIDE_REST_TRANSFORM,
  };

  if (!motionEngaged || !cascadeRunning || !isHighlighted) {
    return motionBase;
  }

  return {
    ...motionBase,
    transform: MOTION_SLIDE_LIFT_TRANSFORM,
    boxShadow: shadowToken,
  };
}

/** translateY from terminal pose for one FeatureGrid layer (row-wise staged-sequence). */
export function getFeatureGridLayerOffsetPx(
  layer: FeatureGridMotionLayer,
  motionEngaged: boolean,
  motionStep: FeatureGridMotionStep,
): number {
  const poses = FEATURE_GRID_LAYER_POSE_Y[layer];

  // Pre-trigger idle matches animationState1 unless E2E staticTwin mode.
  if (!motionEngaged || motionStep < 0) {
    if (isStaticTwinIdleMode()) {
      return 0;
    }
    return poses.idle - poses.state4;
  }

  const absoluteY =
    motionStep === 0
      ? poses.idle
      : motionStep === 1
        ? poses.state2
        : motionStep === 2
          ? poses.state3
          : poses.state4;

  return absoluteY - poses.state4;
}

/** @deprecated Use getFeatureGridLayerOffsetPx — whole-block offset was incorrect vs Figma. */
export function getFeatureGridContentOffsetPx(
  motionEngaged: boolean,
  motionStep: FeatureGridMotionStep,
): number {
  return getFeatureGridLayerOffsetPx('featureRow1', motionEngaged, motionStep);
}

/**
 * Per-layer staged slide (FeatureGrid-animation motion-diffs).
 * Step 0 idle snap → step 1 Row1 settles + Row2/footer partial → step 2 Row2 settles →
 * step 3 footer settles.
 */
export function getFeatureGridContentMotionStyle(
  motionEngaged: boolean,
  motionStep: FeatureGridMotionStep,
  layer: FeatureGridMotionLayer,
  baseStyle: CSSProperties = DEFAULT_MOTION_STYLE,
): CSSProperties {
  const snapEntry = motionEngaged && motionStep === 0;
  const offsetPx = getFeatureGridLayerOffsetPx(layer, motionEngaged, motionStep);
  const visible =
    (isStaticTwinIdleMode() && !motionEngaged) || (motionEngaged && motionStep >= 1);

  return {
    ...baseStyle,
    transitionProperty: 'transform, opacity',
    transitionDuration: snapEntry || (!motionEngaged && !isStaticTwinIdleMode())
      ? '0ms'
      : baseStyle.transitionDuration ?? MOTION_TOKEN_REFS.durationDefault,
    transform: `translateY(${offsetPx}px)`,
    ...getMotionVisibilityOpacity(visible),
  };
}

/** Hero motion — Figma Frame 1561553827 / 1561553830 translateY poses (motion-diffs). */
export const HERO_MOTION_COLUMN_OFFSET_PX = 370;
/** Figma nominal terminal CTA translateY (state 3); runtime uses measured text height + gap. */
export const HERO_MOTION_CTA_PARTIAL_OFFSET_PX = 284;
/** Figma Frame 1561553827 height at 645px width (fallback when not yet measured). */
export const HERO_MOTION_TEXT_COLUMN_HEIGHT_PX = 260;
/** Figma HeroTextBlock itemSpacing between copy and CTA cluster (spacing-24). */
export const HERO_MOTION_TEXT_CTA_GAP_PX = 24;
/** Figma Frame 1561553830 height (CTA row + proof line). */
export const HERO_MOTION_CTA_CLUSTER_HEIGHT_PX = 82;
/** Figma copy cluster clip height (Frame 2095585146). */
export const HERO_MOTION_COPY_CLUSTER_MIN_HEIGHT_PX = 366;

export type HeroMotionStep = 0 | 1 | 2;

/** HIW hero motion — motion-state-poses / motion-diffs (head-group + cta-group translateY). */
export const HIW_HERO_MOTION_HEAD_ENTRY_PX = 384;
export const HIW_HERO_MOTION_HEAD_TERMINAL_PX = 52;
export const HIW_HERO_MOTION_CTA_ENTRY_PX = 584;
export const HIW_HERO_MOTION_CTA_TERMINAL_PX = 252;
export const HIW_HERO_MOTION_LAYER_OFFSET_PX =
  HIW_HERO_MOTION_HEAD_ENTRY_PX - HIW_HERO_MOTION_HEAD_TERMINAL_PX;

export type HiwHeroMotionStep = 0 | 1 | 2;

export function getHiwHeroHeadGroupTransform(
  motionEngaged: boolean,
  step: HiwHeroMotionStep,
): string {
  if (isStaticTwinIdleMode() && !motionEngaged) {
    return MOTION_SLIDE_REST_TRANSFORM;
  }

  // Idle (!engaged) and step 0 share animationState1 entry pose.
  if (motionEngaged && step >= 1) {
    return MOTION_SLIDE_REST_TRANSFORM;
  }

  return `translateY(${HIW_HERO_MOTION_LAYER_OFFSET_PX}px)`;
}

export function getHiwHeroCtaGroupTransform(
  motionEngaged: boolean,
  step: HiwHeroMotionStep,
): string {
  if (isStaticTwinIdleMode() && !motionEngaged) {
    return MOTION_SLIDE_REST_TRANSFORM;
  }

  // Idle (!engaged) and steps 0–1 share entry pose until CTA settles at step 2.
  if (motionEngaged && step >= 2) {
    return MOTION_SLIDE_REST_TRANSFORM;
  }

  return `translateY(${HIW_HERO_MOTION_LAYER_OFFSET_PX}px)`;
}

/** Layer wrapper style for HIW hero staged-sequence (motion-chains HIW-hero-animation). */
export function getHiwHeroLayerMotionStyle(
  motionEngaged: boolean,
  step: HiwHeroMotionStep,
  layer: 'head' | 'cta',
  baseStyle: CSSProperties = HERO_MOTION_STYLE,
): CSSProperties {
  const snapEntry = motionEngaged && step === 0;
  const transform =
    layer === 'head'
      ? getHiwHeroHeadGroupTransform(motionEngaged, step)
      : getHiwHeroCtaGroupTransform(motionEngaged, step);
  const visible =
    (isStaticTwinIdleMode() && !motionEngaged) ||
    (motionEngaged && (layer === 'head' ? step >= 1 : step >= 1));

  return {
    ...baseStyle,
    transitionProperty: 'transform, opacity',
    transitionDuration: snapEntry || (!motionEngaged && !isStaticTwinIdleMode())
      ? '0ms'
      : baseStyle.transitionDuration ?? MOTION_TOKEN_REFS.durationDefault,
    transform,
    ...getMotionVisibilityOpacity(visible),
  };
}

/** Terminal CTA translateY from shared origin — text column height + gap (matches static flex). */
export function getHeroCtaTerminalOffsetPx(textColumnHeightPx: number): number {
  return textColumnHeightPx + HERO_MOTION_TEXT_CTA_GAP_PX;
}

export function getHeroTextColumnTransform(
  motionEngaged: boolean,
  step: HeroMotionStep,
): string {
  if (isStaticTwinIdleMode() && !motionEngaged) {
    return MOTION_SLIDE_REST_TRANSFORM;
  }

  // Idle (!engaged) and step 0 share animationState1 entry pose.
  if (motionEngaged && step >= 1) {
    return MOTION_SLIDE_REST_TRANSFORM;
  }

  return `translateY(${HERO_MOTION_COLUMN_OFFSET_PX}px)`;
}

export function getHeroCtaColumnTransform(
  motionEngaged: boolean,
  step: HeroMotionStep,
  ctaTerminalOffsetPx: number = HERO_MOTION_CTA_PARTIAL_OFFSET_PX,
): string {
  if (isStaticTwinIdleMode() && !motionEngaged) {
    return MOTION_SLIDE_REST_TRANSFORM;
  }

  if (motionEngaged && step >= 2) {
    return `translateY(${ctaTerminalOffsetPx}px)`;
  }

  // Idle / steps 0–1: shared-origin entry offset (animationState1).
  return `translateY(${HERO_MOTION_COLUMN_OFFSET_PX}px)`;
}

/** Column wrapper style for hero staged-sequence (motion-chains hero-animation). */
export function getHeroColumnMotionStyle(
  motionEngaged: boolean,
  step: HeroMotionStep,
  column: 'text' | 'cta',
  options: {
    baseStyle?: CSSProperties;
    ctaTerminalOffsetPx?: number;
  } = {},
): CSSProperties {
  const { baseStyle = HERO_MOTION_STYLE, ctaTerminalOffsetPx = HERO_MOTION_CTA_PARTIAL_OFFSET_PX } =
    options;
  const snapEntry = motionEngaged && step === 0;
  const visible =
    (isStaticTwinIdleMode() && !motionEngaged) ||
    (motionEngaged && (column === 'text' ? step >= 1 : step >= 1));

  return {
    ...baseStyle,
    transitionProperty: 'transform, opacity',
    transitionDuration: snapEntry || (!motionEngaged && !isStaticTwinIdleMode())
      ? '0ms'
      : baseStyle.transitionDuration ?? MOTION_TOKEN_REFS.durationDefault,
    transform:
      column === 'text'
        ? getHeroTextColumnTransform(motionEngaged, step)
        : getHeroCtaColumnTransform(motionEngaged, step, ctaTerminalOffsetPx),
    ...getMotionVisibilityOpacity(visible),
  };
}

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
  // E2E / staticTwin idle: finished layout until motion engages.
  if (isStaticTwinIdleMode() && !revealed && options?.engaged !== true) {
    return {};
  }

  const animateOpacity = options?.animateOpacity ?? true;
  const awaitingTrigger = options?.engaged === false;
  const atEntry = awaitingTrigger || !revealed;

  if (atEntry) {
    return {
      ...baseStyle,
      transitionProperty: options?.transitionProperty ?? 'opacity, transform',
      transitionDelay: options?.transitionDelay ?? '0ms',
      // Snap while waiting / priming — next revealed frame animates from here.
      transitionDuration: '0ms',
      opacity: 0,
      transform: MOTION_SLIDE_ENTRY_TRANSFORM,
      pointerEvents: 'none',
    };
  }

  return {
    ...baseStyle,
    transitionProperty: options?.transitionProperty ?? 'opacity, transform',
    transitionDelay: options?.transitionDelay ?? '0ms',
    transitionDuration: baseStyle.transitionDuration ?? MOTION_TOKEN_REFS.durationDefault,
    opacity: 1,
    transform: options?.liftWhenRevealed
      ? MOTION_SLIDE_LIFT_TRANSFORM
      : MOTION_SLIDE_REST_TRANSFORM,
    ...(animateOpacity ? null : null),
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

  const hasRevealed = motionEngaged && cardIndex <= revealedUpTo;

  // Production idle / unrevealed: keep transition duration so reveal can animate.
  if (!hasRevealed) {
    if (isStaticTwinIdleMode() && !motionEngaged) {
      return motionBase;
    }

    return {
      ...motionBase,
      transform: MOTION_SLIDE_PENDING_TRANSFORM,
      opacity: 0,
      pointerEvents: 'none',
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

/** Clients strip logo scale at terminal pose (SocialProof-animation-alt). */
export const SOCIAL_PROOF_CLIENTS_LOGO_SCALE_TERMINAL = 1.04;

export type SocialProofClientsMotionStep = -1 | 0 | 1;

/** Logo cell scale — simple-one-step on clientsMotion.root (700ms ease-in). */
export function getSocialProofClientsLogoMotionStyle(
  motionStep: SocialProofClientsMotionStep,
  baseStyle: CSSProperties = DEFAULT_MOTION_STYLE,
): CSSProperties {
  const motionEngaged = motionStep >= 0;
  const motionSettled = motionStep >= 1;

  return {
    ...baseStyle,
    transitionProperty: 'transform',
    transform:
      motionEngaged && motionSettled
        ? `scale(${SOCIAL_PROOF_CLIENTS_LOGO_SCALE_TERMINAL})`
        : 'scale(1)',
  };
}

/**
 * Footer mobile nav link emphasis — inferred from notes.md (700ms, no REST prototype).
 * `!font-semibold` is intentional: motion-only weight bump without swapping to a
 * label-semibold utility (which would change size/family on body-sm links).
 */
export const FOOTER_NAV_LINK_EMPHASIS_CLASS =
  '!font-semibold text-[var(--color-text-brand-navy)] underline';

export function getFooterNavLinkMotionStyle(
  baseStyle: CSSProperties = DEFAULT_MOTION_STYLE,
): CSSProperties {
  return {
    ...baseStyle,
    transitionProperty: 'color, font-weight, text-decoration',
  };
}

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
