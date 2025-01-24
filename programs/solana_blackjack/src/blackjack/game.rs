use anchor_lang::{ prelude::*, solana_program };
use crate::blackjack::game_state::{ GameState, GameResult };
use crate::utils::card::{card_to_value, draw_from_deck, initialize_deck};
use crate::utils::score::calculate_score;
use crate::utils::error::ErrorCode;
use solana_program::{
    account_info::AccountInfo,
    pubkey::Pubkey,
    program::invoke,
};



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
    game.bet = 0;
    game.result = None;
    game.draw_counter = 0;
    game.deck = initialize_deck();

    game.log_game_state();

    Ok(())
}

pub fn place_bet(ctx: Context<GameContext>, bet_amount: u64) -> Result<()> {
    let game_key = &ctx.accounts.game.key();
    let player_key = &ctx.accounts.player.key();
    let game_result = &ctx.accounts.game.result;

    let treasury_balance = **ctx.accounts.treasury.to_account_info().lamports.borrow();
    if treasury_balance < bet_amount  {
        return Err(ErrorCode::InsufficientTreasuryFunds.into());
    }

    // Check if the player has enough funds to place the bet
    let player_balance = **ctx.accounts.player.to_account_info().lamports.borrow();
    if player_balance < bet_amount {
        return Err(ErrorCode::InsufficientPlayerFunds.into());
    }

    if game_result.is_some() || ctx.accounts.game.bet != 0 {
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

        let first_card = draw_from_deck(&player_key.to_bytes(), &slot_bytes, game.draw_counter, &mut game.deck);
        game.draw_counter = game.draw_counter.wrapping_add(1);
        msg!("Player's first card is {}", card_to_value(&first_card));
        game.player_cards.push(first_card);
        let second_card = draw_from_deck(&player_key.to_bytes(), &slot_bytes, game.draw_counter, &mut game.deck);
        game.draw_counter = game.draw_counter.wrapping_add(1);
        msg!("Player's second card is {}", card_to_value(&second_card));
        game.player_cards.push(second_card);

        let dealer_card = draw_from_deck(&player_key.to_bytes(), &slot_bytes, game.draw_counter, &mut game.deck);
        game.draw_counter = game.draw_counter.wrapping_add(1);
        msg!("Dealer drew {}", card_to_value(&dealer_card));
        game.dealer_cards.push(dealer_card);
    }

    game.log_game_state();

    Ok(())
}

pub fn hit(ctx: Context<GameContext>) -> Result<()> {
    {

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

    let card = draw_from_deck(&player_key, &slot_bytes, game.draw_counter, &mut game.deck);
    game.draw_counter = game.draw_counter.wrapping_add(1);
    msg!("Draw counter {}", game.draw_counter);
    msg!("Player drew {}", card_to_value(&card));
    game.player_cards.push(card);
    game.log_game_state();
    }
    
    if calculate_score(&ctx.accounts.game.player_cards) > 21 {
        msg!("Player busts after hit!");
        stand(ctx)?;
    } else if {
        calculate_score(&ctx.accounts.game.player_cards) == 21
    } {
        msg!("Player has 21 after hit!");
        stand(ctx)?;
    }

    Ok(())
}

