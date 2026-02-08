import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { Ground } from './Ground'
import { Player } from './Player'

interface SceneProps {
  onDig?: (newDig: boolean, itemFound: boolean) => void
}

export function Scene({ onDig }: SceneProps) {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 8, 12], fov: 60 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} castShadow />
        
        {/* Environment */}
        <Environment preset="sunset" />
        
        {/* Game Objects */}
        <Ground onDig={onDig} />
        <Player />
        
        {/* Camera Controls (for development - can be removed later) */}
        <OrbitControls 
          enablePan={false}
          minDistance={5}
          maxDistance={20}
          maxPolarAngle={Math.PI / 2.2}
        />
      </Canvas>
    </div>
  )
}