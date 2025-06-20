import { web3 } from '@project-serum/anchor';
import * as anchor from '@project-serum/anchor';
import axios from 'axios';
import { IDL } from "./jackpot";
import {
    PublicKey,
    SystemProgram,
    SYSVAR_RENT_PUBKEY,
    Transaction,
    LAMPORTS_PER_SOL
} from '@solana/web3.js';

import { BET3_WALLET, CODY_WALLET, EXPER_WALLET, GamePool, GAME_SEED, JACKPOT_PROGRAM_ID, JERZY_WALLET, TEAM_WALLET, VAULT_SEED } from './types';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { API_URL, RPC_URL } from '../../config';
import { errorAlert } from '../../components/ToastGroup';

export const solConnection = new web3.Connection(RPC_URL);

const programId = new anchor.web3.PublicKey(JACKPOT_PROGRAM_ID);

export const playGame = async (
    wallet: WalletContextState,
    amount: number,
    setLoading: Function
) => {
    if (wallet.publicKey === null) return;
    const cloneWindow: any = window;
    const userAddress = wallet.publicKey;
    const provider = new anchor.AnchorProvider(
        solConnection,
        cloneWindow["solana"],
        anchor.AnchorProvider.defaultOptions()
    );
    const program = new anchor.Program(
        IDL as anchor.Idl,
        JACKPOT_PROGRAM_ID,
        provider
    );
    try {
        setLoading(true);
        const tx = await createPlayGameTx(userAddress, amount, program);
        const { blockhash } = await solConnection.getLatestBlockhash();
        tx.feePayer = userAddress;
        tx.recentBlockhash = blockhash;
        if (wallet.signTransaction) {
            const signedTx = await wallet.signTransaction(tx);
            const txId = await provider.connection.sendRawTransaction(
                signedTx.serialize(),
                {
                    skipPreflight: true,
                    maxRetries: 3,
                    preflightCommitment: "finalized",
                }
            );
            await axios.post(`${API_URL}createGame/`, {
                txId: txId
            })
            console.log("Signature:", txId)
            setLoading(false);
        }
    } catch (error) {
        console.log(error);
        setLoading(false);
    }
}
export const enterGame = async (
    wallet: WalletContextState,
    pda: PublicKey,
    amount: number,
    setLoading: Function,
    endTimestamp: number
) => {

    if (wallet.publicKey === null) return;
    const now = new Date().getTime();
    console.log((endTimestamp - now), "(endTimestamp - now)", endTimestamp)
    if (endTimestamp !== 0 && (endTimestamp - now) / 1000 < 15) {
        errorAlert("This transaction may fail. Please try on the next version.")
        return;
    }

    const cloneWindow: any = window;
    const userAddress = wallet.publicKey;
    const provider = new anchor.AnchorProvider(
        solConnection,
        cloneWindow["solana"],
        anchor.AnchorProvider.defaultOptions()
    );
    const program = new anchor.Program(
        IDL as anchor.Idl,
        JACKPOT_PROGRAM_ID,
        provider
    );
    try {
        setLoading(true);
        const tx = await createEnterGameTx(userAddress, pda, amount, program);
        const { blockhash } = await solConnection.getLatestBlockhash();
        tx.feePayer = userAddress;
        tx.recentBlockhash = blockhash;
        if (wallet.signTransaction) {
            const signedTx = await wallet.signTransaction(tx);
            const txId = await provider.connection.sendRawTransaction(
                signedTx.serialize(),
                {
                    skipPreflight: true,
                    maxRetries: 3,
                    preflightCommitment: "finalized",
                }
            );
            await axios.post(`${API_URL}enterGame/`, {
                txId: txId
            })
            console.log("Signature:", txId)
            setLoading(false);
        }
        setLoading(false);
    } catch (error) {
        console.log(error);
        setLoading(false);
    }
}

export const createPlayGameTx = async (
    userAddress: PublicKey,
    amount: number,
    program: anchor.Program
) => {

    let now = new Date();
    let ts = Math.floor(now.getTime() / 1000);

    const [solVault, bump] = await PublicKey.findProgramAddress(
        [Buffer.from(VAULT_SEED)],
        programId
    );

    const [gamePool, gameBump] = await PublicKey.findProgramAddress(
        [Buffer.from(GAME_SEED), userAddress.toBuffer(), new anchor.BN(ts).toArrayLike(Buffer, "le", 8)],
        programId
    );

    console.log("Game PDA: ", gamePool.toBase58());
    const tx = new Transaction();

    tx.add(program.instruction.playGame(
        new anchor.BN(ts),
        new anchor.BN(amount * LAMPORTS_PER_SOL),
        {
            accounts: {
                admin: userAddress,
                gamePool,
                solVault,
                codyWallet: CODY_WALLET,
                bet3Wallet: BET3_WALLET,
                jerzyWallet: JERZY_WALLET,
                experWallet: EXPER_WALLET,
                teamWallet: TEAM_WALLET,
                systemProgram: SystemProgram.programId,
                rent: SYSVAR_RENT_PUBKEY
            },
            instructions: [],
            signers: [],
        }));

    return tx;

}

export const createEnterGameTx = async (
    userAddress: PublicKey,
    gamePool: PublicKey,
    amount: number,
    program: anchor.Program
) => {

    const [solVault, bump] = await PublicKey.findProgramAddress(
        [Buffer.from(VAULT_SEED)],
        programId
    );
    console.log(solVault.toBase58())
    
    const tx = new Transaction();

    tx.add(program.instruction.enterGame(
        new anchor.BN(amount * LAMPORTS_PER_SOL), {
            accounts: {
                admin: userAddress,
                gamePool,
                solVault,
                codyWallet: CODY_WALLET,
                bet3Wallet: BET3_WALLET,
                jerzyWallet: JERZY_WALLET,
                experWallet: EXPER_WALLET,
                teamWallet: TEAM_WALLET,
                systemProgram: SystemProgram.programId,
            },
            instructions: [],
            signers: [],
        }));

    return tx;

}

export const getStateByKey = async (
    wallet: WalletContextState,
    gameKey: PublicKey,
): Promise<GamePool | null> => {
    if (wallet.publicKey === null) return null;
    const cloneWindow: any = window;
    const userAddress = wallet.publicKey;
    const provider = new anchor.AnchorProvider(
        solConnection,
        cloneWindow["solana"],
        anchor.AnchorProvider.defaultOptions()
    );
    const program = new anchor.Program(
        IDL as anchor.Idl,
        JACKPOT_PROGRAM_ID,
        provider
    );
    try {
        const gameState = await program.account.gamePool.fetch(gameKey);
        return gameState as unknown as GamePool;
    } catch {
        return null;
    }
}