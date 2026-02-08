use anchor_lang::prelude::*;
use anchor_lang::system_program::{Transfer, transfer};

declare_id!("11111111111111111111111111111111");

const DIG_FEE: u64 = 1_000_000; // 0.001 SOL in lamports

#[program]
pub mod hole_digger {
    use super::*;

    /// Initialize the global game state
    pub fn initialize_game(ctx: Context<InitializeGame>) -> Result<()> {
        let game_state = &mut ctx.accounts.game_state;
        game_state.treasury = ctx.accounts.treasury.key();
        game_state.total_digs = 0;
        game_state.total_players = 0;
        game_state.deepest_hole = 0;
        game_state.deepest_player = Pubkey::default();
        Ok(())
    }

    /// Initialize a new player account
    pub fn initialize_player(ctx: Context<InitializePlayer>) -> Result<()> {
        let player = &mut ctx.accounts.player;
        let game_state = &mut ctx.accounts.game_state;
        
        player.owner = ctx.accounts.user.key();
        player.hole_depth = 0;
        player.total_digs = 0;
        player.items_found = 0;
        player.bronze_items = 0;
        player.silver_items = 0;
        player.gold_items = 0;
        player.diamond_items = 0;
        player.created_at = Clock::get()?.unix_timestamp;
        
        // Update global stats
        game_state.total_players += 1;
        
        Ok(())
    }

    /// Dig deeper into the hole
    pub fn dig(ctx: Context<Dig>) -> Result<()> {
        let player = &mut ctx.accounts.player;
        let game_state = &mut ctx.accounts.game_state;
        
        // Transfer dig fee to treasury
        let transfer_ctx = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            Transfer {
                from: ctx.accounts.user.to_account_info(),
                to: ctx.accounts.treasury.to_account_info(),
            },
        );
        transfer(transfer_ctx, DIG_FEE)?;
        
        // Increment dig stats
        player.hole_depth += 1;
        player.total_digs += 1;
        game_state.total_digs += 1;
        
        // Update leaderboard if this is the deepest hole
        if player.hole_depth > game_state.deepest_hole {
            game_state.deepest_hole = player.hole_depth;
            game_state.deepest_player = player.owner;
        }

        // Random item discovery based on dig depth and randomness
        let clock = Clock::get()?;
        let random_seed = (clock.unix_timestamp as u64)
            .wrapping_mul(player.total_digs)
            .wrapping_add(player.hole_depth);
        
        let item_chance = random_seed % 100;
        
        if item_chance < 5 {  // 5% chance for any item
            player.items_found += 1;
            
            // Determine item rarity
            match item_chance {
                0 => {
                    player.diamond_items += 1;
                    emit!(ItemFound {
                        player: player.owner,
                        item_type: ItemType::Diamond,
                        hole_depth: player.hole_depth,
                    });
                },
                1..=2 => {
                    player.gold_items += 1;
                    emit!(ItemFound {
                        player: player.owner,
                        item_type: ItemType::Gold,
                        hole_depth: player.hole_depth,
                    });
                },
                3..=4 => {
                    player.silver_items += 1;
                    emit!(ItemFound {
                        player: player.owner,
                        item_type: ItemType::Silver,
                        hole_depth: player.hole_depth,
                    });
                },
                _ => {
                    player.bronze_items += 1;
                    emit!(ItemFound {
                        player: player.owner,
                        item_type: ItemType::Bronze,
                        hole_depth: player.hole_depth,
                    });
                },
            }
        }

        emit!(DigEvent {
            player: player.owner,
            new_depth: player.hole_depth,
            total_digs: player.total_digs,
            fee_paid: DIG_FEE,
        });

        Ok(())
    }

    /// Get leaderboard data (view function)
    pub fn get_leaderboard(ctx: Context<GetLeaderboard>) -> Result<()> {
        // This is mainly for emitting current leaderboard state
        let game_state = &ctx.accounts.game_state;
        
        emit!(LeaderboardUpdate {
            deepest_player: game_state.deepest_player,
            deepest_hole: game_state.deepest_hole,
            total_digs: game_state.total_digs,
            total_players: game_state.total_players,
        });
        
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeGame<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + GameState::LEN,
        seeds = [b"game_state"],
        bump
    )]
    pub game_state: Account<'info, GameState>,
    /// CHECK: This account is used as treasury
    pub treasury: AccountInfo<'info>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct InitializePlayer<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + PlayerAccount::LEN,
        seeds = [b"player", user.key().as_ref()],
        bump
    )]
    pub player: Account<'info, PlayerAccount>,
    #[account(
        mut,
        seeds = [b"game_state"],
        bump
    )]
    pub game_state: Account<'info, GameState>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Dig<'info> {
    #[account(
        mut,
        seeds = [b"player", user.key().as_ref()],
        bump
    )]
    pub player: Account<'info, PlayerAccount>,
    #[account(
        mut,
        seeds = [b"game_state"],
        bump
    )]
    pub game_state: Account<'info, GameState>,
    /// CHECK: This is the treasury account that receives fees
    #[account(mut)]
    pub treasury: AccountInfo<'info>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct GetLeaderboard<'info> {
    #[account(
        seeds = [b"game_state"],
        bump
    )]
    pub game_state: Account<'info, GameState>,
}

#[account]
pub struct GameState {
    pub treasury: Pubkey,
    pub total_digs: u64,
    pub total_players: u64,
    pub deepest_hole: u64,
    pub deepest_player: Pubkey,
}

impl GameState {
    pub const LEN: usize = 32 + 8 + 8 + 8 + 32;
}

#[account]
pub struct PlayerAccount {
    pub owner: Pubkey,
    pub hole_depth: u64,
    pub total_digs: u64,
    pub items_found: u32,
    pub bronze_items: u32,
    pub silver_items: u32, 
    pub gold_items: u32,
    pub diamond_items: u32,
    pub created_at: i64,
}

impl PlayerAccount {
    pub const LEN: usize = 32 + 8 + 8 + 4 + 4 + 4 + 4 + 4 + 8;
}

#[event]
pub struct DigEvent {
    pub player: Pubkey,
    pub new_depth: u64,
    pub total_digs: u64,
    pub fee_paid: u64,
}

#[event]
pub struct ItemFound {
    pub player: Pubkey,
    pub item_type: ItemType,
    pub hole_depth: u64,
}

#[event]
pub struct LeaderboardUpdate {
    pub deepest_player: Pubkey,
    pub deepest_hole: u64,
    pub total_digs: u64,
    pub total_players: u64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum ItemType {
    Bronze,
    Silver,
    Gold,
    Diamond,
}