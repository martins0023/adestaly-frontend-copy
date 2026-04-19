import { render, screen, waitFor, act } from '@testing-library/react';
import { AppContextProvider, useAppContext } from '../AppContextProvider';
import axiosClient from '../../config/client';

jest.mock('../../config/client', () => ({
  post: jest.fn(),
  get: jest.fn(),
  patch: jest.fn(),
  put: jest.fn(),
}));

jest.mock('../../config/session', () => ({
  createSession: jest.fn(),
  deleteSession: jest.fn(),
  readSessionPayload: jest.fn().mockResolvedValue(null),
}));

const TestComponent = () => {
  const { loginUser, loading, verifyEmail } = useAppContext();
  return (
    <div>
      <button onClick={() => loginUser('test@test.com', 'password')}>Login</button>
      <button onClick={() => verifyEmail('123', 'code')}>Verify</button>
      {loading.login && <span data-testid="loading">Loading...</span>}
    </div>
  );
};

describe('AppContextProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes context without crashing', () => {
    expect(() => render(
      <AppContextProvider>
        <div>Test</div>
      </AppContextProvider>
    )).not.toThrow();
  });

  it('handles login flow and loading state', async () => {
    const mockPost = axiosClient.post as jest.Mock;
    mockPost.mockResolvedValueOnce({
      status: 200,
      data: { success: true, api_access_token: 'token', details: { firstname: 'John' } }
    });

    render(
      <AppContextProvider>
        <TestComponent />
      </AppContextProvider>
    );

    const button = screen.getByText('Login');
    
    act(() => {
      button.click();
    });

    expect(screen.getByTestId('loading')).toBeInTheDocument();

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith(
        '/api/auth/login', 
        { email: 'test@test.com', password: 'password' }, 
        expect.objectContaining({ withCredentials: true })
      );
    });
  });
});
