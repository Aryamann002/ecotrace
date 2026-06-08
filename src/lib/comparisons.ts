import { PER_CAPITA_AVERAGE_TONNES, TARGET_TONNES } from './emission-factors';
import type { Region } from './emission-factors';

export type ComparisonStatus = 'below' | 'near' | 'above';

export interface TargetComparison {
  /** The 1.5 °C-aligned personal target, tonnes CO₂e. */
  target: number;
  /** Difference from target, tonnes (positive means over target). */
  deltaTonnes: number;
  /** Ratio of footprint to target (1 = exactly on target). */
  ratio: number;
  status: ComparisonStatus;
}

/** Compare an annual footprint (tonnes) against the 1.5 °C personal target. */
export function compareToTarget(totalTonnes: number): TargetComparison {
  const deltaTonnes = totalTonnes - TARGET_TONNES;
  const ratio = totalTonnes / TARGET_TONNES;
  let status: ComparisonStatus;
  if (ratio <= 1) status = 'below';
  else if (ratio <= 1.1) status = 'near';
  else status = 'above';
  return {
    target: TARGET_TONNES,
    deltaTonnes: Math.round(deltaTonnes * 100) / 100,
    ratio: Math.round(ratio * 100) / 100,
    status,
  };
}

export interface AverageComparison {
  /** Regional per-capita average, tonnes CO₂e. */
  average: number;
  /** Footprint as a percentage of the regional average (100 = exactly average). */
  percentOfAverage: number;
  status: ComparisonStatus;
}

/** Compare an annual footprint (tonnes) against the regional per-capita average. */
export function compareToAverage(totalTonnes: number, region: Region): AverageComparison {
  const average = PER_CAPITA_AVERAGE_TONNES[region];
  const percentOfAverage = Math.round((totalTonnes / average) * 100);
  let status: ComparisonStatus;
  if (percentOfAverage < 95) status = 'below';
  else if (percentOfAverage <= 105) status = 'near';
  else status = 'above';
  return { average, percentOfAverage, status };
}
