/** Reads a compiled motion duration CSS variable from `:root` (e.g. `--motion-duration-step-delay`). */
export function getDurationTokenMs(cssVarName: string, fallbackMs = 120): number {
  if (typeof window === 'undefined') return fallbackMs;
  const raw = getComputedStyle(document.documentElement).getPropertyValue(cssVarName).trim();
  const parsed = Number.parseInt(raw, 10);
  return Number.isNaN(parsed) ? fallbackMs : parsed;
}

export const MOTION_DURATION_DEFAULT_VAR = '--motion-duration-default';
export const MOTION_DURATION_STEP_DELAY_VAR = '--motion-duration-step-delay';
export const MOTION_DURATION_AUTO_ADVANCE_VAR = '--motion-duration-auto-advance';
