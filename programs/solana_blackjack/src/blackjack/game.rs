use anchor_lang::{ prelude::*, solana_program };
use crate::blackjack::game_state::{ GameState, GameResult };
use crate::utils::card::draw_card;
use crate::utils::score::calculate_score;
use crate::utils::error::ErrorCode;
use solana_program::{
    account_info::AccountInfo,
    pubkey::Pubkey,
    program::invoke,
    program::invoke_signed,
};
use std::ops::{ Mul, Div };

pub fn initialize_game(ctx: Context<InitializeGame>, player: Pubkey) -> Result<()> {
    msg!("Greetings from: {:?}", ctx.program_id);
    msg!("This is the blackjack program");
    let game_result = &ctx.accounts.game.result;

    //can't reinitialize game if game already running
    if game_result.is_some() {
        return Err(ErrorCode::GameRunning.into());
    }

    let game = &mut ctx.accounts.game;
    game.player = player;
    game.player_cards = Vec::with_capacity(GameState::INITIAL_CARD_CAPACITY);
    game.dealer_cards = Vec::with_capacity(GameState::INITIAL_CARD_CAPACITY);
    // game.player_cards = Vec::new();
    // game.dealer_cards = Vec::new();
    game.bet = 0;
    game.result = None;
    game.draw_counter = 0;

    game.log_game_state();

    Ok(())
}

pub fn place_bet(ctx: Context<PlaceBet>, bet_amount: u64) -> Result<()> {
    let game_key = &ctx.accounts.game.key();
    let player_key = &ctx.accounts.player.key();
    let game_result = &ctx.accounts.game.result;

    if game_result.is_some() {
        return Err(ErrorCode::GameRunning.into());
    }

    invoke(
        &solana_program::system_instruction::transfer(&player_key, &game_key, bet_amount),
        &[ctx.accounts.player.to_account_info(), ctx.accounts.game.to_account_info()]
    )?;

    let game = &mut ctx.accounts.game;
    game.bet = bet_amount;
    msg!("Bet placed, amount: {}", bet_amount);
    msg!("Game started, drawing initial cards...");

    if game.bet != 0 {
        //2 cards for player, one for dealer
        let clock = Clock::get().unwrap();
        let slot_bytes = clock.slot.to_le_bytes();

        let first_card = draw_card(&player_key.to_bytes(), &slot_bytes, game.draw_counter);
        game.draw_counter = game.draw_counter.wrapping_add(1);
        msg!("Player's first card is {}", first_card);
        // game.player_cards.push(first_card);
        let second_card = draw_card(&player_key.to_bytes(), &slot_bytes, game.draw_counter);
        game.draw_counter = game.draw_counter.wrapping_add(1);
        // msg!("Player's second card is {}", second_card);
        game.player_cards.push(second_card);

        let dealer_card = draw_card(&player_key.to_bytes(), &slot_bytes, game.draw_counter);
        game.draw_counter = game.draw_counter.wrapping_add(1);
        // msg!("Dealer drew {}", dealer_card);
        game.dealer_cards.push(dealer_card);
    }

    game.log_game_state();

    Ok(())
}

pub fn hit(ctx: Context<Hit>) -> Result<()> {
    let game = &mut ctx.accounts.game;

    if game.bet == 0 {
        return Err(ErrorCode::NoBetPlaced.into());
    }
    if game.result.is_some() {
        return Err(ErrorCode::GameAlreadyEnded.into());
    }

    let player_key = ctx.accounts.player.key().to_bytes();
    let clock = Clock::get().unwrap();
    let slot_bytes = clock.slot.to_le_bytes();

    let card = draw_card(&player_key, &slot_bytes, game.draw_counter);
    game.draw_counter = game.draw_counter.wrapping_add(1);
    msg!("Draw counter {}", game.draw_counter);
    msg!("Player drew {}", card);
    game.player_cards.push(card);
    msg!("Player cards are: ");
    // for c in &game.player_cards {
    //     msg!("Card: {}", c);
    // }
    // msg!("Player score: {}", calculate_score(&game.player_cards));

    game.log_game_state();
    Ok(())
}


// pub fn stand(ctx: Context<Stand>) -> Result<()> {
//     let game_account_info = ctx.accounts.game.to_account_info().clone();
//     let _treasury_account_info = ctx.accounts.game.to_account_info();
//     let game = &mut ctx.accounts.game;

