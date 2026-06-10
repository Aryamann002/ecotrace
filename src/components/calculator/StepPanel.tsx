'use client';

import type { JSX } from 'react';
import type { FootprintInput, Region } from '@/lib';
import { RegionStep } from './steps/RegionStep';
import { TransportStep } from './steps/TransportStep';
import { HomeStep } from './steps/HomeStep';
import { FoodStep } from './steps/FoodStep';
import { ConsumptionStep } from './steps/ConsumptionStep';
import { ReviewStep } from './steps/ReviewStep';
import { LAST_STEP } from './useCalculatorForm';
import type { FieldErrors } from './validation';

export interface StepPanelProps {
  /** Zero-based index of the active step. */
  step: number;
  input: FootprintInput;
  errors: FieldErrors;
  /** Shallow-merge a patch into the questionnaire input. */
  onUpdate: (patch: Partial<FootprintInput>) => void;
}

/** Renders the fields for the active questionnaire step. */
export function StepPanel({ step, input, errors, onUpdate }: StepPanelProps): JSX.Element | null {
  switch (step) {
    case 0:
      return (
        <RegionStep
          value={input.region}
          errors={errors}
          onChange={(region: Region) => onUpdate({ region })}
        />
      );
    case 1:
      return (
        <TransportStep
          value={input.transport}
          errors={errors}
          onChange={(patch) => onUpdate({ transport: { ...input.transport, ...patch } })}
        />
      );
    case 2:
      return (
        <HomeStep
          value={input.home}
          errors={errors}
          onChange={(patch) => onUpdate({ home: { ...input.home, ...patch } })}
        />
      );
    case 3:
      return (
        <FoodStep
          value={input.food}
          errors={errors}
          onChange={(patch) => onUpdate({ food: { ...input.food, ...patch } })}
        />
      );
    case 4:
      return (
        <ConsumptionStep
          value={input.consumption}
          errors={errors}
          onChange={(patch) => onUpdate({ consumption: { ...input.consumption, ...patch } })}
        />
      );
    case LAST_STEP:
      return <ReviewStep input={input} />;
    default:
      return null;
  }
}
