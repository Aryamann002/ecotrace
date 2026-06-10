import type { JSX } from 'react';
import { Icon } from '@/components/ui';

/**
 * Site footer with a methodology/transparency note. Static Server Component.
 * Links are same-origin only, keeping the strict CSP intact.
 */
export function SiteFooter(): JSX.Element {
  return (
    <footer className="mt-20 border-t border-primary/10 bg-white/50">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
              <Icon name="leaf" size={18} />
            </span>
            <span className="font-display font-semibold text-ink">EcoTrace</span>
          </div>
          <p className="max-w-md text-sm text-ink/60">
            Estimates are for awareness and relative comparison, not audit-grade carbon accounting.
            Your data stays on your device — nothing is sent to a server.
          </p>
        </div>
        <p className="mt-6 text-xs text-ink/50">
          © {new Date().getFullYear()} EcoTrace · Main Challenge 3 of PromptWars Virtual ·{' '}
          <span className="text-ink/70">“Carbon Footprint Awareness Platform”</span>
        </p>
      </div>
    </footer>
  );
}
