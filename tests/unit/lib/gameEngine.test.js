import { describe, test, expect } from 'vitest'
import {
  initializeGame,
  processDiceRoll,
  processBanking,
  advanceToNextRound,
  getGameStatus,
} from '../../../src/lib/gameEngine'

describe('Game State Machine', () => {
  describe('initializeGame', () => {
    test('creates game with players and settings', () => {
      const config = {
        players: [
          { id: 'p1', name: 'Alice' },
          { id: 'p2', name: 'Bob' },
        ],
        totalRounds: 10,
        settings: {
          firstThreeRollsSevenRule: true,
          snarkLevel: 'off',
          audioEnabled: false,
        },
      }

      const game = initializeGame(config)

      expect(game.players).toHaveLength(2)
      expect(game.players[0].name).toBe('Alice')
      expect(game.players[1].name).toBe('Bob')
      expect(game.totalRounds).toBe(10)
      expect(game.currentRound).toBe(1)
      expect(game.bankTotal).toBe(0)
      expect(game.rollCountInRound).toBe(0)
      expect(game.status).toBe('active')
      expect(game.settings.firstThreeRollsSevenRule).toBe(true)
    })

    test('initializes players with correct stats', () => {
      const config = {
        players: [{ id: 'p1', name: 'Alice' }],
        totalRounds: 10,
        settings: { firstThreeRollsSevenRule: false },
      }

      const game = initializeGame(config)

      const player = game.players[0]
      expect(player.totalScore).toBe(0)
      expect(player.bankedThisRound).toBe(false)
      expect(player.banksCount).toBe(0)
      expect(player.biggestBank).toBe(0)
      expect(player.streakCount).toBe(0)
    })

    test('generates unique game ID', () => {
      const config = {
        players: [{ id: 'p1', name: 'Alice' }],
        totalRounds: 10,
        settings: { firstThreeRollsSevenRule: false },
      }

      const game1 = initializeGame(config)
      const game2 = initializeGame(config)

      expect(game1.id).toBeDefined()
      expect(game2.id).toBeDefined()
      expect(game1.id).not.toBe(game2.id)
    })

    test('sets createdAt timestamp', () => {
      const config = {
        players: [{ id: 'p1', name: 'Alice' }],
        totalRounds: 10,
        settings: { firstThreeRollsSevenRule: false },
      }

      const before = Date.now()
      const game = initializeGame(config)
      const after = Date.now()

      expect(game.createdAt).toBeGreaterThanOrEqual(before)
      expect(game.createdAt).toBeLessThanOrEqual(after)
    })
  })

  describe('processDiceRoll', () => {
    test('normal roll adds to bank and increments roll count', () => {
      const game = initializeGame({
        players: [{ id: 'p1', name: 'Alice' }],
        totalRounds: 10,
        settings: { firstThreeRollsSevenRule: false },
      })

      const updatedGame = processDiceRoll(game, {
        dice1: 3,
        dice2: 2,
      })

      expect(updatedGame.bankTotal).toBe(5)
      expect(updatedGame.rollCountInRound).toBe(1)
      expect(updatedGame.status).toBe('active')
    })

    test('doubles after roll 3 doubles the bank', () => {
      const game = initializeGame({
        players: [{ id: 'p1', name: 'Alice' }],
        totalRounds: 10,
        settings: { firstThreeRollsSevenRule: false },
      })

      // First, get to roll 4 with some bank total (avoid rolling 7!)
      let updatedGame = processDiceRoll(game, { dice1: 3, dice2: 2 }) // Roll 1: bank = 5
      updatedGame = processDiceRoll(updatedGame, { dice1: 4, dice2: 2 }) // Roll 2: bank = 11
      updatedGame = processDiceRoll(updatedGame, { dice1: 2, dice2: 3 }) // Roll 3: bank = 16
      updatedGame = processDiceRoll(updatedGame, { dice1: 4, dice2: 4 }) // Roll 4: doubles!

      // 16 * 2 = 32 (doubles just double the bank, don't add dice value)
      expect(updatedGame.bankTotal).toBe(32)
      expect(updatedGame.rollCountInRound).toBe(4)
    })

    test('doubles in first 3 rolls only add sum', () => {
      const game = initializeGame({
        players: [{ id: 'p1', name: 'Alice' }],
        totalRounds: 10,
        settings: { firstThreeRollsSevenRule: false },
      })

      const updatedGame = processDiceRoll(game, { dice1: 5, dice2: 5 })

      expect(updatedGame.bankTotal).toBe(10) // Just 5+5, no doubling
      expect(updatedGame.rollCountInRound).toBe(1)
    })

    test('seven after roll 3 ends round', () => {
      const game = initializeGame({
        players: [
          { id: 'p1', name: 'Alice' },
          { id: 'p2', name: 'Bob' },
        ],
        totalRounds: 10,
        settings: { firstThreeRollsSevenRule: false },
      })

      // Get to roll 4
      let updatedGame = processDiceRoll(game, { dice1: 3, dice2: 2 })
      updatedGame = processDiceRoll(updatedGame, { dice1: 4, dice2: 3 })
      updatedGame = processDiceRoll(updatedGame, { dice1: 2, dice2: 3 })
      updatedGame = processDiceRoll(updatedGame, { dice1: 4, dice2: 3 }) // Roll 7

      expect(updatedGame.roundEnded).toBe(true)
      expect(updatedGame.roundEndReason).toBe('seven_rolled')
    })

    test('seven in first 3 rolls adds 70 when rule enabled', () => {
      const game = initializeGame({
        players: [{ id: 'p1', name: 'Alice' }],
        totalRounds: 10,
        settings: { firstThreeRollsSevenRule: true },
      })

      const updatedGame = processDiceRoll(game, { dice1: 4, dice2: 3 })

      expect(updatedGame.bankTotal).toBe(70)
      expect(updatedGame.rollCountInRound).toBe(1)
      expect(updatedGame.roundEnded).toBe(false)
    })

    test('seven in first 3 rolls ends round when rule disabled', () => {
      const game = initializeGame({
        players: [{ id: 'p1', name: 'Alice' }],
        totalRounds: 10,
        settings: { firstThreeRollsSevenRule: false },
      })

      const updatedGame = processDiceRoll(game, { dice1: 4, dice2: 3 })

      expect(updatedGame.roundEnded).toBe(true)
      expect(updatedGame.roundEndReason).toBe('seven_rolled')
    })

    test('validates dice values', () => {
      const game = initializeGame({
        players: [{ id: 'p1', name: 'Alice' }],
        totalRounds: 10,
        settings: { firstThreeRollsSevenRule: false },
      })

      expect(() => processDiceRoll(game, { dice1: 0, dice2: 3 })).toThrow()
      expect(() => processDiceRoll(game, { dice1: 5, dice2: 7 })).toThrow()
    })

    test('returns new game object (immutable)', () => {
      const game = initializeGame({
        players: [{ id: 'p1', name: 'Alice' }],
        totalRounds: 10,
        settings: { firstThreeRollsSevenRule: false },
      })

      const updatedGame = processDiceRoll(game, { dice1: 3, dice2: 2 })

      expect(updatedGame).not.toBe(game)
      expect(game.bankTotal).toBe(0) // Original unchanged
      expect(updatedGame.bankTotal).toBe(5)
    })
  })

  describe('processBanking', () => {
    test('banks current total for player', () => {
      const game = initializeGame({
        players: [
          { id: 'p1', name: 'Alice' },
          { id: 'p2', name: 'Bob' },
        ],
        totalRounds: 10,
        settings: { firstThreeRollsSevenRule: false },
      })

      // Add some money to the bank
      let updatedGame = processDiceRoll(game, { dice1: 5, dice2: 3 })

      // Alice banks
      updatedGame = processBanking(updatedGame, 'p1')

      const alice = updatedGame.players.find(p => p.id === 'p1')
      expect(alice.totalScore).toBe(8)
      expect(alice.bankedThisRound).toBe(true)
      expect(alice.banksCount).toBe(1)
    })

    test('checks if all players banked and ends round', () => {
      const game = initializeGame({
        players: [
          { id: 'p1', name: 'Alice' },
          { id: 'p2', name: 'Bob' },
        ],
        totalRounds: 10,
        settings: { firstThreeRollsSevenRule: false },
      })

      let updatedGame = processDiceRoll(game, { dice1: 5, dice2: 3 })
      updatedGame = processBanking(updatedGame, 'p1')
      updatedGame = processBanking(updatedGame, 'p2')

      expect(updatedGame.roundEnded).toBe(true)
      expect(updatedGame.roundEndReason).toBe('all_banked')
    })

    test('prevents banking twice in same round', () => {
      const game = initializeGame({
        players: [{ id: 'p1', name: 'Alice' }],
        totalRounds: 10,
        settings: { firstThreeRollsSevenRule: false },
      })

      let updatedGame = processDiceRoll(game, { dice1: 5, dice2: 3 })
      updatedGame = processBanking(updatedGame, 'p1')

      expect(() => processBanking(updatedGame, 'p1')).toThrow()
    })

    test('prevents banking when bank total is 0', () => {
      const game = initializeGame({
        players: [{ id: 'p1', name: 'Alice' }],
        totalRounds: 10,
        settings: { firstThreeRollsSevenRule: false },
      })

      expect(() => processBanking(game, 'p1')).toThrow()
    })

    test('returns new game object (immutable)', () => {
      const game = initializeGame({
        players: [{ id: 'p1', name: 'Alice' }],
        totalRounds: 10,
        settings: { firstThreeRollsSevenRule: false },
      })

      let updatedGame = processDiceRoll(game, { dice1: 5, dice2: 3 })
      const beforeBanking = updatedGame
      updatedGame = processBanking(updatedGame, 'p1')

      expect(updatedGame).not.toBe(beforeBanking)
      expect(beforeBanking.players[0].totalScore).toBe(0) // Original unchanged
    })
  })

  describe('advanceToNextRound', () => {
    test('advances to next round and resets state', () => {
      const game = initializeGame({
        players: [
          { id: 'p1', name: 'Alice' },
          { id: 'p2', name: 'Bob' },
        ],
        totalRounds: 10,
        settings: { firstThreeRollsSevenRule: false },
      })

      // Simulate a completed round
      let updatedGame = processDiceRoll(game, { dice1: 5, dice2: 3 })
      updatedGame = processBanking(updatedGame, 'p1')
      updatedGame = processBanking(updatedGame, 'p2')

      // Advance to next round
      updatedGame = advanceToNextRound(updatedGame)

      expect(updatedGame.currentRound).toBe(2)
      expect(updatedGame.bankTotal).toBe(0)
      expect(updatedGame.rollCountInRound).toBe(0)
      expect(updatedGame.roundEnded).toBe(false)
      expect(updatedGame.roundEndReason).toBeNull()
      expect(updatedGame.players[0].bankedThisRound).toBe(false)
      expect(updatedGame.players[1].bankedThisRound).toBe(false)
    })

    test('preserves player scores across rounds', () => {
      const game = initializeGame({
        players: [{ id: 'p1', name: 'Alice' }],
        totalRounds: 10,
        settings: { firstThreeRollsSevenRule: false },
      })

      let updatedGame = processDiceRoll(game, { dice1: 5, dice2: 3 })
      updatedGame = processBanking(updatedGame, 'p1')
      updatedGame = advanceToNextRound(updatedGame)

      expect(updatedGame.players[0].totalScore).toBe(8) // Score preserved
    })

    test('sets status to ended when game is complete', () => {
      const game = initializeGame({
        players: [{ id: 'p1', name: 'Alice' }],
        totalRounds: 2,
        settings: { firstThreeRollsSevenRule: false },
      })

      let updatedGame = processDiceRoll(game, { dice1: 5, dice2: 3 })
      updatedGame = processBanking(updatedGame, 'p1')
      updatedGame = advanceToNextRound(updatedGame) // Round 2

      updatedGame = processDiceRoll(updatedGame, { dice1: 4, dice2: 2 })
      updatedGame = processBanking(updatedGame, 'p1')
      updatedGame = advanceToNextRound(updatedGame) // Game should end

      expect(updatedGame.status).toBe('ended')
      expect(updatedGame.currentRound).toBe(2) // Stays at final round
    })

    test('throws error if round not ended', () => {
      const game = initializeGame({
        players: [{ id: 'p1', name: 'Alice' }],
        totalRounds: 10,
        settings: { firstThreeRollsSevenRule: false },
      })

      expect(() => advanceToNextRound(game)).toThrow()
    })
  })

  describe('getGameStatus', () => {
    test('returns active status during gameplay', () => {
      const game = initializeGame({
        players: [{ id: 'p1', name: 'Alice' }],
        totalRounds: 10,
        settings: { firstThreeRollsSevenRule: false },
      })

      const status = getGameStatus(game)

      expect(status.gameStatus).toBe('active')
      expect(status.currentRound).toBe(1)
      expect(status.totalRounds).toBe(10)
      expect(status.isGameComplete).toBe(false)
    })

    test('returns ended status when game complete', () => {
      const game = {
        status: 'ended',
        currentRound: 10,
        totalRounds: 10,
        players: [
          { id: 'p1', name: 'Alice', totalScore: 500 },
          { id: 'p2', name: 'Bob', totalScore: 450 },
        ],
      }

      const status = getGameStatus(game)

      expect(status.gameStatus).toBe('ended')
      expect(status.isGameComplete).toBe(true)
      expect(status.winner).toBeDefined()
      expect(status.winner.name).toBe('Alice')
    })

    test('identifies tie scenarios', () => {
      const game = {
        status: 'ended',
        currentRound: 10,
        totalRounds: 10,
        players: [
          { id: 'p1', name: 'Alice', totalScore: 500 },
          { id: 'p2', name: 'Bob', totalScore: 500 },
        ],
      }

      const status = getGameStatus(game)

      expect(status.isTie).toBe(true)
      expect(status.winners).toHaveLength(2)
    })

    test('provides leaderboard sorted by score', () => {
      const game = {
        status: 'active',
        currentRound: 5,
        totalRounds: 10,
        players: [
          { id: 'p1', name: 'Alice', totalScore: 300 },
          { id: 'p2', name: 'Bob', totalScore: 500 },
          { id: 'p3', name: 'Carol', totalScore: 200 },
        ],
      }

      const status = getGameStatus(game)

      expect(status.leaderboard[0].name).toBe('Bob')
      expect(status.leaderboard[1].name).toBe('Alice')
      expect(status.leaderboard[2].name).toBe('Carol')
    })
  })

  describe('Integration: Complete game flow', () => {
    test('plays a complete 2-round game', () => {
      // Initialize game
      let game = initializeGame({
        players: [
          { id: 'p1', name: 'Alice' },
          { id: 'p2', name: 'Bob' },
        ],
        totalRounds: 2,
        settings: { firstThreeRollsSevenRule: true },
      })

      expect(game.status).toBe('active')
      expect(game.currentRound).toBe(1)

      // Round 1: Alice banks, Bob gets hit by 7
      game = processDiceRoll(game, { dice1: 5, dice2: 3 }) // Bank = 8
      game = processBanking(game, 'p1') // Alice banks 8
      game = processDiceRoll(game, { dice1: 4, dice2: 2 }) // Bank = 6
      game = processDiceRoll(game, { dice1: 3, dice2: 2 }) // Bank = 11
      game = processDiceRoll(game, { dice1: 4, dice2: 3 }) // 7 rolled!

      expect(game.roundEnded).toBe(true)
      expect(game.players.find(p => p.id === 'p1').totalScore).toBe(8)
      expect(game.players.find(p => p.id === 'p2').totalScore).toBe(0)

      // Advance to round 2
      game = advanceToNextRound(game)
      expect(game.currentRound).toBe(2)
      expect(game.bankTotal).toBe(0)

      // Round 2: Both bank
      game = processDiceRoll(game, { dice1: 6, dice2: 4 }) // Roll 1: Bank = 10
      game = processBanking(game, 'p1') // Alice banks 10 (total: 18)
      game = processDiceRoll(game, { dice1: 5, dice2: 5 }) // Roll 2: Doubles in first 3! Bank = 10+10 = 20
      game = processDiceRoll(game, { dice1: 3, dice2: 2 }) // Roll 3: Bank = 20+5 = 25
      game = processDiceRoll(game, { dice1: 2, dice2: 3 }) // Roll 4: Bank = 25+5 = 30
      game = processDiceRoll(game, { dice1: 4, dice2: 4 }) // Roll 5: Doubles! 30*2 = 60
      game = processBanking(game, 'p2') // Bob banks 60 (total: 60)

      expect(game.roundEnded).toBe(true)

      // Advance (game ends)
      game = advanceToNextRound(game)
      expect(game.status).toBe('ended')

      const status = getGameStatus(game)
      expect(status.winner.name).toBe('Bob')
      expect(status.winner.totalScore).toBe(60)
    })
  })

  describe('Turn Tracking', () => {
    test('initializeGame sets first player as current', () => {
      const game = initializeGame({
        players: [
          { id: 'p1', name: 'Alice' },
          { id: 'p2', name: 'Bob' },
          { id: 'p3', name: 'Charlie' },
        ],
        totalRounds: 10,
        settings: { firstThreeRollsSevenRule: false },
      })

      expect(game.currentPlayerIndex).toBe(0)
      expect(game.players[game.currentPlayerIndex].name).toBe('Alice')
    })

    test('processDiceRoll advances turn to next player', () => {
      const game = initializeGame({
        players: [
          { id: 'p1', name: 'Alice' },
          { id: 'p2', name: 'Bob' },
          { id: 'p3', name: 'Charlie' },
        ],
        totalRounds: 10,
        settings: { firstThreeRollsSevenRule: false },
      })

      const afterRoll = processDiceRoll(game, { dice1: 3, dice2: 2 })

      expect(afterRoll.currentPlayerIndex).toBe(1) // Bob's turn
    })

    test('processBanking advances turn to next player', () => {
      let game = initializeGame({
        players: [
          { id: 'p1', name: 'Alice' },
          { id: 'p2', name: 'Bob' },
          { id: 'p3', name: 'Charlie' },
        ],
        totalRounds: 10,
        settings: { firstThreeRollsSevenRule: false },
      })

      // Alice rolls to build bank
      game = processDiceRoll(game, { dice1: 3, dice2: 2 }) // Bank = 5, Bob's turn
      expect(game.currentPlayerIndex).toBe(1)

      // Bob banks
      game = processBanking(game, 'p2')

      expect(game.currentPlayerIndex).toBe(2) // Charlie's turn
    })

    test('turn wraps around to first player', () => {
      let game = initializeGame({
        players: [
          { id: 'p1', name: 'Alice' },
          { id: 'p2', name: 'Bob' },
        ],
        totalRounds: 10,
        settings: { firstThreeRollsSevenRule: false },
      })

      // Alice rolls
      game = processDiceRoll(game, { dice1: 3, dice2: 2 })
      expect(game.currentPlayerIndex).toBe(1) // Bob

      // Bob rolls
      game = processDiceRoll(game, { dice1: 2, dice2: 2 })
      expect(game.currentPlayerIndex).toBe(0) // Wraps to Alice
    })

    test('turn skips players who have banked', () => {
      let game = initializeGame({
        players: [
          { id: 'p1', name: 'Alice' },
          { id: 'p2', name: 'Bob' },
          { id: 'p3', name: 'Charlie' },
        ],
        totalRounds: 10,
        settings: { firstThreeRollsSevenRule: false },
      })

      // Alice rolls to build bank
      game = processDiceRoll(game, { dice1: 3, dice2: 2 }) // Bank = 5, Bob's turn

      // Bob banks
      game = processBanking(game, 'p2') // Bob is now out, Charlie's turn
      expect(game.currentPlayerIndex).toBe(2)

      // Charlie rolls
      game = processDiceRoll(game, { dice1: 2, dice2: 3 }) // Bank = 10
      // Should skip Bob (banked) and go to Alice
      expect(game.currentPlayerIndex).toBe(0)
    })

    test('next round starts with player who rolled 7', () => {
      let game = initializeGame({
        players: [
          { id: 'p1', name: 'Alice' },
          { id: 'p2', name: 'Bob' },
          { id: 'p3', name: 'Charlie' },
        ],
        totalRounds: 10,
        settings: { firstThreeRollsSevenRule: false },
      })

      // Alice rolls
      game = processDiceRoll(game, { dice1: 3, dice2: 2 }) // Bob's turn
      // Bob rolls
      game = processDiceRoll(game, { dice1: 2, dice2: 3 }) // Charlie's turn
      // Charlie rolls 7 - ends round
      game = processDiceRoll(game, { dice1: 3, dice2: 4 })

      expect(game.roundEnded).toBe(true)

      // Advance to next round
      game = advanceToNextRound(game)

      // Alice should start (next after Charlie)
      expect(game.currentPlayerIndex).toBe(0)
    })

    test('next round starts with player after last banker', () => {
      let game = initializeGame({
        players: [
          { id: 'p1', name: 'Alice' },
          { id: 'p2', name: 'Bob' },
        ],
        totalRounds: 10,
        settings: { firstThreeRollsSevenRule: false },
      })

      // Alice rolls
      game = processDiceRoll(game, { dice1: 3, dice2: 2 }) // Bank = 5
      // Bob banks
      game = processBanking(game, 'p2')
      // Alice banks - round ends (all banked)
      game = processBanking(game, 'p1')

      expect(game.roundEnded).toBe(true)
      expect(game.roundEndReason).toBe('all_banked')

      // Advance to next round
      game = advanceToNextRound(game)

      // Bob should start (next after Alice who banked last)
      expect(game.currentPlayerIndex).toBe(1)
    })
  })
})
