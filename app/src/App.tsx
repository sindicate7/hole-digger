import { Scene } from './components/Scene'
// import { SolanaWalletProvider } from './components/WalletProvider' // TODO: Uncomment after installing wallet dependencies
import { useHoleDiggerProgram } from './hooks/useHoleDiggerProgram'
import './App.css'

function GameUI() {
  const { wallet } = useHoleDiggerProgram()
  
  return (
    <div className="app">
      <div className="hud">
        <h1>🕳️ Hole Digger</h1>
        <div className="wallet-status">
          {wallet ? (
            <p>✅ Wallet: {wallet.toString().slice(0, 8)}...</p>
          ) : (
            <p>⚠️ Wallet: Not connected</p>
          )}
        </div>
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

function App() {
  // TODO: Wrap with SolanaWalletProvider after installing dependencies
  return <GameUI />
  
  // return (
  //   <SolanaWalletProvider>
  //     <GameUI />
  //   </SolanaWalletProvider>
  // )
}

export default App