import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { Ground } from './Ground'
import { Player } from './Player'

export function Scene() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 5, 10], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        
        {/* Environment */}
        <Environment preset="sunset" />
        
        {/* Game Objects */}
        <Ground />
        <Player />
        
        {/* Camera Controls (temporary for development) */}
        <OrbitControls />
      </Canvas>
    </div>
  )
}