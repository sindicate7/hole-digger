# Gluttony - Frontend-Blockchain Integration 🔗

## Your Mission: Wire Frontend to Chain Events

**⚡ DEPENDS ON: Sloth deployment + Lust frontend**

### Tasks (Branch: `gluttony/chain-integration`)

1. **Event Parsing System** 📡
   - Listen for `DigEvent` and `ItemFound` events from program
   - Parse event data and update UI state  
   - Real-time event subscription via WebSocket
   - Handle event ordering and deduplication

2. **Transaction Confirmation Handling** ✅
   - Monitor transaction status (pending → confirmed → finalized)
   - Show loading states during confirmation  
   - Handle failed transactions gracefully
   - Retry logic for network issues

3. **UI State Synchronization** 🔄
   - Sync on-chain player state with UI
   - Update dig counters from blockchain events
   - Handle multiple players' events (if applicable)
   - Cache recent state for performance

4. **Integration Testing** 🧪
   - End-to-end transaction flow testing
   - Event parsing accuracy validation
   - Performance under high event volume
   - Error recovery scenarios

### Files to Work On
- `app/src/hooks/useEventListener.tsx` - event subscription
- `app/src/hooks/useTransactionStatus.tsx` - tx monitoring
- `app/src/stores/gameState.tsx` - state management
- `app/src/components/TransactionStatus.tsx` - UI feedback
- `app/src/utils/eventParsing.tsx` - event processing

### Integration Points
- **From Sloth**: Event schemas, program ID, account structures
- **From Lust**: Transaction sending, UI state hooks
- **To Frontend**: Real-time updates, confirmation states

### Success Criteria
- ✅ Events parsed correctly in real-time
- ✅ UI updates immediately on transaction confirmation
- ✅ Failed transactions handled without breaking UI
- ✅ Multiple rapid clicks handled gracefully
- ✅ State stays synchronized with blockchain

### Technical Architecture
```js
// Event Flow
Solana Program → WebSocket → Event Parser → State Store → UI Components

// State Management
Zustand/Context for game state
React Query for transaction status
EventSource/WebSocket for real-time events
```

**ETA: 05:00 UTC (after Lust integration)** ⏰

**You're the glue that makes Web3 feel seamless! 🧪**