'use client';

import type { JSX } from 'react';
import { formatPercent, formatTonnes, goalProgress, type Goal } from '@/lib';
import { Button, Card, Icon, ProgressBar } from '@/components/ui';

export interface GoalProgressCardProps {
  goal: Goal;
  /** Current annual footprint in tonnes, measured against the goal. */
  currentTonnes: number;
  onReset: () => void;
}

/** One labelled tonnes figure in the baseline / now / target strip. */
function GoalStat({ label, tonnes }: { label: string; tonnes: number }): JSX.Element {
  return (
    <div className="rounded-2xl bg-surface p-3">
      <p className="text-xs uppercase tracking-wide text-ink/60">{label}</p>
      <p className="font-display text-lg font-bold text-ink">{formatTonnes(tonnes)}</p>
    </div>
  );
}

/** Card showing progress from baseline toward an existing reduction goal. */
export function GoalProgressCard({
  goal,
  currentTonnes,
  onReset,
}: GoalProgressCardProps): JSX.Element {
  const progress = goalProgress(goal, currentTonnes);

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-primary-dark">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
            <Icon name="target" size={20} />
          </span>
          <h3 className="font-display text-lg font-semibold text-ink">Your reduction goal</h3>
        </div>
        <Button variant="ghost" size="md" onClick={onReset}>
          Reset
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        <GoalStat label="Baseline" tonnes={goal.baselineTonnes} />
        <GoalStat label="Now" tonnes={currentTonnes} />
        <GoalStat label="Target" tonnes={goal.targetTonnes} />
      </div>

      <div className="flex flex-col gap-2">
        <ProgressBar
          value={progress.progressPercent}
          label="Progress toward your reduction goal"
          valueText={`${formatPercent(progress.progressPercent)} of the way from baseline to target`}
          tone={progress.achieved ? 'primary' : 'accent'}
        />
        <p aria-live="polite" className="text-sm font-medium text-ink">
          {progress.achieved ? (
            <span className="inline-flex items-center gap-1 text-primary-dark">
              <Icon name="trophy" size={16} />
              Target reached — you&apos;ve cut {formatTonnes(progress.reducedTonnes)} from your
              baseline.
            </span>
          ) : (
            <>
              {formatPercent(progress.progressPercent)} there ·{' '}
              {formatTonnes(progress.remainingTonnes)} still to cut to reach your target.
            </>
          )}
        </p>
      </div>
    </Card>
  );
}
