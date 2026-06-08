/**
 * Minimal className combiner.
 *
 * Joins truthy class fragments with a single space. Intentionally tiny — we avoid
 * pulling in `clsx`/`classnames` to keep the bundle and dependency surface small.
 * Later fragments win at the source level; we do not attempt Tailwind conflict
 * resolution, so order class names so the intended utility comes last.
 */
export type ClassValue = string | number | false | null | undefined;

export function cn(...values: ClassValue[]): string {
  return values.filter((v): v is string | number => Boolean(v)).join(' ');
}
