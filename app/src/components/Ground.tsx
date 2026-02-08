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
  onDig?: (newDig: boolean, itemFound: boolean) => void
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
        const txSignature = await dig({ 
          x: existingHole.position.x, 
          z: existingHole.position.z 
        })
        
        setHoles(prev => prev.map(hole => 
          hole.id === existingHole.id 
            ? { ...hole, depth: hole.depth + 1 }
            : hole
        ))
        
        console.log(`⛏️ Dug deeper! New depth: ${existingHole.depth + 1}`)
      } else {
        // Create new hole
        const txSignature = await dig({ 
          x: Math.round(clickPos.x), 
          z: Math.round(clickPos.z) 
        })
        
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
      
      // Update parent stats
      onDig?.(true, foundItem)
      
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

      {/* Simple hole rendering */}
      {holes.map(hole => (
        <group key={hole.id}>
          {/* Simple hole - dark circle on ground */}
          <mesh
            position={[hole.position.x, 0.01, hole.position.z]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <circleGeometry args={[0.5, 16]} />
            <meshBasicMaterial color="#2d1b11" />
          </mesh>
          
          {/* Depth indicator - small sphere */}
          {hole.depth > 1 && (
            <mesh position={[hole.position.x, 0.3, hole.position.z]}>
              <sphereGeometry args={[0.1]} />
              <meshBasicMaterial color="#ffd23f" />
            </mesh>
          )}
        </group>
      ))}

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