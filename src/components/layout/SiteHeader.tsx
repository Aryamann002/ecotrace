import type { JSX } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui';

/**
 * Top navigation. Plain Server Component — no client state needed. The two primary
 * destinations (Calculator, Dashboard) are always reachable; the brand returns home.
 */
export function SiteHeader(): JSX.Element {
  return (
    <header className="sticky top-0 z-40 border-b border-primary/10 bg-surface/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl px-1 font-display text-lg font-bold text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white">
            <Icon name="leaf" size={20} />
          </span>
          EcoTrace
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/calculator"
            className="rounded-xl px-3 py-2 text-sm font-medium text-ink/80 hover:bg-primary/10 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Calculator
          </Link>
          <Link
            href="/dashboard"
            className="rounded-xl px-3 py-2 text-sm font-medium text-ink/80 hover:bg-primary/10 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Dashboard
          </Link>
        </nav>
      </div>
    </header>
  );
}
