import type { JSX } from 'react';
import { ButtonLink, Icon } from '@/components/ui';

/**
 * Closing call to action — an inverted (primary) surface, so it is styled
 * directly rather than via Card, whose default white background would
 * otherwise hide the white heading.
 */
export function ClosingCta(): JSX.Element {
  return (
    <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
      <div className="rounded-3xl bg-primary p-8 text-center text-white shadow-sm ring-1 ring-white/15 sm:p-10">
        <h2 className="font-display text-3xl font-bold">Ready to see your number?</h2>
        <p className="mx-auto mt-3 max-w-xl text-white/90">
          It takes about two minutes, and you can refine your answers any time.
        </p>
        <div className="mt-8 flex justify-center">
          <ButtonLink href="/calculator" size="lg" variant="secondary">
            Start the calculator
            <Icon name="arrow-right" size={20} />
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
