import { useGameStore } from '../../store/gameStore'
import { BankDisplay } from './BankDisplay'
import { PlayerRow } from './PlayerRow'
import { RoundInfo } from './RoundInfo'
import { DiceEntry } from './DiceEntry'

export function GameScreen() {
  const {
    game,
    gameStatus,
    diceSum,
    isDoublesChecked,
    showError,
    errorMessage,
    rollDice,
    bankPlayer,
    nextRound,
    setDiceSum,
    toggleDoubles,
    clearError,
    resetGame,
  } = useGameStore()

  if (!game || !gameStatus) {
    return null
  }

  const isRoundEnded = game.roundEnded
  const isGameEnded = game.status === 'ended'

  return (
    <div className="min-h-screen bg-background-light p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-h1 font-bold text-primary">🎲 Bank Game</h1>
        <button
          onClick={resetGame}
          className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-800"
        >
          New Game
        </button>
      </div>

      {/* Error Message */}
      {showError && (
        <div className="p-4 bg-danger/10 border-2 border-danger rounded-lg">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-danger">{errorMessage}</p>
            <button
              onClick={clearError}
              className="text-danger hover:text-danger/80 font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Round Info */}
      <RoundInfo
        currentRound={game.currentRound}
        totalRounds={game.totalRounds}
        rollCount={game.rollCountInRound}
      />

      {/* Final Round Indicator */}
      {game.currentRound === game.totalRounds && !isRoundEnded && !isGameEnded && (
        <div className="p-3 bg-warning/20 border-2 border-warning rounded-lg text-center">
          <p className="text-lg font-bold text-warning">🏁 Final Round!</p>
        </div>
      )}

      {/* Current Player Turn - Only show if round is active */}
      {!isRoundEnded && !isGameEnded && (
        <div className="p-3 bg-secondary/10 border-2 border-secondary rounded-lg text-center">
          <p className="text-sm font-semibold text-gray-600">Current Turn</p>
          <p className="text-2xl font-bold text-secondary">
            {game.players[game.currentPlayerIndex]?.name}
          </p>
        </div>
      )}

      {/* Bank Display */}
      <BankDisplay bankTotal={game.bankTotal} />

      {/* Game Ended Screen */}
      {isGameEnded && (
        <div className="p-6 bg-gradient-to-br from-accent to-primary rounded-xl shadow-card text-center">
          <h2 className="text-h1 font-bold text-white mb-4">🎉 Game Over!</h2>
          {gameStatus.isTie ? (
            <div>
              <p className="text-xl text-white mb-2">It's a tie!</p>
              <p className="text-2xl font-bold text-white">
                {gameStatus.winners.map(w => w.name).join(', ')} - {gameStatus.winner.totalScore}{' '}
                points
              </p>
            </div>
          ) : (
            <div>
              <p className="text-xl text-white mb-2">Winner:</p>
              <p className="text-3xl font-bold text-white">
                {gameStatus.winner.name} - {gameStatus.winner.totalScore} points
              </p>
            </div>
          )}
          <button
            onClick={resetGame}
            className="mt-6 px-8 py-3 bg-white text-primary font-bold rounded-lg hover:bg-white/90 active:scale-95"
          >
            Play Again
          </button>
        </div>
      )}

      {/* Round Ended - Next Round Button */}
      {isRoundEnded && !isGameEnded && (
        <div className="p-4 bg-warning/10 border-2 border-warning rounded-lg">
          <p className="text-center font-semibold text-warning mb-3">
            {game.currentRound === game.totalRounds ? '🏁 Final round' : `Round ${game.currentRound}`} ended!{' '}
            {game.roundEndReason === 'seven_rolled' ? '7 was rolled!' : 'All players banked!'}
          </p>
          <button
            onClick={nextRound}
            className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 active:scale-95"
          >
            {game.currentRound === game.totalRounds ? 'View Final Results' : 'Next Round'}
          </button>
        </div>
      )}

      {/* Dice Entry - Only show if round is active */}
      {!isRoundEnded && !isGameEnded && (
        <DiceEntry
          diceSum={diceSum}
          onDiceSumChange={setDiceSum}
          isDoublesChecked={isDoublesChecked}
          onDoublesToggle={toggleDoubles}
          onRoll={rollDice}
          disabled={isRoundEnded}
          rollCount={game.rollCountInRound}
        />
      )}

      {/* Players */}
      <div className="space-y-3">
        <h3 className="text-h2 font-bold text-gray-800">Players</h3>
        {game.players.map(player => (
          <PlayerRow
            key={player.id}
            player={player}
            onBank={bankPlayer}
            disabled={isRoundEnded || isGameEnded || game.bankTotal <= 0}
          />
        ))}
      </div>

      {/* Leaderboard */}
      <div className="p-4 bg-white rounded-xl shadow-card">
        <h3 className="text-h2 font-bold text-gray-800 mb-3">Leaderboard</h3>
        <div className="space-y-2">
          {gameStatus.leaderboard.map((player, index) => (
            <div key={player.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-2xl font-bold text-gray-400">#{index + 1}</div>
                <div>
                  <div className="font-semibold">{player.name}</div>
                  {player.banksCount > 0 && (
                    <div className="text-xs text-gray-500">
                      {player.banksCount} banks, best: {player.biggestBank}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-score font-mono font-bold text-primary">
                {player.totalScore}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
