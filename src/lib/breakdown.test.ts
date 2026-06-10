import { describe, expect, it } from 'vitest';
import { makeInput } from '@/test/factories';
import { categoryBreakdown } from './breakdown';
import { calculateFootprint } from './calculator';

describe('categoryBreakdown', () => {
  it('returns shares for all categories, sorted largest first', () => {
    const result = calculateFootprint(
      makeInput({
        transport: { carKmPerWeek: 150, carFuel: 'petrol' },
        food: { diet: 'high_meat', foodWaste: 'high' },
      }),
    );
    const shares = categoryBreakdown(result);
    expect(shares).toHaveLength(4);
    const kgs = shares.map((s) => s.kg);
    expect(kgs).toEqual([...kgs].sort((a, b) => b - a));
  });

  it('produces percentages that sum to ~100 for a non-zero footprint', () => {
    const result = calculateFootprint(makeInput({ food: { diet: 'medium_meat' } }));
    const totalPercent = categoryBreakdown(result).reduce((sum, s) => sum + s.percent, 0);
    expect(totalPercent).toBeGreaterThan(99.5);
    expect(totalPercent).toBeLessThan(100.5);
  });

  it('returns zero percentages when the total is zero', () => {
    const zero = {
      totalKg: 0,
      totalTonnes: 0,
      categories: { transport: 0, home: 0, food: 0, consumption: 0 },
      details: { car: 0, transit: 0, flights: 0, electricity: 0, heating: 0 },
    };
    const shares = categoryBreakdown(zero);
    expect(shares.every((s) => s.percent === 0)).toBe(true);
    expect(shares.every((s) => s.kg === 0)).toBe(true);
  });
});
