import { describe, test, expect } from 'vitest'
import { bankPlayer, canPlayerBank, updatePlayerStats } from '../../../src/lib/banking'
import { createMockPlayer, createMockGameState } from '../../helpers/testHelpers'

describe('Banking Logic', () => {
  describe('canPlayerBank', () => {
    test('player can bank when not yet banked in round', () => {
      const player = createMockPlayer({
        id: 'player-1',
        bankedThisRound: false,
      })

      expect(canPlayerBank(player)).toBe(true)
    })

    test('player cannot bank when already banked in round', () => {
      const player = createMockPlayer({
        id: 'player-1',
        bankedThisRound: true,
      })

      expect(canPlayerBank(player)).toBe(false)
    })

    test('player cannot bank when bank total is 0', () => {
      const player = createMockPlayer({ bankedThisRound: false })
      const bankTotal = 0

      expect(canPlayerBank(player, bankTotal)).toBe(false)
    })

    test('player can bank when bank total is positive', () => {
      const player = createMockPlayer({ bankedThisRound: false })
      const bankTotal = 50

      expect(canPlayerBank(player, bankTotal)).toBe(true)
    })
  })

  describe('bankPlayer', () => {
    test('adds bank total to player score', () => {
      const player = createMockPlayer({
        id: 'player-1',
        totalScore: 100,
        bankedThisRound: false,
      })
      const bankTotal = 50

      const result = bankPlayer(player, bankTotal)

      expect(result.totalScore).toBe(150)
    })

    test('marks player as banked this round', () => {
      const player = createMockPlayer({
        id: 'player-1',
        bankedThisRound: false,
      })
      const bankTotal = 50

      const result = bankPlayer(player, bankTotal)

      expect(result.bankedThisRound).toBe(true)
    })

    test('increments banks count', () => {
      const player = createMockPlayer({
        id: 'player-1',
        banksCount: 5,
      })
      const bankTotal = 50

      const result = bankPlayer(player, bankTotal)

      expect(result.banksCount).toBe(6)
    })

    test('updates biggest bank when current bank is larger', () => {
      const player = createMockPlayer({
        id: 'player-1',
        biggestBank: 40,
      })
      const bankTotal = 75

      const result = bankPlayer(player, bankTotal)

      expect(result.biggestBank).toBe(75)
    })

    test('keeps biggest bank when current bank is smaller', () => {
      const player = createMockPlayer({
        id: 'player-1',
        biggestBank: 100,
      })
      const bankTotal = 50

      const result = bankPlayer(player, bankTotal)

      expect(result.biggestBank).toBe(100)
    })

    test('returns new player object (immutable)', () => {
      const player = createMockPlayer({
        id: 'player-1',
        totalScore: 100,
      })
      const bankTotal = 50

      const result = bankPlayer(player, bankTotal)

      expect(result).not.toBe(player) // Different object reference
      expect(player.totalScore).toBe(100) // Original unchanged
    })

    test('throws error when player already banked', () => {
      const player = createMockPlayer({
        id: 'player-1',
        bankedThisRound: true,
      })
      const bankTotal = 50

      expect(() => bankPlayer(player, bankTotal)).toThrow(
        'Player player-1 has already banked this round'
      )
    })

    test('throws error when bank total is 0 or negative', () => {
      const player = createMockPlayer({ id: 'player-1' })

      expect(() => bankPlayer(player, 0)).toThrow('Bank total must be positive')
      expect(() => bankPlayer(player, -10)).toThrow('Bank total must be positive')
    })

    test('handles first bank correctly (biggestBank starts at 0)', () => {
      const player = createMockPlayer({
        id: 'player-1',
        totalScore: 0,
        banksCount: 0,
        biggestBank: 0,
      })
      const bankTotal = 25

      const result = bankPlayer(player, bankTotal)

      expect(result.totalScore).toBe(25)
      expect(result.banksCount).toBe(1)
      expect(result.biggestBank).toBe(25)
      expect(result.bankedThisRound).toBe(true)
    })
  })

  describe('updatePlayerStats', () => {
    test('updates streak count when banking consecutively', () => {
      const player = createMockPlayer({
        id: 'player-1',
        streakCount: 2, // Currently on a 2-round streak
      })
      const bankedSuccessfully = true

      const result = updatePlayerStats(player, bankedSuccessfully)

      expect(result.streakCount).toBe(3)
    })

    test('resets streak count when not banking', () => {
      const player = createMockPlayer({
        id: 'player-1',
        streakCount: 5,
      })
      const bankedSuccessfully = false

      const result = updatePlayerStats(player, bankedSuccessfully)

      expect(result.streakCount).toBe(0)
    })

    test('starts streak at 1 for first successful bank', () => {
      const player = createMockPlayer({
        id: 'player-1',
        streakCount: 0,
      })
      const bankedSuccessfully = true

      const result = updatePlayerStats(player, bankedSuccessfully)

      expect(result.streakCount).toBe(1)
    })

    test('returns new player object (immutable)', () => {
      const player = createMockPlayer({
        id: 'player-1',
        streakCount: 2,
      })

      const result = updatePlayerStats(player, true)

      expect(result).not.toBe(player)
      expect(player.streakCount).toBe(2) // Original unchanged
    })
  })

  describe('Integration: Banking workflow', () => {
    test('complete banking flow for a player', () => {
      // Setup: Player with some existing stats
      const player = createMockPlayer({
        id: 'player-1',
        name: 'Alice',
        totalScore: 75,
        banksCount: 3,
        biggestBank: 60,
        streakCount: 2,
        bankedThisRound: false,
      })
      const bankTotal = 85

      // Step 1: Check if player can bank
      expect(canPlayerBank(player, bankTotal)).toBe(true)

      // Step 2: Bank the player
      const bankedPlayer = bankPlayer(player, bankTotal)

      // Verify banking worked
      expect(bankedPlayer.totalScore).toBe(160) // 75 + 85
      expect(bankedPlayer.bankedThisRound).toBe(true)
      expect(bankedPlayer.banksCount).toBe(4)
      expect(bankedPlayer.biggestBank).toBe(85) // New record

      // Step 3: Update streak stats
      const finalPlayer = updatePlayerStats(bankedPlayer, true)

      expect(finalPlayer.streakCount).toBe(3) // Streak continues

      // Step 4: Verify can't bank again
      expect(canPlayerBank(finalPlayer, bankTotal)).toBe(false)
    })

    test('player fails to bank when 7 is rolled', () => {
      const player = createMockPlayer({
        id: 'player-1',
        streakCount: 4, // Had a good streak going
        bankedThisRound: false,
      })

      // 7 was rolled, player didn't bank
      const finalPlayer = updatePlayerStats(player, false)

      expect(finalPlayer.streakCount).toBe(0) // Streak broken
      expect(finalPlayer.bankedThisRound).toBe(false) // Still not banked
    })
  })
})
