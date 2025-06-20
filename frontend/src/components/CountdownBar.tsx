/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext";
import Sound from "react-sound";

export default function CountdownBar(props: { className?: string }) {
    const { className } = props;
    const { gameData, setStated } = useSocket();
    const [isBetSound, setIsBetSound] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState<any>(
        calculateTimeRemaining()
    );

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTimeRemaining(calculateTimeRemaining());
        }, 1000);
        return () => clearInterval(intervalId);
    }, [gameData]);

    useEffect(() => {
        if (gameData) {
            if (Math.floor((gameData?.endTimestamp - new Date().getTime()) / 1000) === 0) {
                if (setStated) {
                    setStated(true);
                    setIsBetSound(true);
                    setTimeout(() => {
                        setIsBetSound(false);
                    }, 1500);
                }
            }
        }
    }, [timeRemaining])

    function calculateTimeRemaining() {
        if (gameData?.endTimestamp && gameData?.endTimestamp >= new Date().getTime()) {
            return (
                <div
                    className="absolute bg-[#4c49cc] h-2 rounded-3xl"
                    style={{ width: `${(60000 - (gameData?.endTimestamp - new Date().getTime())) / 1000 / 60 * 100}%` }}
                >
                    <Sound
                        url="/sound/game-start.mp3"
                        playStatus={isBetSound ? "PLAYING" : "STOPPED"}
                    />
                </div>
            )
        }
    }

    return (
        <div className={`${className ? className : ""} w-[calc(100%-60px)] mx-[30px] mt-[150px] absolute text-center`}>
            <p className="text-white font-semibold ">Countdown</p>
            <div className="absolute w-full bg-[#050d36] h-2 rounded-3xl mt-4">
                {timeRemaining}
                {/* {gameData && (gameData.endTimestamp <= 0 || gameData.endTimestamp < new Date().getTime()) &&
                    <div className="absolute bg-blue-600 h-2 rounded-3xl"></div>
                } */}
            </div>
        </div>
    )
}