pub fn stand(ctx: Context<GameContext>) -> Result<()> {
    let game_account_info = ctx.accounts.game.to_account_info();
    let game = &mut ctx.accounts.game;


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
        game.result = Some(GameResult::PlayerBust);
        msg!("Player busts!");
        
    } else {
        // Dealer draws cards until score >= 17
        while calculate_score(&game.dealer_cards) < 17 {
            let dealer_card = draw_from_deck(&player_key, &blockhash, game.draw_counter, &mut game.deck);
            game.draw_counter = game.draw_counter.wrapping_add(1);
            game.dealer_cards.push(dealer_card);
            msg!("Dealer drew {}", card_to_value(&dealer_card));
        }

        let dealer_score = calculate_score(&game.dealer_cards);

        // Determine the outcome
        if player_score == 21 && dealer_score != 21 {
            game.result = Some(GameResult::PlayerBlackjack);
            msg!("Player has blackjack!");
        } else if dealer_score > 21 || player_score > dealer_score {
            game.result = Some(GameResult::PlayerWin);
            msg!("Player wins!");
        } else if player_score < dealer_score {
            game.result = Some(GameResult::DealerWin);
            msg!("Dealer wins!");
        } else {
            game.result = Some(GameResult::Push);
            msg!("Push!");
        }

        game.log_game_state();
    }
    //Payout
    match game.result {
        Some(GameResult::PlayerWin) => {
            let payout = game.bet;
            **ctx.accounts.treasury.to_account_info().try_borrow_mut_lamports()? -= payout;
            **game_account_info.try_borrow_mut_lamports()? += payout;
            msg!("Transfered {} lamports to player", payout);
        }
        Some(GameResult::PlayerBlackjack) => {
            let payout = game.bet.checked_div(2).ok_or(ErrorCode::Overflow)?;
            **ctx.accounts.treasury.to_account_info().try_borrow_mut_lamports()? -= payout;
            **game_account_info.try_borrow_mut_lamports()? += payout;
            msg!("Transfered {} lamports to player", payout);
        }
        Some(GameResult::Push) => {
            // No lamport transfer for a push
        }
        Some(GameResult::DealerWin) => {
            **game_account_info.try_borrow_mut_lamports()? -= game.bet;
            **ctx.accounts.treasury.to_account_info().try_borrow_mut_lamports()? += game.bet;
            msg!("Transfered {} lamports to treasury", game.bet);
        }
        Some(GameResult::PlayerBust) => {
            **game_account_info.try_borrow_mut_lamports()? -= game.bet;
            **ctx.accounts.treasury.to_account_info().try_borrow_mut_lamports()? += game.bet;
            msg!("Transfered {} lamports to treasury", game.bet);
        }
        None => {
            msg!("None pattern");
        }
    }

    msg!("Resetting game logic");
    game.reset_game();
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

// #[derive(Accounts)]
// pub struct PlaceBet<'info> {
//     #[account(mut, seeds= [b"game_pda", player.key().as_ref()], bump)]
//     pub game: Account<'info, GameState>,
//     #[account(mut)]
//     pub player: Signer<'info>,
//     /// CHECK: This is safe because the treasury PDA is verified using the `seeds` attribute.
//     #[account(mut, seeds = [crate::TREASURY_SEED], bump)]
//     pub treasury: UncheckedAccount<'info>,
//     pub system_program: Program<'info, System>,
// }

// #[derive(Accounts)]
// pub struct Hit<'info> {
//     #[account(mut, seeds = [b"game_pda", player.key().as_ref()], bump)]
//     pub game: Account<'info, GameState>,
//     pub player: Signer<'info>,
//     /// CHECK: This is safe because the treasury PDA is verified using the `seeds` attribute.
//     #[account(mut, seeds = [crate::TREASURY_SEED], bump)]
//     pub treasury: UncheckedAccount<'info>,
//     pub system_program: Program<'info, System>,
// }


// #[derive(Accounts)]
// pub struct Stand<'info> {
//     #[account(mut, seeds = [b"game_pda", player.key().as_ref()], bump)]
//     pub game: Account<'info, GameState>,
//     pub player: Signer<'info>,
//     /// CHECK: This is safe because the treasury PDA is verified using the `seeds` attribute.
//     #[account(mut, seeds = [crate::TREASURY_SEED], bump)]
//     pub treasury: UncheckedAccount<'info>,
//     pub system_program: Program<'info, System>,
// }

#[derive(Accounts)]
pub struct GameContext<'info> {
    #[account(mut, seeds = [b"game_pda", player.key().as_ref()], bump)]
    pub game: Account<'info, GameState>,
    pub player: Signer<'info>,
    /// CHECK: This is safe because the treasury PDA is verified using the `seeds` attribute.
    #[account(mut, seeds = [crate::TREASURY_SEED], bump)]
    pub treasury: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}
