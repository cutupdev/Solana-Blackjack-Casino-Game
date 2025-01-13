use anchor_lang::{ prelude::*, solana_program };
use solana_program::keccak::{ hash, Hash };
use solana_program::{
    account_info::AccountInfo,
    pubkey::Pubkey,
    program::invoke,
    program::invoke_signed,
};
use std::ops::Div;
use std::ops::Mul;
use anchor_lang::prelude::SolanaSysvar;


declare_id!("CapEG2CccYXmkf3n4MDA77UfcyMKYVwfNHb5k9DtuyNt");


/*
TODO
Streamline fn transfer_sol
Add funds for payout

*/

#[program]
pub mod solana_blackjack {

    use super::*;

    pub fn initialize_game(ctx: Context<InitializeGame>, player: Pubkey) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        msg!("This is the blackjack program");
        let game = &mut ctx.accounts.game;
        game.player = player;
        game.player_cards = Vec::with_capacity(GameState::INITIAL_CARD_CAPACITY);
        game.dealer_cards = Vec::with_capacity(GameState::INITIAL_CARD_CAPACITY);
        // game.player_cards = Vec::new();
        // game.dealer_cards = Vec::new();
        game.bet = 0;
        game.result = None;

        Ok(())
    }

    pub fn place_bet(ctx: Context<PlaceBet>, bet_amount: u64) -> Result<()> {
        let game_key = ctx.accounts.game.key();
        let player_key = ctx.accounts.player.key();
    
        invoke(
            &solana_program::system_instruction::transfer(
                &player_key,
                &game_key,
                bet_amount,
            ),
            &[ctx.accounts.player.to_account_info(), ctx.accounts.game.to_account_info()],
        )?;
    
        let game = &mut ctx.accounts.game;
        game.bet = bet_amount;
    
        Ok(())
    }
    

    pub fn hit(ctx: Context<Hit>) -> Result<()> {
        let game = &mut ctx.accounts.game;

        if game.bet == 0 {
            return Err(ErrorCode::NoBetPlaced.into());
        }

        let player_key = ctx.accounts.player.key().to_bytes();
        let clock = Clock::get().unwrap();
        let slot_bytes = clock.slot.to_le_bytes();

        let card = draw_card(&player_key, &slot_bytes, 1);
        msg!("Player drew {}", card);
        game.player_cards.push(card);
        Ok(())
    }

    pub fn stand(ctx: Context<Stand>) -> Result<()> {
        let game_account_info = ctx.accounts.game.to_account_info().clone();
        let game = &mut ctx.accounts.game;

        let bump = ctx.bumps.game;
        
        if game.bet == 0 {
            return Err(ErrorCode::NoBetPlaced.into());
        }
        if game.result.is_some(){
            return Err(ErrorCode::GameAlreadyEnded.into());
        }

        let player_key = ctx.accounts.player.key().to_bytes();
        let blockhash = Clock::get()?.slot.to_le_bytes();

        let mut k = 1; //To not make it output the samething everytime -> Not safe
        while calculate_score(&game.dealer_cards) < 17 {
            let dealer_card = draw_card(&player_key, &blockhash, k);
            game.dealer_cards.push(dealer_card);
            msg!("Dealer drew {}", dealer_card);
            k += 1;
        }

        let dealer_score = calculate_score(&game.dealer_cards);
        let player_score = calculate_score(&game.player_cards);
        if player_score == 21 && dealer_score != 21 {
            game.result = Some(GameResult::PlayerBlackjack);
        } else if dealer_score > 21 || player_score > dealer_score {
            game.result = Some(GameResult::PlayerWin);
        } else if player_score < dealer_score {
            game.result = Some(GameResult::DealerWin);
        } else {
            game.result = Some(GameResult::Push);
        }
        
        match game.result {
            Some(GameResult::PlayerWin) => {
                msg!("Player win");
                invoke(
                    &solana_program::system_instruction::transfer(
                        game_account_info.to_account_info().key,
                        &ctx.accounts.player.to_account_info().key,
                        game.bet.mul(2)
                    ),
                    &[game_account_info.to_account_info(), ctx.accounts.player.to_account_info()]
                )?;
            }
            Some(GameResult::PlayerBlackjack)=> {
                msg!("Player Blackjack");
            invoke_signed(
                &solana_program::system_instruction::transfer(
                    game_account_info.to_account_info().key,
                    &ctx.accounts.player.to_account_info().key,
                    game.bet.mul(3).div(2), //1.5x payout
                ),
                &[
                    game_account_info.to_account_info(),
                    ctx.accounts.player.to_account_info(),
                ],
                &[&[b"game_pda", ctx.accounts.player.key().as_ref(), &[bump]]], // PDA signing
            )?;

            
        }
        Some(GameResult::Push) => {
            msg!("Push");
            invoke_signed(
                &solana_program::system_instruction::transfer(
                    game_account_info.to_account_info().key,
                    ctx.accounts.player.to_account_info().key,
                    game.bet, // Return bet
                ),
                &[
                    game_account_info.to_account_info(),
                    ctx.accounts.player.to_account_info(),
                ],
                &[&[b"game_pda", ctx.accounts.player.key().as_ref(), &[bump]]],
            )?;
        }
            Some(GameResult::DealerWin) => {
                msg!("Dealer win");
                //Do Nothing
            }
            Some(GameResult::PlayerBust) => {
                msg!("Player bust");
                //Do nothing
            }
            None => {
                msg!("None pattern")
            }
        }

        //Reset game logic:
        msg!("Resetting game logic");
        game.player_cards.clear();
        game.dealer_cards.clear();
        game.bet = 0;
        game.result = None;

        Ok(())
    }

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
        Ok(())
    }

    pub fn withdraw_funds(ctx: Context<WithdrawFunds>, amount: u64) -> Result<()> {
        let game = &ctx.accounts.game;
        if ctx.accounts.player.key() != game.player {
            return Err(ErrorCode::Unauthorized.into());
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
        Ok(())
    }
    
}

