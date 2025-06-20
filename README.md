
# Solana Chess Casino Game

This is chess game on the Solana blockchain. As a play-to-earn game, I have implemented smart contract for security. Solana program was built by Anchor framework and UI is built by react.js. This is not full code, I have shared only UI and smart contract here. For full working website, feel free to reach out of me when you need supports[Telegram: https://t.me/DevCutup, Whatspp: https://wa.me/13137423660].



## How to use it

```bash
git clone https://github.com/cutupdev/Solana-Chess-Casino-Game.git
```

```bash
cd ./Solana-Chess-Casino-Game
```

```bash
npm run install
```

- For smart contract deployment:
```bash
anchor build
```

```bash
anchor deploy
```

- To start UI
```bash
cd ./frontend
```

```bash
npm run install
```

```bash
npm run dev
```

- To start Backend
```bash
cd ./backend
```

```bash
npm run install
```

```bash
npm run start
```


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



### Contact Information
- Telegram: https://t.me/DevCutup
- Whatsapp: https://wa.me/13137423660
- Twitter: https://x.com/devcutup
