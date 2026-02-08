import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh, Vector3 } from 'three'

export function Player() {
  const meshRef = useRef<Mesh>(null)
  const position = useRef(new Vector3(0, 0.5, 0))
  const keys = useRef({
    w: false,
    a: false,
    s: false,
    d: false
  })

  // TODO (Lust): Implement WASD movement
  // - Add keyboard event listeners
  // - Update position based on key states
  // - Move camera to follow player (third-person)
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'KeyW':
          keys.current.w = true
          break
        case 'KeyA':
          keys.current.a = true
          break
        case 'KeyS':
          keys.current.s = true
          break
        case 'KeyD':
          keys.current.d = true
          break
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'KeyW':
          keys.current.w = false
          break
        case 'KeyA':
          keys.current.a = false
          break
        case 'KeyS':
          keys.current.s = false
          break
        case 'KeyD':
          keys.current.d = false
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  useFrame((state, delta) => {
    if (!meshRef.current) return

    // Movement speed
    const speed = 3 * delta

    // Update position based on keys
    if (keys.current.w) position.current.z -= speed
    if (keys.current.s) position.current.z += speed
    if (keys.current.a) position.current.x -= speed
    if (keys.current.d) position.current.x += speed

    // Keep player on ground
    position.current.y = 0.5

    // Apply position to mesh
    meshRef.current.position.copy(position.current)
  })

  return (
    <mesh ref={meshRef} position={[0, 0.5, 0]}>
      {/* Simple cube player for now - TODO (Greed): Replace with character model */}
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#8B4513" />
    </mesh>
  )
}