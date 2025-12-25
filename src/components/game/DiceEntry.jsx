import clsx from 'clsx'

export function DiceEntry({ diceSum, onDiceSumChange, isDoublesChecked, onDoublesToggle, onRoll, disabled, rollCount }) {
  const doublesDisabled = rollCount < 3
  const isInFirstThree = rollCount < 3

  const quickSelectButtons = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

  const handleNumberClick = (num) => {
    // 2 and 12 can only be rolled as doubles, so disable after roll 3
    const isDoublesOnly = (num === 2 || num === 12) && !isInFirstThree
    if (disabled || isDoublesOnly) return
    onDiceSumChange(String(num))
    // Auto-submit after selecting number
    setTimeout(() => onRoll(), 100)
  }

  const handleDoublesClick = () => {
    if (disabled || doublesDisabled) return
    onDoublesToggle()
    // Auto-submit after toggling doubles
    setTimeout(() => onRoll(), 100)
  }

  return (
    <div className="space-y-4 p-4 bg-white rounded-xl shadow-card">
      {/* Quick Select Buttons */}
      <div className="grid grid-cols-6 gap-2">
        {quickSelectButtons.map((num) => {
          // 2 and 12 can only be rolled as doubles, disable after roll 3
          const isDoublesOnly = (num === 2 || num === 12) && !isInFirstThree
          const isButtonDisabled = disabled || isDoublesOnly

          return (
            <button
              key={num}
              onClick={() => handleNumberClick(num)}
              disabled={isButtonDisabled}
              className={clsx(
                'py-3 px-3 rounded-lg font-bold text-lg transition-all',
                isDoublesOnly
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : num === 7
                    ? isInFirstThree
                      ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      : 'bg-danger text-white hover:bg-danger/90'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              {num}
            </button>
          )
        })}
      </div>

      {/* Doubles Button */}
      <button
        onClick={handleDoublesClick}
        disabled={disabled || doublesDisabled}
        className={clsx(
          'w-full py-4 rounded-lg font-bold text-lg transition-all',
          doublesDisabled
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : isDoublesChecked
              ? 'bg-accent text-gray-800 hover:bg-accent/90'
              : 'bg-secondary text-white hover:bg-secondary/90'
        )}
      >
        {isDoublesChecked ? '✓ DOUBLES' : 'DOUBLES'}
        {doublesDisabled && ' (Disabled for first 3 rolls)'}
      </button>
    </div>
  )
}
