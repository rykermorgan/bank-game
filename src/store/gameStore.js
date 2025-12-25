import { create } from 'zustand'
import { persist } from 'zustand/middleware'
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
 * Uses persist middleware to save state to localStorage
 */
export const useGameStore = create(
  persist(
    (set, get) => ({
  // Game state
  game: null,
  gameStatus: null,
  previousGame: null, // For undo functionality

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
      previousGame: null, // No undo on new game
      diceSum: '',
      isDoublesChecked: false,
      showError: false,
      errorMessage: '',
    })
  },

  rollDice: () => {
    const { game, diceSum, isDoublesChecked } = get()

    if (!game) return

    // Save current state for undo (deep copy)
    const previousGame = JSON.parse(JSON.stringify(game))

    // For doubles after roll 3, we don't need dice value
    const isDoublesAfterRoll3 = isDoublesChecked && game.rollCountInRound >= 3

    // Only validate dice sum if NOT doubles after roll 3
    let sum
    if (!isDoublesAfterRoll3) {
      sum = parseInt(diceSum, 10)
      if (isNaN(sum) || sum < 2 || sum > 12) {
        set({
          showError: true,
          errorMessage: 'Dice sum must be between 2 and 12',
        })
        return
      }
    }

    try {
      // Determine actual dice values from sum and doubles
      let dice1, dice2

      if (isDoublesAfterRoll3) {
        // Doubles after roll 3: dice values don't matter, use placeholder
        dice1 = 1
        dice2 = 1
      } else if (isDoublesChecked) {
        // Doubles in first 3 rolls: need even sum
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
        previousGame, // Save for undo
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

    // Save current state for undo (deep copy)
    const previousGame = JSON.parse(JSON.stringify(game))

    try {
      const updatedGame = processBanking(game, playerId)
      const updatedStatus = getGameStatus(updatedGame)

      set({
        game: updatedGame,
        gameStatus: updatedStatus,
        previousGame, // Save for undo
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

    // Save current state for undo (deep copy)
    const previousGame = JSON.parse(JSON.stringify(game))

    try {
      const updatedGame = advanceToNextRound(game)
      const updatedStatus = getGameStatus(updatedGame)

      set({
        game: updatedGame,
        gameStatus: updatedStatus,
        previousGame, // Save for undo
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

  undo: () => {
    const { previousGame } = get()

    if (!previousGame) return

    const updatedStatus = getGameStatus(previousGame)

    set({
      game: previousGame,
      gameStatus: updatedStatus,
      previousGame: null, // Can only undo once
      showError: false,
      errorMessage: '',
    })
  },

  canUndo: () => {
    const { previousGame } = get()
    return previousGame !== null
  },

  resetGame: () => {
    set({
      game: null,
      gameStatus: null,
      previousGame: null,
      diceSum: '',
      isDoublesChecked: false,
      showError: false,
      errorMessage: '',
    })
  },
    }),
    {
      name: 'bank-game-storage', // localStorage key
      partialPersist: true,
      // Only persist game state, not UI state
      partialize: (state) => ({
        game: state.game,
        gameStatus: state.gameStatus,
        previousGame: state.previousGame,
      }),
    }
  )
)
