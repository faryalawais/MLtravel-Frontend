import { getDurationTokenMs, MOTION_DURATION_AUTO_ADVANCE_VAR, MOTION_DURATION_STEP_DELAY_VAR } from '@/lib/motion-tokens';

export type MotionStepDelayToken =
  | typeof MOTION_DURATION_STEP_DELAY_VAR
  | typeof MOTION_DURATION_AUTO_ADVANCE_VAR;

/**
 * Runs a MOTION-SPEC stepped sequence.
 * Step 0 fires immediately on trigger; step N fires after `stepDelay * N`.
 * Step delay token: 120ms (rapid) or 300ms (staged/hero auto-advance).
 */
export function runSteppedMotion(
  steps: Array<() => void>,
  stepDelayVar: MotionStepDelayToken,
  fallbackStepDelayMs = 120,
): () => void {
  const timers: ReturnType<typeof setTimeout>[] = [];
  const stepDelayMs = getDurationTokenMs(stepDelayVar, fallbackStepDelayMs);

  steps.forEach((step, index) => {
    timers.push(setTimeout(step, stepDelayMs * index));
  });

  return () => {
    timers.forEach((timer) => clearTimeout(timer));
  };
}

/**
 * MOTION-SPEC §1 — hero staged reveal:
 * hover → copy text (700ms ease-out) → +300ms CTAs → +300ms product + stats.
 */
export function runHeroMotion(
  onEngage: () => void,
  onTextStep: () => void,
  onCtaStep: () => void,
  onVisualStep: () => void,
): () => void {
  return runSteppedMotion(
    [
      () => {
        onEngage();
        requestAnimationFrame(() => {
          requestAnimationFrame(onTextStep);
        });
      },
      onCtaStep,
      onVisualStep,
    ],
    MOTION_DURATION_AUTO_ADVANCE_VAR,
    300,
  );
}

/** MOTION-SPEC rapid 4-step (Problem, HIW): 4 timed steps after hover (5 total states). */
export function runRapidFourStepMotion(
  steps: [() => void, () => void, () => void, () => void],
): () => void {
  return runSteppedMotion(steps, MOTION_DURATION_STEP_DELAY_VAR, 120);
}

/** MOTION-SPEC §7 — Feature grid: 3 transitions (states 1→2→3→4), 300ms auto-advance. */
export function runFeatureGridMotion(
  steps: [() => void, () => void, () => void],
): () => void {
  return runSteppedMotion(steps, MOTION_DURATION_AUTO_ADVANCE_VAR, 300);
}

/** @deprecated Use runFeatureGridMotion — kept for call-site migration. */
export function runStagedThreeStepMotion(
  steps: [() => void, () => void, () => void],
): () => void {
  return runFeatureGridMotion(steps);
}
