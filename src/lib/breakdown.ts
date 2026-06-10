import { round } from './number';
import { CATEGORY_KEYS, type CategoryKey, type FootprintResult } from './schemas';

export interface CategoryShare {
  key: CategoryKey;
  kg: number;
  /** Share of the total footprint, 0–100 (0 when the total is 0). */
  percent: number;
}

/**
 * Break a result's category totals into shares of the whole, sorted largest first.
 *
 * Pure and deterministic. Percentages are rounded to one decimal; when the total is
 * zero every share is 0 (avoids divide-by-zero), so the UI can render safely for an
 * all-zero profile.
 */
export function categoryBreakdown(result: FootprintResult): CategoryShare[] {
  const total = result.totalKg;
  return CATEGORY_KEYS.map((key) => {
    const kg = result.categories[key];
    const percent = total > 0 ? round((kg / total) * 100, 1) : 0;
    return { key, kg, percent };
  }).sort((a, b) => b.kg - a.kg);
}
