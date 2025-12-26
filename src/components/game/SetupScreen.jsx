import { useState } from 'react'
import { Users, Hash, Plus, X, Play } from 'lucide-react'
import { useGameStore } from '../../store/gameStore'

export function SetupScreen() {
  const { startNewGame, savedPlayerNames } = useGameStore()

  // Use saved player names from previous game if available, otherwise default
  const initialPlayerNames = savedPlayerNames.length >= 2
    ? savedPlayerNames
    : ['Player 1', 'Player 2']

  const [playerNames, setPlayerNames] = useState(initialPlayerNames)
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
    <div className="min-h-screen p-4 space-y-4" style={{ backgroundColor: '#F5F5F5' }}>
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Header */}
        <div className="text-center py-2">
          <h1 className="text-2xl font-black text-primary">Bank</h1>
          <p className="text-sm text-muted mt-1">Set up your game</p>
        </div>

        {/* Players */}
        <div className="p-4 bg-background-card rounded-3xl shadow-lg border-2 border-border space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-5 h-5 text-primary" />
            <h2 className="text-h2 font-black text-text">Players</h2>
          </div>

          {playerNames.map((name, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                id={`player-name-${index}`}
                name={`player-${index}`}
                value={name}
                onChange={e => handlePlayerNameChange(index, e.target.value)}
                placeholder={`Player ${index + 1} name`}
                aria-label={`Player ${index + 1} name`}
                className="flex-1 px-4 py-3 border-2 border-border rounded-xl font-semibold text-text focus:outline-none focus:border-primary transition-all duration-150"
              />
              {playerNames.length > 2 && (
                <button
                  onClick={() => handleRemovePlayer(index)}
                  aria-label={`Remove player ${index + 1}`}
                  className="p-3 bg-danger text-white rounded-xl hover:bg-danger-hover transition-all duration-150 border-2 border-danger-hover"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}

          {playerNames.length < 50 && (
            <button
              onClick={handleAddPlayer}
              className="w-full py-3 border-2 border-dashed border-border text-muted font-bold rounded-xl hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-150 flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Player
            </button>
          )}
        </div>

        {/* Game Settings */}
        <div className="p-4 bg-background-card rounded-3xl shadow-lg border-2 border-border space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Hash className="w-5 h-5 text-secondary" />
            <h2 className="text-h2 font-black text-text">Rounds</h2>
          </div>

          <div className="flex gap-2">
            {[10, 15, 20].map(rounds => (
              <button
                key={rounds}
                onClick={() => setTotalRounds(rounds)}
                className={`flex-1 py-3 rounded-xl font-bold text-lg transition-all duration-150 border-2 ${
                  totalRounds === rounds
                    ? 'bg-secondary text-white border-secondary-hover'
                    : 'bg-white text-text border-border hover:border-secondary hover:-translate-y-0.5 active:translate-y-0'
                }`}
              >
                {rounds}
              </button>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStartGame}
          className="w-full py-4 bg-primary text-white font-bold text-lg rounded-xl hover:bg-primary-hover active:scale-95 transition-all duration-150 border-2 border-primary-hover flex items-center justify-center gap-2"
        >
          <Play className="w-5 h-5" />
          Start Game
        </button>
      </div>
    </div>
  )
}
