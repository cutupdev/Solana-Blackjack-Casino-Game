use anchor_lang::{ prelude::*, solana_program };
use solana_program::{
    account_info::AccountInfo,
    pubkey::Pubkey,
    program::invoke,
    program::invoke_signed,
};

use crate::utils::error::ErrorCode;

/// Initialize the treasury account with an admin and a zero balance.
pub fn initialize_treasury(ctx: Context<InitializeTreasury>) -> Result<()> {
    let treasury = &mut ctx.accounts.treasury;

    // Check if the treasury is already initialized
    if treasury.balance > 0 || treasury.admin != Pubkey::default() {
        return Err(ErrorCode::TreasuryAlreadyInitialized.into());
    }

    treasury.admin = ctx.accounts.admin.key();
    treasury.balance = 0;

    msg!("Treasury initialized with admin: {}", ctx.accounts.admin.key());
    Ok(())
}

/// Add funds to the treasury account.
pub fn add_funds_to_treasury(ctx: Context<AddFundsToTreasury>, amount: u64) -> Result<()> {
    invoke(
        &solana_program::system_instruction::transfer(
            ctx.accounts.admin.key,
            ctx.accounts.treasury.to_account_info().key,
            amount
        ),
        &[ctx.accounts.admin.to_account_info(), ctx.accounts.treasury.to_account_info()]
    )?;

    let treasury = &mut ctx.accounts.treasury;
    treasury.balance = treasury.balance.checked_add(amount).ok_or(ErrorCode::Overflow)?;
    msg!(
        "Successfully added {} lamports to the treasury. New balance: {}",
        amount,
        treasury.balance
    );
    Ok(())
}

/// Withdraw funds from the treasury account.
pub fn withdraw_from_treasury(ctx: Context<WithdrawFromTreasury>, amount: u64) -> Result<()> {
    let treasury_balance = ctx.accounts.treasury.balance;

    // Check if the signer is the authorized admin
    if ctx.accounts.admin.key() != crate::ADMIN_KEY {
        return Err(ErrorCode::Unauthorized.into());
    }

    if amount > treasury_balance {
        return Err(ErrorCode::InsufficientTreasuryFunds.into());
    }

    let bump = ctx.bumps.treasury;
    invoke_signed(
        &solana_program::system_instruction::transfer(
            ctx.accounts.treasury.to_account_info().key,
            ctx.accounts.admin.key,
            amount
        ),
        &[ctx.accounts.treasury.to_account_info(), ctx.accounts.admin.to_account_info()],
        &[&[crate::TREASURY_SEED, &[bump]]]
    )?;

    let treasury = &mut ctx.accounts.treasury;
    treasury.balance = treasury.balance.checked_sub(amount).ok_or(ErrorCode::Overflow)?;
    msg!(
        "Successfully withdrew {} lamports from the treasury. Remaining balance: {}",
        amount,
        treasury.balance
    );
    Ok(())
}

#[derive(Accounts)]
pub struct InitializeTreasury<'info> {
    #[account(
        init,
        payer = admin,
        space = 8 + 32 + 8, // Discriminator + admin Pubkey + balance
        seeds = [crate::TREASURY_SEED],
        bump
    )]
    pub treasury: Account<'info, Treasury>,
    #[account(mut)]
    pub admin: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AddFundsToTreasury<'info> {
    #[account(
        mut,
        seeds = [crate::TREASURY_SEED],
        bump,
    )]
    pub treasury: Account<'info, Treasury>,
    #[account(mut, signer)]
    pub admin: Signer<'info>,
    #[account(address = anchor_lang::system_program::ID)]
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct WithdrawFromTreasury<'info> {
    #[account(
        mut,
        seeds = [crate::TREASURY_SEED],
        bump,
    )]
    pub treasury: Account<'info, Treasury>,
    #[account(mut, signer)]
    pub admin: Signer<'info>,
    #[account(address = anchor_lang::system_program::ID)]
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Treasury {
    pub admin: Pubkey,
    pub balance: u64,
}
