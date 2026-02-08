use anchor_lang::prelude::*;

declare_id!("11111111111111111111111111111111");

#[program]
pub mod hole_digger {
    use super::*;

    /// Initialize a new player account
    pub fn initialize_player(ctx: Context<InitializePlayer>) -> Result<()> {
        let player = &mut ctx.accounts.player;
        player.owner = ctx.accounts.user.key();
        player.hole_depth = 0;
        player.total_digs = 0;
        player.items_found = vec![];
        Ok(())
    }

    /// Dig deeper into the hole
    pub fn dig(ctx: Context<Dig>) -> Result<()> {
        let player = &mut ctx.accounts.player;
        
        // Increment dig stats
        player.hole_depth += 1;
        player.total_digs += 1;

        // Random chance to find items (simplified for now)
        let clock = Clock::get()?;
        if clock.unix_timestamp % 10 == 0 {
            player.items_found.push("bronze".to_string());
        }

        // Transfer dig fee to treasury
        // TODO: Implement SOL transfer

        Ok(())
    }
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
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct PlayerAccount {
    pub owner: Pubkey,
    pub hole_depth: u64,
    pub total_digs: u64,
    pub items_found: Vec<String>,
}

impl PlayerAccount {
    pub const LEN: usize = 32 + 8 + 8 + 4 + (32 * 10); // Conservative estimate
}