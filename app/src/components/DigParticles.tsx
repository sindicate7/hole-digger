import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

interface DigParticlesProps {
  position: [number, number, number]
  trigger: number // increment to trigger new burst
}

export function DigParticles({ position, trigger }: DigParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null)
  const [particles, setParticles] = useState<Float32Array>(new Float32Array(0))
  const [velocities, setVelocities] = useState<Float32Array>(new Float32Array(0))
  const [life, setLife] = useState<Float32Array>(new Float32Array(0))
  const [maxLife, setMaxLife] = useState<Float32Array>(new Float32Array(0))

  // Create particle burst on trigger change
  useEffect(() => {
    if (trigger === 0) return

    const particleCount = 50
    const newParticles = new Float32Array(particleCount * 3)
    const newVelocities = new Float32Array(particleCount * 3)
    const newLife = new Float32Array(particleCount)
    const newMaxLife = new Float32Array(particleCount)

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3

      // Start position (at dig location)
      newParticles[i3] = position[0] + (Math.random() - 0.5) * 0.5
      newParticles[i3 + 1] = position[1] + Math.random() * 0.2
      newParticles[i3 + 2] = position[2] + (Math.random() - 0.5) * 0.5

      // Velocity (burst upward and outward)
      newVelocities[i3] = (Math.random() - 0.5) * 4
      newVelocities[i3 + 1] = Math.random() * 6 + 2
      newVelocities[i3 + 2] = (Math.random() - 0.5) * 4

      // Particle lifetime
      newLife[i] = Math.random() * 2 + 1
      newMaxLife[i] = newLife[i]
    }

    setParticles(newParticles)
    setVelocities(newVelocities)
    setLife(newLife)
    setMaxLife(newMaxLife)
  }, [trigger, position])

  // Animate particles
  useFrame((state, delta) => {
    if (!pointsRef.current || particles.length === 0) return

    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array
    const particleCount = particles.length / 3

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3

      if (life[i] > 0) {
        // Update positions
        positions[i3] += velocities[i3] * delta
        positions[i3 + 1] += velocities[i3 + 1] * delta
        positions[i3 + 2] += velocities[i3 + 2] * delta

        // Apply gravity
        velocities[i3 + 1] -= 9.8 * delta

        // Reduce life
        life[i] -= delta

        // Fade out as life decreases
        const opacity = life[i] / maxLife[i]
        if (pointsRef.current.material instanceof THREE.PointsMaterial) {
          pointsRef.current.material.opacity = Math.max(opacity, 0.1)
        }
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  if (particles.length === 0) return null

  return (
    <Points
      ref={pointsRef}
      positions={particles}
      stride={3}
    >
      <PointMaterial
        transparent
        opacity={0.8}
        size={0.05}
        sizeAttenuation
        color="#8B4513"
        alphaTest={0.1}
      />
    </Points>
  )
}