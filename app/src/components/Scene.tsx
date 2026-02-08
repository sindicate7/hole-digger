import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Ground } from './Ground'
import { Player } from './Player'
import * as THREE from 'three'

interface SceneProps {
  onDig?: (newDig: boolean, itemFound: boolean) => void
}

export function Scene({ onDig }: SceneProps) {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas 
        camera={{ position: [6, 4, 8], fov: 75 }}
        gl={{ antialias: true, shadowMap: { enabled: true, type: THREE.PCFSoftShadowMap } }}
        shadows
      >
        {/* Enhanced lighting setup */}
        <ambientLight intensity={0.4} color="#e6f3ff" />
        <directionalLight 
          position={[15, 20, 10]} 
          intensity={1.2} 
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-far={50}
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
        />
        
        {/* Underground ambient for depth feeling */}
        <hemisphereLight
          skyColor="#87CEEB"
          groundColor="#8B4513"
          intensity={0.3}
        />
        
        {/* Atmospheric fog for depth */}
        <fog attach="fog" args={['#87CEEB', 10, 50]} />
        
        {/* Gradient sky background */}
        <color attach="background" args={['#B8E6FF']} />
        
        {/* Game Objects */}
        <Ground onDig={onDig} />
        <Player />
        
        {/* Enhanced camera controls */}
        <OrbitControls 
          target={[0, 0, 0]}
          enablePan={true}
          minDistance={2}
          maxDistance={20}
          maxPolarAngle={Math.PI / 2.1}
          enableDamping
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  )
}