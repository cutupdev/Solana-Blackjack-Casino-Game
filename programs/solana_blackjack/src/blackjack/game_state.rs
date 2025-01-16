
use anchor_lang::prelude::*;




#[account]
pub struct GameState {
    pub player: Pubkey,
    pub player_cards: Vec<u8>,
    pub dealer_cards: Vec<u8>,
    pub bet: u64,
    pub result: Option<GameResult>,
    pub draw_counter: u8,
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
        1 + //Option<GameResult>
        1; //Draw Counter


        pub fn log_game_state(&self) {
                msg!("Game State on chain:");
                msg!("- Player: {}", self.player);
        
                if self.player_cards.is_empty() {
                    msg!("- Player Cards: None");
                } else {
                    let card_names: Vec<String> = self
                        .player_cards
                        .iter()
                        .map(|&c| match c {
                            1 => "Ace".to_string(),
                            11 => "Jack".to_string(),
                            12 => "Queen".to_string(),
                            13 => "King".to_string(),
                            _ => c.to_string(),
                        })
                        .collect();
                    msg!("- Player Cards: {}", card_names.join(", "));
                }
        
                if self.dealer_cards.is_empty() {
                    msg!("- Dealer Cards: None");
                } else {
                    let card_names: Vec<String> = self
                        .dealer_cards
                        .iter()
                        .map(|&c| match c {
                            1 => "Ace".to_string(),
                            11 => "Jack".to_string(),
                            12 => "Queen".to_string(),
                            13 => "King".to_string(),
                            _ => c.to_string(),
                        })
                        .collect();
                    msg!("- Dealer Cards: {}", card_names.join(", "));
                }
        
                msg!("- Bet: {} lamports", self.bet);
                msg!("- Draw Counter: {}", self.draw_counter);
                match self.result {
                    None => msg!("- Result: None"),
                    Some(GameResult::PlayerWin) => msg!("- Result: PlayerWin"),
                    Some(GameResult::PlayerBlackjack) => msg!("- Result: PlayerBlackjack"),
                    Some(GameResult::DealerWin) => msg!("- Result: DealerWin"),
                    Some(GameResult::PlayerBust) => msg!("- Result: PlayerBust"),
                    Some(GameResult::Push) => msg!("- Result: Push"),
                }
            }
        
}


#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Debug)]
pub enum GameResult {
    PlayerWin,
    PlayerBlackjack,
    DealerWin,
    PlayerBust,
    Push,
}