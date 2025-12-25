import { useGameStore } from './store/gameStore'
import { SetupScreen } from './components/game/SetupScreen'
import { GameScreen } from './components/game/GameScreen'

function App() {
  const game = useGameStore(state => state.game)

  return game ? <GameScreen /> : <SetupScreen />
}

export default App
