import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CalculatorForm } from './CalculatorForm';
import { STEP_LABELS } from './useCalculatorForm';

const push = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));

describe('CalculatorForm', () => {
  beforeEach(() => {
    localStorage.clear();
    push.mockClear();
  });

  it('starts on the region step with Back disabled', () => {
    render(<CalculatorForm />);
    expect(screen.getByRole('heading', { name: 'Region' })).toBeInTheDocument();
    expect(screen.getByText(`Step 1 of ${STEP_LABELS.length}`)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /back/i })).toBeDisabled();
  });

  it('advances through steps and moves focus to the step heading', async () => {
    const user = userEvent.setup();
    render(<CalculatorForm />);

    await user.click(screen.getByRole('button', { name: /continue/i }));

    const heading = screen.getByRole('heading', { name: 'Transport' });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveFocus();
  });

  it('returns to the previous step via Back', async () => {
    const user = userEvent.setup();
    render(<CalculatorForm />);

    await user.click(screen.getByRole('button', { name: /continue/i }));
    await user.click(screen.getByRole('button', { name: /back/i }));

    expect(screen.getByRole('heading', { name: 'Region' })).toBeInTheDocument();
  });

  it('walks to the review step and submits to the dashboard', async () => {
    const user = userEvent.setup();
    render(<CalculatorForm />);

    // Defaults are valid for every step, so Continue advances cleanly.
    for (let i = 0; i < STEP_LABELS.length - 1; i += 1) {
      await user.click(screen.getByRole('button', { name: /continue|see my results/i }));
    }
    expect(screen.getByRole('heading', { name: /review your answers/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /see my results/i }));

    expect(push).toHaveBeenCalledWith('/dashboard');
    // Submission persists the answers and records a history point.
    expect(localStorage.getItem('ecotrace:input')).not.toBeNull();
    expect(localStorage.getItem('ecotrace:history')).not.toBeNull();
  });
});
