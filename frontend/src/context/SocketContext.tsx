/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useState, useEffect, useContext } from "react";
import io, { Socket } from "socket.io-client";
import getConfig from "next/config";
import { ChatType, ClientToServerEvents, Player, ServerToClientEvents } from "../utils/type";
import { API_URL, SOCKET_URL } from "../config";

const { publicRuntimeConfig } = getConfig();
export type SocketType = Socket<ServerToClientEvents, ClientToServerEvents>;

interface Context {
    socket?: SocketType;
    gameData?: {
        players: Player[],
        pda: string,
        endTimestamp: number,
        gameStarted: boolean
    };
    gameEnded?: boolean,
    winner?: {
        winner: string,
        resultHeight: number
    },
    resultHeight?: number,
    getFirstGameData?: Function,
    setClearGame?: Function,
    started?: boolean,
    setStated?: Function,
    messages?: ChatType[],
    onlined?: number,
}

const context = createContext<Context>({});

export const useSocket = () => useContext(context);

const SocketProvider = (props: { children: any }) => {
    const [socket, setSocket] = useState<SocketType>();
    const [started, setStated] = useState(false);
    const [messages, setMessages] = useState<ChatType[]>();
    const [onlined, setOnlined] = useState(0);

    const [gameData, setGameData] = useState<{
        players: Player[],
        endTimestamp: number,
        pda: string,
        gameStarted: boolean
    }>();

    const [gameEnded, setGameEnded] = useState(false);
    const [winner, setWinner] = useState({
        winner: "",
        resultHeight: 0
    });
    const [resultHeight, setResultHeight] = useState(0);

    const setClearGame = () => {
        setGameData({
            players: [],
            endTimestamp: 0,
            pda: "",
            gameStarted: false
        }
        )
    }

    const getFirstGameData = async () => {
        try {
            const response = await fetch(`${API_URL}getRecentGame`);
            const data = await response.json();
            if (data?.players) {
                setGameData({
                    players: data.players,
                    endTimestamp: data.endTimestamp,
                    pda: data.pda,
                    gameStarted: true
                })
            }
        } catch (error) {
            console.log(error);
        }
    }

    const getFirstMessages = async () => {
        try {
            const response = await fetch(`${API_URL}getMessage`);
            const data = await response.json();
            if (data) {
                setMessages(data)
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        const socket = io(SOCKET_URL, {
            transports: ["websocket"],
        });
        socket.on("connect", async () => {
            console.log("connected to backend", socket.id);
            await getFirstGameData();
            await getFirstMessages();
        });
        socket.on("disconnect", () => {
            console.log("disconnected from backend", socket.id);
        });
        setSocket(socket);
        return () => {
            gameData
            socket.off("connect");
            socket.off("disconnect");
            setSocket(undefined);
        };
    }, []);


    useEffect(() => {
        socket?.on("endTimeUpdated", async (pda, last_ts, players) => {
            setGameData({
                pda: pda,
                endTimestamp: last_ts,
                players: players,
                gameStarted: true
            })
        });

        socket?.on("connectionUpdated", async (counter) => {
            setOnlined(counter);
        });

        socket?.on("startGame", async (pda, endTimestamp, players) => {
            setGameData({
                pda: pda,
                endTimestamp,
                players,
                gameStarted: true
            })
            setWinner({
                winner: "",
                resultHeight: 0
            });
            setResultHeight(0);
        });

        socket?.on("gameEnded", async (winner) => {
            setWinner(winner);
            setGameEnded(true)
        });

        socket?.on("chatUpdated", async ([...msgs]: ChatType[]) => {
            setMessages(msgs)
        });

        return () => {
            socket?.off("connectionUpdated");
            socket?.off("startGame");
            socket?.off("endTimeUpdated")
            socket?.off("chatUpdated")
            socket?.off("gameEnded")
        }

    }, [socket])

    return (
        <context.Provider value={{
            socket,
            gameData,
            gameEnded,
            winner,
            resultHeight,
            setClearGame,
            getFirstGameData,
            started,
            setStated,
            messages,
            onlined
        }}>{props.children}</context.Provider>
    );
};

export default SocketProvider;
