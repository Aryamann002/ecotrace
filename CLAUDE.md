# CLAUDE.md — EcoTrace

Guidance for Claude Code (and humans) working in this repo. Read this first.

## What this project is

**EcoTrace** is a Carbon Footprint Awareness Platform: a person answers a short
questionnaire, sees their annual CO₂e footprint broken down by category, compares it to
benchmarks, gets ranked reduction tips, and tracks a reduction goal over time.

It is a competition entry judged on five axes — **Code Quality, Security, Efficiency,
Testing, Accessibility** — so every change should defend those. Deliverables: a public
GitHub repo, a live Vercel deployment, and a LinkedIn build post.

## Current status

**DONE — the logic core ("backend") and tooling:**

- Full calculation engine, tips engine, comparisons, safe storage, formatting (`src/lib/`)
- Zod schemas as the single source of truth for all data shapes
- Comprehensive Vitest unit tests (run `npm run test`)
- Strict TypeScript, ESLint, Prettier, security headers, GitHub Actions CI
- Design tokens + a minimal runnable placeholder page

**TODO — the frontend (your job):**

- Hero / landing page (expand `src/app/page.tsx`)
- `/calculator` — multi-step form bound to `footprintInputSchema`
- `/dashboard` — results, comparison cards, charts, tips, goal tracking, history trend
- Reusable components, charts, and the accompanying component/E2E/a11y tests

## Architecture (read before coding)

- **Next.js 15 App Router + TypeScript (strict).** Prefer Server Components; add
  `'use client'` only where interactivity requires it (forms, charts, anything reading
  `localStorage`).
- **Client-side only.** No backend, no database, no secrets. All persistence is
  `localStorage` via `src/lib/storage.ts`. Do not add a server, API route that stores
  data, or any secret. Keeping this property is what wins the Security axis.
- **All domain logic already lives in `src/lib` and is pure.** The UI must import from
  `@/lib` and must **not** re-implement any calculation. If you need a new computed value,
  add a pure function + test in `src/lib`, then consume it.

## The data contract — import everything from `@/lib`

```ts
// Core
calculateFootprint(input: FootprintInput): FootprintResult
heatingFactorFor(fuel: HeatingFuel, region: Region): number
generateTips(input: FootprintInput, result: FootprintResult, options?: { limit?: number }): Tip[]
compareToTarget(totalTonnes: number): TargetComparison
compareToAverage(totalTonnes: number, region: Region): AverageComparison

// Persistence (safe, validated, SSR-guarded)
isStorageAvailable(): boolean
saveInput(input) / loadInput(): FootprintInput | null
saveGoal(goal) / loadGoal(): Goal | null / clearGoal()
loadHistory(): HistoryEntry[] / addHistoryEntry(entry) / clearHistory()

// Formatting (locale-stable)
formatCo2(kg) // "950 kg CO₂e" | "1.50 t CO₂e"
formatTonnes(t) / formatPercent(n) / formatNumber(n, decimals)

// Types & data
FootprintInput, FootprintResult, Tip, Effort, Goal, HistoryEntry,
Region, CarFuel, HeatingFuel, Diet, FoodWaste, Shopping, CategoryKey,
TargetComparison, AverageComparison, ComparisonStatus
footprintInputSchema, defaultFootprintInput, REGIONS, DIETS, /* …all enums */
```

`FootprintResult` shape: `{ totalKg, totalTonnes, categories: {transport, home, food,
consumption}, details: {car, transit, flights, electricity, heating} }` (all kg CO₂e).

**Form pattern:** keep form state, validate with `footprintInputSchema.safeParse` on
submit, show field errors from the Zod result, then `saveInput` + `calculateFootprint`.
Initialize state from `loadInput() ?? defaultFootprintInput`.

## Design system — "Organic Biophilic"

Tokens are defined in `tailwind.config.ts` and `src/app/globals.css`. Use the Tailwind
classes, not raw hex.

| Token | Class | Hex |
|---|---|---|
| Primary | `bg-primary` / `text-primary` | `#059669` |
| Secondary | `secondary` | `#10B981` |
| Accent (CTA) | `accent` | `#0891B2` |
| Surface (bg) | `surface` | `#ECFDF5` |
| Ink (text) | `text-ink` | `#064E3B` |
| Warning | `warning` | `#FBBF24` |

- **Fonts:** `font-display` (Sora) for headings, `font-sans` (Inter) for body — already
  wired via `next/font` in `layout.tsx`.
- **Feel:** rounded (`rounded-2xl`/`3xl`), soft shadows, generous spacing, organic.
- **Charts (Recharts):** trend over time → line/area; category breakdown → horizontal bar
  + donut; vs. target → radar. **Always** render an accessible `<table>` alternative and
  an `aria` text summary, and never rely on color alone (add labels/patterns).
  Dynamically `import()` chart components so the chart bundle stays out of the initial load.

## Non-negotiables by judging criterion

- **Code Quality:** no `any`; pure logic stays in `src/lib`; components small and typed;
  imports come from `@/lib`; `npm run lint` and `npm run typecheck` stay clean.
- **Security:** stays client-side; no secrets; don't weaken the CSP in `next.config.ts`;
  never `dangerouslySetInnerHTML` with unsanitized input; treat `localStorage` as untrusted
  (already handled in `storage.ts`).
- **Efficiency:** Server Components by default; dynamic-import charts; `next/image`;
  no unnecessary client state; aim Lighthouse ≥ 95.
- **Testing:** add a component test (React Testing Library) for every interactive component
  and a Playwright + `@axe-core/playwright` E2E for the calculator→dashboard flow; keep
  coverage thresholds (see `vitest.config.ts`) green.
- **Accessibility (WCAG 2.1 AA):** labelled inputs (`<label htmlFor>`), `<fieldset>/<legend>`
  for groups, errors via `aria-describedby` + `aria-live`, visible focus rings, full keyboard
  operation, ≥44px targets, contrast ≥ 4.5:1 (the palette passes), and a skip link (present).

## Commands

```bash
npm install          # first time
npm run dev          # local dev server
npm run test         # unit tests
npm run test:coverage
npm run lint
npm run typecheck
npm run format       # prettier --write
npm run build        # production build (also runs in CI)
```

## Conventions

- TypeScript strict; functional React components; named exports for components.
- Commit style: Conventional Commits (`feat:`, `fix:`, `test:`, `docs:`, `chore:`).
- Co-locate unit tests as `*.test.ts(x)` next to the source.
- Don't introduce new runtime dependencies without a clear reason — every dependency is
  attack surface and bundle weight.

## File map

```
src/
  app/        layout.tsx, page.tsx, globals.css  (+ calculator/, dashboard/ to build)
  lib/        emission-factors, schemas, calculator, comparisons,
              tips-engine, storage, format, index  (+ *.test.ts)
  test/       setup.ts (jest-dom matchers)
next.config.ts  security headers • tailwind.config.ts  tokens • vitest.config.ts  tests
```

See `METHODOLOGY.md` for emission-factor sourcing and `SECURITY.md` for the security model.
