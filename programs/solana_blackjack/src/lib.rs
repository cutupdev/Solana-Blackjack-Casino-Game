use anchor_lang::prelude::*;

declare_id!("CapEG2CccYXmkf3n4MDA77UfcyMKYVwfNHb5k9DtuyNt");

#[program]
pub mod solana_blackjack {
    use super::*;

    pub fn initialize_game(ctx: Context<InitializeGame>, player: Pubkey) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        msg!("This is the blackjack program");
        let game =&mut ctx.accounts.game;
        game.player = player;
        game.player_cards = Vec::new();
        game.dealer_cards = vec::new();
        game.result = None;        
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeGame<'info> {
    #[account(init,payer=user, space = 8 + 128)]
    pub game: Account<'info, GameState>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct PlaceBet<'info> {
    #[account(mut)]
    pub game: Account<'infon=, GameState>,
}

#[derive(Accounts)]
pub struct Hit<'info>{
    #[account(mut)]
    pub game: Account<'info, GameState>,

}

#[derive(Accounts)]
pub struct Stand<'info> {
    #[account(mut)]
    pub game: Account<'info,GameState>,
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
fn draw_random_card()->u8{
    //Shitty RNG
    (rand::random::<u8>() %13)+1
}