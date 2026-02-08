# 🕳️ Hole Digger - Full-Stack On-Chain Game

## Overview
Every dig is a real Solana transaction. Click to dig holes, pay 0.001 SOL, see it recorded on-chain forever.

**Inspiration:** Keep Digging on Steam - but 100% decentralized and trustless.

## Tech Stack
- **Frontend:** React + TypeScript + Vite + React Three Fiber
- **Blockchain:** Solana + Anchor + Phantom Wallet
- **3D Engine:** Three.js + React Three Fiber + Drei
- **Aesthetic:** Low-poly, cozy mining game

## Full-Stack Architecture
```
[3D Scene] → [Click] → [Phantom Wallet] → [Solana Tx] → [Hole Appears] → [Explorer Verified]
```

## Overnight MVP Goals

### 🎮 Core Features
- [x] ~~Vite + React + TypeScript + R3F setup~~
- [ ] **Anchor Deployment** (Sloth): Program on devnet, dig instructions working
- [ ] **3D + Wallet** (Lust): R3F scene, Phantom connection, transaction calls
- [ ] **Integration** (Gluttony): Event parsing, UI updates from blockchain
- [ ] **Assets** (Greed): Low-poly character, textures, environment
- [ ] **Security** (Wrath): Audit program, validate transaction safety

### 🎯 Success Criteria
**"Connect wallet → click ground → see hole → check Solana Explorer → dig recorded on-chain"** - Tuna

## Development Setup

```bash
cd app/
npm install
npm run dev
```

## Team Assignments (Updated for Full-Stack)

| Role | Member | Task | Branch | ETA |
|------|---------|------|---------|-----|
| **🚨 CRITICAL PATH** | Sloth | Deploy Anchor program to devnet | `sloth/devnet-deployment` | 01:00 UTC |
| **3D + Wallet** | Lust | R3F scene + Phantom integration | `lust/3d-wallet-integration` | 04:00 UTC |
| **Integration** | Gluttony | Event parsing + UI sync | `gluttony/chain-integration` | 05:00 UTC |
| **Assets** | Greed | CC0 low-poly models/textures | `greed/asset-pipeline` | 02:00 UTC |
| **Security** | Wrath | Anchor audit + transaction safety | - | Ongoing |
| **Documentation** | Envy | Setup guides + troubleshooting | - | Ongoing |

## Asset Sources
- **Kenny Assets**: https://kenney.nl/assets (CC0)
- **Quaternius**: https://quaternius.com/packs.html (CC0)
- **Sketchfab CC0**: https://sketchfab.com/features/free-3d-models

## Protocol
- **30min cycles**: Pull → Work → Commit → Push
- **Silent mode**: GitHub commits over Discord chatter
- **Coordination**: Pride monitors via GitHub API

---
*Target: Playable 3D prototype by morning* 🌅