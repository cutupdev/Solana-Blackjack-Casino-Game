use anchor_lang::{prelude::*, solana_program};
use crate::utils::error::ErrorCode;
use solana_program::{
    account_info::AccountInfo,
    pubkey::Pubkey,
    program::invoke,
    program::invoke_signed,
};
use crate::blackjack::game_state::GameState;



pub fn add_funds(ctx: Context<AddFunds>, lamports: u64) -> Result<()>{

    if ctx.accounts.funder.key() != ctx.accounts.game.player{
        return Err(ErrorCode::Unauthorized.into())
    }

    invoke(
        &solana_program::system_instruction::transfer(
            ctx.accounts.funder.key,
            &ctx.accounts.game.key(),
            lamports,
        ),
        &[ctx.accounts.funder.to_account_info(), ctx.accounts.game.to_account_info()],
    )?;

    ctx.accounts.game.log_game_state();

    Ok(())
}

pub fn withdraw_funds(ctx: Context<WithdrawFunds>, amount: u64) -> Result<()> {
    let game = &ctx.accounts.game;
    if ctx.accounts.player.key() != game.player {
        return Err(ErrorCode::Unauthorized.into());
    }
    if ctx.accounts.game.result.is_some() {
        return Err(ErrorCode::GameRunning.into());
    }

    invoke_signed(
        &solana_program::system_instruction::transfer(
            ctx.accounts.game.to_account_info().key,
            &ctx.accounts.player.to_account_info().key,
            amount,
        ),
        &[
            ctx.accounts.game.to_account_info(),
            ctx.accounts.player.to_account_info(),
        ],
        &[&[b"game_pda", ctx.accounts.player.key().as_ref(), &[ctx.bumps.game]]],
    )?;
    game.log_game_state();

    Ok(())
}
//This is for debugging, must be removed when final deploy

pub fn reset_game(ctx: Context<ResetGame>)->Result<()>{
    

    let pda_balance = **ctx.accounts.game.to_account_info().lamports.borrow();
    **ctx.accounts.game.to_account_info().lamports.borrow_mut() -= pda_balance;
    **ctx.accounts.player.to_account_info().lamports.borrow_mut() += pda_balance;

    // Clear game state

    let game =&mut ctx.accounts.game;
    game.player = Pubkey::default();
    game.player_cards.clear();
    game.dealer_cards.clear();
    game.bet = 0;
    game.result = None;
    game.draw_counter = 0;

    msg!("Game and player data reset successfully.");

    game.log_game_state();

    Ok(())
}



#[derive(Accounts)]
pub struct AddFunds<'info> {
    #[account(mut, seeds = [b"game_pda", funder.key().as_ref()], bump)]
    pub game: Account<'info, GameState>,
    #[account(mut)]
    pub funder: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct WithdrawFunds<'info> {
    #[account(mut, seeds = [b"game_pda", player.key().as_ref()], bump)]
    pub game: Account<'info, GameState>,
    #[account(mut)]
    pub player: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ResetGame<'info> {
    #[account(mut, seeds = [b"game_pda", player.key().as_ref()], bump, close = player)]
    pub game: Account<'info, GameState>,
    #[account(mut)]
    pub player: Signer<'info>,
    #[account(address=anchor_lang::system_program::ID)]
    pub system_program: Program<'info, System>,
}
