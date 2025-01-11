use anchor_lang::{prelude::*, solana_program};
use solana_program::keccak::{hash, Hash};
use solana_program::program::invoke;
use solana_program::{
    account_info::AccountInfo,
    entrypoint::ProgramResult,
program::invoke,
pubkey::Pubkey,
system_instruction}

declare_id!("CapEG2CccYXmkf3n4MDA77UfcyMKYVwfNHb5k9DtuyNt");

#[program]
pub mod solana_blackjack {
    

    use solana_program::system_instruction;

    use super::*;

    pub fn initialize_game(ctx: Context<InitializeGame>, player: Pubkey) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        msg!("This is the blackjack program");
        let game =&mut ctx.accounts.game;
        game.player = player;
        game.player_cards = Vec::new();
        game.dealer_cards = Vec::new();
        game.bet =0;
        game.result = None;        
        
        

        Ok(())
    }

    pub fn place_bet(ctx: Context<PlaceBet>, bet_amount: u64) -> Result<()> {
        let game =&mut ctx.accounts.game;
        
        let instructions = system_instruction::transfer(from_account)
        let transfer_funds = invoke(&instructions, &[...])

        if transfer_funds.is_err(){
            msg!("Failed to do transaction: {:?} ", transfer_funds);
            return Err(result.unwrap_err());

        }
        game.bet = bet_amount;
        Ok(())
    }

    pub fn hit(ctx: Context<Hit>)->Result<()> {
        let game = &mut ctx.accounts.game;

        if game.bet==0 {
            return Err(ErrorCode::NoBetPlaced.into());
        }

        let player_key = ctx.accounts.player.key().to_bytes();
        let clock = Clock::get().unwrap();
        let slot_bytes = clock.slot.to_le_bytes();


        let card = draw_card(&player_key, &slot_bytes, 1 );
        game.player_cards.push(card);
        Ok(())
    }

    pub fn stand(ctx: Context<Stand>)-> Result<()> {
        let game = &mut ctx.accounts.game;
        if game.bet==0{
           return Err(ErrorCode::NoBetPlaced.into()); 
        }

        let player_key =ctx.accounts.player.key().to_bytes();
        let blockhash = Clock::get()?.slot.to_le_bytes();

        let mut k = 1;//To not make it output the samething everytime -> Not safe
        while calculate_score(&game.dealer_cards)<17 {

            let dealer_card= draw_card(&player_key, &blockhash,k);
            game.dealer_cards.push(dealer_card);
            k+=1;
        }

        let dealer_score = calculate_score(&game.dealer_cards);
        let player_score = calculate_score(&game.player_cards);
        if player_score == 21 && dealer_score !=21{
            game.result == Some(GameResult::PlayerBlackjack)
        }
        else if dealer_score > 21 || player_score > dealer_score {
            game.result = Some(GameResult::PlayerWin);
        }else if player_score < dealer_score {
            game.result = Some(GameResult::DealerWin);
        } else {
            game.result = Some(GameResult::Push);
        }
        match game.result{
            Some(GameResult::PlayerWin) => {
                invoke(
                    &solana_program::system_instruction::transfer(
                        &ctx.accounts.game.to_account_info().key,
                        &ctx.accounts.player.to_account_info().key,
                        game.bet, //(1:1 payout)
                    ),
                    &[
                        ctx.accounts.game.to_account_info(),
                        ctx.accounts.player.to_account_info(),
                    ],
                )?;
            }
            Some(GameResult::Push) => {
                invoke(
                    &solana_program::system_instruction::transfer(
                        &ctx.accounts.game.to_account_info().key,
                        &ctx.accounts
                    )
                )
            }
        }

        Ok(())
    }
}

impl GameState {
    pub const LEN: usize =8//Discriminator
    + 32//pubkey(player)
    + 4 + 52// vec<u8> (player_cards) Could make it smaller
     + 4 + 52 //vec<u8> (dealer_cards)
     + 8 //u64
     + 1;//Option<GameResult>}
}
#[derive(Accounts)]
pub struct InitializeGame<'info> {
    #[account(init,payer=user, space = GameState::LEN)]
    pub game: Account<'info, GameState>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct PlaceBet<'info> {
    #[account(mut)]
    pub game: Account<'info, GameState>,
} 

#[derive(Accounts)]
pub struct Hit<'info>{
    #[account(mut)]
    pub game: Account<'info, GameState>,
    pub player: Signer<'info>,
}

#[derive(Accounts)]
pub struct Stand<'info> {
    #[account(mut)]
    pub game: Account<'info,GameState>,
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
pub enum GameResult{
    PlayerWin,
    PlayerBlackjack,
    DealerWin,
    PlayerBust,
    Push
}


//Might be a better way to handle aces logic
fn calculate_score(cards: &Vec<u8>)->u8{
    let mut score =0;
    let mut aces =0;
    for &card in cards.iter(){
        if card ==1{
            aces+=1;
            score+=11;          
        }
        else if card>10{
            score +=10;
        } else {
            score+=card;
        }
    }
    while score > 21 && aces > 0 {
        score -=  10;
        aces -=1;
    }
    score 
}


fn draw_card(player_key: &[u8], blockhash: &[u8], counter: u8) -> u8 {
    let mut seed =Vec::new();
    seed.extend_from_slice(player_key);
    seed.extend_from_slice(blockhash);
    seed.push(counter);
    let hash_result: Hash = hash(&seed);
    hash_result.0[0] %13 +1
}

fn transfer_sol(from_account: &AccountInfo, to_account: &AccountInfo, lamports: u64, system_program: &AccountInfo)->ProgamResult{}


#[error_code]
pub enum ErrorCode {
    #[msg("A bet must be placed before you can play")]
    NoBetPlaced,
    
}