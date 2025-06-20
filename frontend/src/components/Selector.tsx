/* eslint-disable react-hooks/exhaustive-deps */
import { useWallet } from "@solana/wallet-adapter-react";
import React, {
  useRef,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import Waitboard from "../components/Waitboard";
import { useSocket } from "../context/SocketContext";
import CountdownBar from "./CountdownBar";
import confetti from "canvas-confetti";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import Sound from "react-sound";

export default function Selector(props: {
  className: string;
  setIsWonWindow: Function;
  setWonValue: Function;
}) {
  const wallet = useWallet();
  const {
    winner,
    gameData,
    setClearGame,
    started,
    setStated,
  } = useSocket();
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const interval: any = useRef();
  const list = [32, 132, 232, 332, 432];
  const [isWonSound, setIsWonSound] = useState(false);

  const throwConfetti = useCallback(() => {
    confetti({
      particleCount: 400,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, [confetti]);

  const target = useMemo(() => {
    let res = 0;
    if (winner && winner.winner !== "") {
      // const ranCount = Math.round(1 + Math.random()) + 1;
      // console.log("ranCount =>", ranCount);
      // if (ranCount % 2 === 0) {
      //   res = winner.resultHeight * 500 + ranCount * 500;
      // } else {
      //   res = ranCount * 500 - winner.resultHeight * 500;
      // }
      res = winner.resultHeight * 500 + 1500;
      // if (setStated) setStated(true);

    }
    console.log(winner, Math.ceil(res));
    console.log(gameData, "gameData")
    return Math.ceil(res);
  }, [winner, gameData]);

  useEffect(() => {
    function handleTimer() {
      interval.current = setInterval(() => {
        setTimer((count) => count + 2);
      }, 1);
      setIsTimerRunning(true);
    }
    if (winner && winner.winner !== "") {
      if (timer >= target - 400 && isTimerRunning) {
        clearInterval(interval.current);

        interval.current = setInterval(() => {
          setTimer((count) => count + 1.9);
        }, 1);
      }
      if (timer >= target - 350 && isTimerRunning) {
        clearInterval(interval.current);

        interval.current = setInterval(() => {
          setTimer((count) => count + 1.3);
        }, 1);
      }

      if (timer >= target - 300 && isTimerRunning) {
        clearInterval(interval.current);

        interval.current = setInterval(() => {
          setTimer((count) => count + 1.1);
        }, 1);
      }
      if (timer >= target - 250 && isTimerRunning) {
        clearInterval(interval.current);

        interval.current = setInterval(() => {
          setTimer((count) => count + 0.8);
        }, 1);
      }

      if (timer >= target - 200 && isTimerRunning) {
        clearInterval(interval.current);

        interval.current = setInterval(() => {
          setTimer((count) => count + 0.5);
        }, 1);
      }
      if (timer >= target - 150 && isTimerRunning) {
        clearInterval(interval.current);

        interval.current = setInterval(() => {
          setTimer((count) => count + 0.2);
        }, 1);
      }

      if (timer >= target - 100 && isTimerRunning) {
        clearInterval(interval.current);

        interval.current = setInterval(() => {
          setTimer((count) => count + 0.1);
        }, 1);
      }
      if (timer >= target - 50 && isTimerRunning) {
        clearInterval(interval.current);

        interval.current = setInterval(() => {
          setTimer((count) => count + 0.1);
        }, 1);
      }

      if (timer >= target) {
        clearInterval(interval.current);
      }
      if (timer === 0) {
        handleTimer();
      }
    }
  }, [timer, target, winner]);

  const [confettiThrown, setConfettiThrown] = useState(false);
  useEffect(() => {
    if (
      target - timer < 1 &&
      !confettiThrown &&
      winner?.winner !== "" &&
      gameData
    ) {
      if (wallet.publicKey?.toBase58() === winner?.winner && gameData.players.length !== 0) {
        throwConfetti();
        setConfettiThrown(true);
        const sumBets = gameData.players.reduce(
          (sum: number, item: any) => sum + item.amount,
          0
        );
        props.setIsWonWindow(true);
        props.setWonValue(sumBets / LAMPORTS_PER_SOL);
        setIsWonSound(true);
        setTimeout(() => {
          setIsWonSound(false);
        }, 1500);
      }
      if (setClearGame) {
        setTimeout(() => {
          setClearGame();
          if (setStated) setStated(false);
        }, 3000);
      }
    }
  }, [timer, wallet]);

  return (
    <>
      <div className={`${props.className}`}>
        {started ? (
          <>
            <div
              className="w-9 h-9 absolute bg-white blur-[9px] rounded-full left-[-60px]"
              style={{
                top: `${Math.floor(timer / 500) % 2
                    ? list[Math.floor(timer / 100) % 5]
                    : list[5 - (Math.floor(timer / 100) % 5)]
                  }px`,
              }}
            ></div>
            <div
              className="w-9 h-9 absolute bg-white blur-[9px] rounded-full right-[-60px]"
              style={{
                top: `${Math.floor(timer / 500) % 2
                    ? list[Math.floor(timer / 100) % 5]
                    : list[5 - (Math.floor(timer / 100) % 5)]
                  }px`,
              }}
            ></div>
            <div
              className={`w-full absolute border-t-4 border-dashed after:w-4 lg:after:w-5 after:h-5 after:bg-[#fff] after:absolute after:-right-2 after:rotate-45 after:-top-3 before:w-5 before:h-5 before:bg-[#fff] before:absolute before:-left-2 before:rotate-45 before:-top-3`}
              style={{
                top: `${Math.floor(timer / 500) % 2
                    ? timer % 500
                    : 500 - (timer % 500)
                  }px`,
              }}
            ></div>
          </>
        ) : (
          <div className="absolute left-0 top-0 w-full h-full bg-[#00000080] rounded-lg">
            {/* <div
                            className="w-9 h-9 absolute bg-white blur-[9px] rounded-full left-[-60px] opacity-80"
                            style={{ top: `${Math.floor(timerInfinite / 500) % 2 ? list[Math.floor((timerInfinite / 100)) % 5] : list[5 - Math.floor((timerInfinite / 100)) % 5]}px` }}>
                        </div>
                        <div
                            className="w-9 h-9 absolute bg-white blur-[9px] rounded-full right-[-60px] opacity-80"
                            style={{ top: `${Math.floor(timerInfinite / 500) % 2 ? list[Math.floor((timerInfinite / 100)) % 5] : list[5 - Math.floor((timerInfinite / 100)) % 5]}px` }}
                        >
                        </div> */}
            <CountdownBar className="" />
            <div
              className={`w-full absolute border-t-4 border-dashed after:w-3 after:h-3 lg:after:w-5 lg:after:h-5 after:bg-[#fff] after:absolute after:-right-2 after:rotate-45 after:-top-2 xl:after:-top-3 lg:before:w-5 lg:before:h-5 before:w-3 before:h-3 before:bg-[#fff] before:absolute before:-left-2 before:rotate-45 before:-top-2 xl:before:-top-3 opacity-20`}
              style={{ top: `0` }}
            >
              {/* style={{ top: `${Math.floor(timerInfinite / 500) % 2 ? timerInfinite % 500 : 500 - (timerInfinite % 500)}px` }}> */}
            </div>
            <div className="w-full h-full rounded-xl relative z-10 pointer-events-none">
              <p className="text-white text-[18px] font-bold text-center pt-[90px]">
                WAITING FOR USERS...
              </p>
            </div>
          </div>
        )}
        <Waitboard />
      </div>
      <Sound
        url="/sound/success.mp3"
        playStatus={isWonSound ? "PLAYING" : "STOPPED"}
      />
    </>
  );
}
