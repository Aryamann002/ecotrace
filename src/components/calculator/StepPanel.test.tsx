import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { defaultFootprintInput } from '@/lib';
import { StepPanel } from './StepPanel';
import { LAST_STEP } from './useCalculatorForm';

function renderStep(step: number): void {
  render(<StepPanel step={step} input={defaultFootprintInput} errors={{}} onUpdate={vi.fn()} />);
}

describe('StepPanel', () => {
  it('renders the region question on step 0', () => {
    renderStep(0);
    expect(screen.getByText(/where do you live\?/i)).toBeInTheDocument();
  });

  it('renders transport fields on step 1', () => {
    renderStep(1);
    expect(screen.getByText(/what do you drive\?/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/long-haul flights/i)).toBeInTheDocument();
  });

  it('renders home-energy fields on step 2', () => {
    renderStep(2);
    expect(screen.getByLabelText(/how is your home heated\?/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/household size/i)).toBeInTheDocument();
  });

  it('renders diet fields on step 3', () => {
    renderStep(3);
    expect(screen.getByText(/which best describes your diet\?/i)).toBeInTheDocument();
  });

  it('renders consumption fields on step 4', () => {
    renderStep(4);
    expect(screen.getByText(/how much do you buy\?/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/i recycle consistently/i)).toBeInTheDocument();
  });

  it('renders the review summary on the last step', () => {
    renderStep(LAST_STEP);
    expect(screen.getByText(/estimated annual footprint/i)).toBeInTheDocument();
  });

  it('renders nothing for an unknown step', () => {
    const { container } = render(
      <StepPanel step={99} input={defaultFootprintInput} errors={{}} onUpdate={vi.fn()} />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
