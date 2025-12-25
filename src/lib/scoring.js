/**
 * Core scoring logic for Bank Game
 * All functions are pure (no side effects) for easy testing
 */

/**
 * Detects if two dice values form doubles
 * @param {number} dice1 - First die value (1-6)
 * @param {number} dice2 - Second die value (1-6)
 * @returns {boolean} - True if doubles
 * @throws {Error} - If dice values are out of range
 */
export function detectDoubles(dice1, dice2) {
  if (dice1 < 1 || dice1 > 6 || dice2 < 1 || dice2 > 6) {
    throw new Error(`Invalid dice values: ${dice1}, ${dice2}. Must be between 1 and 6.`)
  }
  return dice1 === dice2
}

/**
 * Determines if the "first 3 rolls = 7 adds 70" rule should apply
 * @param {number} rollCount - Current roll number in the round (1-indexed)
 * @param {boolean} ruleEnabled - Whether the rule is enabled in settings
 * @returns {boolean} - True if rule applies to this roll
 */
export function shouldApplySevenRule(rollCount, ruleEnabled) {
  return ruleEnabled && rollCount <= 3
}

/**
 * Calculates new bank total after a dice roll
 * Handles all special cases: doubles, sevens, first-3-roll rule
 *
 * @param {Object} params
 * @param {number} params.currentBank - Current bank total
 * @param {number} params.diceSum - Sum of two dice (2-12)
 * @param {boolean} params.isDoubles - Whether the roll was doubles
 * @param {number} params.rollCount - Current roll number in round (1-indexed)
 * @param {Object} params.settings - Game settings
 * @param {boolean} params.settings.firstThreeRollsSevenRule - Enable first-3-roll 7 rule
 * @returns {Object} Result object
 * @returns {number} result.newBank - New bank total
 * @returns {boolean} result.roundEnded - Whether round ended
 * @returns {boolean} result.sevenRolled - Whether a round-ending 7 was rolled
 */
export function calculateBankTotal({ currentBank, diceSum, isDoubles, rollCount, settings }) {
  let newBank = currentBank
  let roundEnded = false
  let sevenRolled = false

  // Check if this is a round-ending 7
  const isSevenRolled = diceSum === 7

  if (isSevenRolled) {
    // Determine if the special "first 3 rolls" rule applies
    const applySevenRule = shouldApplySevenRule(rollCount, settings.firstThreeRollsSevenRule)

    if (applySevenRule) {
      // First 3 rolls with rule enabled: add 70, don't end round
      newBank = currentBank + 70
      roundEnded = false
      sevenRolled = false
    } else {
      // Either rule disabled OR past roll 3: 7 ends round
      newBank = currentBank // Bank unchanged
      roundEnded = true
      sevenRolled = true
    }

    return { newBank, roundEnded, sevenRolled }
  }

  // Not a 7, handle normal roll or doubles
  if (isDoubles && rollCount > 3) {
    // Doubles AFTER first 3 rolls: just double the bank (dice value doesn't matter)
    newBank = currentBank * 2
  } else {
    // Normal roll OR doubles within first 3 rolls: just add sum
    newBank = currentBank + diceSum
  }

  return { newBank, roundEnded, sevenRolled }
}
