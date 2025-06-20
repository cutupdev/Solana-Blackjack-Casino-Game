/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import React, { useState } from "react";
import { ChatIcon, Leftarrow } from "../components/Svglist";
import { useSolanaPrice } from "../utils/util";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  enterGame,
  playGame,
} from "../context/solana/transaction";
import Chat from "../components/Chat";
import Tower from "../components/Tower";
import { useSocket } from "../context/SocketContext";
import { PublicKey } from "@solana/web3.js";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import MobileChat from "../components/Chat/MobileChat";
import Head from "next/head";

export default function Waiting() {
  const wallet = useWallet();
  const { gameData, winner } = useSocket();
  const [betAmount, setBetAmount] = useState(0.1);
  const [isBetLoading, setIsBetLoading] = useState(false);
  const { isLoading, isError, data, error } = useSolanaPrice();
  const [isRolling, setIsRolling] = useState(false);
  const [isWonWindow, setIsWonWindow] = useState(false);
  const [wonValue, setWonValue] = useState(0);
  const [isMobileChat, setIsMobileChat] = useState(false);

  const handleBet = async () => {
    try {
      if (gameData && gameData.players && gameData.players.length !== 0) {
        await enterGame(
          wallet,
          new PublicKey(gameData.pda),
          betAmount,
          setIsBetLoading,
          gameData.endTimestamp
        );
      } else {
        await playGame(wallet, betAmount, setIsBetLoading);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleBetAmount = (value: number) => {
    setBetAmount(value);
  };

  const handleEndGame = () => {
    setIsWonWindow(false);
  };

  return (
    <>
      <Head>
        <title>SlowRUG</title>
        <meta name="description" content="SlowRUG | Best Crypto PvP Gambling Website" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col xl:flex-row min-h-[100vh] bg-bg bg-cover bg-no-repeat w-full overflow-x-hidden">
        <button
          className="absolute right-6 top-6 z-10 rounded-md border border-[#ffffff80] w-9 h-9 grid place-content-center md:hidden"
          onClick={() => setIsMobileChat(true)}
        >
          <ChatIcon />
        </button>
        <button className="flex items-center justify-center mt-[34px] rounded-[10px] border-[1px] border-[#FFFFFF54] py-2 px-4 absolute left-3 top-0 xl:left-6 xl:top-6">
          <Leftarrow className="w-3 h-3" />
          <Link href={"/"}>
            <a className="text-sm text-[#FFFFFF] ml-2 uppercase font-semibold">
              Back Home
            </a>
          </Link>
        </button>
        <div className="px-6 mt-[80px] xl:mt-[100px] flex justify-center">
          <div className="md:w-[calc(100%-300px)] w-full xl:w-[480px] mx-auto ml-0 xl:ml-[60px] md:mr-[300px] xl:mr-0">
            <p className="xl:text-[36px] text-3xl text-[#FFFFFF] text-center xl:text-left font-bold xl:my-8 my-5">
              The Tower
            </p>
            <div className="flex flex-col border-[1px] bg-[#30058c42] border-[#FFFFFF24] rounded-3xl px-6">
              <p className="xl:text-[26.6px] text-[18px] text-white-100 font-bold text-center xl:leading-[32px] xl:mt-5 mt-3">
                Place a Bet in SOL
              </p>
              <div className="flex flex-row mt-[33px]">
                <button
                  className={`w-1/3 text-center ${betAmount === 1 ? "oapcity-100" : "opacity-30"
                    }`}
                  onClick={() => setBetAmount(1)}
                >
                  <img
                    src="/img/solana.png"
                    alt=""
                    className="w-6 h-6 lg:w-9 lg:h-9 object-contain mx-auto"
                  />
                  <p className="xl:text-[26.6px] text-[18px] text-white-100 leading-8 font-semibold mt-[5px]">
                    1 SOL
                  </p>
                  <p className="text-[16px] text-[#FFFFFFA8] leading-[19px] font-semibold mt-[5px]">
                    ${(data * 1).toFixed(2)} USD
                  </p>
                </button>
                <button
                  className={`w-1/3 text-center ${betAmount === 2 ? "oapcity-100" : "opacity-30"
                    }`}
                  onClick={() => setBetAmount(2)}
                >
                  <img
                    src="/img/solana.png"
                    alt=""
                    className="w-6 h-6 lg:w-9 lg:h-9 object-contain mx-auto"
                  />
                  <p className="xl:text-[26.6px] text-[18px] text-white-100 leading-8 font-semibold mt-[5px]">
                    2 SOL
                  </p>
                  <p className="text-[16px] text-[#FFFFFFA8] leading-[19px] font-semibold mt-[5px]">
                    ${(data * 2).toFixed(2)} USD
                  </p>
                </button>
                <button
                  className={`w-1/3 text-center ${betAmount === 3 ? "oapcity-100" : "opacity-30"
                    }`}
                  onClick={() => setBetAmount(3)}
                >
                  <img
                    src="/img/solana.png"
                    alt=""
                    className="w-6 h-6 lg:w-9 lg:h-9 object-contain mx-auto"
                  />
                  <p className="xl:text-[26.6px] text-[18px] text-white-100 leading-8 font-semibold mt-[5px]">
                    3 SOL
                  </p>
                  <p className="text-[16px] text-[#FFFFFFA8] leading-[19px] font-semibold mt-[5px]">
                    ${(data * 3).toFixed(2)} USD
                  </p>
                </button>
              </div>
              <p className="text-white-60 text-[16px] leading-[19.32px] mt-7">
                Custom bet:
              </p>
              <div className="flex flex-row mt-[13px] items-center gap-3">
                <input
                  type={"number"}
                  value={betAmount}
                  step={0.1}
                  onChange={(e) =>
                    handleBetAmount(e.target.value as unknown as number)
                  }
                  className="w-[calc(100%-118px)] h-12 border-[1px] bg-[#30058c42] pl-5 border-white-10 rounded-xl text-[16px] text-[#FFFFFF]"
                />
                <button
                  className="w-[48px] h-[48px] border-[1px] border-white-10 rounded-xl text-[16px] text-[#FFFFFF54]"
                  onClick={() => setBetAmount(betAmount / 2)}
                >
                  1/2
                </button>
                <button
                  className="w-[48px] h-[48px] border-[1px] border-white-10 rounded-xl text-[16px] text-[#FFFFFF54]"
                  onClick={() => setBetAmount(betAmount * 2)}
                >
                  2x
                </button>
              </div>
              {wallet.publicKey ? (
                <button
                  className="bg-[#7E49F0] xl:my-8 my-5 rounded-2xl text-[16px] xl:text-[20px] text-white-100 font-bold text-center xl:py-4 py-2"
                  onClick={handleBet}
                  disabled={isBetLoading}
                >
                  {isBetLoading ? (
                    <>Waiting...</>
                  ) : (
                    <>Add {betAmount} SOL to bet</>
                  )}
                </button>
              ) : (
                <div className="playground">
                  <WalletMultiButton />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mr-[328px] ml-6 xl:mr-[324px] xl:w-[calc(100%-840px)] md:w-[calc(100%-348px)] w-[calc(100%-48px)]">
          <div className="mt-10 w-[180px] mx-auto">
            <div className="flex justify-end">
              <WalletMultiButton />
            </div>
          </div>
          <Tower setIsWonWindow={setIsWonWindow} setWonValue={setWonValue} />
        </div>
        <Chat className="fixed w-[300px] hidden flex-col px-4 pt-4 border-[1px] border-[#FFFFFF3D] right-0 top-0 h-[100vh] md:flex" />
        {isWonWindow && (
          <div className="fixed top-0 left-0 w-full h-full bg-[#16127aa8] backdrop-blur-lg flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-[#fff] text-[32px] font-bold">You Won!</h1>
              <p className="text-[#fff] text-[24px]">
                {wonValue.toLocaleString()} SOL
              </p>
              <button
                className="border rounded-md px-5 py-1 text-[#fff] mt-2 text-sm"
                onClick={() => handleEndGame()}
              >
                Back
              </button>
            </div>
          </div>
        )}
        <MobileChat opened={isMobileChat} setOpen={setIsMobileChat} />
      </div>
    </>
  );
}
