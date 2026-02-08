import { useRef, useState } from 'react'
import { Mesh } from 'three'
import { useHoleDiggerProgram } from '../hooks/useHoleDiggerProgram'

interface Hole {
  id: string
  position: { x: number, z: number }
  depth: number
}

export function Ground() {
  const meshRef = useRef<Mesh>(null)
  const [holes, setHoles] = useState<Hole[]>([])
  const [isDigging, setIsDigging] = useState(false)
  const { dig } = useHoleDiggerProgram()

  const handleClick = async (event: any) => {
    if (isDigging) return
    
    const clickPos = event.point
    console.log('Clicked ground at:', clickPos)
    
    try {
      setIsDigging(true)
      
      // Call dig transaction
      const txSignature = await dig({ 
        x: Math.round(clickPos.x), 
        z: Math.round(clickPos.z) 
      })
      
      console.log('Dig transaction:', txSignature)
      
      // Add hole to local state (will be replaced with chain state)
      const newHole: Hole = {
        id: Date.now().toString(),
        position: { x: clickPos.x, z: clickPos.z },
        depth: 1
      }
      setHoles(prev => [...prev, newHole])
      
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
      >
        {/* Large ground plane */}
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial 
          color={isDigging ? "#6aa552" : "#7db46c"}
          transparent={isDigging}
          opacity={isDigging ? 0.8 : 1.0}
        />
      </mesh>

      {/* Render holes */}
      {holes.map(hole => (
        <mesh
          key={hole.id}
          position={[hole.position.x, -0.1, hole.position.z]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <cylinderGeometry args={[0.5, 0.3, 0.2, 8]} />
          <meshStandardMaterial color="#2d1b11" />
        </mesh>
      ))}
    </group>
  )
}