//     let bump = ctx.bumps.game;
//     let _treasury_bump = ctx.bumps.treasury;

//     if game.bet == 0 {
//         return Err(ErrorCode::NoBetPlaced.into());
//     }
//     if game.result.is_some() {
//         return Err(ErrorCode::GameAlreadyEnded.into());
//     }

//     let player_key = ctx.accounts.player.key().to_bytes();
//     let blockhash = Clock::get()?.slot.to_le_bytes();

//     let player_score = calculate_score(&game.player_cards);

//     if player_score > 21 {
//         //player bust
//         game.result = Some(GameResult::DealerWin);
//     } else {
//         while calculate_score(&game.dealer_cards) < 17 {
//             let dealer_card = draw_card(&player_key, &blockhash, game.draw_counter);
//             game.draw_counter = game.draw_counter.wrapping_add(1);
//             game.dealer_cards.push(dealer_card);
//             msg!("Dealer drew {}", dealer_card);
//         }

//         let dealer_score = calculate_score(&game.dealer_cards);
//         if player_score == 21 && dealer_score != 21 {
//             game.result = Some(GameResult::PlayerBlackjack);
//         } else if dealer_score > 21 || player_score > dealer_score {
//             game.result = Some(GameResult::PlayerWin);
//         } else if player_score < dealer_score {
//             game.result = Some(GameResult::DealerWin);
//         } else {
//             game.result = Some(GameResult::Push);
//         }
//     }

