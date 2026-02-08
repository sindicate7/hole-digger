#!/bin/bash

set -e

echo "🐳 Docker Solana Deployment"
echo "=========================="

# Show wallet address
WALLET_ADDRESS=$(solana address)
echo "💰 Wallet Address: $WALLET_ADDRESS"

# Request airdrop for deployment fees
echo "💸 Requesting devnet SOL..."
solana airdrop 2 --commitment confirmed || echo "⚠️ Airdrop may have failed, continuing..."

# Wait for balance update
sleep 3

# Check balance
BALANCE=$(solana balance)
echo "💰 Current Balance: $BALANCE"

# Sync program IDs
echo "🔧 Syncing program IDs..."
anchor keys sync

# Deploy to devnet
echo "🚀 Deploying to devnet..."
anchor deploy --provider.cluster devnet

# Get program ID
PROGRAM_ID=$(anchor keys list | grep hole_digger | awk '{print $2}')
echo ""
echo "✅ DEPLOYMENT SUCCESS!"
echo "===================="
echo "Program ID: $PROGRAM_ID"
echo "Network: Devnet" 
echo "Wallet: $WALLET_ADDRESS"
echo ""

# Save program ID to file for host access
echo $PROGRAM_ID > /workspace/PROGRAM_ID.txt

# Verify deployment
echo "🔍 Verifying deployment..."
solana program show $PROGRAM_ID || echo "⚠️ Verification failed but deployment may be successful"

echo "🎉 Ready for frontend integration!"