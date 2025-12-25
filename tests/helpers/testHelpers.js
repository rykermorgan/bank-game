/**
 * Test helper utilities for Bank Game
 */

/**
 * Creates a mock player object
 */
export function createMockPlayer(overrides = {}) {
  return {
    id: 'player-1',
    name: 'Alice',
    totalScore: 0,
    bankedThisRound: false,
    banksCount: 0,
    biggestBank: 0,
    streakCount: 0,
    ...overrides
  }
}

/**
 * Creates a mock game state
 */
export function createMockGameState(overrides = {}) {
  return {
    id: 'game-1',
    players: [
      createMockPlayer({ id: 'player-1', name: 'Alice' }),
      createMockPlayer({ id: 'player-2', name: 'Bob' })
    ],
    roundsTotal: 10,
    roundIndex: 0,
    bankTotal: 0,
    rollCountInRound: 0,
    gameStatus: 'active', // 'setup', 'active', 'ended'
    settings: {
      firstThreeRollsSevenRule: true, // 7 in first 3 rolls = +70
      snarkLevel: 'off', // 'off', 'low', 'medium', 'full'
      audioEnabled: false
    },
    ...overrides
  }
}

/**
 * Creates an array of dice sum values for testing
 */
export function createDiceRollSequence(rolls) {
  return rolls.map(roll => ({
    sum: roll,
    isDoubles: roll % 2 === 0 && roll !== 2 // Simplified doubles detection for testing
  }))
}