//     match game.result {
//         Some(GameResult::PlayerWin) => {
//             msg!("Player win");
//             invoke_signed(
//                 &solana_program::system_instruction::transfer(
//                     game_account_info.to_account_info().key,
//                     &ctx.accounts.player.to_account_info().key,
//                     game.bet.mul(2)
//                 ),
//                 &[game_account_info.to_account_info(), ctx.accounts.player.to_account_info()],
//                 &[&[b"game_pda", ctx.accounts.player.key().as_ref(), &[bump]]]
//             )?;
//         }
//         Some(GameResult::PlayerBlackjack) => {
//             msg!("Player Blackjack");
//             invoke_signed(
//                 &solana_program::system_instruction::transfer(
//                     game_account_info.to_account_info().key,
//                     &ctx.accounts.player.to_account_info().key,
//                     game.bet.mul(3).div(2) //1.5x payout
//                 ),
//                 &[game_account_info.to_account_info(), ctx.accounts.player.to_account_info()],
//                 &[&[b"game_pda", ctx.accounts.player.key().as_ref(), &[bump]]] // PDA signing
//             )?;
//         }
//         Some(GameResult::Push) => {
//             msg!("Push");
//             invoke_signed(
//                 &solana_program::system_instruction::transfer(
//                     game_account_info.to_account_info().key,
//                     ctx.accounts.player.to_account_info().key,
//                     game.bet // Return bet
//                 ),
//                 &[game_account_info.to_account_info(), ctx.accounts.player.to_account_info()],
//                 &[&[b"game_pda", ctx.accounts.player.key().as_ref(), &[bump]]]
//             )?;
//         }
//         //Implement a way to make those funds not withdrawable by the user, to avoid him just withdrawing what he lost
//         Some(GameResult::DealerWin) => {
//             msg!("Dealer win");
//             //Do Nothing
//         }
//         Some(GameResult::PlayerBust) => {
//             msg!("Player bust");
//             //Do nothing
//         }
//         None => {
//             msg!("None pattern");
//         }
//     }

    pub fn stand(ctx: Context<Stand>) -> Result<()> {
        let game_account_info = ctx.accounts.game.to_account_info();
        let game = &mut ctx.accounts.game;
        
        let treasury = &mut ctx.accounts.treasury;

    
        let game_bump = ctx.bumps.game;
        let treasury_bump = ctx.bumps.treasury;
    
        if game.bet == 0 {
            return Err(ErrorCode::NoBetPlaced.into());
        }
        if game.result.is_some() {
            return Err(ErrorCode::GameAlreadyEnded.into());
        }
    
        let player_key = ctx.accounts.player.key().to_bytes();
        let blockhash = Clock::get()?.slot.to_le_bytes();
    
        let player_score = calculate_score(&game.player_cards);
    
        if player_score > 21 {
            // Player busts
            game.result = Some(GameResult::DealerWin);
        } else {
            // Dealer draws cards until score >= 17
            while calculate_score(&game.dealer_cards) < 17 {
                let dealer_card = draw_card(&player_key, &blockhash, game.draw_counter);
                game.draw_counter = game.draw_counter.wrapping_add(1);
                game.dealer_cards.push(dealer_card);
                msg!("Dealer drew {}", dealer_card);
            }
    
            let dealer_score = calculate_score(&game.dealer_cards);
    
            // Determine the outcome
            if player_score == 21 && dealer_score != 21 {
                game.result = Some(GameResult::PlayerBlackjack);
            } else if dealer_score > 21 || player_score > dealer_score {
                game.result = Some(GameResult::PlayerWin);
            } else if player_score < dealer_score {
                game.result = Some(GameResult::DealerWin);
            } else {
                game.result = Some(GameResult::Push);
            }
        }
    
        // Handle payouts based on the result
        match game.result {
            Some(GameResult::PlayerWin) => {
                msg!("Player win");
                // Transfer from treasury to game PDA for payout
                invoke_signed(
                    &solana_program::system_instruction::transfer(
                        ctx.accounts.treasury.to_account_info().key,
                        game_account_info.key,
                        game.bet.mul(2),
                    ),
                    &[
                        ctx.accounts.treasury.to_account_info(),
                        game_account_info.to_account_info(),
                    ],
                    &[&[crate::TREASURY_SEED, &[treasury_bump]]],
                )?;
            }
            Some(GameResult::PlayerBlackjack) => {
                msg!("Player Blackjack");
                // Transfer 1.5x payout from treasury to game PDA
                invoke_signed(
                    &solana_program::system_instruction::transfer(
                        ctx.accounts.treasury.to_account_info().key,
                        game_account_info.key,
                        game.bet.mul(3).div(2),
                    ),
                    &[
                        ctx.accounts.treasury.to_account_info(),
                        game_account_info.to_account_info(),
                    ],
                    &[&[crate::TREASURY_SEED, &[treasury_bump]]],
                )?;
            }
            Some(GameResult::Push) => {
                msg!("Push");
                // Refund bet from game PDA to player
                invoke_signed(
                    &solana_program::system_instruction::transfer(
                        game_account_info.to_account_info().key,
                        ctx.accounts.player.to_account_info().key,
                        game.bet,
                    ),
                    &[
                        game_account_info.to_account_info(),
                        ctx.accounts.player.to_account_info(),
                    ],
                    &[&[b"game_pda", ctx.accounts.player.key().as_ref(), &[game_bump]]],
                )?;
            }
            Some(GameResult::DealerWin) | Some(GameResult::PlayerBust) => {
                msg!("Dealer win or Player bust");
                // Transfer bet from game PDA to treasury
                invoke_signed(
                    &solana_program::system_instruction::transfer(
                        game_account_info.to_account_info().key,
                        ctx.accounts.treasury.to_account_info().key,
                        game.bet,
                    ),
                    &[
                        game_account_info.to_account_info(),
                        ctx.accounts.treasury.to_account_info(),
                    ],
                    &[&[b"game_pda", ctx.accounts.player.key().as_ref(), &[game_bump]]],
                )?;
            }
            None => {
                msg!("None pattern");
            }
        }
    
        // Reset game state
        msg!("Resetting game logic");
        game.player_cards.clear();
        game.dealer_cards.clear();
        game.bet = 0;
        game.result = None;
    
        game.log_game_state();
    
        Ok(())
    }
    


#[derive(Accounts)]
pub struct InitializeGame<'info> {
    #[account(
        init,
        payer = user,
        space = GameState::LEN,
        seeds = [b"game_pda", user.key().as_ref()],
        bump
    )]
    pub game: Account<'info, GameState>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct PlaceBet<'info> {
    #[account(mut, seeds= [b"game_pda", player.key().as_ref()], bump)]
    pub game: Account<'info, GameState>,
    #[account(mut)]
    pub player: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Hit<'info> {
    #[account(mut)]
    pub game: Account<'info, GameState>,
    pub player: Signer<'info>,
}

#[derive(Accounts)]
pub struct Stand<'info> {
    #[account(mut, seeds = [b"game_pda", player.key().as_ref()], bump)]
    pub game: Account<'info, GameState>,
    pub player: Signer<'info>,
    /// CHECK: This is safe because the treasury PDA is verified using the `seeds` attribute.
    #[account(mut, seeds = [crate::TREASURY_SEED], bump)]
    pub treasury: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}
