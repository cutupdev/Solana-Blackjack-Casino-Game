
import * as anchor from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';

export const GLOBAL_AUTHORITY_SEED = "global-authority";
export const VAULT_SEED = "vault-authority";
export const GAME_SEED = "game-authority";
export const RANDOM_SEED = "random";

export const JACKPOT_PROGRAM_ID = new PublicKey("E13jNxzoQbUuyaZ9rYJUdRAirYZKU75NJNRV9CHdDhHE");
export const CODY_WALLET  = new PublicKey("GBfam19CeWi6msbrgHxFPmEBZMu4zHavQyNchdZTDtNU");   // 0.72%
export const BET3_WALLET  = new PublicKey("41m5znXJg9CkxKBocJxntJZKn59U3BomkafEguxDDEWG");   // 1.08%
export const JERZY_WALLET  = new PublicKey("79Zzb6b6JwxSc6SxwDJ8XuVci2hz45XwLQgi1aQBnMYX");  // 0.72%
export const EXPER_WALLET  = new PublicKey("5dxyb7RWSdw1o9VXBN1gfL9oViBubeERx9g2HY74AHyD");  // 1.08%
export const TEAM_WALLET  = new PublicKey("8Gbqb5ppmsocN8JMGBLNUHdn9zoZuiA6qzgwEPgN6j71");   // 0.4%export
export interface GamePool {
  startTs: anchor.BN,
  rand: anchor.BN,
  totalDeposit: anchor.BN,
  claimed: anchor.BN,
  winner: PublicKey,
  entrants: PublicKey[],
  depositAmounts: anchor.BN[]
}