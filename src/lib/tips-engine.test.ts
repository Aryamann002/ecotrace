import { describe, expect, it } from 'vitest';
import { makeInput } from '@/test/factories';
import { generateTips } from './tips-engine';
import { calculateFootprint } from './calculator';

const heavyInput = makeInput({
  transport: { carKmPerWeek: 150, carFuel: 'petrol', flightsLongHaulPerYear: 1 },
  home: { electricityKwhPerMonth: 400, heatingFuel: 'gas', heatingAmountPerMonth: 80 },
  food: { diet: 'high_meat', foodWaste: 'high' },
  consumption: { shopping: 'frequent', recycles: false },
});

describe('generateTips', () => {
  it('returns tips with positive estimated savings', () => {
    const tips = generateTips(heavyInput, calculateFootprint(heavyInput));
    expect(tips.length).toBeGreaterThan(0);
    expect(tips.every((t) => t.estimatedSavingKg > 0)).toBe(true);
  });

  it('is sorted by estimated saving, descending', () => {
    const tips = generateTips(heavyInput, calculateFootprint(heavyInput));
    const savings = tips.map((t) => t.estimatedSavingKg);
    const sorted = [...savings].sort((a, b) => b - a);
    expect(savings).toEqual(sorted);
  });

  it('recommends a diet shift for a high-meat eater with the expected saving', () => {
    const tips = generateTips(heavyInput, calculateFootprint(heavyInput));
    const dietTip = tips.find((t) => t.id === 'diet-shift');
    expect(dietTip).toBeDefined();
    // (3600 - 2800) * 1.25 = 1000
    expect(dietTip?.estimatedSavingKg).toBeCloseTo(1000);
  });

  it('recommends switching to an EV for a petrol driver', () => {
    const tips = generateTips(heavyInput, calculateFootprint(heavyInput));
    expect(tips.some((t) => t.id === 'switch-ev')).toBe(true);
  });

  it('respects the limit option', () => {
    const tips = generateTips(heavyInput, calculateFootprint(heavyInput), { limit: 2 });
    expect(tips).toHaveLength(2);
  });

  it('returns no tips for an already low-impact profile', () => {
    const greenInput = makeInput({
      transport: {},
      home: {},
      food: { diet: 'vegan', foodWaste: 'low' },
      consumption: { shopping: 'minimal', recycles: true },
    });
    const tips = generateTips(greenInput, calculateFootprint(greenInput));
    expect(tips).toHaveLength(0);
  });
});

describe('generateTips edge cases', () => {
  it('does not suggest an EV switch to an electric-car driver', () => {
    const input = makeInput({ transport: { carKmPerWeek: 200, carFuel: 'electric' } });
    const tips = generateTips(input, calculateFootprint(input));
    expect(tips.some((t) => t.id === 'switch-ev')).toBe(false);
  });

  it('skips the modal-shift tip when transit already matches car distance', () => {
    const input = makeInput({
      transport: { carKmPerWeek: 100, carFuel: 'petrol', publicTransitKmPerWeek: 100 },
    });
    const tips = generateTips(input, calculateFootprint(input));
    expect(tips.some((t) => t.id === 'shift-to-transit')).toBe(false);
  });

  it('applies the recycling multiplier to the buy-less saving', () => {
    const recycler = makeInput({ consumption: { shopping: 'frequent', recycles: true } });
    const nonRecycler = makeInput({ consumption: { shopping: 'frequent', recycles: false } });
    const recyclerTip = generateTips(recycler, calculateFootprint(recycler)).find(
      (t) => t.id === 'buy-less',
    );
    const nonRecyclerTip = generateTips(nonRecycler, calculateFootprint(nonRecycler)).find(
      (t) => t.id === 'buy-less',
    );
    // (3000 - 1500) * 0.92 = 1380 vs (3000 - 1500) * 1 = 1500
    expect(recyclerTip?.estimatedSavingKg).toBeCloseTo(1380);
    expect(nonRecyclerTip?.estimatedSavingKg).toBeCloseTo(1500);
  });

  it('returns an empty list for limit: 0', () => {
    expect(generateTips(heavyInput, calculateFootprint(heavyInput), { limit: 0 })).toHaveLength(0);
  });

  it('skips the renewable-tariff tip at 100% renewable electricity', () => {
    const input = makeInput({
      home: { electricityKwhPerMonth: 400, renewablePercent: 100, heatingFuel: 'none' },
    });
    const tips = generateTips(input, calculateFootprint(input));
    expect(tips.some((t) => t.id === 'renewable-tariff')).toBe(false);
  });
});
