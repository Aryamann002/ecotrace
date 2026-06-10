import { describe, expect, it } from 'vitest';
import { goalProgress } from './goal';
import type { Goal } from './schemas';

function makeGoal(baselineTonnes: number, targetTonnes: number): Goal {
  return { baselineTonnes, targetTonnes, createdAt: '2026-01-01T00:00:00.000Z' };
}

describe('goalProgress', () => {
  it('reports zero progress at the baseline', () => {
    const progress = goalProgress(makeGoal(10, 8), 10);
    expect(progress.progressPercent).toBe(0);
    expect(progress.reducedTonnes).toBe(0);
    expect(progress.neededTonnes).toBe(2);
    expect(progress.remainingTonnes).toBe(2);
    expect(progress.achieved).toBe(false);
  });

  it('reports partial progress between baseline and target', () => {
    const progress = goalProgress(makeGoal(10, 8), 9);
    expect(progress.progressPercent).toBe(50);
    expect(progress.reducedTonnes).toBe(1);
    expect(progress.remainingTonnes).toBe(1);
    expect(progress.achieved).toBe(false);
  });

  it('reports achievement at or below the target', () => {
    const atTarget = goalProgress(makeGoal(10, 8), 8);
    expect(atTarget.achieved).toBe(true);
    expect(atTarget.progressPercent).toBe(100);
    expect(atTarget.remainingTonnes).toBe(0);

    const below = goalProgress(makeGoal(10, 8), 7);
    expect(below.achieved).toBe(true);
    expect(below.progressPercent).toBe(100);
    expect(below.remainingTonnes).toBe(0);
  });

  it('clamps progress when the footprint rises above the baseline', () => {
    const progress = goalProgress(makeGoal(10, 8), 12);
    expect(progress.progressPercent).toBe(0);
    expect(progress.reducedTonnes).toBe(0);
    expect(progress.remainingTonnes).toBe(4);
  });

  it('treats a goal with nothing to reduce as already complete', () => {
    const progress = goalProgress(makeGoal(8, 8), 8);
    expect(progress.progressPercent).toBe(100);
    expect(progress.neededTonnes).toBe(0);
    expect(progress.achieved).toBe(true);
  });

  it('caps progress at 100% when reduction overshoots the target', () => {
    const progress = goalProgress(makeGoal(10, 8), 5);
    expect(progress.progressPercent).toBe(100);
    expect(progress.reducedTonnes).toBe(5);
  });
});
