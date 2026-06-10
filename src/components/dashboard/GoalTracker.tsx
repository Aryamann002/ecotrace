'use client';

import { useEffect, useState, type JSX } from 'react';
import { clearGoal, loadGoal, round, saveGoal, TARGET_TONNES, type Goal } from '@/lib';
import { Card } from '@/components/ui';
import { GoalSetForm } from './GoalSetForm';
import { GoalProgressCard } from './GoalProgressCard';

export interface GoalTrackerProps {
  /** Current annual footprint in tonnes, used as the baseline and for progress. */
  currentTonnes: number;
}

/** Default suggestion: a 20% cut from the current footprint (floored at the 1.5 °C target). */
const SUGGESTED_TARGET_FACTOR = 0.8;

/** Goal figures are stored and displayed to one decimal place. */
const GOAL_DECIMALS = 1;

/**
 * Set and track a reduction goal. This shell owns the persisted goal state and
 * validation; `GoalSetForm` and `GoalProgressCard` render the two modes. The
 * goal's baseline is captured from the footprint at the moment it's set, so
 * progress is measured against where you started, not the latest number.
 */
export function GoalTracker({ currentTonnes }: GoalTrackerProps): JSX.Element {
  const [goal, setGoal] = useState<Goal | null>(null);
  const [loaded, setLoaded] = useState(false);
  const suggested = Math.max(
    TARGET_TONNES,
    round(currentTonnes * SUGGESTED_TARGET_FACTOR, GOAL_DECIMALS),
  );
  const [target, setTarget] = useState(suggested);
  const [error, setError] = useState<string>();

  useEffect(() => {
    setGoal(loadGoal());
    setLoaded(true);
  }, []);

  function handleSet(): void {
    if (!Number.isFinite(target) || target <= 0) {
      setError('Enter a target greater than zero.');
      return;
    }
    if (target >= currentTonnes) {
      setError('Your target should be below your current footprint to be a reduction.');
      return;
    }
    const next: Goal = {
      targetTonnes: round(target, GOAL_DECIMALS),
      baselineTonnes: round(currentTonnes, GOAL_DECIMALS),
      createdAt: new Date().toISOString(),
    };
    saveGoal(next);
    setGoal(next);
    setError(undefined);
  }

  function handleClear(): void {
    clearGoal();
    setGoal(null);
    setTarget(suggested);
  }

  if (!loaded) {
    // Avoid an SSR/CSR mismatch: render nothing definitive until the goal is read.
    return <Card className="h-40 animate-pulse bg-primary/5" aria-hidden="true" />;
  }

  if (!goal) {
    return (
      <GoalSetForm
        currentTonnes={currentTonnes}
        target={target}
        error={error}
        onTargetChange={setTarget}
        onSet={handleSet}
      />
    );
  }

  return <GoalProgressCard goal={goal} currentTonnes={currentTonnes} onReset={handleClear} />;
}
