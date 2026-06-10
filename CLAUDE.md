# CLAUDE.md — EcoTrace

Guidance for Claude (and humans) working in this repo. **Read this first.**

## What this project is

**EcoTrace** is a Carbon Footprint Awareness Platform: a person answers a short questionnaire,
sees their annual CO₂e footprint broken down by category, compares it to benchmarks, gets ranked
reduction tips, and tracks a reduction goal over time. It is a competition entry judged on five
axes — **Code Quality, Security, Efficiency, Testing, Accessibility**.

It is **built, tested, and deployed** (live at https://ecotracex.vercel.app, repo
`Aryamann002/ecotrace`).

---

## 🎯 Current mission: raise Code Quality (currently 88/100)

The submission scored **Code Quality 88/100**. This session's only job is to push that higher
**without regressing** the other four axes. This is a **refactor pass, not a redesign** — visible
behaviour must not change.

### Guardrails (do not violate)

- **Behaviour stays identical.** Every existing test must stay green. When you extract or move
  logic, add/adjust tests so coverage doesn't drop.
- **Stay client-side only.** No backend, no secrets. Don't weaken the CSP or security headers in
  `next.config.ts` / `src/middleware.ts`. Keep all domain logic **pure** and in `src/lib`.
- **Baseline before touching anything:** run `npm run lint && npm run typecheck && npm run test &&
  npm run build` and confirm green, so you can prove no regression afterwards.
- **Small, atomic commits** using Conventional Commits (`refactor:`, `test:`, `chore:`). Re-run
  the four checks before each commit.

### Prioritised checklist (grounded in the current code)

Do **1–3 first** — highest reviewer-visible value, lowest risk — then 4–8.

1. **Kill duplication (DRY).** `round()` is copy-pasted in **three** files —
   `src/lib/calculator.ts`, `src/lib/tips-engine.ts`, `src/lib/goal.ts`. Extract a single
   `round(value, dp = 2)` into `src/lib/number.ts` and import it everywhere. Then sweep for other
   copy-paste (repeated Tailwind blocks, repeated mappers, etc.).
2. **One typed test factory.** `build(overrides)` is duplicated in `calculator.test.ts` and
   `tips-engine.test.ts` and typed as `Record<string, unknown>`. Extract a single **typed**
   `makeInput(partial)` into `src/test/factories.ts` (use a `DeepPartial<FootprintInput>` type),
   and reuse it across the suites. Strong types in tests count toward code quality too.
3. **Name the magic numbers.** Promote hardcoded literals to named constants — e.g. the `0.25`
   ("a quarter of car trips") and the `500` kg threshold in `tips-engine.ts`. A number in code
   should explain itself.
4. **Explicit boundaries.** Add explicit return types to every exported function; use
   `import type` for all type-only imports.
5. **Decompose big components.** Find them with
   `find src -name '*.tsx' | xargs wc -l | sort -rn | head`. Anything past ~150 lines, or doing
   more than one job, gets split into smaller `ui/` primitives or a custom hook. Components stay
   small, typed, single-responsibility.
6. **Let the linter enforce it** (so quality is mechanical, not manual) — add these rules, then fix
   the fallout: `@typescript-eslint/consistent-type-imports`, `import/order`,
   `no-duplicate-imports`, `@typescript-eslint/no-non-null-assertion`. Consider tsconfig
   `noPropertyAccessFromIndexSignature`.
7. **Document the public surface.** TSDoc on every exported `@/lib` function and every non-trivial
   component's props.
8. **Prune dead code.** Remove unused exports/vars; ensure each `index.ts` barrel re-exports only
   what's actually consumed.

### Already clean — don't "fix" these

No `any`, no `eslint-disable`, no `@ts-ignore`/`@ts-expect-error`, no stray `console.*`, no
`TODO`/`FIXME` in `src`. Keep it that way.

---

## Architecture (read before coding)

