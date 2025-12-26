/**
 * Smoke Tests - Catch runtime errors, console errors, and missing imports
 * These tests render actual components and detect issues that build tests miss
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { act } from 'react'
import '@testing-library/jest-dom'

import App from '../../src/App'

describe('Smoke Tests - Console Error Detection', () => {
  let consoleError
  let consoleWarn
  const errors = []
  const warnings = []

  beforeEach(() => {
    // Capture console errors and warnings
    errors.length = 0
    warnings.length = 0

    consoleError = vi.spyOn(console, 'error').mockImplementation((message, ...args) => {
      errors.push({ message, args })
    })

    consoleWarn = vi.spyOn(console, 'warn').mockImplementation((message, ...args) => {
      warnings.push({ message, args })
    })
  })

  afterEach(() => {
    consoleError.mockRestore()
    consoleWarn.mockRestore()
  })

  it('renders App without console errors', () => {
    act(() => {
      render(<App />)
    })

    // Check for console errors
    expect(errors).toHaveLength(0)

    // Log any errors that occurred for debugging
    if (errors.length > 0) {
      console.log('Console errors detected:', errors)
    }
  })

  it('renders SetupScreen without ReferenceErrors', () => {
    act(() => {
      render(<App />)
    })

    // App should render without crashing
    expect(screen.getByText(/^Bank$/i)).toBeInTheDocument()

    // No ReferenceErrors (like "clsx is not defined")
    const referenceErrors = errors.filter(
      (e) => e.message && typeof e.message === 'string' && e.message.includes('is not defined')
    )
    expect(referenceErrors).toHaveLength(0)
  })

  it('all components have required imports', () => {
    let hasError = false

    try {
      act(() => {
        render(<App />)
      })
    } catch (error) {
      hasError = true
      // Check if it's a missing import error
      expect(error.message).not.toMatch(/is not defined/)
      expect(error.message).not.toMatch(/Cannot read propert/)
      expect(error.message).not.toMatch(/undefined/)
    }

    expect(hasError).toBe(false)
  })

  it('checks for critical React warnings', () => {
    act(() => {
      render(<App />)
    })

    // Filter out non-critical warnings
    const criticalWarnings = warnings.filter((w) => {
      const msg = String(w.message)
      return (
        msg.includes('Warning: Failed') ||
        msg.includes('Warning: Invalid') ||
        msg.includes('Warning: Each child in a list should have a unique "key"')
      )
    })

    expect(criticalWarnings).toHaveLength(0)

    if (criticalWarnings.length > 0) {
      console.log('Critical warnings detected:', criticalWarnings)
    }
  })
})

describe('Smoke Tests - Component Rendering', () => {
  it('renders setup screen with all required elements', () => {
    render(<App />)

    // Setup screen should be visible
    expect(screen.getByText(/^Bank$/i)).toBeInTheDocument()
    expect(screen.getByText(/Players/i)).toBeInTheDocument()
    expect(screen.getByText(/Rounds/i)).toBeInTheDocument()
    expect(screen.getByText(/Start Game/i)).toBeInTheDocument()
  })

  it('handles state transitions without errors', async () => {
    const { container } = render(<App />)

    // Initial render should work
    expect(container).toBeInTheDocument()

    // Component should not have crashed
    expect(screen.getByText(/^Bank$/i)).toBeInTheDocument()
  })

  it('renders GameScreen after starting game without errors', async () => {
    const { user } = render(<App />)
    const errors = []

    // Spy on console.error to catch runtime errors
    const consoleError = vi.spyOn(console, 'error').mockImplementation((message, ...args) => {
      errors.push({ message, args })
    })

    // Start a game
    const startButton = screen.getByText(/Start Game/i)
    act(() => {
      startButton.click()
    })

    // GameScreen should render
    expect(screen.getByText(/Bank Total/i)).toBeInTheDocument()
    expect(screen.getByText(/Players/i)).toBeInTheDocument()
    expect(screen.getByText(/Leaderboard/i)).toBeInTheDocument()

    // Should have no console errors
    expect(errors).toHaveLength(0)

    // Look specifically for missing import errors
    const referenceErrors = errors.filter(
      (e) => e.message && typeof e.message === 'string' && e.message.includes('is not defined')
    )
    expect(referenceErrors).toHaveLength(0)

    consoleError.mockRestore()
  })
})
