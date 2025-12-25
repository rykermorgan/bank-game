export function RoundInfo({ currentRound, totalRounds, rollCount, firstThreeRollsRule }) {
  const isInFirstThree = rollCount < 3
  const showSevenWarning = rollCount >= 3

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

      <div className="text-right">
        {isInFirstThree && firstThreeRollsRule ? (
          <div className="text-xs text-success font-semibold">
            First 3 rolls: 7 = +70
          </div>
        ) : showSevenWarning ? (
          <div className="text-xs text-danger font-semibold">⚠️ 7 ends round!</div>
        ) : (
          <div className="text-xs text-gray-400">Roll the dice</div>
        )}
      </div>
    </div>
  )
}
