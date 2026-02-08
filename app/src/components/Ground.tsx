import { useRef, useState } from 'react'
import { Mesh } from 'three'
import { useHoleDiggerProgram } from '../hooks/useHoleDiggerProgram'

interface Hole {
  id: string
  position: { x: number, z: number }
  depth: number
  createdAt: number
}

interface GroundProps {
  onDig?: (newDig: boolean, itemFound: boolean, currentMaxDepth?: number) => void
}

export function Ground({ onDig }: GroundProps) {
  const meshRef = useRef<Mesh>(null)
  const [holes, setHoles] = useState<Hole[]>([])
  const [isDigging, setIsDigging] = useState(false)
  const { dig } = useHoleDiggerProgram()

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
        
        console.log(`⛏️ Dug deeper! New depth: ${newDepth}m`)
      } else {
        // Create new hole
        const txSignature = await dig({ 
          x: Math.round(clickPos.x), 
          z: Math.round(clickPos.z) 
        }, 1)
        
        const newHole: Hole = {
          id: Date.now().toString(),
          position: { x: clickPos.x, z: clickPos.z },
          depth: 1,
          createdAt: Date.now()
        }
        setHoles(prev => [...prev, newHole])
        
        console.log('🕳️ New hole created!')
      }
      
      // Simulate item finding (5% chance)
      const foundItem = Math.random() < 0.05
      
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
      {/* Main ground plane */}
      <mesh
        ref={meshRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        onClick={handleClick}
        receiveShadow
      >
        {/* Large ground plane */}
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial 
          color={isDigging ? "#6aa552" : "#7db46c"}
          transparent={isDigging}
          opacity={isDigging ? 0.8 : 1.0}
        />
      </mesh>

      {/* 3D Holes going DOWN into the ground */}
      {holes.map(hole => {
        const holeDepth = hole.depth * 0.5; // Each dig = 0.5 units deep
        const holeRadius = 0.3 + (hole.depth * 0.05); // Slightly wider as deeper
        
        return (
          <group key={hole.id}>
            {/* Actual 3D hole - cylinder going DOWN */}
            <mesh
              position={[hole.position.x, -holeDepth/2, hole.position.z]}
            >
              <cylinderGeometry args={[holeRadius, holeRadius * 0.8, holeDepth, 12]} />
              <meshStandardMaterial 
                color="#1a1208" 
                transparent
                opacity={0.9}
              />
            </mesh>
            
            {/* Hole opening rim - makes edge visible */}
            <mesh
              position={[hole.position.x, 0.02, hole.position.z]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <ringGeometry args={[holeRadius, holeRadius + 0.05, 16]} />
              <meshStandardMaterial color="#3d2a11" />
            </mesh>
            
            {/* Dark bottom of hole - creates depth illusion */}
            <mesh
              position={[hole.position.x, -holeDepth + 0.01, hole.position.z]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <circleGeometry args={[holeRadius * 0.8, 16]} />
              <meshBasicMaterial color="#0d0802" />
            </mesh>
            
            {/* Depth indicator floating above hole */}
            {hole.depth > 1 && (
              <mesh position={[hole.position.x, 0.4, hole.position.z + 0.3]}>
                <sphereGeometry args={[0.08]} />
                <meshBasicMaterial color="#ffd23f" />
              </mesh>
            )}
            
            {/* Dirt pile around hole edges */}
            <mesh
              position={[hole.position.x, 0.05, hole.position.z]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <ringGeometry args={[holeRadius + 0.05, holeRadius + 0.15, 16]} />
              <meshStandardMaterial 
                color="#6B5B3D" 
                transparent
                opacity={0.7}
              />
            </mesh>
          </group>
        );
      })}

      {/* Digging effect */}
      {isDigging && (
        <mesh position={[0, 0.1, 0]}>
          <sphereGeometry args={[0.2]} />
          <meshBasicMaterial color="#ffd23f" transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  )
}