import clsx from 'clsx'

export function DiceEntry({
  diceSum,
  onDiceSumChange,
  isDoublesChecked,
  onDoublesToggle,
  onRoll,
  disabled,
  rollCount,
}) {
  const doublesDisabled = rollCount < 3

  const quickSelectButtons = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

  return (
    <div className="space-y-4 p-4 bg-white rounded-xl shadow-card">
      <div>
        <label htmlFor="dice-sum" className="block text-sm font-semibold text-gray-700 mb-2">
          Dice Sum (2-12)
        </label>
        <input
          id="dice-sum"
          type="number"
          min="2"
          max="12"
          value={diceSum}
          onChange={e => onDiceSumChange(e.target.value)}
          disabled={disabled}
          className="w-full px-4 py-3 text-2xl font-mono font-bold text-center border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary disabled:bg-gray-100 disabled:text-gray-400"
          placeholder="Enter sum"
        />
      </div>

      {/* Quick Select Buttons */}
      <div className="grid grid-cols-6 gap-2">
        {quickSelectButtons.map(num => (
          <button
            key={num}
            onClick={() => onDiceSumChange(String(num))}
            disabled={disabled}
            className={clsx(
              'py-2 px-3 rounded-lg font-bold transition-all',
              num === 7
                ? 'bg-danger text-white hover:bg-danger/90'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            {num}
          </button>
        ))}
      </div>

      {/* Doubles Checkbox */}
      <div className="flex items-center space-x-3">
        <input
          id="doubles"
          type="checkbox"
          checked={isDoublesChecked}
          onChange={onDoublesToggle}
          disabled={disabled || doublesDisabled}
          className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary disabled:opacity-50"
        />
        <label
          htmlFor="doubles"
          className={clsx(
            'text-sm font-semibold',
            doublesDisabled ? 'text-gray-400' : 'text-gray-700'
          )}
        >
          Doubles? {doublesDisabled && '(Disabled for first 3 rolls)'}
        </label>
      </div>

      {/* Roll Button */}
      <button
        onClick={onRoll}
        disabled={disabled || !diceSum}
        className={clsx(
          'w-full py-4 rounded-lg font-bold text-lg transition-all min-h-touch',
          disabled || !diceSum
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-secondary text-white hover:bg-secondary/90 active:scale-95 shadow-button'
        )}
      >
        Roll Dice
      </button>
    </div>
  )
}
