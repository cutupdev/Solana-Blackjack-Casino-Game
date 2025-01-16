//Might be a better way to handle aces logic
pub fn calculate_score(cards: &Vec<u8>) -> u8 {
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