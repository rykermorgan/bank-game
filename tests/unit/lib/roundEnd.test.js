import { describe, test, expect } from 'vitest'
import {
  shouldEndRound,
  finalizeRound,
  resetRoundState,
  isGameComplete,
} from '../../../src/lib/roundEnd'
import { createMockPlayer, createMockGameState } from '../../helpers/testHelpers'

describe('Round End Logic', () => {
  describe('shouldEndRound', () => {
    test('round ends when 7 is rolled', () => {
      const players = [
        createMockPlayer({ id: 'p1', bankedThisRound: false }),
        createMockPlayer({ id: 'p2', bankedThisRound: false }),
      ]

      const result = shouldEndRound({
        sevenRolled: true,
        players,
      })

      expect(result.shouldEnd).toBe(true)
      expect(result.reason).toBe('seven_rolled')
    })

    test('round ends when all players have banked', () => {
      const players = [
        createMockPlayer({ id: 'p1', bankedThisRound: true }),
        createMockPlayer({ id: 'p2', bankedThisRound: true }),
        createMockPlayer({ id: 'p3', bankedThisRound: true }),
      ]

      const result = shouldEndRound({
        sevenRolled: false,
        players,
      })

      expect(result.shouldEnd).toBe(true)
      expect(result.reason).toBe('all_banked')
    })

    test('round does not end when some players have not banked', () => {
      const players = [
        createMockPlayer({ id: 'p1', bankedThisRound: true }),
        createMockPlayer({ id: 'p2', bankedThisRound: false }),
        createMockPlayer({ id: 'p3', bankedThisRound: true }),
      ]

      const result = shouldEndRound({
        sevenRolled: false,
        players,
      })

      expect(result.shouldEnd).toBe(false)
      expect(result.reason).toBeNull()
    })

    test('round does not end when no players have banked yet', () => {
      const players = [
        createMockPlayer({ id: 'p1', bankedThisRound: false }),
        createMockPlayer({ id: 'p2', bankedThisRound: false }),
      ]

      const result = shouldEndRound({
        sevenRolled: false,
        players,
      })

      expect(result.shouldEnd).toBe(false)
    })

    test('handles single player game - 7 rolled', () => {
      const players = [createMockPlayer({ id: 'p1', bankedThisRound: false })]

      const result = shouldEndRound({
        sevenRolled: true,
        players,
      })

      expect(result.shouldEnd).toBe(true)
      expect(result.reason).toBe('seven_rolled')
    })

    test('handles single player game - player banked', () => {
      const players = [createMockPlayer({ id: 'p1', bankedThisRound: true })]

      const result = shouldEndRound({
        sevenRolled: false,
        players,
      })

      expect(result.shouldEnd).toBe(true)
      expect(result.reason).toBe('all_banked')
    })
  })

  describe('finalizeRound', () => {
    test('unbanked players get 0 points when 7 rolled', () => {
      const players = [
        createMockPlayer({ id: 'p1', totalScore: 100, bankedThisRound: true }),
        createMockPlayer({ id: 'p2', totalScore: 50, bankedThisRound: false }),
        createMockPlayer({ id: 'p3', totalScore: 75, bankedThisRound: false }),
      ]

      const result = finalizeRound({
        players,
        reason: 'seven_rolled',
        bankTotal: 80,
      })

      // Banked player keeps score
      expect(result[0].totalScore).toBe(100)
      // Unbanked players keep their existing score (don't get bank total)
      expect(result[1].totalScore).toBe(50)
      expect(result[2].totalScore).toBe(75)
    })

    test('banked players keep their scores when 7 rolled', () => {
      const players = [
        createMockPlayer({ id: 'p1', totalScore: 150, bankedThisRound: true }),
        createMockPlayer({ id: 'p2', totalScore: 120, bankedThisRound: true }),
      ]

      const result = finalizeRound({
        players,
        reason: 'seven_rolled',
        bankTotal: 60,
      })

      expect(result[0].totalScore).toBe(150)
      expect(result[1].totalScore).toBe(120)
    })

    test('all players keep scores when all banked', () => {
      const players = [
        createMockPlayer({ id: 'p1', totalScore: 100, bankedThisRound: true }),
        createMockPlayer({ id: 'p2', totalScore: 85, bankedThisRound: true }),
      ]

      const result = finalizeRound({
        players,
        reason: 'all_banked',
        bankTotal: 0,
      })

      expect(result[0].totalScore).toBe(100)
      expect(result[1].totalScore).toBe(85)
    })

    test('updates streak stats when 7 rolled', () => {
      const players = [
        createMockPlayer({
          id: 'p1',
          streakCount: 3,
          bankedThisRound: true,
        }),
        createMockPlayer({
          id: 'p2',
          streakCount: 2,
          bankedThisRound: false, // Failed to bank
        }),
      ]

      const result = finalizeRound({
        players,
        reason: 'seven_rolled',
        bankTotal: 50,
      })

      expect(result[0].streakCount).toBe(4) // Streak continues
      expect(result[1].streakCount).toBe(0) // Streak broken
    })

    test('updates streak stats when all banked', () => {
      const players = [
        createMockPlayer({
          id: 'p1',
          streakCount: 1,
          bankedThisRound: true,
        }),
        createMockPlayer({
          id: 'p2',
          streakCount: 0,
          bankedThisRound: true,
        }),
      ]

      const result = finalizeRound({
        players,
        reason: 'all_banked',
        bankTotal: 0,
      })

      expect(result[0].streakCount).toBe(2)
      expect(result[1].streakCount).toBe(1)
    })

    test('returns new player objects (immutable)', () => {
      const players = [
        createMockPlayer({ id: 'p1', totalScore: 100, bankedThisRound: true }),
        createMockPlayer({ id: 'p2', totalScore: 50, bankedThisRound: false }),
      ]

      const result = finalizeRound({
        players,
        reason: 'seven_rolled',
        bankTotal: 80,
      })

      // Different object references
      expect(result[0]).not.toBe(players[0])
      expect(result[1]).not.toBe(players[1])

      // Originals unchanged
      expect(players[0].totalScore).toBe(100)
      expect(players[1].totalScore).toBe(50)
    })
  })

  describe('resetRoundState', () => {
    test('resets all players bankedThisRound to false', () => {
      const players = [
        createMockPlayer({ id: 'p1', bankedThisRound: true }),
        createMockPlayer({ id: 'p2', bankedThisRound: true }),
        createMockPlayer({ id: 'p3', bankedThisRound: false }),
      ]

      const result = resetRoundState(players)

      expect(result[0].bankedThisRound).toBe(false)
      expect(result[1].bankedThisRound).toBe(false)
      expect(result[2].bankedThisRound).toBe(false)
    })

    test('preserves all other player stats', () => {
      const players = [
        createMockPlayer({
          id: 'p1',
          name: 'Alice',
          totalScore: 150,
          banksCount: 5,
          biggestBank: 80,
          streakCount: 3,
          bankedThisRound: true,
        }),
      ]

      const result = resetRoundState(players)

      expect(result[0].id).toBe('p1')
      expect(result[0].name).toBe('Alice')
      expect(result[0].totalScore).toBe(150)
      expect(result[0].banksCount).toBe(5)
      expect(result[0].biggestBank).toBe(80)
      expect(result[0].streakCount).toBe(3)
      expect(result[0].bankedThisRound).toBe(false) // Only this changed
    })

    test('returns new player objects (immutable)', () => {
      const players = [createMockPlayer({ id: 'p1', bankedThisRound: true })]

      const result = resetRoundState(players)

      expect(result[0]).not.toBe(players[0])
      expect(players[0].bankedThisRound).toBe(true) // Original unchanged
    })
  })

  describe('isGameComplete', () => {
    test('game is complete when on final round', () => {
      const result = isGameComplete({
        currentRound: 10,
        totalRounds: 10,
      })

      expect(result).toBe(true)
    })

    test('game is not complete when rounds remain', () => {
      const result = isGameComplete({
        currentRound: 5,
        totalRounds: 10,
      })

      expect(result).toBe(false)
    })

    test('game is not complete on first round', () => {
      const result = isGameComplete({
        currentRound: 1,
        totalRounds: 15,
      })

      expect(result).toBe(false)
    })

    test('handles different total round counts', () => {
      expect(isGameComplete({ currentRound: 15, totalRounds: 15 })).toBe(true)
      expect(isGameComplete({ currentRound: 20, totalRounds: 20 })).toBe(true)
      expect(isGameComplete({ currentRound: 14, totalRounds: 15 })).toBe(false)
    })
  })

  describe('Integration: Complete round end workflow', () => {
    test('scenario: 7 rolled with mixed banking', () => {
      const players = [
        createMockPlayer({
          id: 'p1',
          name: 'Alice',
          totalScore: 100,
          bankedThisRound: true,
          streakCount: 2,
        }),
        createMockPlayer({
          id: 'p2',
          name: 'Bob',
          totalScore: 75,
          bankedThisRound: false,
          streakCount: 1,
        }),
        createMockPlayer({
          id: 'p3',
          name: 'Carol',
          totalScore: 50,
          bankedThisRound: true,
          streakCount: 0,
        }),
      ]

      // Step 1: Check if round should end
      const endCheck = shouldEndRound({
        sevenRolled: true,
        players,
      })

      expect(endCheck.shouldEnd).toBe(true)
      expect(endCheck.reason).toBe('seven_rolled')

      // Step 2: Finalize round
      const finalizedPlayers = finalizeRound({
        players,
        reason: endCheck.reason,
        bankTotal: 85,
      })

      // Alice banked: keeps score, streak continues
      expect(finalizedPlayers[0].totalScore).toBe(100)
      expect(finalizedPlayers[0].streakCount).toBe(3)

      // Bob didn't bank: keeps old score, streak broken
      expect(finalizedPlayers[1].totalScore).toBe(75)
      expect(finalizedPlayers[1].streakCount).toBe(0)

      // Carol banked: keeps score, streak continues
      expect(finalizedPlayers[2].totalScore).toBe(50)
      expect(finalizedPlayers[2].streakCount).toBe(1)

      // Step 3: Reset for next round
      const resetPlayers = resetRoundState(finalizedPlayers)

      expect(resetPlayers[0].bankedThisRound).toBe(false)
      expect(resetPlayers[1].bankedThisRound).toBe(false)
      expect(resetPlayers[2].bankedThisRound).toBe(false)

      // Scores preserved
      expect(resetPlayers[0].totalScore).toBe(100)
      expect(resetPlayers[1].totalScore).toBe(75)
      expect(resetPlayers[2].totalScore).toBe(50)
    })

    test('scenario: all players banked successfully', () => {
      const players = [
        createMockPlayer({
          id: 'p1',
          totalScore: 120,
          bankedThisRound: true,
          streakCount: 1,
        }),
        createMockPlayer({
          id: 'p2',
          totalScore: 95,
          bankedThisRound: true,
          streakCount: 0,
        }),
      ]

      // Check if round ends
      const endCheck = shouldEndRound({
        sevenRolled: false,
        players,
      })

      expect(endCheck.shouldEnd).toBe(true)
      expect(endCheck.reason).toBe('all_banked')

      // Finalize round
      const finalizedPlayers = finalizeRound({
        players,
        reason: endCheck.reason,
        bankTotal: 0, // Doesn't matter, all banked
      })

      // All streaks continue
      expect(finalizedPlayers[0].streakCount).toBe(2)
      expect(finalizedPlayers[1].streakCount).toBe(1)

      // Reset for next round
      const resetPlayers = resetRoundState(finalizedPlayers)

      expect(resetPlayers.every(p => !p.bankedThisRound)).toBe(true)
    })
  })
})
