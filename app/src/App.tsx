import { useState, useEffect } from 'react'
import { Scene } from './components/Scene'
// import { SolanaWalletProvider } from './components/WalletProvider' // TODO: Uncomment after installing wallet dependencies
import { useHoleDiggerProgram } from './hooks/useHoleDiggerProgram'
import './App.css'

function GameUI() {
  const { wallet, initializePlayer } = useHoleDiggerProgram()
  const [isInitialized, setIsInitialized] = useState(false)
  const [playerStats, setPlayerStats] = useState({
    totalDigs: 0,
    deepestHole: 0,
    itemsFound: 0,
    solSpent: 0
  })

  useEffect(() => {
    // Auto-initialize player when component mounts
    const init = async () => {
      try {
        await initializePlayer()
        setIsInitialized(true)
      } catch (error) {
        console.error('Failed to initialize player:', error)
      }
    }
    init()
  }, [])

  const updateStats = (newDig: boolean, itemFound: boolean) => {
    setPlayerStats(prev => ({
      totalDigs: prev.totalDigs + (newDig ? 1 : 0),
      deepestHole: Math.max(prev.deepestHole, prev.totalDigs + 1),
      itemsFound: prev.itemsFound + (itemFound ? 1 : 0),
      solSpent: prev.solSpent + (newDig ? 0.001 : 0)
    }))
  }
  
  return (
    <div className="app">
      <div className="hud">
        <h1>🕳️ Hole Digger</h1>
        <div className="connection-status">
          {wallet && wallet.connected ? (
            <>
              <p className="wallet-connected">✅ Wallet Connected</p>
              <p className="wallet-address">
                {typeof wallet.publicKey === 'string' ? wallet.publicKey.slice(0, 8) : wallet.publicKey}...
              </p>
            </>
          ) : (
            <p className="wallet-disconnected">⚠️ Wallet Not Connected</p>
          )}
        </div>
        
        <div className="game-info">
          <p>🎮 <strong>WASD</strong> to move, <strong>Click</strong> to dig</p>
          <p>💰 Cost: 0.001 SOL per dig</p>
        </div>

        <div className="stats">
          <div className="stat-item">
            <span className="stat-label">Total Digs</span>
            <span className="stat-value">{playerStats.totalDigs}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Deepest</span>
            <span className="stat-value">{playerStats.deepestHole}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Items Found</span>
            <span className="stat-value">{playerStats.itemsFound}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">SOL Spent</span>
            <span className="stat-value">{playerStats.solSpent.toFixed(3)}</span>
          </div>
        </div>

        {!isInitialized && (
          <div className="initializing">
            <p>⏳ Initializing player account...</p>
          </div>
        )}
      </div>
      <Scene onDig={updateStats} />
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