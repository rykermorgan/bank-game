export function RoundInfo({ currentRound, totalRounds, rollCount }) {
  const isFinalRound = currentRound === totalRounds

  return (
    <div className={`flex items-center justify-between p-3 rounded-lg shadow-card ${
      isFinalRound ? 'bg-warning/10 border-2 border-warning' : 'bg-white'
    }`}>
      <div>
        <div className="text-xs text-gray-600">Round</div>
        <div className={`text-xl font-bold ${isFinalRound ? 'text-warning' : 'text-primary'}`}>
          {isFinalRound && '🏁 '}
          {currentRound} / {totalRounds}
        </div>
      </div>

      <div>
        <div className="text-xs text-gray-600">Roll Count</div>
        <div className="text-xl font-bold text-secondary">{rollCount}</div>
      </div>
    </div>
  )
}
