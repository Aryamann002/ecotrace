import type { JSX } from 'react';
import { Hero } from '@/components/home/Hero';
import { HowItWorks } from '@/components/home/HowItWorks';
import { TrustStrip } from '@/components/home/TrustStrip';
import { ClosingCta } from '@/components/home/ClosingCta';

/**
 * Landing page. Pure Server Component — no client JS ships for this route beyond
 * Next's runtime, keeping it fast (Efficiency axis). Each section is a focused,
 * single-purpose component; the single above-the-fold CTA drops the visitor
 * straight into the calculator.
 */
export default function HomePage(): JSX.Element {
  return (
    <main id="main">
      <Hero />
      <HowItWorks />
      <TrustStrip />
      <ClosingCta />
    </main>
  );
}
