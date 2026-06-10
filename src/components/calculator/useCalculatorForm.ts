'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';
import { useRouter } from 'next/navigation';
import {
  addHistoryEntry,
  calculateFootprint,
  consumptionInputSchema,
  defaultFootprintInput,
  foodInputSchema,
  footprintInputSchema,
  homeInputSchema,
  loadInput,
  saveInput,
  transportInputSchema,
  type FootprintInput,
} from '@/lib';
import { validateStep, type FieldErrors } from './validation';

export const STEP_LABELS = ['Region', 'Transport', 'Home', 'Food', 'Shopping', 'Review'] as const;
export const LAST_STEP = STEP_LABELS.length - 1;

export interface UseCalculatorForm {
  /** The full questionnaire state (always a complete, defaulted input). */
  input: FootprintInput;
  /** Zero-based index into STEP_LABELS. */
  step: number;
  /** Field-keyed validation errors for the current step. */
  errors: FieldErrors;
  /** Live-region message announcing validation problems. */
  status: string;
  /** Attach to the step heading; focus moves here on step change. */
  headingRef: RefObject<HTMLHeadingElement | null>;
  /** Shallow-merge a patch into the input. */
  update: (patch: Partial<FootprintInput>) => void;
  /** Validate the current step and advance if it passes. */
  handleNext: () => void;
  /** Go back one step, clearing transient errors. */
  handleBack: () => void;
  /** Validate everything, persist, record history, and route to the dashboard. */
  handleSubmit: () => void;
}

/**
 * State and behaviour for the multi-step questionnaire. Holds the full
 * `FootprintInput`, seeded from `loadInput()` after mount (kept out of the
 * initial render to avoid an SSR hydration mismatch). Each step is validated
 * against its slice of the Zod schema before advancing; the final submit
 * validates the whole thing, persists it, records a history point, and routes
 * to the dashboard.
 */
export function useCalculatorForm(): UseCalculatorForm {
  const router = useRouter();
  const [input, setInput] = useState<FootprintInput>(defaultFootprintInput);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState('');
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Seed from previously saved answers once, on the client only.
  useEffect(() => {
    const saved = loadInput();
    if (saved) setInput(saved);
  }, []);

  // Move focus to the step heading on each step change for keyboard/SR users.
  useEffect(() => {
    headingRef.current?.focus();
  }, [step]);

  const update = (patch: Partial<FootprintInput>): void =>
    setInput((prev) => ({ ...prev, ...patch }));

  function validateCurrent(): boolean {
    let result: ReturnType<typeof validateStep>;
    switch (step) {
      case 0:
        result = validateStep(footprintInputSchema.shape.region, input.region);
        break;
      case 1:
        result = validateStep(transportInputSchema, input.transport);
        break;
      case 2:
        result = validateStep(homeInputSchema, input.home);
        break;
      case 3:
        result = validateStep(foodInputSchema, input.food);
        break;
      case 4:
        result = validateStep(consumptionInputSchema, input.consumption);
        break;
      default:
        result = { ok: true, data: input };
    }
    if (result.ok) {
      setErrors({});
      return true;
    }
    // For the region step the path is empty, so map the root error onto `region`.
    setErrors(
      step === 0
        ? { region: Object.values(result.errors)[0] ?? 'Please choose an option.' }
        : result.errors,
    );
    setStatus('Please fix the highlighted fields before continuing.');
    return false;
  }

  function handleNext(): void {
    if (!validateCurrent()) return;
    setStatus('');
    setStep((s) => Math.min(s + 1, LAST_STEP));
  }

  function handleBack(): void {
    setErrors({});
    setStatus('');
    setStep((s) => Math.max(s - 1, 0));
  }

  function handleSubmit(): void {
    const result = validateStep(footprintInputSchema, input);
    if (!result.ok) {
      setErrors(result.errors);
      setStatus('Some answers are invalid. Please review the earlier steps.');
      return;
    }
    const valid = result.data;
    saveInput(valid);
    const footprint = calculateFootprint(valid);
    addHistoryEntry({
      date: new Date().toISOString(),
      totalKg: footprint.totalKg,
      totalTonnes: footprint.totalTonnes,
    });
    router.push('/dashboard');
  }

  return { input, step, errors, status, headingRef, update, handleNext, handleBack, handleSubmit };
}
