import { describe, test, expect } from 'vitest'
import { calculateBankTotal, detectDoubles, shouldApplySevenRule } from '../../../src/lib/scoring'

describe('Scoring Logic', () => {
  describe('calculateBankTotal', () => {
    test('adds dice sum to current bank for normal roll', () => {
      const result = calculateBankTotal({
        currentBank: 20,
        diceSum: 5, // Use non-7 value for normal roll
        isDoubles: false,
        rollCount: 1,
        settings: { firstThreeRollsSevenRule: false },
      })

      expect(result.newBank).toBe(25) // 20 + 5 = 25
      expect(result.roundEnded).toBe(false)
    })

    test('doubles logic: just doubles the bank (dice value ignored)', () => {
      // Bank = 20, roll = any doubles after roll 3
      // Should be: 20 * 2 = 40
      const result = calculateBankTotal({
        currentBank: 20,
        diceSum: 8, // This value is ignored for doubles
        isDoubles: true,
        rollCount: 4, // After first 3 rolls, so doubles apply
        settings: { firstThreeRollsSevenRule: false },
      })

      expect(result.newBank).toBe(40)
      expect(result.roundEnded).toBe(false)
    })

    test('doubles in first 3 rolls only add sum, no doubling', () => {
      const result = calculateBankTotal({
        currentBank: 20,
        diceSum: 8,
        isDoubles: true,
        rollCount: 2, // Within first 3 rolls
        settings: { firstThreeRollsSevenRule: false },
      })

      expect(result.newBank).toBe(28) // Just 20 + 8, no doubling
      expect(result.roundEnded).toBe(false)
    })

    test('seven after first 3 rolls ends round', () => {
      const result = calculateBankTotal({
        currentBank: 50,
        diceSum: 7,
        isDoubles: false,
        rollCount: 4,
        settings: { firstThreeRollsSevenRule: false },
      })

      expect(result.newBank).toBe(50) // Bank unchanged
      expect(result.roundEnded).toBe(true)
      expect(result.sevenRolled).toBe(true)
    })

    test('seven in first 3 rolls adds 70 when rule enabled', () => {
      const result = calculateBankTotal({
        currentBank: 20,
        diceSum: 7,
        isDoubles: false,
        rollCount: 2,
        settings: { firstThreeRollsSevenRule: true },
      })

      expect(result.newBank).toBe(90) // 20 + 70
      expect(result.roundEnded).toBe(false)
      expect(result.sevenRolled).toBe(false) // Doesn't count as round-ending 7
    })

    test('seven in first 3 rolls ends round when rule disabled', () => {
      const result = calculateBankTotal({
        currentBank: 20,
        diceSum: 7,
        isDoubles: false,
        rollCount: 2,
        settings: { firstThreeRollsSevenRule: false },
      })

      expect(result.newBank).toBe(20) // Bank unchanged
      expect(result.roundEnded).toBe(true)
      expect(result.sevenRolled).toBe(true)
    })

    test('seven exactly at roll 3 adds 70 when rule enabled', () => {
      const result = calculateBankTotal({
        currentBank: 30,
        diceSum: 7,
        isDoubles: false,
        rollCount: 3,
        settings: { firstThreeRollsSevenRule: true },
      })

      expect(result.newBank).toBe(100) // 30 + 70
      expect(result.roundEnded).toBe(false)
    })

    test('seven at roll 4 ends round even with rule enabled', () => {
      const result = calculateBankTotal({
        currentBank: 50,
        diceSum: 7,
        isDoubles: false,
        rollCount: 4,
        settings: { firstThreeRollsSevenRule: true },
      })

      expect(result.newBank).toBe(50)
      expect(result.roundEnded).toBe(true)
      expect(result.sevenRolled).toBe(true)
    })

    test('handles edge case: doubles on first roll', () => {
      const result = calculateBankTotal({
        currentBank: 0,
        diceSum: 12, // 6+6
        isDoubles: true,
        rollCount: 1,
        settings: { firstThreeRollsSevenRule: false },
      })

      expect(result.newBank).toBe(12) // Just adds sum, no doubling in first 3
      expect(result.roundEnded).toBe(false)
    })

    test('handles edge case: bank starts at 0', () => {
      const result = calculateBankTotal({
        currentBank: 0,
        diceSum: 5,
        isDoubles: false,
        rollCount: 1,
        settings: { firstThreeRollsSevenRule: false },
      })

      expect(result.newBank).toBe(5)
      expect(result.roundEnded).toBe(false)
    })

    test('handles large bank totals correctly', () => {
      const result = calculateBankTotal({
        currentBank: 200,
        diceSum: 10, // Ignored for doubles
        isDoubles: true,
        rollCount: 5,
        settings: { firstThreeRollsSevenRule: false },
      })

      expect(result.newBank).toBe(400) // 200 * 2
      expect(result.roundEnded).toBe(false)
    })
  })

  describe('detectDoubles', () => {
    test('detects doubles correctly', () => {
      expect(detectDoubles(2, 2)).toBe(true)
      expect(detectDoubles(3, 3)).toBe(true)
      expect(detectDoubles(6, 6)).toBe(true)
    })

    test('returns false for non-doubles', () => {
      expect(detectDoubles(1, 2)).toBe(false)
      expect(detectDoubles(3, 5)).toBe(false)
      expect(detectDoubles(4, 6)).toBe(false)
    })

    test('validates dice values are in range 1-6', () => {
      expect(() => detectDoubles(0, 3)).toThrow()
      expect(() => detectDoubles(5, 7)).toThrow()
      expect(() => detectDoubles(-1, 4)).toThrow()
    })
  })

  describe('shouldApplySevenRule', () => {
    test('returns true for first 3 rolls when rule enabled', () => {
      expect(shouldApplySevenRule(1, true)).toBe(true)
      expect(shouldApplySevenRule(2, true)).toBe(true)
      expect(shouldApplySevenRule(3, true)).toBe(true)
    })

    test('returns false after roll 3 even when rule enabled', () => {
      expect(shouldApplySevenRule(4, true)).toBe(false)
      expect(shouldApplySevenRule(5, true)).toBe(false)
      expect(shouldApplySevenRule(10, true)).toBe(false)
    })

    test('returns false when rule disabled regardless of roll count', () => {
      expect(shouldApplySevenRule(1, false)).toBe(false)
      expect(shouldApplySevenRule(2, false)).toBe(false)
      expect(shouldApplySevenRule(3, false)).toBe(false)
      expect(shouldApplySevenRule(4, false)).toBe(false)
    })
  })
})
