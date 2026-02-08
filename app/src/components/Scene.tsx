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
      <Canvas 
        camera={{ position: [5, 5, 5], fov: 75 }}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        
        {/* Simple sky color instead of Environment preset */}
        <color attach="background" args={['#87CEEB']} />
        
        {/* Game Objects */}
        <Ground onDig={onDig} />
        <Player />
        
        {/* Simplified camera controls */}
        <OrbitControls 
          target={[0, 0, 0]}
          enablePan={true}
          minDistance={3}
          maxDistance={15}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  )
}