import clsx from 'clsx'
import { User, Lock, TrendingUp } from 'lucide-react'

export function PlayerRow({ player, onBank, disabled }) {
  const isLocked = player.bankedThisRound

  return (
    <div
      className={clsx(
        'flex items-center justify-between p-3 rounded-xl transition-all duration-200',
        isLocked
          ? 'bg-success/10'
          : 'bg-background/50 hover:bg-background/80'
      )}
    >
      <div className="flex items-center gap-3 flex-1">
        <div className={clsx(
          "w-10 h-10 rounded-full flex items-center justify-center transition-all",
          isLocked ? "bg-success/20" : "bg-primary/10 group-hover:bg-primary/20"
        )}>
          {isLocked ? <Lock className="w-5 h-5 text-success" /> : <User className="w-5 h-5 text-primary" />}
        </div>
        <div className="flex-1">
          <div className="font-bold text-lg text-text">{player.name}</div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-3 h-3 text-primary" />
            <span className="font-mono font-bold text-primary">{player.totalScore}</span>
            {player.banksCount > 0 && (
              <span className="text-muted">· {player.banksCount} banks</span>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={() => onBank(player.id)}
        disabled={disabled || isLocked}
        className={clsx(
          'px-6 py-3 rounded-xl font-bold text-base transition-all duration-150 min-w-touch min-h-touch border-2',
          isLocked
            ? 'bg-success text-white border-success-hover cursor-not-allowed'
            : disabled
              ? 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed'
              : 'bg-primary text-white border-primary-hover hover:bg-primary-hover hover:-translate-y-0.5 active:translate-y-0'
        )}
      >
        {isLocked ? '✓ LOCKED' : 'BANK'}
      </button>
    </div>
  )
}
