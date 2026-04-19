import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Btn from '../Btn';

describe('Btn Component', () => {
  it('renders correctly with title', () => {
    render(<Btn title="Submit" />);
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });

  it('shows loading spinner when loading is true', () => {
    const { container } = render(<Btn title="Submit" loading={true} />);
    expect(screen.queryByText('Submit')).not.toBeInTheDocument();
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    render(<Btn title="Click Me" onClick={handleClick} />);
    
    const button = screen.getByRole('button');
    await user.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Btn title="Disabled" disabled={true} />);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
