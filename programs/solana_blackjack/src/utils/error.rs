use anchor_lang::prelude::*;

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
    #[msg("Unauthorized behaviour during game")]
    GameRunning,
    #[msg("Overflow error occurred.")]
    Overflow,
    #[msg("Insufficient funds in treasury.")]
    InsufficientTreasuryFunds,
    #[msg("Treasury already initialized")]
    TreasuryAlreadyInitialized,
    #[msg("Account borrow error, Treasury struct cast failed")]
    AccountBorrowError
}
