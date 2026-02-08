import { useRef, useState } from 'react'
import { Mesh } from 'three'
import { useHoleDiggerProgram } from '../hooks/useHoleDiggerProgram'
import { useCameraShake } from '../hooks/useCameraShake'
import { useSoundEffects } from '../hooks/useSoundEffects'
import { DigParticles } from './DigParticles'

interface Hole {
  id: string
  position: { x: number, z: number }
  depth: number
  createdAt: number
}

interface ParticleBurst {
  id: string
  position: [number, number, number]
  trigger: number
}

interface GroundProps {
  onDig?: (newDig: boolean, itemFound: boolean, currentMaxDepth?: number) => void
}

export function Ground({ onDig }: GroundProps) {
  const meshRef = useRef<Mesh>(null)
  const [holes, setHoles] = useState<Hole[]>([])
  const [isDigging, setIsDigging] = useState(false)
  const [particleBursts, setParticleBursts] = useState<ParticleBurst[]>([])
  const { dig } = useHoleDiggerProgram()
  const shake = useCameraShake()
  const { playDigSound, playItemFoundSound, playAmbientSound } = useSoundEffects()

  // Helper function to get material color based on depth
  const getDepthColor = (depth: number) => {
    if (depth <= 3) return "#7db46c" // grass/topsoil
    if (depth <= 10) return "#8B4513" // dirt
    if (depth <= 20) return "#CD853F" // clay
    return "#696969" // stone
  }

  // Helper function to get hole interior color based on depth
  const getHoleInteriorColor = (depth: number) => {
    if (depth <= 3) return "#2F1B14"
    if (depth <= 10) return "#1a1208" 
    if (depth <= 20) return "#4A2C17"
    return "#1C1C1C"
  }

  // Create particle burst effect
  const createParticleBurst = (position: { x: number, z: number }) => {
    const newBurst: ParticleBurst = {
      id: Date.now().toString(),
      position: [position.x, 0.2, position.z],
      trigger: Date.now()
    }
    setParticleBursts(prev => [...prev, newBurst])
    
    // Remove particle burst after animation
    setTimeout(() => {
      setParticleBursts(prev => prev.filter(burst => burst.id !== newBurst.id))
    }, 3000)
  }

  const handleClick = async (event: any) => {
    if (isDigging) return
    
    const clickPos = event.point
    console.log('🌍 Clicked ground at:', clickPos)
    
    try {
      setIsDigging(true)
      
      // Check if clicking on existing hole
      const existingHole = holes.find(hole => 
        Math.abs(hole.position.x - clickPos.x) < 1 && 
        Math.abs(hole.position.z - clickPos.z) < 1
      )
      
      if (existingHole) {
        // Dig deeper in existing hole
        const newDepth = existingHole.depth + 1;
        const txSignature = await dig({ 
          x: existingHole.position.x, 
          z: existingHole.position.z 
        }, newDepth)
        
        setHoles(prev => prev.map(hole => 
          hole.id === existingHole.id 
            ? { ...hole, depth: newDepth }
            : hole
        ))
        
        // Create particle burst, camera shake, and sound
        createParticleBurst(existingHole.position)
        shake(newDepth > 10 ? 0.3 : 0.2) // Bigger shake for deeper holes
        playDigSound(newDepth)
        
        // Play ambient sound for deep holes
        if (newDepth > 5) {
          playAmbientSound(newDepth)
        }
        
        console.log(`⛏️ Dug deeper! New depth: ${newDepth}m`)
      } else {
        // Create new hole
        const roundedPos = { x: Math.round(clickPos.x), z: Math.round(clickPos.z) }
        const txSignature = await dig(roundedPos, 1)
        
        const newHole: Hole = {
          id: Date.now().toString(),
          position: roundedPos,
          depth: 1,
          createdAt: Date.now()
        }
        setHoles(prev => [...prev, newHole])
        
        // Create particle burst, camera shake, and sound
        createParticleBurst(roundedPos)
        shake(0.15)
        playDigSound(1)
        
        console.log('🕳️ New hole created!')
      }
      
      // Simulate item finding (5% chance, higher at depth)
      const itemChance = 0.05 + (Math.max(...holes.map(h => h.depth), 1) * 0.01)
      const foundItem = Math.random() < itemChance
      
      // Play item found sound if discovered
      if (foundItem) {
        const items = ['Bronze Coin', 'Silver Gem', 'Gold Nugget', 'Diamond Crystal']
        const maxDepth = Math.max(...holes.map(h => h.depth), 1)
        const rarity = Math.min(Math.floor(maxDepth / 3), items.length - 1)
        const foundItemType = items[rarity]
        playItemFoundSound(foundItemType)
      }
      
      // Get current max depth across all holes
      const maxDepth = Math.max(...holes.map(h => h.depth), existingHole ? existingHole.depth + 1 : 1)
      
      // Update parent stats
      onDig?.(true, foundItem, maxDepth)
      
    } catch (error) {
      console.error('Dig failed:', error)
    } finally {
      setIsDigging(false)
    }
  }

  return (
    <group>
      {/* Main ground plane - adaptive color based on deepest hole */}
      <mesh
        ref={meshRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        onClick={handleClick}
        receiveShadow
      >
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial 
          color={isDigging ? "#6aa552" : getDepthColor(Math.max(...holes.map(h => h.depth), 0))}
          transparent={isDigging}
          opacity={isDigging ? 0.8 : 1.0}
        />
      </mesh>

      {/* Enhanced 3D Holes with interior lighting */}
      {holes.map(hole => {
        const holeDepth = hole.depth * 0.6; // Each dig = 0.6 units deep (more dramatic)
        const holeRadius = 0.25 + (hole.depth * 0.03); // Progressive widening
        const interiorColor = getHoleInteriorColor(hole.depth);
        
        return (
          <group key={hole.id}>
            {/* Interior point light for deep holes */}
            {hole.depth > 5 && (
              <pointLight
                position={[hole.position.x, -holeDepth * 0.7, hole.position.z]}
                color="#FF6B35"
                intensity={0.5}
                distance={2}
                decay={2}
              />
            )}
            
            {/* Main hole cylinder - going DOWN */}
            <mesh
              position={[hole.position.x, -holeDepth/2, hole.position.z]}
              castShadow
            >
              <cylinderGeometry args={[holeRadius, holeRadius * 0.7, holeDepth, 16]} />
              <meshStandardMaterial 
                color={interiorColor}
                transparent
                opacity={0.95}
                roughness={0.8}
                metalness={0.1}
              />
            </mesh>
            
            {/* Hole rim with depth-based color */}
            <mesh
              position={[hole.position.x, 0.01, hole.position.z]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <ringGeometry args={[holeRadius, holeRadius + 0.08, 20]} />
              <meshStandardMaterial 
                color={getDepthColor(hole.depth)}
                roughness={0.9}
              />
            </mesh>
            
            {/* Deep hole bottom with gradient */}
            <mesh
              position={[hole.position.x, -holeDepth + 0.02, hole.position.z]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <circleGeometry args={[holeRadius * 0.7, 16]} />
              <meshBasicMaterial 
                color={hole.depth > 10 ? "#2D1810" : "#0A0604"} 
              />
            </mesh>
            
            {/* Floating depth indicator */}
            {hole.depth > 2 && (
              <group>
                <mesh position={[hole.position.x, 0.3 + (hole.depth * 0.02), hole.position.z + 0.4]}>
                  <sphereGeometry args={[0.06]} />
                  <meshBasicMaterial color="#FFD700" />
                </mesh>
                {/* Depth text effect - glowing orb gets brighter for deeper holes */}
                <pointLight
                  position={[hole.position.x, 0.3, hole.position.z + 0.4]}
                  color="#FFD700"
                  intensity={hole.depth * 0.1}
                  distance={1}
                />
              </group>
            )}
            
            {/* Realistic dirt mounds */}
            <mesh
              position={[hole.position.x, 0.02, hole.position.z]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <ringGeometry args={[holeRadius + 0.08, holeRadius + 0.2, 16]} />
              <meshStandardMaterial 
                color={getDepthColor(hole.depth)}
                transparent
                opacity={0.6}
                roughness={1.0}
              />
            </mesh>
          </group>
        );
      })}

      {/* Particle effects for all active bursts */}
      {particleBursts.map(burst => (
        <DigParticles
          key={burst.id}
          position={burst.position}
          trigger={burst.trigger}
        />
      ))}

      {/* Enhanced digging effect with particles */}
      {isDigging && (
        <group>
          <mesh position={[0, 0.15, 0]}>
            <sphereGeometry args={[0.15]} />
            <meshBasicMaterial color="#ffd23f" transparent opacity={0.7} />
          </mesh>
          <pointLight
            position={[0, 0.15, 0]}
            color="#FFD700"
            intensity={0.8}
            distance={1}
          />
        </group>
      )}
    </group>
  )
}