import { useState } from 'react'
import { useGameStore } from '../../store/gameStore'

export function SetupScreen() {
  const { startNewGame } = useGameStore()

  const [playerNames, setPlayerNames] = useState(['Alice', 'Bob'])
  const [totalRounds, setTotalRounds] = useState(10)
  const [firstThreeRollsRule, setFirstThreeRollsRule] = useState(true)

  const handleAddPlayer = () => {
    if (playerNames.length < 6) {
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
        firstThreeRollsSevenRule: firstThreeRollsRule,
        snarkLevel: 'off',
        audioEnabled: false,
      },
    })
  }

  return (
    <div className="min-h-screen bg-background-light p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-h1 font-bold text-primary mb-2">🎲 Bank Game</h1>
          <p className="text-body text-gray-600">Set up your game</p>
        </div>

        {/* Players */}
        <div className="p-6 bg-white rounded-xl shadow-card space-y-4">
          <h2 className="text-h2 font-bold text-gray-800">Players (2-6)</h2>

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

          {playerNames.length < 6 && (
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

          {/* First 3 Rolls Rule */}
          <div className="flex items-start space-x-3">
            <input
              id="first-three-rule"
              type="checkbox"
              checked={firstThreeRollsRule}
              onChange={e => setFirstThreeRollsRule(e.target.checked)}
              className="mt-1 w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary"
            />
            <label htmlFor="first-three-rule" className="flex-1">
              <div className="font-semibold text-gray-700">First 3 Rolls: 7 = +70</div>
              <div className="text-sm text-gray-600">
                When enabled, rolling a 7 in the first 3 rolls of a round adds 70 points instead
                of ending the round.
              </div>
            </label>
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
