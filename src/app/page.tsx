import { ButtonLink, Card, Icon } from '@/components/ui';
import type { IconName } from '@/components/ui';
import { TARGET_TONNES } from '@/lib';

/**
 * Landing page. Pure Server Component — no client JS ships for this route beyond
 * Next's runtime, keeping it fast (Efficiency axis). The single above-the-fold CTA
 * drops the visitor straight into the calculator.
 */

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

export default function HomePage() {
  return (
    <main id="main">
      {/* Hero */}
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

      {/* How it works */}
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

      {/* Trust strip */}
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

      {/* Closing CTA — an inverted (primary) surface, so it is styled directly
          rather than via Card, whose default white background would otherwise
          hide the white heading. */}
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
    </main>
  );
}
