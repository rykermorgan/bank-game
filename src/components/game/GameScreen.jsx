import clsx from 'clsx'
import { Undo2, RotateCcw, Hash, Trophy, User } from 'lucide-react'
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
    undo,
    canUndo,
  } = useGameStore()

  if (!game || !gameStatus) {
    return null
  }

  const isRoundEnded = game.roundEnded
  const isGameEnded = game.status === 'ended'

  return (
    <div className="min-h-screen p-4 relative" style={{ backgroundColor: '#F5F5F5' }}>
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <h1 className="text-2xl font-black text-primary whitespace-nowrap">Bank</h1>
        <div className="flex items-center gap-2">
          {canUndo() && (
            <button
              onClick={undo}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-bold text-secondary hover:text-secondary-hover transition-colors whitespace-nowrap"
            >
              <Undo2 size={16} />
              Undo
            </button>
          )}
          <button
            onClick={resetGame}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-bold text-muted hover:text-text transition-colors whitespace-nowrap"
          >
            <RotateCcw size={16} />
            New
          </button>
        </div>
      </div>

      {/* Error Message */}
      {showError && (
        <div className="p-4 bg-danger/10 border-2 border-danger rounded-lg mb-4">
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

      {/* Round Info - Transform into round-end message instead of hiding */}
      {!isGameEnded && !isRoundEnded && (
        <div className="mb-4">
          <RoundInfo
            currentRound={game.currentRound}
            totalRounds={game.totalRounds}
            rollCount={game.rollCountInRound}
          />
        </div>
      )}

      {/* Round end message */}
      {isRoundEnded && !isGameEnded && (
        <div className="p-3 bg-warning/10 border border-warning rounded-2xl text-center mb-4">
          <p className="text-sm font-bold text-warning">
            {game.currentRound === game.totalRounds ? 'Final round' : `Round ${game.currentRound}`} ended!{' '}
            {game.roundEndReason === 'seven_rolled' ? '7 was rolled!' : 'All players banked!'}
          </p>
        </div>
      )}

      {/* Bank Display with Current Turn nested inside */}
      <div className="mb-4">
        <BankDisplay
          bankTotal={game.bankTotal}
          currentPlayerName={game.players[game.currentPlayerIndex]?.name}
          showCurrentTurn={!isRoundEnded && !isGameEnded}
        />
      </div>

      {/* Game Ended Screen */}
      {isGameEnded && (
        <div className="p-6 bg-gradient-to-br from-primary to-secondary rounded-2xl text-center mb-4">
          <h2 className="text-h1 font-black text-white mb-4">Game Over!</h2>
          {gameStatus.isTie ? (
            <div>
              <p className="text-lg font-bold text-white/90 mb-2">It's a tie!</p>
              <p className="text-2xl font-black text-white">
                {gameStatus.winners.map(w => w.name).join(', ')} · {gameStatus.winner.totalScore} points
              </p>
            </div>
          ) : (
            <div>
              <p className="text-lg font-bold text-white/90 mb-2">Winner</p>
              <p className="text-3xl font-black text-white">
                {gameStatus.winner.name}
              </p>
              <p className="text-xl font-bold text-white/90 mt-1">
                {gameStatus.winner.totalScore} points
              </p>
            </div>
          )}
          <button
            onClick={resetGame}
            className="mt-6 px-8 py-3 bg-white text-primary font-bold rounded-xl hover:scale-105 active:scale-100 transition-all duration-150"
          >
            Play Again
          </button>
        </div>
      )}

      {/* Next Round Button - Only show when round ends */}
      {isRoundEnded && !isGameEnded && (
        <div className="mb-4">
          <button
            onClick={nextRound}
            className="w-full py-4 bg-primary text-white font-bold text-lg rounded-xl hover:bg-primary-hover active:scale-95 transition-all duration-150"
          >
            {game.currentRound === game.totalRounds ? 'View Final Results' : 'Next Round'}
          </button>
        </div>
      )}

      {/* Dice Entry - Only show if round is active */}
      {!isRoundEnded && !isGameEnded && (
        <div className="mb-4">
          <DiceEntry
            diceSum={diceSum}
            onDiceSumChange={setDiceSum}
            isDoublesChecked={isDoublesChecked}
            onDoublesToggle={toggleDoubles}
            onRoll={rollDice}
            disabled={isRoundEnded}
            rollCount={game.rollCountInRound}
          />
        </div>
      )}

      {/* Players - consolidated into single card */}
      <div className="p-4 bg-background-card rounded-3xl shadow-lg border-2 border-border mt-6">
        <div className="flex items-center gap-2 mb-3">
          <User className="w-5 h-5 text-primary" />
          <h3 className="text-h2 font-black text-text">Players</h3>
        </div>
        <div className="space-y-2">
          {game.players.map(player => (
            <PlayerRow
              key={player.id}
              player={player}
              onBank={bankPlayer}
              disabled={isRoundEnded || isGameEnded || game.bankTotal <= 0}
            />
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="p-4 bg-background-card rounded-3xl shadow-lg border-2 border-border mt-6">
        <div className="flex items-center gap-2 mb-3">
          <Trophy className="w-5 h-5 text-primary" />
          <h3 className="text-h2 font-black text-text">Leaderboard</h3>
        </div>
        <div className="space-y-2">
          {gameStatus.leaderboard.map((player, index) => (
            <div key={player.id} className="flex items-center justify-between p-3 rounded-xl bg-background/50">
              <div className="flex items-center space-x-3">
                <div className={clsx(
                  "text-xl font-black w-8 text-center",
                  index === 0 ? "text-primary" : index === 1 ? "text-secondary" : "text-muted"
                )}>
                  {index + 1}
                </div>
                <div>
                  <div className="font-bold text-text">{player.name}</div>
                  {player.banksCount > 0 && (
                    <div className="text-xs text-muted">
                      {player.banksCount} banks · best: {player.biggestBank}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-score font-mono font-black text-primary">
                {player.totalScore}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
