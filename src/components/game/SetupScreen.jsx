import { useState } from 'react'
import { useGameStore } from '../../store/gameStore'

export function SetupScreen() {
  const { startNewGame } = useGameStore()

  const [playerNames, setPlayerNames] = useState(['Player 1', 'Player 2'])
  const [totalRounds, setTotalRounds] = useState(10)

  const handleAddPlayer = () => {
    if (playerNames.length < 50) {
      setPlayerNames([...playerNames, ''])
    }
  }

  const handleRemovePlayer = index => {
    if (playerNames.length > 2) {
      setPlayerNames(playerNames.filter((_, i) => i !== index))
    }
  }

  const handlePlayerNameChange = (index, value) => {
    const newNames = [...playerNames]
    newNames[index] = value
    setPlayerNames(newNames)
  }

  const handleStartGame = () => {
    // Filter out empty names and create player objects
    const validPlayers = playerNames
      .filter(name => name.trim())
      .map((name, index) => ({
        id: `player-${index + 1}`,
        name: name.trim(),
      }))

    if (validPlayers.length < 2) {
      alert('Please enter at least 2 player names')
      return
    }

    startNewGame({
      players: validPlayers,
      totalRounds,
      settings: {
        firstThreeRollsSevenRule: true, // Always enabled - it's the normal rule
        snarkLevel: 'off',
        audioEnabled: false,
      },
    })
  }

  return (
    <div className="min-h-screen bg-background-light p-4">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Header */}
        <div className="text-center py-4">
          <h1 className="text-2xl font-bold text-primary">🎲 Bank Game</h1>
        </div>

        {/* Players */}
        <div className="p-6 bg-white rounded-xl shadow-card space-y-4">
          <h2 className="text-h2 font-bold text-gray-800">Players</h2>

          {playerNames.map((name, index) => (
            <div key={index} className="flex items-center space-x-3">
              <input
                type="text"
                value={name}
                onChange={e => handlePlayerNameChange(index, e.target.value)}
                placeholder={`Player ${index + 1} name`}
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              />
              {playerNames.length > 2 && (
                <button
                  onClick={() => handleRemovePlayer(index)}
                  className="px-4 py-3 bg-danger text-white font-semibold rounded-lg hover:bg-danger/90"
                >
                  Remove
                </button>
              )}
            </div>
          ))}

          {playerNames.length < 50 && (
            <button
              onClick={handleAddPlayer}
              className="w-full py-3 border-2 border-dashed border-gray-300 text-gray-600 font-semibold rounded-lg hover:border-primary hover:text-primary"
            >
              + Add Player
            </button>
          )}
        </div>

        {/* Game Settings */}
        <div className="p-6 bg-white rounded-xl shadow-card space-y-4">
          <h2 className="text-h2 font-bold text-gray-800">Settings</h2>

          {/* Total Rounds */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Number of Rounds
            </label>
            <div className="flex space-x-3">
              {[10, 15, 20].map(rounds => (
                <button
                  key={rounds}
                  onClick={() => setTotalRounds(rounds)}
                  className={`flex-1 py-3 rounded-lg font-bold transition-all ${
                    totalRounds === rounds
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {rounds}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStartGame}
          className="w-full py-4 bg-secondary text-white font-bold text-lg rounded-lg hover:bg-secondary/90 active:scale-95 shadow-button"
        >
          Start Game
        </button>
      </div>
    </div>
  )
}
