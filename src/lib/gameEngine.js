/**
 * Game State Machine for Bank Game
 * Coordinates all game logic modules and manages game state
 */

import { calculateBankTotal, detectDoubles } from './scoring'
import { bankPlayer, canPlayerBank } from './banking'
import { shouldEndRound, finalizeRound, resetRoundState, isGameComplete } from './roundEnd'

/**
 * Generates a unique game ID
 */
function generateGameId() {
  return `game-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Gets the next player index, skipping banked players
 * @param {Object} game - Current game state
 * @param {number} fromIndex - Starting index
 * @returns {number} - Next active player index
 */
function getNextPlayerIndex(game, fromIndex) {
  const playerCount = game.players.length
  let nextIndex = (fromIndex + 1) % playerCount
  let iterations = 0

  // Find next player who hasn't banked (with safety limit)
  while (game.players[nextIndex].bankedThisRound && iterations < playerCount) {
    nextIndex = (nextIndex + 1) % playerCount
    iterations++
  }

  return nextIndex
}

/**
 * Initializes a new game
 * @param {Object} config
 * @param {Array} config.players - Array of player configs { id, name }
 * @param {number} config.totalRounds - Total number of rounds (10/15/20)
 * @param {Object} config.settings - Game settings
 * @returns {Object} - Initialized game state
 */
export function initializeGame(config) {
  const { players: playerConfigs, totalRounds, settings } = config

  // Initialize players with starting stats
  const players = playerConfigs.map(playerConfig => ({
    id: playerConfig.id,
    name: playerConfig.name,
    totalScore: 0,
    bankedThisRound: false,
    banksCount: 0,
    biggestBank: 0,
    streakCount: 0,
  }))

  // Randomly select first player
  const randomStartIndex = Math.floor(Math.random() * players.length)

  return {
    id: generateGameId(),
    createdAt: Date.now(),
    players,
    totalRounds,
    currentRound: 1,
    bankTotal: 0,
    rollCountInRound: 0,
    status: 'active', // 'active' | 'ended'
    settings,
    roundEnded: false,
    roundEndReason: null, // 'seven_rolled' | 'all_banked' | null
    currentPlayerIndex: randomStartIndex, // Random starting player
  }
}

/**
 * Processes a dice roll and updates game state
 * @param {Object} game - Current game state
 * @param {Object} roll - { dice1, dice2 }
 * @returns {Object} - New game state
 */
export function processDiceRoll(game, roll) {
  const { dice1, dice2 } = roll

  // Validate dice values
  if (dice1 < 1 || dice1 > 6 || dice2 < 1 || dice2 > 6) {
    throw new Error(`Invalid dice values: ${dice1}, ${dice2}. Must be between 1 and 6.`)
  }

  // Calculate roll details
  const diceSum = dice1 + dice2
  const isDoubles = detectDoubles(dice1, dice2)
  const rollCount = game.rollCountInRound + 1

  // Calculate new bank total using scoring logic
  const scoringResult = calculateBankTotal({
    currentBank: game.bankTotal,
    diceSum,
    isDoubles,
    rollCount,
    settings: game.settings,
  })

  // Advance to next player's turn
  const nextPlayerIndex = getNextPlayerIndex(game, game.currentPlayerIndex)

  // Create updated game state
  const updatedGame = {
    ...game,
    bankTotal: scoringResult.newBank,
    rollCountInRound: rollCount,
    currentPlayerIndex: nextPlayerIndex,
  }

  // Check if round ended due to 7
  if (scoringResult.roundEnded) {
    const endCheck = shouldEndRound({
      sevenRolled: true,
      players: game.players,
    })

    return {
      ...updatedGame,
      roundEnded: endCheck.shouldEnd,
      roundEndReason: endCheck.reason,
      roundEndPlayerIndex: game.currentPlayerIndex, // Track who rolled the 7
    }
  }

  return updatedGame
}

/**
 * Processes a player banking action
 * @param {Object} game - Current game state
 * @param {string} playerId - ID of player banking
 * @returns {Object} - New game state
 */
export function processBanking(game, playerId) {
  // Find the player
  const playerIndex = game.players.findIndex(p => p.id === playerId)
  if (playerIndex === -1) {
    throw new Error(`Player ${playerId} not found`)
  }

  const player = game.players[playerIndex]

  // Validate banking is allowed
  if (!canPlayerBank(player, game.bankTotal)) {
    if (player.bankedThisRound) {
      throw new Error(`Player ${playerId} has already banked this round`)
    }
    if (game.bankTotal <= 0) {
      throw new Error('Cannot bank: bank total is 0')
    }
    throw new Error('Cannot bank')
  }

  // Bank the player
  const bankedPlayer = bankPlayer(player, game.bankTotal)

  // Update players array
  const updatedPlayers = game.players.map((p, idx) => (idx === playerIndex ? bankedPlayer : p))

  // If the CURRENT player banked, advance to next unbanked player
  // If someone else banked (not their turn), keep current player's turn
  const shouldAdvanceTurn = playerIndex === game.currentPlayerIndex
  const nextPlayerIndex = shouldAdvanceTurn
    ? getNextPlayerIndex({ ...game, players: updatedPlayers }, game.currentPlayerIndex)
    : game.currentPlayerIndex

  // Create updated game
  const updatedGame = {
    ...game,
    players: updatedPlayers,
    currentPlayerIndex: nextPlayerIndex,
  }

  // Check if all players have now banked
  const endCheck = shouldEndRound({
    sevenRolled: false,
    players: updatedPlayers,
  })

  if (endCheck.shouldEnd) {
    return {
      ...updatedGame,
      roundEnded: true,
      roundEndReason: endCheck.reason,
      roundEndPlayerIndex: playerIndex, // Track who ended the round
    }
  }

  return updatedGame
}

/**
 * Advances to the next round
 * @param {Object} game - Current game state
 * @returns {Object} - New game state
 */
export function advanceToNextRound(game) {
  // Validate round has ended
  if (!game.roundEnded) {
    throw new Error('Cannot advance: round has not ended')
  }

  // Finalize current round
  const finalizedPlayers = finalizeRound({
    players: game.players,
    reason: game.roundEndReason,
    bankTotal: game.bankTotal,
  })

  // Reset round state
  const resetPlayers = resetRoundState(finalizedPlayers)

  // Check if game is complete
  const gameComplete = isGameComplete({
    currentRound: game.currentRound,
    totalRounds: game.totalRounds,
  })

  if (gameComplete) {
    return {
      ...game,
      players: resetPlayers,
      status: 'ended',
      roundEnded: false,
      roundEndReason: null,
    }
  }

  // Determine who starts next round (player after whoever ended this round)
  const nextRoundStartIndex = game.roundEndPlayerIndex !== undefined
    ? (game.roundEndPlayerIndex + 1) % game.players.length
    : game.currentPlayerIndex

  // Advance to next round
  return {
    ...game,
    players: resetPlayers,
    currentRound: game.currentRound + 1,
    bankTotal: 0,
    rollCountInRound: 0,
    roundEnded: false,
    roundEndReason: null,
    roundEndPlayerIndex: undefined,
    currentPlayerIndex: nextRoundStartIndex,
  }
}

/**
 * Gets current game status and leaderboard
 * @param {Object} game - Current game state
 * @returns {Object} - Game status info
 */
export function getGameStatus(game) {
  const leaderboard = [...game.players].sort((a, b) => b.totalScore - a.totalScore)

  const highestScore = leaderboard[0]?.totalScore || 0
  const winners = leaderboard.filter(p => p.totalScore === highestScore)
  const isTie = winners.length > 1

  return {
    gameStatus: game.status,
    currentRound: game.currentRound,
    totalRounds: game.totalRounds,
    isGameComplete: game.status === 'ended',
    leaderboard,
    winner: winners[0],
    winners: isTie ? winners : undefined,
    isTie,
  }
}
