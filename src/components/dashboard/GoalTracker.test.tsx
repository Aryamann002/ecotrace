import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GoalTracker } from './GoalTracker';

describe('GoalTracker', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('offers the set-goal form when no goal exists, with a suggested target', () => {
    render(<GoalTracker currentTonnes={10} />);
    expect(screen.getByRole('heading', { name: /set a reduction goal/i })).toBeInTheDocument();
    // Suggested target is a 20% cut: 10 → 8.
    expect(screen.getByLabelText(/annual target/i)).toHaveValue(8);
  });

  it('floors the suggested target at the 1.5°C-aligned value', () => {
    render(<GoalTracker currentTonnes={2.5} />);
    // 2.5 * 0.8 = 2.0 would undercut the 2.3 t science-based target.
    expect(screen.getByLabelText(/annual target/i)).toHaveValue(2.3);
  });

  it('sets a goal and shows progress against it', async () => {
    const user = userEvent.setup();
    render(<GoalTracker currentTonnes={10} />);

    await user.click(screen.getByRole('button', { name: /set goal/i }));

    expect(screen.getByRole('heading', { name: /your reduction goal/i })).toBeInTheDocument();
    expect(screen.getByText('Baseline')).toBeInTheDocument();
    expect(screen.getByText('Target')).toBeInTheDocument();
    // Fresh goal: no reduction yet.
    expect(screen.getByText(/0% there/i)).toBeInTheDocument();
  });

  it('rejects a target at or above the current footprint', async () => {
    const user = userEvent.setup();
    render(<GoalTracker currentTonnes={10} />);

    const field = screen.getByLabelText(/annual target/i);
    await user.clear(field);
    await user.type(field, '12');
    await user.click(screen.getByRole('button', { name: /set goal/i }));

    expect(screen.getByText(/should be below your current footprint/i)).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /your reduction goal/i })).not.toBeInTheDocument();
  });

  it('rejects a non-positive target', async () => {
    const user = userEvent.setup();
    render(<GoalTracker currentTonnes={10} />);

    const field = screen.getByLabelText(/annual target/i);
    await user.clear(field);
    await user.type(field, '0');
    await user.click(screen.getByRole('button', { name: /set goal/i }));

    expect(screen.getByText(/greater than zero/i)).toBeInTheDocument();
  });

  it('celebrates once the footprint reaches the target', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<GoalTracker currentTonnes={10} />);
    await user.click(screen.getByRole('button', { name: /set goal/i })); // target 8, baseline 10
    unmount();

    // Re-open the dashboard later with a footprint at the target.
    render(<GoalTracker currentTonnes={7.5} />);
    expect(await screen.findByText(/target reached/i)).toBeInTheDocument();
  });

  it('reset clears the goal and returns to the form', async () => {
    const user = userEvent.setup();
    render(<GoalTracker currentTonnes={10} />);

    await user.click(screen.getByRole('button', { name: /set goal/i }));
    await user.click(screen.getByRole('button', { name: /reset/i }));

    expect(screen.getByRole('heading', { name: /set a reduction goal/i })).toBeInTheDocument();
    expect(localStorage.getItem('ecotrace:goal')).toBeNull();
  });
});
