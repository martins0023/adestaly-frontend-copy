import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from '../Input';

describe('Input Component', () => {
  it('renders correctly', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('shows error state correctly', () => {
    render(<Input placeholder="Error input" error hint="Invalid input" />);
    expect(screen.getByText('Invalid input')).toBeInTheDocument();
    expect(screen.getByText('Invalid input')).toHaveClass('text-red-500');
  });

  it('toggles password visibility', async () => {
    const user = userEvent.setup();
    render(<Input type="password" placeholder="Password" />);
    
    const input = screen.getByPlaceholderText('Password');
    expect(input).toHaveAttribute('type', 'password');
    
    const toggleButton = screen.getByRole('button', { name: /show password/i });
    await user.click(toggleButton);
    
    expect(input).toHaveAttribute('type', 'text');
    
    const toggleButtonHide = screen.getByRole('button', { name: /hide password/i });
    await user.click(toggleButtonHide);
    
    expect(input).toHaveAttribute('type', 'password');
  });
});
