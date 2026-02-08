# Greed - Asset Pipeline & Sourcing 🎨

## Your Mission: Low-Poly Asset Collection

### Tasks (Branch: `greed/asset-pipeline`)

1. **Character Model**
   - Find CC0 low-poly character (bear, human, robot)
   - Should match reference image aesthetic
   - Convert to .glb/.gltf format for Three.js
   - Replace cube player in `Player.tsx`

2. **Environment Assets**
   - Low-poly tree models (various sizes)
   - Rock/stone models for ground scatter
   - Dirt/grass textures for ground
   - Sky/environment textures

3. **Asset Integration**
   - Create `assets/` folder structure
   - Document licenses and sources
   - Create asset loading utilities
   - Test assets work in scene

### Asset Sources (CC0 License)
- **Kenny Assets**: https://kenney.nl/assets
- **Quaternius**: https://quaternius.com/packs.html
- **Sketchfab CC0**: https://sketchfab.com/features/free-3d-models
- **OpenGameArt**: https://opengameart.org

### Files to Work On
- `app/src/assets/` - create asset folders
- `app/src/components/Player.tsx` - integrate character model
- `app/src/components/Environment.tsx` - trees, rocks
- `app/src/utils/assetLoader.tsx` - loading utilities
- `ASSETS.md` - document sources and licenses

### Success Criteria  
- ✅ Character model replaces cube player
- ✅ Trees and rocks scattered in scene
- ✅ Ground has appealing texture
- ✅ Scene matches low-poly aesthetic from reference
- ✅ All assets properly licensed (CC0)

### Priority Order
1. **Character model** (highest impact)
2. **Ground texture** (visual foundation)  
3. **Tree models** (scene depth)
4. **Rocks/props** (scene detail)

**Target: Assets integrated by 02:00 UTC** 🎯