use anchor_lang::solana_program;
use solana_program::keccak::{hash, Hash};

pub fn draw_card(player_key: &[u8], blockhash: &[u8], counter: u8) -> u8 {
    let mut seed = Vec::new();
    seed.extend_from_slice(player_key);
    seed.extend_from_slice(blockhash);
    seed.push(counter);
    let hash_result: Hash = hash(&seed);
    (hash_result.0[0] % 13) + 1
}

pub fn initialize_deck() -> [(u8, u8); 13] {
    let number_of_decks: u8 = 8; // Each card initially has 8 copies
    let mut deck = [(0, 8); 13];

    for i in 0..13 {
        deck[i] = (i as u8 + 1, number_of_decks); // Card ranks 1 to 13, each with 8 cards.
    }
    deck
}

pub fn draw_from_deck(
    player_key: &[u8],
    blockhash: &[u8],
    counter: u8,
    remaining_cards: &mut [(u8, u8); 13],
) -> u8 {
    let total_cards: u16 = remaining_cards.iter().map(|&(_, count)| count as u16).sum();

    if total_cards == 0 {
        panic!("There are no remaining cards");
    }

    let mut seed = Vec::new();
    seed.extend_from_slice(player_key);
    seed.extend_from_slice(blockhash);
    seed.push(counter);
    let hash_result: Hash = hash(&seed);
    let mut index: u16 = (hash_result.0[0] as u16) % total_cards;

    // Find the card corresponding to the index
    for (card, count) in remaining_cards.iter_mut() {
        if *count > 0 {
            if index < *count as u16 {
                *count -= 1; // Decrement the count of the drawn card
                return *card; // Return the drawn card
            } else {
                index -= *count as u16; // Move to the next card
            }
        }
    }

    // This should never be reached if the logic is correct
    panic!("Error in card drawing logic");
}


pub fn card_to_value(card: u8)->String {
    match card {
        1 => "Ace".to_string(),
        11 => "Jack".to_string(),
        12 => "Queen".to_string(),
        13 => "King".to_string(),
        _ => card.to_string()
    }
}