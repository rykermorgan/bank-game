import { create } from 'zustand'
import {
  initializeGame,
  processDiceRoll,
  processBanking,
  advanceToNextRound,
  getGameStatus,
} from '../lib/gameEngine'

/**
 * Zustand store for game state
 * Manages the entire game lifecycle
 */
export const useGameStore = create((set, get) => ({
  // Game state
  game: null,
  gameStatus: null,

  // UI state
  diceSum: '',
  isDoublesChecked: false,
  showError: false,
  errorMessage: '',

  // Actions
  startNewGame: config => {
    const game = initializeGame(config)
    const gameStatus = getGameStatus(game)

    set({
      game,
      gameStatus,
      diceSum: '',
      isDoublesChecked: false,
      showError: false,
      errorMessage: '',
    })
  },

  rollDice: () => {
    const { game, diceSum, isDoublesChecked } = get()

    if (!game) return

    // Validate dice sum
    const sum = parseInt(diceSum, 10)
    if (isNaN(sum) || sum < 2 || sum > 12) {
      set({
        showError: true,
        errorMessage: 'Dice sum must be between 2 and 12',
      })
      return
    }

    try {
      // Determine actual dice values from sum and doubles
      // For doubles: both dice are sum/2
      // For non-doubles: use common combinations
      let dice1, dice2

      if (isDoublesChecked) {
        // Must be even number for doubles
        if (sum % 2 !== 0) {
          set({
            showError: true,
            errorMessage: 'Doubles must have an even sum',
          })
          return
        }
        dice1 = sum / 2
        dice2 = sum / 2
      } else {
        // Use common non-doubles combinations
        const combinations = {
          2: [1, 1],
          3: [1, 2],
          4: [1, 3],
          5: [2, 3],
          6: [2, 4],
          7: [3, 4],
          8: [3, 5],
          9: [4, 5],
          10: [4, 6],
          11: [5, 6],
          12: [6, 6],
        }

        const combo = combinations[sum]
        if (!combo) {
          set({
            showError: true,
            errorMessage: 'Invalid dice sum',
          })
          return
        }
        ;[dice1, dice2] = combo
      }

      const updatedGame = processDiceRoll(game, { dice1, dice2 })
      const updatedStatus = getGameStatus(updatedGame)

      set({
        game: updatedGame,
        gameStatus: updatedStatus,
        diceSum: '',
        isDoublesChecked: false,
        showError: false,
        errorMessage: '',
      })
    } catch (error) {
      set({
        showError: true,
        errorMessage: error.message,
      })
    }
  },

  bankPlayer: playerId => {
    const { game } = get()

    if (!game) return

    try {
      const updatedGame = processBanking(game, playerId)
      const updatedStatus = getGameStatus(updatedGame)

      set({
        game: updatedGame,
        gameStatus: updatedStatus,
        showError: false,
        errorMessage: '',
      })
    } catch (error) {
      set({
        showError: true,
        errorMessage: error.message,
      })
    }
  },

  nextRound: () => {
    const { game } = get()

    if (!game) return

    try {
      const updatedGame = advanceToNextRound(game)
      const updatedStatus = getGameStatus(updatedGame)

      set({
        game: updatedGame,
        gameStatus: updatedStatus,
        showError: false,
        errorMessage: '',
      })
    } catch (error) {
      set({
        showError: true,
        errorMessage: error.message,
      })
    }
  },

  setDiceSum: value => {
    set({ diceSum: value, showError: false })
  },

  toggleDoubles: () => {
    set(state => ({ isDoublesChecked: !state.isDoublesChecked }))
  },

  clearError: () => {
    set({ showError: false, errorMessage: '' })
  },

  resetGame: () => {
    set({
      game: null,
      gameStatus: null,
      diceSum: '',
      isDoublesChecked: false,
      showError: false,
      errorMessage: '',
    })
  },
}))
