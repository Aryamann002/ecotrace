/**
 * Shared numeric helpers.
 *
 * Single home for rounding so every module (calculator, tips, goals, comparisons)
 * rounds identically and the behaviour is tested in exactly one place.
 */

/**
 * Round a value to `dp` decimal places (default 2), avoiding noisy
 * floating-point output in results and UI copy.
 */
export function round(value: number, dp = 2): number {
  const factor = 10 ** dp;
  return Math.round(value * factor) / factor;
}
