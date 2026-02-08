# Sloth - Dig Mechanics Core ⛏️

## Your Mission: Click-to-Dig Implementation

### Tasks (Branch: `sloth/dig-mechanics`)

1. **Hole Visualization**
   - Create hole meshes when ground is clicked
   - Use sphere subtraction OR place hole geometry
   - Make holes visible and varied in size
   - Store hole positions to prevent overlap

2. **Dig Counter System**
   - Track total digs in app state
   - Update HUD counter in real-time
   - Track individual hole depths (click same spot = deeper)
   - Local storage persistence (optional)

3. **Click Detection**
   - Improve ground click handling in `Ground.tsx`
   - Get accurate world coordinates from click
   - Visual feedback on click (particle effect optional)

### Files to Work On
- `app/src/components/Ground.tsx` - main dig logic
- `app/src/components/Hole.tsx` - create this for hole geometry
- `app/src/App.tsx` - state management for dig counter
- `app/src/hooks/useDigs.tsx` - custom hook (optional)

### Success Criteria
- ✅ Click ground = hole appears
- ✅ Multiple holes can exist
- ✅ HUD shows dig count
- ✅ Clicking same spot makes deeper holes

### Technical Approach Options
1. **Geometry Subtraction**: Use CSG operations (complex)
2. **Hole Meshes**: Place dark cylinders/spheres at click points (simple)
3. **Terrain Modification**: Modify ground vertices (advanced)

**Recommend starting with option 2 (hole meshes) for MVP**

**Target: Working dig mechanics by 05:00 UTC** 🎯