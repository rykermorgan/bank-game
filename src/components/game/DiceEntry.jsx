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
    // After roll 3, doubles auto-submits (no dice value needed)
    // Before roll 3, user must click a number button
    if (rollCount >= 3) {
      setTimeout(() => onRoll(), 100)
    }
  }

  return (
    <div className="p-4 bg-background-card rounded-3xl shadow-lg border-2 border-border relative overflow-hidden">
      {/* Subtle pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(circle_at_1px_1px,rgb(0,0,0)_1px,transparent_0)] bg-[length:24px_24px]"></div>
      <div className="relative space-y-3">
      {/* Quick Select Buttons */}
      <div className="grid grid-cols-6 gap-2 justify-items-center">
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
                'w-12 h-12 flex items-center justify-center rounded-xl font-bold text-lg transition-all duration-150',
                isDoublesOnly
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-300'
                  : num === 7 && !isInFirstThree
                    ? 'bg-danger text-white border-2 border-danger-hover hover:bg-danger-hover hover:-translate-y-0.5 active:translate-y-0'
                    : 'bg-white text-text border-2 border-gray-300 hover:border-secondary hover:-translate-y-0.5 active:translate-y-0',
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
          'w-full py-4 rounded-xl font-bold text-lg transition-all duration-150 border-2',
          doublesDisabled
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-300'
            : isDoublesChecked
              ? 'bg-accent text-text border-accent-hover'
              : 'bg-secondary text-white border-secondary-hover hover:bg-secondary-hover hover:-translate-y-0.5 active:translate-y-0'
        )}
      >
        {isDoublesChecked ? '✓ DOUBLES' : 'DOUBLES'}
      </button>
      </div>
    </div>
  )
}
