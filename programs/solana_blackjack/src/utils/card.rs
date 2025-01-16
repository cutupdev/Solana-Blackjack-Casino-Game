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