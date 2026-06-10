import type { JSX } from 'react';
import { ButtonLink, Icon } from '@/components/ui';
import { TARGET_TONNES } from '@/lib';

/** Above-the-fold hero: headline, value proposition, and the primary CTA. */
export function Hero(): JSX.Element {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/5 via-surface to-surface"
      />
      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary-dark">
            <Icon name="leaf" size={16} />
            Carbon footprint awareness
          </span>
          <h1 className="mt-6 font-display text-4xl font-bold tracking-tight text-ink sm:text-6xl">
            Understand, track, and reduce your carbon footprint.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink/80">
            Estimate your annual CO₂e in two minutes, see exactly where it comes from, and get
            personalized, high-impact actions — all privately, in your browser.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink href="/calculator" size="lg">
              Calculate your footprint
              <Icon name="arrow-right" size={20} />
            </ButtonLink>
            <ButtonLink href="/dashboard" size="lg" variant="secondary">
              View your dashboard
            </ButtonLink>
          </div>
          <p className="mt-4 text-sm text-ink/60">
            Free · No sign-up · Aligned to a {TARGET_TONNES}t&nbsp;CO₂e science-based target
          </p>
        </div>
      </div>
    </section>
  );
}