- **Next.js 15 App Router + TypeScript (strict).** Server Components by default; `'use client'`
  only where interactivity requires it (forms, charts, anything reading `localStorage`).
- **Client-side only.** No backend, no database, no secrets. All persistence is `localStorage` via
  `src/lib/storage.ts`. Keeping this property is what wins the Security axis.
- **All domain logic lives in `src/lib` and is pure.** The UI imports from `@/lib` and must **not**
  re-implement any calculation. Need a new computed value? Add a pure function **+ test** in
  `src/lib`, then consume it.

## The data contract — import everything from `@/lib`

The **Zod schemas in `src/lib/schemas.ts` are the single source of truth** for every shape; infer
types from them, never hand-write parallel interfaces.

```ts
calculateFootprint(input: FootprintInput): FootprintResult
heatingFactorFor(fuel: HeatingFuel, region: Region): number
generateTips(input, result, options?: { limit?: number }): Tip[]
compareToTarget(totalTonnes): TargetComparison
compareToAverage(totalTonnes, region): AverageComparison
// persistence (validated, SSR-guarded): saveInput/loadInput, saveGoal/loadGoal/clearGoal,
//   loadHistory/addHistoryEntry/clearHistory, isStorageAvailable
// formatting (locale-stable): formatCo2, formatTonnes, formatPercent, formatNumber
// also: breakdown.ts (category breakdown helpers), goal.ts (goal/progress math)
```

`FootprintResult`: `{ totalKg, totalTonnes, categories: {transport, home, food, consumption},
details: {car, transit, flights, electricity, heating} }` (all kg CO₂e).

## Design system — "Organic Biophilic"

Use the Tailwind tokens in `tailwind.config.ts` / `globals.css`, not raw hex: `primary #059669`,
`secondary #10B981`, `accent #0891B2`, `surface #ECFDF5`, `ink #064E3B`, `warning #FBBF24`.
`font-display` (Sora) for headings, `font-sans` (Inter) for body. Charts (Recharts) always ship an
accessible `<table>` alternative + aria summary, never rely on colour alone, and are dynamically
imported.

## Non-negotiables by judging criterion

- **Code Quality:** no `any`; pure logic in `src/lib`; small typed components; imports from `@/lib`;
  `npm run lint` and `npm run typecheck` stay clean; no duplication.
- **Security:** client-side; no secrets; don't weaken the CSP; never `dangerouslySetInnerHTML` with
  unsanitised input; treat `localStorage` as untrusted (handled in `storage.ts`).
- **Efficiency:** Server Components by default; dynamic-import charts; `next/image`; aim Lighthouse ≥ 95.
- **Testing:** keep the suite green and coverage thresholds (`vitest.config.ts`) met; add a test for
  every behaviour you touch.
- **Accessibility (WCAG 2.1 AA):** labelled inputs, `<fieldset>/<legend>`, errors via
  `aria-describedby` + `aria-live`, visible focus, full keyboard, ≥44px targets, skip link.

## Commands

```bash
npm install
npm run dev
npm run test            # unit tests
npm run test:coverage
npm run lint
npm run typecheck
npm run format
npm run build           # also runs in CI
```

## Conventions

- TypeScript strict; functional React components; **named exports** for components.
- Conventional Commits (`feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`).
- Co-locate unit tests as `*.test.ts(x)` next to the source.
- No new runtime dependencies without a clear reason — every dependency is attack surface and bundle weight.

## File map

```
src/
  app/         layout.tsx, page.tsx, globals.css, calculator/page.tsx, dashboard/page.tsx
  components/  ui/  calculator/ (+ steps/)  charts/  dashboard/  layout/
  lib/         emission-factors, schemas, calculator, comparisons, tips-engine,
               breakdown, goal, storage, format, cn, index   (+ *.test.ts)
  test/        setup.ts            (add factories.ts for the shared test factory)
  middleware.ts  per-request CSP nonce
```

See `METHODOLOGY.md` for emission-factor sourcing and `SECURITY.md` for the security model.
