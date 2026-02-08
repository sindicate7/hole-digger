#!/bin/bash

# Hole Digger - Devnet Deployment Script
# Run this after Anchor CLI and Solana CLI are fully installed

set -e

echo "🚀 Hole Digger Devnet Deployment"
echo "=================================="

# Source cargo environment
source "$HOME/.cargo/env"

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command -v anchor &> /dev/null; then
    echo "❌ Anchor CLI not found. Installing..."
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    source "$HOME/.cargo/env"
    cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
    avm install 0.30.1
    avm use 0.30.1
fi

if ! command -v solana &> /dev/null; then
    echo "❌ Solana CLI not found. Installing..."
    sh -c "$(curl -sSfL https://release.solana.com/v1.18.26/install)"
    export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
fi

echo "✅ Prerequisites ready"

# Setup Solana config for devnet
echo "🔧 Configuring Solana for devnet..."
solana config set --url devnet

# Check if wallet exists, create if not
if [ ! -f ~/.config/solana/id.json ]; then
    echo "🔑 Creating new wallet..."
    solana-keygen new --outfile ~/.config/solana/id.json --no-bip39-passphrase
else
    echo "✅ Wallet found"
fi

# Show wallet address
WALLET_ADDRESS=$(solana address)
echo "💰 Wallet Address: $WALLET_ADDRESS"

# Airdrop some SOL for deployment fees
echo "💸 Requesting devnet SOL..."
solana airdrop 2 --commitment confirmed || echo "⚠️ Airdrop may have failed, continuing..."

# Wait a moment for balance update
sleep 2

# Check balance
BALANCE=$(solana balance)
echo "💰 Current Balance: $BALANCE"

# Generate program keypair if not exists
if [ ! -f target/deploy/hole_digger-keypair.json ]; then
    echo "🔑 Generating program keypair..."
    solana-keygen new --outfile target/deploy/hole_digger-keypair.json --no-bip39-passphrase
fi

# Update program ID in source
echo "🔧 Updating program ID..."
anchor keys sync

# Build the program
echo "🔨 Building program..."
anchor build

# Deploy to devnet
echo "🚀 Deploying to devnet..."
anchor deploy

# Get deployed program ID
PROGRAM_ID=$(anchor keys list | grep hole_digger | awk '{print $2}')
echo "✅ Program deployed!"
echo "📍 Program ID: $PROGRAM_ID"

# Verify deployment
echo "🔍 Verifying deployment..."
solana program show $PROGRAM_ID

echo ""
echo "🎉 DEPLOYMENT COMPLETE!"
echo "======================================"
echo "Program ID: $PROGRAM_ID"
echo "Network: Devnet"
echo "Wallet: $WALLET_ADDRESS"
echo ""
echo "Next steps:"
echo "1. Update frontend with Program ID: $PROGRAM_ID"
echo "2. Install wallet dependencies: npm install @solana/web3.js @solana/wallet-adapter-react @solana/wallet-adapter-wallets"
echo "3. Test end-to-end flow: wallet connect → dig → explorer check"
echo ""