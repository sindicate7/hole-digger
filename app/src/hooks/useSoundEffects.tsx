import { useCallback } from 'react'

// Simple sound effect system
// TODO: Replace with actual audio implementation (Howler.js or Web Audio API)
export function useSoundEffects() {
  const playDigSound = useCallback((depth: number = 1) => {
    // Mock sound effect - will be replaced with real audio
    console.log(`🔊 Playing dig sound (depth: ${depth}) - pitch: ${1 - (depth * 0.1)}`)
    
    // Different pitch based on depth
    const pitch = Math.max(0.5, 1 - (depth * 0.05))
    const volume = Math.min(1, 0.3 + (depth * 0.02))
    
    console.log(`🎵 Dig sound: pitch=${pitch.toFixed(2)}, volume=${volume.toFixed(2)}`)
  }, [])

  const playItemFoundSound = useCallback((itemType: string) => {
    console.log(`🎉 Playing item found sound: ${itemType}`)
    
    // Different sounds for different items
    const soundMap: Record<string, string> = {
      'Bronze Coin': '🔔 *ting*',
      'Silver Gem': '✨ *sparkle*',
      'Gold Nugget': '💰 *ka-ching*',
      'Diamond Crystal': '💎 *magical chime*'
    }
    
    console.log(`🔊 ${soundMap[itemType] || '🎵 *generic chime*'}`)
  }, [])

  const playAmbientSound = useCallback((depth: number) => {
    if (depth > 10) {
      console.log('🎵 Playing deep underground ambient - rumbling sounds')
    } else if (depth > 5) {
      console.log('🎵 Playing underground ambient - muffled surface sounds')
    }
  }, [])

  return {
    playDigSound,
    playItemFoundSound,
    playAmbientSound
  }
}