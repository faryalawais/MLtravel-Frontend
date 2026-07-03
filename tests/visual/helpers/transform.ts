/**
 * Parse translateX from a CSS transform matrix (2d or 3d).
 * Returns 0 for `none` or unparseable values.
 */
export function parseTranslateX(transform: string): number {
  if (!transform || transform === 'none') {
    return 0;
  }

  const matrix2d = transform.match(
    /^matrix\(\s*[-\d.e]+\s*,\s*[-\d.e]+\s*,\s*[-\d.e]+\s*,\s*[-\d.e]+\s*,\s*([-\d.e]+)\s*,\s*([-\d.e]+)\s*\)$/,
  );
  if (matrix2d) {
    return Number.parseFloat(matrix2d[1]);
  }

  const matrix3d = transform.match(
    /^matrix3d\(\s*[-\d.e]+\s*,\s*[-\d.e]+\s*,\s*[-\d.e]+\s*,\s*[-\d.e]+\s*,\s*[-\d.e]+\s*,\s*[-\d.e]+\s*,\s*[-\d.e]+\s*,\s*[-\d.e]+\s*,\s*[-\d.e]+\s*,\s*[-\d.e]+\s*,\s*[-\d.e]+\s*,\s*[-\d.e]+\s*,\s*([-\d.e]+)\s*,\s*([-\d.e]+)\s*,\s*([-\d.e]+)\s*,\s*([-\d.e]+)\s*\)$/,
  );
  if (matrix3d) {
    return Number.parseFloat(matrix3d[2]);
  }

  return 0;
}

/** Uniform scale from `scale(n)` or matrix(a,…,d,…) when b/c are 0. */
export function parseUniformScale(transform: string): number {
  if (!transform || transform === 'none') {
    return 1;
  }

  const scaleFn = transform.match(/^scale\(([\d.]+)\)$/);
  if (scaleFn) {
    return Number.parseFloat(scaleFn[1]);
  }

  const matrix2d = transform.match(
    /^matrix\(\s*([-\d.e]+)\s*,\s*([-\d.e]+)\s*,\s*([-\d.e]+)\s*,\s*([-\d.e]+)\s*,\s*[-\d.e]+\s*,\s*[-\d.e]+\s*\)$/,
  );
  if (matrix2d) {
    return Number.parseFloat(matrix2d[1]);
  }

  return 1;
}

/**
 * Parse translateY from a CSS transform matrix (2d or 3d).
 * Returns 0 for `none` or unparseable values.
 */
export function parseTranslateY(transform: string): number {
  if (!transform || transform === 'none') {
    return 0;
  }

  const matrix2d = transform.match(
    /^matrix\(\s*[-\d.e]+\s*,\s*[-\d.e]+\s*,\s*[-\d.e]+\s*,\s*[-\d.e]+\s*,\s*([-\d.e]+)\s*,\s*([-\d.e]+)\s*\)$/,
  );
  if (matrix2d) {
    return Number.parseFloat(matrix2d[2]);
  }

  const matrix3d = transform.match(
    /^matrix3d\(\s*[-\d.e]+\s*,\s*[-\d.e]+\s*,\s*[-\d.e]+\s*,\s*[-\d.e]+\s*,\s*[-\d.e]+\s*,\s*[-\d.e]+\s*,\s*[-\d.e]+\s*,\s*[-\d.e]+\s*,\s*[-\d.e]+\s*,\s*[-\d.e]+\s*,\s*[-\d.e]+\s*,\s*[-\d.e]+\s*,\s*([-\d.e]+)\s*,\s*([-\d.e]+)\s*,\s*([-\d.e]+)\s*,\s*([-\d.e]+)\s*\)$/,
  );
  if (matrix3d) {
    return Number.parseFloat(matrix3d[3]);
  }

  return 0;
}

/** Assert translateY within tolerance (subpixel / rounding). */
export function isTranslateYNear(actual: number, expected: number, tolerancePx = 2): boolean {
  return Math.abs(actual - expected) <= tolerancePx;
}

export function expectTranslateY(
  actual: number,
  expected: number,
  tolerancePx = 2,
): void {
  if (!isTranslateYNear(actual, expected, tolerancePx)) {
    throw new Error(`Expected translateY ${expected}px ±${tolerancePx}, got ${actual}px`);
  }
}
