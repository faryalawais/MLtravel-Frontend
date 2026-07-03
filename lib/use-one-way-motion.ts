'use client';

import { useCallback, useEffect, useRef } from 'react';

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
