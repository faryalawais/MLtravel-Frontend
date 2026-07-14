'use client';

import { useCallback, useEffect, useRef, useState, type CSSProperties, type RefObject } from 'react';
import {
  DEFAULT_MOTION_STYLE,
  getMotionSlideRevealStyle,
  isStaticTwinIdleMode,
} from '@/constants/motion.constants';
import { runSimpleOneStepMotion } from '@/lib/motion-sequence';

/** One-way motion trigger — plays once per mount, cleans up timers on unmount. */
export function useOneWayMotion(play: () => () => void): () => void {
  const hasPlayedRef = useRef(false);
  const cancelRef = useRef<(() => void) | null>(null);

  const trigger = useCallback(() => {
    if (hasPlayedRef.current) return;
    hasPlayedRef.current = true;
    cancelRef.current?.();
    cancelRef.current = play();
  }, [play]);

  useEffect(() => {
    return () => {
      cancelRef.current?.();
    };
  }, []);

  return trigger;
}

/**
 * Auto-plays one-way motion when the section enters the viewport.
 * Skipped under Playwright (`NEXT_PUBLIC_E2E_MODE=1`) so fixture timing
 * still measures from `onMouseEnter` as in Figma motion-chains.
 */
export function useInViewMotionTrigger(
  trigger: () => void,
  rootRef: RefObject<HTMLElement | null>,
): void {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_E2E_MODE === '1') return;

    const node = rootRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) trigger();
      },
      // Fire as the section enters — content stays hidden until then.
      { threshold: 0.18, rootMargin: '0px 0px -8% 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [trigger, rootRef]);
}

/** Plays one-way motion when the URL hash matches (e.g. Product → `/#product`). */
export function useHashMotionTrigger(trigger: () => void, hash: string): void {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_E2E_MODE === '1') return;

    const normalized = hash.startsWith('#') ? hash : `#${hash}`;

    const playIfMatch = () => {
      if (window.location.hash === normalized) trigger();
    };

    playIfMatch();
    window.addEventListener('hashchange', playIfMatch);
    return () => window.removeEventListener('hashchange', playIfMatch);
  }, [trigger, hash]);
}

export type SectionEntranceStep = -1 | 0 | 1;

/**
 * Shared entrance for sections without a Figma motion twin.
 * Production: fully hidden until in-view / hover, then simple-one-step reveal.
 * E2E: staticTwin idle until hover.
 */
export function useSectionEntranceMotion(baseStyle: CSSProperties = DEFAULT_MOTION_STYLE) {
  const rootRef = useRef<HTMLElement | null>(null);
  const [motionStep, setMotionStep] = useState<SectionEntranceStep>(-1);

  const play = useCallback(
    () =>
      runSimpleOneStepMotion(
        () => setMotionStep(0),
        () => setMotionStep(1),
      ),
    [],
  );

  const triggerMotion = useOneWayMotion(play);
  useInViewMotionTrigger(triggerMotion, rootRef);

  const motionEngaged = motionStep >= 0;
  const motionSettled = motionStep >= 1;

  const entranceStyle = (options?: {
    transitionDelay?: string;
    animateOpacity?: boolean;
  }): CSSProperties => {
    if (isStaticTwinIdleMode() && !motionEngaged) {
      return {};
    }

    return getMotionSlideRevealStyle(motionSettled, baseStyle, {
      ...options,
      engaged: motionEngaged,
      animateOpacity: options?.animateOpacity ?? true,
    });
  };

  return {
    rootRef,
    triggerMotion,
    motionEngaged,
    motionSettled,
    entranceStyle,
  };
}
