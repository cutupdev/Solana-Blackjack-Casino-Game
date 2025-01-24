
# Solana Blackjack Game

Welcome to **Solana Blackjack**, a decentralized blackjack game built on the **Solana blockchain** using **Anchor**. This project leverages Solana's high-performance blockchain for fast and secure transactions, providing users with an interactive and trustless blackjack gaming experience.

## How to play
Click [here](https://nicobecodin.github.io/sol_blackjack_website/) to play online.

## Features

- **Decentralized Gameplay**: All game logic is executed on-chain, ensuring transparency and fairness.
- **Custom Treasury Management**: Funds are securely managed via a treasury PDA (Program Derived Address).
- **Randomized Card Drawing**: Cards are drawn using deterministic randomness derived from player and blockchain data.
- **Multi-Deck Simulation**: Supports an 8-deck card system for enhanced realism.
- **Admin-Controlled Reset**: The game state can only be reset by the admin account.
- **Player Account Management**: Players can manage their own game PDA for storing bets and game states.


---


## Game Instructions

1. **Place a Bet**: Players must place a bet in lamports to start the game.
2. **Draw Cards**: The game automatically deals two cards to the player and one card to the dealer.
3. **Take Actions**:
   - **Hit**: Draw another card.
   - **Stand**: End your turn; the dealer will play.
4. **Win Conditions**:
   - Player wins by having a higher score than the dealer without exceeding 21.
   - A score of 21 with two cards (Blackjack) wins 1.5x the bet.

---

## Technical Details

- **Program Derived Addresses (PDAs)**: Used for securely managing player game states and the treasury.
- **Deterministic Randomness**: Cards are drawn using a combination of blockhash, player keys, and counters.
- **Security Features**:
  - Treasury funds are only accessible to the program.
  - Players can only manage their own game states.
  - Only the admin account can reset the game.



Feel free to reach out for questions or feedback! Happy gaming! 🎮✨

