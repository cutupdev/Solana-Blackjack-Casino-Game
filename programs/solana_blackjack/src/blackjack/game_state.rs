
use anchor_lang::prelude::*;
use crate::utils::card::{card_to_value, initialize_deck};
use crate::utils::score::calculate_score;

#[account]
pub struct GameState {
    pub player: Pubkey,
    pub player_cards: Vec<u8>,
    pub dealer_cards: Vec<u8>,
    pub bet: u64,
    pub result: Option<GameResult>,
    pub draw_counter: u8,
    pub deck: [(u8,u8); 13],
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
        1 + 
        13 * 2
        ; //Draw counter

        // pub fn log_game_state(&self) {
        //         msg!("Game State on chain:");
        //         msg!("- Player: {}", self.player);

        //         if self.player_cards.is_empty(){
        //             msg!("No cards");
        //         } else {
        //             msg!("Cards: ");
        //             for card in self.player_cards.iter(){
        //                 msg!("{}", card_to_value(card));
        //             }
        //             msg!("Score: {}", calculate_score(&self.player_cards));
        //         }
        //         msg!("- Bet: {} lamports", self.bet);
        //         msg!("- Draw Counter: {}", self.draw_counter);
        //         msg!("- Dealer: ");
        //         if self.dealer_cards.is_empty() {
        //             msg!("No cards");
        //         }else {
        //             msg!("Cards: ");
        //             for card in self.dealer_cards.iter(){
        //                 msg!("{}", card_to_value(card))
        //             }
        //             msg!("Dealer score {}", calculate_score(&self.dealer_cards));
        //         }
                
        //         match self.result {
        //             None => msg!("- Result: None"),
        //             Some(GameResult::PlayerWin) => msg!("- Result: PlayerWin"),
        //             Some(GameResult::PlayerBlackjack) => msg!("- Result: PlayerBlackjack"),
        //             Some(GameResult::DealerWin) => msg!("- Result: DealerWin"),
        //             Some(GameResult::PlayerBust) => msg!("- Result: PlayerBust"),
        //             Some(GameResult::Push) => msg!("- Result: Push"),
        //         }
        //     }

            pub fn log_game_state(&self) {
                // Consolidate game state into a single serialized JSON-like string
                let game_state = format!(
                    "{{\"player\": \"{}\", \"player_cards\": [{}], \"player_score\": {}, \"bet\": {}, \"draw_counter\": {}, \"dealer_cards\": [{}], \"dealer_score\": {}, \"result\": \"{}\"}}",
                    self.player,
                    self.player_cards.iter().map(|c| card_to_value(c)).collect::<Vec<_>>().join(", "),
                    calculate_score(&self.player_cards),
                    self.bet,
                    self.draw_counter,
                    self.dealer_cards.iter().map(|c| card_to_value(c)).collect::<Vec<_>>().join(", "),
                    calculate_score(&self.dealer_cards),
                    match self.result {
                        None => "None".to_string(),
                        Some(GameResult::PlayerWin) => "PlayerWin".to_string(),
                        Some(GameResult::PlayerBlackjack) => "PlayerBlackjack".to_string(),
                        Some(GameResult::DealerWin) => "DealerWin".to_string(),
                        Some(GameResult::PlayerBust) => "PlayerBust".to_string(),
                        Some(GameResult::Push) => "Push".to_string(),
                    }
                );
            
                // Log the consolidated game state
                msg!("{}", game_state);
            }
            
            
        pub fn reset_game(&mut self) {
            //this doesnt reset the draw counter,
            self.player_cards.clear();
            self.dealer_cards.clear();
            self.bet = 0;
            self.result = None;
            self.deck = initialize_deck();
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