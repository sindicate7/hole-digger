import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { HoleDigger } from "../target/types/hole_digger";
import { PublicKey, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { expect } from "chai";

describe("hole-digger", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.HoleDigger as Program<HoleDigger>;
  
  let gameState: PublicKey;
  let playerAccount: PublicKey;
  let treasury: PublicKey;

  before(async () => {
    // Derive PDAs
    [gameState] = await PublicKey.findProgramAddress(
      [Buffer.from("game_state")],
      program.programId
    );

    [playerAccount] = await PublicKey.findProgramAddress(
      [Buffer.from("player"), provider.wallet.publicKey.toBuffer()],
      program.programId
    );

    // Create treasury keypair
    treasury = anchor.web3.Keypair.generate().publicKey;
  });

  it("Initializes the game", async () => {
    try {
      await program.methods
        .initializeGame()
        .accounts({
          gameState,
          treasury,
          authority: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      const gameStateAccount = await program.account.gameState.fetch(gameState);
      expect(gameStateAccount.treasury.toString()).to.equal(treasury.toString());
      expect(gameStateAccount.totalDigs.toString()).to.equal("0");
      expect(gameStateAccount.totalPlayers.toString()).to.equal("0");
    } catch (error) {
      console.log("Error initializing game:", error);
      throw error;
    }
  });

  it("Initializes a player", async () => {
    try {
      await program.methods
        .initializePlayer()
        .accounts({
          player: playerAccount,
          gameState,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      const player = await program.account.playerAccount.fetch(playerAccount);
      expect(player.owner.toString()).to.equal(provider.wallet.publicKey.toString());
      expect(player.holeDepth.toString()).to.equal("0");
      expect(player.totalDigs.toString()).to.equal("0");
    } catch (error) {
      console.log("Error initializing player:", error);
      throw error;
    }
  });

  it("Performs a dig action", async () => {
    const initialBalance = await provider.connection.getBalance(treasury);
    
    try {
      await program.methods
        .dig()
        .accounts({
          player: playerAccount,
          gameState,
          treasury,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      const player = await program.account.playerAccount.fetch(playerAccount);
      const gameStateAccount = await program.account.gameState.fetch(gameState);
      const finalBalance = await provider.connection.getBalance(treasury);

      expect(player.holeDepth.toString()).to.equal("1");
      expect(player.totalDigs.toString()).to.equal("1");
      expect(gameStateAccount.totalDigs.toString()).to.equal("1");
      expect(finalBalance - initialBalance).to.equal(1_000_000); // 0.001 SOL fee
    } catch (error) {
      console.log("Error performing dig:", error);
      throw error;
    }
  });

  it("Updates leaderboard when player digs deeper", async () => {
    // Dig multiple times to become the leader
    for (let i = 0; i < 5; i++) {
      await program.methods
        .dig()
        .accounts({
          player: playerAccount,
          gameState,
          treasury,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
    }

    const gameStateAccount = await program.account.gameState.fetch(gameState);
    expect(gameStateAccount.deepestHole.toString()).to.equal("6");
    expect(gameStateAccount.deepestPlayer.toString()).to.equal(
      provider.wallet.publicKey.toString()
    );
  });
});