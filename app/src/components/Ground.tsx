import { useRef } from 'react'
import { Mesh } from 'three'

export function Ground() {
  const meshRef = useRef<Mesh>(null)

  const handleClick = (event: any) => {
    // TODO (Sloth): Implement dig mechanics here
    // - Get click position in world coordinates
    // - Create hole at click location
    // - Update dig counter
    console.log('Clicked ground at:', event.point)
  }

  return (
    <mesh
      ref={meshRef}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, 0]}
      onClick={handleClick}
    >
      {/* Large ground plane */}
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#7db46c" />
    </mesh>
  )
}