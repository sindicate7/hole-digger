import { Scene } from './components/Scene'
import './App.css'

function App() {
  return (
    <div className="app">
      <div className="hud">
        <h1>🕳️ Hole Digger</h1>
        <p>WASD to move, Click to dig</p>
        <div className="stats">
          <span>Digs: 0</span>
          <span>Depth: 0</span>
        </div>
      </div>
      <Scene />
    </div>
  )
}

export default App