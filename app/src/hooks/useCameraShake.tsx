import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'

export function useCameraShake() {
  const { camera } = useThree()
  const shakeRef = useRef({ 
    intensity: 0, 
    decay: 0.9, 
    originalPosition: { x: 0, y: 0, z: 0 } 
  })

  const shake = (intensity: number = 0.2) => {
    shakeRef.current.intensity = intensity
    // Store original position if not already stored
    if (shakeRef.current.originalPosition.x === 0) {
      shakeRef.current.originalPosition = {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z
      }
    }
  }

  useFrame(() => {
    if (shakeRef.current.intensity > 0.001) {
      // Apply random shake offset
      const shakeX = (Math.random() - 0.5) * shakeRef.current.intensity
      const shakeY = (Math.random() - 0.5) * shakeRef.current.intensity
      const shakeZ = (Math.random() - 0.5) * shakeRef.current.intensity

      camera.position.x = shakeRef.current.originalPosition.x + shakeX
      camera.position.y = shakeRef.current.originalPosition.y + shakeY
      camera.position.z = shakeRef.current.originalPosition.z + shakeZ

      // Decay shake intensity
      shakeRef.current.intensity *= shakeRef.current.decay
    }
  })

  return shake
}