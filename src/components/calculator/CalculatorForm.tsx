'use client';

import type { JSX } from 'react';
import { Button, Card, Icon, Stepper } from '@/components/ui';
import { StepPanel } from './StepPanel';
import { LAST_STEP, STEP_LABELS, useCalculatorForm } from './useCalculatorForm';

/**
 * Multi-step questionnaire shell. All state, validation, and persistence live in
 * `useCalculatorForm`; this component only lays out the stepper, the active
 * step's fields (via `StepPanel`), and the navigation controls.
 */
export function CalculatorForm(): JSX.Element {
  const { input, step, errors, status, headingRef, update, handleNext, handleBack, handleSubmit } =
    useCalculatorForm();

  return (
    <div className="flex flex-col gap-8">
      <Stepper steps={STEP_LABELS} current={step} />

      <Card>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (step === LAST_STEP) handleSubmit();
            else handleNext();
          }}
          noValidate
        >
          <h2
            ref={headingRef}
            tabIndex={-1}
            className="font-display text-2xl font-bold text-ink focus:outline-none"
          >
            {STEP_LABELS[step] === 'Review' ? 'Review your answers' : `${STEP_LABELS[step]}`}
          </h2>
          <p className="mt-1 text-ink/60">
            Step {step + 1} of {STEP_LABELS.length}
          </p>

          <div className="mt-6">
            <StepPanel step={step} input={input} errors={errors} onUpdate={update} />
          </div>

          {/* Polite live region announces validation problems / step status. */}
          <p aria-live="polite" className="sr-only">
            {status}
          </p>

          <div className="mt-8 flex items-center justify-between gap-4">
            <Button type="button" variant="ghost" onClick={handleBack} disabled={step === 0}>
              <Icon name="arrow-left" size={18} />
              Back
            </Button>
            {step === LAST_STEP ? (
              <Button type="submit" size="lg" variant="accent">
                See my results
                <Icon name="arrow-right" size={18} />
              </Button>
            ) : (
              <Button type="submit" size="lg">
                Continue
                <Icon name="arrow-right" size={18} />
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}