impl GameState {
    pub const INITIAL_CARD_CAPACITY: usize = 10;
    pub const LEN: usize =
        8 + //Discriminator
        32 + //pubkey(player)
        4 +
        Self::INITIAL_CARD_CAPACITY + // vec<u8> (player_cards) Could make it smaller
        4 +
        Self::INITIAL_CARD_CAPACITY + //vec<u8> (dealer_cards)
        8 + //u64
        1; //Option<GameResult>}
}
#[derive(Accounts)]
pub struct InitializeGame<'info> {
    #[account(
        init,
        payer = user,
        space = GameState::LEN,
        seeds = [b"game_pda", user.key().as_ref()],
        bump,
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
}


#[account]
pub struct GameState {
    pub player: Pubkey,
    pub player_cards: Vec<u8>,
    pub dealer_cards: Vec<u8>,
    pub bet: u64,
    pub result: Option<GameResult>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Debug)]
pub enum GameResult {
    PlayerWin,
    PlayerBlackjack,
    DealerWin,
    PlayerBust,
    Push,
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


//Might be a better way to handle aces logic
fn calculate_score(cards: &Vec<u8>) -> u8 {
    let mut score = 0;
    let mut aces = 0;
    for &card in cards.iter() {
        if card == 1 {
            aces += 1;
            score += 11;
        } else if card > 10 {
            score += 10;
        } else {
            score += card;
        }
    }
    while score > 21 && aces > 0 {
        score -= 10;
        aces -= 1;
    }
    score
}

fn draw_card(player_key: &[u8], blockhash: &[u8], counter: u8) -> u8 {
    let mut seed = Vec::new();
    seed.extend_from_slice(player_key);
    seed.extend_from_slice(blockhash);
    seed.push(counter);
    let hash_result: Hash = hash(&seed);
    (hash_result.0[0] % 13) + 1
}


#[error_code]
pub enum ErrorCode {
    #[msg("A bet must be placed before you can play")]
    NoBetPlaced,
    #[msg("Unauthorized: Only the game authority can execute this action.")]
    Unauthorized,
    #[msg("Failed to place bet")]
    FailedPlaceBet,
    #[msg("Game already ended")]
    GameAlreadyEnded,
    #[msg("PDA bump seed is missing")]
    MissingBump,
}
