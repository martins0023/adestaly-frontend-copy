import '@testing-library/jest-dom'

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock Next.js router
jest.mock('next/navigation', () => {
  return {
    __esModule: true,
    usePathname: () => '',
    useRouter: () => ({
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
    }),
    useSearchParams: () => ({
      get: () => {},
    }),
    useServerInsertedHTML: jest.fn(),
  }
})
