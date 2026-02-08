# Sloth - CRITICAL PATH: Anchor Deployment 🚨

## Your Mission: Deploy Hole-Digger Program to Devnet

**⚡ YOU ARE THE CRITICAL PATH - EVERYONE WAITS FOR YOU**

### Tasks (Branch: `sloth/devnet-deployment`)

1. **Deploy Existing Program to Devnet** 🎯
   - Use existing `programs/hole-digger/src/lib.rs` 
   - Configure Anchor.toml for devnet deployment
   - Generate new program keypair for devnet
   - Deploy: `anchor deploy --provider.cluster devnet`

2. **Test Core Instructions**
   - Test `initialize_game` - creates game state PDA
   - Test `initialize_player` - creates player PDA 
   - Test `dig` - charges 0.001 SOL, increments depth, emits events
   - Verify events are emitted correctly

3. **Provide Integration Details** 📋
   - Document deployed program ID
   - Document PDA seeds and account structures
   - Create example transaction calls for frontend
   - Test with Phantom wallet on devnet

### Files to Work On
- `Anchor.toml` - configure devnet cluster
- `programs/hole-digger/src/lib.rs` - review and test
- `DEPLOYMENT.md` - create deployment guide
- `tests/` - create devnet integration tests

### Critical Dependencies 
- **Solana CLI** configured for devnet
- **Anchor CLI** installed and working
- **Devnet SOL** for deployment costs
- **Phantom wallet** connected to devnet for testing

### Success Criteria
- ✅ Program deployed to devnet successfully
- ✅ `initialize_player` creates PDA correctly
- ✅ `dig` instruction charges 0.001 SOL + emits events
- ✅ Program ID documented for frontend integration
- ✅ Tested with real wallet transactions

### Integration Requirements for Frontend
```rust
// Program ID (you'll generate this)
pub const PROGRAM_ID: &str = "YOUR_DEPLOYED_PROGRAM_ID";

// PDAs that frontend needs to derive
// Game State: ["game_state"]
// Player: ["player", user_pubkey]
```

**ETA: 01:00 UTC - BLOCKS ALL OTHER WORK** ⏰

**This is the foundation everything else builds on. No pressure! 🔥**