/**
 * Round end logic for Bank Game
 * Handles round completion, player finalization, and round state reset
 */

import { updatePlayerStats } from './banking'

/**
 * Determines if the round should end
 * @param {Object} params
 * @param {boolean} params.sevenRolled - Whether a 7 was rolled
 * @param {Array} params.players - Array of player objects
 * @returns {Object} - { shouldEnd: boolean, reason: string | null }
 */
export function shouldEndRound({ sevenRolled, players }) {
  // Round ends if 7 is rolled
  if (sevenRolled) {
    return {
      shouldEnd: true,
      reason: 'seven_rolled',
    }
  }

  // Round ends if all players have banked
  const allBanked = players.every(player => player.bankedThisRound)
  if (allBanked) {
    return {
      shouldEnd: true,
      reason: 'all_banked',
    }
  }

  // Round continues
  return {
    shouldEnd: false,
    reason: null,
  }
}

/**
 * Finalizes the round by updating player scores and stats
 * When 7 is rolled: unbanked players get nothing
 * When all banked: all players keep their scores
 *
 * @param {Object} params
 * @param {Array} params.players - Array of player objects
 * @param {string} params.reason - Why round ended ('seven_rolled' or 'all_banked')
 * @param {number} params.bankTotal - Current bank total (unused, but kept for context)
 * @returns {Array} - New array of updated player objects
 */
export function finalizeRound({ players, reason, bankTotal }) {
  return players.map(player => {
    // Determine if this player successfully banked
    const bankedSuccessfully = player.bankedThisRound

    // Update streak stats
    const updatedPlayer = updatePlayerStats(player, bankedSuccessfully)

    // No score changes needed - players already have their banked scores
    // Unbanked players simply don't get the bank total (they keep their existing score)

    return updatedPlayer
  })
}

/**
 * Resets round state for all players
 * Prepares players for the next round
 *
 * @param {Array} players - Array of player objects
 * @returns {Array} - New array of players with reset round state
 */
export function resetRoundState(players) {
  return players.map(player => ({
    ...player,
    bankedThisRound: false,
  }))
}

/**
 * Checks if the game is complete
 * @param {Object} params
 * @param {number} params.currentRound - Current round number (1-indexed)
 * @param {number} params.totalRounds - Total number of rounds in game
 * @returns {boolean} - True if game is complete
 */
export function isGameComplete({ currentRound, totalRounds }) {
  return currentRound >= totalRounds
}
