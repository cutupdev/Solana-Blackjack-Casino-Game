/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import React, { useEffect, useMemo, useState } from "react";
import Sound from "react-sound";
import { useSocket } from "../context/SocketContext";
import { base58ToGradient } from "../utils/util";
import Selector from "./Selector";

export default function Tower(props: {
  setIsWonWindow: Function;
  setWonValue: Function;
}) {
  const wallet = useWallet();

  const { gameData } = useSocket();
  const { winner, resultHeight } = useSocket();
  const [isBetSound, setIsBetSound] = useState(false);
  const sumPots = useMemo(() => {
    if (gameData && gameData && gameData.players) {
      const sumBets = gameData.players.reduce(
        (sum: number, item: any) => sum + item.amount,
        0
      );
      return sumBets / LAMPORTS_PER_SOL;
    } else {
      return 0;
    }
  }, [gameData]);

  const winPercent = useMemo(() => {
    if (
      gameData &&
      gameData &&
      gameData.players &&
      gameData.players.length === 0
    ) {
      return 0;
    } else if (gameData) {
      const sumBets = gameData.players?.reduce(
        (sum: number, item: any) => sum + item.amount,
        0
      );
      if (wallet.publicKey !== null) {
        const userBet = gameData.players?.find(
          (item: any) => item.player === wallet.publicKey?.toBase58()
        );
        if (userBet) {
          return userBet.amount / sumBets;
        } else {
          return 0;
        }
      } else {
        return 0;
      }
    }
  }, [gameData?.players, wallet.publicKey, wallet.connected]);

  useEffect(() => {
    if (gameData && gameData.players.length) {
      setIsBetSound(true);
      setTimeout(() => {
        setIsBetSound(false);
      }, 1500);
    }
  }, [gameData?.players]);

  return (
    <div className="mx-auto xl:max-w-[600px] flex justify-center flex-col drop-shadow-lg w-full 2xl:w-[calc(100%-100px)] xl:mt-[80px] mt-10 border-[1px] rounded-3xl border-[#FFFFFF73] mb-10">
      <div className="relative rounded-[10px] bg-[#7e49f051] my-[26px] mx-6">
        <img
          className="absolute  left-[-24px] top-1"
          src="/img/select 3.png"
          alt=""
        />
        <img
          className="absolute  right-[-24px] top-1"
          src="/img/select 2.png"
          alt=""
        />
        <p className="text-[22px] text-white-100 font-bold leading-8 text-center py-[14px]">
          POT:&nbsp;{sumPots} SOL
        </p>
      </div>
      <div className="flex rounded-2xl bg-[#0f0545] h-[500px] mx-4">
        <div className="w-[50px] lg:w-20 flex flex-col justify-around items-center">
          <div className="lg:w-7 lg:h-7 w-5 h-5 rounded-full bg-[#fff] opacity-10"></div>
          <div className="lg:w-7 lg:h-7 w-5 h-5 rounded-full bg-[#fff] opacity-10"></div>
          <div className="lg:w-7 lg:h-7 w-5 h-5 rounded-full bg-[#fff] opacity-10"></div>
          <div className="lg:w-7 lg:h-7 w-5 h-5 rounded-full bg-[#fff] opacity-10"></div>
          <div className="lg:w-7 lg:h-7 w-5 h-5 rounded-full bg-[#fff] opacity-10"></div>
        </div>
        <Selector
          className="relative lg:w-[calc(100%-160px)] w-[calc(100%-100px)] h-full rounded-[10px]"
          setIsWonWindow={props.setIsWonWindow}
          setWonValue={props.setWonValue}
        />
        <div className="w-[50px] lg:w-20 flex flex-col justify-around items-center">
          <div className="lg:w-7 lg:h-7 w-5 h-5 rounded-full bg-[#fff] opacity-10"></div>
          <div className="lg:w-7 lg:h-7 w-5 h-5 rounded-full bg-[#fff] opacity-10"></div>
          <div className="lg:w-7 lg:h-7 w-5 h-5 rounded-full bg-[#fff] opacity-10"></div>
          <div className="lg:w-7 lg:h-7 w-5 h-5 rounded-full bg-[#fff] opacity-10"></div>
          <div className="lg:w-7 lg:h-7 w-5 h-5 rounded-full bg-[#fff] opacity-10"></div>
        </div>
      </div>
      {
        gameData?.players.length === 0 ? (
        <div className="mx-8 rounded-xl border-[1px] border-[#ffffff50] bg-[#04134A] py-5 mt-[55px] text-[14px] text-[#6a71f8] font-bold text-center">
          {`Noone has entered this room yet... Be the first! :)`}
        </div>
      ) : (
        <div className="mx-4 xl:mx-8 rounded-xl border-[1px] border-[#ffffff50] bg-[#] py-5 mt-[55px] text-[14px] text-[#6a71f8] font-bold text-center flex flex-wrap px-5 xl:gap-4 gap-2">
          {gameData &&
            gameData.players?.map((item: any, key: number) => (
              <div
                className="flex items-center w-[calc(50%-20px)] justify-between"
                key={key}
              >
                <div className="flex items-center">
                  <div
                    className="w-5 h-5 rounded-md"
                    style={{
                      background: `${base58ToGradient(item.player).color}`,
                    }}
                  ></div>
                  <span
                    style={{ color: `${base58ToGradient(item.player).color}` }}
                    className="ml-2"
                  >
                    {item.player.slice(0, 3)}...{item.player.slice(-3)}
                  </span>
                </div>
                <span
                  className="ml-3 flex items-center whitespace-nowrap"
                  style={{ color: `${base58ToGradient(item.player).color}` }}
                >
                  {(item.amount / LAMPORTS_PER_SOL).toLocaleString()} SOL
                </span>
              </div>
            ))}
        </div>
      )}
      <div className="mx-8 rounded-xl py-2 my-6 text-[24px] text-[#6a71f8] font-bold text-center">
        WIN %: {winPercent && (winPercent * 100).toFixed(2)}

      </div>
      <Sound
        url="/sound/bet.mp3"
        playStatus={isBetSound ? "PLAYING" : "STOPPED"}
      />
      ;
    </div>
  );
}
