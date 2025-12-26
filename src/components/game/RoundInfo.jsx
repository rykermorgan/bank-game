import { Hash, Dices } from 'lucide-react'

export function RoundInfo({ currentRound, totalRounds, rollCount }) {
  const isFinalRound = currentRound === totalRounds

  return (
    <div className={`flex items-center justify-between p-4 rounded-2xl border-2 shadow-sm ${
      isFinalRound
        ? 'bg-warning/10 border-warning'
        : 'bg-background-card border-border'
    }`}>
      <div className="flex items-center gap-3">
        <Hash className={`w-5 h-5 ${isFinalRound ? 'text-warning' : 'text-primary'}`} />
        <div>
          <div className="text-[10px] font-bold text-muted uppercase tracking-wider">Round</div>
          <div className={`text-xl font-black ${isFinalRound ? 'text-warning' : 'text-primary'}`}>
            {currentRound}<span className="text-muted">/{totalRounds}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Dices className="w-5 h-5 text-secondary" />
        <div>
          <div className="text-[10px] font-bold text-muted uppercase tracking-wider">Rolls</div>
          <div className="text-xl font-black text-secondary">{rollCount}</div>
        </div>
      </div>
    </div>
  )
}
