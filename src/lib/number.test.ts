import { describe, expect, it } from 'vitest';
import { round } from './number';

describe('round', () => {
  it('rounds to 2 decimal places by default', () => {
    expect(round(1.2345)).toBe(1.23);
    expect(round(1.236)).toBe(1.24);
    expect(round(998.4000000001)).toBe(998.4);
  });

  it('supports other precisions', () => {
    expect(round(1.26, 1)).toBe(1.3);
    expect(round(1.4, 0)).toBe(1);
    expect(round(1.23456, 4)).toBe(1.2346);
  });

  it('handles zero and negative values', () => {
    expect(round(0)).toBe(0);
    expect(round(-1.005, 1)).toBe(-1);
    expect(round(-2.567)).toBe(-2.57);
  });

  it('leaves already-rounded values unchanged', () => {
    expect(round(42)).toBe(42);
    expect(round(3.14)).toBe(3.14);
  });
});
