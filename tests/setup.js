import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock console methods to reduce noise in tests (optional)
global.console = {
  ...console,
  // Uncomment to suppress console output in tests:
  // error: vi.fn(),
  // warn: vi.fn(),
}
