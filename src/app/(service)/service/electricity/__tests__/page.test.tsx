import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Electricity from '../page';

// Mock dependencies
jest.mock('@/src/context/AppContextProvider', () => ({
  useAppContext: () => ({
    getBillServices: jest.fn().mockResolvedValue({ success: true, data: [{ serviceID: 'ikeja', name: 'Ikeja Electric' }] }),
    getDataPlans: jest.fn().mockResolvedValue({ success: true, data: { content: { variations: [{ variation_code: 'prepaid', name: 'Prepaid' }] } } }),
    verifyBillerCode: jest.fn().mockResolvedValue({ success: true, data: { Customer_Name: 'John Doe' } }),
    initializeBillPayment: jest.fn().mockResolvedValue({ success: true, data: { payment_url: 'http://pay.com' } }),
    loading: { service: false, payment: false },
  }),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock('@/src/config/session', () => ({
  readSessionPayload: jest.fn().mockResolvedValue({ email: 'test@test.com' }),
}));

describe('Electricity Page', () => {
  it('renders correctly', async () => {
    await act(async () => {
      render(<Electricity />);
    });
    
    expect(screen.getByPlaceholderText('Meter Number')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Amount to Pay')).toBeInTheDocument();
  });
});
