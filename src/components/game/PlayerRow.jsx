import clsx from 'clsx'

export function PlayerRow({ player, onBank, disabled }) {
  const isLocked = player.bankedThisRound

  return (
    <div
      className={clsx(
        'flex items-center justify-between p-4 rounded-xl transition-all',
        isLocked ? 'bg-success/10 border-2 border-success' : 'bg-white shadow-card'
      )}
    >
      <div className="flex-1">
        <div className="font-bold text-lg">{player.name}</div>
        <div className="text-sm text-gray-600">
          Score: <span className="font-mono font-semibold">{player.totalScore}</span>
        </div>
        {player.banksCount > 0 && (
          <div className="text-xs text-gray-500">
            Banks: {player.banksCount} | Best: {player.biggestBank}
            {player.streakCount > 0 && ` | Streak: ${player.streakCount}`}
          </div>
        )}
      </div>

      <button
        onClick={() => onBank(player.id)}
        disabled={disabled || isLocked}
        className={clsx(
          'px-6 py-3 rounded-lg font-bold text-lg transition-all min-w-touch min-h-touch',
          isLocked
            ? 'bg-success text-white cursor-not-allowed'
            : disabled
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-primary text-white hover:bg-primary/90 active:scale-95 shadow-button'
        )}
      >
        {isLocked ? 'LOCKED' : 'BANK'}
      </button>
    </div>
  )
}
