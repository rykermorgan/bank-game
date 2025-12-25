export function RoundInfo({ currentRound, totalRounds, rollCount }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-card">
      <div>
        <div className="text-sm text-gray-600">Round</div>
        <div className="text-2xl font-bold text-primary">
          {currentRound} / {totalRounds}
        </div>
      </div>

      <div>
        <div className="text-sm text-gray-600">Roll Count</div>
        <div className="text-2xl font-bold text-secondary">{rollCount}</div>
      </div>
    </div>
  )
}
