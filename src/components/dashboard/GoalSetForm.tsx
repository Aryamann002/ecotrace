'use client';

import type { JSX } from 'react';
import { formatTonnes } from '@/lib';
import { Button, Card, Icon, NumberField } from '@/components/ui';

export interface GoalSetFormProps {
  /** Current annual footprint in tonnes, shown as the figure to beat. */
  currentTonnes: number;
  /** Controlled target value, tonnes CO₂e. */
  target: number;
  /** Validation message for the target field, if any. */
  error?: string;
  onTargetChange: (value: number) => void;
  onSet: () => void;
}

/** Card for choosing and setting a reduction target (shown when no goal exists). */
export function GoalSetForm({
  currentTonnes,
  target,
  error,
  onTargetChange,
  onSet,
}: GoalSetFormProps): JSX.Element {
  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center gap-2 text-primary-dark">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
          <Icon name="target" size={20} />
        </span>
        <h3 className="font-display text-lg font-semibold text-ink">Set a reduction goal</h3>
      </div>
      <p className="text-sm text-ink/70">
        Pick an annual target below your current {formatTonnes(currentTonnes)}. We&apos;ll track
        your progress as you recalculate over time.
      </p>
      <div className="max-w-xs">
        <NumberField
          label="Annual target"
          value={target}
          unit="t CO₂e"
          min={0}
          step={0.1}
          error={error}
          onChange={onTargetChange}
        />
      </div>
      <div>
        <Button onClick={onSet}>
          <Icon name="check" size={18} />
          Set goal
        </Button>
      </div>
    </Card>
  );
}
