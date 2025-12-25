/**
 * Banking logic for Bank Game
 * Handles player banking actions and stat updates
 */

/**
 * Checks if a player can bank the current total
 * @param {Object} player - Player object
 * @param {number} bankTotal - Current bank total (optional, defaults to 1 for validation)
 * @returns {boolean} - True if player can bank
 */
export function canPlayerBank(player, bankTotal = 1) {
  // Player must not have already banked this round
  if (player.bankedThisRound) {
    return false
  }

  // Bank total must be positive
  if (bankTotal <= 0) {
    return false
  }

  return true
}

/**
 * Banks the current total for a player
 * Returns a new player object with updated stats (immutable)
 *
 * @param {Object} player - Player object
 * @param {number} bankTotal - Current bank total to add to player's score
 * @returns {Object} - New player object with updated stats
 * @throws {Error} - If player already banked or bank total is invalid
 */
export function bankPlayer(player, bankTotal) {
  // Validation
  if (player.bankedThisRound) {
    throw new Error(`Player ${player.id} has already banked this round`)
  }

  if (bankTotal <= 0) {
    throw new Error('Bank total must be positive')
  }

  // Calculate new stats
  const newTotalScore = player.totalScore + bankTotal
  const newBanksCount = player.banksCount + 1
  const newBiggestBank = Math.max(player.biggestBank, bankTotal)

  // Return new player object (immutable update)
  return {
    ...player,
    totalScore: newTotalScore,
    bankedThisRound: true,
    banksCount: newBanksCount,
    biggestBank: newBiggestBank,
  }
}

/**
 * Updates player streak stats based on banking success
 * Returns a new player object (immutable)
 *
 * @param {Object} player - Player object
 * @param {boolean} bankedSuccessfully - Whether player banked this round
 * @returns {Object} - New player object with updated streak
 */
export function updatePlayerStats(player, bankedSuccessfully) {
  if (bankedSuccessfully) {
    // Increment streak
    return {
      ...player,
      streakCount: player.streakCount + 1,
    }
  } else {
    // Reset streak
    return {
      ...player,
      streakCount: 0,
    }
  }
}
