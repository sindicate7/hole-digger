# Lust - 3D Scene + Wallet Integration 🎮💳

## Your Mission: Frontend with Real Solana Integration

**⚡ DEPENDS ON: Sloth's devnet deployment**

### Tasks (Branch: `lust/3d-wallet-integration`)

1. **Phantom Wallet Connection** 🦌
   - Install: `@solana/wallet-adapter-react @solana/wallet-adapter-wallets`
   - Set up WalletProvider with Phantom adapter
   - Add wallet connect/disconnect UI
   - Configure for devnet cluster

2. **Enhanced 3D Scene** (build on existing)
   - Improve WASD movement (smooth, responsive)
   - Polish third-person camera following
   - Better ground texture and lighting
   - Visual feedback for clickable areas

3. **Dig Instruction Integration** ⛏️
   - On ground click → call hole-digger program
   - Build and send `dig` instruction 
   - Handle transaction confirmation
   - Show hole visualization on successful tx

4. **Transaction Flow**
   ```js
   Click Ground → Get Phantom Signature → Send Tx → Wait Confirmation → Show Hole
   ```

### Files to Work On
- `app/src/components/WalletProvider.tsx` - wallet setup
- `app/src/components/Player.tsx` - enhanced movement
- `app/src/components/Ground.tsx` - click → dig transaction
- `app/src/hooks/useDigInstruction.tsx` - transaction logic
- `app/src/utils/solana.tsx` - connection & program setup

### Dependencies from Sloth
- **Program ID** on devnet
- **PDA derivation** details (game_state, player)  
- **Instruction format** for dig calls
- **Event structure** for parsing

### Success Criteria
- ✅ Wallet connects to devnet successfully
- ✅ 3D scene has smooth movement and camera
- ✅ Ground click triggers real Solana transaction
- ✅ Hole appears after transaction confirmation
- ✅ Error handling for failed transactions

### Technical Stack
```js
// Wallet Integration
@solana/wallet-adapter-react
@solana/web3.js
@coral-xyz/anchor (client)

// 3D Scene (existing)
@react-three/fiber
@react-three/drei
three.js
```

**ETA: 04:00 UTC (after Sloth deployment)** ⏰

**You're building the user experience that makes blockchain feel magical! ✨**