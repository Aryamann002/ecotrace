import type { JSX } from 'react';
import { Card, Icon, type IconName } from '@/components/ui';

const STEPS: ReadonlyArray<{ icon: IconName; title: string; body: string }> = [
  {
    icon: 'spark',
    title: 'Answer a few questions',
    body: 'A short, six-step questionnaire about how you travel, power your home, eat, and shop. Takes about two minutes.',
  },
  {
    icon: 'chart',
    title: 'See where it comes from',
    body: 'Your annual footprint, broken down by category and compared against benchmarks and a science-based target.',
  },
  {
    icon: 'target',
    title: 'Act on what matters',
    body: 'Personalized, ranked actions estimate the kilograms each change saves, so you start with the biggest wins.',
  },
];

/** Numbered three-step overview of the questionnaire → insight → action flow. */
export function HowItWorks(): JSX.Element {
  return (
    <section aria-labelledby="how-heading" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h2 id="how-heading" className="font-display text-3xl font-bold text-ink">
          How it works
        </h2>
        <p className="mt-3 text-ink/70">Three steps from a quick questionnaire to a clear plan.</p>
      </div>
      <ol className="mt-12 grid gap-6 md:grid-cols-3">
        {STEPS.map((step, i) => (
          <Card as="li" key={step.title} className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon name={step.icon} size={24} />
              </span>
              <span className="font-display text-2xl font-bold text-primary/40">{i + 1}</span>
            </div>
            <h3 className="font-display text-xl font-semibold text-ink">{step.title}</h3>
            <p className="text-ink/70">{step.body}</p>
          </Card>
        ))}
      </ol>
    </section>
  );
}
