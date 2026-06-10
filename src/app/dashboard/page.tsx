import type { JSX } from 'react';
import type { Metadata } from 'next';
import { DashboardLoader } from '@/components/dashboard/DashboardLoader';

export const metadata: Metadata = {
  title: 'Your results — EcoTrace',
  description:
    'Your annual carbon footprint broken down by category, compared with benchmarks, with ranked reduction tips and goal tracking.',
};

/**
 * Dashboard route. A thin Server Component shell around the interactive client
 * loader, which reads the saved answers from localStorage and renders the results.
 */
export default function DashboardPage(): JSX.Element {
  return (
    <main id="main" className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">Your results</h1>
        <p className="mt-2 text-ink/70">
          Here&apos;s your estimated annual footprint, how it compares, and where to focus next.
        </p>
      </header>
      <DashboardLoader />
    </main>
  );
}
