import type { JSX } from 'react';
import { Icon, type IconName } from '@/components/ui';

const TRUST: ReadonlyArray<{ icon: IconName; title: string; body: string }> = [
  {
    icon: 'shield',
    title: 'Private by design',
    body: 'Everything runs in your browser. Your answers are stored only on your device — never uploaded.',
  },
  {
    icon: 'globe',
    title: 'Transparent method',
    body: 'Built on published emission factors from DEFRA, the US EPA, the IEA, and peer-reviewed research.',
  },
  {
    icon: 'leaf',
    title: 'Built for action',
    body: 'Designed to turn awareness into a concrete, trackable reduction goal you can return to over time.',
  },
];

/** Why-trust-us strip: privacy, methodology, and actionability claims. */
export function TrustStrip(): JSX.Element {
  return (
    <section aria-labelledby="trust-heading" className="bg-white/40 py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 id="trust-heading" className="text-center font-display text-3xl font-bold text-ink">
          Why you can trust the numbers
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {TRUST.map((item) => (
            <div key={item.title} className="flex gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                <Icon name={item.icon} size={22} />
              </span>
              <div>
                <h3 className="font-semibold text-ink">{item.title}</h3>
                <p className="mt-1 text-sm text-ink/70">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-10 text-center text-sm text-ink/60">
          Full sourcing and caveats are documented in the project&apos;s{' '}
          <span className="font-medium text-ink">methodology</span>.
        </p>
      </div>
    </section>
  );
}
