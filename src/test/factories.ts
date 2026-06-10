import { footprintInputSchema, type FootprintInput } from '@/lib';

/** Recursive partial — lets tests override any nested slice of a shape. */
export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

/**
 * Build a valid `FootprintInput` for tests, with every field defaulted by the
 * Zod schema and any subset overridden. Typed so test overrides are checked
 * against the real input shape instead of `Record<string, unknown>`.
 */
export function makeInput(partial: DeepPartial<FootprintInput> = {}): FootprintInput {
  return footprintInputSchema.parse({
    region: 'GLOBAL',
    transport: {},
    home: {},
    food: {},
    consumption: {},
    ...partial,
  });
}
