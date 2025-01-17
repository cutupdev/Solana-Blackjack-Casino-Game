use anchor_lang::{prelude::*, solana_program};
use crate::utils::error::ErrorCode;
use solana_program::{
    account_info::AccountInfo,
    pubkey::Pubkey,
    program::invoke,
    program::invoke_signed,
};
use crate::blackjack::game_state::GameState;



// pub fn add_funds(ctx: Context<AddFunds>, lamports: u64) -> Result<()>{

//     if ctx.accounts.funder.key() != ctx.accounts.game.player{
//         return Err(ErrorCode::Unauthorized.into())
//     }

//     invoke(
//         &solana_program::system_instruction::transfer(
//             ctx.accounts.funder.key,
//             &ctx.accounts.game.key(),
//             lamports,
//         ),
//         &[ctx.accounts.funder.to_account_info(), ctx.accounts.game.to_account_info()],
//     )?;

//     ctx.accounts.game.log_game_state();

//     Ok(())
// }


// pub fn add_funds(ctx: Context<AddFunds>, lamports: u64) -> Result<()> {
//     // Ensure the funder is the player associated with the game
//     if ctx.accounts.funder.key() != ctx.accounts.game.player {
//         return Err(ErrorCode::Unauthorized.into());
//     }

//     // Transfer lamports from the funder's account to the game PDA
//     let funder_account = &ctx.accounts.funder.to_account_info();
//     let game_account = &ctx.accounts.game.to_account_info();

//     // Ensure the funder has enough lamports
//     let funder_balance = **funder_account.lamports.borrow();
//     if funder_balance < lamports {
//         return Err(ErrorCode::InsufficientPlayerFunds.into());
//     }

//     // Perform the lamports transfer
//     **funder_account.lamports.borrow_mut() -= lamports;
//     **game_account.lamports.borrow_mut() += lamports;

//     // Log the updated game state
//     ctx.accounts.game.log_game_state();

//     Ok(())
// }


// pub fn withdraw_funds(ctx: Context<WithdrawFunds>, amount: u64) -> Result<()> {
//     let game = &ctx.accounts.game;
//     if ctx.accounts.player.key() != game.player {
//         return Err(ErrorCode::Unauthorized.into());
//     }
//     if ctx.accounts.game.result.is_some() {
//         return Err(ErrorCode::GameRunning.into());
//     }

//     invoke_signed(
//         &solana_program::system_instruction::transfer(
//             ctx.accounts.game.to_account_info().key,
//             &ctx.accounts.player.to_account_info().key,
//             amount,
//         ),
//         &[
//             ctx.accounts.game.to_account_info(),
//             ctx.accounts.player.to_account_info(),
//         ],
//         &[&[b"game_pda", ctx.accounts.player.key().as_ref(), &[ctx.bumps.game]]],
//     )?;
//     game.log_game_state();

//     Ok(())
// }
// //This is for debugging, must be removed when final deploy


pub fn add_funds(ctx: Context<AddFunds>, lamports: u64) -> Result<()> {
    // Ensure the funder is the player associated with the game
    if ctx.accounts.funder.key() != ctx.accounts.game.player {
        return Err(ErrorCode::Unauthorized.into());
    }

    // Use `system_instruction::transfer` to move funds
    invoke(
        &solana_program::system_instruction::transfer(
            ctx.accounts.funder.key,
            ctx.accounts.game.to_account_info().key,
            lamports,
        ),
        &[
            ctx.accounts.funder.to_account_info(),
            ctx.accounts.game.to_account_info(),
        ],
    )?;

    // Log the updated game state
    ctx.accounts.game.log_game_state();

    Ok(())
}

pub fn withdraw_funds(ctx: Context<WithdrawFunds>, amount: u64) -> Result<()> {
    let game =  &ctx.accounts.game;

    // Ensure the player is authorized to withdraw funds
    if ctx.accounts.player.key() != game.player {
        return Err(ErrorCode::Unauthorized.into());
    }

    // Ensure there is no active game
    if game.result.is_some() {
        return Err(ErrorCode::GameRunning.into());
    }

    // Ensure the game account has enough lamports to withdraw
    let game_balance = **ctx.accounts.game.to_account_info().lamports.borrow();
    if game_balance < amount {
        return Err(ErrorCode::InsufficientPlayerFunds.into());
    }

    // Transfer lamports directly by adjusting balances
    **ctx.accounts.game.to_account_info().lamports.borrow_mut() -= amount;
    **ctx.accounts.player.to_account_info().lamports.borrow_mut() += amount;

    // Log the updated game state
    game.log_game_state();

    Ok(())
}





pub fn reset_game(ctx: Context<ResetGame>) -> Result<()> {
    // Since the account will be closed (and lamports transferred automatically),
    // we only need to log that the reset was successful.
    msg!("Game account closed, and remaining lamports transferred to the player.");

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
    #[account(address = anchor_lang::system_program::ID)]
    pub system_program: Program<'info, System>,
}
// pub struct ResetGame<'info> {
//     #[account(mut, seeds = [b"game_pda", player.key().as_ref()], bump, close = player)]
//     pub game: Account<'info, GameState>,
//     #[account(mut)]
//     pub player: Signer<'info>,
//     #[account(address=anchor_lang::system_program::ID)]
//     pub system_program: Program<'info, System>,
// }
