import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BalanceDashboard from '../BalanceDashboard';

describe('BalanceDashboard', () => {
  it('renders correctly with hidden balance initially', () => {
    render(<BalanceDashboard />);
    expect(screen.getByText('Total Balance')).toBeInTheDocument();
    expect(screen.getByText('••••')).toBeInTheDocument();
    expect(screen.queryByText('0.00')).not.toBeInTheDocument();
  });

  it('toggles balance visibility', async () => {
    const user = userEvent.setup();
    render(<BalanceDashboard />);
    
    const toggleButton = screen.getByRole('button', { name: /show balance/i });
    await user.click(toggleButton);
    
    expect(screen.getByText('0.00')).toBeInTheDocument();
    expect(screen.queryByText('••••')).not.toBeInTheDocument();
    
    const toggleHideButton = screen.getByRole('button', { name: /hide balance/i });
    await user.click(toggleHideButton);
    
    expect(screen.getByText('••••')).toBeInTheDocument();
  });

  it('renders Fund button as disabled', () => {
    render(<BalanceDashboard />);
    const fundButton = screen.getByRole('button', { name: /fund/i });
    expect(fundButton).toBeInTheDocument();
    expect(fundButton).toBeDisabled();
  });
});
