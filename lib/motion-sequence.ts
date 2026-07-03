import {
  getDurationTokenMs,
  MOTION_DURATION_AUTO_ADVANCE_VAR,
  MOTION_DURATION_DEFAULT_VAR,
  MOTION_DURATION_STEP_DELAY_VAR,
} from '@/lib/motion-tokens';

export type MotionStepDelayToken =
  | typeof MOTION_DURATION_STEP_DELAY_VAR
  | typeof MOTION_DURATION_AUTO_ADVANCE_VAR;

/**
 * Runs a stepped sequence with fixed delay between steps (rapid-four-step pattern).
 * Step 0 fires immediately on trigger; step N fires after `stepDelay * N`.
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
 * Staged-sequence with AFTER_TIMEOUT auto-advance between transitions.
 * Step N fires at sum(previous duration + delay) from trigger — not delay × index.
 */
export function runAutoAdvanceStagedMotion(steps: Array<() => void>): () => void {
  const timers: ReturnType<typeof setTimeout>[] = [];
  const transitionMs = getDurationTokenMs(MOTION_DURATION_DEFAULT_VAR, 700);
  const autoAdvanceMs = getDurationTokenMs(MOTION_DURATION_AUTO_ADVANCE_VAR, 300);

  let at = 0;
  steps.forEach((step, index) => {
    timers.push(setTimeout(step, at));
    if (index < steps.length - 1) {
      at += transitionMs + autoAdvanceMs;
    }
  });

  return () => {
    timers.forEach((timer) => clearTimeout(timer));
  };
}

/**
 * Hero staged-sequence — motion-chains hero-animation (2 transitions, 3 states):
 * hover → text 370→0 (700ms) → hold state 2 → AFTER_TIMEOUT 300ms → CTA 370→284 (700ms).
 */
export function runHeroMotion(
  onTextStep: () => void,
  onCtaStep: () => void,
): () => void {
  const timers: ReturnType<typeof setTimeout>[] = [];
  const transitionMs = getDurationTokenMs(MOTION_DURATION_DEFAULT_VAR, 700);
  const pauseOnState2Ms = getDurationTokenMs(MOTION_DURATION_AUTO_ADVANCE_VAR, 300);

  timers.push(
    setTimeout(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(onTextStep);
      });
    }, 32),
  );

  timers.push(setTimeout(onCtaStep, transitionMs + pauseOnState2Ms + 32));

  return () => {
    timers.forEach((timer) => clearTimeout(timer));
  };
}

/**
 * Prototype-chain steps: step 0 on trigger; step N at N×(transitionMs + betweenStepDelayMs).
 * Matches Figma AFTER_TIMEOUT chains (Problem, HIW).
 */
export function runChainedTransitionMotion(
  steps: Array<() => void>,
  betweenStepDelayMs: number,
): () => void {
  const timers: ReturnType<typeof setTimeout>[] = [];
  const transitionMs = getDurationTokenMs(MOTION_DURATION_DEFAULT_VAR, 700);
  const primeMs = 32;

  steps.forEach((step, index) => {
    if (index === 0) {
      timers.push(
        setTimeout(() => {
          requestAnimationFrame(() => {
            requestAnimationFrame(step);
          });
        }, primeMs),
      );
    } else {
      const at = primeMs + index * (transitionMs + betweenStepDelayMs);
      timers.push(setTimeout(step, at));
    }
  });

  return () => {
    timers.forEach((timer) => clearTimeout(timer));
  };
}

/** Rapid 4-step (Problem, HIW): 4 callbacks; 700ms transition + 120ms step delay between states. */
export function runRapidFourStepMotion(
  steps: [() => void, () => void, () => void, () => void],
): () => void {
  const stepDelayMs = getDurationTokenMs(MOTION_DURATION_STEP_DELAY_VAR, 120);
  return runChainedTransitionMotion(steps, stepDelayMs);
}

/**
 * Simple one-step — motion-chains comparison-animation, Pricing, clients strip:
 * hover → snap entry pose (32ms prime) → animate to terminal (700ms).
 */
export function runSimpleOneStepMotion(
  onEntrySnap: () => void,
  onTerminal: () => void,
): () => void {
  const timers: ReturnType<typeof setTimeout>[] = [];
  const transitionMs = getDurationTokenMs(MOTION_DURATION_DEFAULT_VAR, 700);

  timers.push(
    setTimeout(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          onEntrySnap();
          timers.push(setTimeout(onTerminal, transitionMs));
        });
      });
    }, 32),
  );

  return () => {
    timers.forEach((timer) => clearTimeout(timer));
  };
}

/**
 * Footer link emphasis — inferred Footer-animation (1 state, no REST prototype):
 * hover motion.root → emphasize first links → dwell 700ms → settle.
 */
export function runFooterLinkEmphasisMotion(
  onEmphasize: () => void,
  onSettle: () => void,
): () => void {
  const timers: ReturnType<typeof setTimeout>[] = [];
  const dwellMs = getDurationTokenMs(MOTION_DURATION_DEFAULT_VAR, 700);

  timers.push(
    setTimeout(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          onEmphasize();
          timers.push(setTimeout(onSettle, dwellMs));
        });
      });
    }, 32),
  );

  return () => {
    timers.forEach((timer) => clearTimeout(timer));
  };
}

/** Feature grid: 3 transitions with cumulative duration + auto-advance delay. */
export function runFeatureGridMotion(
  steps: [() => void, () => void, () => void],
): () => void {
  return runAutoAdvanceStagedMotion(steps);
}

/** @deprecated Use runFeatureGridMotion — kept for call-site migration. */
export function runStagedThreeStepMotion(
  steps: [() => void, () => void, () => void],
): () => void {
  return runFeatureGridMotion(steps);
}
